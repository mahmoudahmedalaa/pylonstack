import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * GET /api/admin/generations
 *
 * Returns paginated list of all AI generations with flywheel metadata.
 * Protected: only the service-role user (admin) can access this.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin check: only the seeded admin email can access this
    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const offset = (page - 1) * limit;

    const {
      data: rows,
      count,
      error,
    } = await supabaseAdmin
      .from('ai_recommendations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Map back to camelCase for the frontend component
    const mappedRows = (rows || []).map((row: Record<string, unknown>) => ({
      ...row,
      projectId: row.project_id,
      userId: row.user_id,
      modelUsed: row.model_used,
      promptHash: row.prompt_hash,
      rawResponse: row.raw_response,
      generationTimeMs: row.generation_time_ms,
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      data: mappedRows,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/generations]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
