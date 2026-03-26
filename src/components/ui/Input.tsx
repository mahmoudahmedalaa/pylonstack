'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─── Types ─── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/* ─── Component ─── */

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base
              'flex h-11 w-full rounded-xl px-4 py-2',
              'bg-[var(--card)]/40 text-sm text-[var(--foreground)] backdrop-blur-md',
              'border border-[var(--border)]/60 shadow-sm',
              'placeholder:text-[var(--muted-foreground)]/70',
              'transition-all duration-300 ease-in-out',
              // Hover
              'hover:border-[var(--border)] hover:bg-[var(--card)]/60',
              // Focus
              'focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-4 focus:ring-[var(--primary)]/10 focus:outline-none',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--border)]/60',
              // Error
              error &&
                'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20',
              // Icon padding
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--muted-foreground)]">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';

export { Input };
