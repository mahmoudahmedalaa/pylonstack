import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

    // We build the query with Supabase REST client
    let query = supabaseAdmin
      .from('tools')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_active', true);

    if (q) {
      // Supabase search: ilike on name, description, tagline
      query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,tagline.ilike.%${q}%`);
    }

    if (pricing && ['free', 'freemium', 'paid', 'open_source', 'self_hosted'].includes(pricing)) {
      query = query.eq('pricing_model', pricing);
    }

    if (categorySlug) {
      // First resolve category slug to ID because Supabase REST filtering through related tables isn't direct
      const { data: cat } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const {
      data: rawData,
      count,
      error,
    } = await query.order('name', { ascending: true }).range(offset, offset + limit - 1);

    if (error) {
      console.error('[GET /api/tools] DB error:', error);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    const total = count ?? 0;

    // Transform back to camelCase to match the frontend expectations
    const data = (rawData || []).map((t: Record<string, unknown>) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      tagline: t.tagline,
      description: t.description,
      logoUrl: t.logo_url,
      websiteUrl: t.website_url,
      githubStars: t.github_stars,
      hasFreeTier: t.has_free_tier,
      pricingModel: t.pricing_model,
      keyFeatures: t.key_features,
      learningCurve: t.learning_curve,
      maturity: t.maturity,
      categoryId: t.category_id,
      metadata: t.metadata,
      category:
        (t as { categories?: { name?: string; slug?: string } }).categories?.name ?? 'Unknown',
      categorySlug: (t as { categories?: { name?: string; slug?: string } }).categories?.slug ?? '',
    }));

    return NextResponse.json({
      data,
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
