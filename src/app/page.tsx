'use client';

import { Button, Card, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ArrowRight, Zap, Layers, Cpu, Shield, ArrowUpRight, Brain } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white">
      {/* Navbar Minimal */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.05] px-6 py-4 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary">Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pt-24 pb-32 text-center md:px-12 lg:pt-36 lg:pb-40">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary-500)]/20 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="mb-8 inline-flex items-center rounded-full border border-[var(--border)] bg-white/5 px-3 py-1 text-sm font-medium text-[var(--muted-foreground)] backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-success-500)]" />
            VibeCoding v2.0 is now live
          </div>
          <h1 className="mb-8 text-5xl leading-[1.1] font-extrabold tracking-tight text-[var(--foreground)] sm:text-7xl lg:text-8xl">
            Architect Your Next{' '}
            <span className="bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-accent-400)] bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl">
            The intelligent Tech Stack Engine that understands your project requirements and
            instantly generates the perfect architecture, complete with interactive blueprints.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/wizard">
              <Button
                size="lg"
                variant="primary"
                className="group h-14 w-full px-8 text-lg sm:w-auto"
              >
                Start Building
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="group h-14 w-full bg-transparent px-8 text-lg sm:w-auto"
              >
                Explore Catalog
                <ArrowUpRight className="ml-2 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-[var(--border)] bg-white/[0.02] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Everything you need to scale
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)]">
              Stop guessing which framework, database, or hosting provider to use. Let AI craft the
              optimal combination tailored to your exact needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden border border-[var(--border)] bg-[var(--background)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-30">
                <Brain className="h-24 w-24 text-[var(--primary)]" />
              </div>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                  <Zap className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <CardTitle className="text-xl">AI-Powered Decisions</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Our intelligence engine processes your specific project constraints to recommend
                  tools that actually work together.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border border-[var(--border)] bg-[var(--background)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-30">
                <Layers className="h-24 w-24 text-[var(--color-accent-500)]" />
              </div>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/10">
                  <Cpu className="h-6 w-6 text-[var(--color-accent-500)]" />
                </div>
                <CardTitle className="text-xl">Interactive Blueprints</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Visualize your entire stack structurally. Drag, drop, and customize the generated
                  layers in an intuitive canvas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border border-[var(--border)] bg-[var(--background)]">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-30">
                <Shield className="h-24 w-24 text-[var(--color-success-500)]" />
              </div>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-success-500)]/10">
                  <Shield className="h-6 w-6 text-[var(--color-success-500)]" />
                </div>
                <CardTitle className="text-xl">Enterprise Validated</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Every recommendation is backed by real-world usage data and compatibility
                  guarantees across the entire ecosystem.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-12 text-center text-[var(--muted-foreground)] md:px-12">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Layers className="h-5 w-5" />
          <span className="font-bold tracking-tight text-[var(--foreground)]">Pylon</span>
        </div>
        <p>© 2026 Pylon Architecture Engine. All rights reserved.</p>
      </footer>
    </div>
  );
}
