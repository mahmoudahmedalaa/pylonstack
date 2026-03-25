/**
 * Maps wizard answers → StackLayerData[] for the preview sidebar.
 *
 * Logic:
 *   - Step 1 (Project Type): creates a "Foundation" base layer
 *   - Step 3 (Requirements): each requirement maps to a category layer
 *   - Each layer shows placeholder/example tools as context
 */

import type { StackLayerData } from '@/components/stack-builder';
import { getCategoryColor, CATEGORY_ICONS } from '@/components/stack-builder';
import type { WizardAnswers } from '@/stores/wizard-store';

/** Requirement ID → category mapping */
const REQ_TO_CATEGORY: Record<string, string> = {
  auth: 'Authentication',
  payments: 'Payments',
  realtime: 'API & Communication',
  storage: 'Storage',
  analytics: 'Analytics',
  ai: 'AI & ML',
  email: 'API & Communication',
  search: 'Search',
};

/** Project type → suggested base categories */
const PROJECT_BASE_CATEGORIES: Record<string, string[]> = {
  web_app: ['Frontend', 'Backend', 'Database'],
  mobile_app: ['Mobile Development', 'Backend', 'Database'],
  desktop_app: ['Frontend', 'Backend', 'Database'],
  backend_service: ['Backend', 'Database', 'DevOps'],
  cli_tool: ['Backend', 'Testing'],
  browser_extension: ['Frontend'],
};

/** Example tools per category (shown as placeholders in the preview) */
const EXAMPLE_TOOLS: Record<string, { id: string; name: string }[]> = {
  Frontend: [
    { id: 'react', name: 'React' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'tailwindcss', name: 'Tailwind CSS' },
  ],
  Backend: [
    { id: 'nodejs', name: 'Node.js' },
    { id: 'express', name: 'Express' },
  ],
  Database: [
    { id: 'postgresql', name: 'PostgreSQL' },
    { id: 'redis', name: 'Redis' },
  ],
  'Mobile Development': [
    { id: 'react-native', name: 'React Native' },
    { id: 'expo', name: 'Expo' },
  ],
  Authentication: [
    { id: 'clerk', name: 'Clerk' },
    { id: 'nextauth', name: 'NextAuth.js' },
  ],
  Payments: [
    { id: 'stripe', name: 'Stripe' },
    { id: 'lemonsqueezy', name: 'Lemon Squeezy' },
  ],
  'API & Communication': [
    { id: 'resend', name: 'Resend' },
    { id: 'twilio', name: 'Twilio' },
  ],
  Storage: [
    { id: 's3', name: 'AWS S3' },
    { id: 'cloudinary', name: 'Cloudinary' },
  ],
  Analytics: [
    { id: 'posthog', name: 'PostHog' },
    { id: 'mixpanel', name: 'Mixpanel' },
  ],
  'AI & ML': [
    { id: 'openai', name: 'OpenAI' },
    { id: 'langchain', name: 'LangChain' },
  ],
  Search: [
    { id: 'algolia', name: 'Algolia' },
    { id: 'meilisearch', name: 'Meilisearch' },
  ],
  DevOps: [
    { id: 'docker', name: 'Docker' },
    { id: 'github-actions', name: 'GitHub Actions' },
  ],
  Testing: [
    { id: 'vitest', name: 'Vitest' },
    { id: 'playwright', name: 'Playwright' },
  ],
  'Cloud & Hosting': [
    { id: 'vercel', name: 'Vercel' },
    { id: 'aws', name: 'AWS' },
  ],
};

/**
 * Convert current wizard answers into StackLayerData[] for the stack builder preview.
 */
export function wizardAnswersToLayers(answers: WizardAnswers): StackLayerData[] {
  const seen = new Set<string>();
  const layers: StackLayerData[] = [];

  // 1. Base categories from project type
  if (answers.projectType) {
    const baseCats = PROJECT_BASE_CATEGORIES[answers.projectType] ?? ['Frontend', 'Backend'];
    for (const cat of baseCats) {
      if (seen.has(cat)) continue;
      seen.add(cat);
      layers.push(makeCategoryLayer(cat));
    }
  }

  // 2. Additional categories from requirements
  for (const reqId of answers.requirements) {
    const cat = REQ_TO_CATEGORY[reqId];
    if (!cat || seen.has(cat)) continue;
    seen.add(cat);
    layers.push(makeCategoryLayer(cat));
  }

  return layers;
}

function makeCategoryLayer(category: string): StackLayerData {
  const color = getCategoryColor(category);
  const icon = CATEGORY_ICONS[category] ?? 'Layout';
  const tools = (EXAMPLE_TOOLS[category] ?? []).map((t) => ({
    id: t.id,
    name: t.name,
  }));

  return {
    id: `layer-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    category,
    icon,
    color,
    tools,
  };
}
