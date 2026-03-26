import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
  projects,
  projectTools,
  tools as toolsTable,
  categories as categoriesTable,
} from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

interface ToolPayload {
  toolId?: string;
  toolSlug?: string;
  categoryId?: string;
  categorySlug?: string;
  monthlyCost?: string;
  position?: number;
  notes?: string;
  aiRecommended?: boolean;
  aiConfidence?: string;
}

/**
 * PUT /api/projects/:id/tools
 * Bulk replace all project tools — delete existing, insert new.
 * Resolves toolSlug and categorySlug to UUIDs if provided.
 * Requires authentication and project ownership.
 * Body: { tools: ToolPayload[] }
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    // Authenticate
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project ownership
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();

    if (!Array.isArray(body.tools)) {
      return NextResponse.json({ error: 'tools must be an array' }, { status: 400 });
    }

    // Resolve slugs to IDs if necessary
    const toolSlugsToFetch = body.tools
      .filter((t: ToolPayload) => !t.toolId && t.toolSlug)
      .map((t: ToolPayload) => t.toolSlug) as string[];
    const categorySlugsToFetch = body.tools
      .filter((t: ToolPayload) => !t.categoryId && t.categorySlug)
      .map((t: ToolPayload) => t.categorySlug?.toLowerCase().replace(/\s+/g, '-')) as string[];

    let dbTools: { id: string; slug: string }[] = [];
    if (toolSlugsToFetch.length > 0) {
      dbTools = await db
        .select({ id: toolsTable.id, slug: toolsTable.slug })
        .from(toolsTable)
        .where(inArray(toolsTable.slug, toolSlugsToFetch));
    }

    let dbCategories: { id: string; slug: string }[] = [];
    if (categorySlugsToFetch.length > 0) {
      dbCategories = await db
        .select({ id: categoriesTable.id, slug: categoriesTable.slug })
        .from(categoriesTable)
        .where(inArray(categoriesTable.slug, categorySlugsToFetch));
    }

    const resolvedTools = body.tools.map((t: ToolPayload, idx: number) => {
      let finalToolId = t.toolId;
      if (!finalToolId && t.toolSlug) {
        finalToolId = dbTools.find((dt) => dt.slug === t.toolSlug)?.id;
      }

      let finalCategoryId = t.categoryId;
      if (!finalCategoryId && t.categorySlug) {
        const slugFormatted = t.categorySlug.toLowerCase().replace(/\s+/g, '-');
        finalCategoryId = dbCategories.find((dc) => dc.slug === slugFormatted)?.id;
      }

      if (!finalToolId || !finalCategoryId) {
        throw new Error(
          `Could not resolve IDs for tool. ToolSlug: ${t.toolSlug}, CategorySlug: ${t.categorySlug}`,
        );
      }

      return {
        projectId,
        toolId: finalToolId,
        categoryId: finalCategoryId,
        monthlyCost: t.monthlyCost || '0',
        position: t.position ?? idx,
        notes: t.notes || null,
        aiRecommended: t.aiRecommended ?? false,
        aiConfidence: t.aiConfidence || null,
      };
    });

    // Transaction: delete existing, insert new
    await db.transaction(async (tx) => {
      await tx.delete(projectTools).where(eq(projectTools.projectId, projectId));

      if (resolvedTools.length > 0) {
        await tx.insert(projectTools).values(resolvedTools);
      }
    });

    return NextResponse.json({ success: true, count: resolvedTools.length });
  } catch (error) {
    console.error('[PUT /api/projects/[id]/tools] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to save project tools',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
