'use client';

import Link from 'next/link';
import {
  Plus,
  Layers,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Package,
  ChevronRight,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { PROJECTS, getProjectTools, timeAgo } from '@/lib/mock-data';

// ── Project Card ────────────────────────────────

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  const tools = getProjectTools(project);

  return (
    <Link href={`/project/${project.id}`} className="block">
      <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200 hover:border-[color:var(--ring)]/30 hover:shadow-[var(--shadow-card)]">
        {/* Top accent line */}
        <div
          className={`h-0.5 ${
            project.status === 'active'
              ? 'bg-[var(--color-accent-500)]'
              : project.status === 'draft'
                ? 'bg-[var(--color-warning)]'
                : 'bg-[var(--muted)]'
          }`}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--foreground)]">{project.name}</h3>
                <Badge
                  variant={project.status === 'active' ? 'default' : 'outline'}
                  className="mt-1"
                >
                  {project.status === 'active'
                    ? '● Active'
                    : project.status === 'draft'
                      ? '○ Draft'
                      : 'Archived'}
                </Badge>
              </div>
            </div>
            <button className="rounded-md p-1.5 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
            {project.description}
          </p>

          {/* Tool Stack */}
          <div className="mt-4">
            <p className="mb-2 text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
              Stack
            </p>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1.5">
                {tools.slice(0, 6).map((tool) => (
                  <div
                    key={tool.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-1.5 transition-transform hover:z-10 hover:scale-110"
                    title={tool.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        const p = t.parentElement;
                        if (p) {
                          p.textContent = tool.name.charAt(0);
                          p.classList.add(
                            'text-[10px]',
                            'font-bold',
                            'text-[var(--muted-foreground)]',
                          );
                        }
                      }}
                    />
                  </div>
                ))}
                {tools.length > 6 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 text-[10px] font-medium text-[var(--muted-foreground)]">
                    +{tools.length - 6}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--border)]/50" />

          {/* Footer Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Package className="h-3.5 w-3.5" />
                {tools.length} tools
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <DollarSign className="h-3.5 w-3.5" />
                {project.monthlyCost === 0 ? (
                  <span className="text-[var(--color-accent-500)]">Free</span>
                ) : (
                  <>\${project.monthlyCost}/mo</>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Calendar className="h-3.5 w-3.5" />
                {timeAgo(project.updatedAt)}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Empty State ─────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
        <FolderOpen className="h-7 w-7 text-[var(--primary)]" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No projects yet</h3>
      <p className="mt-1.5 max-w-sm text-center text-xs text-[var(--muted-foreground)]">
        Create your first project to start building your perfect tech stack with AI-powered
        recommendations.
      </p>
      <Link href="/wizard" className="mt-5">
        <Button variant="primary" size="sm">
          <Sparkles className="mr-1.5 h-4 w-4" />
          Start with Wizard
        </Button>
      </Link>
    </div>
  );
}

// ── Page: Projects ──────────────────────────────

export default function ProjectsPage() {
  const activeProjects = PROJECTS.filter((p) => p.status === 'active');
  const draftProjects = PROJECTS.filter((p) => p.status === 'draft');
  const totalCost = PROJECTS.reduce((sum, p) => sum + p.monthlyCost, 0);

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            My Projects
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your tech stack configurations and track costs.
          </p>
        </div>
        <Link href="/wizard">
          <Button variant="primary" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* ── Summary Bar ── */}
      <div className="flex flex-wrap gap-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4">
        <div>
          <p className="text-xs text-[var(--muted-foreground)]">Total Projects</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">{PROJECTS.length}</p>
        </div>
        <div className="border-l border-[var(--border)] pl-6">
          <p className="text-xs text-[var(--muted-foreground)]">Active</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--color-accent-500)]">
            {activeProjects.length}
          </p>
        </div>
        <div className="border-l border-[var(--border)] pl-6">
          <p className="text-xs text-[var(--muted-foreground)]">Drafts</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--color-warning)]">
            {draftProjects.length}
          </p>
        </div>
        <div className="border-l border-[var(--border)] pl-6">
          <p className="text-xs text-[var(--muted-foreground)]">Est. Monthly Cost</p>
          <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">${totalCost}</p>
        </div>
      </div>

      {/* ── Project Grid ── */}
      {PROJECTS.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
