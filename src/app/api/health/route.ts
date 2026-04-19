import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * GET /api/health
 * Quick diagnostic endpoint to verify env vars and connections.
 */
export async function GET() {
  const checks: Record<string, string> = {};

  // 1. Check env vars exist
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  checks.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ set' : '❌ MISSING';
  checks.ANON_KEY = anonKey ? `✅ set (starts with: ${anonKey.substring(0, 8)}…)` : '❌ MISSING';
  checks.DATABASE_URL = process.env.DATABASE_URL
    ? `✅ set (host: ${process.env.DATABASE_URL.match(/@([^:/]+)/)?.[1] || 'unknown'})`
    : '⚠️ not set (using REST API fallback)';
  checks.SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? '✅ set'
    : '⚠️ missing (optional)';
  checks.SUPERUSER_EMAIL = process.env.NEXT_PUBLIC_SUPERUSER_EMAIL || '⚠️ not set';

  // 2. Test Supabase auth
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      checks.AUTH_TEST = `❌ Error: ${error.message} (status: ${error.status})`;
    } else if (data.user) {
      checks.AUTH_TEST = `✅ User: ${data.user.email}`;
    } else {
      checks.AUTH_TEST = '⚠️ No user in session (not logged in)';
    }
  } catch (e) {
    checks.AUTH_TEST = `❌ CRASH: ${e instanceof Error ? e.message : String(e)}`;
  }

  // 3. Test DB connection via Supabase REST API (bypasses pooler)
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('id').limit(1);

    if (error) {
      checks.DB_TEST = `❌ REST API Error: ${error.message}`;
    } else {
      checks.DB_TEST = `✅ REST API Connected (found ${data.length} profile(s))`;
    }
  } catch (e) {
    checks.DB_TEST = `❌ CRASH: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks, { status: 200 });
}
