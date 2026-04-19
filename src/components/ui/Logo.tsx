import { cn } from '@/lib/utils';
import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  animate?: boolean;
}

export function Logo({ className, animate = true, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'h-full w-full drop-shadow-2xl',
        animate && 'transition-transform duration-500 hover:scale-105',
        className,
      )}
      {...props}
    >
      <defs>
        <linearGradient id="pStem" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="pArc" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="pBase" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
        <filter id="pGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Volumetric Power Core Element */}
      <circle cx="50" cy="45" r="32" fill="#6366f1" filter="url(#pGlow)" opacity="0.35" />

      {/* The Monolith Stem (Vertical Support of the P) */}
      <path d="M 25 10 L 45 0 L 45 75 L 25 85 Z" fill="url(#pStem)" />

      {/* The Sweeping Architectural Overhang (Top of the P loop) */}
      <path d="M 45 0 L 85 20 L 75 55 L 45 35 Z" fill="url(#pArc)" />

      {/* The Intersecting Wrap (Bottom curve of the P loop linking to stem) */}
      <path
        d="M 45 35 L 75 55 L 45 70 Z"
        fill="url(#pBase)"
        style={{ mixBlendMode: 'plus-lighter' }}
      />

      {/* Laser Cut Highlighting providing micro-detailing & "glass edge reflection" */}
      <path
        d="M 25 25 L 80 17 L 70 21 L 25 30 Z"
        fill="#ffffff"
        style={{ mixBlendMode: 'overlay' }}
        opacity="0.7"
      />

      {/* Data Node Terminals (Dots representing tech/infrastructure ends) */}
      <circle cx="25" cy="10" r="1.5" fill="#ffffff" />
      <circle cx="45" cy="0" r="1.5" fill="#ffffff" />
      <circle cx="85" cy="20" r="1.5" fill="#ffffff" />
      <circle cx="25" cy="85" r="1.5" fill="#ffffff" />
    </svg>
  );
}
