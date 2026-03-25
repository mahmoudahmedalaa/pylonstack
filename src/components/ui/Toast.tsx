'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/* ─── Types ─── */

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

const variantStyles = {
  default: 'border-[var(--border)] bg-[var(--card)]',
  success: 'border-emerald-500/25 bg-emerald-500/10',
  warning: 'border-amber-500/25 bg-amber-500/10',
  error: 'border-red-500/25 bg-red-500/10',
  info: 'border-blue-500/25 bg-blue-500/10',
} as const;

const iconColors = {
  default: 'text-[var(--foreground)]',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  info: 'text-blue-400',
} as const;

/* ─── Component ─── */

function Toast({
  variant = 'default',
  title,
  description,
  icon,
  onClose,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-[var(--radius-lg)] border p-4',
        'shadow-[var(--shadow-lg)]',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <div className={cn('mt-0.5 shrink-0', iconColors[variant])}>{icon}</div>}

      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>}
        {description && <p className="text-sm text-[var(--muted-foreground)]">{description}</p>}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 rounded-[var(--radius-sm)] p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { Toast };
