'use client';

import { useCompareStore } from '@/stores/compare-store';

export function CompareFloatingButton() {
  const { selectedTools, setCompareOpen, clearSelection } = useCompareStore();

  if (selectedTools.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {selectedTools.map((t) => (
            <div
              key={t.id}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--background)] bg-[var(--card)] p-1 shadow-sm"
              title={t.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.logo} alt={t.name} className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
        <span className="text-sm font-medium text-[var(--foreground)]">
          {selectedTools.length} {selectedTools.length === 1 ? 'tool' : 'tools'} selected
        </span>
      </div>
      <div className="h-6 w-px bg-[var(--border)]" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => clearSelection()}
          className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          Clear
        </button>
        <button
          disabled={selectedTools.length < 2}
          onClick={() => setCompareOpen(true)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            selectedTools.length >= 2
              ? 'bg-white text-black shadow-sm hover:bg-white/90'
              : 'cursor-not-allowed bg-[var(--muted)] text-[var(--muted-foreground)]'
          }`}
        >
          Compare
        </button>
      </div>
    </div>
  );
}
