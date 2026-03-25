---
name: Drizzle ORM PostgreSQL
description: Best practices for Drizzle ORM with PostgreSQL — schema definition, migrations, queries, relations, and performance patterns. Compiled from official Drizzle docs and community best practices.
---

# Drizzle ORM PostgreSQL Best Practices

> Compiled from [Drizzle ORM official docs](https://orm.drizzle.team/docs/overview), [Drizzle Kit docs](https://orm.drizzle.team/drizzle-kit/overview), and verified community patterns.

---

## Schema Definition

### Table Creation
```typescript
import { pgTable, uuid, text, timestamp, boolean, integer, numeric, jsonb } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  subscriptionTier: text('subscription_tier').notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
```

### Key Rules
- Use `uuid` for primary keys with `defaultRandom()` (not serial/bigserial)
- Use `text` over `varchar` unless you need a length constraint
- Always include `created_at` and `updated_at` timestamps with timezone
- Use `numeric` for currency/money fields (never `float` or `real`)
- Use `jsonb` for flexible/unstructured data (not `json`)
- Use `boolean` for true/false (not integer 0/1)
- Column names in snake_case, TypeScript properties in camelCase

### Foreign Keys & Relations
```typescript
import { relations } from 'drizzle-orm'

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Define relations separately
export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(profiles, {
    fields: [projects.userId],
    references: [profiles.id],
  }),
  tools: many(projectTools),
}))

export const profilesRelations = relations(profiles, ({ many }) => ({
  projects: many(projects),
}))
```

### Indexes
```typescript
import { pgTable, uuid, text, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const tools = pgTable('tools', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
}, (table) => [
  index('tools_category_idx').on(table.categoryId),
  index('tools_name_search_idx').on(table.name),
  uniqueIndex('tools_slug_unique_idx').on(table.slug),
])
```

---

## Drizzle Kit (Migrations)

### Configuration
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/lib/db/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### Commands
- `drizzle-kit generate` — generate SQL migration files from schema changes
- `drizzle-kit push` — push schema directly to database (dev only)
- `drizzle-kit migrate` — run pending migrations
- `drizzle-kit studio` — open Drizzle Studio GUI

### Migration Workflow
1. Modify schema files in `src/lib/db/schema/`
2. Run `drizzle-kit generate` to create migration SQL
3. Review the generated SQL file
4. Run `drizzle-kit migrate` to apply
5. Never modify migration files after they've been applied

---

## Client Setup

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

// For queries (connection pooling)
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })
```

### Supabase Integration
When using Supabase, connect via the connection pooler URL:
```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

## Query Patterns

### Select with Filters
```typescript
import { eq, and, or, like, ilike, gt, lt, inArray, isNull, desc, asc, sql, count } from 'drizzle-orm'

// Basic select
const allTools = await db.select().from(tools)

// With filters
const frontendTools = await db.select()
  .from(tools)
  .where(eq(tools.categoryId, categoryId))
  .orderBy(asc(tools.name))
  .limit(20)
  .offset(0)

// Search with ilike
const results = await db.select()
  .from(tools)
  .where(ilike(tools.name, `%${searchQuery}%`))

// Count
const [{ total }] = await db.select({ total: count() })
  .from(tools)
  .where(eq(tools.categoryId, categoryId))
```

### Insert
```typescript
// Single insert (returns inserted row)
const [newProject] = await db.insert(projects)
  .values({
    userId: user.id,
    name: 'My Stack',
  })
  .returning()

// Batch insert
await db.insert(projectTools)
  .values(toolsToAdd.map(tool => ({
    projectId: project.id,
    toolId: tool.id,
    categorySlot: tool.category,
  })))
```

### Update
```typescript
const [updated] = await db.update(projects)
  .set({ name: 'New Name', updatedAt: new Date() })
  .where(and(
    eq(projects.id, projectId),
    eq(projects.userId, userId), // Always scope to user
  ))
  .returning()
```

### Delete
```typescript
await db.delete(projectTools)
  .where(and(
    eq(projectTools.projectId, projectId),
    eq(projectTools.toolId, toolId),
  ))
```

### Relational Queries
```typescript
// Use query API for relations (not select)
const projectWithTools = await db.query.projects.findFirst({
  where: eq(projects.id, projectId),
  with: {
    tools: {
      with: {
        tool: true,
      },
    },
    user: true,
  },
})
```

### Transactions
```typescript
const result = await db.transaction(async (tx) => {
  const [project] = await tx.insert(projects)
    .values({ userId, name })
    .returning()

  await tx.insert(projectTools)
    .values(tools.map(t => ({
      projectId: project.id,
      toolId: t.id,
    })))

  return project
})
```

---

## Performance Tips

1. **Always add indexes** for columns used in WHERE, ORDER BY, and JOIN
2. **Use `select()` with specific columns** for large tables — don't select everything
3. **Pre-compute counts** when possible — avoid COUNT(*) on large tables
4. **Use prepared statements** for frequently executed queries:
   ```typescript
   const getToolBySlug = db.select().from(tools).where(eq(tools.slug, sql.placeholder('slug'))).prepare('get_tool_by_slug')
   const tool = await getToolBySlug.execute({ slug: 'react' })
   ```
5. **Use connection pooling** (required for serverless/edge)
6. **Batch writes** — use multi-value inserts instead of loops

---

## Common Mistakes to Avoid

- ❌ Don't use `float` or `real` for money — use `numeric`
- ❌ Don't use `serial` for primary keys — use `uuid` with `defaultRandom()`
- ❌ Don't modify migration files after applying them
- ❌ Don't query in loops — use batched queries or `inArray()`
- ❌ Don't forget to scope queries to user ID (security)
- ❌ Don't use raw SQL when Drizzle has a built-in operator
- ❌ Don't skip the `returning()` on insert/update when you need the result

---
