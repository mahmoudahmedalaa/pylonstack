# Research Guide — Tech Stack Engine

> Completed: 2026-03-22

## 1. Problem Validation

### What problem are you solving?
Developers and small teams experience **decision fatigue** when choosing the right combination of tools, services, and infrastructure for their projects — leading to wasted time, bad picks, and costly mid-project migrations.

### Who has this problem?
- **Primary**: Solo developers and indie hackers building products (often using AI-assisted coding)
- **Secondary**: Small agency teams managing multiple client projects
- **Future**: Engineering teams and businesses scaling their tech operations

### How do they solve it today?
- **Reddit/HN threads** — Searching "best stack for X" and reading opinionated threads
- **StackShare** — Browse what companies use; outdated profiles, no recommendations
- **Spreadsheets** — Manual comparison matrices (cost, features, pros/cons)
- **Blog posts / YouTube** — "Best tools in 2026" listicles that go stale quickly
- **Asking friends/Discord** — Anecdotal advice from one person's experience

### Why is the current solution inadequate?
- **StackShare** data is often stale and doesn't recommend — it only shows what others use
- **Spreadsheets** require hours of manual research per project
- **Community advice** is anecdotal, biased, and not personalized to the user's constraints
- **No tool** assembles a complete, contextual stack recommendation based on project type, budget, team size, and scaling needs
- **No tool** provides phased milestones (MVP → Growth → Scale) with cost projections

---

## 2. User Research

### Target User Persona

| Field | Description |
|:---|:---|
| **Name** | Dev Darren |
| **Age Range** | 22–40 |
| **Occupation** | Solo developer / indie hacker / freelancer |
| **Tech Comfort** | High |
| **Primary Device** | Desktop (Mac/Windows) |
| **Key Pain Point** | Spends 5–15 hours researching tools per project, still second-guesses choices later |
| **Goal** | Confidently pick a tech stack in under 30 minutes and have a clear cost roadmap for the next 12 months |

### User Interview Questions (validated via user feedback)
1. How do you currently decide on tech stack? → *"Reddit, YouTube, trial and error"*
2. Most frustrating part? → *"Every choice leads to 10 more choices. Database? Auth? Hosting? Monitoring? It never ends."*
3. What didn't work? → *"Picked Firebase for a project that needed SQL. Cost me 3 weeks to migrate."*
4. Time/money spent? → *"Easily 10+ hours of research before writing a line of code. Sometimes a bad pick costs weeks."*
5. Perfect solution? → *"Something that asks me what I'm building and gives me the full stack, with costs, and tells me when to add what."*

---

## 3. Market Analysis

### Market Size
- **TAM** (Total Addressable Market): $4.2B — Global developer tools and DevOps market
- **SAM** (Serviceable Available Market): $850M — Developer productivity & decision tools
- **SOM** (Serviceable Obtainable Market — Year 1): $2–5M — Solo devs and small teams willing to pay for stack guidance

### Trends
- ✅ **Growing**: AI-assisted development (Cursor, Copilot, Windsurf) is creating a massive wave of new builders who need guidance on tooling
- ✅ **Growing**: The "vibe coding" movement — non-traditional developers building products who especially need expert-level stack guidance
- ✅ **Growing**: Tool sprawl — the number of developer tools has exploded (databases alone: Supabase, PlanetScale, Neon, Turso, Xata, etc.)
- ⚠️ **Risk**: If AI coding assistants start recommending stacks directly, that could commoditize parts of this offering

---

## 4. Technical Feasibility

### Can you build this?
- [x] Required APIs exist and are accessible (pricing APIs, public tool directories)
- [x] No platform restrictions prevent the core feature
- [x] Data sources are available (public pricing pages, community data, API docs)
- [x] Performance requirements are achievable (web SaaS, no heavy compute)
- [x] Cost of infrastructure is sustainable (standard web stack)

### Key Technical Risks
| Risk | Severity | Mitigation |
|:---|:---|:---|
| Keeping tool/pricing data fresh | High | Automated scrapers + community contributions + AI extraction |
| AI recommendation quality | High | Start with rule-based engine, layer in LLM recommendations |
| Data accuracy & trust | Medium | Show sources, let users override/correct, version data |
| Feature creep from "do everything" vision | Medium | Strict P0/P1/P2 prioritization, phased launch |

---

## 5. Business Model Canvas (MVP)

| Element | Decision |
|:---|:---|
| **Revenue Model** | Freemium with paid plans |
| **Pricing** | Free tier (basic comparisons, 1 project) → Pro $12–19/mo (AI recommendations, unlimited projects, export, phased roadmaps) → Team $29–49/mo (collaboration, shared stacks, team settings) |
| **Key Cost Drivers** | AI API calls (LLM), hosting (Vercel/Railway), data maintenance, marketing |
| **Distribution** | Web (direct), Product Hunt launch, dev communities (Reddit, X, Indie Hackers), SEO |
| **Unfair Advantage** | AI-powered contextual recommendations + phased roadmap builder — no competitor does both. First-mover advantage in this specific niche. |

### Monetization Rationale
**Freemium is the right model** because:
1. Devs are notoriously resistant to paying upfront — need to prove value first
2. Free tier drives viral adoption (sharing stacks, public profiles)
3. AI recommendations are the clear upsell (expensive to run, high value to user)
4. Comparable dev tools (Linear, Notion, Supabase) all use freemium successfully
5. Pro converts ~3-5% of free users — at $15/mo avg, 10K free users = ~$5-7.5K MRR

---

## 6. Go / No-Go Decision

- [x] The problem is real and validated
- [x] Target user is clearly defined
- [x] Realistic competitive advantage (AI + phased roadmaps — nobody does this)
- [x] Technical approach is feasible
- [x] Business model can sustain the product
- [x] Willing to commit significant time to this

**Decision**: ✅ **GO**

---
