'use client';

import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = 'var(--primary)',
  colorTo = 'var(--primary)',
}: BorderBeamProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
      style={{
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        padding: '1px',
      }}
    >
      <div
        className="animate-border-beam absolute inset-0 rounded-[inherit]"
        style={
          {
            '--size': `${size}px`,
            '--duration': `${duration}s`,
            '--delay': `-${delay}s`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
            background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 10%, ${colorTo} 20%, transparent 30%)`,
            animation: `border-beam-spin ${duration}s linear ${delay}s infinite`,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        @keyframes border-beam-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
