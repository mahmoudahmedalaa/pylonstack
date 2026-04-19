import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

    const { data: t, error } = await supabaseAdmin
      .from('tools')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .single();

    if (error || !t) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const { data: pricingTiers } = await supabaseAdmin
      .from('tool_pricing_tiers')
      .select('*')
      .eq('tool_id', t.id);

    // Transform columns back to camelCase to avoid breaking frontend
    const tool = {
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
      category: t.categories?.name ?? 'Unknown',
      categorySlug: t.categories?.slug ?? '',
      pricingTiers: (pricingTiers || []).map((pt: Record<string, unknown>) => ({
        id: pt.id,
        toolId: pt.tool_id,
        tierName: pt.tier_name,
        priceMonthly: pt.price_monthly,
        priceAnnually: pt.price_annually,
        features: pt.features,
      })),
    };

    return NextResponse.json(tool);
  } catch (error) {
    console.error('[GET /api/tools/[slug]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 });
  }
}
