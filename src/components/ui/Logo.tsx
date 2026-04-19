import { cn } from '@/lib/utils';
import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full', className)}
      {...props}
    >
      <defs>
        <linearGradient
          id="pylonDarkSolid"
          x1="0"
          y1="0"
          x2="100"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient
          id="pylonGlass"
          x1="120"
          y1="0"
          x2="0"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient
          id="pylonAccent"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" /> {/* Indigo-500 */}
          <stop offset="1" stopColor="#a855f7" /> {/* Purple-500 */}
        </linearGradient>
        <filter id="pylonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Abstract Glowing Core echoing framer and modern abstract SaaS */}
      <circle
        cx="60"
        cy="50"
        r="35"
        fill="url(#pylonAccent)"
        filter="url(#pylonGlow)"
        opacity="0.4"
      />

      {/* Left Monolith Pillar -> Creates the stem of the P */}
      <path d="M 20 20 L 45 20 L 45 100 L 20 85 Z" fill="url(#pylonDarkSolid)" />

      {/* Upper Layered Stack -> Creates top of the P */}
      <path d="M 45 20 L 95 40 L 70 60 L 45 50 Z" fill="url(#pylonGlass)" />

      {/* Lower Layered Support */}
      <path d="M 45 50 L 70 60 L 45 80 Z" fill="url(#pylonDarkSolid)" />

      {/* Accent Cutout defining structure */}
      <path d="M 95 40 L 105 40 L 105 55 L 70 60 Z" fill="url(#pylonAccent)" opacity="0.95" />

      {/* Precision Architecture Grid Details */}
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.25">
        <line x1="20" y1="35" x2="45" y2="35" />
        <line x1="20" y1="50" x2="45" y2="50" />
        <line x1="20" y1="65" x2="45" y2="65" />
        <line x1="20" y1="80" x2="45" y2="80" />
      </g>
    </svg>
  );
}
