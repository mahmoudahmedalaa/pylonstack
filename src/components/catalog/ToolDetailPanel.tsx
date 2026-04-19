'use client';

import { useEffect, useCallback } from 'react';
import { X, Star, ExternalLink, Globe, Github, Check, Tag } from 'lucide-react';
import { formatStars } from '@/lib/helpers';
import type { Tool } from '@/data/tools-catalog';
import { getPricingLabel, getToolTiers } from '@/data/tools-catalog';

interface ToolDetailPanelProps {
  tool: Tool | null;
  onClose: () => void;
}

export function ToolDetailPanel({ tool, onClose }: ToolDetailPanelProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (tool) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [tool, handleKeyDown]);

  if (!tool) return null;

  const pricingLabel = getPricingLabel(tool);
  const tiers = getToolTiers(tool);
  const model = tool.pricingDetails?.model;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl sm:max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            ← Back to Catalog
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Tool Identity */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)]/50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.logo}
                alt={tool.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.textContent = tool.name.charAt(0);
                    parent.classList.add('text-2xl', 'font-bold', 'text-[var(--muted-foreground)]');
                  }
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                {tool.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {tool.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-[var(--foreground)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {new URL(tool.website).hostname}
                </a>
                {tool.stars && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {formatStars(tool.stars)}
                  </span>
                )}
                {(model === 'open_source' || model === 'free') && (
                  <span className="flex items-center gap-1 text-[var(--color-accent-500)]">
                    <Github className="h-3.5 w-3.5" />
                    Open Source
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
              Pricing Tiers
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {tiers.map((tier, i) => (
                <div
                  key={i}
                  className={`flex flex-col rounded-xl border p-3 transition-all ${
                    tier.price === 0
                      ? 'border-[var(--color-accent-500)]/30 bg-[var(--color-accent-500)]/5'
                      : 'border-[var(--border)] bg-[var(--card)]'
                  }`}
                >
                  <span className="text-xs font-medium text-[var(--foreground)]">{tier.name}</span>
                  <span className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                    {tier.price === null ? 'Custom' : tier.price === 0 ? 'Free' : `$${tier.price}`}
                  </span>
                  {tier.price !== null && tier.price > 0 && tier.period && (
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      /{tier.period}
                    </span>
                  )}
                  {tier.limits && (
                    <span className="mt-1.5 text-[10px] leading-snug text-[var(--muted-foreground)]">
                      {tier.limits}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Overall Pricing Summary */}
          <section className="mt-6">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
              <span className="text-xs text-[var(--muted-foreground)]">Pricing Model:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  model === 'free' || model === 'open_source'
                    ? 'bg-[var(--color-accent-500)]/10 text-[var(--color-accent-500)]'
                    : model === 'freemium'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                }`}
              >
                {pricingLabel}
              </span>
              {tool.pricingDetails?.hasFreeTier && (
                <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-accent-500)]">
                  <Check className="h-3 w-3" /> Free tier
                </span>
              )}
            </div>
          </section>

          {/* Best For */}
          {tool.description && (
            <section className="mt-6">
              <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                Best For
              </h3>
              <p className="text-sm leading-relaxed text-[var(--foreground)]">{tool.description}</p>
            </section>
          )}

          {/* Tags */}
          {tool.tags.length > 0 && (
            <section className="mt-6">
              <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)]/50 px-2.5 py-1 text-xs text-[var(--muted-foreground)]"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Category */}
          <section className="mt-6">
            <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
              Category
            </h3>
            <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
              {tool.category}
            </span>
          </section>

          {/* Implementation Time */}
          {tool.pricingDetails?.estimatedImplementationTimeDays && (
            <section className="mt-6">
              <h3 className="mb-2 text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
                Estimated Setup Time
              </h3>
              <p className="text-sm text-[var(--foreground)]">
                ~{tool.pricingDetails.estimatedImplementationTimeDays} day
                {tool.pricingDetails.estimatedImplementationTimeDays > 1 ? 's' : ''}
              </p>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 border-t border-[var(--border)] px-6 py-4">
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black shadow-sm transition-all hover:bg-white/90"
          >
            Visit Website
            <ExternalLink className="h-4 w-4" />
          </a>
          {tool.pricingDetails?.pricingUrl && (
            <a
              href={tool.pricingDetails.pricingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-[var(--muted)]"
            >
              View Pricing
            </a>
          )}
        </div>
      </div>
    </>
  );
}
