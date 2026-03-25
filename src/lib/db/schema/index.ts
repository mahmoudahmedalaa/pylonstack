import { relations } from 'drizzle-orm';
import { categories } from './categories';
import { tools, toolPricingTiers } from './tools';
import { projects } from './projects';
import { projectTools } from './project-tools';
import { questionnaireResponses } from './questionnaire';
import { aiRecommendations } from './recommendations';

// --- Schema re-exports ---
export { profiles, subscriptionTierEnum } from './profiles';
export type { Profile, NewProfile } from './profiles';

export { categories } from './categories';
export type { Category, NewCategory } from './categories';

export {
  tools,
  toolPricingTiers,
  pricingModelEnum,
  learningCurveEnum,
  maturityEnum,
} from './tools';
export type { Tool, NewTool, ToolPricingTier, NewToolPricingTier } from './tools';

export { projects } from './projects';
export type { Project, NewProject } from './projects';

export { projectTools } from './project-tools';
export type { ProjectTool, NewProjectTool } from './project-tools';

export { questionnaireResponses } from './questionnaire';
export type { QuestionnaireResponse, NewQuestionnaireResponse } from './questionnaire';

export { aiRecommendations } from './recommendations';
export type { AiRecommendation, NewAiRecommendation } from './recommendations';

// --- Relations ---
export const categoriesRelations = relations(categories, ({ many }) => ({
  tools: many(tools),
}));

export const toolsRelations = relations(tools, ({ one, many }) => ({
  category: one(categories, {
    fields: [tools.categoryId],
    references: [categories.id],
  }),
  pricingTiers: many(toolPricingTiers),
  projectTools: many(projectTools),
}));

export const toolPricingTiersRelations = relations(toolPricingTiers, ({ one }) => ({
  tool: one(tools, {
    fields: [toolPricingTiers.toolId],
    references: [tools.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectTools: many(projectTools),
  questionnaireResponse: one(questionnaireResponses, {
    fields: [projects.id],
    references: [questionnaireResponses.projectId],
  }),
  aiRecommendation: one(aiRecommendations, {
    fields: [projects.id],
    references: [aiRecommendations.projectId],
  }),
}));

export const projectToolsRelations = relations(projectTools, ({ one }) => ({
  project: one(projects, {
    fields: [projectTools.projectId],
    references: [projects.id],
  }),
  tool: one(tools, {
    fields: [projectTools.toolId],
    references: [tools.id],
  }),
  category: one(categories, {
    fields: [projectTools.categoryId],
    references: [categories.id],
  }),
  selectedTier: one(toolPricingTiers, {
    fields: [projectTools.selectedTierId],
    references: [toolPricingTiers.id],
  }),
}));

export const questionnaireResponsesRelations = relations(questionnaireResponses, ({ one }) => ({
  project: one(projects, {
    fields: [questionnaireResponses.projectId],
    references: [projects.id],
  }),
}));

export const aiRecommendationsRelations = relations(aiRecommendations, ({ one }) => ({
  project: one(projects, {
    fields: [aiRecommendations.projectId],
    references: [projects.id],
  }),
}));
