'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Layers, Clock, ChevronUp } from 'lucide-react';

interface StickyCostBarProps {
  totalTools: number;
  estimatedMonthlyCost: number;
  estimatedSetupDays: number;
}

export function StickyCostBar({ totalTools, estimatedMonthlyCost, estimatedSetupDays }: StickyCostBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the TLDR summary (roughly 400px)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-medium text-[var(--foreground)]">{totalTools}</span>
            <span className="hidden sm:inline">tools</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium text-[var(--foreground)]">~{estimatedSetupDays}d</span>
            <span className="hidden sm:inline">setup</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-[var(--color-success-500)]" />
            <span className="text-sm font-semibold text-[var(--foreground)] tabular-nums">
              {estimatedMonthlyCost > 0 ? `$${estimatedMonthlyCost}/mo` : 'Starts Free'}
            </span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Back to top"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
