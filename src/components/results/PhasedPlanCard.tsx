import { ProjectPhase } from '@/lib/ai/ai-client';
import { CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { TOOLS } from '@/data/tools-catalog';

export function PhasedPlanCard({ phase }: { phase: ProjectPhase }) {
  // Calculate subtotals safely in case of partial stream JSON
  const tools = phase?.tools || [];
  const paidTools = tools.filter((t) => (t?.monthlyCost || 0) > 0);
  const freeTools = tools.filter(
    (t) => (t?.monthlyCost || 0) === 0 && t?.pricingModel !== 'Usage-Based',
  );
  const usageTools = tools.filter(
    (t) => t?.pricingModel === 'Usage-Based' && (t?.monthlyCost || 0) === 0,
  );
  const fixedSubtotal = paidTools.reduce((sum, t) => sum + (t?.monthlyCost || 0), 0);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {phase.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]">
              <Clock className="h-3.5 w-3.5" />
              <span>{phase.estimatedImplementationTimeDays || 0}d</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-success-500)]/10 px-2.5 py-0.5 text-xs text-[var(--color-success-500)]">
              <DollarSign className="h-3.5 w-3.5" />
              <span>
                {phase.estimatedMonthlyCost > 0 ? `$${phase.estimatedMonthlyCost}/mo` : '$0/mo'}
              </span>
            </div>
          </div>
        </div>
        {phase.description && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {phase.description}
          </p>
        )}
      </div>

      {/* Tools — flat rows */}
      <div className="flex flex-col divide-y divide-[var(--border)]">
        {(phase?.tools || []).map((tool, idx) => {
          const catalogTool = TOOLS.find(
            (t) =>
              t.id === tool.toolName.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
              t.name === tool.toolName,
          );
          return (
            <div
              key={idx}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--muted)]/30"
            >
              {catalogTool?.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={catalogTool.logo}
                  alt={tool.toolName}
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-md bg-white object-contain p-1"
                />
              ) : (
                <div className="text-[var(--color-primary-500)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[var(--foreground)]">
                    {tool.toolName}
                  </span>
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                    {tool.tier}
                  </span>
                </div>
                {tool.reason && (
                  <p className="line-clamp-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {tool.reason}
                  </p>
                )}
              </div>

              <div className="shrink-0 tabular-nums">
                {(tool?.monthlyCost || 0) > 0 ? (
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    ${tool.monthlyCost}/mo
                  </span>
                ) : tool?.pricingModel === 'Usage-Based' ? (
                  <span className="text-sm font-medium text-amber-500">Usage</span>
                ) : (
                  <span className="text-sm font-medium text-[var(--color-success-500)]">Free</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoice-style subtotal footer */}
      <div className="border-t border-dashed border-[var(--border)] bg-[var(--background)] px-5 py-3">
        <div className="flex flex-col gap-1 text-xs">
          {freeTools.length > 0 && (
            <div className="flex justify-between text-[var(--muted-foreground)]">
              <span>
                {freeTools.length} free component{freeTools.length !== 1 ? 's' : ''}
              </span>
              <span>$0</span>
            </div>
          )}
          {usageTools.length > 0 && (
            <div className="flex justify-between text-amber-500">
              <span>{usageTools.length} usage-based</span>
              <span>Variable</span>
            </div>
          )}
          {paidTools.length > 0 && (
            <div className="flex justify-between text-[var(--muted-foreground)]">
              <span>
                {paidTools.length} paid tool{paidTools.length !== 1 ? 's' : ''}
              </span>
              <span>${fixedSubtotal}/mo</span>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-[var(--border)] pt-1.5 text-sm font-semibold text-[var(--foreground)]">
            <span>Subtotal</span>
            <span className="tabular-nums">
              ${phase.estimatedMonthlyCost > 0 ? phase.estimatedMonthlyCost : fixedSubtotal}/mo
              {usageTools.length > 0 && ' + usage'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
