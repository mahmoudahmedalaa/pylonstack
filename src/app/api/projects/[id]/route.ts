import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { projects, projectTools, tools, categories, aiRecommendations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Helper: authenticate and verify project ownership
 */
async function authenticateAndGetProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
    .limit(1);

  if (!project) {
    return { error: NextResponse.json({ error: 'Project not found' }, { status: 404 }) };
  }

  return { user, project };
}

/**
 * GET /api/projects/:id
 * Returns a project with its tools and AI recommendation
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await authenticateAndGetProject(id);

    if ('error' in auth) return auth.error;

    const { project } = auth;

    // Fetch project tools + AI recommendation in parallel
    const [toolRows, recommendationRows] = await Promise.all([
      db
        .select({
          id: projectTools.id,
          toolId: projectTools.toolId,
          categoryId: projectTools.categoryId,
          toolName: tools.name,
          toolSlug: tools.slug,
          toolLogo: tools.logoUrl,
          categoryName: categories.name,
          notes: projectTools.notes,
        })
        .from(projectTools)
        .innerJoin(tools, eq(projectTools.toolId, tools.id))
        .leftJoin(categories, eq(projectTools.categoryId, categories.id))
        .where(eq(projectTools.projectId, id)),
      db.select().from(aiRecommendations).where(eq(aiRecommendations.projectId, id)).limit(1),
    ]);

    return NextResponse.json({
      ...project,
      tools: toolRows,
      aiRecommendation: recommendationRows[0] ?? null,
    });
  } catch (error) {
    console.error('[GET /api/projects/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

/**
 * PATCH /api/projects/:id
 * Update project name/description (ownership verified)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await authenticateAndGetProject(id);

    if ('error' in auth) return auth.error;

    const body = await request.json();

    const [updated] = await db
      .update(projects)
      .set({
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.stackData !== undefined && { stackData: body.stackData }),
        ...(body.totalMonthlyCost !== undefined && { totalMonthlyCost: body.totalMonthlyCost }),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/projects/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/:id
 * Hard delete a project (cascades to project_tools, questionnaire, recommendation)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const auth = await authenticateAndGetProject(id);

    if ('error' in auth) return auth.error;

    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DELETE /api/projects/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
