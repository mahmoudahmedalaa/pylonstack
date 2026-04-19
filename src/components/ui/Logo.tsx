import { cn } from '@/lib/utils';
import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-6 w-6', className)}
      {...props}
    >
      {/* Base Vertical Pillar */}
      <path d="M15 15 H 40 V 85 H 15 Z" fill="currentColor" />
      {/* Primary Dimensional Wing */}
      <path d="M40 15 L 85 40 L 40 65 Z" fill="currentColor" />
      {/* Secondary Depth Layer */}
      <path d="M40 40 L 75 60 L 40 80 Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}
