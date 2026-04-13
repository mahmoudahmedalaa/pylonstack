'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Step data: represents the user flow ── */
const FLOW_STEPS = [
  {
    label: 'You describe your app',
    items: ['SaaS Platform', 'E-Commerce', 'Real-Time Chat', 'Fintech API'],
    color: '#818cf8',
  },
  {
    label: 'AI maps your categories',
    items: ['Frontend', 'Backend', 'Database', 'Auth', 'Payments', 'Hosting'],
    color: '#34d399',
  },
  {
    label: 'Best tools are selected',
    items: ['Next.js', 'Supabase', 'Clerk', 'Stripe', 'Vercel', 'Redis'],
    color: '#38bdf8',
  },
  {
    label: 'Your full stack, ready to ship',
    items: ['Architecture Blueprint', 'Cost Projections', 'Implementation Roadmap'],
    color: '#f59e0b',
  },
];

/* ── Main component ── */
export function ChaosToStackAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
        {/* Subtle grid dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Content: 4-step flow */}
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
          {/* Title */}
          <motion.p
            className="mb-8 text-center text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [0, 1]) }}
          >
            How Pylon Works
          </motion.p>

          {/* Steps flow */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW_STEPS.map((step, stepIdx) => {
              const start = stepIdx * 0.15;
              const end = start + 0.25;

              return (
                <FlowStep
                  key={step.label}
                  step={step}
                  index={stepIdx}
                  scrollYProgress={scrollYProgress}
                  animStart={start}
                  animEnd={end}
                />
              );
            })}
          </div>

          {/* Bottom connector line */}
          <motion.div
            className="mx-auto mt-8 h-0.5 w-3/4 rounded-full"
            style={{
              scaleX: useTransform(scrollYProgress, [0.3, 0.6], [0, 1]),
              background: 'linear-gradient(90deg, #818cf8, #34d399, #38bdf8, #f59e0b)',
              opacity: useTransform(scrollYProgress, [0.3, 0.6], [0, 0.6]),
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Single flow step ── */
function FlowStep({
  step,
  index,
  scrollYProgress,
  animStart,
  animEnd,
}: {
  step: (typeof FLOW_STEPS)[number];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  animStart: number;
  animEnd: number;
}) {
  const opacity = useTransform(scrollYProgress, [animStart, animStart + 0.1], [0.15, 1]);
  const y = useTransform(scrollYProgress, [animStart, animEnd], [20, 0]);
  const scale = useTransform(scrollYProgress, [animStart, animEnd], [0.95, 1]);

  return (
    <motion.div
      className="relative flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-lg"
      style={{ opacity, y, scale }}
    >
      {/* Step number */}
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: step.color }}
        >
          {index + 1}
        </div>
        <span className="text-[11px] font-semibold text-neutral-400">{step.label}</span>
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-1.5">
        {step.items.map((item, i) => {
          const itemStart = animStart + i * 0.02;
          return (
            <FlowItem
              key={item}
              label={item}
              color={step.color}
              scrollYProgress={scrollYProgress}
              animStart={itemStart}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Single item chip ── */
function FlowItem({
  label,
  color,
  scrollYProgress,
  animStart,
}: {
  label: string;
  color: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  animStart: number;
}) {
  const opacity = useTransform(scrollYProgress, [animStart, animStart + 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [animStart, animStart + 0.08], [0.8, 1]);

  return (
    <motion.span
      className="rounded-md border px-2 py-1 text-[10px] font-medium"
      style={{
        opacity,
        scale,
        borderColor: `${color}30`,
        backgroundColor: `${color}10`,
        color: color,
      }}
    >
      {label}
    </motion.span>
  );
}
