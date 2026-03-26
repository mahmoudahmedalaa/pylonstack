import { db } from './src/lib/db';
import { tools } from './src/lib/db/schema';

async function main() {
  const result = await db.select({ slug: tools.slug, name: tools.name }).from(tools).execute();
  console.log('Total tools in DB:', result.length);
  const p = result.find((t) => t.slug === 'pinecone');
  console.log('Pinecone in DB:', p);
  const w = result.find((t) => t.slug === 'weaviate');
  console.log('Weaviate in DB:', w);
}
main()
  .catch(console.error)
  .finally(() => process.exit(0));
