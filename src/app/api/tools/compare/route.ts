import { NextRequest, NextResponse } from 'next/server';
import { TOOLS } from '@/data/tools-catalog';

/**
 * GET /api/tools/compare?slugs=supabase,neon,planetscale
 *
 * Returns 2-3 tools with full structured data for comparison overlay.
 * Validates slug count (2-3) and returns 400 for invalid requests.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slugsParam = searchParams.get('slugs')?.trim();

    if (!slugsParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: slugs' },
        { status: 400 },
      );
    }

    const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);

    if (slugs.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 tools required for comparison' },
        { status: 400 },
      );
    }

    if (slugs.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 tools for comparison' },
        { status: 400 },
      );
    }

    // Look up tools by slug from static catalog
    const foundTools = slugs.map((slug) => {
      const tool = TOOLS.find((t) => t.slug === slug);
      if (!tool) return null;
      return {
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        logo: tool.logo,
        category: tool.category,
        description: tool.description,
        pricing: tool.pricing,
        pricingDetails: tool.pricingDetails ?? null,
        stars: tool.stars ?? null,
        website: tool.website,
        tags: tool.tags,
      };
    });

    // Check for missing tools
    const missing = slugs.filter((_, i) => foundTools[i] === null);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Tools not found: ${missing.join(', ')}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: foundTools });
  } catch (error) {
    console.error('[GET /api/tools/compare] Error:', error);
    return NextResponse.json(
      { error: 'Failed to compare tools' },
      { status: 500 },
    );
  }
}
