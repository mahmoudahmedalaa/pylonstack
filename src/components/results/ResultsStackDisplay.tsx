'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  Server,
  Database,
  Search,
  Shield,
  Activity,
  Palette,
  Zap,
  Box,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { TOOLS } from '@/data/tools-catalog';
import type { StackLayerData } from '@/components/stack-builder/StackLayer';

const ICON_MAP: Record<string, LucideIcon> = {
  Layout,
  Server,
  Database,
  Search,
  Shield,
  Activity,
  Palette,
  Zap,
  Box,
};

function formatCategoryName(cat: string) {
  return cat
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Fixed Tool Icon component with proper fallback
function ToolIcon({
  src,
  name,
  sizeClass = 'h-10 w-10',
  textClass = 'text-xl',
}: {
  src?: string | null;
  name: string;
  sizeClass?: string;
  textClass?: string;
}) {
  const [error, setError] = useState(false);
  const isValidSrc = src && src !== 'undefined' && src !== 'null';

  return (
    <div className={`relative flex shrink-0 items-center justify-center ${sizeClass}`}>
      {isValidSrc && !error ? (
        <img
          src={src!}
          alt={name}
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full rounded-xl border border-slate-100 bg-white object-contain p-1.5 shadow-sm dark:border-slate-800"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] opacity-90 shadow-sm">
          <span className={`font-bold text-white ${textClass}`}>{name.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ResultsStackDisplay({ layers }: { layers: StackLayerData[] }) {
  if (!layers || layers.length === 0) return null;
  const filteredLayers = layers.filter((l) => l.tools.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Architecture Overview
        </h2>
        <span className="rounded-full bg-[var(--muted)]/50 px-3 py-1 text-sm font-medium text-[var(--muted-foreground)]">
          {filteredLayers.length} Layers
        </span>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
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
              className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--muted)]/50 to-[var(--background)] px-5 py-4 transition-colors group-hover:from-[var(--muted)]/70">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-black/20"
                  style={{ border: `1px solid ${layer.color.accent}30` }}
                >
                  <IconComponent size={16} style={{ color: layer.color.accent }} />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-[var(--foreground)]">
                    {formatCategoryName(layer.category)}
                  </h3>
                  <p className="text-[11px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                    {layer.tools.length} Component{layer.tools.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Tools List */}
              <div className="flex flex-col divide-y divide-[var(--border)]/50">
                {layer.tools.map((tool) => {
                  const catalogTool = TOOLS.find((t) => t.id === tool.id || t.name === tool.name);
                  const websiteUrl =
                    catalogTool?.website ||
                    `https://google.com/search?q=${encodeURIComponent(tool.name + ' software')}`;

                  return (
                    <div
                      key={tool.id}
                      className="flex flex-col gap-3 p-5 transition-colors hover:bg-[var(--muted)]/20"
                    >
                      {/* Tool Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <ToolIcon src={catalogTool?.logo || tool.logoUrl} name={tool.name} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-[var(--foreground)]">
                                {tool.name}
                              </span>
                              {(tool.pricing || tool.costIndicator) && (
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                                  {tool.pricing || tool.costIndicator}
                                </span>
                              )}
                            </div>

                            {/* Alternatives */}
                            {tool.alternatives && tool.alternatives.length > 0 && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[10px] text-[var(--muted-foreground)]">
                                  Alternatives:
                                </span>
                                {tool.alternatives.slice(0, 2).map((alt, i) => (
                                  <span
                                    key={i}
                                    className="rounded bg-[var(--muted)]/50 px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]"
                                  >
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Link */}
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-[var(--primary)]/20 shadow-sm transition-all hover:scale-105 hover:bg-[var(--primary)]/90 active:scale-95"
                        >
                          Docs & Signup
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      {/* Rationale */}
                      <p className="mt-1 text-sm leading-relaxed text-[var(--foreground)]/90">
                        {tool.reasoning || tool.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
