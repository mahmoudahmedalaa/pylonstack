# Design System & Frontend Guidelines Generator

> **Skill:** Automatically research, select, and document the complete frontend design system for any mobile/web project.

## When to Use This Skill

Use this skill during **Step 2 of Documentation Generation** when creating `FRONTEND_GUIDELINES.md` and selecting the UI library stack. This skill ensures every project gets a psychology-informed, library-first design system instead of generic defaults.

---

## The Process

### Step 1: Context Gathering
Before any research, absorb the project context:
- Read `01-docs/PRD.md` — understand the domain, users, and features
- Read `01-docs/TECH_STACK.md` — understand the platform (React Native, web, etc.)
- Read `00-research/` — understand target users, their demographics, income, pain points
- Review any Figma designs — understand the visual direction (but don't be bound by it)

### Step 2: Domain-Specific Color Research
Research color psychology for the **specific domain** of the project:

**Search queries to run:**
```
"[domain] app color psychology trust UX best practices"
"[domain] mobile app design trends [current year]"
"best [platform] UI library [domain] app [current year] modern premium"
```

**Key questions to answer:**
- What colors convey trust/reliability in this domain? (e.g., blue for finance, green for health)
- What do the top 5 apps in this space look like? (analyze competitors)
- What emotions should the UI evoke? (calm for medical, energetic for fitness, trustworthy for finance)
- Should it default to dark mode or light mode? (dark = premium, light = clinical/clean)

### Step 3: Library Selection
For each UI need, find the **best existing library** instead of building custom:

**Categories to evaluate (minimum):**
| Need | What to Look For |
|:-----|:----------------|
| UI Framework | Material Design, Eva Design, or unstyled components? Match to domain |
| Styling | Utility-first (NativeWind/Tailwind) vs design-system (Tamagui) vs manual StyleSheet |
| Charts/Data Viz | Does the app show data? Find the best visualization library |
| Animations | 60fps requirement? Reanimated vs Animated API |
| Forms | Complex forms? React Hook Form + Zod vs simple useState |
| Bottom Sheets | Needed for detail views? @gorhom/bottom-sheet is the standard |
| Icons | Match to UI framework — MaterialCommunityIcons, Lucide, Phosphor |
| Loading States | Skeleton shimmer (Moti), spinners, content placeholders |
| Toasts/Alerts | Built-in (Paper Snackbar) vs dedicated (react-native-toast-message) |
| Date/Time | date-fns (tree-shakeable) vs dayjs vs moment (avoid moment) |
| Currency/Numbers | Intl.NumberFormat (built-in) with locale configuration |
| Haptics | expo-haptics for tactile feedback on key actions |
| Blur/Glass | expo-blur for premium glassmorphism effects |
| Secure Storage | expo-secure-store for tokens, sensitive data |
| Gradients | expo-linear-gradient for premium backgrounds |
| Micro-animations | lottie-react-native for complex authored animations |

**Selection criteria (in order):**
1. **Actively maintained** — last commit < 3 months ago
2. **Community size** — >1K GitHub stars preferred
3. **Expo compatible** — if using Expo, must work without ejecting
4. **Bundle size** — smaller is better, check bundlephobia
5. **TypeScript** — must have TypeScript types
6. **Accessibility** — must support screen readers, dynamic type

### Step 4: Build the Color System
Create a **full token-based color palette** with:

```
Primary palette (brand color, 50-900 scale for light + dark mode)
Success color (positive outcomes, growth, confirmation)
Warning color (caution, attention needed)
Error color (validation errors, failures)
Neutral palette (backgrounds, text, borders — 50-900 scale)
Semantic mappings (what each color MEANS in context)
```

**Rules:**
- Always define both light AND dark mode values
- Use HSL notation for easy manipulation
- Test contrast ratios (WCAG AA minimum: 4.5:1 for text)
- Domain-specific colors (e.g., green for money gains in fintech, red for losses)

### Step 5: Typography Scale
Define typography using platform-native fonts + a monospace option:

```
Display (32px) — Hero metrics, large numbers
H1 (24px) — Page titles
H2 (20px) — Section headers
H3 (17px) — Card titles
Body (15px) — Default text
Caption (13px) — Secondary info, timestamps
Mono (varies) — Numbers that need alignment (prices, scores, data)
```

**Rules:**
- Use SF Pro (iOS) / Roboto (Android) as defaults, or Inter cross-platform
- Monospace font for any columnar data (financial amounts, tables, codes)
- Define line heights for each scale step

### Step 6: Component Patterns
Document 3-5 **key component patterns** specific to the domain using ASCII art:

```
Example for a fintech card:
┌────────────────────────────────┐
│ 🏦 Bank Logo    Bank Name     │
│────────────────────────────────│
│ Loan Type                      │
│ AED 45,000    remaining        │
│ 14.5% APR  •  24mo left       │
│────────────────────────────────│
│ ▓▓▓▓▓▓▓▓░░░░  65% paid       │
│────────────────────────────────│
│ [Action CTA →]                │
└────────────────────────────────┘
```

### Step 7: Animation Guidelines
Define animation durations, easings, and which interactions get animations:

| Type | Duration | When to Use |
|:-----|:---------|:------------|
| Micro (press feedback) | 100ms | Button presses, toggles |
| Transition (screen) | 250-300ms | Navigation, modals |
| Data (count-up) | 800-1200ms | Revealing important numbers |
| Celebration | 1500-2000ms | Success states, achievements |
| Skeleton | Infinite loop | Content loading |

### Step 8: Accessibility Checklist
Include minimum accessibility requirements:
- Color contrast (WCAG AA)
- Touch targets (44x44pt minimum — Apple HIG)
- Screen reader labels on all interactive elements
- Dynamic Type support (iOS)
- Reduced motion preference support
- RTL support (if targeting Arabic/Hebrew markets)

### Step 9: Design Benchmarks
List 3-5 real apps in the same domain as **design benchmarks**, with what to learn from each:

```
| App | What to Learn |
| [Top competitor] | [Specific design pattern] |
| [Adjacent domain leader] | [Specific UX innovation] |
```

---

## Output: FRONTEND_GUIDELINES.md

The generated document should have these sections:
1. Design Principles (5-6 principles specific to the domain)
2. Color System (full token palette with psychology rationale)
3. Typography Scale
4. Library Stack (every library with version, purpose, and why chosen)
5. Component Patterns (ASCII art for key UI patterns)
6. Spacing & Layout System
7. Animation Guidelines
8. Accessibility Checklist
9. Responsive Design breakpoints
10. Design Inspiration & Benchmarks

---

## Also Generate: DEVELOPMENT_PRINCIPLES.md

Create a persistent rules file at `02-agent/rules/DEVELOPMENT_PRINCIPLES.md` that captures:
1. Library-first development — always use packages over custom code
2. Domain-appropriate UI/UX — informed by research, not defaults
3. Figma as guide, not law — designs are inspiration, exceed them
4. Quality standards specific to the domain (e.g., BIGINT for money in fintech)
5. Platform-specific rules (iOS-first = Apple HIG, Xcode builds, etc.)
