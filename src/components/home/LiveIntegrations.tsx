'use client';

import { motion } from 'framer-motion';
import { Database, Layout, Server, Shield, Zap, Box, Cloud, Network, Bot, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';

const tools = [
  { name: 'Next.js', icon: <Box className="h-6 w-6 text-white" /> },
  { name: 'Supabase', icon: <Database className="h-6 w-6 text-emerald-400" /> },
  { name: 'Clerk', icon: <Shield className="h-6 w-6 text-indigo-400" /> },
  { name: 'Vercel', icon: <Server className="h-6 w-6 text-white" /> },
  { name: 'Stripe', icon: <Zap className="h-6 w-6 text-purple-400" /> },
  { name: 'AWS Cloud', icon: <Cloud className="h-6 w-6 text-orange-400" /> },
  { name: 'React Native', icon: <Layout className="h-6 w-6 text-cyan-400" /> },
  { name: 'GraphQL', icon: <Network className="h-6 w-6 text-pink-400" /> },
  { name: 'OpenAI Vectors', icon: <Bot className="h-6 w-6 text-green-400" /> },
  { name: 'Neon DB', icon: <Cpu className="h-6 w-6 text-emerald-300" /> },
];

export function LiveIntegrations() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 230;
    const duration = 2000;
    const incrementTime = duration / end;

    // Quick counting animation sequence for the "230+" number (Mobbin style hook)
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-black pt-16 pb-24">
      {/* Background radial gradient */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="h-[40vh] w-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 text-center">
        <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-white md:text-5xl">
          A growing library of{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {count}+
          </span>{' '}
          normalized tools
        </h2>
        <p className="mx-auto mb-20 max-w-2xl text-xl text-neutral-400">
          Everything from core databases to specialized distributed systems. Pre-configured and
          instantly generated into your architecture.
        </p>
      </div>

      {/* Infinite Scroll Marquee Group */}
      <div className="relative flex overflow-hidden">
        {/* Dual fade edges for aesthetic bounding */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-48 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-48 bg-gradient-to-l from-black to-transparent" />

        <motion.div
          className="flex gap-6 pl-6 whitespace-nowrap"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {/* Triple array for genuinely seamless continuous scroll bounding */}
          {[...tools, ...tools, ...tools].map((tool, idx) => (
            <div
              key={idx}
              className="group flex h-20 min-w-[240px] items-center gap-5 rounded-2xl border border-white/10 bg-[#0a0a0a] px-6 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 shadow-inner transition-colors group-hover:bg-indigo-500/20">
                {tool.icon}
              </div>
              <span className="text-lg font-bold tracking-tight text-white/80 transition-colors group-hover:text-white">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
