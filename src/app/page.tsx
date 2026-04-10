'use client';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  ArrowRight,
  Layers,
  BrainCircuit,
  Menu,
  X,
  Search,
  Code2,
  Database,
  Sparkles,
  Quote
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroMockup } from '@/components/home/HeroMockup';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Optimized Grid Background
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none flex justify-center">
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/60 via-[var(--primary)]/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Logo Cloud (Social Proof)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LogoCloud() {
  const logos = ['Vercel', 'Supabase', 'Stripe', 'Linear', 'Acme Corp', 'GlobalTech'];
  return (
    <section className="py-10 border-y border-[var(--border)] bg-[var(--card)]/20 backdrop-blur-md relative z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-[var(--background)] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <p className="text-center text-sm font-semibold tracking-wide text-[var(--muted-foreground)] uppercase mb-6">
          Trusted by engineers at innovative companies
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center gap-10 md:gap-20 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
        >
          {logos.map((logo) => (
            <div key={logo} className="text-xl font-bold font-display uppercase tracking-widest text-[var(--foreground)] opacity-80 hover:opacity-100 transition-opacity">
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Bento Grid Section
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function BentoGrid() {
  return (
    <section id="features" className="relative px-6 py-32 bg-[var(--background)] overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-accent-500)]/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            A deterministic approach to architecture.
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-[var(--muted-foreground)] leading-relaxed">
            Curated catalog data, real-time pricing models, and structural roadmaps. <br className="hidden sm:block" />
            No halluncinations, just engineering facts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {/* Track Any Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl md:col-span-2 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-[var(--primary)]/50 hover:-translate-y-1 flex flex-col md:flex-row"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />
            <div className="relative p-10 md:p-12 flex flex-col flex-1 justify-center z-10">
              <Code2 className="h-8 w-8 text-[var(--foreground)] mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-3xl font-bold mb-4 text-[var(--foreground)]">Universal Compatibility</h3>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed max-w-md">
                Map frontends, microservices, messaging queues, and databases. We normalize over 230+ technologies into deterministic configuration layers you can track.
              </p>
            </div>
            <div className="w-full md:w-[45%] border-t-2 md:border-t-0 md:border-l-2 border-[var(--border)] bg-[var(--background)]/60 p-10 flex flex-col justify-center gap-4 relative z-10 backdrop-blur-3xl">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-sm hover:scale-[1.03] transition-transform cursor-default">
                <span className="text-base font-semibold">Authentication</span>
                <span className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md">Clerk</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-sm hover:scale-[1.03] transition-transform cursor-default">
                <span className="text-base font-semibold">Database Layer</span>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-md">Supabase</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 shadow-sm hover:scale-[1.03] transition-transform cursor-default">
                <span className="text-base font-semibold">Hosting Platform</span>
                <span className="text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-md">Vercel</span>
              </div>
            </div>
          </motion.div>

          {/* AI Feature -> Deterministic Engine */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-[var(--primary)]/50 hover:-translate-y-1 flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent pointer-events-none group-hover:from-[var(--primary)]/10 transition-colors" />
            <div className="p-10 h-full flex flex-col relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] flex items-center justify-center mb-8 border border-[var(--border)] group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <BrainCircuit className="h-7 w-7 text-[var(--foreground)] opacity-80" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Orchestration Engine</h3>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed flex-1">
                Input your user scale and compliance requirements. Our engine computes the exact stack configuration optimized for your constraints.
              </p>
            </div>
          </motion.div>

          {/* Pricing Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-[var(--primary)]/50 hover:-translate-y-1 flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/5 to-transparent pointer-events-none group-hover:from-amber-500/15 transition-colors duration-500" />
            <div className="p-10 h-full flex flex-col relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] flex items-center justify-center mb-8 border border-[var(--border)] group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <Search className="h-7 w-7 text-[var(--foreground)] opacity-80" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Cost Intelligence</h3>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed mt-auto">
                Real-time tracking of variable pricing models. See exactly how costs scale mathematically over 10K, 100K, or 1M MAUs.
              </p>
            </div>
          </motion.div>

          {/* Unified Catalog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl md:col-span-2 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-[var(--primary)]/50 hover:-translate-y-1 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none group-hover:from-sky-500/15 transition-colors duration-500" />
            <div className="relative p-10 flex-1 w-full z-10">
              <Database className="h-8 w-8 text-[var(--foreground)] mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-3xl font-bold mb-4 text-[var(--foreground)]">The Unified Catalog</h3>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed max-w-md">
                Browse our structured database of over 230+ engineering tools, languages, and frameworks. One vetted source of truth for modern software.
              </p>
            </div>
            <div className="pr-10 pb-10 pl-10 md:pl-0 md:p-10 flex-1 w-full flex flex-wrap gap-3 opacity-90 z-10">
              {[
                'Next.js', 'PostgreSQL', 'Redis', 'Tailwind',
                'Framer Motion', 'Supabase', 'Vercel', 'AWS',
                'Stripe', 'Clerk', 'React'
              ].map((tag) => (
                <div key={tag} className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition-colors cursor-default">
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   How It Works
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  const steps = [
    {
      id: '01',
      title: 'Define Constraints',
      description: 'Specify your maximum monthly budget, team size, and regulatory requirements (like HIPAA or SOC2).',
      icon: <BrainCircuit className="h-10 w-10 text-[var(--primary)]" />
    },
    {
      id: '02',
      title: 'Compute Architecture',
      description: 'Our engine queries over 230 tools and formulates a deterministic software stack tailored to your constraints.',
      icon: <Layers className="h-10 w-10 text-emerald-500" />
    },
    {
      id: '03',
      title: 'Extract Blueprint',
      description: 'Export an actionable implementation roadmap with real-time API cost forecasting for the chosen stack.',
      icon: <Code2 className="h-10 w-10 text-blue-500" />
    }
  ];

  return (
    <section id="how-it-works" className="py-32 border-t border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-24"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            A structured deployment workflow
          </h2>
          <p className="mt-6 text-xl text-[var(--muted-foreground)]">
            Eliminate choice-paralysis. Follow an objective framework to plan infrastructure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Connector line fragment to the next step */}
              {idx < 2 && (
                <div
                  className={`hidden md:block absolute top-[48px] left-[calc(50%+48px)] w-[calc(100%+4rem-96px)] h-[2px] bg-gradient-to-r rounded-full pointer-events-none ${idx === 0
                    ? 'from-[var(--primary)]/40 to-emerald-500/40'
                    : 'from-emerald-500/40 to-blue-500/40'
                    }`}
                />
              )}

              <div className="relative z-10 h-24 w-24 rounded-[2rem] border-2 border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md flex items-center justify-center mb-8 shadow-sm text-[var(--foreground)] group-hover:-translate-y-2 group-hover:border-[var(--primary)]/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
                {step.icon}
              </div>
              <div className="text-sm font-bold text-[var(--muted-foreground)] tracking-widest mb-3">STEP {step.id}</div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--foreground)]">{step.title}</h3>
              <p className="text-[var(--muted-foreground)] text-lg leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Testimonials
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Testimonials() {
  const reviews = [
    { body: "TechStackEngine eliminated 3 weeks of research overhead. The deterministic architecture generated for our fintech compliance layer was extremely precise.", author: "Alex R.", role: "CTO" },
    { body: "We were evaluating standard enterprise DBs until we modeled a much lighter infrastructure pattern that cut projected operating costs by 80%.", author: "Sam K.", role: "Lead Engineer" },
    { body: "It's rare to see infrastructure planning treated with this level of UX. The mathematical pricing breakdown alone creates massive ROI.", author: "Jessica M.", role: "VP Engineering" },
  ];
  return (
    <section className="py-32 bg-[var(--card)]/10 border-y border-[var(--border)] backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">Trusted by technical leaders</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-2xl p-10 shadow-lg flex flex-col hover:border-[var(--primary)]/50 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative group"
            >
              <div className="absolute -top-4 -left-4 text-8xl text-[var(--border)]/40 font-serif group-hover:text-[var(--primary)]/20 transition-colors pointer-events-none">"</div>
              <p className="text-[var(--foreground)] text-lg mb-10 leading-relaxed flex-1 relative z-10">{review.body}</p>
              <div className="flex items-center gap-4 border-t-2 border-[var(--border)]/50 pt-8 mt-auto group-hover:border-[var(--primary)]/20 transition-colors">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--color-accent-500)] flex items-center justify-center text-lg font-bold text-white shadow-md">{review.author.charAt(0)}</div>
                <div>
                  <div className="font-bold text-lg text-[var(--foreground)]">{review.author}</div>
                  <div className="text-sm font-medium text-[var(--muted-foreground)]">{review.role}</div>
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
   FAQ
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FAQ() {
  const faqs = [
    { q: "Is it free to generate a stack?", a: "Tracking your projects and exploring the catalog is completely free. We also include a complimentary basic AI stack generation on the free tier. Upgrading to a premium tier gives you unlimited AI architecting and advanced premium blueprints." },
    { q: "What do I get after generating a stack?", a: "You receive a comprehensive architecture blueprint containing your recommended tools with integration rationale, a phased implementation roadmap from MVP to scale, real-time API cost projections broken down by growth stage, and compliance mappings for standards like SOC2 and HIPAA. Think of it as a senior engineer's infrastructure playbook." },
    { q: "How accurate is the AI?", a: "Our AI targets 96% configuration accuracy and continuously autonomously learns from thousands of new architectures to get smarter every week. It bypasses the hallucinations of typical LLMs by exclusively leveraging an evolving RAG pipeline that strictly pulls from our official database." }
  ];

  return (
    <section className="py-32 relative border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight text-center mb-16 text-[var(--foreground)]"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.details
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-3xl border-2 border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-xl p-8 [&_summary::-webkit-details-marker]:hidden hover:border-[var(--primary)]/30 transition-colors shadow-sm cursor-pointer"
            >
              <summary className="flex items-center justify-between gap-4 font-bold text-[var(--foreground)]">
                <h3 className="text-2xl">{faq.q}</h3>
                <span className="shrink-0 rounded-full bg-[var(--muted)]/50 p-2 text-[var(--foreground)] group-open:-rotate-180 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <p className="mt-6 text-xl text-[var(--muted-foreground)] leading-relaxed animate-in fade-in slide-in-from-top-4 duration-500">{faq.a}</p>
            </motion.details>
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
    <section className="relative py-40 px-6 overflow-hidden bg-[var(--background)]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[var(--primary)]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-5xl text-center relative z-10"
      >
        <h2 className="text-5xl sm:text-7xl font-bold mb-8 text-[var(--foreground)] tracking-tight">Start mapping your architecture</h2>
        <p className="text-xl sm:text-2xl text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto leading-relaxed">
          Get clear pricing breakdowns, scalability insights, and absolute clarity on the tools you need.
        </p>
        <Button asChild size="lg" className="h-16 px-12 text-xl font-bold shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] transition-shadow">
          <Link href="/create">
            Create Free Project
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Page Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] selection:bg-[var(--primary)]/30 selection:text-[var(--foreground)]">
      {/* ────────────────────────────────────────────────
          Navbar
         ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)]/50 bg-[var(--background)]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--color-accent-500)] shadow-lg shadow-[var(--primary)]/20">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">How It Works</Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="primary" size="sm" className="shadow-[var(--primary)]/20 shadow-lg">
              <Link href="/create">Get Started</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[var(--foreground)] hover:bg-[var(--muted)]/50"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[var(--border)] bg-[var(--background)] md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <Link href="#features" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">How It Works</Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]">
                <Button asChild variant="ghost" className="justify-center">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="primary" className="justify-center">
                  <Link href="/create">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ────────────────────────────────────────────────
          Hero Section
         ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <GridBackground />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] shadow-sm px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Trusted by 500+ engineering teams
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl mb-6"
            >
              Plan your architecture with deterministic precision
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)] leading-relaxed mb-10"
            >
              The definitive platform for engineering teams to evaluate over 230+ verified software tools. Map infrastructure, forecast constraints, and construct enterprise-grade stacks without the research overhead.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-center flex-col sm:flex-row gap-3"
            >
              <Button asChild size="lg" className="h-12 px-6 shadow-sm">
                <Link href="/create">
                  Start Architecting
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <Link href="/catalog">
                  Browse Catalog
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Interactive Hero App Mockup */}
          <div className="mt-16 w-full relative z-20">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────
          New Sections
         ──────────────────────────────────────────────── */}
      <LogoCloud />
      <BentoGrid />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />

      {/* ────────────────────────────────────────────────
          Minimal Footer
         ──────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--background)] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[var(--muted-foreground)]">
          <div className="flex justify-center gap-4 mb-6">
            <Layers className="h-6 w-6 text-[var(--primary)]" />
          </div>
          <p>© {new Date().getFullYear()} Pylon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
