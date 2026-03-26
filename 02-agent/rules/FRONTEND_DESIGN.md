# Frontend Design Expertise & Standards

When implementing frontend components in this project, NEVER settle for a basic, default UI. We must output premium, stunning, and professional web designs. 

## 1. Aesthetic Guidelines
- **Premium Feel**: Avoid generic HTML aesthetics. Use rich layouts with ample whitespace, refined typography (Inter, Roboto, SF Pro), and polished structural elements.
- **Glassmorphism & Depth**: Make use of subtle shadows (`shadow-sm`, `shadow-md`), backdrop blurs, and border opacities (e.g. `border-white/10`) to create depth.
- **Color Mastery**: 
  - Never use plain CSS colors (`red`, `blue`). Rely on Tailwinds extensive palettes.
  - Apply gradients (`bg-gradient-to-r`, `bg-clip-text text-transparent`) for primary elements and typography accents.
  - Ensure high contrast for text (WCAG AA). 

## 2. Dynamic Interactions
- **Micro-animations**: Elements should respond to user action. 
  - Buttons: `transition-transform active:scale-95 hover:bg-opacity-90`
  - Cards: `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`
- **Loading States**: Replace native spinners with skeleton UI shimmers to make loading feel faster and more integrated.
- **Delight**: Use Lucide icons creatively. Add interactive hover tooltips or subtle color shifts.

## 3. Implementation Rules
- Always use utility classes systematically.
- Favor standard components (e.g., from generic Shadcn UI if available or replicate their polish) over doing everything raw.
- Mobile responsiveness (`sm:`, `md:`, `lg:`) is mandatory for all elements, not an afterthought.

## 4. Code Review (Frontend specifically)
- Are Tailwind class sizes getting too long? Extract into variants.
- Are components using hardcoded hex values instead of theme variables? Use CSS vars like `var(--foreground)` or `var(--primary)`.
