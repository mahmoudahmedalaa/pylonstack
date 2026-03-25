import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, tools } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';

/**
 * GET /api/categories
 * Returns all categories with their tool counts.
 */
export async function GET() {
  try {
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        displayOrder: categories.displayOrder,
        icon: categories.icon,
        description: categories.description,
        toolCount: count(tools.id),
      })
      .from(categories)
      .leftJoin(tools, eq(tools.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.displayOrder);

    // Add an "All" meta-category at the top
    const totalTools = rows.reduce((sum, r) => sum + r.toolCount, 0);

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
