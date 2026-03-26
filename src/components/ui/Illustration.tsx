'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type IllustrationSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

const SIZE_MAP: Record<IllustrationSize, { width: number; height: number; className: string }> = {
  xs: { width: 80, height: 80, className: 'w-20 h-20' },
  sm: { width: 120, height: 120, className: 'w-[120px] h-[120px]' },
  md: { width: 200, height: 200, className: 'w-[200px] h-[200px]' },
  lg: { width: 300, height: 300, className: 'w-[300px] h-[300px]' },
  xl: { width: 400, height: 400, className: 'w-[400px] h-[400px]' },
  hero: { width: 500, height: 500, className: 'w-full max-w-[500px] h-auto' },
};

interface IllustrationProps {
  /** Filename without .svg extension, e.g. "visionary-technology" */
  name: string;
  /** Source folder — "undraw" or "drawkit" */
  source?: 'undraw' | 'drawkit';
  /** Preset size */
  size?: IllustrationSize;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show a soft ambient glow behind the illustration */
  glow?: boolean;
  /** Custom glow color */
  glowColor?: string;
  /** Alt text override */
  alt?: string;
  /** Whether to animate on mount */
  animate?: boolean;
  /** Float animation (gentle up/down bob) */
  float?: boolean;
}

export function Illustration({
  name,
  source = 'undraw',
  size = 'md',
  className,
  glow = false,
  glowColor = 'var(--primary)',
  alt,
  animate = true,
  float = false,
}: IllustrationProps) {
  const { width, height, className: sizeClass } = SIZE_MAP[size];
  const src = `/illustrations/${source}/${name}.svg`;

  const content = (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Ambient glow */}
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-20 blur-[60px]"
          style={{ backgroundColor: glowColor }}
        />
      )}

      <Image
        src={src}
        alt={alt ?? name.replace(/-/g, ' ')}
        width={width}
        height={height}
        className={cn(sizeClass, 'object-contain select-none')}
        priority={size === 'hero'}
        draggable={false}
      />
    </div>
  );

  if (!animate && !float) return content;

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {float ? (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </motion.div>
  );
}
