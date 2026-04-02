/* ───────────────────────────────────────────────
   Pylon — Phase Planning Types
   Data model for the Phased Tech Stack Roadmap.
   Stored in project's stackData JSONB column.
   ─────────────────────────────────────────────── */

// ── Phase Definition ────────────────────────────

export interface Phase {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string; // Lucide icon name
  order: number;
  targetDate?: string; // ISO date string
  budget?: number; // Monthly budget cap
  estimatedImplementationTimeDays?: number; // Estimated days to implement
}

// ── Tool-Phase Assignments ──────────────────────

export interface ToolPhaseAssignment {
  toolId: string; // Tool slug from catalog
  toolName: string; // Display name
  phaseId: string; // Phase ID
  selectedTierName: string; // Pricing tier name ("Free", "Pro", etc.)
  monthlyCost: number;
  estimatedImplementationTimeDays?: number;
  notes?: string;
}

// ── Complete Roadmap Structure ──────────────────

export interface ProjectPhaseRoadmap {
  phases: Phase[];
  assignments: ToolPhaseAssignment[];
}

// ── Default Phase Templates ─────────────────────

export const DEFAULT_PHASES: Phase[] = [
  {
    id: 'mvp',
    name: 'MVP / Launch',
    description: 'Minimum viable product — free tiers where possible',
    color: '#10b981',
    icon: 'Rocket',
    order: 0,
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'First paying customers — upgrade critical services',
    color: '#3b82f6',
    icon: 'TrendingUp',
    order: 1,
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'High traffic — performance & reliability upgrades',
    color: '#8b5cf6',
    icon: 'Zap',
    order: 2,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise contracts, SLAs, compliance',
    color: '#f59e0b',
    icon: 'Building2',
    order: 3,
  },
];

// ── Phase Colors for CSS ────────────────────────

export const PHASE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  mvp: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
  growth: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
  scale: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
  enterprise: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
};

// ── Helpers ──────────────────────────────────────

/** Get total monthly cost for a specific phase */
export function getPhaseCost(roadmap: ProjectPhaseRoadmap, phaseId: string): number {
  return roadmap.assignments
    .filter((a) => a.phaseId === phaseId)
    .reduce((sum, a) => sum + a.monthlyCost, 0);
}

/** Get total estimated implementation time for a specific phase */
export function getPhaseTime(roadmap: ProjectPhaseRoadmap, phaseId: string): number {
  return roadmap.assignments
    .filter((a) => a.phaseId === phaseId)
    .reduce((sum, a) => sum + (a.estimatedImplementationTimeDays || 0), 0);
}

/** Get all tools assigned to a specific phase */
export function getPhaseTools(
  roadmap: ProjectPhaseRoadmap,
  phaseId: string,
): ToolPhaseAssignment[] {
  return roadmap.assignments.filter((a) => a.phaseId === phaseId);
}

/** Create an empty roadmap with default phases */
export function createDefaultRoadmap(): ProjectPhaseRoadmap {
  return {
    phases: [...DEFAULT_PHASES],
    assignments: [],
  };
}
