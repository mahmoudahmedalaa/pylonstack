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
  web_app: ['Frontend Framework', 'Backend / API', 'Database', 'Hosting / Deployment', 'Testing'],
  mobile_app: ['Mobile Framework', 'Backend / API', 'Database', 'Authentication', 'Analytics'],
  desktop_app: ['Frontend Framework', 'Backend / API', 'Database', 'Hosting / Deployment'],
  backend_service: ['Backend / API', 'Database', 'DevOps', 'Hosting / Deployment', 'Testing'],
  cli_tool: ['Backend / API', 'Testing', 'DevOps'],
  browser_extension: ['Frontend Framework', 'Backend / API', 'Hosting / Deployment'],
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

  // Return skeleton layer — no tools pre-filled.
  // Tools are populated only after AI generation completes.
  return {
    id: `layer-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    category,
    icon,
    color,
    tools: [],
  };
}
