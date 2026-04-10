import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Drizzle before importing the module under test ──
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();

vi.mock('@/lib/db', () => ({
    db: {
        select: () => ({
            from: (table: unknown) => {
                mockFrom(table);
                return {
                    where: (condition: unknown) => {
                        mockWhere(condition);
                        return {
                            limit: (n: number) => {
                                mockLimit(n);
                                return mockSelect();
                            },
                        };
                    },
                };
            },
        }),
    },
}));

vi.mock('@/lib/db/schema', () => ({
    profiles: {
        id: 'id',
        subscriptionTier: 'subscription_tier',
    },
}));

vi.mock('drizzle-orm', () => ({
    eq: vi.fn((a, b) => ({ field: a, value: b })),
}));

import { checkSubscription } from './check-subscription';

describe('checkSubscription', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear env between tests
        delete process.env.NEXT_PUBLIC_SUPERUSER_EMAIL;
    });

    it('returns canUseAI: false for free-tier users', async () => {
        mockSelect.mockResolvedValue([{ subscriptionTier: 'free' }]);

        const result = await checkSubscription('user-123');

        expect(result).toEqual({ tier: 'free', canUseAI: false });
    });

    it('returns canUseAI: true for pro-tier users', async () => {
        mockSelect.mockResolvedValue([{ subscriptionTier: 'pro' }]);

        const result = await checkSubscription('user-456');

        expect(result).toEqual({ tier: 'pro', canUseAI: true });
    });

    it('returns canUseAI: true for team-tier users', async () => {
        mockSelect.mockResolvedValue([{ subscriptionTier: 'team' }]);

        const result = await checkSubscription('user-789');

        expect(result).toEqual({ tier: 'team', canUseAI: true });
    });

    it('defaults to free when no profile is found', async () => {
        mockSelect.mockResolvedValue([]);

        const result = await checkSubscription('nonexistent-user');

        expect(result).toEqual({ tier: 'free', canUseAI: false });
    });

    it('bypasses DB check for superuser email', async () => {
        process.env.NEXT_PUBLIC_SUPERUSER_EMAIL = 'admin@pylon.dev';

        const result = await checkSubscription('user-123', 'admin@pylon.dev');

        expect(result).toEqual({ tier: 'pro', canUseAI: true });
        // DB should NOT have been called
        expect(mockSelect).not.toHaveBeenCalled();
    });

    it('does NOT bypass for non-matching email', async () => {
        process.env.NEXT_PUBLIC_SUPERUSER_EMAIL = 'admin@pylon.dev';
        mockSelect.mockResolvedValue([{ subscriptionTier: 'free' }]);

        const result = await checkSubscription('user-123', 'regular@user.com');

        expect(result).toEqual({ tier: 'free', canUseAI: false });
        expect(mockSelect).toHaveBeenCalled();
    });
});
