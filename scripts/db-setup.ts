/**
 * Pylon — Database Setup Script
 * Creates:
 *   1. handle_new_user trigger (auto-creates profile on signup)
 *   2. RLS policies on all public tables
 *
 * Run with: npx tsx scripts/db-setup.ts
 */
import postgres from 'postgres';
import 'dotenv/config';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const sql = postgres(DATABASE_URL);

async function main() {
  console.log('🔧 Pylon DB Setup — Starting...\n');

  // ─── 1. Profile Auto-Create Trigger ───────────────────────────
  console.log('1️⃣  Creating handle_new_user function + trigger...');

  await sql.unsafe(`
    -- Drop if exists (idempotent)
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    DROP FUNCTION IF EXISTS public.handle_new_user();

    -- Function: create profiles row on signup
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
    BEGIN
      INSERT INTO public.profiles (id, display_name, avatar_url, subscription_tier)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL),
        'free'
      );
      RETURN NEW;
    END;
    $$;

    -- Trigger: fire after insert on auth.users
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  `);
  console.log('   ✅ handle_new_user trigger created\n');

  // ─── 2. Enable RLS on all public tables ────────────────────────
  console.log('2️⃣  Enabling RLS on all public tables...');

  const tables = [
    'profiles',
    'categories',
    'tools',
    'tool_pricing_tiers',
    'projects',
    'project_tools',
    'questionnaire_responses',
    'ai_recommendations',
  ];

  for (const table of tables) {
    await sql.unsafe(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
    console.log(`   ✅ RLS enabled on ${table}`);
  }

  // ─── 3. RLS Policies ──────────────────────────────────────────
  console.log('\n3️⃣  Creating RLS policies...\n');

  // --- Public read-only tables (categories, tools, tool_pricing_tiers) ---
  const publicReadTables = ['categories', 'tools', 'tool_pricing_tiers'];
  for (const table of publicReadTables) {
    await sql.unsafe(`DROP POLICY IF EXISTS "${table}_public_read" ON public.${table};`);
    await sql.unsafe(`
      CREATE POLICY "${table}_public_read" ON public.${table}
        FOR SELECT
        USING (true);
    `);
    console.log(`   ✅ ${table}: public read`);
  }

  // --- profiles: user can only see/edit their own row ---
  await sql.unsafe(`DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;`);

  await sql.unsafe(`
    CREATE POLICY "profiles_select_own" ON public.profiles
      FOR SELECT
      USING (auth.uid() = id);
  `);
  await sql.unsafe(`
    CREATE POLICY "profiles_update_own" ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  `);
  await sql.unsafe(`
    CREATE POLICY "profiles_insert_own" ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  `);
  console.log('   ✅ profiles: select/update/insert own');

  // --- projects: user CRUD on own rows ---
  await sql.unsafe(`DROP POLICY IF EXISTS "projects_select_own" ON public.projects;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "projects_update_own" ON public.projects;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;`);

  await sql.unsafe(`
    CREATE POLICY "projects_select_own" ON public.projects
      FOR SELECT USING (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "projects_insert_own" ON public.projects
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "projects_update_own" ON public.projects
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "projects_delete_own" ON public.projects
      FOR DELETE USING (auth.uid() = user_id);
  `);
  console.log('   ✅ projects: full CRUD own');

  // --- project_tools: access follows project ownership ---
  await sql.unsafe(`DROP POLICY IF EXISTS "project_tools_select" ON public.project_tools;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "project_tools_insert" ON public.project_tools;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "project_tools_update" ON public.project_tools;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "project_tools_delete" ON public.project_tools;`);

  await sql.unsafe(`
    CREATE POLICY "project_tools_select" ON public.project_tools
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid())
      );
  `);
  await sql.unsafe(`
    CREATE POLICY "project_tools_insert" ON public.project_tools
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid())
      );
  `);
  await sql.unsafe(`
    CREATE POLICY "project_tools_update" ON public.project_tools
      FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid())
      );
  `);
  await sql.unsafe(`
    CREATE POLICY "project_tools_delete" ON public.project_tools
      FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid())
      );
  `);
  console.log('   ✅ project_tools: CRUD via project ownership');

  // --- questionnaire_responses: user CRUD on own ---
  await sql.unsafe(
    `DROP POLICY IF EXISTS "questionnaire_select_own" ON public.questionnaire_responses;`,
  );
  await sql.unsafe(
    `DROP POLICY IF EXISTS "questionnaire_insert_own" ON public.questionnaire_responses;`,
  );
  await sql.unsafe(
    `DROP POLICY IF EXISTS "questionnaire_update_own" ON public.questionnaire_responses;`,
  );

  await sql.unsafe(`
    CREATE POLICY "questionnaire_select_own" ON public.questionnaire_responses
      FOR SELECT USING (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "questionnaire_insert_own" ON public.questionnaire_responses
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "questionnaire_update_own" ON public.questionnaire_responses
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  `);
  console.log('   ✅ questionnaire_responses: select/insert/update own');

  // --- ai_recommendations: user can read own ---
  await sql.unsafe(`DROP POLICY IF EXISTS "ai_recs_select_own" ON public.ai_recommendations;`);
  await sql.unsafe(`DROP POLICY IF EXISTS "ai_recs_insert_own" ON public.ai_recommendations;`);

  await sql.unsafe(`
    CREATE POLICY "ai_recs_select_own" ON public.ai_recommendations
      FOR SELECT USING (auth.uid() = user_id);
  `);
  await sql.unsafe(`
    CREATE POLICY "ai_recs_insert_own" ON public.ai_recommendations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  `);
  console.log('   ✅ ai_recommendations: select/insert own');

  console.log('\n🎉 All done! Database is ready.\n');
  await sql.end();
}

main().catch(async (err) => {
  console.error('❌ Error:', err);
  await sql.end();
  process.exit(1);
});
