'use client';

import Link from 'next/link';
import {
  LayoutGrid,
  DollarSign,
  Lightbulb,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Package,
  Sparkles,
  Clock,
  ChevronRight,
  Minus,
  Loader2,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useProjects, type ProjectRow } from '@/hooks/use-projects';
import { useCategories } from '@/hooks/use-categories';

// ── Helper: relative time ───────────────────────

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label} ago`;
  }
  return 'just now';
}

// ── Stat Card ───────────────────────────────────

function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-200 hover:border-[color:var(--ring)]/30">
      {/* Subtle accent glow */}
      <div
        className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.12]"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]/50">
          <Icon className="h-5 w-5 text-[var(--muted-foreground)]" />
        </div>
        <div className="flex items-center gap-1 text-xs">
          {trend === 'up' && (
            <>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-accent-500)]" />
              <span className="text-[var(--color-accent-500)]">{change}</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <ArrowDownRight className="h-3.5 w-3.5 text-[var(--color-error)]" />
              <span className="text-[var(--color-error)]">{change}</span>
            </>
          )}
          {trend === 'neutral' && (
            <>
              <Minus className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              <span className="text-[var(--muted-foreground)]">{change}</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
        <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{label}</p>
      </div>
    </div>
  );
}

// ── Project Row ─────────────────────────────────

function ProjectRow({ project }: { project: ProjectRow }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3.5 transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--elevated)]"
    >
      {/* Project icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
        <Layers className="h-5 w-5" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">{project.name}</p>
          <Badge variant={project.status === 'active' ? 'default' : 'outline'}>
            {project.status ?? 'draft'}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
          {project.description ?? 'No description'}
        </p>
      </div>

      {/* Type */}
      {project.projectType && (
        <div className="hidden text-right sm:block">
          <p className="text-xs text-[var(--muted-foreground)]">{project.projectType}</p>
        </div>
      )}

      {/* Timestamp */}
      <p className="hidden shrink-0 text-xs text-[var(--muted-foreground)] lg:block">
        {timeAgo(project.createdAt)}
      </p>

      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

// ── Empty State ─────────────────────────────────

function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
        <Layers className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">No projects yet</h3>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        Create your first project using the AI wizard.
      </p>
      <Link href="/wizard" className="mt-4">
        <Button variant="primary" size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </Button>
      </Link>
    </div>
  );
}

// ── Loading Skeleton ────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="h-10 w-10 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-3 w-64 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    </div>
  );
}

// ── AI Insight Card ─────────────────────────────

function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-primary-500)]/20 bg-gradient-to-br from-[var(--color-primary-500)]/5 to-transparent p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-500)]/10">
          <Sparkles className="h-5 w-5 text-[var(--color-primary-400)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--foreground)]">Welcome to Pylon</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
            Use the <span className="text-[var(--foreground)]">Stack Wizard</span> to generate{' '}
            <span className="font-medium text-[var(--color-accent-500)]">AI-powered</span> tech
            stack recommendations tailored to your project requirements.
          </p>
          <div className="mt-3 flex gap-2">
            <Link href="/wizard">
              <Button size="sm" variant="primary">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Start Wizard
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="sm" variant="ghost">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page: Dashboard ─────────────────────────────

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: categories } = useCategories();

  // Compute stats from live data
  const projectCount = projects?.length ?? 0;
  const totalTools = categories?.reduce((sum, c) => sum + c.toolCount, 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {greeting}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Here&apos;s an overview of your tech stacks and recent activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/catalog">
            <Button variant="ghost" size="sm">
              <Search className="mr-1.5 h-4 w-4" />
              Browse Catalog
            </Button>
          </Link>
          <Link href="/wizard">
            <Button variant="primary" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards (Bento-style grid) ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={projectCount}
          change={projectCount > 0 ? `${projectCount} total` : 'Create one'}
          trend={projectCount > 0 ? 'up' : 'neutral'}
          icon={LayoutGrid}
          accent="var(--primary)"
        />
        <StatCard
          label="Tools Catalog"
          value={totalTools}
          change={`${categories?.length ?? 0} categories`}
          trend="up"
          icon={Package}
          accent="var(--color-accent-500)"
        />
        <StatCard
          label="Monthly Cost"
          value="$0"
          change="Free tier"
          trend="neutral"
          icon={DollarSign}
          accent="var(--color-warning)"
        />
        <StatCard
          label="AI Suggestions"
          value={projectCount}
          change={projectCount > 0 ? 'Available' : 'Run wizard'}
          trend="neutral"
          icon={Lightbulb}
          accent="var(--color-info)"
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Projects (3/5) ── */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-[var(--foreground)]">Your Projects</h2>
                <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
                  {projectCount}
                </span>
              </div>
              <Link
                href="/project"
                className="text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-[var(--border)]/50 p-1">
              {projectsLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => <ProjectRow key={project.id} project={project} />)
              ) : (
                <EmptyProjects />
              )}
            </div>
          </div>

          {/* ── AI Insight ── */}
          <div className="mt-4">
            <AIInsightCard />
          </div>
        </div>

        {/* ── Categories / Stack Overview (2/5) ── */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
                <h2 className="text-sm font-medium text-[var(--foreground)]">Quick Actions</h2>
              </div>
            </div>
            <div className="space-y-1 p-3">
              <Link
                href="/wizard"
                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--elevated)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">AI Stack Wizard</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Get personalized recommendations
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
              </Link>
              <Link
                href="/catalog"
                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-[var(--elevated)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/10">
                  <Search className="h-4 w-4 text-[var(--color-accent-500)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">Browse Catalog</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {totalTools} tools across {categories?.length ?? 0} categories
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
              </Link>
            </div>
          </div>

          {/* ── Stack Overview ── */}
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <h3 className="text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
              Catalog Overview
            </h3>
            <div className="mt-4 space-y-3">
              {categories && categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => {
                  const maxCount = Math.max(...categories.map((c) => c.toolCount), 1);
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--foreground)]">{cat.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {cat.toolCount} tools
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                          style={{ width: `${(cat.toolCount / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
