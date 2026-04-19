import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (error || !project) {
    return { error: NextResponse.json({ error: 'Project not found' }, { status: 404 }) };
  }

  return { user, project };
}

/**
 * GET /api/projects/:id
 * Returns a project with its AI recommendation
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await authenticateAndGetProject(id);

    if ('error' in auth) return auth.error;

    const { project } = auth;

    // Fetch AI recommendation
    const { data: recRows } = await supabaseAdmin
      .from('ai_recommendations')
      .select('*')
      .eq('project_id', id)
      .limit(1);

    // Fetch original user answers
    const { data: qaRows } = await supabaseAdmin
      .from('questionnaire_responses')
      .select('responses')
      .eq('project_id', id)
      .limit(1);

    return NextResponse.json({
      ...project,
      tools: [],
      aiRecommendation: recRows?.[0] ?? null,
      questionnaireResponses: qaRows?.[0]?.responses ?? null,
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

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name !== undefined) updatePayload.name = body.name.trim();
    if (body.description !== undefined)
      updatePayload.description = body.description?.trim() || null;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.stackData !== undefined) updatePayload.stack_data = body.stackData;
    if (body.totalMonthlyCost !== undefined)
      updatePayload.total_monthly_cost = body.totalMonthlyCost;

    const { data: updated, error } = await supabaseAdmin
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
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

    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DELETE /api/projects/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
