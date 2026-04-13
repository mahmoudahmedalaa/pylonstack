'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export function LinearResults() {
  const stats = [
    {
      metric: '100%',
      label: 'Reduction in manual research',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-transparent',
    },
    {
      metric: '-3 weeks',
      label: 'Accelerated go-to-market speed',
      icon: <TrendingUp className="h-5 w-5 text-indigo-400" />,
      color: 'from-indigo-500/20 to-transparent',
    },
    {
      metric: '80%',
      label: 'Decrease in scaling infra costs',
      icon: <ArrowUpRight className="h-5 w-5 text-fuchsia-400" />,
      color: 'from-fuchsia-500/20 to-transparent',
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-black py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-24 md:w-3/5">
          <h2 className="mb-6 text-5xl font-semibold tracking-tighter text-white md:text-7xl">
            Higher standards are emerging
          </h2>
          <p className="text-xl leading-relaxed text-neutral-400">
            What changes when architecture planning runs itself? Engineering teams using Pylon
            launch zero-debt products faster, while unlocking massive operating capital right out of
            the gate.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-10 transition-colors hover:border-white/20"
            >
              <div
                className={`absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-bl ${stat.color} blur-[60px]`}
              />

              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner">
                  {stat.icon}
                </div>
                <div className="mb-2 text-6xl font-bold tracking-tighter text-white">
                  {stat.metric}
                </div>
                <div className="text-lg font-medium tracking-wide text-neutral-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
