'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface BillingToggleProps {
  isAnnual: boolean;
  onChange: (isAnnual: boolean) => void;
  discountPercent?: number;
}

export function BillingToggle({ isAnnual, onChange, discountPercent = 20 }: BillingToggleProps) {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        }`}
      >
        Monthly
      </button>
      
      <button
        type="button"
        onClick={() => onChange(!isAnnual)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-colors"
        role="switch"
        aria-checked={isAnnual}
      >
        <span className="sr-only">Toggle billing</span>
        <motion.span
          layout
          className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform"
          animate={{ x: isAnnual ? 10 : -10 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>

      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          isAnnual ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        }`}
      >
        Annual
        {discountPercent > 0 && (
          <span className="rounded-full bg-[var(--color-success-500)]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-success-500)]">
            SAVE {discountPercent}%
          </span>
        )}
      </button>
    </div>
  );
}
