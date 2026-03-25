'use client';

import { motion, useSpring, useMotionValueEvent } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StackProgressProps {
  /** Number of categories filled (0 to totalCategories) */
  filledCount: number;
  /** Total number of recommended categories */
  totalCategories: number;
  /** Compact layout for sidebar/preview */
  compact?: boolean;
}

const LEVELS = [
  { threshold: 0, label: 'Empty', emoji: '🏗️' },
  { threshold: 0.25, label: 'Foundation', emoji: '🧱' },
  { threshold: 0.5, label: 'Growing', emoji: '🌱' },
  { threshold: 0.75, label: 'Production-Ready', emoji: '🚀' },
  { threshold: 1, label: 'Enterprise', emoji: '⚡' },
];

function getLevel(ratio: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (ratio >= LEVELS[i].threshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export function StackProgress({
  filledCount,
  totalCategories,
  compact = false,
}: StackProgressProps) {
  const ratio = totalCategories > 0 ? filledCount / totalCategories : 0;
  const percentage = Math.round(ratio * 100);
  const level = getLevel(ratio);

  // Animated counter using spring → state
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(spring, 'change', (v) => {
    setDisplayValue(Math.round(v));
  });

  useEffect(() => {
    spring.set(percentage);
  }, [percentage, spring]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Mini circular gauge */}
        <div className="relative h-8 w-8">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - ratio) }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-bold text-neutral-300">{displayValue}</span>
          </div>
        </div>
        <div className="text-[10px]">
          <span className="text-neutral-400">
            {level.emoji} {level.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">Stack Completeness</span>
        <span className="text-lg font-bold text-neutral-200">
          {displayValue}
          <span className="text-sm text-neutral-500">%</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #818cf8, #34d399)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            width: `${percentage}%`,
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        />
      </div>

      {/* Level indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm">{level.emoji}</span>
        <span className="text-xs font-medium text-neutral-300">{level.label}</span>
        <span className="text-[10px] text-neutral-500">
          {filledCount}/{totalCategories} categories
        </span>
      </div>

      {/* Level dots */}
      <div className="flex gap-1">
        {LEVELS.slice(1).map((l, i) => (
          <div
            key={l.label}
            className="h-1 flex-1 rounded-full transition-colors duration-500"
            style={{
              backgroundColor:
                ratio >= l.threshold ? (i < 2 ? '#818cf8' : '#34d399') : 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
