import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: lastRow } = await supabase
    .from('ai_recommendations')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!lastRow) {
    console.log('No rows');
    return;
  }

  console.log('Testing update on ID:', lastRow.id);

  const mappedRecommendations = [
    {
      category_slug: 'frontend-framework',
      tool_slug: 'nextjs',
      confidence: 100,
      reasoning: 'Test reason',
      alternative_slug: 'remix',
    },
  ];

  /* EXACT STRUCTURE FROM onFinish */
  const { error } = await supabase
    .from('ai_recommendations')
    .update({
      generation_time_ms: 5000,
      raw_response: {
        inputContext: {},
        summary: 'Test summary',
        estimatedMonthlyCost: 0,
        phases: [],
        recommendations: mappedRecommendations,
        source: 'gemini',
        correctionAttempts: 0,
        validationPassed: true,
        generationTimeMs: 5000,
        qualityGrade: null,
        adminNotes: null,
      },
      recommendations: mappedRecommendations,
    })
    .eq('id', lastRow.id);

  if (error) {
    console.error('SUPABASE DB UPDATE ERROR:', error);
    process.exit(1);
  }

  const { data: verifyRow } = await supabase
    .from('ai_recommendations')
    .select('recommendations, raw_response')
    .eq('id', lastRow.id)
    .single();

  console.log(
    'Successfully updated DB! Row looks like:',
    JSON.stringify(verifyRow?.recommendations),
  );
}
check();
