'use client';

import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
}

export function SpotlightCard({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.15)',
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the mouse movement
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(
      650px circle at ${springX}px ${springY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative flex size-full flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-6 text-left shadow-2xl transition-all hover:border-white/20',
        className,
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
