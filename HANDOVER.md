# Pylon — Developer Handover Document

> **Date**: March 25, 2026
> **Project**: Pylon (formerly TechStackEngine)
> **Repo**: `/Users/mahmoudalaaeldin/Documents/Projects/VibeCoding/Projects/TechStackEngine`

---

## 1. What Is Pylon?

An AI-powered developer tool that eliminates decision fatigue when choosing tech stacks. Users answer a guided questionnaire → AI generates a tailored stack recommendation → users can view, customize, compare tools, and export their stack. Has a Free tier (3 projects) and a Pro tier ($19/mo, unlimited).

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 15 (App Router) | Uses Turbopack dev (`next dev --turbopack`) |
| **React** | React 19 | |
| **Styling** | Tailwind CSS 4 | PostCSS-based, v4 config |
| **Animations** | framer-motion 12 | Used heavily on landing page + Stack Builder |
| **State** | Zustand 5 (`wizard-store.ts`, `compare-store.ts`) | |
| **Data Fetching** | TanStack React Query 5 | Hooks in `src/hooks/` |
| **Forms** | react-hook-form 7 + Zod 3 | Validations in `src/lib/validations/` |
| **Auth** | Supabase Auth (email + Google OAuth) | |
| **Database** | Supabase PostgreSQL | |
| **ORM** | Drizzle ORM 0.39 | Schema in `src/lib/db/schema/` |
| **AI** | Google Gemini (`@google/genai` 1.0) | API route at `src/app/api/ai/` |
| **Payments** | Stripe 17 (DEFERRED) | Lazy-loaded in `src/lib/stripe.ts` |
| **Email** | Resend | Not wired yet |
| **Icons** | Lucide React | |
| **Charts** | Recharts | |
| **DnD** | @dnd-kit/core + @dnd-kit/sortable | Stack Builder drag-drop |
| **Themes** | next-themes | Light/Dark mode |
| **Fonts** | Inter (UI), JetBrains Mono (code) | via next/font/google |
| **Package Manager** | pnpm | `pnpm-lock.yaml` present |

---

## 3. Project Structure

```
TechStackEngine/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing page (redesigned ✅)
│   │   ├── layout.tsx                        # Root layout (ThemeProvider + QueryProvider)
│   │   ├── globals.css                       # Global styles
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx                # Login (uses useAuth hook, Suspense-wrapped)
│   │   │   ├── register/page.tsx             # Register
│   │   │   └── forgot-password/page.tsx      # Password reset
│   │   ├── auth/callback/route.ts            # OAuth callback (exchanges code for session)
│   │   ├── (main)/
│   │   │   ├── dashboard/page.tsx            # Dashboard (USES MOCK DATA)
│   │   │   ├── wizard/page.tsx               # 7-step questionnaire (USES MOCK DATA for options)
│   │   │   ├── results/page.tsx              # AI results display (USES MOCK DATA)
│   │   │   ├── project/page.tsx              # Projects list
│   │   │   ├── project/[id]/page.tsx         # Project detail (USES MOCK DATA)
│   │   │   ├── catalog/page.tsx              # Tool catalog (USES MOCK DATA via tools-catalog)
│   │   │   ├── create/page.tsx               # Create project form
│   │   │   └── settings/page.tsx             # Settings (wired to Supabase auth ✅)
│   │   └── api/
│   │       ├── ai/                           # Gemini AI integration route
│   │       ├── categories/route.ts           # GET categories from DB
│   │       ├── payments/create-checkout/route.ts  # Stripe checkout (DEFERRED)
│   │       ├── profile/route.ts              # GET/PATCH user profile
│   │       ├── projects/route.ts             # GET/POST projects
│   │       ├── projects/[id]/route.ts        # GET/PATCH/DELETE single project
│   │       ├── projects/[id]/tools/route.ts  # PUT project tools (bulk upsert)
│   │       ├── questionnaire/route.ts        # POST questionnaire responses
│   │       ├── tools/route.ts                # GET tools from DB
│   │       ├── tools/[slug]/route.ts         # GET single tool
│   │       └── webhooks/stripe/route.ts      # Stripe webhook handler (DEFERRED)
│   ├── components/
│   │   ├── ui/              # Design system primitives (Button, Card, Input, Badge, etc.)
│   │   ├── layout/          # AppShell, ThemeProvider, sidebar
│   │   ├── builder/         # Stack visualization components
│   │   ├── stack-builder/   # Drag-and-drop stack builder
│   │   ├── catalog/         # Catalog page components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── wizard/          # Wizard step components
│   │   ├── shared/          # Shared components
│   │   └── providers/       # QueryProvider (React Query)
│   ├── hooks/
│   │   ├── useAuth.ts       # Auth hook (signIn, signUp, Google OAuth, signOut, reset) ✅
│   │   ├── use-projects.ts  # React Query hooks for project CRUD
│   │   └── use-categories.ts # React Query hook for categories
│   ├── stores/
│   │   ├── wizard-store.ts  # Zustand store for wizard state (7 steps)
│   │   └── compare-store.ts # Zustand store for tool comparison
│   ├── data/
│   │   └── tools-catalog.ts # 230+ tools catalog (86KB, comprehensive)
│   ├── lib/
│   │   ├── mock-data.ts     # Mock projects, re-exports tools-catalog (STILL USED by 4 pages)
│   │   ├── stripe.ts        # Lazy-loaded Stripe client
│   │   ├── utils.ts          # cn() helper for class merging
│   │   ├── ai/              # AI recommendation logic
│   │   ├── db/
│   │   │   ├── index.ts     # Drizzle client (postgres driver)
│   │   │   ├── seed.ts      # DB seeder script
│   │   │   └── schema/      # 8 schema files (see DB section below)
│   │   ├── supabase/
│   │   │   ├── client.ts    # Browser-side Supabase client
│   │   │   ├── server.ts    # Server-side Supabase client
│   │   │   └── middleware.ts # Session refresh + route protection
│   │   └── validations/     # Zod schemas for forms
│   ├── middleware.ts         # Next.js middleware → Supabase session management
│   └── types/               # TypeScript type definitions (empty dir)
├── supabase/                 # Supabase project config
├── drizzle/                  # Drizzle migration output
├── drizzle.config.ts         # Drizzle Kit config
├── 00-research/              # Product research docs
├── 01-docs/                  # PRD, App Flow, Tech Stack docs
├── 02-agent/                 # AI agent rules and skills
├── 03-workflows/             # Dev, deploy, testing workflows
├── 04-prompting/             # Prompting guide + lessons learned
└── 05-checklists/            # MVP launch + app store checklists
```

---

## 4. Database Schema (Drizzle ORM → Supabase PostgreSQL)

### Tables

| Table | File | Description |
|-------|------|-------------|
| `profiles` | `schema/profiles.ts` | User profiles. PK = `id` (FK → `auth.users.id`). Has `display_name`, `avatar_url`, `subscription_tier` (enum: free/pro/team), `stripe_customer_id`, `preferences` (JSONB) |
| `categories` | `schema/categories.ts` | Tool categories (Frontend, Backend, Database, etc.) |
| `tools` | `schema/tools.ts` | Individual tools/frameworks (230+ seeded) |
| `tool_pricing_tiers` | `schema/tools.ts` | Pricing tiers per tool (free, starter, pro, enterprise) |
| `projects` | `schema/projects.ts` | User projects. Has `user_id`, `name`, `description`, `project_type`, `status` (draft/active/archived), `stack_data` (JSONB), `total_monthly_cost`, `is_public`, `share_slug` |
| `project_tools` | `schema/project-tools.ts` | M2M: which tools are in which project, with `selected_tier_id`, `category_id` |
| `questionnaire_responses` | `schema/questionnaire.ts` | Wizard answers linked to a project |
| `ai_recommendations` | `schema/recommendations.ts` | AI-generated recommendations linked to a project |

### Enums
- `subscription_tier`: `'free' | 'pro' | 'team'`
- `pricing_model`: defined in `tools.ts`
- `learning_curve`: defined in `tools.ts`
- `maturity`: defined in `tools.ts`

### Relations (all defined in `schema/index.ts`)
- `categories` → has many `tools`
- `tools` → belongs to `category`, has many `pricingTiers`, has many `projectTools`
- `projects` → has many `projectTools`, has one `questionnaireResponse`, has one `aiRecommendation`
- `projectTools` → belongs to `project`, `tool`, `category`, `selectedTier`

### ⚠️ DB Status — NOT VERIFIED
The schema files exist and the Drizzle config points to Supabase, but:
- **RLS policies**: Unknown if configured. Need to audit in Supabase dashboard.
- **Auto-create profile trigger**: Not confirmed. `profiles` table should auto-create a row when a new `auth.users` row is created. Need a Supabase DB trigger/function.
- **Seed script**: Exists (`src/lib/db/seed.ts`) — seeds categories and tools.
- **Migration status**: Run `pnpm db:push` to push schema to Supabase. No versioned migrations seen in `drizzle/` yet.

---

## 5. Authentication — PARTIALLY DONE

### What's Implemented ✅
| Feature | Status | File(s) |
|---------|--------|---------|
| `useAuth` hook | ✅ Working | `src/hooks/useAuth.ts` — `signInWithEmail`, `signUpWithEmail`, `signInWithGoogle`, `resetPassword`, `signOut` |
| Supabase client (browser) | ✅ | `src/lib/supabase/client.ts` |
| Supabase client (server) | ✅ | `src/lib/supabase/server.ts` |
| Session middleware | ✅ | `src/lib/supabase/middleware.ts` — refreshes tokens, guards protected routes |
| Auth callback | ✅ | `src/app/auth/callback/route.ts` — exchanges OAuth code for session |
| Route protection | ✅ | Middleware redirects unauthenticated users on `/dashboard`, `/project`, `/wizard`, `/settings` to `/login` |
| Auth → Dashboard redirect | ✅ | Middleware redirects authenticated users away from `/login`, `/register`, `/forgot-password` |
| Login page | ✅ | `src/app/(auth)/login/page.tsx` — Suspense-wrapped |
| Register page | ✅ | `src/app/(auth)/register/page.tsx` |
| Forgot password page | ✅ | `src/app/(auth)/forgot-password/page.tsx` |
| Settings page | ✅ | Profile tab wired to Supabase (read + update), password change, delete account |

### What's NOT Verified ⚠️
| Feature | Status | Issue |
|---------|--------|-------|
| End-to-end login flow | ⚠️ Not tested | Requires Supabase project credentials in `.env.local` |
| Google OAuth | ⚠️ Not tested | Requires Google OAuth app configured in Supabase dashboard |
| Email verification | ⚠️ Unknown | Depends on Supabase email settings |
| Session expiry handling | ❌ Not implemented | No UI for "session expired, please log in again" |
| Password reset email | ⚠️ Not tested | Requires Resend/SMTP configured in Supabase |

---

## 6. What's DONE ✅

### Phase 1: UI/UX Polish
- All pages audited for overflow/clipping at mobile, tablet, desktop
- All buttons and links verified for correct redirect targets

### Phase 2: Settings Page
- Profile tab reads real user data from Supabase auth
- Save Changes updates the user profile
- Password change calls Supabase auth
- Theme toggle persists to localStorage
- Delete account with confirmation dialog

### Phase 3: Landing Page Redesign
- Complete redesign with premium aesthetic
- Hero section: animated gradient text, custom SVG underlines, parallax
- Stats bar with animated counters
- 6-feature Bento grid with hover-tilt effects
- 3-step "How It Works" section
- Pricing section (Free vs Pro tiers)
- Testimonials grid
- Full footer with social/legal links
- All using `framer-motion` entrance and scroll animations
- Mobile-responsive

### Additional Completed Work (from earlier sessions)
- Tool catalog (`src/data/tools-catalog.ts`): 230+ tools with descriptions, pricing, URLs, categories
- Stack Builder component (drag-and-drop with `@dnd-kit`)
- Wizard store (7-step state management with Zustand)
- Compare store (tool comparison state)
- UI component library: Button, Card, Input, Badge, Avatar, ProgressBar, Select, Skeleton, Spinner, Textarea, Toast, Toggle
- AppShell layout (sidebar + top bar for authenticated pages)
- All API routes created (categories, tools, projects, profile, questionnaire, AI)
- Drizzle schema defined for all 8 tables with relations
- `useAuth`, `use-projects`, `use-categories` hooks
- SEO metadata in root layout

---

## 7. What's REMAINING ❌

### Phase 4: Auth Flow — Verify End-to-End
**Priority: HIGH** — Must be working before anything else.

| Task | Details |
|------|---------|
| Test login (email) | Ensure signInWithPassword works with valid Supabase credentials |
| Test register | Ensure signUp creates user + profile row |
| Test Google OAuth | Requires Google provider configured in Supabase Auth dashboard |
| Test forgot password | Ensure resetPasswordForEmail sends email |
| Guard routes | Already in middleware — verify it actually redirects correctly |
| Session expiry | Add graceful handling (redirect to /login with message) |

### Phase 5: Pro Gating & Superuser Bypass
**Priority: HIGH** — Core business logic.

| Task | Details |
|------|---------|
| `useSubscription()` hook | **DOES NOT EXIST YET.** Must read user's `subscription_tier` from profiles table and provide `isPro`, `isFree`, `canCreateProject`, etc. |
| Tier limits enforcement | Free: max 3 projects, basic AI, compare 2 tools, no export. Pro: unlimited everything |
| Superuser bypass | Hardcode an email in env (e.g., `SUPERUSER_EMAIL`). If `user.email === env.SUPERUSER_EMAIL`, treat as Pro regardless of DB tier |
| Upgrade modal | Show blurred preview + lock icon + "Upgrade to Pro" CTA when Free users hit Pro features |
| Pro badges | Add subtle "Pro" labels next to gated features in UI |
| Settings > Subscription | Show plan, usage stats, upgrade CTA (for Free), manage billing link (for Pro) |

### Phase 6: Supabase DB — Finalize
**Priority: HIGH** — Required for real data flow.

| Task | Details |
|------|---------|
| Verify all tables exist | Run `pnpm db:push` against Supabase to push Drizzle schema |
| Profile auto-create trigger | Create a PostgreSQL trigger/function: `ON INSERT INTO auth.users → INSERT INTO profiles` |
| RLS policies | Must be set on ALL tables: projects (user can only see/edit own), profiles (user can only read/edit own), tools/categories (public read) |
| Seed catalog data | Run `pnpm db:seed` to populate categories + tools |
| Test full CRUD | Create project → add tools → view → edit → delete |
| Replace mock data imports | **4 pages still import from `mock-data.ts`**: catalog, wizard, results, project/[id]. Replace with API calls or direct imports from `tools-catalog.ts` |

### Deferred (NOT Now)
| Task | Details |
|------|---------|
| Stripe integration | Checkout, webhooks, subscription management. `stripe.ts` and API routes exist but non-functional without `STRIPE_SECRET_KEY` |
| Production deployment | Vercel deployment, custom domain, production env vars |
| Linting | Currently disabled (`--no-lint` in build). Re-enable after cleanup |
| Resend email | Transactional emails (welcome, password reset confirmation) |
| Sentry | Error tracking integration |
| PostHog | Analytics integration |

---

## 8. Environment Variables

### Required for Development
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key     # For server-side admin ops
DATABASE_URL=postgresql://postgres:[PASS]@db.[PROJECT].supabase.co:5432/postgres
GEMINI_API_KEY=your-gemini-api-key                  # For AI recommendations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional / Deferred
```
STRIPE_SECRET_KEY=sk_test_...          # Deferred
STRIPE_WEBHOOK_SECRET=whsec_...        # Deferred
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Deferred
RESEND_API_KEY=re_...                  # Not wired
NEXT_PUBLIC_SENTRY_DSN=...             # Not wired
NEXT_PUBLIC_POSTHOG_KEY=...            # Not wired
```

### Needed (to be added)
```
SUPERUSER_EMAIL=admin@example.com      # For pro gating bypass
```

---

## 9. Key Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build (currently uses --no-lint)
pnpm type-check   # tsc --noEmit
pnpm lint         # ESLint
pnpm test         # Vitest
pnpm test:e2e     # Playwright
pnpm db:push      # Push Drizzle schema to Supabase
pnpm db:seed      # Seed categories + tools
```

---

## 10. Known Issues & Gotchas

1. **Stripe build crash**: Fixed. `stripe.ts` uses lazy-loading proxy. But any code path that calls `getStripe()` without `STRIPE_SECRET_KEY` will throw at runtime.

2. **Login Suspense**: Fixed. Login page wraps content in `<Suspense>` for `useSearchParams()` compatibility with Next.js 15.

3. **Mock data still used**: `catalog/page.tsx`, `wizard/page.tsx`, `results/page.tsx`, and `project/[id]/page.tsx` import from `@/lib/mock-data`. This must be replaced with either:
   - Direct imports from `@/data/tools-catalog` (for tools/categories which are static)
   - API calls via React Query hooks (for projects which are user-specific)

4. **`mock-data.ts` structure**: It re-exports from `tools-catalog.ts` and adds mock `PROJECTS` array + wizard option constants (`PROJECT_TYPES`, `TEAM_SIZES`, etc.). The wizard options are constants, not mock data — they should be moved to a proper constants file.

5. **`types/` directory is empty**: TypeScript types are defined inline in schema files and mock-data. Consider consolidating.

6. **No `useSubscription` hook exists**: Must be created from scratch.

7. **No upgrade modal/overlay exists**: Must be designed and built.

8. **Build uses `--no-lint`**: ESLint is disabled in production builds. Re-enable after fixing lint errors.

9. **Supabase middleware gracefully skips auth** when env vars are missing (line 10-12 of `src/lib/supabase/middleware.ts`). This means the app works without Supabase but all routes are unprotected.

---

## 11. Recommended Execution Order

```
1. Phase 6 (Database) — Push schema, create trigger, set RLS, seed data
   ↓ without this, nothing else works with real data
2. Phase 4 (Auth) — Test all flows end-to-end with real Supabase
   ↓ without this, can't identify users for pro gating
3. Phase 5 (Pro Gating) — Create hook, enforce limits, build upgrade UI
   ↓ this is the business logic layer
4. Replace mock data — Swap 4 pages to use real API/catalog imports
5. Deferred items — Stripe, deployment, analytics, etc.
```

---

## 12. Design Context

A comprehensive Stitch Design Brief has been created to guide the UI redesign of all 12 screens. It lives at:
- **Artifacts**: `stitch_design_brief.md` in the brain directory
- **User's copy**: `~/Downloads/Pylon_Stitch_Design_Brief.md`

The brief covers design inspiration (Linear, Stripe, Vercel, Mercury, Ramp, Raycast, Notion, Arc), color system, typography, every screen in detail, user journeys, and pro gating UX. The user may be running this through Stitch separately, so the next developer should not redesign screens unless asked — focus on functionality.

---

## 13. File Quick Reference

| Need to... | Look at... |
|------------|-----------|
| Understand auth flow | `src/hooks/useAuth.ts` + `src/lib/supabase/middleware.ts` |
| Understand DB schema | `src/lib/db/schema/index.ts` (re-exports all + defines relations) |
| See what pages exist | `src/app/(main)/*/page.tsx` + `src/app/(auth)/*/page.tsx` |
| See API routes | `src/app/api/*/route.ts` |
| Understand wizard state | `src/stores/wizard-store.ts` |
| See all 230+ tools | `src/data/tools-catalog.ts` |
| Understand mock data | `src/lib/mock-data.ts` (re-exports tools-catalog + adds mock projects) |
| See UI components | `src/components/ui/` (14 files) |
| See design brief | `stitch_design_brief.md` in artifacts |
| See env vars needed | `.env.example` at project root |
