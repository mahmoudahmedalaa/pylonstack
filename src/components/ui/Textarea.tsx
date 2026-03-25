'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ─── Types ─── */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

/* ─── Component ─── */

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-[var(--radius-md)] px-3 py-2',
            'bg-[var(--card)] text-sm text-[var(--foreground)]',
            'border border-[var(--border)]',
            'placeholder:text-[var(--muted-foreground)]',
            'transition-colors duration-200',
            'focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            error &&
              'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]',
            className,
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';

export { Textarea };
