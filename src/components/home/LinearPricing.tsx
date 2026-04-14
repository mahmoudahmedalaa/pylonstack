'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function LinearPricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-black py-40">
      {/* Background glow behind pro card */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="h-[30vh] w-full max-w-[600px] translate-x-[25%] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.2),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-6xl font-semibold tracking-tighter text-white md:text-8xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-2xl text-neutral-400">
            Start for free and scale as your orchestration needs grow.
          </p>

          {/* Toggle Switch */}
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="flex h-16 w-full max-w-[380px] items-center rounded-full border border-white/10 bg-[#0a0a0a] p-1 shadow-inner">
              <button
                onClick={() => setIsAnnual(false)}
                className={`flex-1 rounded-full text-base font-bold tracking-wide transition-all duration-300 ${!isAnnual ? 'bg-white/10 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                style={{ height: 'calc(100% - 4px)' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full text-base font-bold tracking-wide transition-all duration-300 ${isAnnual ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                style={{ height: 'calc(100% - 4px)' }}
              >
                Annually
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black tracking-widest text-emerald-400 uppercase">
                Save 20%
              </span>
              <span>when billed annually</span>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col rounded-[2.5rem] border border-white/10 bg-[#050505] p-12 backdrop-blur-xl transition-all hover:border-white/20"
          >
            <h3 className="mb-2 text-3xl font-bold tracking-tight text-white">Starter</h3>
            <p className="mb-8 text-lg font-medium text-neutral-400">
              Perfect for individual developers exploring orchestration.
            </p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-7xl font-bold tracking-tighter text-white">$0</span>
              <span className="text-lg font-medium text-neutral-500">/ forever</span>
            </div>

            <button className="mb-12 w-full rounded-full border border-white/10 bg-white/5 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              Get Started for Free
            </button>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                  <Check className="h-3 w-3 text-neutral-300" />
                </div>
                <span className="text-base font-medium text-neutral-300">
                  1 Architecture Generation per day
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                  <Check className="h-3 w-3 text-neutral-300" />
                </div>
                <span className="text-base font-medium text-neutral-300">
                  Basic Cost Mapping Tool
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800">
                  <Check className="h-3 w-3 text-neutral-300" />
                </div>
                <span className="text-base font-medium text-neutral-300">
                  Community Forums Support
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col rounded-[2.5rem] border border-indigo-500/40 bg-[#0d0d0d] p-12 shadow-[0_0_100px_rgba(99,102,241,0.1)] backdrop-blur-xl transition-all hover:border-indigo-500/60"
          >
            <div className="absolute -top-4 right-10 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-5 py-2 text-[12px] font-bold tracking-widest text-indigo-400 uppercase shadow-lg backdrop-blur-md">
              Most Popular
            </div>

            <h3 className="mb-2 flex items-center gap-2 text-3xl font-bold tracking-tight text-white">
              Pro
            </h3>
            <p className="mb-8 text-lg font-medium text-neutral-400">
              For engineering teams building production systems.
            </p>
            <div className="mb-10 flex items-baseline gap-2">
              <span className="text-7xl font-bold tracking-tighter text-white">
                ${isAnnual ? '49' : '59'}
              </span>
              <span className="text-lg font-medium text-neutral-500">/ month per user</span>
            </div>

            <button className="mb-12 w-full rounded-full bg-white py-4 text-lg font-bold text-black shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Upgrade to Pro
            </button>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                  <Check className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-base font-bold text-white">Unlimited Flow Architectures</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                  <Check className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-base font-bold text-white">
                  Advanced Cost Intel Projections
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                  <Check className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-base font-bold text-white">
                  Unlimited PDF & Image Exports
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                  <Check className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-base font-bold text-white">
                  Priority Orchestration Support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
