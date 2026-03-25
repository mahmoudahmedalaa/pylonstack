import { cn } from '@/lib/utils';

/* ─── Types ─── */

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-3',
} as const;

/* ─── Component ─── */

function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full',
        'border-[var(--muted)] border-t-[var(--primary)]',
        sizeStyles[size],
        className,
      )}
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export { Spinner };
