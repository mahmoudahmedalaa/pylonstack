import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * PATCH /api/admin/generations/[id]/grade
 *
 * Allows admin to set a quality grade (1–5) and optional notes on a generation.
 * This is the core Data Flywheel annotation mechanism.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim());
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { qualityGrade, adminNotes } = body as { qualityGrade: number; adminNotes?: string };

    if (typeof qualityGrade !== 'number' || qualityGrade < 1 || qualityGrade > 5) {
      return NextResponse.json(
        { error: 'qualityGrade must be a number between 1 and 5' },
        { status: 400 },
      );
    }

    // Fetch current record
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('ai_recommendations')
      .select('raw_response')
      .eq('id', id)
      .single();

    if (existErr || !existing) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    // Merge grade into the JSONB rawResponse
    const updatedRaw = {
      ...(existing.raw_response as Record<string, unknown>),
      qualityGrade,
      adminNotes: adminNotes ?? null,
      gradedAt: new Date().toISOString(),
      gradedBy: user.email,
    };

    const { error: updateErr } = await supabaseAdmin
      .from('ai_recommendations')
      .update({ raw_response: updatedRaw })
      .eq('id', id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, id, qualityGrade });
  } catch (error) {
    console.error('[PATCH /api/admin/generations/[id]/grade]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
