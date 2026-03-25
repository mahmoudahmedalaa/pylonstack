import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { profileUpdateSchema } from '@/lib/validations/profile';

/**
 * GET /api/profile — Fetch the authenticated user's profile
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    display_name: user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    preferences: user.user_metadata?.preferences ?? {},
    created_at: user.created_at,
  });
}

/**
 * PATCH /api/profile — Update display_name, avatar_url, or preferences
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // Merge into user_metadata
  const updatedMetadata: Record<string, unknown> = {};
  if (parsed.data.display_name !== undefined) {
    updatedMetadata.display_name = parsed.data.display_name;
  }
  if (parsed.data.avatar_url !== undefined) {
    updatedMetadata.avatar_url = parsed.data.avatar_url;
  }
  if (parsed.data.preferences !== undefined) {
    updatedMetadata.preferences = {
      ...(user.user_metadata?.preferences ?? {}),
      ...parsed.data.preferences,
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: updatedMetadata,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    display_name:
      data.user.user_metadata?.display_name ?? data.user.user_metadata?.full_name ?? null,
    avatar_url: data.user.user_metadata?.avatar_url ?? null,
    preferences: data.user.user_metadata?.preferences ?? {},
  });
}
