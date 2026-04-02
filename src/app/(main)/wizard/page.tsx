'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import {
  Globe,
  Smartphone,
  Server,
  Monitor,
  Terminal,
  Puzzle,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Users,
  Building,
  Building2,
  Zap,
  TrendingUp,
  DollarSign,
  Heart,
  Shield,
  CreditCard,
  Radio,
  HardDrive,
  BarChart3,
  Brain,
  Mail,
  Search,
  GitBranch,
  FileCode,
  Cloud,
  Settings,
  FolderTree,
  Rocket,
  Loader2,
  Info,
} from 'lucide-react';
import { Button, ProgressBar, Textarea } from '@/components/ui';
import { StackBuilder, wizardAnswersToLayers } from '@/components/stack-builder';
import {
  PROJECT_TYPES,
  TEAM_SIZES,
  PRIORITIES,
  REQUIREMENTS,
  PREFERENCES,
  ANALYTICS,
} from '@/data/wizard-constants';
import { useWizardStore } from '@/stores/wizard-store';
import { GeneratingOverlay } from '@/components/wizard/GeneratingOverlay';
import Image from 'next/image';

// ── Step illustrations ────────────────────────────
const STEP_ILLUSTRATIONS: Record<number, string> = {
  1: '/illustrations/undraw/building-a-website.svg',
  2: '/illustrations/undraw/good-team.svg',
  3: '/illustrations/undraw/control-panel.svg',
  4: '/illustrations/undraw/goals.svg',
  5: '/illustrations/undraw/programming.svg',
  6: '/illustrations/undraw/completed-tasks.svg',
};

// ── Icon map ────────────────────────────────────

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Server,
  Monitor,
  Terminal,
  Puzzle,
  User,
  Users,
  Building,
  Building2,
  Zap,
  TrendingUp,
  DollarSign,
  Heart,
  Shield,
  CreditCard,
  Radio,
  HardDrive,
  BarChart3,
  Brain,
  Mail,
  Search,
  GitBranch,
  FileCode,
  Cloud,
  Settings,
  FolderTree,
};

// ── Option Card ─────────────────────────────────

function OptionCard({
  title,
  description,
  icon,
  tooltip,
  isSelected,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  tooltip?: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = iconMap[icon] || Globe;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-start rounded-xl border-2 p-5 text-left transition-all duration-200 ${
        isSelected
          ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_0_1px_var(--primary),var(--shadow-glow)]'
          : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 hover:bg-[var(--elevated)]'
      }`}
    >
      {/* Selection indicator */}
      <div className={`absolute top-3 right-3 flex items-center gap-1.5`}>
        {/* Tooltip trigger */}
        {tooltip && (
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
          >
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]"
              tabIndex={0}
              role="note"
              aria-label={tooltip}
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="h-3 w-3" />
            </div>

            {/* Tooltip popover */}
            {showTooltip && (
              <div
                className="absolute top-7 right-0 z-50 w-56 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 shadow-xl"
                role="tooltip"
              >
                <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                  {tooltip}
                </p>
                <div className="absolute -top-1 right-2.5 h-2 w-2 rotate-45 border-t border-l border-[var(--border)] bg-[var(--elevated)]" />
              </div>
            )}
          </div>
        )}

        {/* Check circle */}
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
            isSelected
              ? 'bg-[var(--primary)] text-white'
              : 'border border-[var(--border)] bg-transparent'
          }`}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </div>
      </div>

      {/* Icon */}
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
          isSelected
            ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
            : 'bg-[var(--muted)]/50 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <h3
        className={`mt-3 text-sm font-medium ${
          isSelected ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]'
        }`}
      >
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">{description}</p>
    </button>
  );
}

// ── Step Indicator ──────────────────────────────

const STEPS = [
  { number: 1, label: 'Project Type' },
  { number: 2, label: 'Team Size' },
  { number: 3, label: 'Requirements' },
  { number: 4, label: 'Priorities' },
  { number: 5, label: 'Preferences' },
  { number: 6, label: 'Analytics' },
  { number: 7, label: 'Review' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                step.number < currentStep
                  ? 'bg-[var(--color-accent-500)] text-white'
                  : step.number === currentStep
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}
            >
              {step.number < currentStep ? <Check className="h-3.5 w-3.5" /> : step.number}
            </div>
            <span
              className={`hidden text-xs sm:inline ${
                step.number === currentStep
                  ? 'font-medium text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-6 sm:w-8 ${
                step.number < currentStep ? 'bg-[var(--color-accent-500)]' : 'bg-[var(--border)]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step Config ─────────────────────────────────

interface StepConfig {
  title: string;
  subtitle: string;
  multiSelect: boolean;
}

const STEP_CONFIG: Record<number, StepConfig> = {
  1: {
    title: 'What are you building?',
    subtitle:
      'Select the type of project. This determines which tools and frameworks we recommend.',
    multiSelect: false,
  },
  2: {
    title: 'How big is your team?',
    subtitle: 'Team size affects recommendations for collaboration tools, CI/CD, and code review.',
    multiSelect: false,
  },
  3: {
    title: 'What does your project need?',
    subtitle:
      "Select all the capabilities your project requires. We'll recommend the best tools for each.",
    multiSelect: true,
  },
  4: {
    title: 'What matters most?',
    subtitle: 'Pick up to 2 priorities so we can weight our recommendations accordingly.',
    multiSelect: true,
  },
  5: {
    title: 'Any tech preferences?',
    subtitle: "Optional — tell us your engineering preferences and we'll factor them in.",
    multiSelect: true,
  },
  6: {
    title: 'Analytics Tools',
    subtitle: 'Optional — select analytics platforms you prefer or currently use.',
    multiSelect: true,
  },
};

// ── Page: Wizard ────────────────────────────────

export default function WizardPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    currentStep,
    answers,
    isSubmitting,
    error,
    setStep,
    nextStep,
    prevStep,
    setProjectName,
    setDescription,
    setProjectType,
    setTeamSize,
    toggleRequirement,
    togglePriority,
    togglePreference,
    toggleAnalytics,
    canAdvance,
    reset,
    submitWizard,
  } = useWizardStore();

  // Reset store on mount so if users go to /wizard they start fresh
  useEffect(() => {
    reset();
  }, [reset]);

  // Derive stack layers from current answers
  const stackLayers = useMemo(() => wizardAnswersToLayers(answers), [answers]);

  // Handle wizard submission
  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await submitWizard();
    if (result) {
      setTimeout(() => {
        // use recommendationId because it is passed from the store
        router.push(`/results/${result.recommendationId}`);
      }, 800);
    }
  };

  const handleCancelGenerate = () => {
    setIsGenerating(false);
  };

  // Get the options and selection state for the current step
  const getStepData = () => {
    switch (currentStep) {
      case 1:
        return {
          options: PROJECT_TYPES,
          isSelected: (id: string) => answers.projectType === id,
          onSelect: (id: string) => setProjectType(id),
          cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        };
      case 2:
        return {
          options: TEAM_SIZES,
          isSelected: (id: string) => answers.teamSize === id,
          onSelect: (id: string) => setTeamSize(id),
          cols: 'grid-cols-1 sm:grid-cols-2',
        };
      case 3:
        return {
          options: REQUIREMENTS,
          isSelected: (id: string) => answers.requirements.includes(id),
          onSelect: (id: string) => toggleRequirement(id),
          cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        };
      case 4:
        return {
          options: PRIORITIES,
          isSelected: (id: string) => answers.priorities.includes(id),
          onSelect: (id: string) => togglePriority(id),
          cols: 'grid-cols-1 sm:grid-cols-2',
        };
      case 5:
        return {
          options: PREFERENCES,
          isSelected: (id: string) => answers.preferences.includes(id),
          onSelect: (id: string) => togglePreference(id),
          cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        };
      case 6:
        return {
          options: ANALYTICS,
          isSelected: (id: string) => answers.analytics.includes(id),
          onSelect: (id: string) => toggleAnalytics(id),
          cols: 'grid-cols-1 sm:grid-cols-2',
        };
      default:
        return null;
    }
  };

  const stepData = getStepData();
  const config = STEP_CONFIG[currentStep];

  // ── Review Step Helper ──
  const getLabel = (
    options: { id: string; title: string }[],
    ids: string | string[] | null,
  ): string => {
    if (!ids) return '—';
    if (typeof ids === 'string') return options.find((o) => o.id === ids)?.title ?? ids;
    if (ids.length === 0) return '—';
    return ids.map((id) => options.find((o) => o.id === id)?.title ?? id).join(', ');
  };

  return (
    <>
      <GeneratingOverlay
        isGenerating={isGenerating}
        error={error}
        onRetry={handleGenerate}
        onCancel={handleCancelGenerate}
      />
      <div className="mx-auto flex max-w-6xl gap-8">
        {/* ── Left column: Wizard content ── */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* ── Header ── */}
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--primary)]" />
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Stack Wizard
              </h1>
            </div>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Answer a few questions and let AI recommend the perfect tech stack for your project.
            </p>
          </div>

          {/* ── Progress ── */}
          <div className="space-y-3">
            <StepIndicator currentStep={currentStep} />
            <ProgressBar value={(currentStep / STEPS.length) * 100} />
          </div>

          {/* ── Step Content ── */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            {currentStep <= 6 && config && stepData ? (
              <>
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <span className="text-xs font-medium text-[var(--primary)]">
                      Step {currentStep} of {STEPS.length}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                      {config.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{config.subtitle}</p>
                    {config.multiSelect && currentStep === 4 && (
                      <p className="mt-1 text-xs text-[var(--primary)]">Select up to 2</p>
                    )}
                  </div>
                  <Image
                    src={STEP_ILLUSTRATIONS[currentStep]}
                    alt=""
                    width={80}
                    height={80}
                    className="hidden shrink-0 opacity-60 sm:block"
                  />
                </div>

                {/* ── Custom Field for Step 1 ── */}
                {currentStep === 1 && (
                  <div className="mb-6 space-y-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="project-name"
                        className="block text-sm font-medium text-[var(--foreground)]"
                      >
                        Project Name *
                      </label>
                      <Textarea
                        id="project-name"
                        placeholder="E.g., Pylon, OrbitTracker, etc."
                        value={answers.projectName || ''}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="h-12 resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="app-desc"
                        className="block text-sm font-medium text-[var(--foreground)]"
                      >
                        App Idea Description *
                      </label>
                      <Textarea
                        id="app-desc"
                        placeholder="E.g., A mobile app for tracking satellite orbits in real-time, needs to handle high-frequency data."
                        value={answers.description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="h-24 resize-none"
                      />
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Be specific! Our AI uses this deep context to recommend specialized
                        backend/infrastructure tools.
                      </p>
                    </div>

                    <div className="mt-8">
                      <label className="mb-3 block text-sm font-medium text-[var(--foreground)]">
                        Base Project Template *
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Option Grid ── */}
                <div className={`grid gap-3 ${stepData.cols}`}>
                  {stepData.options.map((option) => (
                    <OptionCard
                      key={option.id}
                      title={option.title}
                      description={option.description}
                      icon={option.icon}
                      isSelected={stepData.isSelected(option.id)}
                      onClick={() => stepData.onSelect(option.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* ── Step 7: Review ── */
              <div>
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <span className="text-xs font-medium text-[var(--primary)]">
                      Step 7 of {STEPS.length}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                      Review your answers
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Confirm your selections below, then generate your personalized tech stack
                      recommendation.
                    </p>
                  </div>
                  <Image
                    src={STEP_ILLUSTRATIONS[6]}
                    alt=""
                    width={80}
                    height={80}
                    className="hidden shrink-0 opacity-60 sm:block"
                  />
                </div>

                {error && (
                  <div className="mb-4 space-y-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    <p>{error}</p>
                    {error.includes('log in') && (
                      <p>
                        <Link
                          href="/login"
                          className="font-semibold underline transition-colors hover:text-red-300"
                        >
                          Click here to log in
                        </Link>
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {[
                    {
                      label: 'Project Name',
                      value: answers.projectName || '—',
                      step: 1,
                    },
                    {
                      label: 'App Description',
                      value: answers.description || '—',
                      step: 1,
                    },
                    {
                      label: 'Base Template',
                      value: getLabel(PROJECT_TYPES, answers.projectType),
                      step: 1,
                    },
                    { label: 'Team Size', value: getLabel(TEAM_SIZES, answers.teamSize), step: 2 },
                    {
                      label: 'Requirements',
                      value: getLabel(REQUIREMENTS, answers.requirements),
                      step: 3,
                    },
                    {
                      label: 'Priorities',
                      value: getLabel(PRIORITIES, answers.priorities),
                      step: 4,
                    },
                    {
                      label: 'Preferences',
                      value: getLabel(PREFERENCES, answers.preferences) || 'None',
                      step: 5,
                    },
                    {
                      label: 'Analytics',
                      value: getLabel(ANALYTICS, answers.analytics) || 'None',
                      step: 6,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between rounded-lg border border-[var(--border)] bg-[var(--elevated)] p-4"
                    >
                      <div>
                        <p className="text-xs font-medium text-[var(--muted-foreground)]">
                          {row.label}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                          {row.value}
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(row.step)}
                        className="text-xs font-medium text-[var(--primary)] hover:underline"
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>

            {currentStep < 7 ? (
              <Button variant="primary" size="sm" disabled={!canAdvance()} onClick={nextStep}>
                Next Step
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleGenerate} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Rocket className="mr-1.5 h-4 w-4" />
                    Generate Stack
                  </>
                )}
              </Button>
            )}
          </div>

          {/* ── Hint ── */}
          <p className="text-center text-xs text-[var(--muted-foreground)]">
            Don&apos;t worry — you can always go back and change your answers later.
          </p>
        </div>

        {/* ── Right column: Sticky Stack Builder Preview ── */}
        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-xl">
              <StackBuilder layers={stackLayers} mode="preview" totalCategories={8} showProgress />
            </div>

            {/* Tip below the stack builder */}
            {stackLayers.length > 0 && (
              <p className="mt-3 text-center text-[11px] text-neutral-500">
                Your stack updates live as you make selections
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
