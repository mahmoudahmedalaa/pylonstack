/**
 * Database seed script
 * Populates categories + tools from the static catalog.
 * Idempotent — safe to re-run (uses upsert on conflict).
 *
 * Usage:  pnpm db:seed
 * Run as: npx tsx src/lib/db/seed.ts
 */

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import { categories } from './schema/categories';
import { tools } from './schema/tools';
import { TOOLS, CATEGORIES } from '../../data/tools-catalog';

/* ─── DB connection (standalone, not the app singleton) ─── */

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Check your .env.local');
  process.exit(1);
}

const client = postgres(DATABASE_URL, { prepare: false, max: 1 });
const db = drizzle(client);

/* ─── Helpers ─── */

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Map the catalog's free-text "pricing" field to the DB pricing_model enum.
 */
function toPricingModel(
  pricing: string,
): 'free' | 'freemium' | 'paid' | 'open_source' | 'self_hosted' {
  const p = pricing.toLowerCase();
  if (p === 'free' || p === 'oss') return 'free';
  if (p.includes('open source') || p.includes('open-source') || p === 'oss') return 'open_source';
  if (p.includes('self-hosted') || p.includes('self hosted')) return 'self_hosted';
  if (p.includes('free tier') || p.includes('freemium') || p.includes('free plan'))
    return 'freemium';
  if (p.includes('paid') || p.includes('from $') || p.includes('starts at')) return 'paid';
  // Default: if it mentions "free" anywhere, treat as freemium
  if (p.includes('free')) return 'freemium';
  return 'paid';
}

function hasFreeTier(pricing: string): boolean {
  const p = pricing.toLowerCase();
  return (
    p === 'free' ||
    p.includes('free tier') ||
    p.includes('free plan') ||
    p.includes('freemium') ||
    p === 'oss' ||
    p.includes('open source')
  );
}

/* ─── Seed Categories ─── */

async function seedCategories(): Promise<Map<string, string>> {
  console.log('📂 Seeding categories…');

  // Skip 'All' — it's a UI filter, not a real category
  const realCategories = CATEGORIES.filter((c) => c !== 'All');

  const categoryMap = new Map<string, string>();

  for (let i = 0; i < realCategories.length; i++) {
    const name = realCategories[i];
    const slug = slugify(name);

    const [row] = await db
      .insert(categories)
      .values({
        name,
        slug,
        displayOrder: i,
        description: `Tools in the ${name} category`,
      })
      .onConflictDoUpdate({
        target: categories.name,
        set: { slug, displayOrder: i },
      })
      .returning({ id: categories.id });

    categoryMap.set(name, row.id);
  }

  console.log(`  ✅ ${categoryMap.size} categories seeded`);
  return categoryMap;
}

/* ─── Seed Tools ─── */

async function seedTools(categoryMap: Map<string, string>) {
  console.log('🔧 Seeding tools…');

  let inserted = 0;
  let skipped = 0;

  for (const tool of TOOLS) {
    const categoryId = categoryMap.get(tool.category);
    if (!categoryId) {
      console.warn(`  ⚠️  Skipping "${tool.name}" — unknown category "${tool.category}"`);
      skipped++;
      continue;
    }

    await db
      .insert(tools)
      .values({
        categoryId,
        name: tool.name,
        slug: tool.slug,
        tagline: tool.description.slice(0, 500),
        description: tool.description,
        logoUrl: tool.logo,
        websiteUrl: tool.website,
        githubStars: tool.stars ?? 0,
        hasFreeTier: hasFreeTier(tool.pricing),
        pricingModel: toPricingModel(tool.pricing),
        keyFeatures: tool.tags,
        isActive: true,
        metadata: { catalogId: tool.id, pricing: tool.pricing },
      })
      .onConflictDoUpdate({
        target: tools.slug,
        set: {
          name: sql`excluded.name`,
          categoryId: sql`excluded.category_id`,
          tagline: sql`excluded.tagline`,
          description: sql`excluded.description`,
          logoUrl: sql`excluded.logo_url`,
          websiteUrl: sql`excluded.website_url`,
          githubStars: sql`excluded.github_stars`,
          hasFreeTier: sql`excluded.has_free_tier`,
          pricingModel: sql`excluded.pricing_model`,
          keyFeatures: sql`excluded.key_features`,
          metadata: sql`excluded.metadata`,
          updatedAt: sql`now()`,
        },
      });

    inserted++;
  }

  console.log(`  ✅ ${inserted} tools seeded (${skipped} skipped)`);
}

/* ─── Main ─── */

async function main() {
  console.log('🌱 Starting database seed…\n');

  const categoryMap = await seedCategories();
  await seedTools(categoryMap);

  console.log('\n✅ Seed complete!');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
