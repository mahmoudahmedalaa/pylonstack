import Image from 'next/image';
import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

/* ─── Types ─── */

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
} as const;

const sizePx = { sm: 32, md: 40, lg: 56 } as const;

/* ─── Component ─── */

function Avatar({ src, alt, fallback, size = 'md', className, ...props }: AvatarProps) {
  const initials =
    fallback ||
    alt
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    '?';

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-[var(--muted)] font-medium text-[var(--muted-foreground)]',
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          width={sizePx[size]}
          height={sizePx[size]}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
