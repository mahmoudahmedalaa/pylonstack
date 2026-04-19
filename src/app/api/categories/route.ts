import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * GET /api/categories
 * Returns all categories with their tool counts.
 */
export async function GET() {
  try {
    // Note: To get the toolCount per category via Supabase REST without Drizzle `groupBy`:
    // It's fastest to fetch categories and then do a subquery on tools count,
    // or fetch categories and then count manually if the list isn't massive.
    // Supposing there's ~20-50 categories, we can fetch all Active tools grouped by category_id.

    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (catError) throw catError;

    // Fetch tool counts
    const { data: toolsCount, error: toolErr } = await supabaseAdmin
      .from('tools')
      .select('category_id', { count: 'exact' })
      .eq('is_active', true);

    if (toolErr) throw toolErr;

    // Count up
    const countsMap = new Map<string, number>();
    toolsCount?.forEach((t: Record<string, unknown>) => {
      const catId = t.category_id as string;
      countsMap.set(catId, (countsMap.get(catId) || 0) + 1);
    });

    let totalTools = 0;
    const rows = (categories || []).map((c: Record<string, unknown>) => {
      const cid = c.id as string;
      const tc = countsMap.get(cid) || 0;
      totalTools += tc;
      return {
        id: cid,
        name: c.name as string,
        slug: c.slug as string,
        displayOrder: c.display_order as number,
        icon: c.icon as string | null,
        description: c.description as string | null,
        toolCount: tc,
      };
    });

    return NextResponse.json({
      data: [
        {
          id: 'all',
          name: 'All',
          slug: 'all',
          displayOrder: -1,
          icon: null,
          description: 'All tools',
          toolCount: totalTools,
        },
        ...rows,
      ],
    });
  } catch (error) {
    console.error('[GET /api/categories] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
