'use client';

import { StackLayerData } from '@/components/stack-builder/StackLayer';
import { motion } from 'framer-motion';
import { Layout, Server, Database, Cloud, Shield, FileText, CreditCard, BarChart3, Brain, Container, TestTube2, Smartphone, Plug, HardDrive, Search, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { TOOLS } from '@/data/tools-catalog';
import Image from 'next/image';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Layout, Server, Database, Cloud, Shield, FileText, CreditCard, BarChart3, Brain, Container, TestTube2, Smartphone, Plug, HardDrive, Search, Clock, Activity,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

/** Convert a slug like 'frontend-framework' to 'Frontend Framework' */
function formatCategoryName(slug: string): string {
  return slug
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bMl\b/g, 'ML')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bCms\b/g, 'CMS');
}

/** Expandable rationale cell for mobile-friendly viewing */
function RationaleCell({ text }: { text?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <span className="text-[var(--muted-foreground)]">—</span>;

  const isLong = text.length > 80;
  return (
    <div>
      <p className={`text-xs text-[var(--muted-foreground)] leading-relaxed ${!expanded && isLong ? 'line-clamp-1' : ''}`}>
        {text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-[var(--color-primary-500)] hover:underline mt-0.5"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
}

/** Mobile accordion item for a single tool */
function MobileToolItem({ tool, catalogTool }: {
  tool: StackLayerData['tools'][0];
  catalogTool: (typeof TOOLS)[number] | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[var(--muted)]/30 transition-colors"
      >
        {catalogTool?.logo || tool.logoUrl ? (
          <Image src={catalogTool?.logo || tool.logoUrl!} alt={tool.name} width={28} height={28} className="h-7 w-7 object-contain shrink-0 rounded-md bg-white p-0.5" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--muted)]">
            <span className="text-[10px] font-bold text-[var(--foreground)]">{tool.name.charAt(0)}</span>
          </div>
        )}
        <span className="flex-1 font-medium text-sm text-[var(--foreground)]">{tool.name}</span>
        <span className="text-xs text-[var(--muted-foreground)] mr-2">{tool.pricing || tool.costIndicator || '—'}</span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />}
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {tool.confidence != null && tool.confidence > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Confidence</span>
              <span className="font-medium text-[var(--foreground)]">{tool.confidence}%</span>
            </div>
          )}
          {tool.reasoning && (
            <div className="text-xs">
              <span className="text-[var(--muted-foreground)] block mb-0.5">Rationale</span>
              <p className="text-[var(--foreground)] leading-relaxed">{tool.reasoning}</p>
            </div>
          )}
          {tool.alternatives && tool.alternatives.length > 0 && (
            <div className="text-xs">
              <span className="text-[var(--muted-foreground)] block mb-0.5">Alternatives</span>
              <div className="flex flex-wrap gap-1.5">
                {tool.alternatives.map((alt, i) => (
                  <span key={i} className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">{alt}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ResultsStackDisplay({ layers }: { layers: StackLayerData[] }) {
  if (!layers || layers.length === 0) return null;

  const filteredLayers = layers.filter(l => l.tools.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Architecture Overview</h2>

      {/* Desktop: Comparison Table */}
      <div className="hidden md:block">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Tool</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Est. Cost</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Rationale</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Alternatives</th>
              </tr>
            </thead>
            {filteredLayers.map((layer, layerIdx) => {
              const IconComponent = ICON_MAP[layer.icon] || Layout;
              return (
                <motion.tbody
                  key={layer.id}
                  variants={itemVariants}
                >
                  {/* Category header row */}
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    <td colSpan={5} className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${layer.color.accent}12` }}
                        >
                          <IconComponent size={14} style={{ color: layer.color.accent }} />
                        </div>
                        <span className="text-sm font-semibold text-[var(--foreground)]">{formatCategoryName(layer.category)}</span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">{layer.tools.length} component{layer.tools.length !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                  </tr>
                  {/* Tool rows */}
                  {layer.tools.map((tool, toolIdx) => {
                    const catalogTool = TOOLS.find(t => t.id === tool.id || t.name === tool.name);
                    const isLast = layerIdx === filteredLayers.length - 1 && toolIdx === layer.tools.length - 1;
                    return (
                      <tr
                        key={tool.id}
                        className={`${!isLast ? 'border-b border-[var(--border)]' : ''} hover:bg-[var(--muted)]/20 transition-colors`}
                      >
                        {/* Tool name + logo */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            {catalogTool?.logo || tool.logoUrl ? (
                              <Image src={catalogTool?.logo || tool.logoUrl!} alt={tool.name} width={40} height={40} className="h-10 w-10 object-contain shrink-0 rounded-md bg-white p-1" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--muted)]">
                                <span className="text-sm font-bold text-[var(--foreground)]">{tool.name.charAt(0)}</span>
                              </div>
                            )}
                            <span className="font-bold text-base text-[var(--foreground)] tracking-tight">{tool.name}</span>
                          </div>
                        </td>
                        {/* Cost */}
                        <td className="px-5 py-5">
                          <span className="font-semibold text-sm text-[var(--foreground)]">{tool.pricing || tool.costIndicator || '—'}</span>
                        </td>
                        {/* Rationale */}
                        <td className="px-5 py-5 max-w-[280px]">
                          <RationaleCell text={tool.reasoning || tool.description} />
                        </td>
                        {/* Alternatives */}
                        <td className="px-5 py-5">
                          {tool.alternatives && tool.alternatives.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {tool.alternatives.slice(0, 3).map((alt, i) => (
                                <span key={i} className="rounded-full border border-[var(--border)] bg-[var(--muted)]/50 px-2.5 py-1 text-[12px] font-medium text-[var(--muted-foreground)]">{alt}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--muted-foreground)]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </motion.tbody>
              );
            })}
          </table>
        </motion.div>
      </div>

      {/* Mobile: Accordion by Category */}
      <motion.div
        className="md:hidden flex flex-col gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredLayers.map((layer) => {
          const IconComponent = ICON_MAP[layer.icon] || Layout;
          return (
            <motion.div
              key={layer.id}
              variants={itemVariants}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              {/* Category header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--muted)]/30 border-b border-[var(--border)]">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${layer.color.accent}12` }}
                >
                  <IconComponent size={14} style={{ color: layer.color.accent }} />
                </div>
                <span className="text-sm font-semibold text-[var(--foreground)]">{formatCategoryName(layer.category)}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">{layer.tools.length}</span>
              </div>
              {/* Tool accordion items */}
              {layer.tools.map(tool => {
                const catalogTool = TOOLS.find(t => t.id === tool.id || t.name === tool.name);
                return <MobileToolItem key={tool.id} tool={tool} catalogTool={catalogTool} />;
              })}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
