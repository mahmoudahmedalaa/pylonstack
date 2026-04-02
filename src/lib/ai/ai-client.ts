/**
 * Gemini AI client wrapper
 *
 * Uses the new @google/genai SDK (not the deprecated @google/generative-ai).
 * Wraps the model call, structured output parsing, and error handling.
 */

import { GoogleGenAI } from '@google/genai';
import type { WizardAnswers } from '@/stores/wizard-store';
import { TOOLS, getToolTiers } from '@/data/tools-catalog';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set — AI recommendations will use fallback logic.');
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

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
}

// ── Prompt Construction ──

function buildPrompt(answers: WizardAnswers): string {
  return `You are an expert software architect. Based on the following project requirements, 
recommend a complete tech stack. Return ONLY valid JSON — no markdown fences, no explanation outside JSON.

PROJECT REQUIREMENTS:
- App Description: ${answers.description}
- Project Type: ${answers.projectType}
- Team Size: ${answers.teamSize}
- Requirements: ${answers.requirements.join(', ')}
- Priorities: ${answers.priorities.join(', ')}
- Preferences: ${answers.preferences.join(', ') || 'None specified'}
- Analytics Tools Preferences: ${answers.analytics?.join(', ') || 'No specific preference'}

Return a JSON object with this exact shape:
{
  "summary": "A 2-3 sentence summary of the recommended stack and why it fits.",
  "estimatedMonthlyCost": <number>,
  "phases": [
    {
      "name": "Phase 1 - MVP",
      "description": "<1-2 sentences about the focus of this phase>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<1-sentence reason taking this on now>", "tier": "free", "monthlyCost": 0, "pricingModel": "Flat" }
      ],
      "estimatedMonthlyCost": 0,
      "estimatedImplementationTimeDays": 14
    },
    {
      "name": "Phase 2 - Growth",
      "description": "<building on MVP, scaling up>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<why upgrade now>", "tier": "pro", "monthlyCost": 20, "pricingModel": "Usage-Based" }
      ],
      "estimatedMonthlyCost": 20,
      "estimatedImplementationTimeDays": 30
    },
    {
      "name": "Phase 3 - Scale",
      "description": "<enterprise limits and strict compliance>",
      "tools": [
        { "toolName": "<tool name>", "reason": "<why scale up now>", "tier": "enterprise", "monthlyCost": 150, "pricingModel": "Per-Seat" }
      ],
      "estimatedMonthlyCost": 150,
      "estimatedImplementationTimeDays": 60
    }
  ],
  "recommendations": [
    {
      "categoryName": "<category like Frontend Framework, Backend, Database, Hosting, etc.>",
      "toolName": "<specific tool name>",
      "confidence": <0-100>,
      "reasoning": "<1-2 sentences explaining why>",
      "alternatives": ["<alt1>", "<alt2>"]
    }
  ]
}

ALWAYS return EXACTLY 3 phases (Phase 1, Phase 2, and Phase 3).

Include recommendations for at least these categories:
- Frontend Framework
- Backend / API
- Database
- Hosting / Deployment
- Authentication
- State Management (if applicable)
- Styling / UI Library

Make sure 'pricingModel' is accurate. For usage-based tools like Stripe, AWS, or Vercel, set to 'Usage-Based' and predict a realistic baseline 'monthlyCost' for the phase scale (do NOT use 0 unless it is truly free).
Order by importance. Prefer production-proven tools. Consider the team size and priorities when choosing.`;
}

// ── Gemini Call ──

export async function getAIRecommendation(answers: WizardAnswers): Promise<AIRecommendationResult> {
  // Fallback if no API key
  if (!ai) {
    return getFallbackRecommendation(answers);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-preview-06-17',
      contents: buildPrompt(answers),
      config: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text?.trim() ?? '';

    // Strip markdown code fences if present
    const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

    const parsed = JSON.parse(jsonStr) as {
      summary: string;
      estimatedMonthlyCost: number;
      recommendations: ToolRecommendation[];
      phases: ProjectPhase[];
    };

    // Explicit validation to force fallback if structure is broken
    if (!parsed || !Array.isArray(parsed.recommendations) || !Array.isArray(parsed.phases)) {
      throw new Error('Missing required arrays in Gemini response');
    }

    return {
      ...parsed,
      source: 'gemini' as const,
    };
  } catch (error) {
    console.error('[AI Client] Gemini error, using fallback:', error);
    return getFallbackRecommendation(answers);
  }
}

// ── Deterministic Fallback ──

function getFallbackRecommendation(answers: WizardAnswers): AIRecommendationResult {
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
