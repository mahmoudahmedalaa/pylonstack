'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Database, Code2, Layers, Smartphone, RefreshCw } from 'lucide-react';

export function LinearHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.85], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 0.95]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-start pt-[20vh] pb-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center"
      >
        <div className="group mb-12 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pr-4 pl-5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10">
          <span className="tracking-wide text-white">The definitive infrastructure planner</span>
          <ChevronRight className="h-4 w-4 text-neutral-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
        </div>

        <h1 className="mb-8 text-6xl leading-[1.1] font-semibold tracking-tighter text-balance text-white sm:text-7xl lg:text-8xl">
          Pylon is a better way
          <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            to plan architecture
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-neutral-400 sm:text-2xl">
          Meet the new standard for infrastructure planning. Generate precise tech stacks, calculate
          unit economics, and foresee integration risks in minutes.
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/create"
            className="flex h-14 items-center justify-center rounded-full bg-white px-10 text-[16px] font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="flex h-14 items-center justify-center rounded-full border border-white/10 bg-transparent px-10 text-[16px] font-semibold text-white transition-colors hover:bg-white/5"
          >
            Explore
          </Link>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="pointer-events-none absolute top-[-10%] left-1/2 z-0 h-[600px] w-[800px] -translate-x-1/2 opacity-20 blur-[120px]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
      </div>

      <motion.div style={{ scale, opacity }} className="relative z-10 mt-32 w-[95%] max-w-[1400px]">
        <AppScreenshotMockup />
      </motion.div>
    </div>
  );
}

function AppScreenshotMockup() {
  const [selectedType, setSelectedType] = useState<'web' | 'mobile' | null>('web');

  const webStack = [
    { id: 'next', name: 'Next.js', layer: 'Frontend Framework', color: 'indigo' },
    { id: 'clerk', name: 'Clerk Auth', layer: 'Authentication', color: 'violet' },
    { id: 'supabase', name: 'Supabase DB', layer: 'Database', color: 'emerald' },
  ];

  const mobileStack = [
    { id: 'rn', name: 'React Native', layer: 'Mobile Framework', color: 'blue' },
    { id: 'firebase', name: 'Firebase', layer: 'Auth & Database', color: 'orange' },
    { id: 'revcat', name: 'RevenueCat', layer: 'Payments', color: 'pink' },
  ];

  const activeStack = selectedType === 'mobile' ? mobileStack : webStack;

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/15 bg-[#09090b] shadow-[0_40px_150px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#000] px-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-white/20" />
          <div className="text-base font-semibold tracking-wide text-white">Stack Wizard</div>
        </div>
        <div className="text-sm font-medium text-neutral-500">Interactive Preview Demo</div>
      </div>

      <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-3">
        <div className="col-span-2 border-r border-white/10 p-8 lg:p-16">
          <div className="mb-14 flex items-center gap-4 opacity-90">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]">
              1
            </div>
            <div className="text-sm font-semibold text-white">Project Type</div>
            <div className="mx-3 h-[1px] w-12 bg-indigo-500/50" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs font-medium text-white/50">
              2
            </div>
            <div className="text-sm font-medium text-white/50">Team Size</div>
          </div>

          <div className="mb-12">
            <div className="mb-4 text-sm font-bold tracking-widest text-indigo-400 uppercase">
              Step 1 of 7
            </div>
            <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">
              What are you building?
            </h2>
            <p className="text-lg text-neutral-400">
              Click a project type to test the Live Preview architecture generation.
            </p>
          </div>

          <div className="mt-8 space-y-10">
            <div className="grid grid-cols-2 gap-8">
              <div
                onClick={() => setSelectedType('web')}
                className={`cursor-pointer rounded-2xl border p-8 transition-all ${
                  selectedType === 'web'
                    ? 'scale-[1.02] border-indigo-500/80 bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/50'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    selectedType === 'web' ? 'bg-indigo-500/30' : 'bg-white/10'
                  }`}
                >
                  <Code2
                    className={`h-6 w-6 ${selectedType === 'web' ? 'text-indigo-300' : 'text-neutral-400'}`}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">Web Application</span>
                  {selectedType !== 'web' && (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase"
                    >
                      Click to configure →
                    </motion.span>
                  )}
                </div>
                <div className="text-base leading-relaxed text-neutral-400">
                  SPA, SSR, or full-stack web platforms.
                </div>
              </div>

              <div
                onClick={() => setSelectedType('mobile')}
                className={`cursor-pointer rounded-2xl border p-8 transition-all ${
                  selectedType === 'mobile'
                    ? 'scale-[1.02] border-indigo-500/80 bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/50'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    selectedType === 'mobile' ? 'bg-indigo-500/30' : 'bg-white/10'
                  }`}
                >
                  <Smartphone
                    className={`h-6 w-6 ${selectedType === 'mobile' ? 'text-indigo-300' : 'text-neutral-400'}`}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">Mobile Application</span>
                  {selectedType !== 'mobile' && (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase"
                    >
                      Click to configure →
                    </motion.span>
                  )}
                </div>
                <div className="text-base leading-relaxed text-neutral-400">
                  Native iOS & Android experiences.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative col-span-1 hidden bg-[#050505] p-8 lg:block">
          {selectedType && (
            <div className="absolute top-0 right-0 flex w-full justify-end p-8">
              <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                <RefreshCw className="h-4 w-4 animate-spin" /> Live Synced
              </div>
            </div>
          )}

          <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div
              className={`pointer-events-none absolute top-0 left-1/2 h-[250px] w-[250px] -translate-x-1/2 blur-[60px] transition-colors duration-1000 ${
                selectedType ? 'bg-indigo-500/30' : 'bg-indigo-500/15'
              }`}
            />

            <div className="relative z-10 mb-8 flex items-center gap-5 border-b border-white/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Layers className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">Orchestration Graph</div>
                <div className="mt-1 text-[12px] font-bold tracking-widest text-neutral-500 uppercase transition-all">
                  {selectedType ? '3/9 Layers Defined' : '0/9 Layers Defined'}
                </div>
              </div>
            </div>

            <div className="relative z-10 w-full">
              <AnimatePresence mode="wait">
                {!selectedType ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.01] p-6 text-center"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      <div className="h-6 w-6 rounded-full border-[3px] border-indigo-400/50" />
                    </div>
                    <div className="mb-2 text-lg font-semibold text-white/90">
                      Awaiting Configuration
                    </div>
                    <div className="text-base font-medium text-neutral-500">
                      Select a project type to generate diagram
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={selectedType} className="flex flex-col gap-4">
                    {activeStack.map((tech, idx) => (
                      <motion.div
                        key={tech.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.15, type: 'spring', bounce: 0.4 }}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-md"
                      >
                        <div>
                          <div className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                            {tech.layer}
                          </div>
                          <div className="mt-1.5 text-base font-bold text-white">{tech.name}</div>
                        </div>
                        <Database className="h-6 w-6 text-indigo-400 opacity-60" />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
