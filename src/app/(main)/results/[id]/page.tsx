import { db } from '@/lib/db';
import { aiRecommendations, projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { ResultsStackDisplay } from '@/components/results/ResultsStackDisplay';
import { StackLayerData } from '@/components/stack-builder/StackLayer';
import type { ToolChipData } from '@/components/stack-builder/ToolChip';
import { getCategoryColor, CATEGORY_ICONS } from '@/components/stack-builder/stack-colors';
import { TOOLS, CATEGORIES } from '@/data/tools-catalog';
import Link from 'next/link';
import { Button } from '@/components/ui';
import {
  Sparkles,
  ArrowRight,
  Home,
  Database,
  Layers,
  Clock,
  Activity,
  FolderOpen,
} from 'lucide-react';
import type { ProjectPhase } from '@/lib/ai/ai-client';
import { PhasedPlanCard } from '@/components/results/PhasedPlanCard';
import { ExportResultsButtons } from '@/components/results/ExportResultsButtons';
import { StickyCostBar } from '@/components/results/StickyCostBar';
import { VibeCodingPromptCard } from '@/components/results/VibeCodingPromptCard';

/** Direct slug → Lucide icon name mapping for AI-returned categories */
const SLUG_TO_ICON: Record<string, string> = {
  'frontend-framework': 'Layout',
  frontend: 'Layout',
  styling: 'Layout',
  'styling---ui-library': 'Layout',
  'ui-library': 'Layout',
  'backend-framework': 'Server',
  backend: 'Server',
  'backend---api': 'Server',
  database: 'Database',
  'cloud---hosting': 'Cloud',
  hosting: 'Cloud',
  'hosting---deployment': 'Cloud',
  authentication: 'Shield',
  auth: 'Shield',
  cms: 'FileText',
  payments: 'CreditCard',
  analytics: 'BarChart3',
  'ai---ml': 'Brain',
  ai: 'Brain',
  devops: 'Container',
  testing: 'TestTube2',
  'mobile-development': 'Smartphone',
  'mobile-framework': 'Smartphone',
  'api---communication': 'Plug',
  'state-management': 'Layers',
  storage: 'HardDrive',
  search: 'Search',
  'background-jobs': 'Clock',
  monitoring: 'Activity',
};

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const p = await params;
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, p.id),
    columns: { name: true },
  });

  return {
    title: project ? `${project.name} Architecture | Pylon` : 'Your Tech Stack | Pylon',
    description: 'AI-generated cloud architecture roadmap and tooling analysis.',
  };
}

// Map the DB recommendations to the format StackBuilder expects
function buildLayersFromRecommendations(
  recs: {
    category_slug: string;
    tool_slug: string;
    confidence: number;
    reasoning: string;
  }[],
  /** alternatives lookup from rawResponse.recommendations, keyed by toolName */
  alternativesMap?: Map<string, string[]>,
): StackLayerData[] {
  const layersMap = new Map<string, StackLayerData>();

  for (const r of recs) {
    const catName =
      CATEGORIES.find((c) => c.toLowerCase().replace(/\\s+/g, '-') === r.category_slug) ||
      r.category_slug.replace('-', ' ');

    if (!layersMap.has(r.category_slug)) {
      // Try direct slug lookup first, then fall back to display-name lookup
      const iconName = SLUG_TO_ICON[r.category_slug] || CATEGORY_ICONS[catName] || 'Layout';
      layersMap.set(r.category_slug, {
        id: r.category_slug,
        category: r.category_slug,
        icon: iconName,
        color: getCategoryColor(catName),
        tools: [],
      });
    }

    const tool = TOOLS.find((t) => t.slug === r.tool_slug);
    const toolName = tool?.name || r.tool_slug.replace('-', ' ');

    const toolData: ToolChipData = tool
      ? {
          id: tool.id,
          name: tool.name,
          logoUrl: tool.logo,
          description: tool.description,
          costIndicator: tool.pricing,
          confidence: r.confidence,
          reasoning: r.reasoning,
          alternatives: alternativesMap?.get(toolName) || [],
          pricing: tool.pricing,
        }
      : {
          id: r.tool_slug,
          name: r.tool_slug.replace('-', ' '),
          logoUrl: '',
          description: r.reasoning || '',
          costIndicator: 'Unknown',
          confidence: r.confidence,
          reasoning: r.reasoning,
          alternatives: alternativesMap?.get(toolName) || [],
          pricing: 'Unknown',
        };

    layersMap.get(r.category_slug)!.tools.push(toolData);
  }

  // Convert map values to array and order them somewhat logically
  const allLayers = Array.from(layersMap.values());
  const categoryOrder = [
    'frontend-framework',
    'styling',
    'backend-framework',
    'database',
    'authentication',
    'hosting',
    'analytics',
    'payments',
  ];

  return allLayers.sort((a, b) => {
    let indexA = categoryOrder.indexOf(a.category);
    let indexB = categoryOrder.indexOf(b.category);
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    return indexA - indexB;
  });
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return redirect('/dashboard');
  }

  // Fetch AI recommendation
  const [aiRec] = await db.select().from(aiRecommendations).where(eq(aiRecommendations.id, id));

  if (!aiRec) return notFound();

  // Fetch related project
  const [project] = await db.select().from(projects).where(eq(projects.id, aiRec.projectId));

  if (!project) return notFound();
  const projectId = project.id;

  let layers: StackLayerData[] = [];
  let summary = 'We customized this stack based on your requirements.';
  let phases: ProjectPhase[] = [];
  let estimatedMonthlyCost = 0;

  if (aiRec) {
    // Attempt to extract the extra fields if they exist
    const rawResp = aiRec.rawResponse as
      | {
          summary?: string;
          phases?: ProjectPhase[];
          estimatedMonthlyCost?: number;
          recommendations?: { toolName?: string; alternatives?: string[] }[];
        }
      | null
      | undefined;

    // Build alternatives lookup from rawResponse (which has full alternatives arrays)
    const alternativesMap = new Map<string, string[]>();
    if (rawResp?.recommendations) {
      for (const rec of rawResp.recommendations) {
        if (rec.toolName && rec.alternatives) {
          alternativesMap.set(rec.toolName, rec.alternatives);
        }
      }
    }

    layers = buildLayersFromRecommendations(aiRec.recommendations, alternativesMap);

    if (rawResp?.summary) summary = rawResp.summary;
    if (rawResp?.phases) phases = rawResp.phases;
    if (rawResp?.estimatedMonthlyCost) estimatedMonthlyCost = rawResp.estimatedMonthlyCost;
  }

  // Calculate some metrics
  const totalTools = layers.reduce((acc, layer) => acc + layer.tools.length, 0);

  // Calculate new metrics
  let estimatedSetupDays = 0;
  layers.forEach((layer) => {
    layer.tools.forEach((t) => {
      const dbTool = TOOLS.find((catalogTool) => catalogTool.id === t.id);
      if (dbTool?.pricingDetails?.estimatedImplementationTimeDays) {
        estimatedSetupDays += dbTool.pricingDetails.estimatedImplementationTimeDays;
      } else {
        estimatedSetupDays += 1;
      }
    });
  });
  const scalabilityProfile = totalTools > 6 ? 'Enterprise-Ready' : 'MVP-Optimized';

  return (
    <div id="results-content-area" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header section with Title and Actions */}
      <div className="relative mb-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="relative">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent-500)]/10 blur-[100px]" />
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold tracking-widest text-neutral-400 uppercase">
            <FolderOpen className="h-3.5 w-3.5" />
            Project
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-neutral-500">
            AI-generated tech stack tailored to your requirements
          </p>
        </div>

        {/* Actions moved to Header */}
        <div className="z-10 flex flex-col items-end gap-3 md:min-w-[320px]">
          <div className="flex w-full gap-3">
            <Link href={`/project/${projectId}`} className="flex-1">
              <Button className="group w-full justify-between" variant="primary">
                Edit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                className="group w-full justify-between bg-[var(--background)] hover:bg-[var(--muted)]"
              >
                Projects
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="w-full">
            <ExportResultsButtons
              projectName={project.name}
              projectDescription={project.description || ''}
              projectStatus={project.status || 'Draft'}
              createdAt={project.createdAt?.toISOString() || new Date().toISOString()}
              layers={layers}
            />
          </div>
        </div>
      </div>

      {/* TLDR Summary Card */}
      <div className="mb-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <div className="border-b border-[var(--border)] bg-[var(--muted)]/30 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Sparkles className="h-5 w-5 text-[var(--color-accent-500)]" />
            Executive Summary
          </h2>
        </div>
        <div className="p-6">
          <p className="mb-6 text-lg leading-relaxed text-[var(--foreground)]">{summary}</p>
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-[var(--muted-foreground)]">
            <span className="mr-1.5 font-semibold text-amber-500">Note:</span>
            Total costs may depend on API usage rates vs fixed flat tiers. MVP scope generally aims
            to start at $0. Scaling costs represent monthly projections based on expected usage.
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <Database className="h-4 w-4" /> Est. Cost
              </span>
              <span className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                {estimatedMonthlyCost > 0 ? `$${estimatedMonthlyCost}/mo` : 'Starts Free'}
              </span>
            </div>
            <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <Layers className="h-4 w-4" /> Total Tools
              </span>
              <span className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                {totalTools} components
              </span>
            </div>
            <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <Clock className="h-4 w-4" /> Setup Time
              </span>
              <span className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
                ~{estimatedSetupDays} days
              </span>
            </div>
            <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
                <Activity className="h-4 w-4" /> Profile
              </span>
              <span className="mt-1 mt-auto pt-1 text-lg font-semibold text-[var(--foreground)]">
                {scalabilityProfile}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Phases Reveal & Stack Builder */}
      <div className="w-full">
        {layers.length > 0 ? (
          <div className="flex flex-col gap-16">
            {phases.length > 0 && (
              <div>
                <h2 className="mb-8 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  Phased Rollout Plan
                </h2>
                <div className="flex flex-col gap-6">
                  {phases.map((phase, idx) => (
                    <PhasedPlanCard key={idx} phase={phase} />
                  ))}
                </div>
                {/* Cost Disclaimer */}
                <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    <span className="mr-1.5 font-semibold text-amber-500">⚠️ Pricing Note:</span>
                    Cost estimates reflect published pricing as of March 2026. For usage-based
                    services (e.g. Stripe, OpenAI, AWS), estimates are calculated based on your
                    project requirements and expected usage — actual costs may vary depending on
                    your real transaction volume and traffic. Always verify current pricing on each
                    tool&apos;s official website before committing.
                  </p>
                </div>
              </div>
            )}

            <ResultsStackDisplay layers={layers} />

            <VibeCodingPromptCard project={project} layers={layers} phases={phases} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
            <p className="mb-4 text-[var(--muted-foreground)]">No recommendations found.</p>
            <Link href="/wizard">
              <Button>Restart Wizard</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Sticky cost summary bar (visible on scroll) */}
      <StickyCostBar
        totalTools={totalTools}
        estimatedMonthlyCost={estimatedMonthlyCost}
        estimatedSetupDays={estimatedSetupDays}
      />
    </div>
  );
}
