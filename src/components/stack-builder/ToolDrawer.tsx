'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Briefcase } from 'lucide-react';
import { TOOLS, CATEGORIES, type Tool } from '@/data/tools-catalog';
import Image from 'next/image';

interface ToolDrawerProps {
  onAddTool: (tool: Tool) => void;
  isOpen?: boolean;
}

export function ToolDrawer({ onAddTool }: ToolDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter tools based on search and selected category
  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? tool.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-500)]/10">
          <Briefcase className="h-4 w-4 text-[var(--color-accent-500)]" />
        </div>
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Tool Catalog</h2>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] py-2 pr-4 pl-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--color-accent-500)] focus:ring-1 focus:ring-[var(--color-accent-500)] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-[var(--foreground)] text-[var(--background)]'
                : 'bg-[var(--border)]/50 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'bg-[var(--border)]/50 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
              }`}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tool List */}
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative flex cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-transparent p-3 transition-colors hover:border-[var(--border)] hover:bg-[var(--background)]/50"
                onClick={() => onAddTool(tool)}
              >
                {/* Tool Logo */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white pr-1 pb-1">
                  {tool.logo ? (
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-bold text-black">{tool.name.charAt(0)}</span>
                  )}
                </div>

                {/* Tool Info */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {tool.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--border)]/50 px-1.5 py-0.5 text-[9px] font-medium text-[var(--muted-foreground)]">
                      {tool.pricing}
                    </span>
                  </div>
                  <span className="mt-0.5 truncate text-[11px] text-[var(--color-accent-500)]">
                    {tool.category.replace('-', ' ')}
                  </span>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {tool.description}
                  </p>
                </div>

                {/* Add Button indicator */}
                <div className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-accent-500)] text-white opacity-0 shadow-sm transition-all group-hover:opacity-100">
                  <Plus className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
            {filteredTools.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium text-[var(--foreground)]">No tools found</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
