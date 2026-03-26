'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

export type SubscriptionTier = 'free' | 'pro' | 'team';

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
  /* Convenience helpers */
  isPro: boolean;
  isFree: boolean;
  isTeam: boolean;
  /** Free users may create up to 3 projects */
  canCreateProject: (currentCount: number) => boolean;
  /** Free users can compare up to 2 tools */
  canCompareTools: (count: number) => boolean;
  /** Only pro+ users can export */
  canExport: boolean;
  /** Only pro+ users get AI recommendations */
  canUseAI: boolean;
}

const SUPERUSER_EMAIL = process.env.NEXT_PUBLIC_SUPERUSER_EMAIL;

const FREE_LIMITS = {
  maxProjects: 3,
  maxCompareTools: 2,
} as const;

/**
 * useSubscription — reads the current user's subscription tier
 * from profiles and exposes gated helpers.
 *
 * Superuser bypass: if the user's email matches NEXT_PUBLIC_SUPERUSER_EMAIL
 * they are treated as "pro" regardless of DB value.
 */
export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTier('free');
      setLoading(false);
      return;
    }

    // Superuser bypass
    if (SUPERUSER_EMAIL && user.email === SUPERUSER_EMAIL) {
      setTier('pro');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.subscription_tier) {
          setTier(data.subscription_tier as SubscriptionTier);
        }
        setLoading(false);
      });
  }, [user]);

  const isPro = tier === 'pro' || tier === 'team';
  const isFree = tier === 'free';
  const isTeam = tier === 'team';

  return {
    tier,
    loading,
    isPro,
    isFree,
    isTeam,
    canCreateProject: (currentCount: number) => isPro || currentCount < FREE_LIMITS.maxProjects,
    canCompareTools: (count: number) => isPro || count <= FREE_LIMITS.maxCompareTools,
    canExport: isPro,
    canUseAI: isPro,
  };
}
