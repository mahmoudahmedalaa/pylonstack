/**
 * Tool Compatibility Graph — Epic 2: Knowledge Graph Rule Engine
 *
 * Encodes real-world tool compatibility constraints in TypeScript code.
 * This is the single source of truth for "what works with what."
 *
 * Philosophy: Code > Prompting. Never rely on the AI to know these rules.
 *
 * Graph structure:
 *   - incompatibleWith: tools that fundamentally conflict (different paradigms, vendor lock-in conflicts)
 *   - compatibleWith: explicitly known good pairings (used for prompt injection hints)
 *   - requiresOneOf: tool requires at least one of these to be in the stack to make sense
 *   - category: enumerated category for cross-checking
 */

export type ToolGraphEntry = {
  /** Tools that should never be recommended alongside this one */
  incompatibleWith?: string[];
  /** Tools that pair especially well with this */
  compatibleWith?: string[];
  /** Stack must include at least one of these for this tool to make sense */
  requiresOneOf?: string[];
  /** Primary category classification */
  category: string;
};

export const TOOL_COMPATIBILITY_GRAPH: Record<string, ToolGraphEntry> = {
  // ── Frontend Frameworks ─────────────────────────
  'next.js': {
    category: 'Frontend',
    compatibleWith: ['vercel', 'supabase', 'clerk', 'prisma', 'tailwind css'],
    incompatibleWith: ['nuxt', 'remix'], // Don't recommend two full-stack React meta-frameworks
  },
  'remix': {
    category: 'Frontend',
    incompatibleWith: ['next.js', 'nuxt'],
  },
  'nuxt': {
    category: 'Frontend',
    incompatibleWith: ['next.js', 'remix'],
  },
  'react': {
    category: 'Frontend',
    compatibleWith: ['vite', 'tailwind css', 'react query', 'zustand'],
  },
  'sveltekit': {
    category: 'Frontend',
    incompatibleWith: ['next.js', 'nuxt', 'remix'],
  },
  'angular': {
    category: 'Frontend',
    incompatibleWith: ['next.js', 'nuxt', 'remix', 'sveltekit'],
  },

  // ── Mobile Frameworks ───────────────────────────
  'react native': {
    category: 'Mobile',
    compatibleWith: ['expo', 'supabase', 'firebase', 'clerk'],
    incompatibleWith: ['flutter', 'ionic'],
  },
  'expo': {
    category: 'Mobile',
    compatibleWith: ['react native'],
    requiresOneOf: ['react native'],
    incompatibleWith: ['flutter'],
  },
  'flutter': {
    category: 'Mobile',
    incompatibleWith: ['react native', 'expo', 'ionic'],
  },
  'ionic': {
    category: 'Mobile',
    incompatibleWith: ['flutter', 'react native'],
  },

  // ── Backend / API ───────────────────────────────
  'node.js (express)': {
    category: 'Backend',
    compatibleWith: ['postgresql', 'mongodb', 'prisma', 'supabase'],
    incompatibleWith: ['django', 'rails', 'laravel'],
  },
  'fastapi': {
    category: 'Backend',
    compatibleWith: ['postgresql', 'supabase'],
    incompatibleWith: ['node.js (express)', 'fastify', 'nestjs', 'django', 'rails'],
  },
  'django': {
    category: 'Backend',
    compatibleWith: ['postgresql'],
    incompatibleWith: ['node.js (express)', 'fastapi', 'nestjs', 'fastify', 'rails', 'laravel'],
  },
  'rails': {
    category: 'Backend',
    incompatibleWith: ['node.js (express)', 'fastapi', 'django', 'laravel', 'nestjs'],
  },
  'laravel': {
    category: 'Backend',
    incompatibleWith: ['node.js (express)', 'fastapi', 'django', 'rails', 'nestjs'],
  },
  'nestjs': {
    category: 'Backend',
    compatibleWith: ['postgresql', 'prisma', 'mongodb'],
    incompatibleWith: ['django', 'rails', 'laravel', 'fastapi'],
  },
  'fastify': {
    category: 'Backend',
    incompatibleWith: ['django', 'rails', 'laravel', 'fastapi'],
  },

  // ── Databases ───────────────────────────────────
  'supabase': {
    category: 'Database',
    compatibleWith: ['next.js', 'react native', 'expo', 'vercel'],
    incompatibleWith: ['firebase', 'planetscale', 'neon'], // Don't recommend two BaaS/managed Postgres
  },
  'firebase': {
    category: 'Database',
    compatibleWith: ['react native', 'expo', 'flutter'],
    incompatibleWith: ['supabase', 'planetscale', 'neon'],
  },
  'planetscale': {
    category: 'Database',
    compatibleWith: ['prisma', 'next.js'],
    incompatibleWith: ['supabase', 'firebase', 'neon', 'mongodb'],
  },
  'neon': {
    category: 'Database',
    compatibleWith: ['prisma', 'next.js', 'vercel'],
    incompatibleWith: ['supabase', 'firebase', 'planetscale'],
  },
  'mongodb': {
    category: 'Database',
    incompatibleWith: ['planetscale', 'supabase', 'neon'],
  },
  'postgresql': {
    category: 'Database',
    compatibleWith: ['prisma', 'supabase', 'neon', 'node.js (express)', 'nestjs', 'django'],
  },

  // ── ORM / Query Tools ───────────────────────────
  'prisma': {
    category: 'ORM',
    compatibleWith: ['postgresql', 'planetscale', 'neon', 'next.js', 'nestjs'],
    incompatibleWith: ['firebase', 'mongodb'], // Prisma works with relational DBs only (MongoDB support is experimental)
    requiresOneOf: ['postgresql', 'planetscale', 'neon', 'sqlite'],
  },

  // ── Auth ────────────────────────────────────────
  'clerk': {
    category: 'Auth',
    compatibleWith: ['next.js', 'react', 'react native'],
    incompatibleWith: ['supabase auth', 'auth0', 'nextauth.js'], // Don't use two auth solutions
  },
  'auth0': {
    category: 'Auth',
    incompatibleWith: ['clerk', 'supabase auth', 'nextauth.js'],
  },
  'nextauth.js': {
    category: 'Auth',
    compatibleWith: ['next.js'],
    requiresOneOf: ['next.js'],
    incompatibleWith: ['clerk', 'auth0', 'supabase auth'],
  },
  'supabase auth': {
    category: 'Auth',
    requiresOneOf: ['supabase'],
    incompatibleWith: ['clerk', 'auth0', 'nextauth.js'],
  },

  // ── Hosting ─────────────────────────────────────
  'vercel': {
    category: 'Hosting',
    compatibleWith: ['next.js', 'react', 'tailwind css', 'neon', 'supabase'],
    incompatibleWith: ['netlify', 'railway', 'render', 'fly.io', 'aws amplify'], // Don't dual-host
  },
  'netlify': {
    category: 'Hosting',
    incompatibleWith: ['vercel', 'railway', 'render', 'fly.io'],
  },
  'railway': {
    category: 'Hosting',
    incompatibleWith: ['vercel', 'netlify', 'render', 'fly.io'],
  },
  'render': {
    category: 'Hosting',
    incompatibleWith: ['vercel', 'netlify', 'railway', 'fly.io'],
  },
  'fly.io': {
    category: 'Hosting',
    incompatibleWith: ['vercel', 'netlify', 'railway', 'render'],
  },

  // ── Payments ────────────────────────────────────
  'stripe': {
    category: 'Payments',
    incompatibleWith: ['lemon squeezy', 'paddle'], // Don't use two payment processors
  },
  'lemon squeezy': {
    category: 'Payments',
    incompatibleWith: ['stripe', 'paddle'],
  },
  'paddle': {
    category: 'Payments',
    incompatibleWith: ['stripe', 'lemon squeezy'],
  },

  // ── CSS / UI ─────────────────────────────────────
  'tailwind css': {
    category: 'Styling',
    compatibleWith: ['next.js', 'react', 'sveltekit'],
    incompatibleWith: ['bootstrap', 'bulma'], // Utility-first vs component-based CSS conflicts
  },
  'bootstrap': {
    category: 'Styling',
    incompatibleWith: ['tailwind css'],
  },

  // ── State Management ─────────────────────────────
  'redux toolkit': {
    category: 'State',
    incompatibleWith: ['zustand', 'jotai', 'recoil'], // Don't recommend two global state solutions
  },
  'zustand': {
    category: 'State',
    incompatibleWith: ['redux toolkit', 'jotai', 'recoil'],
  },
  'jotai': {
    category: 'State',
    incompatibleWith: ['redux toolkit', 'zustand', 'recoil'],
  },
};

/**
 * Build a "Rules for this stack" context block by checking user answers
 * against the graph. Injected into the AI prompt to pre-constrain selections.
 */
export function buildCompatibilityContext(toolNamesHint?: string[]): string {
  if (!toolNamesHint || toolNamesHint.length === 0) return '';

  const relevantConflicts: string[] = [];

  for (const name of toolNamesHint) {
    const entry = TOOL_COMPATIBILITY_GRAPH[name.toLowerCase()];
    if (entry?.incompatibleWith?.length) {
      relevantConflicts.push(
        `- Do NOT combine ${name} with: ${entry.incompatibleWith.join(', ')}`
      );
    }
    if (entry?.requiresOneOf?.length) {
      relevantConflicts.push(
        `- ${name} requires at least one of: ${entry.requiresOneOf.join(', ')}`
      );
    }
  }

  if (relevantConflicts.length === 0) return '';

  return `\nCOMPATIBILITY CONSTRAINTS (strictly enforced):\n${relevantConflicts.join('\n')}`;
}
