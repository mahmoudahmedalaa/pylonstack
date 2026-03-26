'use client';

import { Check } from 'lucide-react';
import { useCompareStore } from '@/stores/compare-store';
import type { Tool } from '@/data/tools-catalog';

export function CompareCheckbox({ tool }: { tool: Tool }) {
  const { selectedTools, toggleTool } = useCompareStore();
  const isSelected = selectedTools.some((t) => t.id === tool.id);
  const reachedLimit = selectedTools.length >= 3 && !isSelected;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!reachedLimit) toggleTool(tool);
      }}
      disabled={reachedLimit}
      title={reachedLimit ? 'Limit reached (3 tools max)' : 'Compare tool'}
      className={`absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-md border text-xs transition-all ${
        isSelected
          ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm'
          : reachedLimit
            ? 'cursor-not-allowed border-[var(--border)] bg-[var(--muted)]/30 opacity-50'
            : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10'
      }`}
    >
      {isSelected && <Check className="h-4 w-4" />}
    </button>
  );
}
