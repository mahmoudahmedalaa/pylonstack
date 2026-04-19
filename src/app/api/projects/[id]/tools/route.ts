import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    // Authenticate
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();

    if (!Array.isArray(body.tools)) {
      return NextResponse.json({ error: 'tools must be an array' }, { status: 400 });
    }

    // Since we don't have this flow fully active UI-wise, if tools are zero simply delete
    const len = body.tools.length;
    await supabaseAdmin.from('project_tools').delete().eq('project_id', projectId);

    if (len > 0) {
      // Simple loop resolution (not the most performant but acceptable given VibeCoding context where tools < 15)
      const resolvedTools = [];
      for (let i = 0; i < len; i++) {
        const t = body.tools[i];
        let toolId = t.toolId;
        if (!toolId && t.toolSlug) {
          const { data } = await supabaseAdmin
            .from('tools')
            .select('id')
            .eq('slug', t.toolSlug)
            .single();
          toolId = data?.id;
        }

        let catId = t.categoryId;
        if (!catId && t.categorySlug) {
          const slug = t.categorySlug.toLowerCase().replace(/\s+/g, '-');
          const { data } = await supabaseAdmin
            .from('categories')
            .select('id')
            .eq('slug', slug)
            .single();
          catId = data?.id;
        }

        if (toolId && catId) {
          resolvedTools.push({
            project_id: projectId,
            tool_id: toolId,
            category_id: catId,
            monthly_cost: t.monthlyCost || '0',
            position: t.position ?? i,
            notes: t.notes || null,
            ai_recommended: t.aiRecommended ?? false,
            ai_confidence: t.aiConfidence || null,
          });
        }
      }

      if (resolvedTools.length > 0) {
        await supabaseAdmin.from('project_tools').insert(resolvedTools);
      }
    }

    return NextResponse.json({ success: true, count: body.tools.length });
  } catch (error) {
    console.error('[PUT /api/projects/[id]/tools] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save project tools',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
