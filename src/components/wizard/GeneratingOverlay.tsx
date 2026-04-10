'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCcw, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui';

/* ─── Operation log entries ────────────────────────────────────── */

interface LogEntry {
  label: string;
  durationMs: number; // simulated time before marking complete
}

const OPERATION_LOG: LogEntry[] = [
  { label: 'Parsing project requirements', durationMs: 1800 },
  { label: 'Evaluating 230+ tools in catalog', durationMs: 2600 },
  { label: 'Matching Auth providers to team size', durationMs: 2200 },
  { label: 'Scoring database engines for workload', durationMs: 2400 },
  { label: 'Projecting infrastructure cost per phase', durationMs: 3000 },
  { label: 'Optimising stack for selected priorities', durationMs: 2800 },
  { label: 'Generating phased roadmap', durationMs: 3200 },
  { label: 'Finalising recommendation', durationMs: 2000 },
];

/* ─── Skeleton rows that hint at the results layout ─────────── */

function ResultSkeleton() {
  return (
    <div className="mt-8 w-full max-w-xl space-y-3 opacity-40">
      {/* Header skeleton */}
      <div className="h-5 w-48 animate-pulse rounded bg-[var(--muted)]" />
      <div className="h-3 w-72 animate-pulse rounded bg-[var(--muted)]/60" />

      {/* Table skeleton rows */}
      <div className="mt-4 divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--card)]/50">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="h-4 w-4 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3 flex-1 animate-pulse rounded bg-[var(--muted)]/80" style={{ maxWidth: `${60 + i * 5}%` }} />
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--muted)]/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Terminal log line ─────────────────────────────────────── */

function LogLine({
  entry,
  status,
}: {
  entry: LogEntry;
  status: 'pending' | 'running' | 'done';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 font-mono text-[13px] leading-6"
    >
      {status === 'done' && (
        <span className="text-[var(--primary)]">✓</span>
      )}
      {status === 'running' && (
        <span className="inline-block w-3 animate-pulse text-[var(--muted-foreground)]">▸</span>
      )}
      {status === 'pending' && (
        <span className="w-3 text-[var(--muted-foreground)]/50">·</span>
      )}
      <span
        className={
          status === 'done'
            ? 'text-[var(--foreground)]'
            : status === 'running'
              ? 'text-[var(--foreground)]/80'
              : 'text-[var(--muted-foreground)]/60'
        }
      >
        {entry.label}
        {status === 'running' && (
          <span className="ml-0.5 inline-block animate-pulse">…</span>
        )}
      </span>
    </motion.div>
  );
}

/* ─── Error state with precise recovery CTAs ───────────────── */

function ErrorPanel({
  error,
  onRetry,
  onCancel,
}: {
  error: string;
  onRetry?: () => void;
  onCancel?: () => void;
}) {
  // Derive a stoic headline and recovery path from the error string
  let headline = 'Generation interrupted';
  let hint = 'The operation can be retried immediately.';

  if (error.toLowerCase().includes('timeout') || error.toLowerCase().includes('timed out')) {
    headline = 'Timeout during stack computation';
    hint = 'The AI engine took too long. Try reducing project scope or retry.';
  } else if (error.toLowerCase().includes('rate') || error.toLowerCase().includes('429')) {
    headline = 'Rate limit reached';
    hint = 'The AI provider throttled the request. Wait a moment, then retry.';
  } else if (error.toLowerCase().includes('log in') || error.toLowerCase().includes('auth') || error.toLowerCase().includes('401')) {
    headline = 'Authentication required';
    hint = 'Your session may have expired. Please log in and try again.';
  } else if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')) {
    headline = 'Network connection lost';
    hint = 'Check your internet connection and retry.';
  } else if (error.toLowerCase().includes('500') || error.toLowerCase().includes('server')) {
    headline = 'Server error during generation';
    hint = 'An internal error occurred. Retry, or contact support if it persists.';
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-red-500/20 bg-[var(--card)] p-8 text-center shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">{headline}</h3>
        <p className="mt-1 font-mono text-xs text-red-500/80">{error}</p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">{hint}</p>
      </div>
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel} className="gap-1.5">
            <X size={14} />
            Cancel
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry} className="gap-1.5">
            <RefreshCcw size={14} />
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main overlay ─────────────────────────────────────────── */

interface GeneratingOverlayProps {
  isGenerating: boolean;
  error?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function GeneratingOverlay({
  isGenerating,
  error,
  onRetry,
  onCancel,
}: GeneratingOverlayProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  // Debounce: don't show if response comes back in <300ms
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    if (isGenerating && !error) {
      const debounce = setTimeout(() => setShowOverlay(true), 300);
      return () => clearTimeout(debounce);
    }
    if (!isGenerating && !error) {
      setShowOverlay(false);
    }
    return undefined;
  }, [isGenerating, error]);

  // Reset state on new generation
  useEffect(() => {
    if (isGenerating && !error) {
      setActiveIndex(0);
      setCompletedSet(new Set());
      mountedRef.current = true;
    } else {
      mountedRef.current = false;
    }
  }, [isGenerating, error]);

  // Advance through operation log entries
  useEffect(() => {
    if (!isGenerating || error || activeIndex < 0 || activeIndex >= OPERATION_LOG.length) return;

    const entry = OPERATION_LOG[activeIndex];
    timerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setCompletedSet((prev) => {
        const next = new Set(prev);
        next.add(activeIndex);
        return next;
      });
      // Move to next entry, but cap at last entry (stays "running" until real response)
      if (activeIndex < OPERATION_LOG.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
    }, entry.durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isGenerating, error, activeIndex]);

  // Minimum elapsed time tracking
  const minDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isGenerating && !error) {
      minDelayRef.current = setTimeout(() => {
        // do nothing
      }, 5000); // 5 seconds minimum delay
    }

    return () => {
      if (minDelayRef.current) clearTimeout(minDelayRef.current);
    }
  }, [isGenerating, error]);

  // Don't render at all if nothing to show
  // Decouplex simulated UI step from actual API loading state here too if needed
  if (!isGenerating && !error) return null;
  // Debounce: if generating but debounce hasn't fired yet, and no error, skip
  if (isGenerating && !showOverlay && !error) return null;

  const elapsedSteps = completedSet.size;
  const progressPercent = Math.min((elapsedSteps / OPERATION_LOG.length) * 100, 95);

  const isTakingLong = elapsedSteps === OPERATION_LOG.length - 1 && isGenerating;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)]/95 backdrop-blur-sm"
      >
        <div className="flex w-full max-w-xl flex-col items-center px-6">
          {error ? (
            <ErrorPanel error={error} onRetry={onRetry} onCancel={onCancel} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-2 self-start">
                <Terminal size={16} className="text-[var(--muted-foreground)]" />
                <span className="font-mono text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Stack Engine
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <motion.div
                  className="h-full bg-[var(--primary)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ ease: 'easeOut', duration: 0.6 }}
                />
              </div>
              <p className="mt-1.5 self-end font-mono text-[11px] text-[var(--muted-foreground)]/80 flex items-center gap-1">
                {isTakingLong && <span className="text-[var(--primary)] italic mr-2">Finalizing, this can take up to 30s...</span>}
                {elapsedSteps === OPERATION_LOG.length - 1 && !isGenerating ? OPERATION_LOG.length : elapsedSteps}/{OPERATION_LOG.length} operations
              </p>

              {/* Terminal log */}
              <div className="mt-6 w-full rounded-lg border border-[var(--border)] bg-[var(--card)]/80 shadow-md p-4">
                <div className="space-y-0.5">
                  {OPERATION_LOG.map((entry, i) => {
                    let status: 'pending' | 'running' | 'done' = 'pending';
                    if (completedSet.has(i)) status = 'done';
                    else if (i === activeIndex) status = 'running';
                    else if (i > activeIndex) status = 'pending';

                    // Only render entries that are active or already completed
                    if (status === 'pending' && i > activeIndex) return null;

                    return <LogLine key={i} entry={entry} status={status} />;
                  })}
                </div>
              </div>

              {/* Result layout skeleton */}
              <ResultSkeleton />

              {/* Cancel affordance */}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="mt-6 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  Cancel generation
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
