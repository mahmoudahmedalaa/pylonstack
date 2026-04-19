import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { streamAIRecommendation } from '@/lib/ai/ai-client';
import { buildPromptFingerprint, isCacheValid } from '@/lib/cache/prompt-cache';

import type { WizardAnswers } from '@/stores/wizard-store';

export const maxDuration = 60; // Allow 60 seconds for AI Generation

/**
 * POST /api/questionnaire
 *
 * Uses Supabase admin client (REST API) instead of direct Postgres/Drizzle
 * to bypass broken Supavisor pooler connection.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WizardAnswers;

    // Validate and heavily sanitize fields against Prompt Injection / Context Window blowouts
    if (!body.projectName || !body.projectName.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    const safeProjectName = body.projectName.substring(0, 100);

    if (!body.description || !body.description.trim()) {
      return NextResponse.json({ error: 'App description is required' }, { status: 400 });
    }
    const safeDescription = body.description.substring(0, 3000);

    if (!body.projectType) {
      return NextResponse.json({ error: 'projectType is required' }, { status: 400 });
    }
    if (!body.teamSize) {
      return NextResponse.json({ error: 'teamSize is required' }, { status: 400 });
    }
    if (!body.requirements || body.requirements.length === 0) {
      return NextResponse.json({ error: 'At least one requirement is needed' }, { status: 400 });
    }
    if (!body.priorities || body.priorities.length === 0) {
      return NextResponse.json({ error: 'At least one priority is needed' }, { status: 400 });
    }

    // ── ENV diagnostics (logged server-side only) ──
    console.log('[questionnaire] Using Supabase REST API (pooler bypass)');

    // Authenticate user via Supabase session
    let user;
    try {
      const supabase = await createClient();
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('[questionnaire] Auth error:', authError.message, authError.status);
        return NextResponse.json(
          { error: `Auth failed: ${authError.message}` },
          { status: authError.status || 401 },
        );
      }

      if (!data.user) {
        return NextResponse.json(
          { error: 'Not authenticated — no user in session' },
          { status: 401 },
        );
      }

      user = data.user;
    } catch (authCrash) {
      const msg = authCrash instanceof Error ? authCrash.message : String(authCrash);
      console.error('[questionnaire] Auth CRASHED:', msg);
      return NextResponse.json({ error: `Auth system error: ${msg}` }, { status: 500 });
    }

    const userId = user.id;

    // Fetch profile with DB error isolation
    let profile;
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = "not found" which is OK (no profile yet)
        throw new Error(error.message);
      }
      profile = data;
    } catch (dbError) {
      const msg = dbError instanceof Error ? dbError.message : String(dbError);
      console.error('[questionnaire] DB query FAILED:', msg);
      return NextResponse.json({ error: `Database connection error: ${msg}` }, { status: 500 });
    }

    const tier = profile?.subscription_tier || 'free';
    const isSuperUser =
      process.env.NEXT_PUBLIC_SUPERUSER_EMAIL &&
      user.email === process.env.NEXT_PUBLIC_SUPERUSER_EMAIL;
    const isDev = process.env.NODE_ENV === 'development';
    const canUseAI = tier === 'pro' || tier === 'team' || isSuperUser || isDev;

    if (!canUseAI) {
      return NextResponse.json(
        {
          error: 'AI architectural recommendations require a Pro or Team subscription.',
          upgrade_required: true,
          current_tier: tier,
        },
        { status: 403 },
      );
    }

    // ── Rate Limiting: Prevent AI cost blowouts (max 10 generations per hour per user) ──
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentGenerations } = await supabaseAdmin
      .from('ai_recommendations')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo);

    if ((recentGenerations?.length ?? 0) >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: Maximum 10 generations per hour. Please try again later.' },
        { status: 429 },
      );
    }

    // 1. Create the project
    const projectName =
      body.projectName ||
      `${body.projectType?.replace(/_/g, ' ')} project`.replace(/\b\w/g, (c) => c.toUpperCase());

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        name: safeProjectName || projectName,
        project_type: body.projectType,
        description: `Generated via Stack Wizard. Team: ${body.teamSize}, Priorities: ${body.priorities.join(', ')}`,
      })
      .select('id')
      .single();

    if (projectError || !project) {
      console.error('[questionnaire] Project creation failed:', projectError?.message);
      return NextResponse.json(
        { error: `Failed to create project: ${projectError?.message}` },
        { status: 500 },
      );
    }

    try {
      // 2. Save questionnaire responses
      const { error: qrError } = await supabaseAdmin.from('questionnaire_responses').insert({
        project_id: project.id,
        user_id: userId,
        responses: body as unknown as Record<string, unknown>,
        completed: true,
      });

      if (qrError) throw new Error(`Questionnaire save failed: ${qrError.message}`);

      // 2.5 Check Semantic Cache
      const fingerprint = buildPromptFingerprint(body);
      const { data: cachedRecs } = await supabaseAdmin
        .from('ai_recommendations')
        .select('*')
        .eq('prompt_hash', fingerprint)
        .order('created_at', { ascending: false })
        .limit(1);

      const cachedRec = cachedRecs?.[0];

      if (
        cachedRec &&
        (cachedRec.raw_response as Record<string, unknown>)?.validationPassed === true &&
        isCacheValid(new Date(cachedRec.created_at))
      ) {
        console.log('[Prompt Cache] 🟢 HIT! Reusing recommendation ID:', cachedRec.id);

        const raw = cachedRec.raw_response as Record<string, unknown>;
        const cachedRecommendations = raw.recommendations || [];

        // Duplicate the row for this user project
        const { data: newRec, error: dupError } = await supabaseAdmin
          .from('ai_recommendations')
          .insert({
            project_id: project.id,
            user_id: userId,
            model_used: cachedRec.model_used,
            prompt_hash: cachedRec.prompt_hash,
            generation_time_ms: cachedRec.generation_time_ms,
            raw_response: {
              ...raw,
              servedFromCache: true,
              originalRecommendationId: cachedRec.id,
            },
            recommendations: cachedRec.recommendations,
          })
          .select('id')
          .single();

        if (dupError) throw new Error(`Cache dup failed: ${dupError.message}`);

        return NextResponse.json({
          projectId: project.id,
          recommendationId: newRec!.id,
          recommendations: cachedRecommendations,
          phases: raw.phases,
          summary: raw.summary,
          estimatedMonthlyCost: raw.estimatedMonthlyCost,
          source: raw.source,
          correctionAttempts: raw.correctionAttempts ?? 0,
          servedFromCache: true,
        });
      }

      // 3. Create Placeholder AI Recommendation
      const safeBody = {
        ...body,
        description: safeDescription,
        projectName: safeProjectName || projectName,
      };

      const { data: recommendation, error: recError } = await supabaseAdmin
        .from('ai_recommendations')
        .insert({
          project_id: project.id,
          user_id: userId,
          model_used: 'gemini-2.5-flash',
          prompt_hash: Buffer.from(JSON.stringify(safeBody)).toString('base64').slice(0, 64),
          raw_response: { status: 'generating' },
          recommendations: [],
        })
        .select('id')
        .single();

      if (recError) throw new Error(`Recommendation placeholder save failed: ${recError.message}`);

      // 4. Get AI recommendation (Streaming or Fallback)
      const aiStartMs = Date.now();
      const streamRes = await streamAIRecommendation(safeBody, async ({ object }) => {
        const generationTimeMs = Date.now() - aiStartMs;
        const obj = (object || {}) as {
          summary?: string;
          estimatedMonthlyCost?: number;
          phases?: unknown[];
          recommendations?: unknown[];
        };

        const mappedRecommendations = ((obj.recommendations || []) as unknown[]).map(
          (r: unknown) => {
            const rec = (r || {}) as {
              categoryName?: string;
              toolName?: string;
              confidence?: number;
              reasoning?: string;
              alternatives?: string[];
            };
            return {
              category_slug: (rec.categoryName || 'uncategorized')
                .toLowerCase()
                .replace(/\s+/g, '-'),
              tool_slug: (rec.toolName || 'unknown-tool').toLowerCase().replace(/\s+/g, '-'),
              confidence: rec.confidence || 80,
              reasoning: rec.reasoning || 'Recommended by AI',
              alternative_slug: (rec.alternatives?.[0] || 'none')
                .toLowerCase()
                .replace(/\s+/g, '-'),
            };
          },
        );

        const mappedPhases = (obj.phases || []).map((p: unknown) => {
          const phase = (p || {}) as Record<string, unknown>;
          return { ...phase, tools: (phase.tools as unknown[]) || [] };
        });

        // 5. Asynchronously update placeholder on finish
        after(async () => {
          try {
            await supabaseAdmin
              .from('ai_recommendations')
              .update({
                generation_time_ms: generationTimeMs,
                raw_response: {
                  inputContext: safeBody,
                  summary: obj.summary || 'Generation still incomplete...',
                  estimatedMonthlyCost: obj.estimatedMonthlyCost || 0,
                  phases: mappedPhases,
                  recommendations: mappedRecommendations,
                  source: 'gemini',
                  correctionAttempts: 0,
                  validationPassed: true,
                  generationTimeMs,
                  qualityGrade: null,
                  adminNotes: null,
                } as Record<string, unknown>,
                recommendations: mappedRecommendations,
              })
              .eq('id', recommendation.id);
          } catch (err) {
            console.error('[after hook] bg DB update failed:', err);
          }
        });
      });

      if (streamRes.type === 'fallback') {
        const aiResult = streamRes.data;
        const generationTimeMs = Date.now() - aiStartMs;

        // Update placeholder with fallback right away
        await supabaseAdmin
          .from('ai_recommendations')
          .update({
            generation_time_ms: generationTimeMs,
            raw_response: {
              inputContext: safeBody,
              summary: aiResult.summary,
              estimatedMonthlyCost: aiResult.estimatedMonthlyCost,
              phases: aiResult.phases,
              recommendations: aiResult.recommendations,
              source: aiResult.source,
              correctionAttempts: aiResult.correctionAttempts ?? 0,
              validationPassed: (aiResult.correctionAttempts ?? 0) < 3,
              validationWarnings: aiResult.validationWarnings ?? [],
              generationTimeMs,
              qualityGrade: null,
              adminNotes: null,
            } as Record<string, unknown>,
            recommendations: (aiResult.recommendations || []).map((r) => ({
              category_slug: (r.categoryName || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
              tool_slug: (r.toolName || 'unknown-tool').toLowerCase().replace(/\s+/g, '-'),
              confidence: r.confidence || 80,
              reasoning: r.reasoning || 'Recommended by AI',
              alternative_slug: (r.alternatives?.[0] || 'none').toLowerCase().replace(/\s+/g, '-'),
            })),
          })
          .eq('id', recommendation.id);

        return NextResponse.json({
          projectId: project.id,
          recommendationId: recommendation.id,
          recommendations: aiResult.recommendations,
          phases: aiResult.phases,
          summary: aiResult.summary,
          estimatedMonthlyCost: aiResult.estimatedMonthlyCost,
          source: aiResult.source,
          correctionAttempts: aiResult.correctionAttempts ?? 0,
          servedFromCache: false,
        });
      }

      // Return Stream!
      return streamRes.result.toTextStreamResponse({
        headers: {
          'x-recommendation-id': recommendation.id,
          'x-project-id': project.id,
        },
      });
    } catch (innerError) {
      // Rollback orphaned project
      console.error('[POST /api/questionnaire] Rolling back orphaned project:', project.id);
      await supabaseAdmin.from('projects').delete().eq('id', project.id);
      throw innerError; // Surface out to the main API catch block
    }
  } catch (error) {
    console.error('[POST /api/questionnaire] Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
