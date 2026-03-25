# Backend Architecture & Database Structure

> Database schema, API contracts, auth logic. Every table, relationship, and endpoint documented before writing code.

## 1. Architecture Overview

| Dimension | Decision |
|:----------|:---------|
| **Pattern** | Next.js API Routes (App Router) — co-located with frontend |
| **Auth Strategy** | Supabase Auth (JWT) + Next.js middleware for route protection |
| **Data Flow** | Client → Next.js API Route → Drizzle ORM → Supabase PostgreSQL |
| **AI Flow** | Client → API Route → Google Gemini API → structured JSON → client |
| **Caching** | TanStack Query (client) + Next.js ISR/revalidation (server) for tool catalog |

---

## 2. Database Schema

### Database: Supabase PostgreSQL 15
- **ORM**: Drizzle ORM 0.39
- **Naming**: snake_case for tables/columns
- **Timestamps**: All tables include `created_at`, `updated_at`
- **Soft Delete**: No (hard deletes for MVP — user data privacy)
- **UUIDs**: Supabase `gen_random_uuid()` for all primary keys

### Entity Relationship Diagram
```
[auth.users] ──1:N──→ [projects]
[projects]   ──1:N──→ [project_tools] (junction)
[tools]      ──1:N──→ [project_tools] (junction)
[tools]      ──N:1──→ [categories]
[tools]      ──1:N──→ [tool_pricing_tiers]
[projects]   ──1:1──→ [questionnaire_responses]
[projects]   ──1:1──→ [ai_recommendations]
```

### Table: `profiles`
> Extends Supabase auth.users with app-specific data

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, FK → auth.users(id) ON DELETE CASCADE | Matches Supabase auth user ID |
| display_name | VARCHAR(255) | NOT NULL | Public display name |
| avatar_url | TEXT | NULL | Profile image URL |
| subscription_tier | ENUM('free','pro','team') | DEFAULT 'free', NOT NULL | Current billing tier |
| stripe_customer_id | VARCHAR(255) | NULL, UNIQUE | Stripe customer reference |
| preferences | JSONB | DEFAULT '{}' | User settings (theme, currency, etc.) |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | Auto-updated via trigger |

**Indexes**: `idx_profiles_stripe_customer` ON (stripe_customer_id)  
**RLS**: Users can only read/update their own profile

---

### Table: `categories`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| name | VARCHAR(100) | UNIQUE, NOT NULL | e.g., "Frontend Framework", "Database" |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly name |
| display_order | INTEGER | DEFAULT 0 | Sort order in UI |
| icon | VARCHAR(50) | NULL | Lucide icon name |
| description | TEXT | NULL | Category description |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**Indexes**: `idx_categories_slug` ON (slug)  
**RLS**: Public read, admin-only write

**Seed Data** (10 categories):
Frontend Framework, Backend/Runtime, Database, Authentication, Hosting/Deployment, CI/CD, Monitoring/Observability, Payments, Email/Notifications, Storage/CDN

---

### Table: `tools`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| category_id | UUID | FK → categories(id), NOT NULL | Tool category |
| name | VARCHAR(255) | NOT NULL | Tool name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly name |
| tagline | VARCHAR(500) | NULL | Short description |
| description | TEXT | NULL | Detailed description |
| logo_url | TEXT | NULL | Tool logo image URL |
| website_url | TEXT | NULL | Official website |
| docs_url | TEXT | NULL | Documentation URL |
| github_url | TEXT | NULL | GitHub repository URL |
| github_stars | INTEGER | DEFAULT 0 | Stars count (refreshed weekly) |
| has_free_tier | BOOLEAN | DEFAULT FALSE | Whether a free tier exists |
| pricing_model | ENUM('free','freemium','paid','open_source','self_hosted') | NOT NULL | |
| starting_price_monthly | DECIMAL(10,2) | NULL | Cheapest paid tier $/month |
| key_features | JSONB | DEFAULT '[]' | Array of feature strings |
| pros | JSONB | DEFAULT '[]' | Array of pros |
| cons | JSONB | DEFAULT '[]' | Array of cons |
| best_for | TEXT | NULL | One-liner of ideal use case |
| learning_curve | ENUM('easy','moderate','steep') | NULL | |
| maturity | ENUM('emerging','growing','established','legacy') | NULL | |
| is_active | BOOLEAN | DEFAULT TRUE | Show in catalog |
| metadata | JSONB | DEFAULT '{}' | Flexible extra fields |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**Indexes**:
- `idx_tools_slug` ON (slug)
- `idx_tools_category` ON (category_id)
- `idx_tools_active_category` ON (is_active, category_id) WHERE is_active = TRUE
- Full-text search index on (name, tagline, description)

**RLS**: Public read, admin-only write

---

### Table: `tool_pricing_tiers`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| tool_id | UUID | FK → tools(id) ON DELETE CASCADE, NOT NULL | |
| tier_name | VARCHAR(100) | NOT NULL | "Free", "Pro", "Enterprise" |
| price_monthly | DECIMAL(10,2) | NULL | NULL = custom pricing |
| price_yearly | DECIMAL(10,2) | NULL | Annual billing option |
| features | JSONB | DEFAULT '[]' | What's included |
| limits | JSONB | DEFAULT '{}' | e.g., {"requests": 10000, "storage_gb": 5} |
| is_free | BOOLEAN | DEFAULT FALSE | |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**Indexes**: `idx_pricing_tool` ON (tool_id)  
**RLS**: Public read, admin-only write

---

### Table: `projects`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| user_id | UUID | FK → auth.users(id) ON DELETE CASCADE, NOT NULL | Project owner |
| name | VARCHAR(255) | NOT NULL | Project name |
| description | TEXT | NULL | Optional project description |
| project_type | VARCHAR(50) | NULL | "web_app", "mobile_app", "desktop_app", "backend_service", "cli_tool", "browser_extension" |
| total_monthly_cost | DECIMAL(10,2) | DEFAULT 0 | Cached cost total |
| is_public | BOOLEAN | DEFAULT FALSE | Whether shareable via link |
| share_slug | VARCHAR(100) | NULL, UNIQUE | Public share URL slug |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**Indexes**:
- `idx_projects_user` ON (user_id)
- `idx_projects_share` ON (share_slug) WHERE share_slug IS NOT NULL

**RLS**: Users can only CRUD their own projects. Public read if is_public = TRUE.

---

### Table: `project_tools`
> Junction table linking projects to selected tools

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| project_id | UUID | FK → projects(id) ON DELETE CASCADE, NOT NULL | |
| tool_id | UUID | FK → tools(id) ON DELETE CASCADE, NOT NULL | |
| category_id | UUID | FK → categories(id), NOT NULL | Denormalized for quick lookups |
| selected_tier_id | UUID | FK → tool_pricing_tiers(id), NULL | Which pricing tier selected |
| monthly_cost | DECIMAL(10,2) | DEFAULT 0 | Cost at selected tier |
| position | INTEGER | DEFAULT 0 | Display order in the grid |
| notes | TEXT | NULL | User's notes about this selection |
| ai_recommended | BOOLEAN | DEFAULT FALSE | Was this an AI suggestion |
| ai_confidence | DECIMAL(3,2) | NULL | 0.00–1.00 AI confidence score |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**Indexes**:
- `idx_pt_project` ON (project_id)
- UNIQUE (project_id, category_id) — one tool per category per project

**RLS**: Inherits from project ownership

---

### Table: `questionnaire_responses`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| project_id | UUID | FK → projects(id) ON DELETE CASCADE, UNIQUE, NOT NULL | One response per project |
| user_id | UUID | FK → auth.users(id) ON DELETE CASCADE, NOT NULL | |
| responses | JSONB | NOT NULL | Full wizard answers |
| completed | BOOLEAN | DEFAULT FALSE | Whether all steps completed |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**RLS**: User-owned only

**Example `responses` JSONB:**
```json
{
  "project_type": "web_app",  // one of: web_app | mobile_app | desktop_app | backend_service | cli_tool | browser_extension
  "use_case": "saas",
  "team_size": "solo",
  "timeline": "1_month",
  "budget_range": "1_50",
  "preferences": ["open_source", "typescript", "serverless"]
}
```

---

### Table: `ai_recommendations`

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| project_id | UUID | FK → projects(id) ON DELETE CASCADE, UNIQUE, NOT NULL | |
| user_id | UUID | FK → auth.users(id) ON DELETE CASCADE, NOT NULL | |
| model_used | VARCHAR(100) | NOT NULL | e.g., "gemini-2.0-flash" |
| prompt_hash | VARCHAR(64) | NULL | Dedup / caching |
| raw_response | JSONB | NOT NULL | Full AI response for debugging |
| recommendations | JSONB | NOT NULL | Structured recommendations array |
| generation_time_ms | INTEGER | NULL | API response time |
| created_at | TIMESTAMPTZ | DEFAULT NOW(), NOT NULL | |

**RLS**: User-owned only

**Example `recommendations` JSONB:**
```json
[
  {
    "category_slug": "frontend_framework",
    "tool_slug": "nextjs",
    "confidence": 0.95,
    "reasoning": "Best fit for a web SaaS with SEO needs and a solo developer",
    "alternative_slug": "remix"
  }
]
```

---

## 3. API Endpoints

### Authentication (Supabase-managed)
Auth is handled by Supabase Auth client SDK — no custom endpoints needed for login/register/OAuth.

Custom profile endpoint:

#### GET `/api/profile`
- **Access**: Authenticated
- **Response 200**: `{ id, display_name, avatar_url, subscription_tier, preferences }`
- **Errors**: 401 (not authenticated)

#### PATCH `/api/profile`
- **Access**: Authenticated
- **Body**: `{ display_name?, avatar_url?, preferences? }`
- **Validation**: display_name (2-255 chars), preferences (valid JSONB)
- **Response 200**: Updated profile object
- **Errors**: 400 (validation), 401 (not authenticated)

---

### Projects

#### GET `/api/projects`
- **Access**: Authenticated
- **Response 200**: `{ data: [{ id, name, project_type, total_monthly_cost, tool_count, created_at, updated_at }] }`
- **Caching**: TanStack Query staleTime: 30s

#### POST `/api/projects`
- **Access**: Authenticated
- **Body**: `{ name, description?, project_type? }`
- **Validation**: name (1-255 chars)
- **Response 201**: `{ data: { id, name, ... } }`
- **Errors**: 400 (validation), 401 (unauthorized)
- **Side Effects**: Creates project, creates empty project_tools for each category

#### GET `/api/projects/:id`
- **Access**: Authenticated (owner) or Public (if is_public)
- **Response 200**: `{ data: { project, tools: [...project_tools with tool details...], questionnaire, recommendation } }`
- **Errors**: 404 (not found), 403 (not owner and not public)

#### PATCH `/api/projects/:id`
- **Access**: Authenticated (owner)
- **Body**: `{ name?, description?, is_public? }`
- **Response 200**: Updated project object
- **Errors**: 400, 401, 403, 404

#### DELETE `/api/projects/:id`
- **Access**: Authenticated (owner)
- **Response 204**: No content
- **Errors**: 401, 403, 404
- **Side Effects**: Cascading delete of project_tools, questionnaire, ai_recommendations

---

### Project Tools

#### PUT `/api/projects/:id/tools`
- **Access**: Authenticated (owner)
- **Body**: `{ category_id, tool_id, selected_tier_id? }`
- **Response 200**: Updated project_tool entry + recalculated total cost
- **Errors**: 400, 401, 403, 404, 409 (category slot already filled — use PATCH)
- **Side Effects**: Recalculate `projects.total_monthly_cost`

#### DELETE `/api/projects/:id/tools/:toolId`
- **Access**: Authenticated (owner)
- **Response 204**: No content
- **Side Effects**: Recalculate `projects.total_monthly_cost`

---

### Tool Catalog

#### GET `/api/tools`
- **Access**: Public
- **Query Params**: `category` (slug), `search` (text), `has_free_tier` (bool), `pricing_model`, `page` (default 1), `limit` (default 24, max 100)
- **Response 200**: `{ data: [...tools], pagination: { page, limit, total, pages } }`
- **Caching**: Next.js ISR revalidate every 1 hour

#### GET `/api/tools/:slug`
- **Access**: Public
- **Response 200**: `{ data: { ...tool, pricing_tiers: [...], category } }`
- **Caching**: Next.js ISR revalidate every 1 hour
- **Errors**: 404

#### GET `/api/tools/compare`
- **Access**: Public
- **Query Params**: `slugs` (comma-separated, 2-3 tool slugs)
- **Response 200**: `{ data: [...tools with full pricing and metadata for comparison] }`
- **Errors**: 400 (wrong slug count)

---

### Categories

#### GET `/api/categories`
- **Access**: Public
- **Response 200**: `{ data: [{ id, name, slug, icon, tool_count }] }`
- **Caching**: Next.js ISR revalidate every 24 hours

---

### AI Recommendations

#### POST `/api/ai/recommend`
- **Access**: Authenticated
- **Body**: `{ project_id, questionnaire_responses }`
- **Validation**: Valid project owned by user, all required fields present
- **Response 200**: `{ data: { recommendations: [...], generation_time_ms } }`
- **Errors**: 400 (validation), 401, 403, 429 (rate limited — 10/min), 500 (AI API failure)
- **Side Effects**: Save questionnaire_responses, save ai_recommendations, auto-populate project_tools
- **Rate Limit**: 10 requests/minute per user (free tier: 3 total generations)

---

### Payments (Stripe)

#### POST `/api/payments/create-checkout`
- **Access**: Authenticated
- **Body**: `{ price_id, success_url, cancel_url }`
- **Response 200**: `{ checkout_url }`

#### POST `/api/webhooks/stripe`
- **Access**: Stripe (verified via webhook signature)
- **Events**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Side Effects**: Update `profiles.subscription_tier`

---

## 4. Authentication & Authorization

### Token Structure (Supabase JWT)
- **Access Token**: 1 hour expiry — `{ sub, email, role, iat, exp, user_metadata }`
- **Refresh Token**: 7 day expiry — handled by Supabase client SDK

### Authorization Levels
| Level | Routes | Required |
|:------|:-------|:---------|
| **Public** | Landing, Catalog, Tool Detail, Compare, Shared Projects | Nothing |
| **Authenticated** | Dashboard, Projects, Wizard, Settings, AI Recommend | Valid Supabase session |
| **Pro** | AI Recommendations (unlimited), Export | subscription_tier = 'pro' or 'team' |
| **Admin** | Tool/Category CRUD, User management | role: service_role (no UI for MVP) |

### Middleware
Next.js middleware at `/middleware.ts`:
- Check Supabase session on protected routes
- Redirect unauthenticated users to `/login?redirect=<original_url>`
- Rate limit AI endpoints using Vercel KV or in-memory counter

---

## 5. Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "name", "message": "Name is required" }]
  }
}
```

### Error Codes
| Code | HTTP | When |
|:-----|:-----|:-----|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Missing or expired session |
| FORBIDDEN | 403 | Not the resource owner |
| NOT_FOUND | 404 | Resource doesn't exist |
| CONFLICT | 409 | Duplicate entry (e.g., tool already in category slot) |
| RATE_LIMITED | 429 | Too many AI requests |
| AI_ERROR | 502 | Gemini API failure |
| SERVER_ERROR | 500 | Unexpected failure |

---

## 6. Security

| Measure | Implementation |
|:--------|:---------------|
| **Authentication** | Supabase Auth (bcrypt passwords, JWT tokens) |
| **Row Level Security** | RLS policies on ALL tables — users see only their own data |
| **Rate Limiting** | AI endpoints: 10/min (Pro), 3 total (free). Auth: 5/15min |
| **Input Sanitization** | Zod validation on all API inputs, Drizzle parameterized queries |
| **CORS** | Configured per environment via Next.js config |
| **Stripe Webhooks** | Signature verification on all webhook endpoints |
| **AI Safety** | Structured output from Gemini, validate tool slugs against DB |
| **Secrets** | Environment variables only, Vercel env management |

---
