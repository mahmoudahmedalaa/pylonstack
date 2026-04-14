'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layers, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { LinearHero } from '@/components/home/LinearHero';
import { LinearFeatures } from '@/components/home/LinearFeatures';
import { LiveIntegrations } from '@/components/home/LiveIntegrations';
import { LinearHowItWorks } from '@/components/home/LinearHowItWorks';
import { LinearResults } from '@/components/home/LinearResults';
import { LinearPricing } from '@/components/home/LinearPricing';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Testimonials - Dark Mode Conversion
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
    <section id="testimonials" className="relative border-y border-white/5 bg-black py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2 className="mb-24 text-center text-5xl font-bold tracking-tighter text-white sm:text-6xl">
          Trusted by engineering leaders
        </h2>
        <div className="grid gap-12 md:grid-cols-3 lg:gap-20">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex flex-col pr-4"
            >
              <div className="mb-8 -translate-x-2 transform text-indigo-500">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-30 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="mb-12 flex-1 text-2xl leading-[1.4] font-medium tracking-tight text-neutral-300">
                {r.body}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-white shadow-inner">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{r.author}</div>
                  <div className="mt-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
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
   Final CTA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCTA() {
  return (
    <section className="relative bg-black py-40">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-8 text-5xl leading-[1.1] font-semibold tracking-tighter text-white md:text-6xl">
          Ready to map your architecture?
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-neutral-400">
          Join elite engineering teams defining their technical architecture with clarity and
          mathematical precision.
        </p>
        <Link
          href="/create"
          className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-[15px] font-semibold text-black transition-transform hover:scale-105 active:scale-[0.98]"
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
    <div className="min-h-screen bg-black font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* ────────────────────────────────────────────────
          Minimalist Navbar
         ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
              <Layers className="h-4 w-4 text-black transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Pylon</span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <a
              href="#features"
              className="text-base font-medium tracking-wide text-neutral-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-base font-medium tracking-wide text-neutral-400 transition-colors hover:text-white"
            >
              Testimonials
            </a>
            <Link
              href="/catalog"
              className="text-base font-medium tracking-wide text-neutral-400 transition-colors hover:text-white"
            >
              Catalog
            </Link>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/login"
              className="text-base font-bold text-neutral-400 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/create"
              className="flex h-10 items-center justify-center rounded-full bg-white px-6 text-base font-bold text-black transition-transform hover:scale-105 active:scale-95"
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
            <Link href="#features" className="text-lg font-medium text-neutral-400">
              Features
            </Link>
            <Link href="#testimonials" className="text-lg font-medium text-neutral-400">
              Testimonials
            </Link>
            <Link href="/catalog" className="text-lg font-medium text-neutral-400">
              Catalog
            </Link>
            <Link href="/login" className="text-lg font-medium text-neutral-400">
              Log in
            </Link>
          </div>
        )}
      </nav>

      <LinearHero />
      <LiveIntegrations />
      <LinearFeatures />
      <LinearHowItWorks />
      <LinearResults />
      <Testimonials />
      <LinearPricing />
      <FinalCTA />

      {/* ────────────────────────────────────────────────
          Obsidian-Style Massive Text Footer
         ──────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-white/5 bg-black">
        {/* Massive Brand Watermark */}
        <div className="relative flex w-full justify-center pt-32 pb-20">
          <span className="pointer-events-none text-[26vw] leading-[0.75] font-bold tracking-tighter text-[#18181b] select-none">
            PYLON
          </span>
        </div>

        {/* Actual Layout Footer Layer */}
        <div className="relative z-10 border-t border-white/5 bg-[#050505] py-10">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:gap-0">
            <div className="text-sm font-semibold tracking-wide text-neutral-500">
              © 2026 Pylon Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-sm font-semibold tracking-wide text-neutral-500 transition-colors hover:text-white"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm font-semibold tracking-wide text-neutral-500 transition-colors hover:text-white"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-sm font-semibold tracking-wide text-neutral-500 transition-colors hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
