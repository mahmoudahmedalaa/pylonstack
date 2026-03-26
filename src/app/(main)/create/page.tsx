'use client';

import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useProjects } from '@/hooks/use-projects';
import { UpgradeModal, useUpgradeModal } from '@/components/UpgradeModal';
import { ProBadge } from '@/components/ProBadge';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { BlurIn } from '@/components/ui/blur-in';
import { Illustration } from '@/components/ui/Illustration';
import { motion } from 'framer-motion';

export default function CreateProjectPage() {
  const { canCreateProject, isFree, canUseAI } = useSubscription();
  const { data: projects } = useProjects();
  const projectCount = projects?.length ?? 0;
  const atLimit = !canCreateProject(projectCount);
  const upgradeModal = useUpgradeModal();

  const handleGatedClick = (e: React.MouseEvent) => {
    if (atLimit) {
      e.preventDefault();
      upgradeModal.show(
        "You've reached the free plan limit of 3 projects. Upgrade to Pro for unlimited projects.",
      );
    }
  };

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center px-4 py-16">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 max-w-2xl text-center"
      >
        <BlurIn
          word="Scale Your Vision"
          className="mb-4 text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl"
        />
        <p className="text-lg leading-relaxed text-[var(--muted-foreground)] sm:text-xl">
          Select your preferred architectural approach. Use our AI Intelligence to optimize for
          performance and cost, or build from scratch for total control.
        </p>

        {isFree && (
          <div className="mt-6 inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600">
            {atLimit ? (
              <span className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                Workspace Full: {projectCount}/3 projects
              </span>
            ) : (
              <span>Your Workspace: {projectCount}/3 free projects used</span>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Selection Grid ── */}
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
        {/* AI Advisor Option */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group"
        >
          <Link
            href="/wizard"
            className={`relative block h-full ${atLimit ? 'cursor-not-allowed' : ''}`}
            onClick={handleGatedClick}
          >
            <SpotlightCard
              className={`relative h-full overflow-hidden border-2 border-[var(--border)] bg-[var(--card)] p-0 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-primary-500)]/50 ${atLimit ? 'opacity-70 grayscale-[0.5]' : ''}`}
            >
              {!atLimit && (
                <BorderBeam
                  size={250}
                  duration={12}
                  delay={9}
                  colorFrom="var(--color-primary-500)"
                  colorTo="var(--color-primary-400)"
                />
              )}

              <div className="relative z-10 flex h-full flex-col p-10">
                <div className="mb-6 flex items-center justify-between">
                  <Illustration name="ai-code-generation" size="sm" animate={false} />
                  {!canUseAI && <ProBadge size="lg" />}
                </div>

                <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--color-primary-500)]">
                  AI Stack Advisor
                </h2>
                <p className="mb-10 flex-grow text-base leading-relaxed text-[var(--muted-foreground)]">
                  Answer a few strategic questions about your product idea. Our proprietary engine
                  analyzes 1,000+ data points to architect a production-ready, cost-optimized stack.
                </p>

                <div className="mt-auto flex items-center gap-2 text-lg font-bold text-[var(--color-primary-500)]">
                  <span>Start AI Intelligence</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </div>
              </div>

              {/* Subtle mesh background for AI card */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-[var(--color-primary-500)]/5 blur-[80px]" />
            </SpotlightCard>
          </Link>
        </motion.div>

        {/* Manual Assembly Option */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="group"
        >
          <Link
            href="/project/new"
            className={`relative block h-full ${atLimit ? 'cursor-not-allowed' : ''}`}
            onClick={handleGatedClick}
          >
            <SpotlightCard
              className={`relative h-full overflow-hidden border-2 border-[var(--border)] bg-[var(--card)] p-0 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent-500)]/50 ${atLimit ? 'opacity-70 grayscale-[0.5]' : ''}`}
            >
              <div className="relative z-10 flex h-full flex-col p-10">
                <div className="mb-6">
                  <Illustration name="source-code" size="sm" animate={false} />
                </div>

                <h2 className="mb-4 text-3xl font-bold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--color-accent-500)]">
                  Architectural Canvas
                </h2>
                <p className="mb-10 flex-grow text-base leading-relaxed text-[var(--muted-foreground)]">
                  For experienced architects who know their tools. Start with a clean slate and
                  manually assemble your layers from our curated database of performance-verified
                  tools.
                </p>

                <div className="mt-auto flex items-center gap-2 text-lg font-bold text-[var(--color-accent-600)]">
                  <span>Open Design Studio</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                </div>
              </div>

              {/* Decorative circle */}
              <div className="absolute right-0 bottom-0 -mr-12 -mb-12 h-48 w-48 rounded-full bg-slate-400/5 blur-[60px]" />
            </SpotlightCard>
          </Link>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        All recommendations are synchronized with real-time pricing and availability data.
      </motion.p>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onClose={upgradeModal.hide}
        reason={upgradeModal.reason}
      />
    </div>
  );
}
