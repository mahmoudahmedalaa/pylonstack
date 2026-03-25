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
              'flex h-10 w-full rounded-[var(--radius-md)] px-3 py-2',
              'bg-[var(--card)] text-sm text-[var(--foreground)]',
              'border border-[var(--border)]',
              'placeholder:text-[var(--muted-foreground)]',
              'transition-colors duration-200',
              // Focus
              'focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)] focus:outline-none',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Error
              error &&
                'border-[var(--destructive)] focus:border-[var(--destructive)] focus:ring-[var(--destructive)]',
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
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
