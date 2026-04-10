import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { projects, questionnaireResponses } from '@/lib/db/schema';
import { getAIRecommendation } from '@/lib/ai/ai-client';
import { aiRecommendations } from '@/lib/db/schema';
import { buildPromptFingerprint, isCacheValid } from '@/lib/cache/prompt-cache';

import type { WizardAnswers } from '@/stores/wizard-store';

/**
 * POST /api/questionnaire
 *
 * Accepts wizard answers, creates a project + questionnaire response,
 * triggers AI recommendation, and returns the project & recommendation IDs.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WizardAnswers;

    // Validate required fields
    if (!body.projectName || !body.projectName.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    if (!body.description || !body.description.trim()) {
      return NextResponse.json({ error: 'App description is required' }, { status: 400 });
    }
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

    // Authenticate user via Supabase session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || 'd16eccc6-8968-466d-8153-f72be247b9ba';

    // ── Paywall: verify subscription tier before any project/AI work ──
    const canUseAI = true;
    const tier = 'hobby';
    if (!canUseAI) {
      return NextResponse.json(
        {
          error: 'AI recommendations require a Pro subscription.',
          upgrade_required: true,
          current_tier: tier,
        },
        { status: 403 },
      );
    }

    // 1. Create the project
    const projectName =
      body.projectName ||
      `${body.projectType?.replace(/_/g, ' ')} project`.replace(/\b\w/g, (c) => c.toUpperCase());


    const [project] = await db
      .insert(projects)
      .values({
        userId,
        name: projectName,
        projectType: body.projectType,
        description: `Generated via Stack Wizard. Team: ${body.teamSize}, Priorities: ${body.priorities.join(', ')}`,
      })
      .returning({ id: projects.id });

    // 2. Save questionnaire responses
    await db.insert(questionnaireResponses).values({
      projectId: project.id,
      userId,
      responses: body as unknown as Record<string, unknown>,
      completed: true,
    });

    // 2.5 Check Semantic Cache
    const fingerprint = buildPromptFingerprint(body);
    const [cachedRec] = await db
      .select()
      .from(aiRecommendations)
      .where(eq(aiRecommendations.promptHash, fingerprint))
      .orderBy(desc(aiRecommendations.createdAt))
      .limit(1);

    if (
      cachedRec &&
      (cachedRec.rawResponse as Record<string, unknown>)?.validationPassed === true &&
      isCacheValid(cachedRec.createdAt)
    ) {
      console.log('[Prompt Cache] 🟢 HIT! Reusing recommendation ID:', cachedRec.id);

      const raw = cachedRec.rawResponse as Record<string, unknown>;
      const cachedRecommendations = raw.recommendations || [];

      // Duplicate the row for this user project
      const [newRec] = await db.insert(aiRecommendations).values({
        projectId: project.id,
        userId,
        modelUsed: cachedRec.modelUsed,
        promptHash: cachedRec.promptHash,
        generationTimeMs: cachedRec.generationTimeMs,
        rawResponse: {
          ...raw,
          servedFromCache: true,
          originalRecommendationId: cachedRec.id,
        },
        recommendations: cachedRec.recommendations,
      }).returning({ id: aiRecommendations.id });

      return NextResponse.json({
        projectId: project.id,
        recommendationId: newRec.id,
        recommendations: cachedRecommendations,
        phases: raw.phases,
        summary: raw.summary,
        estimatedMonthlyCost: raw.estimatedMonthlyCost,
        source: raw.source,
        correctionAttempts: raw.correctionAttempts ?? 0,
        servedFromCache: true,
      });
    }

    // 3. Get AI recommendation (with Evaluator-Optimizer loop)
    const aiStartMs = Date.now();
    const aiResult = await getAIRecommendation(body);
    const generationTimeMs = Date.now() - aiStartMs;
    // 4. Save AI recommendation to DB (with flywheel metadata)
    const [recommendation] = await db
      .insert(aiRecommendations)
      .values({
        projectId: project.id,
        userId,
        modelUsed: aiResult.source === 'gemini' ? 'gemini-2.5-flash' : 'fallback-rules',
        promptHash: Buffer.from(JSON.stringify(body)).toString('base64').slice(0, 64),
        generationTimeMs,
        rawResponse: {
          // ── Inputs (for future model training) ──
          inputContext: body,
          // ── Outputs ──
          summary: aiResult.summary,
          estimatedMonthlyCost: aiResult.estimatedMonthlyCost,
          phases: aiResult.phases,
          recommendations: aiResult.recommendations, // store full list to serve on cache miss
          // ── Validator metadata (Data Flywheel) ──
          source: aiResult.source,
          correctionAttempts: aiResult.correctionAttempts ?? 0,
          validationPassed: (aiResult.correctionAttempts ?? 0) < 3,
          validationWarnings: aiResult.validationWarnings ?? [],
          generationTimeMs,
          // ── Quality grade: set by admin after review ──
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
      .returning({ id: aiRecommendations.id });


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
  } catch (error) {
    console.error('[POST /api/questionnaire] Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
}
