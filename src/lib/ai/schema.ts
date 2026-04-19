import { z } from 'zod';

export const ToolRecommendationSchema = z.object({
  categoryName: z
    .string()
    .describe('Category like Frontend Framework, Backend, Database, Hosting, etc.'),
  toolName: z.string().describe('Specific tool name'),
  confidence: z.number().min(0).max(100).describe('Confidence score 0-100'),
  reasoning: z
    .string()
    .describe('1-2 sentences explaining why, referencing exact requirements and priorities'),
  alternatives: z.array(z.string()).describe('Array of at least 2 alternative tool names'),
});

export const PhaseToolSchema = z.object({
  toolName: z.string(),
  reason: z.string().describe('Quick bespoke reason why it is introduced in this phase').optional(),
  tier: z.string().describe('Name of the pricing tier (e.g., Free, Pro, Enterprise)'),
  monthlyCost: z
    .number()
    .describe(
      'Estimated reliable baseline numeric monthly cost for this phase based on typical expected usage volume. Cannot be 0 for usage-based tools in Growth/Scale.',
    ),
  pricingModel: z.enum(['Flat', 'Usage-Based', 'Per-Seat', 'Percentage']).optional(),
});

export const ProjectPhaseSchema = z.object({
  name: z.string().describe('Phase name, e.g., Phase 1 - MVP'),
  description: z.string().describe('1-2 sentences about the focus of this phase'),
  tools: z.array(PhaseToolSchema),
  estimatedMonthlyCost: z.number().describe('Arithmetic sum of tool costs in this phase'),
  estimatedImplementationTimeDays: z.number(),
});

export const AIRecommendationSchema = z.object({
  summary: z
    .string()
    .describe(
      'A 2-3 sentence executive summary of the recommended stack. Explicitly mention the cost scaling. Example: Starting at $X/mo for the MVP, scaling up to ~$Y/mo in Growth.',
    ),
  estimatedMonthlyCost: z.number().describe('TOTAL COMBINED sum of all Phase 2 (Growth) costs'),
  phases: z
    .array(ProjectPhaseSchema)
    .length(3)
    .describe('MUST be exactly 3 phases: Phase 1 (MVP), Phase 2 (Growth), Phase 3 (Scale)'),
  recommendations: z.array(ToolRecommendationSchema).describe('The recommended core tools'),
});

export type AIRecommendationParsed = z.infer<typeof AIRecommendationSchema>;
