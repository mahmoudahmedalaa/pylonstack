'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ─── Types ─── */

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
}

const sizeMap = {
  sm: { track: 'h-5 w-9', thumb: 'h-3.5 w-3.5', translate: 'translate-x-4' },
  md: { track: 'h-6 w-11', thumb: 'h-4.5 w-4.5', translate: 'translate-x-5' },
} as const;

/* ─── Component ─── */

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked = false, onChange, label, size = 'md', className, ...props }, ref) => {
    const s = sizeMap[size];

    return (
      <label className={cn('inline-flex cursor-pointer items-center gap-2', className)}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange?.(!checked)}
          className={cn(
            'relative inline-flex shrink-0 items-center rounded-full',
            'transition-colors duration-200 ease-in-out',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            s.track,
            checked ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]',
          )}
          {...props}
        >
          <span
            className={cn(
              'inline-block rounded-full bg-white shadow-md',
              'transition-transform duration-200 ease-in-out',
              'translate-x-0.5',
              s.thumb,
              checked && s.translate,
            )}
          />
        </button>
        {label && <span className="text-sm text-[var(--foreground)]">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';

export { Toggle };
