'use client';

import { useState, useMemo } from 'react';
import {
  Rocket,
  TrendingUp,
  Zap,
  Building2,
  ChevronDown,
  ChevronUp,
  Plus,
  DollarSign,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { ProjectPhaseRoadmap } from '@/data/phase-types';
import { PHASE_COLORS, getPhaseCost, getPhaseTools } from '@/data/phase-types';

/* ── Icon map ── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
};

/* ── Props ── */
interface PhaseTimelineProps {
  roadmap: ProjectPhaseRoadmap;
  onSelectPhase: (phaseId: string) => void;
  selectedPhaseId: string | null;
  onAddTool: (phaseId: string) => void;
  onRemoveAssignment: (toolId: string, phaseId: string) => void;
}

export function PhaseTimeline({
  roadmap,
  onSelectPhase,
  selectedPhaseId,
  onAddTool,
  onRemoveAssignment,
}: PhaseTimelineProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set(roadmap.phases.map((p) => p.id)),
  );

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  const totalMonthlyCost = useMemo(
    () => roadmap.assignments.reduce((s, a) => s + a.monthlyCost, 0),
    [roadmap.assignments],
  );

  return (
    <div className="space-y-4">
      {/* ── Summary Bar ── */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[var(--color-primary-500)]" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Total Monthly Cost
          </span>
        </div>
        <span className="text-lg font-bold text-[var(--foreground)]">
          ${totalMonthlyCost.toLocaleString()}/mo
        </span>
      </div>

      {/* ── Phase cards ── */}
      {roadmap.phases
        .sort((a, b) => a.order - b.order)
        .map((phase, idx) => {
          const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.mvp;
          const isSelected = selectedPhaseId === phase.id;
          const isExpanded = expandedPhases.has(phase.id);
          const phaseTools = getPhaseTools(roadmap, phase.id);
          const phaseCost = getPhaseCost(roadmap, phase.id);
          const isLast = idx === roadmap.phases.length - 1;

          return (
            <div key={phase.id} className="relative">
              {/* Timeline connector */}
              {!isLast && (
                <div
                  className="absolute top-full left-6 z-0 h-4 w-0.5"
                  style={{ backgroundColor: colors.border }}
                />
              )}

              <div
                className="relative cursor-pointer rounded-xl border transition-all duration-200"
                style={{
                  borderColor: isSelected ? colors.text : 'var(--border)',
                  backgroundColor: isSelected ? colors.bg : 'var(--card)',
                  boxShadow: isSelected ? `0 0 0 1px ${colors.border}` : 'none',
                }}
                onClick={() => onSelectPhase(phase.id)}
              >
                {/* Phase Header */}
                <div className="flex items-center gap-3 p-4">
                  {/* Phase icon circle */}
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `1.5px solid ${colors.border}`,
                    }}
                  >
                    {ICON_MAP[phase.icon] || <Rocket className="h-4 w-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">
                        {phase.name}
                      </h3>
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                        {phaseTools.length} tool{phaseTools.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {phase.description}
                    </p>
                  </div>

                  {/* Cost badge */}
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold" style={{ color: colors.text }}>
                      ${phaseCost}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">/mo</span>
                  </div>

                  {/* Expand toggle */}
                  <button
                    className="shrink-0 rounded-md p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(phase.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Expanded tool list */}
                {isExpanded && (
                  <div className="border-t px-4 pt-2 pb-3" style={{ borderColor: colors.border }}>
                    {phaseTools.length === 0 ? (
                      <p className="py-3 text-center text-xs text-[var(--muted-foreground)] italic">
                        No tools assigned yet. Click &ldquo;Add Tool&rdquo; to start planning.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {phaseTools.map((assignment) => (
                          <div
                            key={`${assignment.toolId}-${assignment.phaseId}`}
                            className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-[var(--muted)]/30"
                          >
                            <GripVertical className="h-3 w-3 shrink-0 text-[var(--muted-foreground)]/30" />
                            <span className="flex-1 truncate text-sm text-[var(--foreground)]">
                              {assignment.toolName}
                            </span>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                              {assignment.selectedTierName}
                            </Badge>
                            <span className="text-xs font-medium text-[var(--muted-foreground)]">
                              ${assignment.monthlyCost}
                            </span>
                            <button
                              className="rounded-md p-1 text-[var(--muted-foreground)] opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveAssignment(assignment.toolId, assignment.phaseId);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      style={{ color: colors.text }}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onAddTool(phase.id);
                      }}
                    >
                      <Plus className="mr-1.5 h-3 w-3" /> Add Tool to {phase.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
