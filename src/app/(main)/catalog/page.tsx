'use client';

import { useState, useMemo } from 'react';
import { Search, Star, ExternalLink, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import { Badge } from '@/components/ui';
import { TOOLS, CATEGORIES, formatStars, type Tool, type Category } from '@/lib/mock-data';

// ── Tool Card ───────────────────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-200 hover:border-[color:var(--ring)]/30 hover:shadow-[var(--shadow-card)]"
    >
      {/* Top: Logo + Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
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
                  parent.classList.add(
                    'text-sm',
                    'font-semibold',
                    'text-[var(--muted-foreground)]',
                  );
                }
              }}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground)]">{tool.name}</h3>
            <Badge variant="outline" className="mt-1">
              {tool.category}
            </Badge>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Description */}
      <p className="mt-3 flex-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
        {tool.description}
      </p>

      {/* Bottom: Pricing + Stars */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)]/50 pt-3">
        <span
          className={`text-xs font-medium ${
            tool.pricing === 'Free'
              ? 'text-[var(--color-accent-500)]'
              : tool.pricing.startsWith('$')
                ? 'text-[var(--color-warning)]'
                : 'text-[var(--muted-foreground)]'
          }`}
        >
          {tool.pricing}
        </span>
        {tool.stars && (
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Star className="h-3 w-3" />
            {formatStars(tool.stars)}
          </div>
        )}
      </div>
    </a>
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
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
        isActive
          ? 'bg-[var(--primary)] text-white shadow-sm'
          : 'bg-[var(--muted)]/50 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
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

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: TOOLS.length };
    for (const tool of TOOLS) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Tech Catalog
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Browse and discover tools, frameworks, and services for your stack.
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] py-2.5 pr-4 pl-10 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] focus:outline-none"
          />
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
          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>
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
            onClick={() => setActiveCategory(category as Category | 'All')}
          />
        ))}
      </div>

      {/* ── Results Count ── */}
      <p className="text-xs text-[var(--muted-foreground)]">
        Showing <span className="font-medium text-[var(--foreground)]">{filteredTools.length}</span>{' '}
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
      {filteredTools.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'space-y-3'
          }
        >
          {filteredTools.map((tool) =>
            viewMode === 'grid' ? (
              <ToolCard key={tool.id} tool={tool} />
            ) : (
              <ListToolRow key={tool.id} tool={tool} />
            ),
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-16">
          <Search className="h-8 w-8 text-[var(--muted-foreground)]" />
          <p className="mt-3 text-sm font-medium text-[var(--foreground)]">No tools found</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
            }}
            className="mt-4 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

// ── List View Row ───────────────────────────────

function ListToolRow({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition-all duration-200 hover:border-[color:var(--ring)]/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]/50 p-2">
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
        className={`shrink-0 text-xs font-medium ${
          tool.pricing === 'Free'
            ? 'text-[var(--color-accent-500)]'
            : 'text-[var(--muted-foreground)]'
        }`}
      >
        {tool.pricing}
      </span>
      {tool.stars && (
        <div className="hidden shrink-0 items-center gap-1 text-xs text-[var(--muted-foreground)] sm:flex">
          <Star className="h-3 w-3" />
          {formatStars(tool.stars)}
        </div>
      )}
      <ExternalLink className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
    </a>
  );
}
