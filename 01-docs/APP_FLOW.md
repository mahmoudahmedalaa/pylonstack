# Application Flow & Navigation

> Every screen, every transition, every user decision mapped out. AI builds exactly what's documented here — no guessing.

## 1. Navigation Structure

### App Architecture
**Hybrid** — Top navigation bar with sidebar for authenticated users. Modals for comparisons and overlays.

```
App Root
├── Public Pages
│   ├── Landing Page — "/"
│   ├── Login — "/login"
│   └── Register — "/register"
│
├── Main App (Authenticated)
│   ├── Dashboard — "/dashboard"
│   │   └── Project List (saved stacks)
│   │
│   ├── Stack Wizard — "/wizard"
│   │   ├── Step 1: Project Type — "/wizard/project-type"
│   │   ├── Step 2: Use Case — "/wizard/use-case"
│   │   ├── Step 3: Team & Timeline — "/wizard/team"
│   │   ├── Step 4: Budget — "/wizard/budget"
│   │   ├── Step 5: Preferences — "/wizard/preferences"
│   │   └── Step 6: Review & Generate — "/wizard/review"
│   │
│   ├── Stack Builder — "/project/:id"
│   │   ├── Stack View (drag-and-drop grid)
│   │   ├── Tool Sidebar Panel
│   │   └── Cost Summary Bar
│   │
│   ├── Tool Catalog — "/catalog"
│   │   ├── Category Browse — "/catalog/:category"
│   │   └── Tool Detail — "/catalog/tool/:slug"
│   │
│   ├── Settings — "/settings"
│   │   ├── Profile
│   │   ├── Account
│   │   └── Preferences
│   │
│   └── [Modal Screens]
│       ├── Compare Tools Overlay
│       ├── AI Recommendation Detail
│       └── Save Project Dialog
│
└── Error Pages
    ├── 404 — Not Found
    └── 500 — Server Error
```

---

## 2. Screen Specifications

### Screen: Landing Page

**Route**: `/`  
**Access**: Public  
**Purpose**: Convert visitors into users by communicating the value proposition clearly

#### Layout
```
┌─────────────────────────────────────────┐
│   Logo          [Catalog]  [Login] [CTA]│
├─────────────────────────────────────────┤
│                                         │
│   Hero:                                 │
│   "Stop Researching. Start Building."   │
│   Subtext + [Build Your Stack] CTA      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   3-Column Feature Grid:                │
│   [AI Recs] [Visual Builder] [Roadmaps] │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│   How It Works (3 steps):               │
│   1. Answer → 2. Get Stack → 3. Build  │
│                                         │
├─────────────────────────────────────────┤
│   Social Proof / Testimonials           │
├─────────────────────────────────────────┤
│   Final CTA + Footer                   │
└─────────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| "Build Your Stack" | Primary Button | → Wizard Step 1 (or /login if auth required) |
| "Browse Tools" | Secondary Link | → /catalog |
| "Login" | Text Button | → /login |
| "Sign Up Free" | Button | → /register |

#### States
- **Loading**: Skeleton hero section
- **Empty**: N/A (static page)
- **Error**: N/A (static page)

---

### Screen: Stack Wizard

**Route**: `/wizard/[step]`  
**Access**: Public for first 3 steps, account required to generate  
**Purpose**: Collect project requirements through guided questions

#### Layout
```
┌─────────────────────────────────────────┐
│   Logo        Progress (Step 3 of 6)    │
├─────────────────────────────────────────┤
│                                         │
│   Question Heading                      │
│   "What are you building?"              │
│                                         │
│   ┌─────────┐  ┌─────────┐             │
│   │ Web App │  │ Mobile  │             │
│   └─────────┘  └─────────┘             │
│   ┌─────────┐  ┌─────────┐             │
│   │ API/SaaS│  │ Desktop │             │
│   └─────────┘  └─────────┘             │
│                                         │
├─────────────────────────────────────────┤
│   [← Back]              [Next Step →]   │
└─────────────────────────────────────────┘
```

#### Wizard Steps

| Step | Question | Input Type | Options |
|:-----|:---------|:-----------|:--------|
| 1 | What are you building? | Card select (single) | Web App, Mobile App, API/SaaS, Desktop App, CLI Tool, Browser Extension |
| 2 | What's the primary use case? | Card select (single) | E-commerce, Social/Community, Productivity, Content/Blog, Analytics, Marketplace, AI/ML, Other (text) |
| 3 | Team size & timeline? | Form | Team size (1, 2-5, 5-20, 20+), Timeline (1-2 weeks, 1 month, 3 months, 6+ months) |
| 4 | Budget for tools & infra? | Slider + cards | $0 (free only), $1-50/mo, $50-200/mo, $200-500/mo, $500+/mo |
| 5 | Preferences | Multi-select checkboxes | Open source preferred, TypeScript required, Serverless preferred, Vendor lock-in OK, Need real-time, Need offline support |
| 6 | Review & Generate | Summary + edit | Show all answers, allow edits, [Generate Stack] button |

#### States
- **Loading**: After "Generate" → full-screen loading with status messages ("Analyzing requirements…", "Assembling stack…", "Calculating costs…")
- **Error**: API failure → "Something went wrong. Try again?" with retry button
- **Success**: Redirect to `/project/:id` with generated stack

#### Navigation
- **Entry**: CTA from landing page, or "New Project" from dashboard
- **Exit**: Back to previous step, or forward to next step, or redirect to stack builder on completion
- **Back**: Returns to previous wizard step (state preserved)

---

### Screen: Stack Builder (Project View)

**Route**: `/project/:id`  
**Access**: Authenticated  
**Purpose**: Visual dashboard showing the complete assembled stack with drag-and-drop editing

#### Layout
```
┌─────────────────────────────────────────────────────┐
│ Logo  [Dashboard] [Catalog]  [Settings]  [Avatar]   │
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│  Tool     │   Stack Grid                            │
│  Sidebar  │   ┌──────────┐  ┌──────────┐           │
│           │   │ Frontend │  │ Backend  │           │
│  Search   │   │ [React]  │  │ [Node]   │           │
│  ────────│   └──────────┘  └──────────┘           │
│  Filter   │   ┌──────────┐  ┌──────────┐           │
│  by cat   │   │ Database │  │  Auth    │           │
│           │   │ [Supabase│  │ [Clerk]  │           │
│  ┌──────┐│   └──────────┘  └──────────┘           │
│  │Tool A││   ┌──────────┐  ┌──────────┐           │
│  └──────┘│   │ Hosting  │  │ CI/CD    │           │
│  ┌──────┐│   │ [Vercel] │  │ [GitHub] │           │
│  │Tool B││   └──────────┘  └──────────┘           │
│  └──────┘│                                         │
│  ┌──────┐│  ┌─────────────────────────────────┐    │
│  │Tool C││  │ Total: $47/mo  │ [Export] [Share]│    │
│  └──────┘│  └─────────────────────────────────┘    │
├───────────┴─────────────────────────────────────────┤
│  AI Recommendation Bar: "Based on your stack,       │
│  consider adding Sentry for monitoring" [Add]       │
└─────────────────────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Stack category slots | Drop zone | Accept dragged tool cards |
| Tool sidebar cards | Draggable | Drag to stack slots |
| Search bar | Input | Filter sidebar tools |
| Category filter | Pill buttons | Filter sidebar by category |
| Tool card in slot | Interactive card | Click → expand details, hover → show swap/remove |
| Cost summary bar | Sticky bar | Updates live as tools change, shows monthly total |
| Compare button | Button | Opens comparison overlay with selected tools |
| AI suggestion bar | Banner | Context-aware suggestions, [Add] or [Dismiss] |
| Export | Button | Download stack as PDF or Markdown |

#### States
- **Loading**: Skeleton grid with pulsing category slots
- **Empty**: "Start building! Drag tools from the sidebar or run the wizard." with CTA
- **Error**: Toast notification for save failures, retry action
- **Success**: Green checkmark toast on save

#### Navigation
- **Entry**: From wizard completion, or from dashboard project list
- **Exit**: Back to dashboard, or to catalog for browsing

---

### Screen: Tool Catalog

**Route**: `/catalog`  
**Access**: Public  
**Purpose**: Browse and search the complete tool database

#### Layout
```
┌─────────────────────────────────────────┐
│   Logo    [Search bar]     [Login]      │
├─────────────────────────────────────────┤
│   Category Pills:                       │
│   [All] [Frontend] [Backend] [DB] ...   │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────┐  ┌──────┐  ┌──────┐         │
│   │Logo  │  │Logo  │  │Logo  │         │
│   │Name  │  │Name  │  │Name  │         │
│   │Desc  │  │Desc  │  │Desc  │         │
│   │Price │  │Price │  │Price │         │
│   │[Comp]│  │[Comp]│  │[Comp]│         │
│   └──────┘  └──────┘  └──────┘         │
│                                         │
│   ┌──────┐  ┌──────┐  ┌──────┐         │
│   │ ...  │  │ ...  │  │ ...  │         │
│   └──────┘  └──────┘  └──────┘         │
│                                         │
│   [Load More / Pagination]              │
└─────────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Search bar | Input w/ autocomplete | Filters tools in real-time |
| Category pills | Toggle buttons | Filter by tool category |
| Tool card | Card | Shows logo, name, tagline, pricing, category badge |
| "Compare" checkbox | Checkbox on card | Select up to 3 for comparison |
| "Compare Selected" | Floating button | Appears when 2+ selected → opens comparison overlay |
| Pagination | Button | Load more results |

#### States
- **Loading**: Grid of skeleton cards
- **Empty**: "No tools found. Try a different search." with clear filters link
- **Error**: "Failed to load tools. Retry?" with retry button

---

### Screen: Compare Tools Overlay

**Route**: Modal overlay (no route change)  
**Access**: Public  
**Purpose**: Head-to-head comparison of 2-3 selected tools

#### Layout
```
┌─────────────────────────────────────────┐
│   Compare Tools                    [X]  │
├─────────────────────────────────────────┤
│   │ Tool A      │ Tool B      │ Tool C  │
│   │─────────────│─────────────│─────────│
│   │ Logo        │ Logo        │ Logo    │
│   │ Pricing     │ Pricing     │ Pricing │
│   │ Free Tier   │ Free Tier   │ Free T  │
│   │ GitHub ★    │ GitHub ★    │ GitHub  │
│   │ Learning    │ Learning    │ Learn   │
│   │ Pros        │ Pros        │ Pros    │
│   │ Cons        │ Cons        │ Cons    │
│   │ Best For    │ Best For    │ Best F  │
├─────────────────────────────────────────┤
│   [Add to Stack]                        │
└─────────────────────────────────────────┘
```

---

### Screen: Dashboard

**Route**: `/dashboard`  
**Access**: Authenticated  
**Purpose**: Overview of all saved projects

#### Layout
```
┌─────────────────────────────────────────┐
│   Logo   [Dashboard] [Catalog] [Avatar] │
├─────────────────────────────────────────┤
│                                         │
│   "Your Projects"        [+ New Project]│
│                                         │
│   ┌──────────────────────────────────┐  │
│   │ Project Name     │ 8 tools │ $47 │  │
│   │ Last edited: 2 days ago         │  │
│   └──────────────────────────────────┘  │
│   ┌──────────────────────────────────┐  │
│   │ Project Name     │ 5 tools │ $12 │  │
│   │ Last edited: 1 week ago         │  │
│   └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Project card | Clickable card | → /project/:id |
| "+ New Project" | Primary Button | → /wizard/project-type |
| Project menu (…) | Dropdown | Rename, Duplicate, Delete |

#### States
- **Loading**: Skeleton project cards
- **Empty**: "No projects yet. Create your first stack!" with CTA
- **Error**: "Failed to load projects" with retry

---

## 3. User Flows

### Flow 1: First-Time User Experience

```
Landing Page ("/")
    │
    ├── Clicks "Build Your Stack"
    │        │
    │   Wizard Step 1 → Step 2 → Step 3 → Step 4 → Step 5
    │        │
    │   Step 6 (Review) → Clicks "Generate Stack"
    │        │
    │   ├── Not logged in? → Redirect to /register
    │   │       │
    │   │   Register (email/Google) → redirect back to wizard
    │   │       │
    │   └── Logged in → AI generates stack (loading: 3-5s)
    │            │
    │       Stack Builder ("/project/:id")
    │            │
    │       User adjusts, saves → Dashboard
    │
    └── Clicks "Browse Tools"
             │
         Catalog → Compare → Add to Stack → [needs auth]
```

### Flow 2: Returning User — New Project

```
Login ("/login")
    │
    ├── Dashboard ("/dashboard")
    │       │
    │   Clicks "+ New Project"
    │       │
    │   Wizard → Generate → Stack Builder
    │       │
    │   Save → Dashboard (now shows 2 projects)
```

### Flow 3: Returning User — Direct Browse & Compare

```
Dashboard
    │
    ├── Clicks "Catalog" in nav
    │       │
    │   Browse tools → Filter "Database"
    │       │
    │   Select 3 tools → Click "Compare"
    │       │
    │   Compare overlay → Click "Add to Stack"
    │       │
    │   Select project → Tool added → redirect to Stack Builder
```

### Flow 4: Authentication Flow
```
Login Screen
    │
    ├── Email/Password
    │   ├── Valid → Dashboard
    │   ├── Wrong password → Error message + "Forgot password?"
    │   └── Email not found → "No account. Sign up?"
    │
    ├── Google OAuth
    │   ├── Success → Dashboard (auto-create account if new)
    │   └── Cancelled → Stay on Login
    │
    └── Forgot Password
        ├── Send reset email → Confirmation message
        └── Error → "Email not found"
```

### Flow 5: Settings & Account
```
Settings Screen
    ├── Profile
    │   ├── Edit display name
    │   └── Change avatar
    ├── Account
    │   ├── Change password
    │   ├── Manage subscription (upgrade/downgrade)
    │   └── Delete account (with "type DELETE to confirm")
    ├── Preferences
    │   ├── Theme (Light/Dark/System)
    │   └── Default currency (USD/EUR/GBP)
    └── Sign Out (immediate, no confirmation)
```

---

## 4. State Transitions

### Authentication States
```
ANONYMOUS → REGISTERED → VERIFIED → AUTHENTICATED
                                         ↕
                                    SIGNED_OUT
```

### Data States (per entity)
```
LOADING → LOADED → STALE → REFRESHING → LOADED
              ↓
           EMPTY
              ↓
         ERROR → RETRY → LOADING
```

### AI Recommendation States
```
IDLE → GENERATING (questionnaire submitted)
           ↓
    STREAMING (results arriving)
           ↓
    COMPLETE (all recommendations ready)
           ↓
    MODIFIED (user swapped tools)
           ↓
    SAVED (persisted to project)
```

---

## 5. Error Handling UX

| Error Type | User-Facing Message | Action |
|:-----------|:---------------------|:-------|
| Network offline | "No internet connection. Check your network." | Retry button |
| Auth expired | "Session expired. Please log in again." | Redirect to /login |
| AI generation failed | "We couldn't generate recommendations. Try again?" | Retry button on wizard |
| Server error | "Something went wrong on our end." | Retry button + support email |
| Not found | "This page doesn't exist." | Back to dashboard |
| Rate limited | "You've hit the free limit. Upgrade to Pro." | Upgrade CTA |
| Tool data stale | "Pricing may be outdated. Verify on [tool] website." | Link to official site |

---

## 6. Deep Linking

| Link Pattern | Target Screen | Parameters |
|:-------------|:--------------|:-----------|
| `/project/:id` | Stack Builder | `id` (project UUID) |
| `/catalog/tool/:slug` | Tool Detail | `slug` (tool name) |
| `/catalog/:category` | Catalog filtered | `category` name |
| `/wizard` | Wizard Step 1 | — |
| `/shared/:shareId` | Read-only stack view | `shareId` (public link) |

---
