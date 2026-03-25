/* ───────────────────────────────────────────────
   Pylon — Mock Data
   Realistic data powering all pages during dev.
   Will be replaced by Supabase queries later.
   ─────────────────────────────────────────────── */

// ── Tools & Categories (from comprehensive catalog) ──

import { TOOLS, CATEGORIES, type Category, type Tool } from '@/data/tools-catalog';
export { TOOLS, CATEGORIES, type Category, type Tool };

// ── Projects ────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  toolIds: string[]; // references Tool.id
  monthlyCost: number;
  createdAt: string; // ISO date
  updatedAt: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'SaaS Starter Kit',
    description: 'Full-stack SaaS boilerplate with auth, payments, and dashboard.',
    status: 'active',
    toolIds: ['nextjs', 'tailwindcss', 'supabase', 'stripe', 'vercel', 'sentry'],
    monthlyCost: 45,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-22T14:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Mobile API Backend',
    description: 'REST API powering a React Native mobile app with real-time features.',
    status: 'active',
    toolIds: ['nodejs', 'express', 'postgresql', 'redis', 'aws', 'github-actions', 'datadog'],
    monthlyCost: 120,
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-03-20T11:15:00Z',
  },
  {
    id: 'proj-3',
    name: 'Portfolio Website',
    description: 'Personal portfolio with blog, dark mode, and SEO optimization.',
    status: 'draft',
    toolIds: ['svelte', 'tailwindcss', 'netlify', 'posthog'],
    monthlyCost: 0,
    createdAt: '2025-03-10T16:00:00Z',
    updatedAt: '2025-03-10T16:00:00Z',
  },
];

// ── Activity Feed ───────────────────────────────

export interface Activity {
  id: string;
  type: 'tool_added' | 'project_created' | 'ai_suggestion' | 'tool_removed' | 'project_updated';
  title: string;
  description: string;
  timestamp: string;
  projectName?: string;
  toolName?: string;
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'tool_added',
    title: 'Added Sentry',
    description: 'Error monitoring added to SaaS Starter Kit project.',
    timestamp: '2025-03-22T14:30:00Z',
    projectName: 'SaaS Starter Kit',
    toolName: 'Sentry',
  },
  {
    id: 'act-2',
    type: 'ai_suggestion',
    title: 'AI Recommendation',
    description: 'Consider adding Redis for caching — could reduce API latency by ~40%.',
    timestamp: '2025-03-22T12:00:00Z',
    projectName: 'SaaS Starter Kit',
  },
  {
    id: 'act-3',
    type: 'project_updated',
    title: 'Stack Updated',
    description: 'Mobile API Backend stack updated with Datadog monitoring.',
    timestamp: '2025-03-20T11:15:00Z',
    projectName: 'Mobile API Backend',
    toolName: 'Datadog',
  },
  {
    id: 'act-4',
    type: 'project_created',
    title: 'New Project',
    description: 'Portfolio Website project created as draft.',
    timestamp: '2025-03-10T16:00:00Z',
    projectName: 'Portfolio Website',
  },
  {
    id: 'act-5',
    type: 'tool_removed',
    title: 'Removed Firebase Auth',
    description: 'Switched from Firebase Auth to Supabase Auth in SaaS Starter Kit.',
    timestamp: '2025-03-08T09:45:00Z',
    projectName: 'SaaS Starter Kit',
    toolName: 'Firebase Auth',
  },
  {
    id: 'act-6',
    type: 'ai_suggestion',
    title: 'Cost Optimization',
    description: 'Switching from AWS to Vercel could save ~$75/mo for your current usage.',
    timestamp: '2025-03-05T15:20:00Z',
    projectName: 'Mobile API Backend',
  },
];

// ── Wizard Options ──────────────────────────────

export interface WizardOption {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export const PROJECT_TYPES: WizardOption[] = [
  {
    id: 'web_app',
    title: 'Web Application',
    description:
      'Runs in the browser — SPA, SSR, or full-stack. Covers SaaS, marketplaces, dashboards, and portals.',
    icon: 'Globe',
  },
  {
    id: 'mobile_app',
    title: 'Mobile Application',
    description: 'Native or cross-platform iOS & Android. React Native, Flutter, Swift, or Kotlin.',
    icon: 'Smartphone',
  },
  {
    id: 'desktop_app',
    title: 'Desktop Application',
    description:
      'Installed app on macOS, Windows, or Linux. Electron, Tauri, or native frameworks.',
    icon: 'Monitor',
  },
  {
    id: 'backend_service',
    title: 'Backend Service',
    description:
      'Server-side only — no user-facing UI. REST, GraphQL, gRPC APIs, workers, or microservices.',
    icon: 'Server',
  },
  {
    id: 'cli_tool',
    title: 'CLI Tool',
    description: 'Runs in the terminal. Developer tools, build scripts, or automation utilities.',
    icon: 'Terminal',
  },
  {
    id: 'browser_extension',
    title: 'Browser Extension',
    description: 'Extends the browser. Chrome, Firefox, or cross-browser extensions.',
    icon: 'Puzzle',
  },
];

export const TEAM_SIZES: WizardOption[] = [
  { id: 'solo', title: 'Solo Developer', description: 'Just me, shipping fast.', icon: 'User' },
  {
    id: 'small',
    title: 'Small Team (2-5)',
    description: 'Small startup or side project team.',
    icon: 'Users',
  },
  {
    id: 'medium',
    title: 'Medium Team (6-20)',
    description: 'Growing engineering team.',
    icon: 'Building',
  },
  {
    id: 'large',
    title: 'Large Team (20+)',
    description: 'Enterprise-scale engineering organization.',
    icon: 'Building2',
  },
];

export const PRIORITIES: WizardOption[] = [
  {
    id: 'speed',
    title: 'Ship Fast',
    description: 'Get to market quickly, iterate later.',
    icon: 'Zap',
  },
  {
    id: 'scale',
    title: 'Scale First',
    description: 'Build for millions of users from day one.',
    icon: 'TrendingUp',
  },
  {
    id: 'cost',
    title: 'Budget-Friendly',
    description: 'Minimize costs, maximize free tiers.',
    icon: 'DollarSign',
  },
  {
    id: 'dx',
    title: 'Great DX',
    description: 'Developer experience and tooling matter most.',
    icon: 'Heart',
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'SOC 2, HIPAA, GDPR — regulatory and data-protection requirements.',
    icon: 'ShieldCheck',
  },
];

export const REQUIREMENTS: WizardOption[] = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'User sign-up, login, OAuth, or SSO.',
    icon: 'Shield',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Subscriptions, one-time charges, or invoicing.',
    icon: 'CreditCard',
  },
  {
    id: 'realtime',
    title: 'Real-time',
    description: 'WebSockets, live updates, or collaboration.',
    icon: 'Radio',
  },
  {
    id: 'storage',
    title: 'File Storage',
    description: 'Upload, store, and serve user files or media.',
    icon: 'HardDrive',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track user behavior, funnels, and events.',
    icon: 'BarChart3',
  },
  {
    id: 'ai',
    title: 'AI / ML',
    description: 'LLM integration, embeddings, or ML inference.',
    icon: 'Brain',
  },
  {
    id: 'email',
    title: 'Email / Notifications',
    description: 'Transactional emails, push, or in-app alerts.',
    icon: 'Mail',
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Full-text search, filtering, or faceted search.',
    icon: 'Search',
  },
];

export const PREFERENCES: WizardOption[] = [
  {
    id: 'open_source',
    title: 'Open Source',
    description: 'Prefer open-source tools and frameworks.',
    icon: 'GitBranch',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Type-safe codebase across the stack.',
    icon: 'FileCode',
  },
  {
    id: 'serverless',
    title: 'Serverless',
    description: 'No server management — functions and edge.',
    icon: 'Cloud',
  },
  {
    id: 'self_hosted',
    title: 'Self-Hosted',
    description: 'Full control — run on your own infrastructure.',
    icon: 'Server',
  },
  {
    id: 'managed',
    title: 'Managed Services',
    description: 'Let providers handle ops — focus on code.',
    icon: 'Settings',
  },
  {
    id: 'monorepo',
    title: 'Monorepo',
    description: 'All packages in a single repository.',
    icon: 'FolderTree',
  },
];

// ── Stats Helpers ───────────────────────────────

export const STATS = {
  totalTools: TOOLS.length,
  activeProjects: PROJECTS.filter((p) => p.status === 'active').length,
  monthlyCost: PROJECTS.reduce((sum, p) => sum + p.monthlyCost, 0),
  aiSuggestions: ACTIVITIES.filter((a) => a.type === 'ai_suggestion').length,
};

// ── Helper: get tools for a project ─────────────

export function getProjectTools(project: Project): Tool[] {
  return project.toolIds
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is Tool => t !== undefined);
}

// ── Helper: format stars ────────────────────────

export function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k`;
  return stars.toString();
}

// ── Helper: relative time ───────────────────────

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label} ago`;
  }
  return 'just now';
}
