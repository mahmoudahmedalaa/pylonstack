import { db } from '../lib/db';
import { tools as toolsTable, categories as categoriesTable } from '../lib/db/schema';

async function checkDb() {
  const tools = await db.select().from(toolsTable);
  console.log(
    'TOOLS:',
    tools.map((t) => ({ slug: t.slug, category: t.categoryId })),
  );

  const categories = await db.select().from(categoriesTable);
  console.log(
    'CATEGORIES:',
    categories.map((c) => ({ id: c.id, slug: c.slug })),
  );
}

checkDb().catch(console.error);
