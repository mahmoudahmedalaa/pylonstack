import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ── Mocks ──

// Mock checkSubscription
const mockCheckSubscription = vi.fn();
vi.mock('@/lib/auth/check-subscription', () => ({
    checkSubscription: (...args: unknown[]) => mockCheckSubscription(...args),
}));

// Mock Supabase auth
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
    createClient: () =>
        Promise.resolve({
            auth: {
                getUser: () => mockGetUser(),
            },
        }),
}));

// Mock DB operations
const mockInsertReturning = vi.fn();
const mockSelectResult = vi.fn();
vi.mock('@/lib/db', () => ({
    db: {
        insert: () => ({
            values: () => {
                // The questionnaire insert calls .values() without .returning()
                // The project and recommendation inserts call .values().returning()
                // This mock supports both: it's thenable AND has .returning()
                const result = Promise.resolve(undefined);
                (result as unknown as Record<string, unknown>).returning = () => mockInsertReturning();
                return result;
            },
        }),
        select: () => ({
            from: () => ({
                where: () => ({
                    orderBy: () => ({
                        limit: () => mockSelectResult(),
                    }),
                }),
            }),
        }),
    },
}));

vi.mock('@/lib/db/schema', () => ({
    projects: { id: 'id' },
    questionnaireResponses: {},
    aiRecommendations: { promptHash: 'prompt_hash', createdAt: 'created_at' },
}));

vi.mock('@/lib/cache/prompt-cache', () => ({
    buildPromptFingerprint: () => 'test-fingerprint',
    isCacheValid: () => false,
}));

vi.mock('@/lib/ai/ai-client', () => ({
    getAIRecommendation: () =>
        Promise.resolve({
            summary: 'Test summary',
            estimatedMonthlyCost: '$0',
            phases: [],
            recommendations: [],
            source: 'fallback',
            correctionAttempts: 0,
            validationWarnings: [],
        }),
}));

vi.mock('drizzle-orm', () => ({
    eq: vi.fn(),
    desc: vi.fn(),
}));

// ── Import the route handler AFTER mocks are set up ──
import { POST } from './route';

function makeRequest(body: Record<string, unknown>): NextRequest {
    return new NextRequest('http://localhost:3000/api/questionnaire', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

const VALID_BODY = {
    projectName: 'Test Project',
    description: 'A test description',
    projectType: 'saas',
    teamSize: 'solo',
    requirements: ['auth'],
    priorities: ['cost'],
    preferences: [],
    analytics: [],
};

describe('POST /api/questionnaire — Paywall Enforcement', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 401 when user is not authenticated', async () => {
        mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'No session' } });

        const response = await POST(makeRequest(VALID_BODY));
        const json = await response.json();

        expect(response.status).toBe(401);
        expect(json.error).toContain('Unauthorized');
    });

    it('returns 403 with upgrade_required for free-tier users', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-free', email: 'free@test.com' } },
            error: null,
        });
        mockCheckSubscription.mockResolvedValue({ tier: 'free', canUseAI: false });

        const response = await POST(makeRequest(VALID_BODY));
        const json = await response.json();

        expect(response.status).toBe(403);
        expect(json.upgrade_required).toBe(true);
        expect(json.current_tier).toBe('free');
        expect(json.error).toContain('Pro subscription');
    });

    it('allows pro-tier users through the paywall', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-pro', email: 'pro@test.com' } },
            error: null,
        });
        mockCheckSubscription.mockResolvedValue({ tier: 'pro', canUseAI: true });
        // No cached recommendation
        mockSelectResult.mockResolvedValue([]);
        // Only project + recommendation inserts call .returning()
        // (questionnaire insert does NOT chain .returning())
        mockInsertReturning
            .mockResolvedValueOnce([{ id: 'proj-1' }])   // project
            .mockResolvedValueOnce([{ id: 'rec-1' }]);    // AI recommendation

        const response = await POST(makeRequest(VALID_BODY));
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json.projectId).toBe('proj-1');
        expect(json.recommendationId).toBe('rec-1');
    });

    it('allows team-tier users through the paywall', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-team', email: 'team@test.com' } },
            error: null,
        });
        mockCheckSubscription.mockResolvedValue({ tier: 'team', canUseAI: true });
        mockSelectResult.mockResolvedValue([]);
        mockInsertReturning
            .mockResolvedValueOnce([{ id: 'proj-2' }])
            .mockResolvedValueOnce([{ id: 'rec-2' }]);

        const response = await POST(makeRequest(VALID_BODY));

        expect(response.status).toBe(200);
    });

    it('allows superuser through the paywall via checkSubscription bypass', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-super', email: 'admin@pylon.dev' } },
            error: null,
        });
        // checkSubscription handles the superuser bypass internally
        mockCheckSubscription.mockResolvedValue({ tier: 'pro', canUseAI: true });
        mockSelectResult.mockResolvedValue([]);
        mockInsertReturning
            .mockResolvedValueOnce([{ id: 'proj-3' }])
            .mockResolvedValueOnce([{ id: 'rec-3' }]);

        const response = await POST(makeRequest(VALID_BODY));

        expect(response.status).toBe(200);
        // Verify checkSubscription was called with the email
        expect(mockCheckSubscription).toHaveBeenCalledWith('user-super', 'admin@pylon.dev');
    });
});
