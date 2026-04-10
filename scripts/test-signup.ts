import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import 'dotenv/config';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const dbUrl = process.env.DATABASE_URL!;

  if (!supabaseUrl || !supabaseKey || !dbUrl) {
    console.error('Missing environment variables. Make sure .env.local is loaded or pass them.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const sql = postgres(dbUrl);

  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  console.log('1. Testing User Registration...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test Setup User'
      }
    }
  });

  if (authError) {
    console.error('Registration failed:', authError.message);
    process.exit(1);
  }

  console.log('User registered successfully:', authData.user?.id);

  // Wait a second for trigger to run
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('2. Verifying Profile creation trigger...');
  const profiles = await sql`SELECT * FROM profiles WHERE id = ${authData.user?.id ?? null}`;

  if (profiles.length > 0) {
    console.log('✅ Trigger fired! Profile found:', profiles[0]);
  } else {
    console.error('❌ Trigger failed! No profile found for user:', authData.user?.id);
    process.exit(1);
  }

  // Cleanup testing user and profile to keep db clean
  console.log('3. Cleaning up test user...');
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const adminSupabase = createClient(supabaseUrl, adminKey);
  const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(authData.user!.id);

  if (deleteError) {
    console.error('Failed to cleanup user:', deleteError.message);
  } else {
    // Also cleanup profiles
    await sql`DELETE FROM profiles WHERE id = ${authData.user?.id ?? null}`;
    console.log('✅ Test user cleaned up.');
  }

  await sql.end();
}

main().catch(console.error);
