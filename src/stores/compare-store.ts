import { create } from 'zustand';
import type { Tool } from '@/data/tools-catalog';

interface CompareStore {
  selectedTools: Tool[];
  toggleTool: (tool: Tool) => void;
  clearSelection: () => void;
  isCompareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  selectedTools: [],
  isCompareOpen: false,
  toggleTool: (tool) => {
    const current = get().selectedTools;
    const isSelected = current.some((t) => t.id === tool.id);
    if (isSelected) {
      set({ selectedTools: current.filter((t) => t.id !== tool.id) });
    } else {
      if (current.length < 3) {
        set({ selectedTools: [...current, tool] });
      }
    }
  },
  clearSelection: () => set({ selectedTools: [], isCompareOpen: false }),
  setCompareOpen: (open) => set({ isCompareOpen: open }),
}));
