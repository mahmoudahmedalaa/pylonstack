import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tools, categories, toolPricingTiers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/tools/:slug
 * Returns a single tool with its category and pricing tiers.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const [tool] = await db.select().from(tools).where(eq(tools.slug, slug)).limit(1);

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Fetch category + pricing tiers in parallel
    const [categoryRows, pricingRows] = await Promise.all([
      db
        .select({ name: categories.name, slug: categories.slug })
        .from(categories)
        .where(eq(categories.id, tool.categoryId))
        .limit(1),
      db.select().from(toolPricingTiers).where(eq(toolPricingTiers.toolId, tool.id)),
    ]);

    return NextResponse.json({
      ...tool,
      category: categoryRows[0]?.name ?? 'Unknown',
      categorySlug: categoryRows[0]?.slug ?? '',
      pricingTiers: pricingRows,
    });
  } catch (error) {
    console.error('[GET /api/tools/[slug]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 });
  }
}
