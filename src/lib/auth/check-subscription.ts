import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type SubscriptionTier = 'free' | 'pro' | 'team';

export interface SubscriptionCheck {
    tier: SubscriptionTier;
    canUseAI: boolean;
}

/**
 * Server-side subscription check.
 *
 * Mirrors the client-side `useSubscription` hook logic but runs on the server,
 * making it safe for API route gating (cannot be bypassed by the client).
 *
 * @param userId  - The authenticated user's UUID (from Supabase auth)
 * @param userEmail - Optional email for superuser bypass
 */
export async function checkSubscription(
    userId: string,
    userEmail?: string,
): Promise<SubscriptionCheck> {
    // Read at call time so tests can override via process.env
    const superuserEmail = process.env.NEXT_PUBLIC_SUPERUSER_EMAIL;

    // Superuser bypass — same logic as the client hook
    if (superuserEmail && userEmail === superuserEmail) {
        return { tier: 'pro', canUseAI: true };
    }

    const [profile] = await db
        .select({ subscriptionTier: profiles.subscriptionTier })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

    const tier: SubscriptionTier = profile?.subscriptionTier ?? 'free';

    return {
        tier,
        canUseAI: tier === 'pro' || tier === 'team',
    };
}
