import { cn } from '@/lib/utils';

/* ─── Types ─── */

export interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

const variantStyles = {
  default: 'bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-600)]',
  success: 'bg-gradient-to-r from-[var(--color-success-400)] to-[var(--color-success-600)]',
  warning: 'bg-gradient-to-r from-[var(--color-warning-400)] to-[var(--color-warning-600)]',
  error: 'bg-gradient-to-r from-[var(--color-error-400)] to-[var(--color-error-600)]',
} as const;

/* ─── Component ─── */

function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
          {showValue && (
            <span className="text-xs text-[var(--muted-foreground)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-[var(--muted)]/40 inset-shadow-sm',
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            'relative h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-700 ease-out',
            variantStyles[variant],
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shimmer overlay for premium feel */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export { ProgressBar };
