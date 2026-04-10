import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing supabase URL or anon key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const timestamp = Date.now();
  const email = `testuser_${timestamp}@example.com`;
  const password = 'TestPassword123!';
  const fullName = `Test User ${timestamp}`;

  console.log(`\n1. Attempting to sign up user: ${email}...`);
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (authError) {
    console.error("❌ Sign up failed:");
    console.error(authError);
    return;
  }

  const userId = authData?.user?.id;
  if (!userId) {
    console.error("❌ No user ID returned from sign up");
    return;
  }
  
  console.log(`✅ Successfully created auth user (ID: ${userId})`);
  
  console.log(`\n2. Verifying public.profiles trigger fired...`);
  
  // Wait a brief moment for the trigger to execute
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.error("❌ Could not fetch profile. Trigger may have failed.");
    console.error(profileError);
    return;
  }
  
  if (!profileData) {
    console.error("❌ Profile not found in public.profiles table");
    return;
  }
  
  console.log(`✅ Profile successfully created!`);
  console.log(`   Display Name: ${profileData.display_name}`);
  console.log(`   Subscription: ${profileData.subscription_tier}`);
  
  if (profileData.display_name === fullName) {
    console.log(`✅ Display name mapped correctly from metadata`);
  } else {
    console.error(`❌ Display name mismatch! Expected: ${fullName}, Got: ${profileData.display_name}`);
  }
}

testAuth()
  .catch(console.error)
  .finally(() => process.exit(0));
