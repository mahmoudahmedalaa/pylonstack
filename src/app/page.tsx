'use client';
import { useState } from 'react';
import {
  Layers,
  Menu,
  X,
  Database,
  BrainCircuit,
  Search,
  AppWindow,
  Smartphone,
  Webhook,
  Zap,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicHero } from '@/components/home/CinematicHero';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Optimized Grid Background
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center overflow-hidden bg-[#000000]">
      <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[800px] w-[1000px] -translate-x-1/2 opacity-[0.15]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent mix-blend-screen blur-[120px]" />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Logo Cloud (Social Proof) - Silhouettes
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LogoCloud() {
  const logos = [
    'Vercel',
    'Supabase',
    'Stripe',
    'Linear',
    'Acme Corp',
    'GlobalTech',
    'Clerk',
    'Redis',
    'Neon',
    'Tailwind',
  ];
  return (
    <section className="relative z-20 border-y border-white/5 bg-black py-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <p className="mb-10 text-center text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
          Trusted by engineers at innovative companies
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track group flex items-center">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo}-${i}`}
                className="font-display mx-12 shrink-0 text-3xl font-bold tracking-widest text-white uppercase transition-opacity duration-300 md:text-3xl"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Features Section - Asymmetric Scroll-Spy (Stark White)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const FEATURES = [
  {
    id: 'compatibility',
    icon: <Database className="h-5 w-5 text-black" />,
    title: 'Universal Compatibility',
    desc: 'Map frontends, microservices, databases, and APIs. We normalize over 230+ technologies into unified configuration layers you can easily track',
    leftTitle: 'A deterministic approach to architecture',
    leftDesc:
      'Curated catalog data, real-time pricing models, and structural roadmaps. Absolute clarity from day one',
    visual: (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-0 pt-12">
        {/* Layer 3 - Next.js (Top) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="z-30 flex w-[95%] translate-y-[-40px] transform items-center justify-between rounded-3xl border border-neutral-200/60 bg-white/95 p-5 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.15)] backdrop-blur-md sm:w-[85%]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-black text-white shadow-inner">
              <AppWindow className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold">Frontend Framework</h4>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                NEXT.JS
              </p>
            </div>
          </div>
          <div className="mr-2 flex gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          </div>
        </motion.div>
        {/* Layer 2 - Database (Middle) */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="z-20 flex w-[95%] translate-y-[-20px] transform items-center justify-between rounded-3xl border border-neutral-200/60 bg-neutral-50/95 p-5 shadow-[0_15px_40px_-5px_rgb(0,0,0,0.08)] backdrop-blur-md sm:w-[90%]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-neutral-100 bg-white text-blue-600 shadow-sm">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold">Database Matrix</h4>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                SUPABASE
              </p>
            </div>
          </div>
          <div className="mr-2 flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        </motion.div>
        {/* Layer 1 - Auth (Bottom) */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="z-10 flex w-[95%] translate-y-[0px] transform items-center justify-between rounded-3xl border border-neutral-200/60 bg-neutral-100/95 p-5 shadow-sm backdrop-blur-md sm:w-[95%]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-neutral-800 text-white shadow-inner">
              <Webhook className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold">Authentication Guard</h4>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                CLERK
              </p>
            </div>
          </div>
          <div className="mr-2 flex gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'orchestration',
    icon: <BrainCircuit className="h-5 w-5 text-black" />,
    title: 'Orchestration Engine',
    desc: 'Input your user scale and compliance requirements. Our engine computes the exact stack configuration optimized for your constraints',
    leftTitle: 'Calculate risk before you write code',
    leftDesc:
      'Identify integration bottlenecks instantly. The orchestration engine understands the dependencies between 230+ services',
    visual: (
      <div className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center bg-transparent p-6">
        {/* Animated Architectural Mesh Connecting Lines */}
        <svg className="absolute inset-0 h-full w-full" overflow="visible">
          {/* Lines from Left Sources to Center Brain */}
          <motion.path
            d="M 70 60 Q 150 140, 200 140"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: -100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 70 140 L 200 140"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: -100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 70 220 Q 150 140, 200 140"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: -100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          {/* Lines from Center Brain to Right Outputs */}
          <motion.path
            d="M 280 140 L 320 140 M 320 140 Q 350 140, 390 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 280 140 L 390 140"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 280 140 L 320 140 M 320 140 Q 350 140, 390 220"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
        </svg>

        {/* Custom Absolute Positioned Orchestration Diagram */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-black">
          <div className="pointer-events-auto relative h-[350px] w-[500px] shrink-0 scale-[0.6] sm:scale-[0.8] lg:scale-95">
            {/* SVG Connection Lines */}
            <svg
              className="absolute inset-0 z-0 h-full w-full overflow-visible"
              viewBox="0 0 500 350"
            >
              {/* Left to Center paths */}
              <motion.path
                d="M 120 75 Q 160 75, 250 175"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: -100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M 120 175 L 250 175"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: -100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M 120 275 Q 160 275, 250 175"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: -100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center to Right paths */}
              <motion.path
                d="M 250 175 Q 340 275, 380 275"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M 250 175 L 380 175"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M 250 175 Q 340 75, 380 75"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            </svg>

            {/* Left Nodes (Sources) */}
            <div className="pointer-events-none absolute top-[49px] left-[20px] z-10 flex w-[100px] flex-col items-end gap-10">
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <AppWindow className="h-5 w-5 text-cyan-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  FRONTEND
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <Smartphone className="h-5 w-5 text-pink-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  MOBILE
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <Webhook className="h-5 w-5 text-emerald-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  INTERNAL
                </span>
              </motion.div>
            </div>

            {/* Central Orchestrator Core */}
            <div className="pointer-events-none absolute top-[110px] left-[185px] z-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="group pointer-events-auto relative flex h-[130px] w-[130px] cursor-pointer items-center justify-center rounded-[2.5rem] border border-black/5 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] rounded-[2.5rem] bg-indigo-50/50 transition-colors group-hover:bg-indigo-100/50" />
                <BrainCircuit className="relative z-10 h-16 w-16 text-indigo-600" />
              </motion.div>
            </div>

            {/* Right Nodes (Sinks/Infra) */}
            <div className="pointer-events-none absolute top-[49px] right-[20px] z-10 flex w-[100px] flex-col items-start gap-10">
              <motion.div
                whileHover={{ scale: 1.1, x: -5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <Database className="h-5 w-5 text-blue-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  POSTGRES
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: -5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <Zap className="h-5 w-5 text-orange-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  REDIS
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, x: -5 }}
                className="group pointer-events-auto flex h-[52px] w-fit cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-black/10 bg-white px-4 shadow-lg transition-all hover:border-black/30 hover:shadow-xl"
              >
                <CreditCard className="h-5 w-5 text-purple-500 drop-shadow-sm transition-colors" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 group-hover:text-black">
                  STRIPE
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'cost-intelligence',
    icon: <Search className="h-5 w-5 text-black" />,
    title: 'Cost Intelligence',
    desc: 'Real-time tracking of variable pricing models. See exactly how costs scale mathematically over 10K, 100K, or 1M MAUs',
    leftTitle: 'Absolute financial predictability',
    leftDesc:
      'Infrastructure pricing is notoriously opaque. We map the unit economics of every layer so you never get surprised by a bill',
    visual: (
      <div className="relative h-full w-full overflow-hidden bg-transparent">
        {/* Sleek Floating Savings Callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 z-20 flex flex-col items-start bg-transparent"
        >
          <span className="mb-1 text-[12px] font-bold tracking-widest text-neutral-400 uppercase drop-shadow-sm">
            Cost Offset
          </span>
          <span className="text-4xl font-bold tracking-tighter text-indigo-500 drop-shadow-md">
            -$42k
          </span>
        </motion.div>

        {/* Automated Stroke Area Chart overlaying background lines */}
        <div className="pointer-events-none absolute inset-x-0 top-[50%] bottom-6 z-0 flex flex-col justify-between opacity-20">
          <div className="w-full border-b border-black" />
          <div className="w-full border-b border-black" />
          <div className="w-full border-b border-black" />
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex h-[70%] w-full items-end">
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="h-full w-full drop-shadow-sm"
          >
            <defs>
              <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 50 L 0 45 C 30 45, 50 15, 95 10 L 95 50 Z"
              fill="url(#gradientArea)"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.path
              d="M 0 45 C 30 45, 50 15, 95 10"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Terminal Point - shifted left off absolute edge so it doesn't get clipped */}
            <motion.circle
              cx="95"
              cy="10"
              r="2.5"
              fill="#fff"
              stroke="#6366f1"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            />
          </svg>
        </div>
      </div>
    ),
  },
];

function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id);

  const activeFeatureData = FEATURES.find((f) => f.id === activeFeature) || FEATURES[0];

  return (
    <section id="features" className="relative bg-white px-0 pt-32 pb-32 text-black lg:px-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="relative grid grid-cols-1 items-start gap-16 px-6 lg:grid-cols-2 lg:gap-32 lg:px-12">
          {/* Left Sticky Header */}
          <div className="flex flex-col self-start lg:sticky lg:top-48 lg:pr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="mb-8 text-5xl leading-[1.1] font-bold tracking-tighter text-black sm:text-7xl">
                  {activeFeatureData.leftTitle}
                </h2>
                <p className="max-w-md text-xl leading-relaxed font-medium text-neutral-500">
                  {activeFeatureData.leftDesc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Scrolling Cards */}
          <div className="flex flex-col gap-32 pb-32">
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.id}
                onViewportEnter={() => setActiveFeature(feature.id)}
                viewport={{ margin: '-50% 0px -50% 0px' }}
                className="group relative"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-4xl font-bold tracking-tight text-black">
                  {feature.title}
                </h3>
                <p className="mb-8 max-w-[480px] text-xl leading-relaxed font-medium text-neutral-500">
                  {feature.desc}
                </p>
                <div className="relative flex h-[430px] w-full flex-col justify-center bg-transparent px-2">
                  {feature.visual}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   How It Works - Massive Typography (Black)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Define Constraints',
      desc: 'Specify maximum budget, team size, and regulatory requirements',
    },
    {
      id: '02',
      title: 'Compute Architecture',
      desc: 'Our engine queries 230 tools to formulate a perfect software stack',
    },
    {
      id: '03',
      title: 'Extract Blueprint',
      desc: 'Export an actionable implementation roadmap with real-time APIs costs',
    },
  ];

  return (
    <section id="how-it-works" className="as border-t border-white/5 bg-black py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-32 text-center">
          <h2 className="mb-8 text-6xl font-bold tracking-tighter text-white sm:text-8xl">
            A structured workflow
          </h2>
          <p className="mx-auto max-w-3xl text-2xl font-light text-neutral-400 sm:text-3xl">
            Eliminate choice-paralysis. Follow an objective framework to plan infrastructure
          </p>
        </div>

        <div className="relative mx-auto mt-24 max-w-5xl">
          {/* Timeline Line */}
          <div className="absolute top-8 left-[15%] hidden h-[2px] w-[70%] bg-white/20 lg:block" />

          <div className="relative z-10 grid gap-16 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Step Circle */}
                <div className="z-10 mb-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black text-2xl font-bold text-white ring-8 ring-black">
                  {parseInt(step.id)}
                </div>
                <h3 className="mb-6 text-3xl font-bold tracking-tight text-white">{step.title}</h3>
                <p className="max-w-[300px] text-lg leading-relaxed font-light text-neutral-400">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Testimonials - Stark White & Micro-interactions
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Testimonials() {
  const reviews = [
    {
      body: 'TechStackEngine eliminated 3 weeks of research overhead. The architecture generated for our fintech compliance layer was extremely precise.',
      author: 'Alex R.',
      role: 'CTO',
    },
    {
      body: 'We were evaluating standard enterprise DBs until we modeled a much lighter infrastructure pattern that cut projected operating costs by 80%.',
      author: 'Samir K.',
      role: 'Lead Engineer',
    },
    {
      body: "It's rare to see infrastructure planning treated with this level of UX. The mathematical pricing breakdown alone creates massive ROI.",
      author: 'Jessica M.',
      role: 'VP Engineering',
    },
  ];
  return (
    <section className="relative border-t border-black/5 bg-white py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2 className="mb-24 text-center text-6xl font-bold tracking-tighter text-black sm:text-8xl">
          Trusted by leaders
        </h2>
        <div className="grid gap-16 md:grid-cols-3 lg:gap-24">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col pr-4"
            >
              <div className="mb-8 -translate-x-3 transform text-indigo-500">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-20 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-16 flex-1 text-3xl leading-[1.3] font-semibold tracking-tight text-black">
                {r.body}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-neutral-100 text-sm font-bold text-neutral-400">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-black">{r.author}</div>
                  <div className="mt-0.5 text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                    {r.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Final CTA - Pure Minimalism
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCTA() {
  return (
    <section className="relative border-t border-white/5 bg-black py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-8 text-5xl leading-[1.1] font-bold tracking-tighter text-white md:text-7xl">
          Ready to map?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-neutral-400 sm:text-xl">
          Get clear pricing breakdowns, scalability insights, and absolute clarity on the tools you
          need.
        </p>
        <Link
          href="/create"
          className="inline-flex h-16 items-center justify-center rounded-full bg-white px-12 text-lg font-bold text-black transition-transform hover:scale-105 hover:bg-neutral-200 active:scale-95"
        >
          Build Your Stack
        </Link>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Page Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black pb-16 selection:bg-indigo-500/30 selection:text-white">
      {/* ────────────────────────────────────────────────
          Minimalist Navbar
         ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-3xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <Layers className="h-4 w-4 text-black transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Pylon</span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <Link
              href="#features"
              className="text-sm font-bold tracking-widest text-white/80 uppercase transition-all hover:scale-105 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-bold tracking-widest text-white/80 uppercase transition-all hover:scale-105 hover:text-white"
            >
              About
            </Link>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/login"
              className="text-base font-bold text-white/70 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/create"
              className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-black transition-transform hover:scale-105 hover:bg-neutral-200"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-6 border-t border-white/10 bg-black px-6 py-6 md:hidden">
            <Link
              href="#features"
              className="text-lg font-semibold text-neutral-400 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-lg font-semibold text-neutral-400 hover:text-white"
            >
              About
            </Link>
            <Link href="/login" className="text-lg font-semibold text-neutral-400 hover:text-white">
              Sign In
            </Link>
            <Link href="/create" className="text-lg font-bold text-white">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <GridBackground />
      <CinematicHero />

      {/* Sections */}
      <LogoCloud />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />

      {/* ────────────────────────────────────────────────
          Minimalist Single-Row Footer
         ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-black pt-16 pb-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
              <Layers className="h-3 w-3 text-black" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">Pylon</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/catalog"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              Catalog
            </Link>
            <Link
              href="/create"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              Stack Engine
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-neutral-500 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
