# Implementation Plan & Build Sequence

> The exact order to build things. Each step is testable. No guessing what comes next.

## Overview

| Field | Value |
|:------|:------|
| **Project** | Tech Stack Engine |
| **MVP Target** | 4-6 weeks from development start |
| **Approach** | Documentation-first, iterative, test-after-every-step |
| **Solo Dev** | Yes — optimized for single-developer workflow |

### Build Rules
1. Code follows documentation (not the reverse)
2. Test after every step — don't batch
3. Deploy to Vercel preview after each milestone
4. Each step produces a verifiable result
5. **One task per conversation** — fresh AI context = maximum quality

---

## Phase 1: Foundation

### Step 1.1 — Project Setup
**Duration**: 1-2 hours  
**Goal**: Running Next.js 15.3 project with linting, formatting, and all tooling configured

- [ ] Initialize Next.js 15.3 with App Router (`npx create-next-app@15.3 ./ --app --ts --tailwind --eslint --src-dir --import-alias "@/*"`)
- [ ] Install pnpm as package manager
- [ ] Install all frontend dependencies from `TECH_STACK.md` (exact versions)
- [ ] Install all backend dependencies from `TECH_STACK.md` (exact versions)
- [ ] Install dev dependencies (Prettier, Husky, lint-staged, Vitest, Playwright)
- [ ] Configure ESLint 9 flat config
- [ ] Configure Prettier
- [ ] Configure Husky pre-commit hooks (lint + format + type-check)
- [ ] Set up path aliases (`@/components`, `@/lib`, `@/app`, etc.)
- [ ] Create project folder structure:
  ```
  src/
  ├── app/                    # Next.js App Router pages
  │   ├── (auth)/             # Auth routes group
  │   ├── (main)/             # Main app routes group
  │   ├── api/                # API routes
  │   └── layout.tsx          # Root layout
  ├── components/
  │   ├── ui/                 # shadcn/ui components
  │   ├── layout/             # Header, Sidebar, Footer
  │   ├── wizard/             # Stack Wizard components
  │   ├── builder/            # Stack Builder components
  │   ├── catalog/            # Tool Catalog components
  │   └── shared/             # Shared components
  ├── lib/
  │   ├── db/                 # Drizzle schema & client
  │   ├── supabase/           # Supabase client helpers
  │   ├── ai/                 # Gemini API integration
  │   ├── stripe/             # Stripe helpers
  │   ├── validations/        # Zod schemas
  │   └── utils/              # General utilities
  ├── hooks/                  # Custom React hooks
  ├── stores/                 # Zustand stores
  ├── types/                  # TypeScript type definitions
  └── config/                 # App config constants
  ```
- [ ] Verify: `pnpm dev` starts, `pnpm lint` passes, `tsc --noEmit` passes

---

### Step 1.2 — Environment & Services Setup
**Duration**: 1 hour  
**Goal**: All external services connected

- [ ] Create Supabase project
- [ ] Create `.env.local` from `TECH_STACK.md` env template
- [ ] Create `.env.example` (no secrets)
- [ ] Add `.env.local` to `.gitignore`
- [ ] Configure Supabase client (`@supabase/ssr` for Next.js App Router)
- [ ] Set up Google Gemini API key
- [ ] Configure Sentry SDK
- [ ] Configure PostHog SDK
- [ ] Verify: Supabase connection works, env vars load correctly

---

### Step 1.3 — Database Schema
**Duration**: 2 hours  
**Goal**: All tables created, RLS policies applied

- [ ] Define Drizzle schema for all 8 tables per `BACKEND_STRUCTURE.md`
- [ ] Run `drizzle-kit push` to apply schema to Supabase
- [ ] Create RLS policies for each table
- [ ] Create updated_at trigger function
- [ ] Seed `categories` table with 10 initial categories
- [ ] Seed `tools` table with 20-30 initial tools (5 most popular per category: Frontend, Backend, Database, Hosting, Auth)
- [ ] Seed `tool_pricing_tiers` for each seeded tool
- [ ] Verify: tables exist, RLS works (can't read other users' data), seed data queryable

---

## Phase 2: Design System

### Step 2.1 — Design Tokens & Theme
**Duration**: 1-2 hours  
**Goal**: Complete design system with dark/light mode

- [ ] Configure Tailwind CSS 4 with design tokens from `FRONTEND_GUIDELINES.md`
- [ ] Set up CSS custom properties for all colors, spacing, typography, shadows
- [ ] Configure Inter + JetBrains Mono fonts (next/font)
- [ ] Implement dark mode (default) + light mode toggle with `next-themes`
- [ ] Create globals.css with base styles
- [ ] Verify: tokens render correctly, theme toggle works

### Step 2.2 — Core UI Components
**Duration**: 3-4 hours  
**Goal**: Complete shadcn/ui component library customized to design system

- [ ] Initialize shadcn/ui (`npx shadcn@latest init`)
- [ ] Install + customize core components: Button, Input, Card, Dialog, Dropdown, Badge, Tabs, Toast, Skeleton, Tooltip, Avatar, Select, Slider
- [ ] Create custom components:
  - ToolCard (catalog variant + sidebar variant + draggable variant)
  - StackSlot (empty + filled states, drop target)
  - CategoryBadge (colored pill per category)
  - CostDisplay (formatted price with currency)
  - WizardStepCard (selectable option card)
  - ProgressBar (wizard step indicator)
- [ ] Verify: all components render in all states (default, hover, focus, disabled, loading)

---

## Phase 3: Authentication

### Step 3.1 — Auth Backend
**Duration**: 2 hours  
**Goal**: Supabase Auth configured with email + Google OAuth

- [ ] Configure Supabase Auth providers (email/password + Google OAuth)
- [ ] Create `profiles` table trigger: auto-create profile on auth.users insert
- [ ] Set up Next.js middleware for route protection
- [ ] Create `/api/profile` GET and PATCH endpoints
- [ ] Verify: can register, login, OAuth flow works, middleware redirects

### Step 3.2 — Auth Frontend
**Duration**: 2-3 hours  
**Goal**: Login, register, and protected route flow working

- [ ] Create `/login` page with email + Google OAuth buttons
- [ ] Create `/register` page
- [ ] Create `/forgot-password` page
- [ ] Add auth state to global layout (session context)
- [ ] Add nav bar with avatar dropdown (logged in) / login button (logged out)
- [ ] Handle auth redirects (unauthenticated → /login?redirect=...)
- [ ] Verify: full auth flow works end-to-end

---

## Phase 4: Core Features

### Step 4.1 — Tool Catalog
**Duration**: 3-4 hours  
**Goal**: Browsable, searchable, filterable tool catalog

- [ ] Create `/api/tools` endpoint with search, filter, pagination
- [ ] Create `/api/categories` endpoint
- [ ] Build Catalog page (`/catalog`)
  - Category pill filters
  - Search bar with autocomplete
  - Tool card grid with responsive layout
  - Loading skeletons
  - Empty state
  - Pagination
- [ ] Build Tool Detail page (`/catalog/tool/:slug`)
- [ ] Verify: can browse, search, filter tools. All states handled.

**Ref**: `PRD.md` Feature 3, `APP_FLOW.md` Catalog Screen

### Step 4.2 — Tool Comparison
**Duration**: 2-3 hours  
**Goal**: Side-by-side comparison of 2-3 tools

- [ ] Add "Compare" checkbox to tool cards
- [ ] Create floating "Compare Selected" button (appears when 2+ selected)
- [ ] Create `/api/tools/compare` endpoint
- [ ] Build Comparison Overlay modal
  - 2-3 column layout
  - Pricing, features, pros/cons, GitHub stars, learning curve
  - "Add to Stack" button
- [ ] Verify: can select tools, open comparison, data is accurate

**Ref**: `PRD.md` Feature 3, `APP_FLOW.md` Compare Tools Overlay

### Step 4.3 — Stack Wizard (Questionnaire)
**Duration**: 3-4 hours  
**Goal**: Multi-step wizard that collects project requirements

- [ ] Create Zustand store for wizard state (step navigation, answer storage)
- [ ] Build wizard shell with progress indicator
- [ ] Build 6 wizard steps per `APP_FLOW.md`:
  - Step 1: Project Type (card select)
  - Step 2: Use Case (card select)
  - Step 3: Team & Timeline (form)
  - Step 4: Budget (slider + cards)
  - Step 5: Preferences (checkboxes)
  - Step 6: Review & Generate (summary + submit)
- [ ] Create `/api/questionnaire` POST endpoint to save responses
- [ ] Implement back/forward navigation with state persistence
- [ ] Verify: can complete full wizard, data persisted, conditional logic works

**Ref**: `PRD.md` Feature 1, `APP_FLOW.md` Stack Wizard

### Step 4.4 — AI Recommendation Engine
**Duration**: 4-5 hours  
**Goal**: AI generates full stack recommendation from wizard answers

- [ ] Create Gemini API integration (`lib/ai/gemini.ts`)
- [ ] Design system prompt for stack recommendations (structured JSON output)
- [ ] Create `/api/ai/recommend` POST endpoint
  - Validate questionnaire data
  - Call Gemini with structured prompt
  - Parse and validate response
  - Match AI suggestions to tools in database
  - Save recommendation + auto-populate project_tools
- [ ] Implement rate limiting (10/min Pro, 3 total free)
- [ ] Build loading state (pulsing skeleton + status messages)
- [ ] Create recommendation results UI (tool cards with reasoning + confidence)
- [ ] Handle API failures gracefully (retry, fallback message)
- [ ] Verify: wizard → AI recommendation → project created with tools. Error handling works.

**Ref**: `PRD.md` Feature 2, `APP_FLOW.md` AI Recommendation States

### Step 4.5 — Stack Builder (Dashboard)
**Duration**: 5-6 hours  
**Goal**: Interactive drag-and-drop stack builder with live cost updates

- [ ] Create Zustand store for builder state (tools in slots, drag state)
- [ ] Build Stack Builder page (`/project/:id`)
  - Category slot grid (10 slots from categories)
  - Tool sidebar panel with search + filter
  - Drag-and-drop with dnd-kit
  - Drop targets with visual feedback
  - Tool cards in slots (expandable details)
  - Swap/remove tool actions on hover
- [ ] Build Cost Summary Bar (sticky bottom)
  - Total monthly cost with currency
  - Per-category cost breakdown
  - Animate cost changes
- [ ] Build AI suggestion bar (contextual tips)
- [ ] Create `/api/projects/:id/tools` PUT and DELETE endpoints
- [ ] Auto-recalculate total cost on tool changes
- [ ] Verify: can drag tools into slots, cost updates live, save works, reload preserves state

**Ref**: `PRD.md` Feature 4, `APP_FLOW.md` Stack Builder

### Step 4.6 — User Dashboard & Project Management
**Duration**: 2-3 hours  
**Goal**: Project list, create, rename, delete

- [ ] Create `/api/projects` CRUD endpoints
- [ ] Build Dashboard page (`/dashboard`)
  - Project cards with name, tool count, cost, last edited
  - "New Project" CTA
  - Project context menu (rename, duplicate, delete)
  - Empty state for zero projects
- [ ] Connect "New Project" → Wizard flow
- [ ] Connect project cards → Stack Builder
- [ ] Verify: can create, list, rename, delete projects. Navigation works.

**Ref**: `PRD.md` Feature 5, `APP_FLOW.md` Dashboard

---

## Phase 5: Landing Page & Polish

### Step 5.1 — Landing Page
**Duration**: 3-4 hours  
**Goal**: High-converting landing page

- [ ] Build landing page (`/`) per `APP_FLOW.md`:
  - Hero with animated gradient background
  - Feature grid (3 columns)
  - How it works (3 steps)
  - Tool grid preview
  - Social proof section
  - Final CTA
- [ ] Apply animations (Framer Motion — entrance reveals, hover effects)
- [ ] Mobile responsive layout
- [ ] SEO meta tags
- [ ] Verify: landing page looks premium, CTAs work, responsive on mobile

### Step 5.2 — Settings & Profile
**Duration**: 1-2 hours  
**Goal**: Basic settings page

- [ ] Build Settings page (`/settings`)
  - Profile editing (name, avatar)
  - Theme preference
  - Subscription management (link to Stripe portal)
  - Delete account
- [ ] Verify: settings save and persist

---

## Phase 6: Testing

### Step 6.1 — Unit Tests
**Duration**: 3-4 hours  
**Goal**: Critical paths covered

| Area | Target Coverage |
|:-----|:---------------|
| API route validations | 90% |
| Zod schemas | 95% |
| AI prompt construction | 80% |
| Cost calculation logic | 95% |
| Auth middleware | 90% |

- [ ] Set up Vitest with Next.js config
- [ ] Write API route tests (mocked Supabase)
- [ ] Write validation schema tests
- [ ] Write cost calculation tests
- [ ] Verify: `pnpm test` passes

### Step 6.2 — E2E Tests
**Duration**: 3-4 hours  
**Goal**: Full user flows verified in browser

- [ ] Set up Playwright
- [ ] Test: Landing → Register → Wizard → AI Recommendation → Stack Builder → Save
- [ ] Test: Login → Dashboard → Open Project → Modify stack → Save
- [ ] Test: Catalog → Search → Compare → Add to project
- [ ] Test: Error paths (wrong password, rate limit)
- [ ] Verify: all flows pass in Chrome + Firefox

---

## Phase 7: Payments & Launch

### Step 7.1 — Stripe Integration
**Duration**: 2-3 hours  
**Goal**: Free → Pro upgrade flow working

- [ ] Create Stripe products + prices (Pro monthly, Pro annual)
- [ ] Create `/api/payments/create-checkout` endpoint
- [ ] Create `/api/webhooks/stripe` endpoint
- [ ] Build upgrade prompt (shown when free user hits AI limit)
- [ ] Build pricing section on landing page
- [ ] Verify: checkout → payment → subscription_tier updated → AI limits lifted

### Step 7.2 — Production Deploy
**Duration**: 2-3 hours  
**Goal**: Live on production

- [ ] Connect GitHub repo to Vercel
- [ ] Set all production env vars in Vercel
- [ ] Configure custom domain
- [ ] Run `05-checklists/MVP_LAUNCH.md` checklist
- [ ] Deploy to production
- [ ] Smoke test all features
- [ ] Monitor Sentry + PostHog for 24 hours
- [ ] Verify: zero critical errors, all features working

---

## Milestones

| Milestone | Target | Deliverables |
|:----------|:-------|:-------------|
| **Foundation** | Week 1 | Project running, DB schema, design tokens, UI components |
| **Auth + Catalog** | Week 2 | Full auth flow, tool catalog + comparison |
| **Wizard + AI** | Week 3 | Questionnaire wizard, AI recommendation engine |
| **Builder + Dashboard** | Week 4 | Drag-and-drop builder, project management |
| **Polish + Testing** | Week 5 | Landing page, settings, unit + E2E tests |
| **Payments + Launch** | Week 6 | Stripe integration, production deploy |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|:-----|:-------|:-----------|
| Scope creep | High | Stick to PRD P0 only. P1+ features go in backlog. |
| AI recommendation quality | High | Start with curated prompts + tool DB constraints. Iterate on prompt engineering. |
| Tool data freshness | Medium | Manual seed data for MVP. Build automated scrapers post-launch. |
| Drag-and-drop complexity | Medium | Use dnd-kit (battle-tested). Fallback to click-to-select on mobile. |
| Schema changes mid-build | Medium | Drizzle migrations. Never modify production data directly. |
| Gemini API rate limits | Low | Implement client-side caching, debounce requests, show cached results. |
| Timeline slip | Medium | Buffer week 6. Cut Settings page before cutting core features. |

---

## Task Decomposition

After user approval of all documentation, this plan will be decomposed into discrete numbered tasks following the format in the overview. Each task will include:
- Files to read for context
- Files to create/modify
- Success criteria
- Verification commands

The task list will be generated as a separate `TASK_LIST.md` file.

---
