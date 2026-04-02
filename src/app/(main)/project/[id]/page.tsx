'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StackBuilder } from '@/components/stack-builder/StackBuilder';
import { ToolDrawer } from '@/components/stack-builder/ToolDrawer';
import { PhaseRoadmapPanel } from '@/components/phase-planner';
import { Button, Badge } from '@/components/ui';
import { getCategoryColor, CATEGORY_ICONS } from '@/components/stack-builder/stack-colors';
import {
  ArrowLeft,
  Edit3,
  Settings,
  Rocket,
  GitBranch,
  Loader2,
  Download,
  FileJson,
  FileText,
  Check,
  Layers,
  Calendar,
  FileDown,
  Github,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { StackLayerData } from '@/components/stack-builder/StackLayer';
import type { ToolChipData } from '@/components/stack-builder/ToolChip';
import { TOOLS, CATEGORIES, type Tool } from '@/data/tools-catalog';
import {
  useProject,
  useCreateProject,
  useSaveProjectTools,
  useUpdateProject,
} from '@/hooks/use-projects';
import type { ProjectPhaseRoadmap } from '@/data/phase-types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const isNew = projectId === 'new';

  const { data: fetchProject, isLoading, error } = useProject(isNew ? '' : projectId);

  const createProject = useCreateProject();
  const saveProjectTools = useSaveProjectTools();
  const updateProject = useUpdateProject();

  const [layers, setLayers] = useState<StackLayerData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'stack' | 'roadmap'>('stack');
  const [roadmapData, setRoadmapData] = useState<ProjectPhaseRoadmap | undefined>(undefined);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const project = isNew
    ? {
        id: 'new',
        name: 'Untitled Project',
        description: 'A manually assembled stack architecture.',
        status: 'draft',
        createdAt: new Date().toISOString(),
      }
    : fetchProject;

  useEffect(() => {
    if (isNew) {
      setLayers([]);
      setIsInitialized(true);
      return;
    }

    if (fetchProject && !isInitialized) {
      let initialLayers: StackLayerData[] = [];

      if (fetchProject.tools && fetchProject.tools.length > 0) {
        const grouped = fetchProject.tools.reduce(
          (acc, t) => {
            const cat = t.categoryName || 'Unknown';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(t);
            return acc;
          },
          {} as Record<string, typeof fetchProject.tools>,
        );

        initialLayers = Object.entries(grouped).map(([category, tools]) => ({
          id: category, // Using category name as ID for layer since category string matches UI
          category,
          icon: CATEGORY_ICONS[category] || 'Layout',
          color: getCategoryColor(category),
          tools: tools.map((t) => {
            const catalogTool = TOOLS.find((ct) => ct.slug === t.toolSlug);
            return {
              id: t.toolSlug || t.toolId, // Use what we have
              name: t.toolName,
              logoUrl: t.toolLogo || catalogTool?.logo || '',
              description: catalogTool?.description || t.notes || '',
              costIndicator: catalogTool?.pricing || 'Unknown',
            };
          }),
        }));
      } else if (fetchProject.aiRecommendation?.recommendations) {
        const recs = fetchProject.aiRecommendation.recommendations as Array<{
          category_slug: string;
          tool_slug: string;
          confidence?: number;
          reasoning?: string;
        }>;
        const layersMap = new Map<string, StackLayerData>();

        for (const r of recs) {
          const catName =
            CATEGORIES.find(
              (c) =>
                c
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '') === r.category_slug,
            ) || r.category_slug.replace('-', ' ');

          if (!layersMap.has(r.category_slug)) {
            layersMap.set(r.category_slug, {
              id: r.category_slug,
              category: catName,
              icon: CATEGORY_ICONS[catName] || 'Layout',
              color: getCategoryColor(catName),
              tools: [],
            });
          }

          const catalogTool = TOOLS.find((t) => t.slug === r.tool_slug);
          layersMap.get(r.category_slug)!.tools.push({
            id: catalogTool?.slug || r.tool_slug, // Ensure we use slug so it accurately maps payload for DB insertion
            name: catalogTool?.name || r.tool_slug.replace('-', ' '),
            logoUrl: catalogTool?.logo || '',
            description: catalogTool?.description || r.reasoning || '',
            costIndicator: catalogTool?.pricing || 'Unknown',
            confidence: r.confidence,
          });
        }
        initialLayers = Array.from(layersMap.values());
      }

      setLayers(initialLayers);

      // Load persisted roadmap from stackData
      const sd = fetchProject.stackData as Record<string, unknown> | null;
      if (sd && !Array.isArray(sd) && sd.roadmap) {
        setRoadmapData(sd.roadmap as ProjectPhaseRoadmap);
      }

      setIsInitialized(true);
    }
  }, [fetchProject, isNew, isInitialized]);

  useEffect(() => {
    if (fetchProject && !isNew) {
      setEditName(fetchProject.name || '');
      setEditDesc(fetchProject.description || '');
    }
  }, [fetchProject, isNew]);

  const handleUpdateDetails = async () => {
    if (isNew) {
      // In new project, just update local state instead
      // but 'project' is derived, so edit wouldn't persist until saved
      setIsEditModalOpen(false);
      return;
    }
    try {
      await updateProject.mutateAsync({
        id: projectId,
        name: editName,
        description: editDesc,
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update project details', err);
    }
  };

  const handleAddTool = (tool: Tool) => {
    setLayers((prev) => {
      const existingLayerIndex = prev.findIndex((l) => l.category === tool.category);

      const newToolData: ToolChipData = {
        id: tool.slug || tool.id, // Prefer slug as ID
        name: tool.name,
        logoUrl: tool.logo,
        description: tool.description,
        costIndicator: tool.pricing,
      };

      if (existingLayerIndex >= 0) {
        if (prev[existingLayerIndex].tools.some((t) => t.id === tool.id || t.id === tool.slug))
          return prev;
        const newLayers = [...prev];
        newLayers[existingLayerIndex] = {
          ...newLayers[existingLayerIndex],
          tools: [...newLayers[existingLayerIndex].tools, newToolData],
        };
        return newLayers;
      }

      return [
        ...prev,
        {
          id: tool.category,
          category: tool.category,
          icon: CATEGORY_ICONS[tool.category] || 'Layout',
          color: getCategoryColor(tool.category),
          tools: [newToolData],
        },
      ];
    });
  };

  const handleSaveProject = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Serialize layers to JSON (optional legacy) and tools payload
      const layersData = layers.map((layer) => ({
        category: layer.category,
        icon: layer.icon,
        color: layer.color,
        tools: layer.tools.map((t) => ({
          id: t.id,
          name: t.name,
          logoUrl: t.logoUrl,
          description: t.description,
          costIndicator: t.costIndicator,
        })),
      }));

      // Wrap layers + roadmap into a single stackData object
      const stackData = {
        layers: layersData,
        ...(roadmapData ? { roadmap: roadmapData } : {}),
      };

      const toolsPayload = layers.flatMap((layer) =>
        layer.tools.map((t, idx) => ({
          toolSlug: t.id, // Assuming id in frontend is the slug from catalog
          categorySlug: layer.category
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          position: idx,
        })),
      );

      if (isNew) {
        // Create a new project with stack data
        const created = await createProject.mutateAsync({
          name: 'Untitled Project',
          description: 'A manually assembled stack architecture.',
          stackData: stackData as Record<string, unknown>,
        });

        // Save the tools mapping to properly populate projectTools table
        await saveProjectTools.mutateAsync({
          projectId: created.id,
          tools: toolsPayload,
        });

        setSaveSuccess(true);
        setTimeout(() => router.push(`/project/${created.id}`), 800);
      } else {
        // Update existing project tools
        await saveProjectTools.mutateAsync({
          projectId,
          tools: toolsPayload,
        });

        // Also update stackData just in case
        const res = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stackData }),
        });

        if (!res.ok) throw new Error('Failed to update stackData');

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, layers, isNew, createProject, saveProjectTools, projectId, router, roadmapData]);

  const handleExportJson = () => {
    const dataStr = JSON.stringify({ project, layers }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name?.replace(/\s+/g, '-').toLowerCase() || 'stack'}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const handleExportMarkdown = () => {
    let md = `# ${project?.name || 'Stack Export'}\n\n`;
    md += `${project?.description || ''}\n\n`;
    md += `**Status:** ${project?.status}\n`;
    md += `**Created At:** ${new Date(project?.createdAt || '').toLocaleDateString()}\n\n`;
    md += `## Architecture Layers\n\n`;

    layers.forEach((layer) => {
      md += `### ${layer.category}\n`;
      layer.tools.forEach((tool) => {
        md += `- **${tool.name}**: ${tool.description} (Pricing: ${tool.costIndicator})\n`;
      });
      md += '\n';
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name?.replace(/\s+/g, '-').toLowerCase() || 'stack'}-export.md`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const handleExportPdf = async () => {
    const element = document.getElementById('project-content-area');
    if (!element) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${project?.name?.replace(/\s+/g, '-').toLowerCase() || 'stack'}-export.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
    setIsExportOpen(false);
  };

  const handleSyncGit = () => {
    alert(
      'Sync to GitHub/Jira is coming soon! This will automatically create issues for your tech stack tools.',
    );
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary-500)]" />
      </div>
    );
  }

  if (error || (!project && isInitialized)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <h2 className="mb-2 text-xl font-semibold">Project not found</h2>
        <p className="mb-6 text-sm text-[var(--muted-foreground)]">
          The project you are looking for does not exist or has been deleted.
        </p>
        <Button variant="primary" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!project) return null;

  const currentToolCount = layers.reduce((acc, layer) => acc + layer.tools.length, 0);

  return (
    <div
      id="project-content-area"
      className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col pb-12 duration-500"
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 -mx-4 mb-8 border-b border-[var(--border)] bg-[var(--background)]/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => router.push('/dashboard')}
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setIsExportOpen(!isExportOpen)}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportOpen(false)} />
                  <div className="animate-in fade-in slide-in-from-top-2 absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
                    <button
                      onClick={handleExportMarkdown}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/50"
                    >
                      <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                      Markdown (.md)
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/50"
                    >
                      <FileJson className="h-4 w-4 text-[var(--muted-foreground)]" />
                      JSON (.json)
                    </button>
                    <div className="my-1 h-px border-t border-[var(--border)]" />
                    <button
                      onClick={handleExportPdf}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/50"
                    >
                      <FileDown className="h-4 w-4 text-[var(--muted-foreground)]" />
                      Download PDF
                    </button>
                  </div>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSyncGit}>
              <Github className="mr-1.5 h-4 w-4" /> Sync
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-1.5 h-4 w-4" /> Configure
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveProject}
              disabled={isSaving || (isNew && layers.length === 0)}
            >
              {isSaving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="mr-1.5 h-4 w-4" />
              ) : (
                <Rocket className="mr-1.5 h-4 w-4" />
              )}
              {isSaving
                ? 'Saving…'
                : saveSuccess
                  ? 'Saved!'
                  : isNew
                    ? 'Save Project'
                    : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="mb-6 flex w-fit items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 p-1">
        <button
          onClick={() => setActiveTab('stack')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'stack'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Layers className="h-4 w-4" />
          Stack
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'roadmap'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Roadmap
          {roadmapData && roadmapData.assignments.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
              {roadmapData.assignments.length}
            </Badge>
          )}
        </button>
      </div>

      {/* ── Main Content ── */}
      {activeTab === 'stack' ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: AI Architect Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/20">
                  <GitBranch className="h-4 w-4 text-[var(--color-accent-600)]" />
                </div>
                <h2 className="text-sm font-semibold">
                  {isNew ? 'Manual Assembly Notes' : 'AI Architect Notes'}
                </h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {isNew ? (
                  'Start by dragging tools from the catalog or clicking to add them to your interactive stack builder. Build the perfect architecture layer by layer.'
                ) : (
                  <>
                    Based on your requirements, I have assembled a highly scalable and
                    cost-effective tech stack. We chose
                    <span className="font-medium text-[var(--foreground)]">
                      {' '}
                      {layers[0]?.tools[0]?.name || 'a great tool'}{' '}
                    </span>
                    for the core foundation due to its excellent developer experience and ecosystem.
                  </>
                )}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border)]/50 py-2">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Monthly Estimated Cost
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-accent-500)]">
                    ${Math.round(currentToolCount * 12.5)} {/* Rough estimate */}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)]/50 py-2">
                  <span className="text-xs text-[var(--muted-foreground)]">Tool Count</span>
                  <span className="text-sm font-semibold">{currentToolCount}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[var(--muted-foreground)]">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 w-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 className="mr-2 h-4 w-4" /> Modify Stack Details
              </Button>
            </div>

            {/* Tool Drawer */}
            <div className="h-[600px]">
              <ToolDrawer onAddTool={handleAddTool} />
            </div>
          </div>

          {/* Right Column: Interactive Stack Builder */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                Technology Stack
              </h2>
              <div className="w-full">
                <StackBuilder layers={layers} mode="interactive" showProgress={false} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Roadmap Tab ── */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <PhaseRoadmapPanel
            layers={layers}
            initialRoadmap={roadmapData}
            onRoadmapChange={async (updated: ProjectPhaseRoadmap) => {
              setRoadmapData(updated);
              // Persist roadmap alongside layers in stackData via PATCH
              if (!isNew && projectId) {
                try {
                  const layersData = layers.map((layer) => ({
                    category: layer.category,
                    icon: layer.icon,
                    color: layer.color,
                    tools: layer.tools.map((t) => ({
                      id: t.id,
                      name: t.name,
                      logoUrl: t.logoUrl,
                      description: t.description,
                      costIndicator: t.costIndicator,
                    })),
                  }));
                  await fetch(`/api/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      stackData: { layers: layersData, roadmap: updated },
                    }),
                  });
                } catch (err) {
                  console.error('Failed to save roadmap:', err);
                }
              }
            }}
          />
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Modify Stack Details</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--muted-foreground)]">
                  Description
                </label>
                <textarea
                  className="min-h-[100px] w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateDetails}
                disabled={updateProject.isPending}
              >
                {updateProject.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
