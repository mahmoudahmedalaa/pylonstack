/* ───────────────────────────────────────────────
   Pylon — Wizard Constants
   Selection options for the stack wizard flow.
   ─────────────────────────────────────────────── */

export interface WizardOption {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  tooltip?: string; // Crisp one-liner explaining impact/value
}

export const PROJECT_TYPES: WizardOption[] = [
  {
    id: 'web_app',
    title: 'Web Application',
    description:
      'Runs in the browser — SPA, SSR, or full-stack. Covers SaaS, marketplaces, dashboards, and portals.',
    icon: 'Globe',
    tooltip: 'Ideal for SaaS products, marketplaces, or internal tools accessed via browser',
  },
  {
    id: 'mobile_app',
    title: 'Mobile Application',
    description: 'Native or cross-platform iOS & Android. React Native, Flutter, Swift, or Kotlin.',
    icon: 'Smartphone',
    tooltip:
      'Best for consumer apps that need push notifications, offline access, or device sensors',
  },
  {
    id: 'desktop_app',
    title: 'Desktop Application',
    description:
      'Installed app on macOS, Windows, or Linux. Electron, Tauri, or native frameworks.',
    icon: 'Monitor',
    tooltip:
      'Choose when you need system-level access, heavy local processing, or offline-first UX',
  },
  {
    id: 'backend_service',
    title: 'Backend Service',
    description:
      'Server-side only — no user-facing UI. REST, GraphQL, gRPC APIs, workers, or microservices.',
    icon: 'Server',
    tooltip:
      'Pure API or microservice — no frontend needed, focuses on data processing and integrations',
  },
  {
    id: 'cli_tool',
    title: 'CLI Tool',
    description: 'Runs in the terminal. Developer tools, build scripts, or automation utilities.',
    icon: 'Terminal',
    tooltip:
      'For developer utilities, automation scripts, or DevOps tooling run from the command line',
  },
  {
    id: 'browser_extension',
    title: 'Browser Extension',
    description: 'Extends the browser. Chrome, Firefox, or cross-browser extensions.',
    icon: 'Puzzle',
    tooltip:
      'Enhances browser functionality — content injection, tab management, or productivity tools',
  },
];

export const TEAM_SIZES: WizardOption[] = [
  {
    id: 'solo',
    title: 'Solo Developer',
    description: 'Just me, shipping fast.',
    icon: 'User',
    tooltip: "We'll prioritize simplicity and tools with great DX to maximize your velocity",
  },
  {
    id: 'small',
    title: 'Small Team (2-5)',
    description: 'Small startup or side project team.',
    icon: 'Users',
    tooltip: 'Balanced stack — collaborative tools without heavy overhead',
  },
  {
    id: 'medium',
    title: 'Medium Team (6-20)',
    description: 'Growing engineering team.',
    icon: 'Building',
    tooltip: 'Emphasis on established patterns, CI/CD, and tools that scale with team growth',
  },
  {
    id: 'large',
    title: 'Large Team (20+)',
    description: 'Enterprise-scale engineering organization.',
    icon: 'Building2',
    tooltip: 'Enterprise-grade tooling with governance, RBAC, and multi-team coordination',
  },
];

export const PRIORITIES: WizardOption[] = [
  {
    id: 'speed',
    title: 'Ship Fast',
    description: 'Get to market quickly, iterate later.',
    icon: 'Zap',
    tooltip: 'Favors batteries-included frameworks and managed services to reduce time to launch',
  },
  {
    id: 'scale',
    title: 'Scale First',
    description: 'Build for millions of users from day one.',
    icon: 'TrendingUp',
    tooltip: 'Architecture designed for horizontal scaling, caching, and high-throughput workloads',
  },
  {
    id: 'cost',
    title: 'Budget-Friendly',
    description: 'Minimize costs, maximize free tiers.',
    icon: 'DollarSign',
    tooltip: 'Maximizes free tiers and open-source tools — grow into paid plans only when needed',
  },
  {
    id: 'dx',
    title: 'Great DX',
    description: 'Developer experience and tooling matter most.',
    icon: 'Heart',
    tooltip:
      'Prioritizes hot reload, type safety, great docs, and modern toolchains for happier devs',
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'SOC 2, HIPAA, GDPR — regulatory and data-protection requirements.',
    icon: 'ShieldCheck',
    tooltip:
      'SOC 2, HIPAA, or GDPR requirements — picks tools with certifications and audit trails',
  },
];

export const REQUIREMENTS: WizardOption[] = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'User sign-up, login, OAuth, or SSO.',
    icon: 'Shield',
    tooltip: 'User identity — social logins, MFA, session management, and access control',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Subscriptions, one-time charges, or invoicing.',
    icon: 'CreditCard',
    tooltip: 'Stripe, billing portals, subscription management, and revenue tracking',
  },
  {
    id: 'realtime',
    title: 'Real-time',
    description: 'WebSockets, live updates, or collaboration.',
    icon: 'Radio',
    tooltip: 'Live cursors, chat, notifications, or collaborative editing via WebSockets',
  },
  {
    id: 'storage',
    title: 'File Storage',
    description: 'Upload, store, and serve user files or media.',
    icon: 'HardDrive',
    tooltip: 'Image uploads, file management, CDN delivery, and media processing',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track user behavior, funnels, and events.',
    icon: 'BarChart3',
    tooltip: 'User behavior tracking, funnel analysis, A/B testing, and product insights',
  },
  {
    id: 'ai',
    title: 'AI / ML',
    description: 'LLM integration, embeddings, or ML inference.',
    icon: 'Brain',
    tooltip: 'LLM APIs, vector search, embeddings, or custom model inference for smart features',
  },
  {
    id: 'email',
    title: 'Email / Notifications',
    description: 'Transactional emails, push, or in-app alerts.',
    icon: 'Mail',
    tooltip: 'Transactional emails, push notifications, SMS, and in-app notification systems',
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Full-text search, filtering, or faceted search.',
    icon: 'Search',
    tooltip: 'Fast full-text search with typo tolerance, filters, and relevance ranking',
  },
];

export const PREFERENCES: WizardOption[] = [
  {
    id: 'open_source',
    title: 'Open Source',
    description: 'Prefer open-source tools and frameworks.',
    icon: 'GitBranch',
    tooltip: 'Community-driven tools you can inspect, modify, and self-host — no vendor lock-in',
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Type-safe codebase across the stack.',
    icon: 'FileCode',
    tooltip: 'Catches bugs at build time instead of runtime — safer, faster refactoring',
  },
  {
    id: 'serverless',
    title: 'Serverless',
    description: 'No server management — functions and edge.',
    icon: 'Cloud',
    tooltip: 'No servers to manage — pay per request, auto-scales, and scales to zero when idle',
  },
  {
    id: 'self_hosted',
    title: 'Self-Hosted',
    description: 'Full control — run on your own infrastructure.',
    icon: 'Server',
    tooltip: 'Full control over your data and infrastructure — higher effort, lower recurring cost',
  },
  {
    id: 'managed',
    title: 'Managed Services',
    description: 'Let providers handle ops — focus on code.',
    icon: 'Settings',
    tooltip: 'Cloud providers handle uptime, scaling, security patches — you focus on your product',
  },
  {
    id: 'monorepo',
    title: 'Monorepo',
    description: 'All packages in a single repository.',
    icon: 'FolderTree',
    tooltip: 'Frontend, backend, and shared code in one repo — simpler dependency management',
  },
];

export const ANALYTICS: WizardOption[] = [
  {
    id: 'posthog',
    title: 'PostHog',
    description: 'Product analytics, feature flags, and session recording.',
    icon: 'BarChart3',
    tooltip: 'All-in-one platform for product analytics, ideal for SaaS and startups',
  },
  {
    id: 'google_analytics',
    title: 'Google Analytics',
    description: 'Standard traffic and conversion tracking.',
    icon: 'LineChart',
    tooltip: 'Industry standard for marketing websites and general traffic analysis',
  },
  {
    id: 'plausible',
    title: 'Plausible',
    description: 'Privacy-friendly, lightweight analytics.',
    icon: 'Activity',
    tooltip: 'GDPR-compliant, cookie-less tracking for privacy-conscious projects',
  },
  {
    id: 'mixpanel',
    title: 'Mixpanel',
    description: 'Advanced event tracking and funnel analysis.',
    icon: 'PieChart',
    tooltip: 'Deep user behavior analysis and complex funnel tracking',
  },
];
