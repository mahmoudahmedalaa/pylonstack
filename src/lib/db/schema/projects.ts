import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(), // FK → auth.users(id) — enforced by RLS
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    projectType: varchar('project_type', { length: 50 }),
    totalMonthlyCost: decimal('total_monthly_cost', { precision: 10, scale: 2 }).default('0'),
    isPublic: boolean('is_public').default(false),
    shareSlug: varchar('share_slug', { length: 100 }).unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_projects_user').on(table.userId)],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
