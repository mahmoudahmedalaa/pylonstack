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
import { Button } from '@/components/ui';
import { useProjects, type ProjectRow, type StackLayer } from '@/hooks/use-projects';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BlurIn } from '@/components/ui/blur-in';
import { motion } from 'framer-motion';

// ── Helpers ─────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Project Card ────────────────────────────────

function ProjectCard({ project }: { project: ProjectRow }) {
  const stackData = project.stackData as StackLayer[] | null;
  const toolCount =
    stackData?.reduce((sum: number, layer: StackLayer) => sum + (layer.tools?.length || 0), 0) || 0;

  return (
    <Link href={`/project/${project.id}`} className="block">
      <SpotlightCard className="h-full overflow-hidden border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:border-[var(--color-accent-500)]/50">
        {/* Top accent line based on status */}
        <div
          className={`absolute top-0 left-0 h-1 w-full ${
            project.status === 'active'
              ? 'bg-gradient-to-r from-[var(--color-accent-500)] to-[var(--color-accent-600)]'
              : project.status === 'draft'
                ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                : 'bg-gradient-to-r from-slate-400 to-slate-500'
          }`}
        />

        <div className="p-6 pt-7 text-left">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 text-[var(--primary)] shadow-sm">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                  {project.name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      project.status === 'active'
                        ? 'animate-pulse bg-emerald-500'
                        : project.status === 'draft'
                          ? 'bg-amber-400'
                          : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold tracking-wider text-[var(--muted-foreground)] uppercase">
                    {project.status || 'Archived'}
                  </span>
                </div>
              </div>
            </div>
            <button className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="mt-4 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-[var(--muted-foreground)]">
            {project.description || 'No description provided for this project.'}
          </p>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[var(--border)]/50 py-4">
            <div className="flex flex-col items-center justify-center gap-1 border-r border-[var(--border)]/30">
              <Package className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span className="text-xs font-medium text-[var(--foreground)]">{toolCount}</span>
              <span className="text-[9px] tracking-tighter text-[var(--muted-foreground)] uppercase">
                Tools
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 border-r border-[var(--border)]/30">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-[var(--foreground)]">
                {!project.totalMonthlyCost || project.totalMonthlyCost === '0'
                  ? '0'
                  : project.totalMonthlyCost}
              </span>
              <span className="text-[9px] tracking-tighter text-[var(--muted-foreground)] uppercase">
                Cost/mo
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium text-[var(--foreground)]">
                {timeAgo(project.updatedAt)}
              </span>
              <span className="text-[9px] tracking-tighter text-[var(--muted-foreground)] uppercase">
                Updated
              </span>
            </div>
          </div>

          {/* CTA Footer */}
          <div className="group mt-4 flex items-center justify-between text-xs font-medium text-[var(--primary)]">
            <span className="translate-x-2 opacity-0 transition-opacity duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              View Project Details
            </span>
            <div className="ml-auto flex items-center gap-1">
              <span>Go back to dashboard</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}

interface SummaryStatProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  prefix?: string;
}

function SummaryStat({ label, value, icon: Icon, colorClass, prefix = '' }: SummaryStatProps) {
  return (
    <SpotlightCard className="min-w-[200px] flex-1 border border-[var(--border)]/50 bg-[var(--card)] p-5">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass} bg-opacity-10 shadow-sm`}
        >
          <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
              {prefix}
            </span>
            <NumberTicker
              value={typeof value === 'string' ? parseFloat(value) : value}
              className="text-xl font-bold tracking-tight text-[var(--foreground)]"
            />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

// ── Empty State ─────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)]/30 py-24 backdrop-blur-sm"
    >
      <div className="relative">
        <div className="absolute -inset-4 animate-pulse rounded-full bg-[var(--primary)]/10 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5">
          <FolderOpen className="h-10 w-10 text-[var(--primary)]" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-[var(--foreground)]">
        Your project archive is empty
      </h3>
      <p className="mt-2 max-w-sm px-6 text-center text-sm text-[var(--muted-foreground)]">
        Every great project starts with a single step. Use our AI wizard to generate the perfect
        tech stack for your next big idea.
      </p>
      <Link href="/create" className="mt-8">
        <Button
          size="lg"
          className="rounded-full bg-[var(--primary)] px-8 text-white shadow-[var(--primary)]/20 shadow-lg transition-all hover:scale-105 hover:bg-[var(--primary-dark)] active:scale-95"
        >
          <Sparkles className="mr-2 h-5 w-5 fill-current" />
          Generate New Stack
        </Button>
      </Link>
    </motion.div>
  );
}

// ── Loading Skeleton ────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)]/50"
        />
      ))}
    </div>
  );
}

// ── Page: Projects ──────────────────────────────

export default function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();

  const activeProjects = projects?.filter((p) => p.status === 'active') || [];
  const draftProjects = projects?.filter((p) => p.status === 'draft') || [];
  const totalCost =
    projects?.reduce((sum, p) => sum + parseFloat(p.totalMonthlyCost || '0'), 0) || 0;

  return (
    <div className="space-y-10 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BlurIn
            word="My Projects"
            className="text-left text-4xl font-bold tracking-tight text-[var(--foreground)]"
          />
          <p className="mt-2 max-w-md text-base text-[var(--muted-foreground)]">
            Manage your technology ecosystem, explore different stack configurations, and monitor
            infrastructure costs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/create">
            <Button
              variant="primary"
              size="lg"
              className="group rounded-full px-6 shadow-[var(--primary)]/10 shadow-xl transition-all hover:-translate-y-0.5"
            >
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="flex flex-wrap gap-4">
        <SummaryStat
          label="Total Projects"
          value={isLoading ? 0 : projects?.length || 0}
          icon={Layers}
          colorClass="bg-blue-500"
        />
        <SummaryStat
          label="Active Stacks"
          value={isLoading ? 0 : activeProjects.length}
          icon={Sparkles}
          colorClass="bg-[var(--color-accent-500)]"
        />
        <SummaryStat
          label="Development Drafts"
          value={isLoading ? 0 : draftProjects.length}
          icon={Plus}
          colorClass="bg-amber-500"
        />
        <SummaryStat
          label="Infrastructure Cost"
          value={isLoading ? 0 : Math.round(totalCost)}
          icon={DollarSign}
          colorClass="bg-emerald-500"
          prefix="$"
        />
      </div>

      {/* ── Project Grid ── */}
      <div className="relative">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Plus className="h-6 w-6 rotate-45" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Connection Error</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-[var(--muted-foreground)]">
              We encountered a problem while synchronizing your project data.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 rounded-full px-6"
              onClick={() => window.location.reload()}
            >
              Reconnect Now
            </Button>
          </div>
        ) : projects && projects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
          >
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
