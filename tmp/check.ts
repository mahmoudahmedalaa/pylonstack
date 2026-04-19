import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function query() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from('ai_recommendations')
    .select('id, recommendations, raw_response, created_at')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching:', error);
    process.exit(1);
  }

  console.log('DATA:', JSON.stringify(data?.[0], null, 2));
}

query();
