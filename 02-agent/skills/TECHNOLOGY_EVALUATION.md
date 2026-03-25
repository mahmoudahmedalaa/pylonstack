---
name: technology-evaluation
description: Use this skill BEFORE selecting any technology, library, or tool. Forces structured, objective evaluation instead of defaulting to familiar options. Named after the principle that every choice must survive scrutiny.
---

# Technology Evaluation Protocol

> **Never default. Never assume. Evaluate every option as if your credibility depends on it — because it does.**

---

## When to Use This Skill

Trigger this evaluation for:
- Selecting a UI component library
- Choosing a state management approach
- Picking a backend/BaaS platform
- Selecting animation, charting, form, or utility libraries
- Any decision where multiple viable options exist
- Any time you catch yourself thinking "I usually use X" — that's the signal to STOP and evaluate

---

## The Evaluation Process

### Step 1: Define the Context

Before looking at ANY libraries, answer these questions:

```
PROJECT CONTEXT
├── Platform: [iOS-only? Cross-platform? Web?]
├── Domain: [Fintech? Social? Healthcare? E-commerce?]
├── Target Users: [Demographics, devices, expectations]
├── Design Goal: [Premium? Playful? Minimal? Data-dense?]
├── Scale: [MVP? Production? Enterprise?]
├── Budget: [Free tier? Paid OK? Enterprise licenses?]
└── Aesthetic Benchmarks: [3-5 apps users already love in this space]
```

**Why this matters:** A social media app and a fintech app have completely different library needs — even if the tech stack is identical. An iOS-first app should NEVER default to Android-aesthetic libraries.

### Step 2: Identify ALL Viable Candidates

> [!CAUTION]
> **Do NOT skip this step.** Your first instinct is usually the most popular option, not the best one.

For each technology decision, identify at minimum:
- 3-5 candidates for major decisions (UI framework, backend, state management)
- 2-3 candidates for minor decisions (date library, icon set)

**Search sources:**
1. GitHub trending for the category
2. npm trends comparison (npmtrends.com)
3. Reddit r/reactnative, r/expo discussions from the last 6 months
4. Framework-specific community recommendations (Expo docs, etc.)
5. Production apps in the same domain — what do THEY use?

### Step 3: Eliminate Non-Starters

Before deep evaluation, remove options that don't meet basic requirements:

| Criterion | Minimum Bar |
|:----------|:-----------|
| **Platform compatibility** | Must work with your framework (e.g., must be React Native, not web-only) |
| **TypeScript support** | First-class types, not `@types/` afterthought |
| **Maintenance** | Active commits within last 3 months |
| **Community** | >500 GitHub stars for niche, >2K for core libraries |
| **Framework support** | Must work with Expo (if using Expo) without ejection |

**Document eliminations with reason:**
```
ELIMINATED
├── shadcn/ui → Web-only, does not support React Native
├── Framework7 → Cordova/Capacitor, not React Native
├── Library X → Last commit 14 months ago, 23 open issues with no response
└── Library Y → Requires ejection from Expo managed workflow
```

### Step 4: Deep Evaluation Matrix

For each surviving candidate, score across these dimensions:

| Dimension | Weight | What to Evaluate |
|:----------|:-------|:-----------------|
| **Domain Fit** | 25% | Does it match your domain's aesthetic? A Material Design library is wrong for an iOS-first premium fintech app. A playful library is wrong for healthcare. |
| **Customizability** | 20% | Can you make it look like YOUR app, not a template? Unstyled > opinionated for premium products. |
| **DX & Docs** | 15% | Quality of documentation. Getting-started experience. Migration guides. |
| **Community & Support** | 15% | GitHub stars, npm weekly downloads, Stack Overflow answers, Discord activity. |
| **Performance** | 10% | Bundle size, runtime overhead, animation FPS on low-end devices. |
| **Accessibility** | 10% | WAI-ARIA compliance, screen reader support, RTL support (if needed). |
| **Future-Proofing** | 5% | Roadmap alignment, framework support trajectory, bus factor (solo maintainer?). |

**Score each 1-5:**
```
EVALUATION MATRIX — UI Component Library
┌────────────────────┬───────────┬───────────┬───────────┬───────────┐
│ Dimension (Weight) │ Option A  │ Option B  │ Option C  │ Option D  │
├────────────────────┼───────────┼───────────┼───────────┼───────────┤
│ Domain Fit (25%)   │ 3/5       │ 5/5       │ 4/5       │ 5/5       │
│ Custom (20%)       │ 2/5       │ 5/5       │ 5/5       │ 4/5       │
│ DX & Docs (15%)    │ 5/5       │ 4/5       │ 3/5       │ 3/5       │
│ Community (15%)    │ 5/5       │ 4/5       │ 4/5       │ 2/5       │
│ Performance (10%)  │ 4/5       │ 4/5       │ 5/5       │ 4/5       │
│ A11y (10%)         │ 5/5       │ 4/5       │ 3/5       │ 4/5       │
│ Future (5%)        │ 5/5       │ 4/5       │ 3/5       │ 3/5       │
├────────────────────┼───────────┼───────────┼───────────┼───────────┤
│ WEIGHTED TOTAL     │ 3.75      │ 4.50      │ 4.00      │ 3.70      │
└────────────────────┴───────────┴───────────┴───────────┴───────────┘
WINNER: Option B
```

### Step 5: The "3 Questions" Gut Check

After scoring, answer these honestly:

1. **"Am I picking this because it's familiar, or because it's best?"**
   - If you've used it before, that's a bias — not a reason. Score it anyway.
   
2. **"Would a premium app in this domain use this library?"**
   - Search for real apps. Do Revolut, Robinhood, Wise use Material Design? No. Do they use unstyled custom components? Yes.
   
3. **"If the user hired a senior React Native developer tomorrow, would they agree with this choice?"**
   - If a specialist would push back, you should push back on yourself first.

### Step 6: Document the Decision

Every technology choice must be documented with:

```markdown
## [Category]: [Chosen Library]

**Selected:** [Library Name] v[X.Y.Z]
**Runner-up:** [Library Name] — [one-line reason it lost]

**Why chosen:**
- [Reason 1 tied to project context]
- [Reason 2 tied to domain fit]
- [Reason 3 tied to evaluation criteria]

**Why NOT [most popular alternative]:**
- [Specific reason, not "I prefer X"]

**Risk:**
- [Known limitation or concern]
- [Mitigation plan]
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | What It Looks Like | What to Do Instead |
|:-------------|:-------------------|:-------------------|
| **Popularity Bias** | "React Native Paper has 12K stars so it's the best" | Stars ≠ fit. Evaluate against YOUR project's needs. |
| **Familiarity Bias** | "I always use Redux, let's use Redux" | Score it in the matrix. If it wins fairly, fine. If not, switch. |
| **Tutorial Bias** | "Every tutorial uses X, so it must be right" | Tutorials optimize for learning speed, not production quality. |
| **Feature Count Bias** | "Library A has 50 components, Library B has 20" | Do you need 50? Or do 20 well-built ones cover your use case? |
| **Premature Elimination** | "I haven't heard of it, skip" | If it meets the basic criteria, it deserves a row in the matrix. |
| **Aesthetic Mismatch Blindness** | "It works fine" while shipping a Material Design app to iOS users | Domain fit has the HIGHEST weight (25%) for a reason. |

---

## Quick Reference: Domain → Aesthetic Fit

| App Domain | Aesthetic Goal | Good Fit | Bad Fit |
|:-----------|:---------------|:---------|:--------|
| **Fintech** | Premium, trust, clean data | Unstyled (gluestack, Tamagui), custom | Material Design (too Android), generic |
| **Social/Consumer** | Playful, fast, familiar | Any well-styled library; custom is overkill | Enterprise-looking components |
| **Healthcare** | Calm, accessible, clinical | Unstyled + careful custom, accessibility-first | Playful/colorful, animation-heavy |
| **Enterprise/B2B** | Functional, data-dense, professional | Material Design, Ant Design equivalents | Consumer-grade, animation-heavy |
| **E-Commerce** | Visual, product-focused, conversion-optimized | Custom, brand-aligned | Generic, data-oriented |

---

## Integration with Project Setup

This evaluation should happen BEFORE writing `base.md`:

```
Project Setup Flow
├── 1. Read PRD / requirements
├── 2. Run TECHNOLOGY_EVALUATION for each stack decision
│   ├── Backend (Supabase vs Firebase vs Custom)
│   ├── UI library (evaluated objectively)
│   ├── State management
│   ├── Navigation
│   └── Supporting libraries
├── 3. Document decisions in TECH_STACK.md
├── 4. Lock decisions in .agent/rules/base.md
├── 5. Run DESIGN_SYSTEM_GENERATOR skill
└── 6. Begin implementation
```

> [!IMPORTANT]
> Once a technology is locked in `base.md`, it stays locked unless the user explicitly requests re-evaluation. But the INITIAL lock must survive this evaluation process.
