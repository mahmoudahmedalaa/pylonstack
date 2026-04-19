import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase admin client using the service_role key.
 * Bypasses RLS — use ONLY in server-side API routes.
 * Uses the REST API (PostgREST) so it does NOT need the Supavisor pooler.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
