'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Check, ChevronRight, DollarSign, Search, X } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { TOOLS, getToolTiers } from '@/data/tools-catalog';
import type { ToolPricingTier } from '@/data/tools-catalog';
import type { Phase, ToolPhaseAssignment } from '@/data/phase-types';
import { PHASE_COLORS } from '@/data/phase-types';

/* ── Props ── */
interface ToolTierSelectorProps {
  phase: Phase;
  existingAssignments: ToolPhaseAssignment[];
  /** The tools currently in the stack (from StackBuilder layers) */
  stackToolIds: string[];
  onAssign: (assignment: ToolPhaseAssignment) => void;
  onClose: () => void;
}

export function ToolTierSelector({
  phase,
  existingAssignments,
  stackToolIds,
  onAssign,
  onClose,
}: ToolTierSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<ToolPricingTier | null>(null);

  const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.mvp;

  // Filter tools: show only stack tools, exclude already-assigned
  const availableTools = useMemo(() => {
    const assignedIds = new Set(
      existingAssignments.filter((a) => a.phaseId === phase.id).map((a) => a.toolId),
    );

    return TOOLS.filter((t) => {
      // Include tool if it's in the stack
      if (!stackToolIds.includes(t.slug) && !stackToolIds.includes(t.id)) return false;
      // Exclude if already assigned to this phase
      if (assignedIds.has(t.slug) || assignedIds.has(t.id)) return false;
      // Search filter
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stackToolIds, existingAssignments, phase.id, search]);

  const selectedTool = selectedToolId
    ? TOOLS.find((t) => t.id === selectedToolId || t.slug === selectedToolId) || null
    : null;

  const tiers = selectedTool ? getToolTiers(selectedTool) : [];

  const handleConfirm = () => {
    if (!selectedTool || !selectedTier) return;
    onAssign({
      toolId: selectedTool.slug || selectedTool.id,
      toolName: selectedTool.name,
      phaseId: phase.id,
      selectedTierName: selectedTier.name,
      monthlyCost: selectedTier.price ?? 0,
    });
    setSelectedToolId(null);
    setSelectedTier(null);
    setSearch('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 p-4 backdrop-blur-sm">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-5 py-4"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.text,
                color: 'white',
              }}
            >
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Add Tool to {phase.name}
              </h3>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Select a tool and choose its pricing tier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {/* Step 1: Pick tool */}
          {!selectedToolId ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search your stack tools…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2.5 pr-3 pl-10 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--color-primary-500)] focus:outline-none"
                />
              </div>

              {availableTools.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--muted-foreground)] italic">
                  {stackToolIds.length === 0
                    ? 'Build your stack first, then plan phases.'
                    : 'All stack tools are assigned to this phase.'}
                </p>
              ) : (
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                  {availableTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedToolId(tool.id)}
                      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--muted)]/40"
                    >
                      {tool.logo ? (
                        <Image
                          src={tool.logo}
                          alt={tool.name}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-md object-contain"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--muted)]/50 text-xs font-bold text-[var(--muted-foreground)]">
                          {tool.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {tool.name}
                        </span>
                        <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                          {tool.category}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {tool.pricing}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Step 2: Pick tier */
            <>
              <button
                onClick={() => {
                  setSelectedToolId(null);
                  setSelectedTier(null);
                }}
                className="mb-3 flex items-center gap-1 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
              >
                ← Back to tools
              </button>

              <div className="mb-4 flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                {selectedTool?.logo ? (
                  <Image
                    src={selectedTool.logo}
                    alt={selectedTool.name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-md object-contain"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--muted)]/50 text-sm font-bold text-[var(--muted-foreground)]">
                    {selectedTool?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--foreground)]">
                    {selectedTool?.name}
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Select the pricing tier for the {phase.name} phase
                  </p>
                </div>
              </div>

              {tiers.length === 0 ? (
                <div className="space-y-2">
                  <p className="mb-3 text-xs text-[var(--muted-foreground)] italic">
                    No structured pricing data available. Enter cost manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted-foreground)]">$</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="w-24 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none"
                      onChange={(e) =>
                        setSelectedTier({
                          name: selectedTool?.pricing || 'Custom',
                          price: Number(e.target.value) || 0,
                          period: 'month',
                        })
                      }
                    />
                    <span className="text-sm text-[var(--muted-foreground)]">/month</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {tiers.map((tier) => {
                    const isActive = selectedTier?.name === tier.name;
                    return (
                      <button
                        key={tier.name}
                        onClick={() => setSelectedTier(tier)}
                        className="group flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-all"
                        style={{
                          borderColor: isActive ? colors.text : 'var(--border)',
                          backgroundColor: isActive ? colors.bg : 'transparent',
                        }}
                      >
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                          style={{
                            borderColor: isActive ? colors.text : 'var(--border)',
                            backgroundColor: isActive ? colors.text : 'transparent',
                          }}
                        >
                          {isActive && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {tier.name}
                          </span>
                          {tier.limits && (
                            <p className="truncate text-[11px] text-[var(--muted-foreground)]">
                              {tier.limits}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-bold" style={{ color: colors.text }}>
                          {tier.price === null
                            ? 'Custom'
                            : tier.price === 0
                              ? 'Free'
                              : `$${tier.price}/mo`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!selectedTier}
                  onClick={handleConfirm}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Assign to {phase.name}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
