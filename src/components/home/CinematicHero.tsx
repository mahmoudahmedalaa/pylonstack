'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex min-h-[90vh] w-full max-w-[1400px] flex-col justify-center pt-[25vh] pb-24 sm:pt-[30vh] sm:pb-32"
    >
      {/* ── Headline ── */}
      <motion.div className="mb-24 px-6 text-center" style={{ opacity, y }}>
        <h1 className="mb-8 text-5xl leading-[1.1] font-semibold tracking-tighter text-white sm:text-7xl lg:text-8xl">
          Plan your architecture
          <br />
          <span className="text-white">with engineering precision.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed font-light tracking-wide text-neutral-400 sm:text-xl">
          Pylon translates your business requirements into production-ready tech stacks in minutes,
          calculating costs at scale and anticipating integration risk before you build.
        </p>
        <div className="mt-14 flex items-center justify-center">
          <Link
            href="/create"
            className="flex h-14 items-center justify-center rounded-full bg-white px-8 text-[15px] font-bold text-black transition-all hover:scale-[1.02] hover:bg-neutral-200 active:scale-[0.98]"
          >
            Build Your Stack
          </Link>
        </div>
      </motion.div>

      {/* ── App Screenshot Mockup ── */}
      <motion.div className="relative mx-auto w-[98%] max-w-[1400px] sm:w-[95%]" style={{ scale }}>
        <AppScreenshotMockup />
      </motion.div>
    </div>
  );
}

function AppScreenshotMockup() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
      {/* Top Navbar Header */}
      <div className="flex h-14 w-full items-center justify-between border-b border-white/5 px-6">
        <div className="flex items-center gap-3">
          {/* Logo mock */}
          <div className="h-5 w-5 rounded-md bg-white/20" />
          <div className="text-sm font-semibold tracking-wide text-white">Stack Wizard</div>
        </div>
        <div className="text-xs font-medium text-neutral-500">Answer a few questions</div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid min-h-[500px] grid-cols-1 lg:grid-cols-3">
        {/* Left Column (Forms) */}
        <div className="col-span-2 border-r border-white/5 p-8 lg:p-12">
          {/* Progress Indicator */}
          <div className="mb-12 flex items-center gap-3 opacity-80">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              1
            </div>
            <div className="text-xs font-semibold text-white">Project Type</div>
            <div className="mx-2 h-[1px] w-8 bg-indigo-500/50" />
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[10px] font-medium text-white/50">
              2
            </div>
            <div className="text-xs font-medium text-white/50">Team Size</div>
          </div>

          <div className="mb-10">
            <div className="mb-2 text-xs font-bold tracking-widest text-neutral-500 uppercase">
              Step 1 of 7
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
              What are you building?
            </h2>
            <p className="text-sm text-neutral-400">
              Select the type of project. This determines which tools we recommend.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white">Project Name *</div>
              <div className="flex h-12 w-full max-w-md items-center rounded-xl border border-white/10 bg-black/50 px-4 text-sm text-neutral-500">
                E.g., Pylon, OrbitTracker, etc.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="cursor-pointer rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-5 ring-1 ring-indigo-500/20 transition-colors">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
                  <div className="h-4 w-4 rounded-full border-2 border-indigo-400" />
                </div>
                <div className="mb-1 text-sm font-bold text-white">Web Application</div>
                <div className="text-xs text-neutral-400">
                  Runs in the browser — SPA, SSR, or full-stack.
                </div>
              </div>

              <div className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <div className="h-4 w-3 rounded-[4px] border-2 border-white/40" />
                </div>
                <div className="mb-1 text-sm font-bold text-white">Mobile Application</div>
                <div className="text-xs text-neutral-400">
                  Native or cross-platform iOS & Android.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Widget) */}
        <div className="col-span-1 hidden bg-[#050505] p-8 lg:block">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black p-6 shadow-2xl">
            {/* Radial gradient background behind widget */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[200px] w-[200px] -translate-x-1/2 bg-indigo-500/10 blur-[50px]" />

            <div className="relative z-10 mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <div className="h-3 w-4 border-y border-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Live Stack Preview</div>
                <div className="text-[10px] font-medium tracking-widest text-neutral-500 uppercase">
                  0/9 Layers Selected
                </div>
              </div>
            </div>

            <div className="relative z-10 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10">
                <div className="h-4 w-4 rounded-full border border-indigo-400/50" />
              </div>
              <div className="mb-1 text-sm font-semibold text-white/80">
                Your stack will appear here
              </div>
              <div className="text-xs font-medium text-neutral-500">
                Make selections to start building
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
