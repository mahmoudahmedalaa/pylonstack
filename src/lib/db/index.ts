import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// For query purposes (connection pooling)
const client = postgres(connectionString, {
  prepare: false, // Disable preflight for Supabase connection pooler compatibility
});

export const db = drizzle(client, { schema });
