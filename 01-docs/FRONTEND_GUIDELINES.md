# Frontend Design System & Guidelines

> Every visual decision locked down. Fonts, colors, spacing, components. AI builds components exactly to this spec.

## 1. Design Principles

1. **Technical Premium** — The UI should feel like a high-end developer tool (think Linear, Vercel dashboard). Dark mode default, clean lines, purposeful whitespace.
2. **Data-Dense but Clear** — Tool cards, comparison tables, and cost summaries contain a lot of data. Use hierarchy, spacing, and typography to make it scannable.
3. **Interactive & Alive** — Drag-and-drop, hover reveals, smooth transitions. The stack builder should feel tactile and satisfying.
4. **Accessibility** — WCAG 2.1 Level AA compliance. Keyboard-navigable, screen reader friendly.

---

## 2. Design Tokens

### Color Palette

#### Primary Colors (Electric Indigo)
```css
--color-primary-50:  #EEF2FF;
--color-primary-100: #E0E7FF;
--color-primary-200: #C7D2FE;
--color-primary-300: #A5B4FC;
--color-primary-400: #818CF8;
--color-primary-500: #6366F1;  /* Main brand color */
--color-primary-600: #4F46E5;
--color-primary-700: #4338CA;
--color-primary-800: #3730A3;
--color-primary-900: #312E81;
```

#### Accent Colors (Emerald — for costs, savings, positive signals)
```css
--color-accent-400: #34D399;
--color-accent-500: #10B981;
--color-accent-600: #059669;
```

#### Neutral Colors (Slate — dark mode optimized)
```css
--color-neutral-50:  #F8FAFC;  /* Light mode background */
--color-neutral-100: #F1F5F9;
--color-neutral-200: #E2E8F0;  /* Borders (light mode) */
--color-neutral-300: #CBD5E1;
--color-neutral-400: #94A3B8;  /* Placeholder text */
--color-neutral-500: #64748B;  /* Secondary text */
--color-neutral-600: #475569;
--color-neutral-700: #334155;  /* Primary text (dark mode) */
--color-neutral-800: #1E293B;  /* Card backgrounds (dark mode) */
--color-neutral-850: #172033;  /* Elevated surfaces (dark mode) */
--color-neutral-900: #0F172A;  /* Page background (dark mode) */
--color-neutral-950: #020617;  /* Deepest background */
```

#### Semantic Colors
```css
--color-success: #22C55E;  /* Confirmed, compatible */
--color-warning: #F59E0B;  /* Caution, potential issues */
--color-error:   #EF4444;  /* Errors, incompatible */
--color-info:    #3B82F6;  /* Informational, tips */
```

### Typography
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--text-xs:   0.75rem;   /* 12px — labels, badges */
--text-sm:   0.875rem;  /* 14px — secondary text, table rows */
--text-base: 1rem;      /* 16px — body text */
--text-lg:   1.125rem;  /* 18px — card titles */
--text-xl:   1.25rem;   /* 20px — section headers */
--text-2xl:  1.5rem;    /* 24px — page titles */
--text-3xl:  1.875rem;  /* 30px — hero heading */
--text-4xl:  2.25rem;   /* 36px — landing hero */
--text-5xl:  3rem;      /* 48px — hero statement */

--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing Scale
```css
--spacing-0.5: 0.125rem; /* 2px  */
--spacing-1:   0.25rem;  /* 4px  */
--spacing-1.5: 0.375rem; /* 6px  */
--spacing-2:   0.5rem;   /* 8px  */
--spacing-3:   0.75rem;  /* 12px */
--spacing-4:   1rem;     /* 16px — default component padding */
--spacing-5:   1.25rem;  /* 20px */
--spacing-6:   1.5rem;   /* 24px — card padding */
--spacing-8:   2rem;     /* 32px — section spacing */
--spacing-10:  2.5rem;   /* 40px */
--spacing-12:  3rem;     /* 48px */
--spacing-16:  4rem;     /* 64px — page section gaps */
--spacing-20:  5rem;     /* 80px */
--spacing-24:  6rem;     /* 96px */
```

### Border Radius & Shadows
```css
--radius-sm:   0.25rem;   /* 4px  — tags, badges */
--radius-base: 0.375rem;  /* 6px  — inputs */
--radius-md:   0.5rem;    /* 8px  — buttons */
--radius-lg:   0.75rem;   /* 12px — cards */
--radius-xl:   1rem;      /* 16px — modals */
--radius-2xl:  1.5rem;    /* 24px — large containers */
--radius-full: 9999px;    /* pills, avatars */

/* Dark mode optimized shadows (subtle glow instead of drop shadow) */
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md:  0 4px 6px rgba(0, 0, 0, 0.25);
--shadow-lg:  0 10px 25px rgba(0, 0, 0, 0.3);
--shadow-xl:  0 20px 50px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.15);  /* Primary glow for active/hover */
--shadow-card: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 4px rgba(0, 0, 0, 0.2);
```

---

## 3. Component Specifications

### Buttons

| Variant | Use Case | Style | Limit |
|:--------|:---------|:------|:------|
| **Primary** | Main CTA ("Build Your Stack", "Generate") | Solid primary-500, white text | One per section |
| **Secondary** | Supporting actions ("Compare", "Export") | Ghost/outline, primary border | As needed |
| **Danger** | Destructive ("Delete Project") | Solid error, white text | Always with confirmation modal |
| **Ghost** | Subtle actions ("Cancel", navigation) | Transparent, text color on hover | As needed |

**States**: Default → Hover (lighten 10%) → Active (darken 5%) → Focus (2px primary ring, offset 2px) → Disabled (50% opacity, no pointer) → Loading (spinner replaces text)

**Sizes**: `sm` (h-8, px-3, text-sm) · `md` (h-10, px-4, text-sm) · `lg` (h-12, px-6, text-base)

### Tool Cards (Catalog & Sidebar)
- Background: `neutral-800` (dark mode)
- Border: 1px `neutral-700/50`
- Padding: `spacing-4`
- Border radius: `radius-lg`
- Hover: `shadow-glow` + border brightens to `neutral-600`
- Contains: tool logo (32×32), name, category badge, pricing pill
- Draggable variant: cursor grab, slight scale(1.02) on drag start

### Stack Slot Cards (Builder Grid)
- Background: `neutral-850` with dashed border when empty
- Border: 2px dashed `neutral-600` (empty) → solid `primary-500/30` (filled)
- Padding: `spacing-6`
- Border radius: `radius-xl`
- Drop target hover: `primary-500/10` background, border becomes solid `primary-400`
- Filled state: shows tool logo (48×48), name, pricing, mini "swap" and "remove" icons on hover

### Inputs
- Background: `neutral-800`
- Border: 1px `neutral-600`
- Text: `neutral-100`
- Placeholder: `neutral-400`
- Focus: 2px `primary-500` ring
- Error: border becomes `error`, error message below in `text-sm`
- Border radius: `radius-base`
- Height: 40px (default)

### Modals (Comparison Overlay)
- Overlay: `neutral-950/80` backdrop-blur
- Content: `neutral-850` background, max-width 64rem, centered
- Border radius: `radius-xl`
- Actions: right-aligned (Cancel secondary, Confirm primary)
- Close: X button top-right + click overlay + Escape key
- Focus trap required
- Entrance animation: fade + scale from 0.95

### Cards (Generic)
- Background: `neutral-800`
- Border: 1px `neutral-700/50`
- Padding: `spacing-6`
- Border radius: `radius-lg`
- Hover: `shadow-card` transition (200ms ease)

### Wizard Step Cards (Selection Options)
- Background: `neutral-800`
- Border: 2px `neutral-700` → `primary-500` when selected
- Padding: `spacing-5`
- Border radius: `radius-lg`
- Selected state: `primary-500/10` background, `primary-500` border, check icon
- Hover: border `neutral-500`, slight scale(1.01)

### Cost Summary Bar
- Position: sticky bottom of stack builder
- Background: `neutral-850` with top border `neutral-700`
- Contains: total cost (large, `accent-500` color), per-category breakdown, currency toggle
- Height: 64px
- Animate cost changes with spring animation

---

## 4. Accessibility Checklist (WCAG 2.1 AA)

- [ ] Color contrast: 4.5:1 for normal text, 3:1 for large text (verified with dark mode palette)
- [ ] All interactive elements keyboard accessible (tab, enter, escape)
- [ ] Focus indicators visible (2px primary ring, 2px offset — never `outline: none`)
- [ ] Tab order logical (follows visual layout)
- [ ] Drag-and-drop has keyboard alternative (select → move via arrow keys or dropdown)
- [ ] Tool logos have descriptive `alt` text
- [ ] Icon-only buttons have `aria-label`
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages announced via `aria-live="assertive"`
- [ ] Touch targets minimum 44×44px
- [ ] Comparison table has proper `scope` attributes on headers
- [ ] Loading states announced to screen readers

---

## 5. Animation Guidelines

- **Duration**: 150ms for micro-interactions (hover, focus), 200ms default, 300ms for modals/overlays, 500ms max for page transitions
- **Easing**: `ease-out` (cubic-bezier(0, 0, 0.2, 1)) for entrances, `ease-in` for exits, `spring` for drag-and-drop
- **Animate only**: `transform`, `opacity`, `background-color`, `border-color`, `box-shadow` — never layout properties
- **Drag-and-drop**: scale(1.05) + shadow-lg on drag, spring settle on drop
- **Cost counter**: number ticker animation when total changes
- **AI generation**: pulsing gradient skeleton + status text rotation
- **Respect**: `prefers-reduced-motion` — disable all animations except essential state changes

---

## 6. Responsive Breakpoints

```css
--breakpoint-sm:  640px;   /* Mobile landscape */
--breakpoint-md:  768px;   /* Tablet */
--breakpoint-lg:  1024px;  /* Desktop (sidebar collapses below this) */
--breakpoint-xl:  1280px;  /* Wide desktop (default layout) */
--breakpoint-2xl: 1536px;  /* Ultra-wide */
```

**Desktop-first approach** (primary use case is desktop), with responsive degradation:
- **≥1280px**: Full layout — sidebar + grid + cost bar
- **1024–1279px**: Sidebar collapsible via toggle button
- **768–1023px**: Sidebar becomes bottom sheet, 2-column grid
- **<768px**: Single column, no drag-and-drop (tap-to-select instead), simplified cards

---

## 7. Theme

### Default: Dark Mode
Dark mode is the primary theme (developer tools convention). Light mode available via toggle.

| Token | Dark Mode | Light Mode |
|:------|:----------|:-----------|
| Page background | `neutral-900` | `neutral-50` |
| Card background | `neutral-800` | `white` |
| Primary text | `neutral-100` | `neutral-900` |
| Secondary text | `neutral-400` | `neutral-500` |
| Borders | `neutral-700/50` | `neutral-200` |
| Elevated surface | `neutral-850` | `white` with shadow-md |

---
