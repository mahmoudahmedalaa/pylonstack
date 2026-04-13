'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(255, 255, 255, 0.1)',
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (isHovered && cardRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black p-0.5 transition-colors hover:border-white/[0.12] ${className}`}
      {...props}
    >
      {/* Dynamic Glow Background */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
      />

      {/* Inner Card Background (Masks the glow to just the borders if needed, or provides the true surface) */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#0a0a0a] ring-1 ring-white/5 backdrop-blur-xl">
        {/* Subtle top inner shadow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

        {children}
      </div>
    </div>
  );
}
