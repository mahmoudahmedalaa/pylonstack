'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Layout,
  Server,
  Database,
  Cloud,
  Shield,
  CreditCard,
  BarChart3,
  Brain,
  Smartphone,
  Radio,
  HardDrive,
  Mail,
  Search,
} from 'lucide-react';
import { useWizardStore, type WizardAnswers } from '@/stores/wizard-store';

/* ── Category mappings: which wizard answers produce which stack layers ── */
interface PreviewLayer {
  id: string;
  category: string;
  icon: React.ElementType;
  color: string;
  trigger: (answers: WizardAnswers) => boolean;
}

const LAYER_DEFINITIONS: PreviewLayer[] = [
  {
    id: 'frontend',
    category: 'Frontend Framework',
    icon: Layout,
    color: '#818cf8',
    trigger: (a) =>
      !!a.projectType &&
      ['web_app', 'saas', 'ecommerce', 'social_platform'].includes(a.projectType),
  },
  {
    id: 'mobile',
    category: 'Mobile Framework',
    icon: Smartphone,
    color: '#f472b6',
    trigger: (a) => !!a.projectType && ['mobile_app', 'cross_platform'].includes(a.projectType),
  },
  {
    id: 'backend',
    category: 'Backend & API',
    icon: Server,
    color: '#34d399',
    trigger: (a) => !!a.projectType,
  },
  {
    id: 'database',
    category: 'Database Layer',
    icon: Database,
    color: '#38bdf8',
    trigger: (a) => a.requirements.includes('database') || a.requirements.length > 0,
  },
  {
    id: 'auth',
    category: 'Authentication',
    icon: Shield,
    color: '#a78bfa',
    trigger: (a) => a.requirements.includes('auth') || a.requirements.includes('user_accounts'),
  },
  {
    id: 'payments',
    category: 'Payments',
    icon: CreditCard,
    color: '#fbbf24',
    trigger: (a) => a.requirements.includes('payments') || a.requirements.includes('billing'),
  },
  {
    id: 'hosting',
    category: 'Hosting & DevOps',
    icon: Cloud,
    color: '#60a5fa',
    trigger: (a) => !!a.teamSize,
  },
  {
    id: 'storage',
    category: 'File Storage',
    icon: HardDrive,
    color: '#10b981',
    trigger: (a) => a.requirements.includes('storage'),
  },
  {
    id: 'realtime',
    category: 'Real-time',
    icon: Radio,
    color: '#ef4444',
    trigger: (a) => a.requirements.includes('realtime'),
  },
  {
    id: 'email',
    category: 'Email & Notifications',
    icon: Mail,
    color: '#f59e0b',
    trigger: (a) => a.requirements.includes('email'),
  },
  {
    id: 'search',
    category: 'Search',
    icon: Search,
    color: '#0ea5e9',
    trigger: (a) => a.requirements.includes('search'),
  },
  {
    id: 'analytics',
    category: 'Analytics',
    icon: BarChart3,
    color: '#fb923c',
    trigger: (a) => a.analytics.length > 0 || a.requirements.includes('analytics'),
  },
  {
    id: 'ai',
    category: 'AI / ML',
    icon: Brain,
    color: '#c084fc',
    trigger: (a) =>
      a.requirements.includes('ai') ||
      a.requirements.includes('ml') ||
      a.requirements.includes('ai_ml'),
  },
];

/* ── Single preview layer bar ── */
function PreviewLayerBar({ layer, index }: { layer: PreviewLayer; index: number }) {
  const Icon = layer.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.08,
      }}
      className="relative flex items-center gap-3 rounded-xl border border-white/[0.08] px-4 py-3 backdrop-blur-xl"
      style={{
        background: `linear-gradient(135deg, ${layer.color}08, ${layer.color}03)`,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute top-0 left-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: layer.color }}
      />

      {/* Icon */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${layer.color}20` }}
      >
        <Icon size={16} style={{ color: layer.color }} />
      </div>

      {/* Category name */}
      <span className="text-sm font-semibold text-neutral-200">{layer.category}</span>

      {/* Skeleton dots */}
      <div className="ml-auto flex gap-1">
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ backgroundColor: layer.color }}
        />
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full opacity-50"
          style={{ backgroundColor: layer.color, animationDelay: '0.3s' }}
        />
      </div>
    </motion.div>
  );
}

/* ── Main component ── */
export function WizardStackPreview() {
  const answers = useWizardStore((s) => s.answers);
  const currentStep = useWizardStore((s) => s.currentStep);

  // Compute which layers are active based on current answers
  const activeLayers = LAYER_DEFINITIONS.filter((l) => l.trigger(answers));
  const totalPossible = LAYER_DEFINITIONS.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="bg-primary-500/10 flex h-7 w-7 items-center justify-center rounded-lg">
          <Layers size={14} className="text-primary-400" />
        </div>
        <div>
          <h3 className="text-xs font-semibold text-neutral-200">Live Stack Preview</h3>
          <p className="text-[10px] text-neutral-500">
            {activeLayers.length} / {totalPossible} layers • Step {currentStep} of 7
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="from-primary-500 to-accent-500 h-full rounded-full bg-gradient-to-r"
          initial={{ width: 0 }}
          animate={{ width: `${(activeLayers.length / totalPossible) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Stack layers */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {activeLayers.length > 0 ? (
            activeLayers.map((layer, i) => (
              <PreviewLayerBar key={layer.id} layer={layer} index={i} />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-10"
            >
              <div className="bg-primary-500/10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                <Layers size={20} className="text-primary-400" />
              </div>
              <p className="text-xs font-medium text-neutral-400">Your stack will appear here</p>
              <p className="mt-1 text-[10px] text-neutral-600">Make selections to start building</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative base line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: activeLayers.length > 0 ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mx-auto h-1 w-3/4 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(16,185,129,0.3), transparent)',
        }}
      />

      {/* AI note */}
      <AnimatePresence>
        {activeLayers.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center text-[10px] text-neutral-500 italic"
          >
            * AI will recommend specific tools for each layer after generation.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
