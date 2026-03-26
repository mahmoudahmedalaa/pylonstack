'use client';

import { useState } from 'react';
import { X, Zap, Check, ArrowRight, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional prompt explaining why the user hit the gate */
  reason?: string;
}

const PRO_FEATURES = [
  {
    icon: Sparkles,
    label: 'Unlimited projects',
    description: 'Create as many tech stacks as you need',
  },
  {
    icon: BarChart3,
    label: 'Side-by-side tool comparison',
    description: 'Compare unlimited tools at once',
  },
  {
    icon: Zap,
    label: 'AI-powered recommendations',
    description: 'Get smart stack suggestions from our AI',
  },
  {
    icon: Shield,
    label: 'Export & share',
    description: 'Export your stacks as PDF or share links',
  },
];

export function UpgradeModal({ open, onClose, reason }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    // TODO: Wire to Stripe checkout session via /api/payments/create-checkout
    try {
      const res = await fetch('/api/payments/create-checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Fallback — just close for now
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20">
            <Zap className="h-6 w-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Upgrade to Pro
          </h2>
          {reason && <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{reason}</p>}
        </div>

        {/* Feature list */}
        <ul className="mb-6 space-y-3">
          {PRO_FEATURES.map(({ label, description }) => (
            <li key={label} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-3 w-3 text-green-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
                <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-[var(--foreground)]">$9</span>
            <span className="text-sm text-[var(--muted-foreground)]">/month</span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Cancel anytime · 7-day free trial
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          className="w-full justify-center gap-2"
          onClick={handleUpgrade}
          loading={loading}
        >
          <Zap className="h-4 w-4" />
          Start Pro Trial
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
          Powered by Stripe · Secure checkout
        </p>
      </div>
    </div>
  );
}

/**
 * Convenience hook to manage update modal state
 */
export function useUpgradeModal() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>();

  const show = (reasonText?: string) => {
    setReason(reasonText);
    setOpen(true);
  };

  const hide = () => {
    setOpen(false);
    setReason(undefined);
  };

  return { open, reason, show, hide };
}
