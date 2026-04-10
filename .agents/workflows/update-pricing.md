---
description: Scan and update verified pricing for all 230+ tools in the catalog
---

# /update-pricing — Pricing Audit Workflow

Run this workflow with `@` mention and the command `/update-pricing` to perform a full pricing audit across all tools in the catalog.

## What This Workflow Does

1. Reads `src/data/tool-pricing-data.ts` to identify every tool in `TOOL_PRICING_MAP`
2. For each tool (grouped by category), performs an online search for the latest published pricing
3. Updates each tool's pricing tiers, `pricingModel`, `pricingUrl`, and sets `lastVerified` to today's date
4. Writes the updated file back and runs `tsc --noEmit` to verify no regressions

## Steps

### 1. Load the current pricing data

// turbo
Read the file `src/data/tool-pricing-data.ts` to understand the current state.

### 2. Audit pricing — Category by Category

For **each category** in `TOOL_PRICING_MAP`, do the following for every tool:

1. Use `search_web` to look up `"<ToolName> pricing 2026"` or visit `<pricingUrl>` if known
2. Compare the search results against the current `tiers` in the map
3. If pricing has changed, update the entry. If pricing is unchanged, just bump `lastVerified`
4. For **usage-based** tools (Stripe, AWS, OpenAI, etc.):
   - Confirm the `pricingModel` is `'Usage-Based'`
   - Update any `usageBasedDetails` with current unit rates
   - Ensure `estimatedMonthlyRange` is reasonable for a small-to-medium app

**Important**: Process tools in parallel where possible (batch 5-10 `search_web` calls at once) for efficiency.

### 3. Write updated file

After all categories are audited:

// turbo
1. Update `src/data/tool-pricing-data.ts` with all changes
2. Run `npx tsc --noEmit` to verify the build

### 4. Generate audit report

Create a brief summary for the user listing:
- Total tools audited
- Number of pricing changes found
- Any tools where pricing could not be verified (mark as `lastVerified: 'UNVERIFIED'`)

## Guidelines

- **100% coverage**: Every tool in the map must be checked. Do not skip any.
- **Source of truth**: Always prefer the tool's official pricing page over third-party sources.
- **Usage-based transparency**: For usage-based tools, include `estimatedMonthlyRange` with min/max for a typical small SaaS app (1k-10k MAU).
- **Preserve structure**: Do not change the TypeScript interface or helper functions — only update the data values.
- **Batch efficiently**: Use parallel `search_web` calls grouped by category to minimize runtime.
