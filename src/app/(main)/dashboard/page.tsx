'use client';

import { SpotlightCard } from '@/components/premium/SpotlightCard';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { BorderBeam } from '@/components/premium/BorderBeam';
import { NumberTicker } from '@/components/premium/NumberTicker';
import { AnimatedGradientText } from '@/components/premium/AnimatedGradientText';
import { Illustration } from '@/components/ui/Illustration';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Layers,
  ChevronRight,
  Plus,
  Search,
  LayoutGrid,
  Package,
  DollarSign,
  Lightbulb,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useProjects, type ProjectRow } from '@/hooks/use-projects';
import { useCategories } from '@/hooks/use-categories';
import { useSubscription } from '@/hooks/useSubscription';
import { UpgradeModal, useUpgradeModal } from '@/components/UpgradeModal';

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
  value: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <SpotlightCard
      glowColor={
        accent.includes('var')
          ? accent.includes('primary')
            ? 'rgba(99, 102, 241, 0.15)'
            : 'rgba(16, 185, 129, 0.15)'
          : accent
      }
      className="flex flex-col justify-between p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
          {trend === 'up' && (
            <>
              <ArrowUpRight className="h-3 w-3 text-[var(--color-accent-500)]" />
              <span className="text-[var(--color-accent-500)]">{change}</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <ArrowDownRight className="h-3 w-3 text-[var(--color-error)]" />
              <span className="text-[var(--color-error)]">{change}</span>
            </>
          )}
          {trend === 'neutral' && (
            <>
              <Minus className="h-3 w-3 text-[var(--muted-foreground)]" />
              <span className="text-[var(--muted-foreground)]">{change}</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            <NumberTicker value={value} />
          </span>
          {label.toLowerCase().includes('cost') && (
            <span className="text-sm font-medium text-[var(--muted-foreground)]">/mo</span>
          )}
        </div>
        <p className="mt-1 text-[11px] font-bold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
          {label}
        </p>
      </div>
    </SpotlightCard>
  );
}

// ── Project Row ─────────────────────────────────

function ProjectRow({ project }: { project: ProjectRow }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="group flex items-center gap-4 rounded-xl border border-transparent px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-secondary hover:shadow-md"
    >
      {/* Project icon with pulse on hover */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[var(--primary)] transition-transform duration-300 group-hover:scale-105">
        <Layers className="h-5 w-5" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
            {project.name}
          </p>
          <Badge
            variant={project.status === 'active' ? 'default' : 'outline'}
            className="shadow-sm"
          >
            {project.status ?? 'draft'}
          </Badge>
        </div>
        <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
          {project.description ?? 'No description'}
        </p>
      </div>

      {/* Type */}
      {project.projectType && (
        <div className="hidden text-right sm:block">
          <p className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-bold tracking-wider text-[var(--muted-foreground)] uppercase">
            {project.projectType}
          </p>
        </div>
      )}

      {/* Timestamp */}
      <p className="hidden shrink-0 text-sm font-medium text-[var(--muted-foreground)] lg:block">
        {timeAgo(project.createdAt)}
      </p>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all duration-300 group-hover:bg-secondary">
        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--foreground)]" />
      </div>
    </Link>
  );
}

// ── Empty State ─────────────────────────────────

function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Illustration name="blank-canvas" size="md" glow glowColor="var(--primary)" float />
      <h3 className="mt-6 text-base font-semibold text-[var(--foreground)]">No projects yet</h3>
      <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
        Create your first project using our AI Advisor or assemble it manually from our catalog of
        230+ tools.
      </p>
      <Link href="/create" className="mt-6">
        <PremiumButton size="md">
          <Plus className="mr-1.5 h-4 w-4" />
          New Project
        </PremiumButton>
      </Link>
    </div>
  );
}

// ── Loading Skeleton ────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="h-10 w-10 animate-pulse rounded-lg bg-secondary" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-64 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}

// ── AI Insight Card ─────────────────────────────

function AIInsightCard({ handleNewProject }: { handleNewProject: (e: React.MouseEvent) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-[var(--primary)]/50">
      <BorderBeam
        size={250}
        duration={12}
        delay={9}
        colorFrom="var(--primary)"
        colorTo="var(--accent)"
      />

      <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row">
        {/* Illustration instead of icon */}
        <div className="hidden shrink-0 md:block">
          <Illustration
            name="artificial-intelligence"
            size="lg"
            glow
            glowColor="var(--primary)"
            float
          />
        </div>
        <div className="flex-1">
          <AnimatedGradientText className="mx-0 mb-4 px-3 py-1">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--foreground)] uppercase">
              ✨ AI Powered Builder
            </span>
          </AnimatedGradientText>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Ready to ship your next big idea?
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Our AI Advisor can analyze your project requirements and recommend a perfectly optimized
            tech stack in seconds. Stop guessing and start building with confidence.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/create" onClick={handleNewProject}>
              <PremiumButton variant="accent" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Stack
              </PremiumButton>
            </Link>
            <Link href="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-border bg-secondary px-8 backdrop-blur hover:border-[var(--primary)]/50 hover:bg-secondary"
              >
                Explore Components
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
  const { canCreateProject, isPro, isFree } = useSubscription();
  const upgradeModal = useUpgradeModal();

  // Compute stats from live data
  const projectCount = projects?.length ?? 0;
  const totalCost = projects?.reduce((s, p) => s + parseFloat(p.totalMonthlyCost || '0'), 0) ?? 0;
  const totalTools = categories?.reduce((sum, c) => sum + c.toolCount, 0) ?? 0;

  /** Gate-aware handler for "New Project" buttons */
  const handleNewProject = (e: React.MouseEvent) => {
    if (!canCreateProject(projectCount)) {
      e.preventDefault();
      upgradeModal.show(
        "You've reached the free plan limit of 3 projects. Upgrade to Pro for unlimited projects.",
      );
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <AnimatedGradientText className="mx-0 mb-2 px-3 py-1">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--foreground)]/80 uppercase">
              {greeting}, Architect
            </span>
          </AnimatedGradientText>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">Command Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/catalog">
            <Button
              variant="ghost"
              size="lg"
              className="text-[var(--muted-foreground)] hover:bg-secondary hover:text-[var(--foreground)]"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Catalog
            </Button>
          </Link>
          <Link href="/create" onClick={handleNewProject}>
            <PremiumButton size="md" className="px-8">
              <Plus className="mr-2 h-4 w-4" />
              New Project
              {isFree && <span className="ml-2 text-[10px] opacity-60">({projectCount}/3)</span>}
            </PremiumButton>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Projects"
          value={projectCount}
          change={projectCount > 0 ? `${projectCount} deployed` : 'Launch one'}
          trend={projectCount > 0 ? 'up' : 'neutral'}
          icon={LayoutGrid}
          accent="var(--primary)"
        />
        <StatCard
          label="Tools in Stack"
          value={totalTools}
          change={`${categories?.length ?? 0} clusters`}
          trend="up"
          icon={Package}
          accent="var(--color-accent-500)"
        />
        <StatCard
          label="Estimated Cost"
          value={totalCost}
          change={projects && projects.length > 0 ? 'Optimized' : 'Start free'}
          trend="neutral"
          icon={DollarSign}
          accent="var(--color-warning)"
        />
        <StatCard
          label="AI Insights"
          value={projectCount}
          change={isPro ? 'Pro Active' : 'Upgrade'}
          trend={isPro ? 'up' : 'neutral'}
          icon={Lightbulb}
          accent="var(--color-info)"
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Projects (3/5) ── */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold tracking-widest text-[var(--foreground)] uppercase">
                  Your Projects
                </h2>
                <Badge variant="secondary" className="bg-secondary text-[10px]">
                  {projectCount}
                </Badge>
              </div>
              <Link
                href="/project"
                className="text-xs font-bold tracking-wider text-[var(--muted-foreground)] uppercase transition-colors hover:text-[var(--foreground)]"
              >
                Full Archive
              </Link>
            </div>
            <div className="divide-y divide-border p-2">
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
          <AIInsightCard handleNewProject={handleNewProject} />
        </div>

        {/* ── Sidebar (2/5) ── */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
                <h2 className="text-sm font-bold tracking-widest text-[var(--foreground)] uppercase">
                  Quick Nav
                </h2>
              </div>
            </div>
            <div className="space-y-1 p-3">
              <Link
                href="/create"
                onClick={handleNewProject}
                className="group flex items-center gap-4 rounded-xl px-4 py-4 transition-all hover:bg-secondary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] transition-transform group-hover:scale-110">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--foreground)]">Stack Wizard</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Generate production-ready stacks
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--foreground)]" />
              </Link>
              <Link
                href="/catalog"
                className="group flex items-center gap-4 rounded-xl px-4 py-4 transition-all hover:bg-secondary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)] transition-transform group-hover:scale-110">
                  <Search className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--foreground)]">Cloud Catalog</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {totalTools} professional tools
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--foreground)]" />
              </Link>
            </div>
          </div>

          {/* ── Catalog Progress ── */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-[var(--muted-foreground)] uppercase">
              Growth Velocity
            </h3>
            <div className="mt-6 space-y-5">
              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map((cat) => {
                  const maxCount = Math.max(...categories.map((c) => c.toolCount), 1);
                  return (
                    <div key={cat.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--foreground)]/80">{cat.name}</span>
                        <span className="text-[10px] font-bold text-[var(--muted-foreground)]">
                          {cat.toolCount} UNITS
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--color-accent-500)] transition-all duration-1000 ease-out"
                          style={{ width: `${(cat.toolCount / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onClose={upgradeModal.hide}
        reason={upgradeModal.reason}
      />
    </div>
  );
}
