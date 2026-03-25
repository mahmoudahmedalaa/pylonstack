import { db } from '@/lib/db';
import { aiRecommendations, projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { StackBuilder } from '@/components/stack-builder/StackBuilder';
import { StackLayerData } from '@/components/stack-builder/StackLayer';
import { getCategoryColor, CATEGORY_ICONS } from '@/components/stack-builder/stack-colors';
import { TOOLS, CATEGORIES } from '@/lib/mock-data';
import type { Tool } from '@/data/tools-catalog';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Sparkles, ArrowRight, Home } from 'lucide-react';

export const metadata = {
  title: 'Your Generated Tech Stack - Pylon',
};

// Map the DB recommendations to the format StackBuilder expects
function buildLayersFromRecommendations(
  recs: {
    category_slug: string;
    tool_slug: string;
    confidence: number;
    reasoning: string;
  }[],
): StackLayerData[] {
  const layersMap = new Map<string, StackLayerData>();

  for (const r of recs) {
    const catName =
      CATEGORIES.find((c) => c.toLowerCase().replace(/\\s+/g, '-') === r.category_slug) ||
      r.category_slug.replace('-', ' ');

    if (!layersMap.has(r.category_slug)) {
      layersMap.set(r.category_slug, {
        id: r.category_slug,
        category: r.category_slug,
        icon: CATEGORY_ICONS[catName] || 'Layout',
        color: getCategoryColor(catName),
        tools: [],
      });
    }

    const tool = TOOLS.find((t) => t.slug === r.tool_slug);

    const toolData: Tool =
      tool ||
      ({
        id: r.tool_slug,
        name: r.tool_slug.replace('-', ' '),
        logo: '',
        description: '',
        category: r.category_slug,
        website: '',
      } as unknown as Tool);

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

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { project: projectId } = await searchParams;

  if (!projectId || typeof projectId !== 'string') {
    return redirect('/dashboard');
  }

  // Fetch from DB
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));

  if (!project) return notFound();

  const [aiRec] = await db
    .select()
    .from(aiRecommendations)
    .where(eq(aiRecommendations.projectId, projectId));

  let layers: StackLayerData[] = [];
  let summary = 'We customized this stack based on your requirements.';

  if (aiRec) {
    layers = buildLayersFromRecommendations(aiRec.recommendations);

    // Attempt to extract the summary text if it exists
    const rawResp = aiRec.rawResponse as { summary?: string } | null | undefined;
    if (rawResp?.summary) {
      summary = rawResp.summary;
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mb-12 text-center">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent-500)]/10 blur-[100px]" />
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Your Intelligent Stack
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">
          {project.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: The AI reasoning & Actions */}
        <div className="relative flex flex-col justify-start space-y-6 lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24 text-[var(--color-accent-500)]" />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/10">
                <Sparkles className="h-4 w-4 text-[var(--color-accent-500)]" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Why This Stack?</h2>
            </div>

            <div className="prose prose-sm prose-invert relative z-10 max-w-none leading-relaxed text-[var(--muted-foreground)]">
              <p>{summary}</p>
              {aiRec && (
                <p className="mt-4 border-t border-[var(--border)] pt-4 text-xs opacity-70">
                  <span className="font-semibold">AI Model:</span>{' '}
                  {aiRec.modelUsed === 'fallback-rules'
                    ? 'Rule-based Engine (Fallback)'
                    : 'Gemini 2.5 Flash'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/project/${projectId}`} className="w-full">
              <Button size="lg" className="group w-full justify-between" variant="primary">
                Edit in Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="group w-full justify-between bg-transparent"
              >
                Back to Projects
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Stack Builder Reveal */}
        <div className="lg:col-span-2">
          {layers.length > 0 ? (
            <StackBuilder mode="reveal" layers={layers} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
              <p className="mb-4 text-[var(--muted-foreground)]">No recommendations found.</p>
              <Link href="/wizard">
                <Button>Restart Wizard</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
