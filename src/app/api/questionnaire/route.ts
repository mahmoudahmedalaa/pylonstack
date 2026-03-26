import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, questionnaireResponses } from '@/lib/db/schema';
import { getAIRecommendation } from '@/lib/ai/ai-client';
import { aiRecommendations } from '@/lib/db/schema';
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

    // Placeholder userId — will be replaced with real auth later
    const userId = '00000000-0000-0000-0000-000000000000';

    // 1. Create the project
    const projectName = `${body.projectType?.replace(/_/g, ' ')} project`.replace(/\b\w/g, (c) =>
      c.toUpperCase(),
    );

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

    // 3. Get AI recommendation
    const aiResult = await getAIRecommendation(body);

    // 4. Save AI recommendation to DB
    const [recommendation] = await db
      .insert(aiRecommendations)
      .values({
        projectId: project.id,
        userId,
        modelUsed: aiResult.source === 'gemini' ? 'gemini-2.5-flash-lite' : 'fallback-rules',
        promptHash: Buffer.from(JSON.stringify(body)).toString('base64').slice(0, 64),
        rawResponse: {
          inputContext: body,
          summary: aiResult.summary,
          estimatedMonthlyCost: aiResult.estimatedMonthlyCost,
        } as Record<string, unknown>,
        recommendations: aiResult.recommendations.map((r) => ({
          category_slug: r.categoryName.toLowerCase().replace(/\s+/g, '-'),
          tool_slug: r.toolName.toLowerCase().replace(/\s+/g, '-'),
          confidence: r.confidence,
          reasoning: r.reasoning,
          alternative_slug: r.alternatives[0]?.toLowerCase().replace(/\s+/g, '-'),
        })),
      })
      .returning({ id: aiRecommendations.id });

    return NextResponse.json({
      projectId: project.id,
      recommendationId: recommendation.id,
      recommendations: aiResult.recommendations,
      summary: aiResult.summary,
      estimatedMonthlyCost: aiResult.estimatedMonthlyCost,
      source: aiResult.source,
    });
  } catch (error) {
    console.error('[POST /api/questionnaire] Error:', error);
    return NextResponse.json({ error: 'Failed to process questionnaire' }, { status: 500 });
  }
}
