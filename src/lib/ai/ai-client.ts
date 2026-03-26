/**
 * Gemini AI client wrapper
 *
 * Uses the new @google/genai SDK (not the deprecated @google/generative-ai).
 * Wraps the model call, structured output parsing, and error handling.
 */

import { GoogleGenAI } from '@google/genai';
import type { WizardAnswers } from '@/stores/wizard-store';

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

export interface AIRecommendationResult {
  recommendations: ToolRecommendation[];
  summary: string; // Executive summary of the recommended stack
  estimatedMonthlyCost: number;
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

Return a JSON object with this exact shape:
{
  "summary": "A 2-3 sentence summary of the recommended stack and why it fits.",
  "estimatedMonthlyCost": <number>,
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

Include recommendations for at least these categories:
- Frontend Framework
- Backend / API
- Database
- Hosting / Deployment
- Authentication
- State Management (if applicable)
- Styling / UI Library

Add more categories based on the requirements (e.g. Payments, Real-time, AI/ML, Search, etc.).
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
    };

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

  return {
    recommendations,
    summary: `A ${answers.projectType?.replace('_', ' ')} stack optimized for ${answers.priorities[0] ?? 'general use'}, suitable for a ${answers.teamSize} team.`,
    estimatedMonthlyCost: wantsServerless ? 25 : 50,
    source: 'fallback',
  };
}
