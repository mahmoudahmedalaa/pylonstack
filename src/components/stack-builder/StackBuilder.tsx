'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { StackLayer } from './StackLayer';
import type { StackLayerData } from './StackLayer';
import { StackProgress } from './StackProgress';

export type StackBuilderMode = 'preview' | 'reveal' | 'interactive';

interface StackBuilderProps {
  /** Initial layers to display */
  layers: StackLayerData[];
  /** Display mode */
  mode: StackBuilderMode;
  /** Total categories for progress calculation (defaults to layers.length) */
  totalCategories?: number;
  /** Show the progress gauge */
  showProgress?: boolean;
  /** Callback when layers are reordered */
  onReorder?: (layers: StackLayerData[]) => void;
  /** Callback when a tool is removed */
  onRemoveTool?: (layerId: string, toolId: string) => void;
  /** Optional className */
  className?: string;
}

export function StackBuilder({
  layers: initialLayers,
  mode,
  totalCategories,
  showProgress = true,
  onReorder,
  onRemoveTool,
  className = '',
}: StackBuilderProps) {
  const [layers, setLayers] = useState<StackLayerData[]>(initialLayers);

  // Sync external layer changes
  useEffect(() => {
    setLayers(initialLayers);
  }, [initialLayers]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setLayers((prev) => {
        const oldIndex = prev.findIndex((l) => l.id === active.id);
        const newIndex = prev.findIndex((l) => l.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);
        onReorder?.(reordered);
        return reordered;
      });
    },
    [onReorder],
  );

  // Handle tool removal
  const handleRemoveTool = useCallback(
    (layerId: string, toolId: string) => {
      setLayers((prev) =>
        prev
          .map((layer) =>
            layer.id === layerId
              ? { ...layer, tools: layer.tools.filter((t) => t.id !== toolId) }
              : layer,
          )
          // Only remove fully empty layers in interactive mode — preserve skeletons in preview
          .filter((layer) => layer.tools.length > 0),
      );
      onRemoveTool?.(layerId, toolId);
    },
    [onRemoveTool],
  );

  const isPreview = mode === 'preview';
  // filledCount = layers that actually have tools (not skeleton-only)
  const filledCount = layers.filter((l) => l.tools.length > 0).length;
  const total = totalCategories ?? layers.length;

  // Sortable IDs
  const sortableIds = useMemo(() => layers.map((l) => l.id), [layers]);

  // Empty state
  if (layers.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="bg-primary-500/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl">
            <Layers size={24} className="text-primary-400" />
          </div>
          <p className="text-sm font-medium text-neutral-300">
            {mode === 'preview' ? 'Your stack will appear here' : 'No tools in your stack yet'}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {mode === 'preview'
              ? 'Make selections to start building'
              : 'Add tools to begin building your stack'}
          </p>
        </motion.div>
      </div>
    );
  }

  const content = (
    <div className={`flex flex-col ${isPreview ? 'gap-2' : 'gap-3'}`}>
      <AnimatePresence mode="popLayout">
        {layers.map((layer, index) => (
          <StackLayer
            key={layer.id}
            layer={layer}
            mode={mode}
            index={index}
            onRemoveTool={mode === 'interactive' ? handleRemoveTool : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary-500/10 flex h-7 w-7 items-center justify-center rounded-lg">
            <Layers size={14} className="text-primary-400" />
          </div>
          <div>
            <h3 className={`font-semibold text-neutral-200 ${isPreview ? 'text-xs' : 'text-sm'}`}>
              {mode === 'reveal' ? 'Your Recommended Stack' : 'Stack Builder'}
            </h3>
            {!isPreview && (
              <p className="text-[10px] text-neutral-500">
                {mode === 'interactive'
                  ? 'Drag layers to prioritize • Click × to remove'
                  : `${filledCount} categories • ${layers.reduce((s, l) => s + l.tools.length, 0)} tools`}
              </p>
            )}
          </div>
        </div>

        {/* Compact progress in preview */}
        {showProgress && isPreview && (
          <StackProgress filledCount={filledCount} totalCategories={total} compact />
        )}
      </div>

      {/* Full progress bar (non-preview) */}
      {showProgress && !isPreview && (
        <StackProgress filledCount={filledCount} totalCategories={total} />
      )}

      {/* Stack layers */}
      {mode === 'interactive' ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {content}
          </SortableContext>
        </DndContext>
      ) : (
        content
      )}

      {/* AI Tailoring Note (Preview only) */}
      {isPreview && layers.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-center text-[10px] text-neutral-500 italic"
        >
          * Our AI engine will tailor these base layers perfectly to your workflow.
        </motion.p>
      )}

      {/* Platform line (decorative bottom) */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: mode === 'reveal' ? layers.length * 0.3 + 0.2 : 0.5, duration: 0.4 }}
        className="mx-auto h-1 w-3/4 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(16,185,129,0.3), transparent)',
        }}
      />
    </div>
  );
}
