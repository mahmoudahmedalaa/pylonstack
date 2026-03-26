/* ───────────────────────────────────────────────
   Pylon — Wizard Constants
   Selection options for the stack wizard flow.
   ─────────────────────────────────────────────── */

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
