'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { Illustration } from '@/components/ui/Illustration';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  ArrowRight,
  Layers,
  Cpu,
  ArrowUpRight,
  BrainCircuit,
  Menu,
  X,
  GitCompareArrows,
  Check,
  Star,
  Rocket,
  Code2,
  Twitter,
  Github,
  Linkedin,
  CircleDollarSign,
  ShieldCheck,
  Blocks,
  LibraryBig,
} from 'lucide-react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Animated Counter — smoothly counts from 0 to value
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Floating Grid Background — animated dot grid
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--color-primary-500)]/10 blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--color-accent-500)]/8 blur-[130px]" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-400)]/5 blur-[100px]" />
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Section wrapper with animation
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Feature Card with hover tilt
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  gradient,
  illustration,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  gradient: string;
  illustration?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-[var(--primary)]/5 hover:shadow-xl"
    >
      {/* Background glow on hover */}
      <div
        className={`absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-100 ${gradient}`}
      />

      <div className="relative">
        {/* Illustration */}
        {illustration && (
          <div className="mb-5 flex justify-center opacity-90 transition-transform duration-500 group-hover:scale-105">
            <Illustration name={illustration} size="sm" animate={false} />
          </div>
        )}
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Page Component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const FEATURES = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Decisions',
      desc: 'Our intelligence engine analyzes your project constraints and recommends tools that actually work together, not just popular choices.',
      gradient: 'from-violet-500 to-purple-600',
      illustration: 'ai-code-assistant',
    },
    {
      icon: Blocks,
      title: 'Interactive Blueprints',
      desc: 'Visualize your entire stack with drag-and-drop layers. See how each piece connects, from frontend frameworks to deployment.',
      gradient: 'from-blue-500 to-cyan-500',
      illustration: 'building-a-website',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Validated',
      desc: 'Every recommendation is backed by real-world usage data and compatibility guarantees across the full ecosystem.',
      gradient: 'from-emerald-500 to-green-600',
      illustration: 'code-inspection',
    },
    {
      icon: CircleDollarSign,
      title: 'Cost Intelligence',
      desc: 'Get instant cost projections — free tiers, paid plans, total monthly estimates per tool and for your entire stack.',
      gradient: 'from-orange-500 to-amber-500',
      illustration: 'business-analytics',
    },
    {
      icon: GitCompareArrows,
      title: 'Version & Compare',
      desc: 'Save multiple stack configurations, compare them side by side, and iterate until you find the perfect architecture.',
      gradient: 'from-pink-500 to-rose-500',
      illustration: 'version-control',
    },
    {
      icon: LibraryBig,
      title: 'Smart Catalog',
      desc: 'Browse 200+ curated tools across 12 categories with real pricing, pros/cons, and community-driven ratings.',
      gradient: 'from-indigo-500 to-blue-600',
      illustration: 'data-points',
    },
  ];

  const STEPS = [
    {
      num: '01',
      title: 'Describe Your Project',
      desc: 'Tell us about your app — type, scale, team size, and technical preferences. Our wizard guides you through every dimension.',
      icon: Code2,
      illustration: 'programming',
    },
    {
      num: '02',
      title: 'AI Generates Your Stack',
      desc: 'Our engine processes your requirements against 200+ tools and generates a tailored, optimized tech stack in seconds.',
      icon: Cpu,
      illustration: 'ai-response',
    },
    {
      num: '03',
      title: 'Customize & Export',
      desc: 'Fine-tune the recommendations. Swap tools, compare alternatives, and export your blueprint to share with your team.',
      icon: Rocket,
      illustration: 'completed-tasks',
    },
  ];

  const STATS = [
    { value: 230, suffix: '+', label: 'Tools & Frameworks' },
    { value: 12, suffix: '', label: 'Stack Categories' },
    { value: 2500, suffix: '+', label: 'Stacks Generated' },
    { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  ];

  const TESTIMONIALS = [
    {
      name: 'Sarah Chen',
      role: 'CTO at Nexus AI',
      text: 'Pylon saved us weeks of deliberation. The AI recommendations were spot-on and the cost projections helped us stay under budget.',
      avatar: 'SC',
    },
    {
      name: 'Marcus Williams',
      role: 'Lead Engineer at Finstack',
      text: 'The interactive blueprint view is a game changer. Being able to visualize your entire stack architecture before writing code is invaluable.',
      avatar: 'MW',
    },
    {
      name: 'Aisha Patel',
      role: 'Founder of DevBridge',
      text: 'We use Pylon for every new project kickoff. The comparison feature alone has prevented several costly architectural mistakes.',
      avatar: 'AP',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--background)] selection:bg-[var(--primary)]/30 selection:text-[var(--foreground)]">
      {/* ────────────────────────────────────────────────
          Navbar
         ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--color-accent-500)] shadow-[var(--primary)]/20 shadow-lg">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#features"
              className="rounded-lg px-3.5 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="rounded-lg px-3.5 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="rounded-lg px-3.5 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Pricing
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="shadow-[var(--primary)]/20 shadow-lg"
            >
              <Link href="/create">
                Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--border)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--muted-foreground)]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--muted-foreground)]"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--muted-foreground)]"
              >
                Pricing
              </a>
              <div className="mt-2 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="primary" className="w-full">
                  <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ────────────────────────────────────────────────
          Hero Section
         ──────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden">
        <GridBackground />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="mx-auto flex max-w-7xl items-center gap-12 px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40"
        >
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-1.5 text-sm font-medium text-[var(--primary)] backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-success-500)]" />
              ✨ Now with AI-powered recommendations
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 max-w-5xl text-4xl leading-[1.08] font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Architect Your{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-accent-400)] to-[var(--color-primary-500)] bg-clip-text text-transparent">
                  Perfect Stack
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path
                    d="M2 8c50-6 100-6 148-2s100 2 148-4"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>{' '}
              in Seconds
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)] sm:text-xl lg:mx-0"
            >
              The intelligent Tech Stack Engine that understands your project requirements and
              instantly generates optimized architectures with interactive blueprints.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                variant="primary"
                className="group h-13 w-full px-8 text-base shadow-[var(--primary)]/25 shadow-xl sm:w-auto"
              >
                <Link href="/create">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group h-13 w-full bg-transparent px-8 text-base sm:w-auto"
              >
                <Link href="/catalog">
                  Explore 230+ Tools
                  <ArrowUpRight className="ml-2 h-5 w-5 opacity-60 transition-opacity group-hover:opacity-100" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 text-xs text-[var(--muted-foreground)]/60"
            >
              No credit card required · Used by 2,500+ developers
            </motion.p>
          </div>

          {/* Right: Hero illustration (hidden on mobile) */}
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <Illustration
              name="visionary-technology"
              size="hero"
              glow
              glowColor="var(--primary)"
              float
            />
          </div>
        </motion.div>
      </section>

      {/* ────────────────────────────────────────────────
          Stats Counter Bar
         ──────────────────────────────────────────────── */}
      <Section className="border-y border-[var(--border)] bg-[var(--card)]/50">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-[var(--border)] sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={i} className="px-6 py-8 text-center sm:py-10">
              <p className="mb-1 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          Features Grid
         ──────────────────────────────────────────────── */}
      <Section id="features" className="relative px-6 py-24 sm:py-32">
        <GridBackground />
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">
              Powerful Features
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--color-accent-500)] bg-clip-text text-transparent">
                ship faster
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)]">
              Stop guessing which tools to use. Let AI craft the optimal combination tailored to
              your exact needs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          How It Works
         ──────────────────────────────────────────────── */}
      <Section
        id="how-it-works"
        className="border-t border-[var(--border)] bg-[var(--card)]/30 px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">
              How It Works
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              From idea to architecture in 3 steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => {
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group relative text-center"
                >
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-[90px] left-[calc(50%+80px)] hidden h-px w-[calc(100%-160px)] bg-gradient-to-r from-[var(--primary)]/30 to-transparent md:block" />
                  )}

                  {/* Step illustration */}
                  <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-lg transition-all duration-300 group-hover:border-[var(--primary)]/30 group-hover:shadow-[var(--primary)]/10 group-hover:shadow-xl">
                    <Illustration name={step.illustration} size="sm" animate={false} />
                  </div>
                  <p className="mb-1 text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
                    Step {step.num}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          Testimonials
         ──────────────────────────────────────────────── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">
              Loved by Engineers
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Trusted by teams worldwide
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-[var(--color-warning-500)] text-[var(--color-warning-500)]"
                    />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--color-accent-500)] text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{t.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          Pricing
         ──────────────────────────────────────────────── */}
      <Section
        id="pricing"
        className="border-t border-[var(--border)] bg-[var(--card)]/30 px-6 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">
              Pricing
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto max-w-xl text-lg text-[var(--muted-foreground)]">
              Start free and upgrade when you need more power.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
              <h3 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Free</h3>
              <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                For individuals exploring ideas.
              </p>
              <p className="mb-6">
                <span className="text-4xl font-bold text-[var(--foreground)]">$0</span>
                <span className="ml-1 text-sm text-[var(--muted-foreground)]">/month</span>
              </p>
              <Button asChild variant="outline" className="mb-8 w-full">
                <Link href="/create">Get Started</Link>
              </Button>
              <ul className="space-y-3">
                {[
                  '3 projects',
                  '50 tool comparisons/month',
                  'Basic AI recommendations',
                  'Community support',
                  'Export to PDF',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success-500)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro tier */}
            <div className="relative rounded-2xl border-2 border-[var(--primary)] bg-[var(--card)] p-8 shadow-[var(--primary)]/10 shadow-xl">
              <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--color-accent-500)] px-4 py-1 text-xs font-bold text-white shadow-lg">
                MOST POPULAR
              </div>
              <h3 className="mb-1 text-lg font-semibold text-[var(--foreground)]">Pro</h3>
              <p className="mb-6 text-sm text-[var(--muted-foreground)]">
                For teams shipping production apps.
              </p>
              <p className="mb-6">
                <span className="text-4xl font-bold text-[var(--foreground)]">$19</span>
                <span className="ml-1 text-sm text-[var(--muted-foreground)]">/month</span>
              </p>
              <Button
                asChild
                variant="primary"
                className="mb-8 w-full shadow-[var(--primary)]/20 shadow-lg"
              >
                <Link href="/create">Upgrade to Pro</Link>
              </Button>
              <ul className="space-y-3">
                {[
                  'Unlimited projects',
                  'Unlimited tool comparisons',
                  'AI-powered stack advisor',
                  'Export to PDF',
                  'Priority support',
                  'Early access to new features',
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          Final CTA
         ──────────────────────────────────────────────── */}
      <Section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--card)] to-[var(--color-accent-500)]/10 p-12 sm:p-16"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[var(--primary)]/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--color-accent-500)]/15 blur-[100px]" />

            <div className="relative flex flex-col items-center gap-10 md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                  Ready to build <span className="text-[var(--primary)]">10× faster</span>?
                </h2>
                <p className="mb-8 max-w-lg text-lg text-[var(--muted-foreground)]">
                  Join thousands of developers who trust Pylon to make the right technology
                  decisions.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
                  <Button
                    asChild
                    size="lg"
                    variant="primary"
                    className="group h-13 px-8 text-base shadow-[var(--primary)]/25 shadow-xl"
                  >
                    <Link href="/create">
                      Start Building
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="h-13 px-8 text-base">
                    <Link href="/catalog">Browse Catalog</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden flex-shrink-0 md:block">
                <Illustration name="team-collaboration" size="lg" glow float />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ────────────────────────────────────────────────
          Footer
         ──────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-[var(--card)]/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--color-accent-500)]">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                  Pylon
                </span>
              </Link>
              <p className="mb-6 max-w-[260px] text-sm leading-relaxed text-[var(--muted-foreground)]">
                The intelligent Tech Stack Engine. Make the right technology decisions, faster.
              </p>
              <div className="flex gap-3">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/30 hover:text-[var(--foreground)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Catalog', href: '/catalog' },
                  { label: 'Create Project', href: '/create' },
                  { label: 'AI Wizard', href: '/wizard' },
                  { label: 'Pricing', href: '#pricing' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
            <p className="text-xs text-[var(--muted-foreground)]">
              © 2026 Pylon Architecture Engine. All rights reserved.
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Made with ❤️ for developers everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
