'use client';

import { Zap } from 'lucide-react';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Small "PRO" badge to indicate gated features.
 */
export function ProBadge({ className = '', size = 'sm' }: ProBadgeProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-1.5 py-0.5 text-[10px] gap-0.5'
      : size === 'lg'
        ? 'px-3 py-1 text-sm gap-1.5'
        : 'px-2 py-0.5 text-xs gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-400/20 bg-gradient-to-r from-amber-400/20 to-orange-500/20 font-semibold tracking-wider text-amber-400 uppercase ${sizeClasses} ${className}`}
    >
      <Zap className={size === 'sm' ? 'h-2.5 w-2.5' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} />
      Pro
    </span>
  );
}
