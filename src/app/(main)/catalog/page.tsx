'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Search,
  Star,
  ExternalLink,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { Illustration } from '@/components/ui/Illustration';
import { TOOLS, CATEGORIES, type Tool, type Category, getPricingLabel } from '@/data/tools-catalog';
import { formatStars } from '@/lib/helpers';
import { CompareCheckbox } from '@/components/catalog/CompareCheckbox';
import { CompareFloatingButton } from '@/components/catalog/CompareFloatingButton';
import { CompareOverlay } from '@/components/catalog/CompareOverlay';
import { ToolDetailPanel } from '@/components/catalog/ToolDetailPanel';

const ITEMS_PER_PAGE = 24;

// ── Tool Card ───────────────────────────────────

function ToolCard({ tool, onSelect }: { tool: Tool; onSelect: (tool: Tool) => void }) {
  const pricingLabel = getPricingLabel(tool);
  const model = tool.pricingDetails?.model;

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
    >
      {/* Top: Logo + Name */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]/50 p-2">
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
                parent.classList.add('text-sm', 'font-semibold', 'text-[var(--muted-foreground)]');
              }
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-[var(--foreground)]">{tool.name}</h3>
          <Badge variant="outline" className="mt-1">
            {tool.category}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--muted)]/40 px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: Pricing + Stars + Compare */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)]/50 pt-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            model === 'free' || model === 'open_source'
              ? 'bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]'
              : model === 'freemium'
                ? 'bg-blue-500/10 text-blue-500'
                : tool.pricing === 'Free'
                  ? 'bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]'
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
          }`}
        >
          {pricingLabel}
        </span>
        <div className="flex items-center gap-2">
          {tool.stars && (
            <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <Star className="h-3 w-3" />
              {formatStars(tool.stars)}
            </div>
          )}
          <div className="z-10" onClick={(e) => e.stopPropagation()}>
            <CompareCheckbox tool={tool} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category Pill ───────────────────────────────

function CategoryPill({
  category,
  isActive,
  count,
  onClick,
}: {
  category: string;
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide transition-all duration-150 ${
        isActive
          ? 'bg-white text-black shadow-sm'
          : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-white'
      }`}
    >
      {category}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          isActive ? 'bg-white/20 text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Page: Catalog ───────────────────────────────

type PricingFilter = 'all' | 'free' | 'freemium' | 'paid' | 'open_source';
type SortOption = 'name' | 'stars-desc' | 'stars-asc' | 'pricing-asc';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [detailTool, setDetailTool] = useState<Tool | null>(null);
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close filters dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setIsFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = (pricingFilter !== 'all' ? 1 : 0) + (sortBy !== 'name' ? 1 : 0);

  const filteredTools = useMemo(() => {
    let results = TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPricing =
        pricingFilter === 'all' ||
        (pricingFilter === 'free' &&
          (tool.pricingDetails?.model === 'free' ||
            tool.pricingDetails?.model === 'open_source' ||
            tool.pricing === 'Free')) ||
        (pricingFilter === 'freemium' && tool.pricingDetails?.model === 'freemium') ||
        (pricingFilter === 'paid' && tool.pricingDetails?.model === 'paid') ||
        (pricingFilter === 'open_source' &&
          (tool.pricingDetails?.model === 'open_source' || tool.pricingDetails?.isOpenSource));
      return matchesCategory && matchesSearch && matchesPricing;
    });

    // Sort
    if (sortBy === 'stars-desc') {
      results = [...results].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
    } else if (sortBy === 'stars-asc') {
      results = [...results].sort((a, b) => (a.stars ?? 0) - (b.stars ?? 0));
    } else if (sortBy === 'pricing-asc') {
      const getPrice = (t: Tool) => {
        if (!t.pricingDetails) return t.pricing === 'Free' ? 0 : 999;
        const first = t.pricingDetails.tiers.find((tier) => tier.price !== null && tier.price > 0);
        return first?.price ?? (t.pricingDetails.hasFreeTier ? 0 : 999);
      };
      results = [...results].sort((a, b) => getPrice(a) - getPrice(b));
    } else {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [searchQuery, activeCategory, pricingFilter, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TOOLS.length };
    for (const tool of TOOLS) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }, []);

  const visibleTools = useMemo(
    () => filteredTools.slice(0, visibleCount),
    [filteredTools, visibleCount],
  );

  const hasMore = visibleCount < filteredTools.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const handleCategoryChange = useCallback((category: Category | 'All') => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Tech Catalog</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Browse and discover {TOOLS.length}+ tools, frameworks, and services for your stack.
        </p>
      </div>

      {/* ── Search + Controls ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder={`Search ${TOOLS.length} tools...`}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] py-2.5 pr-4 pl-10 text-sm text-white transition-colors placeholder:text-neutral-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <div className="relative" ref={filtersRef}>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                activeFilterCount > 0
                  ? 'border-[var(--primary)]/50 bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filters Dropdown */}
            {isFiltersOpen && (
              <div className="absolute top-full right-0 z-30 mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                    Pricing
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        setPricingFilter('all');
                        setSortBy('name');
                      }}
                      className="text-[10px] font-medium text-[var(--primary)] hover:underline"
                    >
                      Reset all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ['all', 'All'],
                      ['free', 'Free'],
                      ['freemium', 'Freemium'],
                      ['paid', 'Paid'],
                      ['open_source', 'Open Source'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setPricingFilter(value);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        pricingFilter === value
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--muted)]/50 text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                  Sort by
                </div>
                <div className="space-y-1">
                  {(
                    [
                      ['name', 'Name (A→Z)'],
                      ['stars-desc', 'Stars (High→Low)'],
                      ['stars-asc', 'Stars (Low→High)'],
                      ['pricing-asc', 'Price (Low→High)'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                        sortBy === value
                          ? 'bg-[var(--primary)]/10 font-medium text-[var(--primary)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--muted)]/50'
                      }`}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => (
          <CategoryPill
            key={category}
            category={category}
            isActive={activeCategory === category}
            count={categoryCounts[category] || 0}
            onClick={() => handleCategoryChange(category as Category | 'All')}
          />
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="text-xs text-[var(--muted-foreground)]">
        Showing{' '}
        <span className="font-medium text-[var(--foreground)]">
          {Math.min(visibleCount, filteredTools.length)}
        </span>{' '}
        of <span className="font-medium text-[var(--foreground)]">{filteredTools.length}</span>{' '}
        {filteredTools.length === 1 ? 'tool' : 'tools'}
        {activeCategory !== 'All' && (
          <>
            {' '}
            in <span className="font-medium text-[var(--foreground)]">{activeCategory}</span>
          </>
        )}
        {searchQuery && (
          <>
            {' '}
            matching &ldquo;
            <span className="font-medium text-[var(--foreground)]">{searchQuery}</span>&rdquo;
          </>
        )}
      </p>

      {/* ── Tool Grid ── */}
      {visibleTools.length > 0 ? (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-3'
            }
          >
            {visibleTools.map((tool) =>
              viewMode === 'grid' ? (
                <ToolCard key={tool.id} tool={tool} onSelect={setDetailTool} />
              ) : (
                <ListToolRow key={tool.id} tool={tool} onSelect={setDetailTool} />
              ),
            )}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-all hover:border-[var(--ring)]/30 hover:shadow-sm"
              >
                <ChevronDown className="h-4 w-4" />
                Load More
                <span className="text-xs text-[var(--muted-foreground)]">
                  ({filteredTools.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16">
          <Illustration name="searching-everywhere" size="sm" className="opacity-60" />
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">No tools found</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              handleSearchChange('');
              handleCategoryChange('All');
            }}
            className="mt-4 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      <CompareFloatingButton />
      <CompareOverlay />
      <ToolDetailPanel tool={detailTool} onClose={() => setDetailTool(null)} />
    </div>
  );
}

// ── List View Row ───────────────────────────────

function ListToolRow({ tool, onSelect }: { tool: Tool; onSelect: (tool: Tool) => void }) {
  const pricingLabel = getPricingLabel(tool);
  const model = tool.pricingDetails?.model;

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-sm"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]/50 p-2">
        <div className="absolute -top-3 -left-3 scale-75">
          <CompareCheckbox tool={tool} />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tool.logo}
          alt={tool.name}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-[var(--foreground)]">{tool.name}</h3>
          <Badge variant="outline">{tool.category}</Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">{tool.description}</p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          model === 'free' || model === 'open_source' || tool.pricing === 'Free'
            ? 'bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]'
            : model === 'freemium'
              ? 'bg-blue-500/10 text-blue-500'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
        }`}
      >
        {pricingLabel}
      </span>
      {tool.stars && (
        <div className="hidden shrink-0 items-center gap-1 text-xs text-[var(--muted-foreground)] sm:flex">
          <Star className="h-3 w-3" />
          {formatStars(tool.stars)}
        </div>
      )}
      <ExternalLink className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}
