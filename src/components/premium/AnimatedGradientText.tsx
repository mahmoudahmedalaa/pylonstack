'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        'group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/5 px-4 py-1.5 text-sm font-medium transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] dark:bg-black/20',
        className,
      )}
    >
      <div
        className={cn(
          `animate-gradient-text bg-[length:var(--bg-size)_100%]![mask-composite:subtract] absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] ![mask-clip:padding-box,border-box] p-px`,
        )}
      />
      {children}
    </div>
  );
}
