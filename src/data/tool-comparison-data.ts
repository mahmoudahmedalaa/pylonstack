/* ───────────────────────────────────────────────
   Tool Comparison Metadata
   Enriched data for the comparison overlay.
   This data supplements the base Tool interface with
   decision-useful dimensions: learning curve, ecosystem,
   use cases, pros, cons, and scaling characteristics.
   ─────────────────────────────────────────────── */

export interface ComparisonMeta {
  learningCurve: 'Easy' | 'Moderate' | 'Steep';
  ecosystemSize: 'Massive' | 'Large' | 'Growing' | 'Emerging' | 'Mature';
  bestFor: string[];            // 2-4 concise use cases
  pros: string[];               // 2-3 key strengths
  cons: string[];               // 2-3 key weaknesses
  scalability: 'Enterprise' | 'Startup to Enterprise' | 'Startup to Mid' | 'Hobby to Mid';
  communityActivity: 'Very Active' | 'Active' | 'Moderate' | 'Low';
  maturity: 'Battle-tested' | 'Mature' | 'Growing' | 'Early';
  typeScriptSupport: 'Native' | 'First-class' | 'Good' | 'Partial' | 'None';
}

/**
 * Comparison metadata keyed by tool.id.
 * Tools not in this map will use auto-derived data in the overlay.
 */
export const COMPARISON_META: Record<string, ComparisonMeta> = {
  /* ── FRONTEND ──────────────────────────────────── */
  react: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Massive',
    bestFor: ['SPAs', 'Complex UIs', 'Cross-platform (React Native)', 'Large teams'],
    pros: ['Largest ecosystem & job market', 'Flexible architecture', 'Strong community'],
    cons: ['Requires many decisions (routing, state)', 'JSX learning curve', 'Frequent ecosystem churn'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  nextjs: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Large',
    bestFor: ['Full-stack web apps', 'SEO-heavy sites', 'E-commerce', 'SaaS platforms'],
    pros: ['SSR + SSG + ISR built-in', 'API routes', 'Vercel deployment'],
    cons: ['Vercel lock-in risk', 'Complex caching model', 'Heavy for simple sites'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  vue: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['Progressive enhancement', 'Small to mid apps', 'Gradual adoption', 'Prototyping'],
    pros: ['Gentle learning curve', 'Excellent docs', 'Single-file components'],
    cons: ['Smaller job market than React', 'Fewer enterprise case studies', 'Less third-party libs'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  nuxt: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Growing',
    bestFor: ['Vue full-stack apps', 'SSR sites', 'Content-driven sites', 'Rapid prototyping'],
    pros: ['Auto-imports', 'File-based routing', 'Great DX'],
    cons: ['Smaller ecosystem than Next.js', 'Fewer hosting options', 'Vue dependency'],
    scalability: 'Startup to Mid',
    communityActivity: 'Active',
    maturity: 'Mature',
    typeScriptSupport: 'First-class',
  },
  svelte: {
    learningCurve: 'Easy',
    ecosystemSize: 'Growing',
    bestFor: ['Small/mid apps', 'Performance-critical UIs', 'Animations', 'Learning web dev'],
    pros: ['No virtual DOM — tiny bundles', 'Simple syntax', 'Compile-time optimization'],
    cons: ['Smaller ecosystem', 'Fewer jobs', 'Less enterprise adoption'],
    scalability: 'Hobby to Mid',
    communityActivity: 'Active',
    maturity: 'Growing',
    typeScriptSupport: 'First-class',
  },
  sveltekit: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Growing',
    bestFor: ['Svelte full-stack', 'Content sites', 'Performance-first apps'],
    pros: ['Tiny output bundles', 'Adapter system for any host', 'Great DX'],
    cons: ['Smaller community', 'Fewer deployment guides', 'Svelte dependency'],
    scalability: 'Startup to Mid',
    communityActivity: 'Active',
    maturity: 'Growing',
    typeScriptSupport: 'First-class',
  },
  angular: {
    learningCurve: 'Steep',
    ecosystemSize: 'Large',
    bestFor: ['Enterprise apps', 'Large teams', 'Internal tools', 'Banking/finance'],
    pros: ['Full framework — everything included', 'Strong typing', 'Google backing'],
    cons: ['Steep learning curve', 'Verbose boilerplate', 'Heavier bundle'],
    scalability: 'Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Native',
  },
  solid: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Emerging',
    bestFor: ['Performance-critical UIs', 'React-like DX without VDOM', 'Real-time dashboards'],
    pros: ['Fastest UI framework benchmarks', 'Fine-grained reactivity', 'Small bundle'],
    cons: ['Very small ecosystem', 'Few jobs', 'Early maturity'],
    scalability: 'Hobby to Mid',
    communityActivity: 'Active',
    maturity: 'Growing',
    typeScriptSupport: 'First-class',
  },

  /* ── BACKEND ───────────────────────────────────── */
  express: {
    learningCurve: 'Easy',
    ecosystemSize: 'Massive',
    bestFor: ['REST APIs', 'Microservices', 'Prototyping', 'Learning Node.js'],
    pros: ['Minimal & flexible', 'Massive middleware ecosystem', 'Battle-tested'],
    cons: ['No built-in structure', 'Callback-heavy patterns', 'Security configs manual'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Good',
  },
  fastify: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Growing',
    bestFor: ['High-performance APIs', 'Microservices', 'JSON-heavy services'],
    pros: ['2x faster than Express', 'Schema validation built-in', 'Good plugin system'],
    cons: ['Smaller ecosystem than Express', 'Less middleware available', 'Plugin learning curve'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Active',
    maturity: 'Mature',
    typeScriptSupport: 'First-class',
  },
  django: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Large',
    bestFor: ['Content sites', 'Admin dashboards', 'Data-heavy apps', 'MVPs'],
    pros: ['Batteries included (ORM, admin, auth)', 'Excellent security defaults', 'Mature ecosystem'],
    cons: ['Monolithic architecture', 'Python async is complex', 'Less API-first'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'None',
  },
  rails: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Large',
    bestFor: ['MVPs', 'SaaS products', 'CRUD apps', 'Startups'],
    pros: ['Convention over configuration', 'Fastest time-to-market', 'Mature ecosystem'],
    cons: ['Ruby performance limitations', 'Declining job market', 'Memory consumption'],
    scalability: 'Startup to Mid',
    communityActivity: 'Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'None',
  },
  nestjs: {
    learningCurve: 'Steep',
    ecosystemSize: 'Growing',
    bestFor: ['Enterprise Node.js', 'Microservices', 'GraphQL APIs', 'Large codebases'],
    pros: ['Angular-like DI architecture', 'First-class TypeScript', 'Modular design'],
    cons: ['Heavy abstraction', 'Steep learning curve', 'Verbose'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Mature',
    typeScriptSupport: 'Native',
  },
  laravel: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['PHP web apps', 'SaaS', 'E-commerce', 'Content platforms'],
    pros: ['Elegant syntax', 'Great ecosystem (Forge, Vapor)', 'Excellent docs'],
    cons: ['PHP performance ceiling', 'Less modern feel', 'Hosting constraints'],
    scalability: 'Startup to Mid',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'None',
  },
  flask: {
    learningCurve: 'Easy',
    ecosystemSize: 'Growing',
    bestFor: ['Small APIs', 'Prototyping', 'ML model serving', 'Learning Python web'],
    pros: ['Minimal & simple', 'Very flexible', 'Easy to learn'],
    cons: ['No built-in ORM/auth', 'Manual project structure', 'Async requires extensions'],
    scalability: 'Hobby to Mid',
    communityActivity: 'Active',
    maturity: 'Mature',
    typeScriptSupport: 'None',
  },

  /* ── DATABASE ──────────────────────────────────── */
  postgresql: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Massive',
    bestFor: ['Complex queries', 'ACID compliance', 'Geospatial data', 'Enterprise'],
    pros: ['Most advanced open-source RDBMS', 'Extensible', 'JSONB support'],
    cons: ['Complex tuning', 'Heavier than MySQL', 'Replication complexity'],
    scalability: 'Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Good',
  },
  mongodb: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['Document storage', 'Rapid prototyping', 'IoT data', 'Content management'],
    pros: ['Flexible schema', 'Scales horizontally', 'Great for rapid iteration'],
    cons: ['No joins (before v5)', 'Consistency trade-offs', 'Memory hungry'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Good',
  },
  mysql: {
    learningCurve: 'Easy',
    ecosystemSize: 'Massive',
    bestFor: ['Web apps', 'WordPress/CMS', 'E-commerce', 'Read-heavy workloads'],
    pros: ['Very widespread', 'Fast reads', 'Excellent hosting support'],
    cons: ['Less advanced features than Postgres', 'Owned by Oracle', 'Weaker JSON support'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Good',
  },
  redis: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['Caching', 'Session storage', 'Real-time leaderboards', 'Pub/Sub'],
    pros: ['Blazing fast in-memory', 'Versatile data structures', 'Simple API'],
    cons: ['Data size limited by RAM', 'Persistence trade-offs', 'License change controversy'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'Good',
  },

  /* ── AUTH ───────────────────────────────────────── */
  supabase: {
    learningCurve: 'Easy',
    ecosystemSize: 'Growing',
    bestFor: ['Firebase alternative', 'Full-stack apps', 'Auth + DB + Storage bundle', 'Startups'],
    pros: ['PostgreSQL-backed', 'Open source', 'Generous free tier'],
    cons: ['Fewer features than Firebase', 'Smaller community', 'Edge functions limited'],
    scalability: 'Startup to Mid',
    communityActivity: 'Very Active',
    maturity: 'Growing',
    typeScriptSupport: 'First-class',
  },
  firebase: {
    learningCurve: 'Easy',
    ecosystemSize: 'Massive',
    bestFor: ['Mobile apps', 'Real-time features', 'Rapid MVPs', 'Chat apps'],
    pros: ['Full BaaS suite', 'Real-time database', 'Google backing'],
    cons: ['Vendor lock-in', 'Costs can spike', 'NoSQL only'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  auth0: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Large',
    bestFor: ['Enterprise SSO', 'Multi-tenant SaaS', 'Compliance-heavy apps'],
    pros: ['Enterprise features (SAML, SCIM)', 'Great docs', 'Universal login'],
    cons: ['Expensive at scale', 'Complex pricing', 'Okta acquisition uncertainty'],
    scalability: 'Enterprise',
    communityActivity: 'Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  clerk: {
    learningCurve: 'Easy',
    ecosystemSize: 'Growing',
    bestFor: ['Next.js apps', 'Quick auth setup', 'Modern SaaS', 'User management'],
    pros: ['Beautiful pre-built UI', 'Next.js-first', 'Webhooks + roles OOB'],
    cons: ['Vendor lock-in', 'Pricey at scale', 'Less customizable UI'],
    scalability: 'Startup to Mid',
    communityActivity: 'Active',
    maturity: 'Growing',
    typeScriptSupport: 'First-class',
  },

  /* ── HOSTING ───────────────────────────────────── */
  vercel: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['Next.js deployment', 'Jamstack', 'Preview deployments', 'Frontend teams'],
    pros: ['Zero-config deploys', 'Edge network', 'Great DX'],
    cons: ['Expensive at scale', 'Serverless limits', 'Next.js-biased'],
    scalability: 'Startup to Mid',
    communityActivity: 'Very Active',
    maturity: 'Mature',
    typeScriptSupport: 'First-class',
  },
  aws: {
    learningCurve: 'Steep',
    ecosystemSize: 'Massive',
    bestFor: ['Enterprise infrastructure', 'Any workload', 'Compliance-heavy', 'Global scale'],
    pros: ['Most services of any cloud', 'Global reach', 'Battle-tested at any scale'],
    cons: ['Steep learning curve', 'Complex billing', 'Over-engineering risk'],
    scalability: 'Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
  railway: {
    learningCurve: 'Easy',
    ecosystemSize: 'Growing',
    bestFor: ['Backend deployment', 'Database hosting', 'Side projects', 'Startups'],
    pros: ['Instant deploy from Git', 'Built-in Postgres/Redis', 'Simple pricing'],
    cons: ['Less enterprise features', 'Smaller community', 'Limited regions'],
    scalability: 'Hobby to Mid',
    communityActivity: 'Active',
    maturity: 'Growing',
    typeScriptSupport: 'Good',
  },

  /* ── PAYMENTS ──────────────────────────────────── */
  stripe: {
    learningCurve: 'Moderate',
    ecosystemSize: 'Massive',
    bestFor: ['SaaS billing', 'E-commerce', 'Marketplaces', 'Subscriptions'],
    pros: ['Best-in-class API/docs', 'Huge feature set', 'Global coverage'],
    cons: ['Complex pricing tiers', 'Per-transaction fees', 'Dashboard can be overwhelming'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },

  /* ── MONITORING ────────────────────────────────── */
  sentry: {
    learningCurve: 'Easy',
    ecosystemSize: 'Large',
    bestFor: ['Error tracking', 'Performance monitoring', 'Release health', 'Debugging'],
    pros: ['Best error tracking UX', 'Source maps support', 'Free tier for small teams'],
    cons: ['Can be noisy', 'Costs grow with volume', 'Performance monitoring less mature'],
    scalability: 'Startup to Enterprise',
    communityActivity: 'Very Active',
    maturity: 'Battle-tested',
    typeScriptSupport: 'First-class',
  },
};

/**
 * Get comparison metadata for a tool, falling back to auto-derived data.
 * Never sends users to "read the docs" — this app IS the aggregation layer.
 */
export function getComparisonMeta(tool: { id: string; stars?: number; tags: string[]; description: string }): ComparisonMeta {
  if (COMPARISON_META[tool.id]) return COMPARISON_META[tool.id];

  // Auto-derive from available data
  const stars = tool.stars ?? 0;
  const desc = tool.description || '';

  // Build meaningful pros from real signals
  const derivedPros: string[] = [];
  if (stars >= 50000) derivedPros.push('Very large, proven community');
  else if (stars >= 10000) derivedPros.push('Strong community adoption');
  else if (stars >= 1000) derivedPros.push('Active open-source community');
  else derivedPros.push('Lightweight and focused');

  if (tool.tags.includes('TypeScript')) derivedPros.push('TypeScript support built-in');
  if (tool.tags.includes('open-source')) derivedPros.push('Fully open source');
  if (desc.toLowerCase().includes('free')) derivedPros.push('Free tier available');
  if (derivedPros.length < 2) derivedPros.push('Well-suited for modern web stacks');

  // Build meaningful cons from real signals
  const derivedCons: string[] = [];
  if (stars < 5000) derivedCons.push('Smaller community — fewer tutorials and examples');
  else if (stars < 20000) derivedCons.push('Moderate ecosystem size — may need workarounds');
  if (!tool.tags.includes('TypeScript')) derivedCons.push('No native TypeScript support');
  if (derivedCons.length === 0) derivedCons.push('Evaluate migration path before committing');
  if (derivedCons.length < 2) derivedCons.push('Fewer third-party integrations than top alternatives');

  return {
    learningCurve: 'Moderate',
    ecosystemSize: stars >= 100000 ? 'Massive' : stars >= 30000 ? 'Large' : stars >= 5000 ? 'Growing' : 'Emerging',
    bestFor: [desc.split(' — ')[0] || desc.slice(0, 60)],
    pros: derivedPros.slice(0, 3),
    cons: derivedCons.slice(0, 3),
    scalability: 'Startup to Mid',
    communityActivity: stars >= 50000 ? 'Very Active' : stars >= 10000 ? 'Active' : 'Moderate',
    maturity: stars >= 50000 ? 'Battle-tested' : stars >= 10000 ? 'Mature' : 'Growing',
    typeScriptSupport: tool.tags.includes('TypeScript') ? 'Native' : 'Good',
  };
}
