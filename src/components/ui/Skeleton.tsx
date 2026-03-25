import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

/* ─── Component ─── */

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[var(--radius-md)]', 'bg-[var(--muted)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
