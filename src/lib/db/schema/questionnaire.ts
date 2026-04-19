import { pgTable, uuid, jsonb, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const questionnaireResponses = pgTable(
  'questionnaire_responses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    userId: uuid('user_id').notNull(), // FK → auth.users(id) — enforced by RLS
    responses: jsonb('responses').notNull().$type<Record<string, unknown>>(),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_questionnaire_user').on(table.userId)],
);

export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;
export type NewQuestionnaireResponse = typeof questionnaireResponses.$inferInsert;
