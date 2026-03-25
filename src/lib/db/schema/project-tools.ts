import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { tools } from './tools';
import { categories } from './categories';
import { toolPricingTiers } from './tools';

export const projectTools = pgTable(
  'project_tools',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    toolId: uuid('tool_id')
      .references(() => tools.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    selectedTierId: uuid('selected_tier_id').references(() => toolPricingTiers.id),
    monthlyCost: decimal('monthly_cost', { precision: 10, scale: 2 }).default('0'),
    position: integer('position').default(0),
    notes: text('notes'),
    aiRecommended: boolean('ai_recommended').default(false),
    aiConfidence: decimal('ai_confidence', { precision: 3, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_pt_project').on(table.projectId),
    unique('uq_project_category').on(table.projectId, table.categoryId),
  ],
);

export type ProjectTool = typeof projectTools.$inferSelect;
export type NewProjectTool = typeof projectTools.$inferInsert;
