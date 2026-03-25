import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Placeholder userId — will be replaced with real auth
const PLACEHOLDER_USER_ID = '00000000-0000-0000-0000-000000000000';

/**
 * GET /api/projects
 * List all projects for the current user
 */
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, PLACEHOLDER_USER_ID))
      .orderBy(desc(projects.createdAt));

    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('[GET /api/projects] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Create a new project manually (not via wizard)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId: PLACEHOLDER_USER_ID,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        projectType: body.projectType || null,
      })
      .returning();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects] Error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
