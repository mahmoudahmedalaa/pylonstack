'use client';

import { cn } from '@/lib/utils';

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'animate-shimmer bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-accent-400)] to-[var(--color-primary-500)] bg-[length:200%_auto] bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </span>
  );
}
