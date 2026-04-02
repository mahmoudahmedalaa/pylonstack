'use client';

import { useEffect, useCallback } from 'react';
import {
  X,
  Star,
  ExternalLink,
  Check,
  Minus,
  Zap,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Code2,
} from 'lucide-react';
import { useCompareStore } from '@/stores/compare-store';
import { formatStars } from '@/lib/helpers';
import { getPricingLabel, getToolTiers } from '@/data/tools-catalog';
import type { Tool } from '@/data/tools-catalog';
import { getComparisonMeta, type ComparisonMeta } from '@/data/tool-comparison-data';

/* ── Section Header ──────────────────────────── */

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-[var(--border)]/40 pt-5 pb-3">
      <Icon className="h-4 w-4 text-[var(--primary)]" />
      <span className="text-xs font-bold tracking-widest text-[var(--foreground)] uppercase">
        {label}
      </span>
    </div>
  );
}

/* ── Tool Header Card ────────────────────────── */

function ToolHeader({ tool, onRemove }: { tool: Tool; onRemove: () => void }) {
  return (
    <div className="relative flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 rounded-full p-1 text-[var(--muted-foreground)] transition-colors hover:bg-red-500/10 hover:text-red-500"
        title={`Remove ${tool.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--muted)]/50 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tool.logo}
          alt={tool.name}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.textContent = tool.name.charAt(0);
              parent.classList.add('text-lg', 'font-bold', 'text-[var(--muted-foreground)]');
            }
          }}
        />
      </div>
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{tool.name}</h3>
      <span className="mt-0.5 text-[10px] text-[var(--muted-foreground)]">{tool.category}</span>
    </div>
  );
}

/* ── Metric Badge ────────────────────────────── */

function MetricBadge({ value, colorClass }: { value: string; colorClass: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${colorClass}`}
    >
      {value}
    </span>
  );
}

/* ── Learning-curve color helper ─────────────── */

function getLearningCurveColor(lc: ComparisonMeta['learningCurve']) {
  switch (lc) {
    case 'Easy':
      return 'bg-emerald-500/15 text-emerald-600';
    case 'Moderate':
      return 'bg-amber-500/15 text-amber-600';
    case 'Steep':
      return 'bg-red-500/15 text-red-600';
  }
}

function getScalabilityColor(s: ComparisonMeta['scalability']) {
  switch (s) {
    case 'Enterprise':
      return 'bg-violet-500/15 text-violet-600';
    case 'Startup to Enterprise':
      return 'bg-blue-500/15 text-blue-600';
    case 'Startup to Mid':
      return 'bg-sky-500/15 text-sky-500';
    case 'Hobby to Mid':
      return 'bg-slate-500/15 text-slate-500';
  }
}

function getMaturityColor(m: ComparisonMeta['maturity']) {
  switch (m) {
    case 'Battle-tested':
      return 'bg-emerald-500/15 text-emerald-600';
    case 'Mature':
      return 'bg-blue-500/15 text-blue-600';
    case 'Growing':
      return 'bg-amber-500/15 text-amber-600';
    case 'Early':
      return 'bg-red-500/15 text-red-500';
  }
}

function getCommunityColor(c: ComparisonMeta['communityActivity']) {
  switch (c) {
    case 'Very Active':
      return 'bg-emerald-500/15 text-emerald-600';
    case 'Active':
      return 'bg-blue-500/15 text-blue-600';
    case 'Moderate':
      return 'bg-amber-500/15 text-amber-600';
    case 'Low':
      return 'bg-red-500/15 text-red-500';
  }
}

function getTSColor(ts: ComparisonMeta['typeScriptSupport']) {
  switch (ts) {
    case 'Native':
      return 'bg-blue-600/15 text-blue-600';
    case 'First-class':
      return 'bg-blue-500/15 text-blue-600';
    case 'Good':
      return 'bg-sky-500/15 text-sky-500';
    case 'Partial':
      return 'bg-amber-500/15 text-amber-600';
    case 'None':
      return 'bg-slate-500/15 text-slate-500';
  }
}

/* ── Value Cell ──────────────────────────────── */

function ValueCell({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg px-3 py-2.5 text-center text-sm ${
        highlight ? 'bg-[var(--color-accent-500)]/5 ring-1 ring-[var(--color-accent-500)]/20' : ''
      }`}
    >
      {children}
    </div>
  );
}

/* ── Main Overlay ────────────────────────────── */

export function CompareOverlay() {
  const { selectedTools, isCompareOpen, setCompareOpen, toggleTool, clearSelection } =
    useCompareStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCompareOpen(false);
    },
    [setCompareOpen],
  );

  useEffect(() => {
    if (isCompareOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCompareOpen, handleKeyDown]);

  if (!isCompareOpen || selectedTools.length === 0) return null;

  const colCount = selectedTools.length;
  const metas = selectedTools.map((tool) => getComparisonMeta(tool));

  // Find the "best" for numeric metrics
  const bestStarsIdx = selectedTools.reduce(
    (best, tool, i) => ((tool.stars ?? 0) > (selectedTools[best].stars ?? 0) ? i : best),
    0,
  );

  const getFirstPaidPrice = (tool: Tool): number => {
    if (!tool.pricingDetails) return Infinity;
    const firstPaid = tool.pricingDetails.tiers.find((t) => t.price !== null && t.price > 0);
    return firstPaid?.price ?? Infinity;
  };

  const bestPricingIdx = selectedTools.reduce(
    (best, _, i) =>
      getFirstPaidPrice(selectedTools[i]) < getFirstPaidPrice(selectedTools[best]) ? i : best,
    0,
  );

  const gridStyle = { gridTemplateColumns: `repeat(${colCount}, 1fr)` };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setCompareOpen(false)}
      />

      {/* Overlay Panel */}
      <div className="fixed inset-x-4 bottom-0 z-50 mx-auto max-h-[90vh] max-w-5xl overflow-hidden rounded-t-2xl border border-b-0 border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-x-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Compare Tools
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Side-by-side comparison of {selectedTools.length} tools — key metrics to help you
              decide
            </p>
          </div>
          <button
            onClick={() => setCompareOpen(false)}
            className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Tool Headers */}
          <div className="grid gap-4" style={gridStyle}>
            {selectedTools.map((tool) => (
              <ToolHeader key={tool.id} tool={tool} onRemove={() => toggleTool(tool)} />
            ))}
          </div>

          {/* ────────── OVERVIEW SECTION ────────── */}
          <SectionHeader icon={BarChart3} label="Overview" />

          {/* Learning Curve */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Learning Curve
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <MetricBadge
                    value={meta.learningCurve}
                    colorClass={getLearningCurveColor(meta.learningCurve)}
                  />
                </ValueCell>
              ))}
            </div>
          </div>

          {/* Scalability */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Scalability
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <MetricBadge
                    value={meta.scalability}
                    colorClass={getScalabilityColor(meta.scalability)}
                  />
                </ValueCell>
              ))}
            </div>
          </div>

          {/* Maturity */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Maturity
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <MetricBadge value={meta.maturity} colorClass={getMaturityColor(meta.maturity)} />
                </ValueCell>
              ))}
            </div>
          </div>

          {/* ────────── PRICING SECTION ────────── */}
          <SectionHeader icon={Zap} label="Pricing" />

          {/* Pricing Model */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Pricing Model
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {selectedTools.map((tool, i) => {
                const label = getPricingLabel(tool);
                const hasFree = tool.pricingDetails?.hasFreeTier ?? tool.pricing === 'Free';
                return (
                  <ValueCell key={tool.id} highlight={i === bestPricingIdx}>
                    <span className="font-semibold text-[var(--foreground)]">{label}</span>
                    {hasFree ? (
                      <span className="mt-1 flex items-center gap-1 text-xs text-[var(--color-accent-500)]">
                        <Check className="h-3 w-3" /> Free tier available
                      </span>
                    ) : (
                      <span className="mt-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Minus className="h-3 w-3" /> No free tier
                      </span>
                    )}
                  </ValueCell>
                );
              })}
            </div>
          </div>

          {/* Pricing Tiers Detail */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Pricing Tiers
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {selectedTools.map((tool) => {
                const tiers = getToolTiers(tool);
                return (
                  <ValueCell key={tool.id}>
                    <div className="flex flex-wrap justify-center gap-1">
                      {tiers.map((tier, j) => (
                        <span
                          key={j}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            tier.price === 0
                              ? 'bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]'
                              : tier.price === null
                                ? 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                                : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {tier.name}:{' '}
                          {tier.price === null
                            ? 'Custom'
                            : tier.price === 0
                              ? 'Free'
                              : `$${tier.price}/mo`}
                        </span>
                      ))}
                    </div>
                  </ValueCell>
                );
              })}
            </div>
          </div>

          {/* ────────── COMMUNITY + ECOSYSTEM SECTION ────────── */}
          <SectionHeader icon={Users} label="Community & Ecosystem" />

          {/* Popularity / Stars */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              GitHub Stars
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {selectedTools.map((tool, i) => (
                <ValueCell key={tool.id} highlight={i === bestStarsIdx}>
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {tool.stars ? formatStars(tool.stars) : 'N/A'}
                  </span>
                  <span className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {!tool.stars
                      ? 'No data'
                      : tool.stars >= 50000
                        ? 'Very Popular'
                        : tool.stars >= 10000
                          ? 'Popular'
                          : tool.stars >= 1000
                            ? 'Growing'
                            : 'Emerging'}
                  </span>
                </ValueCell>
              ))}
            </div>
          </div>

          {/* Ecosystem Size */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Ecosystem Size
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {meta.ecosystemSize}
                  </span>
                </ValueCell>
              ))}
            </div>
          </div>

          {/* Community Activity */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              Community Activity
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <MetricBadge
                    value={meta.communityActivity}
                    colorClass={getCommunityColor(meta.communityActivity)}
                  />
                </ValueCell>
              ))}
            </div>
          </div>

          {/* TypeScript Support */}
          <div className="mb-4">
            <span className="mb-2 block text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)] uppercase">
              TypeScript Support
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <div className="flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-blue-500" />
                    <MetricBadge
                      value={meta.typeScriptSupport}
                      colorClass={getTSColor(meta.typeScriptSupport)}
                    />
                  </div>
                </ValueCell>
              ))}
            </div>
          </div>

          {/* ────────── BEST FOR SECTION ────────── */}
          <SectionHeader icon={BookOpen} label="Best For" />
          <div className="mb-4 grid gap-4" style={gridStyle}>
            {metas.map((meta, i) => (
              <ValueCell key={selectedTools[i].id}>
                <ul className="space-y-1 text-left">
                  {meta.bestFor.map((use, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-1.5 text-xs text-[var(--foreground)]"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--color-accent-500)]" />
                      {use}
                    </li>
                  ))}
                </ul>
              </ValueCell>
            ))}
          </div>

          {/* ────────── PROS & CONS SECTION ────────── */}
          <SectionHeader icon={TrendingUp} label="Strengths & Weaknesses" />

          {/* Pros */}
          <div className="mb-4">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-emerald-600 uppercase">
              <ThumbsUp className="h-3 w-3" /> Strengths
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <ul className="space-y-1.5 text-left">
                    {meta.pros.map((pro, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-1.5 text-xs text-[var(--foreground)]"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </ValueCell>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div className="mb-4">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-red-500 uppercase">
              <ThumbsDown className="h-3 w-3" /> Weaknesses
            </span>
            <div className="grid gap-4" style={gridStyle}>
              {metas.map((meta, i) => (
                <ValueCell key={selectedTools[i].id}>
                  <ul className="space-y-1.5 text-left">
                    {meta.cons.map((con, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-1.5 text-xs text-[var(--foreground)]"
                      >
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </ValueCell>
              ))}
            </div>
          </div>

          {/* ────────── TAGS SECTION ────────── */}
          <SectionHeader icon={Shield} label="Tags & Skills" />
          <div className="mb-4 grid gap-4" style={gridStyle}>
            {selectedTools.map((tool) => (
              <ValueCell key={tool.id}>
                <div className="flex flex-wrap justify-center gap-1">
                  {tool.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--muted)]/50 px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </ValueCell>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-3">
          <button
            onClick={() => clearSelection()}
            className="text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            Clear All
          </button>
          <div className="flex items-center gap-2">
            {selectedTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all hover:bg-[var(--muted)]"
              >
                {tool.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
