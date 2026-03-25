---
name: Next.js 15 + Tailwind CSS 4 + shadcn/ui
description: Best practices for building with Next.js App Router, Tailwind CSS v4, and shadcn/ui. Compiled from official docs and PatrickJS/awesome-cursorrules (38k+ stars).
---

# Next.js 15 + Tailwind CSS 4 + shadcn/ui

> Compiled from official Next.js docs, shadcn/ui docs, and [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) (38k+ stars).

---

## Code Style & Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Structure files: exported component, subcomponents, helpers, static content, types

### File Organization
```
src/
├── app/           # Next.js App Router pages + layouts
├── components/
│   ├── ui/        # shadcn/ui primitives
│   ├── layout/    # Header, Sidebar, Footer
│   └── [feature]/ # Feature-specific components
├── lib/           # Utilities, API clients, configs
├── hooks/         # Custom React hooks
├── stores/        # State management (Zustand)
└── types/         # TypeScript type definitions
```

---

## TypeScript Rules

- Use TypeScript for ALL code; prefer `interface` over `type`
- Avoid `enum` — use `as const` objects or maps instead
- Use functional components with TypeScript interfaces for props
- Enable strict mode in `tsconfig.json`
- Use absolute imports with `@/` prefix
- Export types and interfaces from `types/` directory

```typescript
// ✅ Correct
interface ToolCardProps {
  tool: Tool
  variant?: 'catalog' | 'sidebar' | 'draggable'
  onSelect?: (tool: Tool) => void
}

// ❌ Avoid enums
enum Status { Active, Inactive } // Don't do this

// ✅ Use const objects instead
const STATUS = { Active: 'active', Inactive: 'inactive' } as const
type Status = typeof STATUS[keyof typeof STATUS]
```

---

## Naming Conventions

- **Directories**: lowercase with dashes (`tool-catalog/`, `stack-builder/`)
- **Components**: PascalCase (`ToolCard.tsx`, `StackSlot.tsx`)
- **Hooks**: camelCase with `use` prefix (`useToolSearch.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TOOLS_PER_SLOT`)
- Favor **named exports** for components

---

## Next.js App Router Patterns

### Server vs Client Components
- **Default to Server Components** — minimize `'use client'` directives
- Client components only when needed: interactivity, hooks, browser APIs
- Move client logic to leaf components (keep parents as server components)

```typescript
// ✅ Server Component (default) — no 'use client'
export default async function CatalogPage() {
  const tools = await getTools() // Direct DB/API call
  return <ToolGrid tools={tools} />
}

// ✅ Client component only for interactivity
'use client'
export function ToolSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  // ...
}
```

### Data Fetching
- Fetch data in Server Components using `async/await`
- Use React `Suspense` with fallbacks for client components
- Use `loading.tsx` for route-level loading states
- Use `error.tsx` for route-level error boundaries

### Route Handlers (API Routes)
```typescript
// app/api/tools/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Use searchParams for query params
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  // ...
  return NextResponse.json(data)
}
```

### URL State Management
- Use `nuqs` for URL search parameter state management
- Implement proper loading and error states for each route segment

---

## Tailwind CSS v4

### Key Differences from v3
- **CSS-first configuration** — no `tailwind.config.js` needed
- Use `@import "tailwindcss"` in your CSS
- Design tokens defined via CSS custom properties in `@theme` block
- No more `@apply` needed for custom utilities
- Automatic content detection (no `content` array)

```css
/* globals.css — Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.637 0.237 275);
  --color-background: oklch(0.145 0.014 285);
  --color-surface: oklch(0.185 0.017 285);
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Responsive Design
- Mobile-first approach: style mobile → add breakpoint prefixes for larger
- Use `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints
- Test on 320px, 768px, 1024px, 1440px

---

## shadcn/ui

### Installation & Usage
- Initialize: `npx shadcn@latest init`
- Add components: `npx shadcn@latest add button card dialog`
- Components go in `src/components/ui/`
- Customize via CSS variables and `cn()` utility

### Component Rules
- Always use shadcn/ui + Radix UI for interactive primitives
- Compose complex components from shadcn primitives
- Never modify files inside `components/ui/` — wrap and extend instead
- Use `cn()` from `lib/utils.ts` for conditional class merging

```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  glow?: boolean
}

export function CustomButton({ glow, className, ...props }: CustomButtonProps) {
  return (
    <Button
      className={cn(
        glow && 'shadow-[0_0_20px_rgba(99,102,241,0.4)]',
        className
      )}
      {...props}
    />
  )
}
```

### Dark Mode
- Use `next-themes` for theme switching
- Define dark mode colors as CSS custom properties
- Default to dark mode: `<ThemeProvider defaultTheme="dark">`

---

## Performance Optimization

1. **Minimize `'use client'`** — push interactivity to leaf components
2. **Use React Server Components** wherever possible
3. **Wrap client components in `Suspense`** with fallback UIs
4. **Image optimization**: always use `next/image` with width/height
5. **Font optimization**: use `next/font` for zero layout shift
6. **Dynamic imports** for heavy components: `dynamic(() => import(...))`
7. **Avoid barrel files** in component directories (kills tree-shaking)

---

## Accessibility Checklist

- Use semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- Include proper ARIA labels on interactive elements
- All form inputs must have associated labels
- Keyboard navigation must work on all interactive elements
- Focus indicators visible in both light and dark modes
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
- All images must have alt text

---
