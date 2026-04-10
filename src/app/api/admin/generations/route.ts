import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { aiRecommendations } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

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

    const rows = await db
      .select()
      .from(aiRecommendations)
      .orderBy(desc(aiRecommendations.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiRecommendations);

    return NextResponse.json({
      data: rows,
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
