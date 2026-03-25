'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export interface ToolChipData {
  id: string;
  name: string;
  logoUrl?: string | null;
  confidence?: number;
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
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="group relative flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs backdrop-blur-sm transition-all duration-200"
      style={{
        boxShadow: `0 0 0 0px ${glowColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px 2px ${glowColor}`;
        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0px ${glowColor}`;
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      {/* Logo or fallback initial */}
      <div
        className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        {tool.logoUrl ? (
          <Image
            src={tool.logoUrl}
            alt={tool.name}
            width={14}
            height={14}
            className="object-contain"
            unoptimized
          />
        ) : (
          <span className="text-[9px] font-bold" style={{ color: accentColor }}>
            {tool.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Tool name */}
      <span className="max-w-[80px] truncate font-medium text-neutral-200">{tool.name}</span>

      {/* Confidence badge */}
      {tool.confidence != null && tool.confidence > 0 && (
        <span
          className="rounded-full px-1 py-px text-[9px] font-semibold"
          style={{
            backgroundColor: `${accentColor}25`,
            color: accentColor,
          }}
        >
          {tool.confidence}%
        </span>
      )}

      {/* Remove button (interactive mode only) */}
      {interactive && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tool.id);
          }}
          className="ml-0.5 hidden rounded-full p-0.5 text-neutral-400 transition-colors group-hover:flex hover:bg-white/10 hover:text-white"
          aria-label={`Remove ${tool.name}`}
        >
          <X size={10} />
        </button>
      )}
    </motion.div>
  );
}
