'use client';

import { motion } from 'framer-motion';
import { Network, Database, BrainCircuit } from 'lucide-react';

export function LinearHowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Input constraints',
      description:
        'Select your project type, deployment scale, and engineering budget. Pylon ingests your base requirements into the orchestration graph.',
      icon: <Database className="h-6 w-6 text-indigo-400" />,
    },
    {
      id: '02',
      title: 'AI formulation',
      description:
        'Our neural engine evaluates thousands of tool combinations, discarding patterns that conflict or create downstream technical debt.',
      icon: <BrainCircuit className="h-6 w-6 text-fuchsia-400" />,
    },
    {
      id: '03',
      title: 'Architecture delivered',
      description:
        'Receive a deterministic, full-stack architectural map complete with exact cost vectors and integration guides.',
      icon: <Network className="h-6 w-6 text-emerald-400" />,
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-black py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-24 md:flex md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="mb-6 text-5xl font-semibold tracking-tighter text-white md:text-7xl">
              A smarter way to build
            </h2>
            <p className="text-xl leading-relaxed text-neutral-400">
              The days of spending weeks investigating vendor docs and comparing cloud pricing are
              over. Here is the modern approach.
            </p>
          </div>
        </div>

        {/* Cernel-style Animated Stagger Grid */}
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: 'easeOut' }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-10"
            >
              {/* Subtle hover gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                    {step.icon}
                  </div>
                  <span className="text-5xl font-bold tracking-tighter text-white/10">
                    {step.id}
                  </span>
                </div>

                <h3 className="mb-4 text-3xl font-bold tracking-tight text-white">{step.title}</h3>

                <p className="text-lg leading-relaxed font-medium text-neutral-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
