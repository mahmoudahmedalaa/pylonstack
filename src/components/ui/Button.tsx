'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/* ─── Variant & Size Maps ─── */

const variantStyles = {
  primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110 shadow-sm',
  secondary:
    'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]',
  ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]',
  outline:
    'bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:brightness-110',
  accent: 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110',
  link: 'bg-transparent text-[var(--primary)] underline-offset-4 hover:underline p-0 h-auto',
} as const;

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-base)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]',
  icon: 'h-10 w-10 rounded-[var(--radius-md)]',
} as const;

/* ─── Types ─── */

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/* ─── Component ─── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex cursor-pointer items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]',
          'active:scale-[0.97]',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant + Size
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
