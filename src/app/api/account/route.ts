import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * DELETE /api/account
 *
 * Permanently deletes the authenticated user's account:
 *  1. Delete all projects (cascades to project_tools, questionnaires, recommendations)
 *  2. Delete the profile row
 *  3. Delete the auth.users entry via Supabase Admin API
 */
export async function DELETE() {
  try {
    // 1. Authenticate the user via their session cookie
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // 2. Delete all projects owned by this user
    //    This cascade-deletes: project_tools, questionnaire_responses, ai_recommendations
    await supabaseAdmin.from('projects').delete().eq('user_id', userId);

    // 3. Delete the profile row
    await supabaseAdmin.from('profiles').delete().eq('id', userId);

    // 4. Delete the auth.users entry via admin API
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error('[DELETE /api/account] Failed to delete auth user:', deleteAuthError.message);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('[DELETE /api/account] Error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
