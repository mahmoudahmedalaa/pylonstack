'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant: 'primary' (solid fill) or 'accent' (gradient border) */
  variant?: 'primary' | 'accent';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

/**
 * PremiumButton — Clean, solid-fill CTA button inspired by Vercel / Stripe.
 *
 * Design principles (from research):
 * - Solid background, no shimmer or glow on idle
 * - Hover: brightness lift + subtle shadow increase + slight translateY
 * - AI-related buttons get a small gradient accent (left border or icon glow)
 */
export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          'group relative inline-flex cursor-pointer items-center justify-center gap-2 font-semibold tracking-tight',
          'rounded-lg transition-all duration-200 ease-out',
          'active:scale-[0.97]',
          sizeClasses[size],

          // Variant styles
          variant === 'primary' && [
            'bg-[var(--primary)] text-white',
            'shadow-[var(--primary)]/15 shadow-md',
            'hover:-translate-y-[1px] hover:shadow-[var(--primary)]/25 hover:shadow-lg hover:brightness-110',
          ],

          variant === 'accent' && [
            'bg-gradient-to-r from-[var(--primary)] to-[var(--color-accent-500)] text-white',
            'shadow-[var(--primary)]/20 shadow-md',
            'hover:-translate-y-[1px] hover:shadow-[var(--primary)]/30 hover:shadow-lg hover:brightness-110',
          ],

          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PremiumButton.displayName = 'PremiumButton';
