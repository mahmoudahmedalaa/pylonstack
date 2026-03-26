'use client';

import { X } from 'lucide-react';
import { useCompareStore } from '@/stores/compare-store';

export function CompareOverlay() {
  const { selectedTools, isCompareOpen, setCompareOpen, toggleTool, clearSelection } =
    useCompareStore();

  if (!isCompareOpen || selectedTools.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Compare Tools
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Detailed comparison of selected tools side-by-side.
            </p>
          </div>
          <button
            onClick={() => setCompareOpen(false)}
            className="rounded-full bg-[var(--muted)] p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 hover:text-[var(--foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto pb-4">
          <div
            className={`grid gap-6`}
            style={{
              gridTemplateColumns: `minmax(150px, 1fr) repeat(${selectedTools.length}, minmax(280px, 1fr))`,
            }}
          >
            {/* Header Column */}
            <div className="flex flex-col space-y-4 pt-[76px] font-medium text-[var(--muted-foreground)]">
              <div className="flex h-10 items-center">Pricing</div>
              <div className="flex h-10 items-center">Category</div>
              <div className="flex h-10 items-center">Stars</div>
              <div className="flex h-10 items-center">Features</div>
              <div className="flex h-10 items-center">Actions</div>
            </div>

            {/* Tool Columns */}
            {selectedTools.map((tool) => (
              <div
                key={tool.id}
                className="relative flex flex-col space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <button
                  onClick={() => toggleTool(tool)}
                  className="absolute top-3 right-3 text-[var(--muted-foreground)] hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--muted)]/50 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)]">{tool.name}</h3>
                </div>

                <div className="flex h-10 items-center justify-center font-medium text-[var(--foreground)]">
                  {tool.pricing}
                </div>
                <div className="flex h-10 items-center justify-center text-sm">{tool.category}</div>
                <div className="flex h-10 items-center justify-center text-sm">
                  {tool.stars ? Math.floor(tool.stars / 1000) + 'k' : 'N/A'}
                </div>
                <div className="flex flex-1 flex-col justify-start">
                  <p className="text-center text-xs text-[var(--muted-foreground)]">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            onClick={() => clearSelection()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Clear All
          </button>
          <button
            onClick={() => setCompareOpen(false)}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--primary)]/90"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
