import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tools, categories } from '@/lib/db/schema';
import { eq, ilike, or, and, sql, count } from 'drizzle-orm';

/**
 * GET /api/tools
 *
 * Query params:
 *   q         — search by name/description/tags (case-insensitive)
 *   category  — filter by category slug
 *   pricing   — filter by pricing model (free|freemium|paid|open_source|self_hosted)
 *   page      — page number (default: 1)
 *   limit     — items per page (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q')?.trim() || '';
    const categorySlug = searchParams.get('category')?.trim() || '';
    const pricing = searchParams.get('pricing')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions = [eq(tools.isActive, true)];

    // Search filter
    if (q) {
      const searchPattern = `%${q}%`;
      conditions.push(
        or(
          ilike(tools.name, searchPattern),
          ilike(tools.description, searchPattern),
          ilike(tools.tagline, searchPattern),
          sql`${tools.keyFeatures}::text ILIKE ${searchPattern}`,
        )!,
      );
    }

    // Category filter
    if (categorySlug) {
      const [cat] = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1);

      if (cat) {
        conditions.push(eq(tools.categoryId, cat.id));
      }
    }

    // Pricing filter
    if (pricing && ['free', 'freemium', 'paid', 'open_source', 'self_hosted'].includes(pricing)) {
      conditions.push(
        eq(
          tools.pricingModel,
          pricing as 'free' | 'freemium' | 'paid' | 'open_source' | 'self_hosted',
        ),
      );
    }

    const whereClause = and(...conditions);

    // Run count + data queries in parallel
    const [countResult, data] = await Promise.all([
      db.select({ total: count() }).from(tools).where(whereClause),
      db
        .select({
          id: tools.id,
          name: tools.name,
          slug: tools.slug,
          tagline: tools.tagline,
          description: tools.description,
          logoUrl: tools.logoUrl,
          websiteUrl: tools.websiteUrl,
          githubStars: tools.githubStars,
          hasFreeTier: tools.hasFreeTier,
          pricingModel: tools.pricingModel,
          keyFeatures: tools.keyFeatures,
          learningCurve: tools.learningCurve,
          maturity: tools.maturity,
          categoryId: tools.categoryId,
          metadata: tools.metadata,
        })
        .from(tools)
        .where(whereClause)
        .orderBy(tools.name)
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.total ?? 0;

    // Enrich with category name
    const categoryIds = [...new Set(data.map((t) => t.categoryId))];
    const categoryRows =
      categoryIds.length > 0
        ? await db
            .select({ id: categories.id, name: categories.name, slug: categories.slug })
            .from(categories)
            .where(sql`${categories.id} IN ${categoryIds}`)
        : [];

    const categoryMap = new Map(categoryRows.map((c) => [c.id, c]));

    const enriched = data.map((t) => {
      const cat = categoryMap.get(t.categoryId);
      return {
        ...t,
        category: cat?.name ?? 'Unknown',
        categorySlug: cat?.slug ?? '',
      };
    });

    return NextResponse.json({
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/tools] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
