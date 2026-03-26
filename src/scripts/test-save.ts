async function testSave() {
  console.log('Creating project...');
  const res = await fetch('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Project',
      description: 'Test',
      stackData: [],
    }),
  });
  const data = await res.json();
  console.log('POST /api/projects Response:', res.status, data);

  if (data.id) {
    console.log('Saving tools...');
    const res2 = await fetch(`http://localhost:3000/api/projects/${data.id}/tools`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tools: [
          {
            toolSlug: 'react',
            categorySlug: 'frontend',
            position: 0,
          },
        ],
      }),
    });
    const data2 = await res2.json();
    console.log('PUT /api/projects/:id/tools Response:', res2.status, data2);
  }
}

testSave().catch(console.error);
