'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface PricingTierTabsProps {
  tiers: string[];
  activeTier: string;
  onChange: (tier: string) => void;
}

export function PricingTierTabs({ tiers, activeTier, onChange }: PricingTierTabsProps) {
  return (
    <div className="flex w-full overflow-x-auto pb-2 sm:justify-center sm:pb-0">
      <div className="relative flex w-full min-w-max items-center justify-start rounded-full bg-[var(--muted)]/50 p-1 sm:w-auto">
        {tiers.map((tier) => {
          const isActive = activeTier === tier;
          
          return (
            <button
              key={tier}
              type="button"
              onClick={() => onChange(tier)}
              className={`relative flex-1 rounded-full px-6 py-2 text-sm font-medium outline-none transition-colors sm:flex-none ${
                isActive
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="pricing-tab-active-bg"
                  className="absolute inset-0 rounded-full bg-[var(--background)] shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tier}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
