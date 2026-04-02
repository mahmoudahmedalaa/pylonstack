'use client';

import { useMemo } from 'react';
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { ProjectPhaseRoadmap } from '@/data/phase-types';
import { PHASE_COLORS, getPhaseCost, getPhaseTools, getPhaseTime } from '@/data/phase-types';

interface PhaseCostSummaryProps {
  roadmap: ProjectPhaseRoadmap;
}

export function PhaseCostSummary({ roadmap }: PhaseCostSummaryProps) {
  const phaseCosts = useMemo(() => {
    return roadmap.phases
      .sort((a, b) => a.order - b.order)
      .map((phase) => ({
        phase,
        cost: getPhaseCost(roadmap, phase.id),
        time: getPhaseTime(roadmap, phase.id),
        toolCount: getPhaseTools(roadmap, phase.id).length,
        colors: PHASE_COLORS[phase.id] || PHASE_COLORS.mvp,
      }));
  }, [roadmap]);

  const maxCost = Math.max(...phaseCosts.map((p) => p.cost), 1);

  // Calculate growth % from MVP to final phase
  const mvpCost = phaseCosts[0]?.cost || 0;
  const finalCost = phaseCosts[phaseCosts.length - 1]?.cost || 0;
  const growthPct =
    mvpCost > 0 ? Math.round(((finalCost - mvpCost) / mvpCost) * 100) : finalCost > 0 ? 100 : 0;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-500)]/20">
            <TrendingUp className="h-4 w-4 text-[var(--color-primary-600)]" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Cost Progression</h3>
        </div>
        {growthPct > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            +{growthPct}% growth
          </Badge>
        )}
      </div>

      {/* Phase cost bars */}
      <div className="space-y-3">
        {phaseCosts.map((item, idx) => {
          const barWidth = maxCost > 0 ? Math.max((item.cost / maxCost) * 100, 4) : 4;
          const isLast = idx === phaseCosts.length - 1;

          return (
            <div key={item.phase.id}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--foreground)]">
                  {item.phase.name}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {item.toolCount} tool{item.toolCount !== 1 ? 's' : ''}
                  {' · '}
                  <span>{item.time || 0} days</span>
                  {' · '}
                  <span className="font-semibold" style={{ color: item.colors.text }}>
                    ${item.cost}/mo
                  </span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]/40">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: item.colors.text,
                  }}
                />
              </div>
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <ArrowRight className="h-3 w-3 text-[var(--muted-foreground)]/30" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-[var(--color-primary-500)]" />
          <span className="text-xs text-[var(--muted-foreground)]">Start at</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: PHASE_COLORS.mvp.text }}>
            ${mvpCost}/mo
          </span>
          {finalCost > mvpCost && (
            <>
              <ArrowRight className="h-3 w-3 text-[var(--muted-foreground)]" />
              <span
                className="text-sm font-bold"
                style={{
                  color:
                    PHASE_COLORS[roadmap.phases[roadmap.phases.length - 1]?.id || 'enterprise']
                      ?.text || PHASE_COLORS.enterprise.text,
                }}
              >
                ${finalCost}/mo
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
