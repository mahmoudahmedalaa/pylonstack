import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

async function main() {
  const { data, error } = await supabase
    .from('ai_recommendations')
    .select('*')
    .eq('id', '21838e8d-7626-4496-b826-a1dad2ab3b3d')
    .single();

  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }

  if (!data) {
    console.log('Not found.');
    process.exit(0);
  }

  console.log('DB RAW RESPONSE:', JSON.stringify(data.raw_response, null, 2));
  console.log('\nDB DB-MAPPED RECS:', JSON.stringify(data.recommendations, null, 2));
  process.exit(0);
}

main().catch(console.error);
