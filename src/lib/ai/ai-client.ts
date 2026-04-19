/**
 * Gemini AI client wrapper
 *
 * Uses the new @google/genai SDK (not the deprecated @google/generative-ai).
 * Wraps the model call, structured output parsing, and error handling.
 */

import { google } from '@ai-sdk/google';
import { streamObject, type StreamObjectResult } from 'ai';
import { AIRecommendationSchema } from './schema';
import type { WizardAnswers } from '@/stores/wizard-store';
import { TOOLS, getToolTiers } from '@/data/tools-catalog';
import { buildCompatibilityContext } from '@/lib/validation/compatibility-graph';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set — AI recommendations will use fallback logic.');
}

// ── Types ──

export interface ToolRecommendation {
  categoryName: string; // e.g. "Frontend Framework"
  toolName: string; // e.g. "Next.js"
  confidence: number; // 0-100
  reasoning: string; // Why this tool is recommended
  alternatives: string[]; // Names of alternative tools
}

export interface PhaseTool {
  toolName: string;
  reason?: string; // Quick reason why it's introduced in this phase
  tier: string;
  monthlyCost: number;
  pricingModel?: 'Flat' | 'Usage-Based' | 'Per-Seat' | 'Percentage';
}

export interface ProjectPhase {
  name: string;
  description: string;
  tools: PhaseTool[];
  estimatedMonthlyCost: number;
  estimatedImplementationTimeDays: number;
}

export interface AIRecommendationResult {
  recommendations: ToolRecommendation[];
  summary: string; // Executive summary of the recommended stack
  estimatedMonthlyCost: number;
  phases: ProjectPhase[];
  source: 'gemini' | 'fallback';
  /** Number of correction attempts needed (0 = first pass was clean) */
  correctionAttempts?: number;
  /** Non-blocking warnings from the validator */
  validationWarnings?: string[];
}

// ── Catalog Relevance Filtering ──

/**
 * Maps project context to relevant tool categories.
 * This keeps prompt injection bounded (~50-80 tools) regardless of catalog size —
 * even if the catalog grows to 1000s, each request only sees the tools it needs.
 *
 * To extend: just add categories to the relevant sets below. No other changes needed.
 */
function getRelevantCategories(answers: WizardAnswers): Set<string> {
  const { projectType, requirements } = answers;

  // Universal categories always included
  const categories = new Set<string>(['Auth', 'Hosting', 'CI/CD', 'Monitoring', 'DevTools']);

  // Project type determines the primary tech categories
  if (projectType === 'web_app' || projectType === 'saas') {
    categories.add('Frontend');
    categories.add('Backend');
    categories.add('Database');
    categories.add('ORM');
    categories.add('Styling');
  } else if (projectType === 'mobile_app') {
    categories.add('Mobile');
    categories.add('Backend');
    categories.add('Database');
    categories.add('Storage');
  } else if (projectType === 'api' || projectType === 'backend_service') {
    categories.add('Backend');
    categories.add('Database');
    categories.add('ORM');
  } else {
    // Fallback: include all core categories
    categories.add('Frontend');
    categories.add('Backend');
    categories.add('Database');
  }

  // Requirement-driven additions
  if (requirements.includes('payments')) categories.add('Payments');
  categories.add('Analytics'); // ALways include Analytics for observability by default
  if (requirements.includes('email') || requirements.includes('notifications'))
    categories.add('Email');
  if (requirements.includes('cms') || requirements.includes('blog')) categories.add('CMS');
  if (requirements.includes('search')) categories.add('Search');
  if (requirements.includes('ai') || requirements.includes('ml')) categories.add('AI/ML');
  if (requirements.includes('storage') || requirements.includes('files')) categories.add('Storage');
  if (requirements.includes('testing')) categories.add('Testing');

  return categories;
}

// ── Prompt Construction ──

function buildPrompt(answers: WizardAnswers, correctionNote?: string): string {
  // Relevance-filtered catalog: only inject tools relevant to this project type.
  // This stays bounded at ~50-80 tools regardless of how large the catalog grows.
  const relevantCategories = getRelevantCategories(answers);
  const catalogSummary = TOOLS.filter((t) => relevantCategories.has(t.category)).reduce(
    (acc: Record<string, string[]>, t) => {
      if (!acc[t.category]) acc[t.category] = [];
      acc[t.category].push(t.name);
      return acc;
    },
    {},
  );
  const catalogBlock = Object.entries(catalogSummary)
    .map(([cat, names]) => `${cat}: ${names.join(', ')}`)
    .join('\n');

  // Build compatibility context from the graph
  const compatibilityBlock = buildCompatibilityContext();

  return `You are an expert software architect. Based on the following project requirements, 
recommend a complete tech stack using ONLY tools from the APPROVED CATALOG below.
Return ONLY valid JSON — no markdown fences, no explanation outside JSON.

APPROVED TOOL CATALOG (you MUST only recommend tools from this list):
${catalogBlock}
${compatibilityBlock}

PROJECT REQUIREMENTS:
- App Description: ${answers.description}
- Project Type: ${answers.projectType}
- Team Size: ${answers.teamSize}
- Requirements: ${answers.requirements.join(', ')}
- Priorities: ${answers.priorities.join(', ')}
- Preferences: Strongly enforce modern strict TypeScript, ESLint, Prettier, and standard modern best practices.
- Analytics Tools Preferences: Automatically include modern, developer-friendly analytics (like Vercel Web Analytics, PostHog, or similar) as part of the recommendation, because observability is critical for success.

Return a JSON object with this exact shape:
{
  "summary": "A 2-3 sentence executive summary of the recommended stack. Explicitly mention the cost scaling. Example: 'Starting at $X/mo for the MVP, scaling up to ~$Y/mo in Growth.' DO NOT output $0 for MVP if the MVP requires paid tools.",
  "estimatedMonthlyCost": <number, representing the TOTAL COMBINED sum of all Phase 2 / Growth costs>,
  "phases": [
    {
      "name": "Phase 1 - MVP",
      "description": "<1-2 sentences about the focus of this phase>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<1-sentence reason taking this on now>", "tier": "free", "monthlyCost": 0, "pricingModel": "Flat" }
      ],
      "estimatedMonthlyCost": <sum of tool costs in this phase>,
      "estimatedImplementationTimeDays": 14
    },
    {
      "name": "Phase 2 - Growth",
      "description": "<building on MVP, scaling up>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<A specific, custom justification. e.g., 'Since you need realtime sockets, Pro unlocks 1M concurrent connections.' DO NOT use generic text like 'upgrade for higher limits'>", "tier": "pro", "monthlyCost": 40, "pricingModel": "Usage-Based" }
      ],
      "estimatedMonthlyCost": <sum of tool costs in this phase>,
      "estimatedImplementationTimeDays": 30
    },
    {
      "name": "Phase 3 - Scale",
      "description": "<enterprise limits and strict compliance>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<A specific, custom justification for scale.>", "tier": "enterprise", "monthlyCost": 300, "pricingModel": "Per-Seat" }
      ],
      "estimatedMonthlyCost": <sum of tool costs in this phase>,
      "estimatedImplementationTimeDays": 60
    }
  ],
  "recommendations": [
    {
      "categoryName": "<category like Frontend Framework, Backend, Database, Hosting, etc.>",
      "toolName": "<specific tool name>",
      "confidence": <0-100>,
      "reasoning": "<1-2 sentences explaining why, referencing their exact requirements and priorities>",
      "alternatives": ["<alt1>", "<alt2>"]
    }
  ]
}

CRITICAL RULES:
1. ALWAYS return EXACTLY 3 phases (Phase 1, Phase 2, Phase 3).
2. ONLY recommend tools that appear in the APPROVED TOOL CATALOG above. Never invent tool names.
3. The "alternatives" array inside recommendations MUST NEVER BE EMPTY and must be an array of strings. It MUST contain AT LEAST 2 real competing tools. If you recommend Next.js, alternatives MUST be ["Remix", "Nuxt"], etc.
4. For usage-based tools (Stripe, AWS, Vercel, OpenAI, etc), you MUST provide a realistic estimated baseline numeric 'monthlyCost' for that phase based on typical expected usage volume (e.g., 50 for Stripe usage, 20 for OpenAI tokens). DO NOT use 0 for usage-based tier costs in Growth/Scale. DO NOT return strings like "$50"; it must be a number.
5. "estimatedMonthlyCost" at the root level must PERFECTLY MATCH the arithmetic sum of all tool costs in Phase 2 (Growth). Recalculate it explicitly.
6. All JSON output MUST BE EXACTLY valid JSON. No markdown codeblock wrapping formatting is allowed.
7. Phase 2 (Growth) MUST have at least one paid tool (monthlyCost > 0).
8. The "reason" for tools and "reasoning" for recommendations MUST be highly bespoke and tailored to the exact requirements of the project. DO NOT use generic placeholders like "Upgrade for higher limits" or "Start with the free tier".

Include recommendations for at least these categories:
- Frontend Framework
- Backend / API
- Database
- Hosting / Deployment
- Authentication
- Payments (if requested)
- Styling / UI Library

Order by importance. Prefer production-proven tools. Consider the team size and priorities when choosing.${correctionNote ?? ''}`;
}

// ── AI SDK Stream ──

export type AIStreamOrFallback =
  | { type: 'stream'; result: StreamObjectResult<unknown, unknown, unknown> }
  | { type: 'fallback'; data: AIRecommendationResult };

/**
 * Returns a StreamObjectResult (which provides chunked JSON streaming via Zod)
 * OR returns the deterministic fallback immediately if no API key or other constraint is met.
 */
export async function streamAIRecommendation(
  answers: WizardAnswers,
  onFinish?: (event: { object?: unknown; error?: unknown }) => Promise<void> | void,
): Promise<AIStreamOrFallback> {
  if (!GEMINI_API_KEY) {
    return { type: 'fallback', data: getFallbackRecommendation(answers) };
  }

  const prompt = buildPrompt(answers);

  try {
    const stream = await streamObject({
      model: google('gemini-2.5-flash'),
      schema: AIRecommendationSchema,
      prompt,
      temperature: 0.3,
      onFinish, // Forward the callback natively to the AI SDK
    });

    return { type: 'stream', result: stream };
  } catch (error) {
    console.error('[AI Client] Failed to initialize streamObject:', error);
    return { type: 'fallback', data: getFallbackRecommendation(answers) };
  }
}

// ── Deterministic Fallback ──

export function getFallbackRecommendation(answers: WizardAnswers): AIRecommendationResult {
  const isWeb = answers.projectType === 'web_app';
  const isMobile = answers.projectType === 'mobile_app';
  const wantsTypescript = answers.preferences.includes('typescript');
  const wantsServerless = answers.preferences.includes('serverless');
  const wantsOpenSource = answers.preferences.includes('open_source');

  const recommendations: ToolRecommendation[] = [];

  // Frontend
  if (isWeb) {
    recommendations.push({
      categoryName: 'Frontend Framework',
      toolName: wantsTypescript ? 'Next.js' : 'React',
      confidence: 90,
      reasoning: wantsTypescript
        ? 'Next.js provides full-stack TypeScript support with SSR and API routes.'
        : 'React is the most popular frontend library with a massive ecosystem.',
      alternatives: ['Vue.js', 'Svelte', 'Angular'],
    });
  } else if (isMobile) {
    recommendations.push({
      categoryName: 'Mobile Framework',
      toolName: 'React Native',
      confidence: 85,
      reasoning: 'Cross-platform with shared TypeScript codebase and large community support.',
      alternatives: ['Flutter', 'Expo'],
    });
  }

  // Backend
  recommendations.push({
    categoryName: 'Backend / API',
    toolName: wantsServerless ? 'Vercel Functions' : 'Node.js (Express)',
    confidence: 85,
    reasoning: wantsServerless
      ? 'Zero infrastructure management, auto-scaling, and edge functions.'
      : 'Battle-tested, huge ecosystem, and great TypeScript support.',
    alternatives: wantsServerless ? ['Cloudflare Workers', 'AWS Lambda'] : ['Fastify', 'NestJS'],
  });

  // Database
  recommendations.push({
    categoryName: 'Database',
    toolName: wantsOpenSource ? 'PostgreSQL' : 'Supabase',
    confidence: 88,
    reasoning: wantsOpenSource
      ? 'Open-source, feature-rich, and battle-tested for production.'
      : 'PostgreSQL with real-time, auth, and storage built-in.',
    alternatives: ['PlanetScale', 'Neon', 'MongoDB'],
  });

  // Hosting
  recommendations.push({
    categoryName: 'Hosting / Deployment',
    toolName: 'Vercel',
    confidence: 92,
    reasoning: 'Best-in-class DX for Next.js with global edge network and preview deployments.',
    alternatives: ['Netlify', 'Railway', 'Fly.io'],
  });

  // Auth
  if (answers.requirements.includes('auth')) {
    recommendations.push({
      categoryName: 'Authentication',
      toolName: 'Clerk',
      confidence: 87,
      reasoning: 'Drop-in auth with social login, MFA, and user management. Generous free tier.',
      alternatives: ['Auth0', 'Supabase Auth', 'NextAuth.js'],
    });
  }

  // Payments
  if (answers.requirements.includes('payments')) {
    recommendations.push({
      categoryName: 'Payments',
      toolName: 'Stripe',
      confidence: 95,
      reasoning: 'Industry standard with excellent API, webhooks, and subscription management.',
      alternatives: ['Lemon Squeezy', 'Paddle'],
    });
  }

  // Tools that are genuinely usage-based (pay-per-transaction or metered)
  const usageBasedTools = new Set([
    'Stripe',
    'Vercel',
    'Vercel Functions',
    'AWS Lambda',
    'Cloudflare Workers',
    'OpenAI',
    'Twilio',
  ]);

  const phases: ProjectPhase[] = [
    {
      name: 'Phase 1 — MVP Launch',
      description:
        'Ship a production-ready MVP using free-tier allocations. Validate your core product with real users before investing in scaling infrastructure.',
      tools: recommendations.map((r) => {
        const catalogTool = TOOLS.find((t) => t.name === r.toolName);
        const tiers = catalogTool ? getToolTiers(catalogTool) : [];
        const freeTier = tiers.find((t) => t.price === 0) || tiers[0];

        return {
          toolName: r.toolName,
          reason: `Start with ${r.toolName}'s ${freeTier?.name || 'Free Tier'} to validate your core product.`,
          tier: freeTier?.name || 'Free Tier',
          monthlyCost: freeTier?.price || 0,
          pricingModel:
            freeTier?.pricingModel || (usageBasedTools.has(r.toolName) ? 'Usage-Based' : 'Flat'),
        };
      }),
      estimatedMonthlyCost: 0,
      estimatedImplementationTimeDays: 14,
    },
    {
      name: 'Phase 2 — Growth',
      description:
        'Upgrade to pro tiers as you gain traction. Unlock higher limits, team collaboration, and production-grade SLAs.',
      tools: recommendations.map((r) => {
        const catalogTool = TOOLS.find((t) => t.name === r.toolName);
        const tiers = catalogTool ? getToolTiers(catalogTool) : [];
        // Extract a mid tier for growth
        const growthTier =
          tiers.length > 2
            ? tiers[1]
            : tiers.find((t) => t.price !== 0 && t.price !== null) || tiers[tiers.length - 1];

        return {
          toolName: r.toolName,
          reason: `Upgrade to ${growthTier?.name || 'Pro'} for higher limits and production reliability.`,
          tier: growthTier?.name || 'Pro',
          monthlyCost:
            growthTier?.price !== null && growthTier?.price !== undefined
              ? growthTier.price
              : catalogTool?.pricingDetails?.model === 'open_source'
                ? 0
                : 20,
          pricingModel:
            growthTier?.pricingModel || (usageBasedTools.has(r.toolName) ? 'Usage-Based' : 'Flat'),
        };
      }),
      estimatedMonthlyCost: 0,
      estimatedImplementationTimeDays: 30,
    },
    {
      name: 'Phase 3 — Scale',
      description:
        'Enterprise-grade infrastructure for high traffic, compliance requirements, and dedicated support.',
      tools: recommendations.map((r) => {
        const catalogTool = TOOLS.find((t) => t.name === r.toolName);
        const tiers = catalogTool ? getToolTiers(catalogTool) : [];
        // Extract highest tier for scale
        const scaleTier = tiers[tiers.length - 1];

        return {
          toolName: r.toolName,
          reason: `Scale to ${scaleTier?.name || 'Enterprise'} for dedicated support, SLAs, and enterprise features.`,
          tier: scaleTier?.name || 'Enterprise',
          monthlyCost:
            scaleTier?.price !== null && scaleTier?.price !== undefined
              ? scaleTier.price
              : catalogTool?.pricingDetails?.model === 'open_source'
                ? 0
                : 150,
          pricingModel:
            scaleTier?.pricingModel || (usageBasedTools.has(r.toolName) ? 'Usage-Based' : 'Flat'),
        };
      }),
      estimatedMonthlyCost: 0,
      estimatedImplementationTimeDays: 60,
    },
  ];

  phases[0].estimatedMonthlyCost = phases[0].tools.reduce(
    (sum, t) => sum + (t.monthlyCost || 0),
    0,
  );
  phases[1].estimatedMonthlyCost = phases[1].tools.reduce(
    (sum, t) => sum + (t.monthlyCost || 0),
    0,
  );
  phases[2].estimatedMonthlyCost = phases[2].tools.reduce(
    (sum, t) => sum + (t.monthlyCost || 0),
    0,
  );

  const totalGrowthCost = phases[1].estimatedMonthlyCost;

  return {
    recommendations,
    summary: `A ${answers.projectType?.replace('_', ' ')} stack optimized for ${answers.priorities[0] ?? 'general use'}, suitable for a ${answers.teamSize} team. Starts free with generous free tiers, scaling to ~$${totalGrowthCost}/mo as you grow.`,
    estimatedMonthlyCost: totalGrowthCost,
    phases,
    source: 'fallback',
  };
}
