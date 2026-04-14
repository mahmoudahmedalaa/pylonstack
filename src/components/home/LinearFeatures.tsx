'use client';

import { GlowCard } from '@/components/ui/glow-card';
import { motion } from 'framer-motion';
import { Database, Zap, Layers, AppWindow, Cpu, Search } from 'lucide-react';

export function LinearFeatures() {
  return (
    <section id="features" className="relative bg-black py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-24 text-center">
          <h2 className="mb-6 text-6xl font-semibold tracking-tighter text-white md:text-8xl">
            Built for engineering leaders
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-neutral-400 sm:text-2xl">
            A comprehensive engine to visually construct, validate, and price out your entire
            technical architecture before committing to a single line of code.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1: Universal Compatibility (Large Card) */}
          <GlowCard className="md:col-span-2 lg:col-span-2" glowColor="rgba(99, 102, 241, 0.15)">
            <div className="flex h-[500px] flex-col p-12">
              <div className="mb-5 text-sm font-bold tracking-widest text-indigo-400 uppercase">
                Universal Compatibility
              </div>
              <h3 className="mb-4 text-5xl font-bold tracking-tight text-white">
                230+ normalized tools.
              </h3>
              <p className="max-w-lg text-xl leading-relaxed text-neutral-400">
                Compare databases, auth providers, and frameworks side-by-side. Our engine ensures
                every selected layer integrates seamlessly.
              </p>

              {/* Visual representation: Glass 3D stack */}
              <div className="group relative mt-auto flex h-56 w-full cursor-pointer items-center justify-center">
                <div className="relative h-[240px] w-full max-w-[350px]">
                  {/* Layer 1 */}
                  <div className="absolute top-10 right-0 left-0 z-10 flex h-20 items-center justify-between rounded-xl border border-white/10 bg-[#111]/80 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                        <AppWindow className="h-5 w-5 text-indigo-400" />
                      </div>
                      <span className="text-lg font-bold text-white">Frontend</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  </div>

                  {/* Layer 2 */}
                  <div className="absolute top-24 right-4 left-4 z-20 flex h-20 items-center justify-between rounded-xl border border-white/10 bg-[#18181b]/90 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
                        <Layers className="h-5 w-5 text-pink-400" />
                      </div>
                      <span className="text-lg font-bold text-white">Auth</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  </div>

                  {/* Layer 3 */}
                  <div className="absolute top-40 right-8 left-8 z-30 flex h-20 items-center justify-between rounded-xl border border-white/10 bg-[#27272a]/95 px-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-500">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                        <Database className="h-5 w-5 text-cyan-400" />
                      </div>
                      <span className="text-lg font-bold text-white">Database</span>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Feature 2: Cost Intelligence (Tall Card) */}
          <GlowCard className="md:col-span-1 lg:col-span-1" glowColor="rgba(16, 185, 129, 0.15)">
            <div className="flex h-[500px] flex-col p-12 lg:p-8 xl:p-12">
              <div className="mb-5 text-sm font-bold tracking-widest text-emerald-400 uppercase">
                Cost Intelligence
              </div>
              <h3 className="mb-4 text-5xl font-bold tracking-tight text-white">Predict costs</h3>
              <p className="text-xl leading-relaxed text-neutral-400">
                Visualize scaling costs precisely before committing.
              </p>

              {/* Visual representation: Area Chart */}
              <div className="relative mt-12 flex h-full w-full items-end justify-center pb-6">
                <svg
                  viewBox="0 0 100 50"
                  preserveAspectRatio="none"
                  className="absolute bottom-0 left-0 h-[150px] w-full"
                >
                  <defs>
                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 0 50 L 0 45 C 30 45, 50 15, 95 10 L 95 50 Z"
                    fill="url(#gradientArea)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />
                  <motion.path
                    d="M 0 45 C 30 45, 50 15, 95 10"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <circle
                    cx="95"
                    cy="10"
                    r="3"
                    fill="#fff"
                    stroke="#10b981"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="absolute -top-4 left-8 rounded-lg border border-white/10 bg-[#10b981]/10 px-4 py-2 font-mono text-xl font-bold tracking-tight text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-xl">
                  -$42k
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Feature 3: Orchestration Engine (Wide Card) */}
          <GlowCard className="md:col-span-2 lg:col-span-3" glowColor="rgba(217, 70, 239, 0.15)">
            <div className="flex h-[400px] flex-col p-12 lg:flex-row lg:items-center">
              <div className="lg:w-[45%]">
                <div className="mb-5 text-sm font-bold tracking-widest text-fuchsia-400 uppercase">
                  Orchestration Engine
                </div>
                <h3 className="mb-4 text-5xl font-bold tracking-tight text-white">
                  Mathematical precision
                </h3>
                <p className="text-xl leading-relaxed text-neutral-400">
                  Input technical constraints. Our AI engine computes the optimal architecture
                  tailored to your specific scale parameters and team size.
                </p>
              </div>

              <div className="relative mt-12 flex h-full items-center justify-center lg:mt-0 lg:w-[55%]">
                <div className="relative h-[250px] w-full max-w-[450px]">
                  {/* Central Node */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0 rgba(217,70,239,0)',
                        '0 0 60px rgba(217,70,239,0.35)',
                        '0 0 0 rgba(217,70,239,0)',
                      ],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 z-20 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2.5rem] border border-white/20 bg-black shadow-2xl"
                  >
                    <Cpu className="h-16 w-16 text-fuchsia-500" strokeWidth={1} />
                  </motion.div>

                  {/* Satellite Nodes */}
                  <div className="absolute top-4 left-4 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-lg">
                    <Database className="h-6 w-6 text-neutral-400" />
                  </div>
                  <div className="absolute bottom-4 left-12 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-lg">
                    <Zap className="h-6 w-6 text-neutral-400" />
                  </div>
                  <div className="absolute top-10 right-4 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-lg">
                    <Layers className="h-6 w-6 text-neutral-400" />
                  </div>
                  <div className="absolute right-12 bottom-4 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-lg">
                    <Search className="h-6 w-6 text-neutral-400" />
                  </div>

                  {/* SVG Connecting Lines using stroke dasharray animations */}
                  <svg className="absolute inset-0 h-full w-full opacity-40">
                    <motion.path
                      d="M 40 40 L 225 125"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      initial={{ strokeDashoffset: 30 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d="M 80 210 L 225 125"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      initial={{ strokeDashoffset: 30 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d="M 410 80 L 225 125"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      initial={{ strokeDashoffset: -30 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d="M 370 210 L 225 125"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      initial={{ strokeDashoffset: -30 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
