import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ─── Variant Map ─── */

const variantStyles = {
  default: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
  secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  error: 'bg-red-500/15 text-red-400 border-red-500/25',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  outline: 'bg-transparent text-[var(--foreground)] border border-[var(--border)]',
} as const;

/* ─── Types ─── */

export type BadgeVariant = keyof typeof variantStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/* ─── Component ─── */

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5',
        'text-xs font-medium',
        'border border-transparent',
        'transition-colors duration-200',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
