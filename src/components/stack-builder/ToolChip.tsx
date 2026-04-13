'use client';

import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export interface ToolChipData {
  id: string;
  name: string;
  logoUrl?: string | null;
  confidence?: number;
  description?: string;
  costIndicator?: string;
  pricing?: string;
  reasoning?: string;
  alternatives?: string[];
}

interface ToolChipProps {
  tool: ToolChipData;
  accentColor: string;
  glowColor: string;
  interactive?: boolean;
  onRemove?: (toolId: string) => void;
}

export function ToolChip({
  tool,
  accentColor,
  glowColor,
  interactive = false,
  onRemove,
}: ToolChipProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      requestAnimationFrame(() => {
        el.style.setProperty('--spotlight-x', `${x}%`);
        el.style.setProperty('--spotlight-y', `${y}%`);
        el.style.boxShadow = `0 0 12px 2px ${glowColor}`;
        el.style.borderColor = accentColor;
      });
    },
    [accentColor, glowColor],
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.boxShadow = `0 0 0 0px ${glowColor}`;
    el.style.borderColor = 'rgba(255,255,255,0.1)';
  }, [glowColor]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="spotlight-card group relative flex flex-col items-start gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs backdrop-blur-xl transition-all duration-200"
      style={{
        boxShadow: `0 0 0 0px ${glowColor}`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Logo or fallback initial */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            {tool.logoUrl ? (
              <Image
                src={tool.logoUrl}
                alt={tool.name}
                width={16}
                height={16}
                className="object-contain"
                unoptimized
              />
            ) : (
              <span className="text-[10px] font-bold" style={{ color: accentColor }}>
                {tool.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Tool name */}
          <span className="truncate font-semibold text-neutral-100">{tool.name}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Cost Indicator badge */}
          {tool.costIndicator && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-neutral-300">
              {tool.costIndicator}
            </span>
          )}

          {/* Confidence badge */}
          {tool.confidence != null && tool.confidence > 0 && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{
                backgroundColor: `${accentColor}25`,
                color: accentColor,
              }}
            >
              {tool.confidence}% Match
            </span>
          )}

          {/* Remove button (interactive mode only) */}
          {interactive && onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tool.id);
              }}
              className="ml-1 flex rounded-full p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={`Remove ${tool.name}`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {tool.description && (
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-neutral-400">
          {tool.description}
        </p>
      )}
    </motion.div>
  );
}
