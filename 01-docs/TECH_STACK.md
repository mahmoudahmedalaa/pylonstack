# Technology Stack

> Every technology decision locked down with exact versions. No "latest" — pin everything.

## 1. Stack Overview

| Dimension | Decision | Justification |
|:----------|:---------|:--------------|
| **Architecture** | Full-stack monorepo (Next.js) | Single codebase, SSR+API routes, fast iteration for solo dev |
| **Platform** | Web (desktop-first, responsive) | Maximum reach, fastest iteration, no app store gatekeeping |
| **Deployment** | Vercel | Native Next.js support, auto-scaling, generous free tier, great DX |
| **Scale Target** | MVP → 10K users | Start lean, architecture supports scaling to 100K+ |

---

## 2. Frontend Stack

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Framework** | Next.js 15.3 | Full-stack React framework with App Router | [nextjs.org](https://nextjs.org/docs) | Remix (less ecosystem), Vite+React (no SSR) |
| **Language** | TypeScript 5.7 | Type safety across full stack | [typescriptlang.org](https://www.typescriptlang.org/docs/) | — (non-negotiable) |
| **Styling** | Tailwind CSS 4.0 | Utility-first CSS, fast UI development | [tailwindcss.com](https://tailwindcss.com/docs) | Vanilla CSS (slower for rapid prototyping) |
| **UI Library** | shadcn/ui (latest) | High-quality, accessible, customizable components | [ui.shadcn.com](https://ui.shadcn.com) | Radix (lower level), MUI (too opinionated) |
| **State Mgmt** | Zustand 5.0 | Lightweight, minimal boilerplate, TypeScript-first | [zustand](https://zustand.docs.pmnd.rs/) | Redux (overkill), Jotai (atomic not needed) |
| **Forms** | React Hook Form 7.54 | Performant form handling with validation | [react-hook-form.com](https://react-hook-form.com) | Formik (heavier, less performant) |
| **Validation** | Zod 3.24 | TypeScript-first schema validation (shared FE/BE) | [zod.dev](https://zod.dev) | Yup (less TS integration) |
| **Drag & Drop** | dnd-kit 6.3 | Accessible, performant drag-and-drop | [dndkit.com](https://dndkit.com) | react-beautiful-dnd (discontinued) |
| **Animations** | Framer Motion 12.x | Declarative animations, gesture support | [motion.dev](https://motion.dev) | CSS only (less control) |
| **Icons** | Lucide React 0.480 | Consistent, tree-shakeable icon set | [lucide.dev](https://lucide.dev) | Heroicons (less variety) |
| **Data Fetching** | TanStack Query 5.68 | Server state management, caching, mutations | [tanstack.com/query](https://tanstack.com/query/latest) | SWR (less features) |
| **Charts** | Recharts 2.15 | Cost visualization, comparison charts | [recharts.org](https://recharts.org) | Chart.js (less React-native) |

---

## 3. Backend Stack

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Runtime** | Node.js 22 LTS (via Next.js API routes) | Server-side logic, API endpoints | [nodejs.org](https://nodejs.org/docs/latest-v22.x/api/) | Separate Express server (unnecessary complexity) |
| **Database** | Supabase (PostgreSQL 15) | Relational data, auth, real-time, storage | [supabase.com/docs](https://supabase.com/docs) | Firebase (NoSQL less suited for relational tool data), PlanetScale (MySQL) |
| **ORM** | Drizzle ORM 0.39 | Type-safe queries, lightweight, SQL-first | [orm.drizzle.team](https://orm.drizzle.team) | Prisma (heavier, slower cold starts) |
| **Auth** | Supabase Auth + Next-Auth 5.x | OAuth, email/password, session management | [supabase.com/auth](https://supabase.com/docs/guides/auth) | Clerk (cost at scale), Auth.js alone (less integrated) |
| **AI / LLM** | Google Gemini API (gemini-2.0-flash) | Stack recommendations, intelligent matching | [ai.google.dev](https://ai.google.dev/gemini-api/docs) | OpenAI (more expensive), Anthropic (higher cost) |
| **File Storage** | Supabase Storage | Tool logos, user avatars | [supabase.com/storage](https://supabase.com/docs/guides/storage) | Cloudflare R2 (more setup) |
| **Email** | Resend 4.x | Transactional emails (verification, password reset) | [resend.com/docs](https://resend.com/docs) | SendGrid (overkill), AWS SES (complex setup) |
| **Payments** | Stripe 17.x | Subscription billing (Pro/Team tiers) | [stripe.com/docs](https://stripe.com/docs) | Paddle (less control), LemonSqueezy (smaller ecosystem) |
| **Analytics** | PostHog 1.x (JS SDK) | Product analytics, feature flags, session replay | [posthog.com/docs](https://posthog.com/docs) | Mixpanel (expensive), GA4 (less developer-friendly) |
| **Error Monitoring** | Sentry 9.x | Error tracking, performance monitoring | [docs.sentry.io](https://docs.sentry.io) | LogRocket (expensive), Bugsnag (less features) |

---

## 4. Development Tools

| Tool | Version | Purpose |
|:-----|:--------|:--------|
| **Package Manager** | pnpm 10.x | Fast, disk-efficient, strict |
| **Linter** | ESLint 9.x (flat config) | Code quality enforcement |
| **Formatter** | Prettier 3.5.x | Consistent code formatting |
| **Git Hooks** | Husky 9.x + lint-staged | Pre-commit checks (lint, format, type-check) |
| **Testing** | Vitest 3.x | Unit + integration tests |
| **E2E Testing** | Playwright 1.50.x | Browser-based end-to-end tests |
| **Type Checking** | `tsc --noEmit` | Pre-commit and CI type verification |
| **DB Migrations** | Drizzle Kit 0.30.x | Schema migrations and push |

---

## 5. Environment Variables

```bash
# Application
APP_NAME="tech-stack-engine"
APP_ENV="development"  # development | staging | production
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxxx..."

# Database (direct connection for Drizzle)
DATABASE_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"

# Auth
NEXTAUTH_SECRET="generate-a-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxx"

# AI
GOOGLE_GEMINI_API_KEY="AIzaxxxx"

# Payments
STRIPE_SECRET_KEY="sk_test_xxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxx"

# Email
RESEND_API_KEY="re_xxxx"

# Analytics
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxx"
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"

# Error Monitoring
NEXT_PUBLIC_SENTRY_DSN="https://xxxx@sentry.io/xxxx"
SENTRY_AUTH_TOKEN="sntrys_xxxx"
```

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.

---

## 6. Dependencies Lock

### Core
```json
{
  "next": "15.3.0",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "5.7.3"
}
```

### Frontend
```json
{
  "tailwindcss": "4.0.0",
  "@dnd-kit/core": "6.3.1",
  "@dnd-kit/sortable": "10.0.0",
  "framer-motion": "12.0.0",
  "lucide-react": "0.480.0",
  "@tanstack/react-query": "5.68.0",
  "react-hook-form": "7.54.0",
  "zod": "3.24.0",
  "zustand": "5.0.0",
  "recharts": "2.15.0"
}
```

### Backend
```json
{
  "@supabase/supabase-js": "2.49.0",
  "drizzle-orm": "0.39.0",
  "drizzle-kit": "0.30.0",
  "@google/genai": "1.0.0",
  "stripe": "17.5.0",
  "resend": "4.1.0",
  "next-auth": "5.0.0"
}
```

### Dev
```json
{
  "eslint": "9.18.0",
  "prettier": "3.5.0",
  "husky": "9.1.0",
  "lint-staged": "15.4.0",
  "vitest": "3.0.0",
  "@playwright/test": "1.50.0",
  "@sentry/nextjs": "9.0.0",
  "posthog-js": "1.210.0"
}
```

> Pin exact versions. Run `pnpm audit` monthly.

---

## 7. Security Considerations

| Area | Approach |
|:-----|:---------|
| **Authentication** | Supabase Auth (JWT, 1hr access token, 7d refresh) + server-side session validation |
| **Passwords** | Handled by Supabase Auth (bcrypt, 10+ rounds) |
| **API Security** | HTTPS only, CORS configured per environment, API route middleware for auth |
| **Rate Limiting** | Vercel Edge middleware: AI endpoints 10/min, auth 5/15min, general API 100/min |
| **Data Protection** | Supabase RLS (Row Level Security) policies on all tables |
| **Input Sanitization** | Zod validation on all API inputs, parameterized queries via Drizzle |
| **Secrets** | Never in code — env vars only, Vercel env management |
| **AI Safety** | Structured output from Gemini, validate AI responses against tool database |

---

## 8. Version Upgrade Policy

| Type | Frequency | Process |
|:-----|:----------|:--------|
| **Major** (Next.js, React) | Quarterly review | Test in staging → compat check → rollback plan → upgrade |
| **Minor/Patch** | Monthly | Automated via Renovate → review PR → merge |
| **Security** | ASAP (within 24h) | Emergency patch process, hotfix branch |
| **AI Model** | As needed | Test new model version against benchmark prompts → validate output quality |

---
