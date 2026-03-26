import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/projects
 * List all projects for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(desc(projects.createdAt));

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('[GET /api/projects] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Create a new project for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        projectType: body.projectType || null,
        status: body.status || 'draft',
        stackData: body.stackData || null,
        totalMonthlyCost: body.totalMonthlyCost || '0',
      })
      .returning();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects] Error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
