import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  jsonb,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { categories } from './categories';

export const pricingModelEnum = pgEnum('pricing_model', [
  'free',
  'freemium',
  'paid',
  'open_source',
  'self_hosted',
]);

export const learningCurveEnum = pgEnum('learning_curve', ['easy', 'moderate', 'steep']);

export const maturityEnum = pgEnum('maturity', ['emerging', 'growing', 'established', 'legacy']);

export const tools = pgTable(
  'tools',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    tagline: varchar('tagline', { length: 500 }),
    description: text('description'),
    logoUrl: text('logo_url'),
    websiteUrl: text('website_url'),
    docsUrl: text('docs_url'),
    githubUrl: text('github_url'),
    githubStars: integer('github_stars').default(0),
    hasFreeTier: boolean('has_free_tier').default(false),
    pricingModel: pricingModelEnum('pricing_model').notNull(),
    startingPriceMonthly: decimal('starting_price_monthly', { precision: 10, scale: 2 }),
    keyFeatures: jsonb('key_features').default([]).$type<string[]>(),
    pros: jsonb('pros').default([]).$type<string[]>(),
    cons: jsonb('cons').default([]).$type<string[]>(),
    bestFor: text('best_for'),
    learningCurve: learningCurveEnum('learning_curve'),
    maturity: maturityEnum('maturity'),
    isActive: boolean('is_active').default(true),
    metadata: jsonb('metadata').default({}).$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_tools_slug').on(table.slug),
    index('idx_tools_category').on(table.categoryId),
    index('idx_tools_active_category').on(table.isActive, table.categoryId),
  ],
);

export const toolPricingTiers = pgTable(
  'tool_pricing_tiers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    toolId: uuid('tool_id')
      .references(() => tools.id, { onDelete: 'cascade' })
      .notNull(),
    tierName: varchar('tier_name', { length: 100 }).notNull(),
    priceMonthly: decimal('price_monthly', { precision: 10, scale: 2 }),
    priceYearly: decimal('price_yearly', { precision: 10, scale: 2 }),
    features: jsonb('features').default([]).$type<string[]>(),
    limits: jsonb('limits').default({}).$type<Record<string, unknown>>(),
    isFree: boolean('is_free').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_pricing_tool').on(table.toolId)],
);

export type Tool = typeof tools.$inferSelect;
export type NewTool = typeof tools.$inferInsert;
export type ToolPricingTier = typeof toolPricingTiers.$inferSelect;
export type NewToolPricingTier = typeof toolPricingTiers.$inferInsert;
