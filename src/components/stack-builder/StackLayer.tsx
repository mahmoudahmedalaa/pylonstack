'use client';

import { useSortable } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Layout,
  Server,
  Database,
  Cloud,
  Shield,
  FileText,
  CreditCard,
  BarChart3,
  Brain,
  Container,
  TestTube2,
  Smartphone,
  Plug,
  HardDrive,
  Search,
  Clock,
  Activity,
} from 'lucide-react';
import { useState } from 'react';
import type { CategoryColor } from './stack-colors';
import { ToolChip } from './ToolChip';
import type { ToolChipData } from './ToolChip';

/** Get a Lucide icon component by name */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Layout,
  Server,
  Database,
  Cloud,
  Shield,
  FileText,
  CreditCard,
  BarChart3,
  Brain,
  Container,
  TestTube2,
  Smartphone,
  Plug,
  HardDrive,
  Search,
  Clock,
  Activity,
};

export interface StackLayerData {
  id: string;
  category: string;
  icon: string;
  color: CategoryColor;
  tools: ToolChipData[];
}

interface StackLayerProps {
  layer: StackLayerData;
  mode: 'preview' | 'reveal' | 'interactive';
  index: number;
  onRemoveTool?: (layerId: string, toolId: string) => void;
}

export function StackLayer({ layer, mode, index, onRemoveTool }: StackLayerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isInteractive = mode === 'interactive';
  const isPreview = mode === 'preview';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
    disabled: !isInteractive,
  });

  const sortableStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX ?? 1}) scaleY(${transform.scaleY ?? 1})`
      : undefined,
    transition,
  };

  const IconComponent = ICON_MAP[layer.icon] || Layout;
  const toolCount = layer.tools.length;
  const showCollapse = toolCount > 4 && !isPreview;

  return (
    <motion.div
      ref={setNodeRef}
      style={sortableStyle}
      layout
      initial={{ opacity: 0, x: -60, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.8 : 1,
        x: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9, x: -30 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: mode === 'reveal' ? index * 0.3 : index * 0.08,
      }}
      className={`group relative rounded-xl border border-white/[0.08] backdrop-blur-xl transition-shadow duration-300 ${isDragging ? 'z-50 shadow-2xl' : 'z-0'} ${isPreview ? 'px-3 py-2' : 'px-4 py-3'} `}
      whileHover={!isDragging ? { boxShadow: `0 4px 20px ${layer.color.glow}` } : undefined}
      onHoverStart={undefined}
      onHoverEnd={undefined}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-80" style={{ background: layer.color.gradient }} />

        {/* Left accent bar */}
        <div
          className="absolute top-0 left-0 h-full w-1"
          style={{ backgroundColor: layer.color.accent }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          {isInteractive && (
            <button
              className="cursor-grab touch-none rounded p-0.5 text-neutral-500 transition-colors hover:text-neutral-300 active:cursor-grabbing"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder"
            >
              <GripVertical size={14} />
            </button>
          )}

          {/* Category icon */}
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${layer.color.accent}20` }}
          >
            <IconComponent
              size={isPreview ? 12 : 14}
              className="transition-colors"
              // @ts-expect-error -- style prop on Lucide icon
              style={{ color: layer.color.accent }}
            />
          </div>

          {/* Category name */}
          <span
            className={`font-semibold tracking-tight ${isPreview ? 'text-xs' : 'text-sm'}`}
            style={{ color: layer.color.text }}
          >
            {layer.category}
          </span>

          {/* Tool count badge */}
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
            {toolCount}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Collapse toggle */}
          {showCollapse && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded p-0.5 text-neutral-500 transition-colors hover:text-neutral-300"
              aria-label={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          )}
        </div>

        {/* Tools grid or skeleton placeholder */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={isPreview ? 'mt-1.5' : 'mt-2.5'}
            >
              {toolCount > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {layer.tools.map((tool) => (
                    <ToolChip
                      key={tool.id}
                      tool={tool}
                      accentColor={layer.color.accent}
                      glowColor={layer.color.glow}
                      interactive={isInteractive}
                      onRemove={
                        onRemoveTool ? (toolId) => onRemoveTool(layer.id, toolId) : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                /* Skeleton placeholder — shown when category exists but tools haven't been generated yet */
                <div
                  className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2"
                  style={{
                    borderColor: `${layer.color.accent}30`,
                    backgroundColor: `${layer.color.accent}08`,
                  }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{ backgroundColor: layer.color.accent }}
                  />
                  <span className="text-[10px] text-neutral-500">AI will recommend tools here</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
