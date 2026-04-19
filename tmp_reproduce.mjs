async function run() {
  console.log('Starting fetch...');
  const res = await fetch('http://localhost:3000/api/questionnaire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'Test Reproduction',
      description: 'A fast marketplace app',
      projectType: 'web_app',
      teamSize: 'solo',
      requirements: ['payments', 'auth'],
      priorities: ['speed', 'cost'],
      preferences: [],
      analytics: [],
    }),
  });

  console.log('Status:', res.status);

  if (!res.ok) {
    console.log('Error:', await res.text());
    return;
  }

  const projId = res.headers.get('x-project-id');
  const recId = res.headers.get('x-recommendation-id');
  console.log('Project ID:', projId);
  console.log('Recommendation ID:', recId);

  // Consume stream
  console.log('Draining stream...');
  for await (const chunk of res.body) {
    // Keep it alive
    process.stdout.write('.');
  }
  console.log('\\nStream done.');
}

run().catch(console.error);
