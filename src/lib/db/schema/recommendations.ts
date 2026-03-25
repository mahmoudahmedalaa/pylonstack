import { pgTable, uuid, varchar, jsonb, integer, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const aiRecommendations = pgTable('ai_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .references(() => projects.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  userId: uuid('user_id').notNull(), // FK → auth.users(id) — enforced by RLS
  modelUsed: varchar('model_used', { length: 100 }).notNull(),
  promptHash: varchar('prompt_hash', { length: 64 }),
  rawResponse: jsonb('raw_response').notNull().$type<Record<string, unknown>>(),
  recommendations: jsonb('recommendations').notNull().$type<
    Array<{
      category_slug: string;
      tool_slug: string;
      confidence: number;
      reasoning: string;
      alternative_slug?: string;
    }>
  >(),
  generationTimeMs: integer('generation_time_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type NewAiRecommendation = typeof aiRecommendations.$inferInsert;
