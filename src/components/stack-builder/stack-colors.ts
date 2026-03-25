/**
 * Category → Color mapping for the Stack Builder visual.
 * Each category gets a unique gradient + accent color for visual identity.
 */

export interface CategoryColor {
  /** CSS gradient for the layer background (with transparency for glassmorphism) */
  gradient: string;
  /** Solid accent color for the left bar */
  accent: string;
  /** Glow color for hover states (with alpha) */
  glow: string;
  /** Text-safe accent for labels */
  text: string;
}

export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  Frontend: {
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(129,140,248,0.08) 100%)',
    accent: '#818cf8',
    glow: 'rgba(129,140,248,0.25)',
    text: '#a5b4fc',
  },
  Backend: {
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.08) 100%)',
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.25)',
    text: '#6ee7b7',
  },
  Database: {
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.08) 100%)',
    accent: '#fbbf24',
    glow: 'rgba(251,191,36,0.25)',
    text: '#fcd34d',
  },
  'Cloud & Hosting': {
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(96,165,250,0.08) 100%)',
    accent: '#60a5fa',
    glow: 'rgba(96,165,250,0.25)',
    text: '#93bbfd',
  },
  Authentication: {
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(192,132,252,0.08) 100%)',
    accent: '#c084fc',
    glow: 'rgba(192,132,252,0.25)',
    text: '#d8b4fe',
  },
  CMS: {
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(244,114,182,0.08) 100%)',
    accent: '#f472b6',
    glow: 'rgba(244,114,182,0.25)',
    text: '#f9a8d4',
  },
  Payments: {
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(74,222,128,0.08) 100%)',
    accent: '#4ade80',
    glow: 'rgba(74,222,128,0.25)',
    text: '#86efac',
  },
  Analytics: {
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(56,189,248,0.08) 100%)',
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.25)',
    text: '#7dd3fc',
  },
  'AI & ML': {
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(167,139,250,0.08) 100%)',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.25)',
    text: '#c4b5fd',
  },
  DevOps: {
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(251,146,60,0.08) 100%)',
    accent: '#fb923c',
    glow: 'rgba(251,146,60,0.25)',
    text: '#fdba74',
  },
  Testing: {
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(248,113,113,0.08) 100%)',
    accent: '#f87171',
    glow: 'rgba(248,113,113,0.25)',
    text: '#fca5a5',
  },
  'Mobile Development': {
    gradient: 'linear-gradient(135deg, rgba(20,184,166,0.15) 0%, rgba(45,212,191,0.08) 100%)',
    accent: '#2dd4bf',
    glow: 'rgba(45,212,191,0.25)',
    text: '#5eead4',
  },
  'API & Communication': {
    gradient: 'linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(250,204,21,0.08) 100%)',
    accent: '#facc15',
    glow: 'rgba(250,204,21,0.25)',
    text: '#fde047',
  },
  Storage: {
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(34,211,238,0.08) 100%)',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.25)',
    text: '#67e8f9',
  },
  Search: {
    gradient: 'linear-gradient(135deg, rgba(217,70,239,0.15) 0%, rgba(232,121,249,0.08) 100%)',
    accent: '#e879f9',
    glow: 'rgba(232,121,249,0.25)',
    text: '#f0abfc',
  },
  'Background Jobs': {
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(251,113,133,0.08) 100%)',
    accent: '#fb7185',
    glow: 'rgba(251,113,133,0.25)',
    text: '#fda4af',
  },
  Monitoring: {
    gradient: 'linear-gradient(135deg, rgba(132,204,22,0.15) 0%, rgba(163,230,53,0.08) 100%)',
    accent: '#a3e635',
    glow: 'rgba(163,230,53,0.25)',
    text: '#bef264',
  },
};

/** Fallback color for unknown categories */
export const DEFAULT_CATEGORY_COLOR: CategoryColor = {
  gradient: 'linear-gradient(135deg, rgba(148,163,184,0.15) 0%, rgba(203,213,225,0.08) 100%)',
  accent: '#94a3b8',
  glow: 'rgba(148,163,184,0.25)',
  text: '#cbd5e1',
};

export function getCategoryColor(category: string): CategoryColor {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;
}

/** Lucide icon mapping for categories */
export const CATEGORY_ICONS: Record<string, string> = {
  Frontend: 'Layout',
  Backend: 'Server',
  Database: 'Database',
  'Cloud & Hosting': 'Cloud',
  Authentication: 'Shield',
  CMS: 'FileText',
  Payments: 'CreditCard',
  Analytics: 'BarChart3',
  'AI & ML': 'Brain',
  DevOps: 'Container',
  Testing: 'TestTube2',
  'Mobile Development': 'Smartphone',
  'API & Communication': 'Plug',
  Storage: 'HardDrive',
  Search: 'Search',
  'Background Jobs': 'Clock',
  Monitoring: 'Activity',
};
