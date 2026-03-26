import { db } from '../lib/db';
import { projectTools, tools as toolsTable, categories as categoriesTable } from '../lib/db/schema';

async function clear() {
  console.log('Deleting projectTools...');
  await db.delete(projectTools);
  console.log('Deleting tools...');
  await db.delete(toolsTable);
  console.log('Deleting categories...');
  await db.delete(categoriesTable);
  console.log('Done.');
}

clear().catch(console.error);
