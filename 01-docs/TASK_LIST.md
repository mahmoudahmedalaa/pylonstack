# Task List — Tech Stack Engine MVP

> Decomposed from `IMPLEMENTATION_PLAN.md`. Each task is self-contained with context, files, and verification.
> **Rule: One task per conversation — fresh AI context = max quality.**

---

## Phase 1: Foundation

### Task 1 — Next.js Project Initialization
**Duration**: 30 min  
**Read**: `TECH_STACK.md` (§2, §4, §6), `FRONTEND_GUIDELINES.md` (§2 fonts)  
**Create**:
- Initialize Next.js 15.3 with App Router: `npx create-next-app@15.3 ./ --app --ts --tailwind --eslint --src-dir --import-alias "@/*"`
- Switch to pnpm (`corepack enable && corepack prepare pnpm@latest --activate`)
- Create folder structure under `src/`:
  ```
  app/(auth)/, app/(main)/, app/api/
  components/ui/, components/layout/, components/wizard/, components/builder/, components/catalog/, components/shared/
  lib/db/, lib/supabase/, lib/ai/, lib/stripe/, lib/validations/, lib/utils/
  hooks/, stores/, types/, config/
  ```
- Add `.gitignore` entries for `.env.local`, `.env*.local`

**Success**: `pnpm dev` starts at localhost:3000, `pnpm lint` passes, `tsc --noEmit` passes  
**Verify**: `pnpm dev --port 3000` → see default Next.js page; `pnpm lint && tsc --noEmit` exit 0

---

### Task 2 — Install All Dependencies
**Duration**: 20 min  
**Read**: `TECH_STACK.md` (§6 Dependencies Lock — exact versions)  
**Modify**: `package.json`  
**Install**:
- **Core**: `next@15.3.0 react@19.1.0 react-dom@19.1.0 typescript@5.7.3`
- **Frontend**: `tailwindcss@4.0.0 @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 framer-motion@12.0.0 lucide-react@0.480.0 @tanstack/react-query@5.68.0 react-hook-form@7.54.0 zod@3.24.0 zustand@5.0.0 recharts@2.15.0 next-themes`
- **Backend**: `@supabase/supabase-js@2.49.0 @supabase/ssr drizzle-orm@0.39.0 drizzle-kit@0.30.0 @google/genai@1.0.0 stripe@17.5.0 resend@4.1.0 postgres`
- **Dev**: `eslint@9.18.0 prettier@3.5.0 husky@9.1.0 lint-staged@15.4.0 vitest@3.0.0 @playwright/test@1.50.0 @sentry/nextjs@9.0.0 posthog-js@1.210.0`

**Success**: `pnpm install` completes without errors, `pnpm dev` still works  
**Verify**: `pnpm install && pnpm dev` starts cleanly

---

### Task 3 — Dev Tooling Configuration
**Duration**: 30 min  
**Read**: `TECH_STACK.md` (§4 Development Tools)  
**Create/Modify**:
- `eslint.config.mjs` — ESLint 9 flat config for Next.js + TypeScript
- `.prettierrc` — Prettier config (singleQuote, semi, printWidth: 100, trailingComma: all)
- `.husky/pre-commit` — runs `lint-staged`
- `.lintstagedrc.json` — lint + format + type-check staged files
- `vitest.config.ts` — Vitest setup with `@/` path aliases
- `playwright.config.ts` — Playwright setup (Chrome + Firefox)

**Success**: `pnpm lint`, `prettier --check .`, `tsc --noEmit` all pass. Husky hook fires on commit.  
**Verify**: Make a test commit — verify lint-staged runs. Run `pnpm test` with empty test suite (should pass with 0 tests).

---

### Task 4 — Environment & Services Setup
**Duration**: 20 min  
**Read**: `TECH_STACK.md` (§5 Environment Variables), `SUPABASE_NEXTJS.md` skill  
**Create**:
- `.env.example` from `TECH_STACK.md` env template (no real secrets)
- `.env.local` — copy of `.env.example` (user fills in real values)
- `src/lib/supabase/client.ts` — browser client using `createBrowserClient` from `@supabase/ssr`
- `src/lib/supabase/server.ts` — server client using `createServerClient` with `getAll`/`setAll` pattern
- `src/lib/supabase/middleware.ts` — middleware proxy for token refresh

**Success**: Supabase clients export correctly, TypeScript compiles, no deprecated `auth-helpers` imports  
**Verify**: `tsc --noEmit` passes; grep for `auth-helpers` returns 0 results

---

### Task 5 — Database Schema (Drizzle)
**Duration**: 60 min  
**Read**: `BACKEND_STRUCTURE.md` (§2 full schema), `DRIZZLE_ORM.md` skill  
**Create**:
- `drizzle.config.ts` — Drizzle Kit config pointing to Supabase
- `src/lib/db/index.ts` — Drizzle client with connection pooling
- `src/lib/db/schema/profiles.ts` — profiles table
- `src/lib/db/schema/categories.ts` — categories table
- `src/lib/db/schema/tools.ts` — tools table + tool_pricing_tiers
- `src/lib/db/schema/projects.ts` — projects + project_tools tables
- `src/lib/db/schema/questionnaire.ts` — questionnaire_responses table
- `src/lib/db/schema/recommendations.ts` — ai_recommendations table
- `src/lib/db/schema/index.ts` — barrel export of all schemas + relations
- All tables with exact column types, constraints, indexes per `BACKEND_STRUCTURE.md`
- All relations defined per entity relationship diagram

**Success**: `tsc --noEmit` passes; `drizzle-kit generate` produces valid migration SQL  
**Verify**: `tsc --noEmit && npx drizzle-kit generate` — review generated SQL matches schema spec

---

### Task 6 — Database Push & RLS Policies
**Duration**: 40 min  
**Read**: `BACKEND_STRUCTURE.md` (§2 RLS notes per table), `SUPABASE_NEXTJS.md` skill (§2 RLS)  
**Execute**:
- Run `drizzle-kit push` to apply schema to Supabase
- Create SQL migration for RLS policies on all 8 tables:
  - `profiles`: users read/update own only
  - `categories`: public read, no write (admin via service role)
  - `tools`: public read, no write
  - `tool_pricing_tiers`: public read, no write
  - `projects`: users CRUD own; public read if `is_public = TRUE`
  - `project_tools`: inherits from project ownership
  - `questionnaire_responses`: user-owned only
  - `ai_recommendations`: user-owned only
- Create `updated_at` trigger function for all tables with `updated_at`
- Apply via Supabase MCP or direct SQL

**Success**: All tables exist in Supabase, RLS enabled on all, policies applied  
**Verify**: Use Supabase MCP `execute_sql` to query tables; verify RLS blocks unauthorized access

---

### Task 7 — Seed Data
**Duration**: 30 min  
**Read**: `BACKEND_STRUCTURE.md` (§2 categories seed, tool examples)  
**Create**:
- `src/lib/db/seed.ts` — seed script
- Seed 10 categories: Frontend Framework, Backend/Runtime, Database, Authentication, Hosting/Deployment, CI/CD, Monitoring/Observability, Payments, Email/Notifications, Storage/CDN
- Seed 25-30 tools (top 3 per category): React/Next.js/Vue, Node/Django/Rails, PostgreSQL/MongoDB/MySQL, Supabase Auth/Clerk/Auth0, Vercel/Netlify/AWS, GitHub Actions/CircleCI, Sentry/Datadog, Stripe/Paddle/LemonSqueezy, Resend/SendGrid, Supabase Storage/Cloudflare R2/AWS S3
- Seed tool_pricing_tiers for each tool (Free + Pro tiers minimum)

**Success**: All seed data queryable via Supabase  
**Verify**: `SELECT count(*) FROM categories` = 10; `SELECT count(*) FROM tools` ≥ 25; each tool has ≥ 1 pricing tier

---

## Phase 2: Design System

### Task 8 — Design Tokens & Theme Setup
**Duration**: 60 min  
**Read**: `FRONTEND_GUIDELINES.md` (§2 tokens, §7 theme), `NEXTJS_TAILWIND_SHADCN.md` skill (Tailwind v4)  
**Create/Modify**:
- `src/app/globals.css` — Tailwind v4 with `@theme` block containing all design tokens:
  - Primary colors (Electric Indigo 50–900)
  - Accent colors (Emerald 400–600)
  - Neutral colors (Slate 50–950 including 850)
  - Semantic colors (success, warning, error, info)
  - Typography scale, spacing scale, radius scale, shadows
  - CSS custom properties for dark/light mode
- `src/app/layout.tsx` — root layout with Inter + JetBrains Mono via `next/font`, `ThemeProvider` wrapping
- Install + configure `next-themes` with default dark mode
- `src/components/layout/ThemeToggle.tsx` — dark/light mode toggle component

**Success**: App renders in dark mode by default, toggle switches themes, all tokens available  
**Verify**: `pnpm dev` → page renders dark. Toggle theme → light mode. Inspect CSS custom properties in devtools.

---

### Task 9 — shadcn/ui Setup & Core Components
**Duration**: 60 min  
**Read**: `FRONTEND_GUIDELINES.md` (§3 component specs), `NEXTJS_TAILWIND_SHADCN.md` skill (shadcn/ui)  
**Execute**:
- `npx shadcn@latest init` — configure for dark mode + custom CSS variables
- Install shadcn components: `button input card dialog dropdown-menu badge tabs toast skeleton tooltip avatar select slider separator sheet`
- Customize component styles to match design tokens (primary-500 brand color, radius-lg cards, etc.)
- Create `src/lib/utils.ts` with `cn()` utility

**Success**: All shadcn components render correctly in dark/light mode  
**Verify**: Create a temporary test page with all components rendered → confirm visual consistency

---

### Task 10 — Custom Domain Components
**Duration**: 90 min  
**Read**: `FRONTEND_GUIDELINES.md` (§3 full component specs), `PRD.md` (features)  
**Create**:
- `src/components/shared/ToolCard.tsx` — 3 variants: catalog, sidebar, draggable. Shows logo, name, category badge, pricing pill. Hover glow effect.
- `src/components/shared/StackSlot.tsx` — empty (dashed border) + filled states. Drop target visual feedback. Swap/remove on hover.
- `src/components/shared/CategoryBadge.tsx` — colored pill per category
- `src/components/shared/CostDisplay.tsx` — formatted price with currency symbol
- `src/components/wizard/WizardStepCard.tsx` — selectable option card with check icon on select
- `src/components/shared/ProgressBar.tsx` — wizard step indicator with active/completed/upcoming states
- `src/types/index.ts` — TypeScript interfaces for Tool, Category, Project, ToolPricingTier, etc.

**Success**: All components render in every state (default, hover, focus, disabled, loading, selected, empty, filled)  
**Verify**: `tsc --noEmit` passes; visual inspection of components in browser

---

## Phase 3: Authentication

### Task 11 — Auth Backend Setup
**Duration**: 60 min  
**Read**: `BACKEND_STRUCTURE.md` (§3 Auth endpoints, §4 Auth & Authorization), `SUPABASE_NEXTJS.md` skill (§1 Auth SSR), `APP_FLOW.md` (Flow 4)  
**Create**:
- Configure Supabase Auth: enable email/password + Google OAuth in Supabase dashboard
- Database trigger: auto-create `profiles` row on `auth.users` insert
- `src/middleware.ts` — Next.js middleware using Supabase token refresh proxy, protects `/dashboard`, `/project/*`, `/wizard`, `/settings`
- `src/app/api/profile/route.ts` — GET (fetch own profile) + PATCH (update display_name, avatar_url, preferences)
- `src/lib/validations/profile.ts` — Zod schemas for profile updates
- `src/app/auth/callback/route.ts` — OAuth callback handler

**Success**: Middleware redirects unauthenticated users, profile API works, OAuth callback processes correctly  
**Verify**: `tsc --noEmit` passes; test via curl: unauthenticated GET `/api/profile` returns 401; authenticated returns profile

---

### Task 12 — Auth Frontend Pages
**Duration**: 90 min  
**Read**: `APP_FLOW.md` (Flow 4, Login/Register screens), `FRONTEND_GUIDELINES.md` (inputs, buttons)  
**Create**:
- `src/app/(auth)/login/page.tsx` — email + password form + Google OAuth button + "Forgot password?" link
- `src/app/(auth)/register/page.tsx` — registration form + Google OAuth + "Already have account?" link
- `src/app/(auth)/forgot-password/page.tsx` — email input + reset request
- `src/app/(auth)/layout.tsx` — centered card layout for auth pages
- `src/components/layout/Navbar.tsx` — top nav with logo, nav links, avatar dropdown (authenticated) / login button (anonymous)
- `src/app/(main)/layout.tsx` — main app layout with navbar
- `src/hooks/useAuth.ts` — client-side auth state hook

**Success**: Full auth flow works: register → verify → login → dashboard. OAuth creates profile. Redirects work. Navbar updates on auth state.  
**Verify**: Browser test: register new user → redirected to dashboard; login with Google → profile created; logout → redirected to login

---

## Phase 4: Core Features

### Task 13 — Tool Catalog API
**Duration**: 60 min  
**Read**: `BACKEND_STRUCTURE.md` (§3 Tool Catalog endpoints, Categories endpoint), `DRIZZLE_ORM.md` skill  
**Create**:
- `src/app/api/tools/route.ts` — GET with search, category filter, has_free_tier, pricing_model, pagination (page/limit). Uses Drizzle ilike for search, ISR revalidate 1hr.
- `src/app/api/tools/[slug]/route.ts` — GET single tool with pricing_tiers and category. ISR 1hr.
- `src/app/api/tools/compare/route.ts` — GET with `slugs` query param (2-3 comma-separated), returns full tool data for comparison
- `src/app/api/categories/route.ts` — GET all categories with tool_count. ISR 24hr.
- `src/lib/validations/tools.ts` — Zod schemas for query params

**Success**: All endpoints return correct data with proper filtering, pagination, and caching headers  
**Verify**: `tsc --noEmit`; curl tests: `GET /api/tools?category=frontend-framework&page=1&limit=10`, `GET /api/tools/nextjs`, `GET /api/tools/compare?slugs=react,vue,nextjs`, `GET /api/categories`

---

### Task 14 — Tool Catalog UI
**Duration**: 90 min  
**Read**: `APP_FLOW.md` (Catalog screen spec), `FRONTEND_GUIDELINES.md` (tool cards, inputs)  
**Create**:
- `src/app/(main)/catalog/page.tsx` — catalog page with category pills, search bar, tool card grid, pagination
- `src/app/(main)/catalog/tool/[slug]/page.tsx` — tool detail page with full info + pricing tiers
- `src/components/catalog/ToolGrid.tsx` — responsive grid layout for tool cards
- `src/components/catalog/CategoryFilter.tsx` — horizontal scrollable pill buttons
- `src/components/catalog/ToolSearch.tsx` — search input with debounce
- `src/hooks/useTools.ts` — TanStack Query hook for tool fetching with filters
- `src/hooks/useCategories.ts` — TanStack Query hook for categories

**Success**: Can browse tools by category, search by name, view tool details. All states handled (loading skeleton, empty, error).  
**Verify**: Browser: navigate to `/catalog`, filter by category, search for tool, click into detail page. Test empty search results.

---

### Task 15 — Tool Comparison
**Duration**: 60 min  
**Read**: `APP_FLOW.md` (Compare Tools Overlay), `FRONTEND_GUIDELINES.md` (modals)  
**Create**:
- `src/components/catalog/CompareCheckbox.tsx` — "Compare" checkbox on tool cards
- `src/components/catalog/CompareFloatingButton.tsx` — floating button appears when 2+ selected
- `src/components/catalog/CompareOverlay.tsx` — modal with 2-3 column comparison: logo, pricing, free tier, GitHub stars, learning curve, pros, cons, best_for. "Add to Stack" button.
- `src/stores/compareStore.ts` — Zustand store for selected comparison tools (max 3)

**Success**: Can select 2-3 tools, open comparison overlay, see side-by-side data  
**Verify**: Browser: select 3 tools in catalog → click Compare → overlay shows. Verify data accuracy.

---

### Task 16 — Stack Wizard (Questionnaire)
**Duration**: 90 min  
**Read**: `APP_FLOW.md` (Wizard screen, 6 steps), `PRD.md` (Feature 1 acceptance criteria)  
**Create**:
- `src/stores/wizardStore.ts` — Zustand store for wizard state (current step, all answers, navigation)
- `src/app/(main)/wizard/page.tsx` — wizard shell with progress indicator redirect to step 1
- `src/app/(main)/wizard/[step]/page.tsx` — dynamic route for each step
- `src/components/wizard/WizardShell.tsx` — layout with progress bar, back/next navigation
- `src/components/wizard/steps/ProjectTypeStep.tsx` — card select (6 options)
- `src/components/wizard/steps/UseCaseStep.tsx` — card select (8 options including "Other")
- `src/components/wizard/steps/TeamStep.tsx` — form with team size + timeline selects
- `src/components/wizard/steps/BudgetStep.tsx` — slider + budget range cards
- `src/components/wizard/steps/PreferencesStep.tsx` — multi-select checkboxes (6 preference options)
- `src/components/wizard/steps/ReviewStep.tsx` — summary of all answers with edit capability + "Generate Stack" CTA
- `src/app/api/questionnaire/route.ts` — POST to save questionnaire responses
- `src/lib/validations/questionnaire.ts` — Zod schema for wizard responses

**Success**: Can complete full 6-step wizard, navigate back/forward, edit answers, data persists in store and saves to DB  
**Verify**: Browser: navigate through all 6 steps → review shows correct answers → submit saves to database

---

### Task 17 — AI Recommendation Engine
**Duration**: 120 min  
**Read**: `BACKEND_STRUCTURE.md` (§3 AI endpoint), `APP_FLOW.md` (AI states), `PRD.md` (Feature 2)  
**Create**:
- `src/lib/ai/gemini.ts` — Gemini API client initialization
- `src/lib/ai/prompts.ts` — system prompt for stack recommendations (structured JSON output schema matching tool database)
- `src/lib/ai/parse.ts` — parse + validate AI response against Zod schema, match tool slugs to DB
- `src/app/api/ai/recommend/route.ts` — POST endpoint: validate questionnaire → call Gemini → parse → save recommendation → auto-populate project_tools → return
- `src/lib/validations/ai.ts` — Zod schemas for AI request/response
- Rate limiting: in-memory counter (10/min Pro, 3 total free)
- `src/components/wizard/GeneratingState.tsx` — loading UI with pulsing skeleton + rotating status messages ("Analyzing requirements…", "Assembling stack…", "Calculating costs…")
- `src/components/shared/RecommendationCard.tsx` — tool card variant with AI confidence score + reasoning text

**Success**: Wizard submit → AI generates structured recommendations → project created with tools populated → redirects to stack builder  
**Verify**: Browser: complete wizard → submit → see loading state → see populated stack builder. Test rate limit (hit 3 free limit). Test API failure handling.

---

### Task 18 — Projects CRUD API
**Duration**: 40 min  
**Read**: `BACKEND_STRUCTURE.md` (§3 Projects endpoints)  
**Create**:
- `src/app/api/projects/route.ts` — GET (list user's projects) + POST (create new project)
- `src/app/api/projects/[id]/route.ts` — GET (single project with tools) + PATCH (update) + DELETE
- `src/app/api/projects/[id]/tools/route.ts` — PUT (add/swap tool in category slot) + recalculate cost
- `src/app/api/projects/[id]/tools/[toolId]/route.ts` — DELETE (remove tool from project) + recalculate cost
- `src/lib/validations/projects.ts` — Zod schemas for project operations

**Success**: Full CRUD works, cost recalculation on tool changes, RLS enforced  
**Verify**: `tsc --noEmit`; curl: create project, add tool, verify cost updates, delete tool, delete project

---

### Task 19 — Stack Builder UI
**Duration**: 150 min  
**Read**: `APP_FLOW.md` (Stack Builder screen), `FRONTEND_GUIDELINES.md` (stack slots, cost bar, animations), `PRD.md` (Feature 4)  
**Create**:
- `src/stores/builderStore.ts` — Zustand store for builder state (tools in slots, drag state, cost)
- `src/app/(main)/project/[id]/page.tsx` — stack builder page
- `src/components/builder/StackGrid.tsx` — 10-slot category grid (2 columns desktop, 1 column mobile)
- `src/components/builder/ToolSidebar.tsx` — tool sidebar panel with search + category filter
- `src/components/builder/DragDropProvider.tsx` — dnd-kit context provider + sensors
- `src/components/builder/DraggableToolCard.tsx` — draggable sidebar tool card
- `src/components/builder/DroppableSlot.tsx` — droppable category slot with visual feedback
- `src/components/builder/CostSummaryBar.tsx` — sticky bottom bar with animated total cost + category breakdown
- `src/components/builder/AISuggestionBar.tsx` — contextual tip banner
- `src/hooks/useProject.ts` — TanStack Query hook for project data
- Mobile: tap-to-select fallback (no drag on <768px)

**Success**: Can drag tools from sidebar into category slots, see live cost updates, save persists, reload preserves state  
**Verify**: Browser: open project → drag tool into slot → cost updates → refresh → state preserved. Test mobile (resize). Test swap/remove.

---

### Task 20 — User Dashboard
**Duration**: 60 min  
**Read**: `APP_FLOW.md` (Dashboard screen), `PRD.md` (Feature 5)  
**Create**:
- `src/app/(main)/dashboard/page.tsx` — dashboard page with project cards + "New Project" CTA
- `src/components/dashboard/ProjectCard.tsx` — card showing name, tool count, cost, last edited
- `src/components/dashboard/ProjectMenu.tsx` — dropdown with Rename, Duplicate, Delete actions
- `src/components/dashboard/EmptyDashboard.tsx` — empty state with CTA
- Connect "New Project" → `/wizard`
- Connect project card click → `/project/:id`

**Success**: Shows all user projects, can create new, rename, delete. Empty state shows for new users.  
**Verify**: Browser: login → see dashboard → create project → see card appear → rename → delete

---

## Phase 5: Landing Page & Polish

### Task 21 — Landing Page
**Duration**: 120 min  
**Read**: `APP_FLOW.md` (Landing Page screen), `FRONTEND_GUIDELINES.md` (animations, responsive)  
**Create**:
- `src/app/page.tsx` — landing page with:
  - Hero section with animated gradient background, headline "Stop Researching. Start Building.", subtext, "Build Your Stack" CTA
  - 3-column feature grid (AI Recommendations, Visual Builder, Phased Roadmaps)
  - "How It Works" 3-step section (Answer Questions → Get AI Stack → Build & Ship)
  - Tool grid preview (showing sample tools from DB)
  - Social proof section (placeholder testimonials)
  - Final CTA section
  - Footer with links
- Framer Motion entrance animations (scroll reveals, hover effects)
- Mobile responsive (single column on <768px)
- SEO: meta tags (`title`, `description`, Open Graph)

**Success**: Landing page looks premium (Linear/Vercel quality), all CTAs link correctly, responsive on mobile  
**Verify**: Browser: visually inspect desktop + mobile. Click all CTAs. Lighthouse SEO score ≥ 90.

---

### Task 22 — Settings Page
**Duration**: 40 min  
**Read**: `APP_FLOW.md` (Flow 5 Settings)  
**Create**:
- `src/app/(main)/settings/page.tsx` — settings layout with tabs
- Profile section: edit display_name, avatar
- Preferences section: theme toggle, default currency
- Account section: manage subscription link, delete account with confirmation
- Sign out button

**Success**: Settings save and persist on reload  
**Verify**: Browser: change display name → refresh → name persists. Toggle theme → persists.

---

## Phase 6: Testing

### Task 23 — Unit Tests
**Duration**: 120 min  
**Read**: `IMPLEMENTATION_PLAN.md` (§ Phase 6 coverage targets)  
**Create**:
- `src/lib/validations/__tests__/` — Zod schema tests (tools, projects, questionnaire, profile)
- `src/app/api/__tests__/` — API route unit tests with mocked Supabase/Drizzle
- `src/lib/ai/__tests__/` — AI prompt construction + response parsing tests
- `src/lib/__tests__/cost.ts` — cost calculation/recalculation tests

**Success**: `pnpm test` passes with all tests green. Coverage targets met.  
**Verify**: `pnpm test --coverage`

---

### Task 24 — E2E Tests
**Duration**: 120 min  
**Read**: `IMPLEMENTATION_PLAN.md` (§ Phase 6 E2E flows)  
**Create**:
- `tests/e2e/auth.spec.ts` — register → login → dashboard flow
- `tests/e2e/wizard.spec.ts` — complete wizard → AI recommendation → stack builder
- `tests/e2e/catalog.spec.ts` — browse → search → compare → add to project
- `tests/e2e/builder.spec.ts` — drag-and-drop → cost update → save
- `tests/e2e/error.spec.ts` — wrong password, rate limit

**Success**: `pnpm test:e2e` passes in Chrome + Firefox  
**Verify**: `npx playwright test --project=chromium --project=firefox`

---

## Phase 7: Payments & Launch

### Task 25 — Stripe Integration
**Duration**: 90 min  
**Read**: `BACKEND_STRUCTURE.md` (§3 Payment endpoints)  
**Create**:
- Create Stripe products + prices in Stripe dashboard (Pro monthly $12, Pro annual $119)
- `src/app/api/payments/create-checkout/route.ts` — creates Stripe Checkout session
- `src/app/api/webhooks/stripe/route.ts` — handles `checkout.session.completed`, `subscription.updated`, `subscription.deleted`. Signature verification.
- `src/components/shared/UpgradePrompt.tsx` — upgrade CTA shown when free user hits AI limit
- Add pricing section to landing page

**Success**: Checkout → payment → `subscription_tier` updates → AI limits lifted  
**Verify**: Use Stripe test mode: trigger checkout → verify webhook fires → check profile tier in Supabase

---

### Task 26 — Production Deploy
**Duration**: 60 min  
**Read**: `05-checklists/MVP_LAUNCH.md`, `IMPLEMENTATION_PLAN.md` (Step 7.2)  
**Execute**:
- Connect GitHub repo to Vercel
- Set all production env vars
- Configure custom domain (if available)
- Run through MVP launch checklist
- Deploy to production
- Smoke test all features
- Monitor Sentry + PostHog for 24 hours

**Success**: Zero critical errors, all features working on production  
**Verify**: Access production URL → complete full user flow (register → wizard → AI → builder → save → dashboard)

---

## Summary

| Phase | Tasks | Est. Hours |
|:------|:------|:-----------|
| 1. Foundation | Tasks 1–7 | 5–6 hrs |
| 2. Design System | Tasks 8–10 | 3–4 hrs |
| 3. Authentication | Tasks 11–12 | 2.5–3.5 hrs |
| 4. Core Features | Tasks 13–20 | 10–13 hrs |
| 5. Landing & Polish | Tasks 21–22 | 2.5–3 hrs |
| 6. Testing | Tasks 23–24 | 4–5 hrs |
| 7. Payments & Launch | Tasks 25–26 | 2.5–3.5 hrs |
| **Total** | **26 tasks** | **30–37 hrs** |

---
