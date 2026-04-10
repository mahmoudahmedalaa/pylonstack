/**
 * Stack Validation Rules — Epic 1: Evaluator-Optimizer Loop
 *
 * These are deterministic, code-level rules that validate AI-generated stacks
 * before they ever reach the user. If validation fails, the system retries.
 *
 * Rules are intentionally strict to guarantee 0% hallucination on structural logic.
 */

import type { AIRecommendationResult, ToolRecommendation } from '@/lib/ai/ai-client';
import { TOOLS } from '@/data/tools-catalog';
import { TOOL_COMPATIBILITY_GRAPH } from '@/lib/validation/compatibility-graph';

// ── Types ──────────────────────────────────────────

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  correctionAttempt?: number;
}

export type StackValidationRule = {
  id: string;
  description: string;
  validate: (result: AIRecommendationResult) => { passed: boolean; error?: string };
};

// ── Helper ─────────────────────────────────────────

/** Returns the set of tool names present in the catalog (lowercase for fuzzy match) */
const catalogNames = new Set(TOOLS.map((t) => t.name.toLowerCase().trim()));

function isInCatalog(toolName: string): boolean {
  return catalogNames.has(toolName.toLowerCase().trim());
}

// ── Rules ──────────────────────────────────────────

export const VALIDATION_RULES: StackValidationRule[] = [
  // ── Rule 1: No hallucinated tools ──────────────────
  {
    id: 'NO_HALLUCINATED_TOOLS',
    description: 'Every recommended tool must exist in our catalog',
    validate: (result) => {
      const invented = result.recommendations.filter((r) => !isInCatalog(r.toolName));
      if (invented.length === 0) return { passed: true };
      return {
        passed: false,
        error: `Hallucinated tools not in catalog: ${invented.map((r) => r.toolName).join(', ')}. Use ONLY tools from the provided catalog.`,
      };
    },
  },

  // ── Rule 2: Must have at least 3 recommendations ──
  {
    id: 'MIN_RECOMMENDATIONS',
    description: 'Stack must contain at least 3 tool recommendations',
    validate: (result) => {
      if (result.recommendations.length >= 3) return { passed: true };
      return {
        passed: false,
        error: `Stack only has ${result.recommendations.length} recommendations. Must have at least 3 (Frontend, Backend, Database minimum).`,
      };
    },
  },

  // ── Rule 3: Exactly 3 phases ──────────────────────
  {
    id: 'EXACTLY_THREE_PHASES',
    description: 'Stack must have exactly 3 phases (MVP, Growth, Scale)',
    validate: (result) => {
      if (result.phases.length === 3) return { passed: true };
      return {
        passed: false,
        error: `Expected exactly 3 phases, got ${result.phases.length}. Must return Phase 1 (MVP), Phase 2 (Growth), Phase 3 (Scale).`,
      };
    },
  },

  // ── Rule 4: Non-empty alternatives ────────────────
  {
    id: 'NON_EMPTY_ALTERNATIVES',
    description: 'Every recommendation must have at least 2 alternatives',
    validate: (result) => {
      const missing = result.recommendations.filter(
        (r) => !Array.isArray(r.alternatives) || r.alternatives.length < 2
      );
      if (missing.length === 0) return { passed: true };
      return {
        passed: false,
        error: `These tools are missing alternatives: ${missing.map((r) => r.categoryName).join(', ')}. Each recommendation MUST have at least 2 real alternative tools.`,
      };
    },
  },

  // ── Rule 5: Cost arithmetic accuracy ──────────────
  {
    id: 'COST_ARITHMETIC',
    description: 'Phase cost totals must match sum of tool costs (±10%)',
    validate: (result) => {
      for (const phase of result.phases) {
        const sum = phase.tools.reduce((acc, t) => acc + (t.monthlyCost || 0), 0);
        const reported = phase.estimatedMonthlyCost || 0;
        const diff = Math.abs(sum - reported);
        const tolerance = Math.max(sum * 0.1, 5); // 10% tolerance or $5 floor
        if (diff > tolerance) {
          return {
            passed: false,
            error: `${phase.name}: reported cost $${reported}/mo does not match sum of tools $${sum}/mo. Recalculate phase costs as the exact arithmetic sum.`,
          };
        }
      }
      return { passed: true };
    },
  },

  // ── Rule 6: Root cost matches Phase 2 ─────────────
  {
    id: 'ROOT_COST_MATCHES_PHASE2',
    description: 'Root estimatedMonthlyCost must equal Phase 2 (Growth) cost',
    validate: (result) => {
      if (result.phases.length < 2) return { passed: true }; // caught by Rule 3
      const phase2Cost = result.phases[1].estimatedMonthlyCost;
      const rootCost = result.estimatedMonthlyCost;
      const diff = Math.abs(phase2Cost - rootCost);
      if (diff > 5) {
        return {
          passed: false,
          error: `Root estimatedMonthlyCost ($${rootCost}) does not match Phase 2 Growth cost ($${phase2Cost}). The root field MUST equal Phase 2's total.`,
        };
      }
      return { passed: true };
    },
  },

  // ── Rule 7: No zero-cost growth phase ─────────────
  {
    id: 'NO_ZERO_GROWTH_COST',
    description: 'Phase 2 (Growth) must have at least one paid tool',
    validate: (result) => {
      if (result.phases.length < 2) return { passed: true };
      const phase2 = result.phases[1];
      const hasPaidTool = phase2.tools.some((t) => t.monthlyCost > 0);
      if (hasPaidTool) return { passed: true };
      return {
        passed: false,
        error: `Phase 2 (Growth) has $0 total cost which is unrealistic. Growth phase must include at least one paid tier (a real production app always has paid infrastructure).`,
      };
    },
  },

  // ── Rule 8: Must cover core categories ────────────
  {
    id: 'COVERS_CORE_CATEGORIES',
    description: 'Must cover at minimum: Frontend (or Mobile), Backend, and Database categories',
    validate: (result) => {
      const categories = result.recommendations.map((r) => r.categoryName.toLowerCase());
      const hasFrontendOrMobile = categories.some(
        (c) =>
          c.includes('frontend') ||
          c.includes('mobile') ||
          c.includes('framework') ||
          c.includes('ui')
      );
      const hasBackend = categories.some(
        (c) => c.includes('backend') || c.includes('api') || c.includes('server')
      );
      const hasDatabase = categories.some(
        (c) => c.includes('database') || c.includes('db') || c.includes('storage')
      );
      if (hasFrontendOrMobile && hasBackend && hasDatabase) return { passed: true };
      const missing = [
        !hasFrontendOrMobile && 'Frontend/Mobile Framework',
        !hasBackend && 'Backend/API',
        !hasDatabase && 'Database',
      ].filter(Boolean);
      return {
        passed: false,
        error: `Missing core categories: ${missing.join(', ')}. Every stack must cover at minimum a Frontend, Backend, and Database layer.`,
      };
    },
  },

  // ── Rule 9: Compatibility Graph check ─────────────
  {
    id: 'COMPATIBILITY_GRAPH',
    description: 'Recommended tools must not conflict according to the compatibility graph',
    validate: (result) => {
      const toolNames = result.recommendations.map((r) => r.toolName.toLowerCase().trim());
      const conflicts: string[] = [];

      for (const toolName of toolNames) {
        const graphEntry = TOOL_COMPATIBILITY_GRAPH[toolName];
        if (!graphEntry?.incompatibleWith) continue;
        for (const incompatible of graphEntry.incompatibleWith) {
          if (toolNames.includes(incompatible.toLowerCase().trim())) {
            conflicts.push(`${toolName} ↔ ${incompatible}`);
          }
        }
      }

      if (conflicts.length === 0) return { passed: true };
      return {
        passed: false,
        error: `Incompatible tool pairings detected: ${conflicts.join('; ')}. Replace one of the conflicting tools with a compatible alternative.`,
      };
    },
  },

  // ── Rule 10: Summary must not say $0 for paid stacks ──
  {
    id: 'SUMMARY_COST_ACCURACY',
    description: 'Summary must not claim $0 cost when there are paid tools',
    validate: (result) => {
      const phase2Cost = result.phases.length > 1 ? result.phases[1].estimatedMonthlyCost : 0;
      const summaryMentionsZero =
        result.summary.includes('$0') || result.summary.toLowerCase().includes('free forever');
      if (phase2Cost > 0 && summaryMentionsZero) {
        return {
          passed: false,
          error: `Summary claims $0 or "free forever" but Phase 2 Growth cost is $${phase2Cost}/mo. Update the summary to accurately reflect real costs.`,
        };
      }
      return { passed: true };
    },
  },
];

// ── Main Validator ─────────────────────────────────

export function validateStack(result: AIRecommendationResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of VALIDATION_RULES) {
    const outcome = rule.validate(result);
    if (!outcome.passed && outcome.error) {
      errors.push(`[${rule.id}] ${outcome.error}`);
    }
  }

  // Soft warnings: alternatives that aren't in our catalog (non-blocking)
  result.recommendations.forEach((rec: ToolRecommendation) => {
    rec.alternatives?.forEach((alt: string) => {
      if (!isInCatalog(alt)) {
        warnings.push(`Alternative "${alt}" for ${rec.toolName} is not in catalog — may be unfamiliar to users.`);
      }
    });
  });

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Builds a correction prompt to append when the validator fails.
 * This feedback is injected back into the AI for the retry attempt.
 */
export function buildCorrectionPrompt(errors: string[]): string {
  return `

CORRECTION REQUIRED — Your previous response failed validation. Fix ALL of the following issues and return corrected JSON:

${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Return ONLY the corrected JSON. No explanations.`;
}
