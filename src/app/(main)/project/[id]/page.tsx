'use client';

import { useParams, useRouter } from 'next/navigation';
import { PROJECTS, getProjectTools } from '@/lib/mock-data';
import { StackBuilder } from '@/components/stack-builder/StackBuilder';
import { Button, Badge } from '@/components/ui';
import { getCategoryColor, CATEGORY_ICONS } from '@/components/stack-builder/stack-colors';
import { ArrowLeft, Edit3, Settings, Rocket, GitBranch } from 'lucide-react';
import type { StackLayerData } from '@/components/stack-builder/StackLayer';
import type { Tool } from '@/data/tools-catalog';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <h2 className="mb-2 text-xl font-semibold">Project not found</h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          The project you are looking for does not exist or has been deleted.
        </p>
        <Button variant="primary" onClick={() => router.push('/project')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const projectTools = getProjectTools(project);

  // Group tools by category to create layers
  const groupedTools = projectTools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, Tool[]>,
  );

  const layers: StackLayerData[] = Object.entries(groupedTools).map(([category, tools]) => ({
    id: category,
    category: category,
    icon: CATEGORY_ICONS[category] || 'Layout',
    color: getCategoryColor(category),
    tools,
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col pb-12 duration-500">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 -mx-4 mb-8 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => router.push('/project')}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {project.name}
              </h1>
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                {project.status === 'active' ? 'Active' : 'Draft'}
              </Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Settings className="mr-1.5 h-4 w-4" /> Configure
            </Button>
            <Button variant="primary" size="sm">
              <Rocket className="mr-1.5 h-4 w-4" /> Start Building
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: AI Architect Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/20">
                <GitBranch className="h-4 w-4 text-[var(--color-accent-600)]" />
              </div>
              <h2 className="text-sm font-semibold">AI Architect Notes</h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Based on your requirements, I have assembled a highly scalable and cost-effective tech
              stack. We chose
              <span className="font-medium text-[var(--foreground)]">
                {' '}
                {projectTools[0]?.name}{' '}
              </span>
              for the core foundation due to its excellent developer experience and ecosystem.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)]/50 py-2">
                <span className="text-xs text-[var(--muted-foreground)]">
                  Monthly Estimated Cost
                </span>
                <span className="text-sm font-semibold text-[var(--color-accent-500)]">
                  ${project.monthlyCost}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--border)]/50 py-2">
                <span className="text-xs text-[var(--muted-foreground)]">Tool Count</span>
                <span className="text-sm font-semibold">{projectTools.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[var(--muted-foreground)]">Created</span>
                <span className="text-sm font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full">
              <Edit3 className="mr-2 h-4 w-4" /> Modify Stack Details
            </Button>
          </div>
        </div>

        {/* Right Column: Interactive Stack Builder */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">Technology Stack</h2>
            <div className="w-full">
              <StackBuilder layers={layers} mode="interactive" showProgress={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
