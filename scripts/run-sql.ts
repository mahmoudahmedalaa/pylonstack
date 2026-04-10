import fs from 'fs';
import postgres from 'postgres';
import path from 'path';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sqlFile = path.join(process.cwd(), 'supabase-setup.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  console.log('Connecting to database...');
  const sql = postgres(connectionString);

  try {
    console.log('Executing SQL setup script...');
    await sql.unsafe(sqlContent);
    console.log('Successfully applied RLS and triggers.');
  } catch (error) {
    console.error('Error applying SQL:', error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
