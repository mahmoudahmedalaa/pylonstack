'use client';

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/* ─── Types ─── */

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

/* ─── Component ─── */

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, icon, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex h-10 w-full appearance-none rounded-[var(--radius-md)] px-3 py-2 pr-10',
              'bg-[var(--card)] text-sm text-[var(--foreground)]',
              'border border-[var(--border)]',
              'transition-colors duration-200',
              'focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]',
              icon && 'pl-10',
              className,
            )}
            {...props}
          >
            {children}
          </select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'text-xs',
              error ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]',
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
