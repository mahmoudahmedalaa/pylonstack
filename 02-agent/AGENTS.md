# AGENTS.md — Project Master Plan

> The operating system for AI agents working on this project. Read this FIRST before touching any code.

## Architecture: 3 Layers

```
┌─────────────────────────────────────┐
│  DIRECTIVE LAYER — What to build    │
│  01-docs/ (PRD, Tech Stack, etc.)   │
├─────────────────────────────────────┤
│  ORCHESTRATION — How to decide      │
│  This file (AGENTS.md)              │
├─────────────────────────────────────┤
│  EXECUTION — Doing the work         │
│  03-workflows/, 02-agent/skills/    │
└─────────────────────────────────────┘
```

- **Directive** → `01-docs/` — WHAT to build, WHY, and with WHAT technology
- **Orchestration** → This file — HOW to make decisions, WHEN to ask, autonomy rules
- **Execution** → `03-workflows/` + `02-agent/skills/` — Deterministic procedures and reusable skills

### Available Skills
| Skill | File | When to Use |
|:------|:-----|:------------|
| **Handover** | `skills/HANDOVER.md` | End of conversation — document state for next AI |
| **MCP Setup** | `skills/MCP_SETUP.md` | Setting up Model Context Protocol tools |
| **Skill Creator** | `skills/SKILL_CREATOR.md` | Creating new reusable skills |
| **Design System Generator** | `skills/DESIGN_SYSTEM_GENERATOR.md` | Generating `FRONTEND_GUIDELINES.md` with psychology-driven colors, library selection, component patterns, and animation guidelines. **Always use this skill** when building a design system — it ensures research-backed, library-first results |

---

## Project Context

| Field | Value |
|:------|:------|
| **App Name** | [Your App] |
| **Version** | [Current version] |
| **Platform** | [iOS / Android / Web] |
| **Status** | [Planning / Active Development / Launched] |

---

## Operating Principles

### 1. Plan Before You Code
- Read relevant docs from `01-docs/` before implementing
- Outline your approach, then build
- If the approach changes, update the docs

### 2. Small, Verifiable Steps
- Each change should be testable in isolation
- Commit after each working milestone
- Never make 500-line changes without intermediate verification

### 3. Document What You Learn
- Found a bug? Add it to `04-prompting/LESSONS_LEARNED.md`
- Discovered a pattern? Add it to `02-agent/rules/`
- Created a reusable procedure? Add it to `03-workflows/`

### 4. Never Guess
- If a spec is ambiguous → ASK the user
- If a dependency version is unclear → CHECK `01-docs/TECH_STACK.md`
- If a flow is undefined → CHECK `01-docs/APP_FLOW.md`

---

## Autonomy Protocol

### ✅ Act Autonomously
- Bug fixes that don't change behavior
- Implementing features clearly specified in the docs
- Running tests, linting, formatting
- Following established patterns in the codebase
- Adding error handling to existing code

### ⚠️ Summarize Then Act
- Refactoring that changes multiple files
- Adding new dependencies
- Modifying database schema
- Changing authentication logic

### 🛑 Ask Before Acting
- Deleting files or features
- Changing the tech stack
- Architectural decisions not covered in docs
- Anything involving production data
- Security-sensitive changes
- Scope changes beyond the PRD

---

## File Organization

```
project-root/
├── 01-docs/               # Source of truth for all decisions
├── 02-agent/               # AI agent rules and skills
│   ├── AGENTS.md           # This file
│   ├── rules/              # Constraints and standards
│   └── skills/             # Reusable procedures
├── 03-workflows/           # Dev, test, deploy procedures
├── 04-prompting/           # Prompting guide and templates
├── 05-checklists/          # Launch and post-launch checklists
└── src/                    # Application source code
    ├── domain/             # Business logic (entities, use cases)
    ├── data/               # Data access (repositories, APIs)
    ├── presentation/       # UI (screens, components)
    └── infrastructure/     # Framework glue (auth, storage, config)
```

---

## Current Roadmap

### [Version X.Y] — [Codename / Theme]
| Feature | Status | Priority |
|:--------|:-------|:---------|
| | ⬜ Not Started / 🔄 In Progress / ✅ Done | P0/P1/P2 |

---

## Error Recovery Protocol

When something breaks:

1. **Read the error** — actually read it, don't just fix the symptom
2. **Check `03-workflows/TROUBLESHOOTING.md`** — might be a known issue
3. **Isolate** — is it build-time, runtime, or deployment?
4. **Fix, don't patch** — address root cause, not just the error message
5. **Document** — add the fix to `TROUBLESHOOTING.md` or `LESSONS_LEARNED.md`

---

## Self-Annealing

After every major milestone, update:
- [ ] `01-docs/` if specs drifted from reality
- [ ] `03-workflows/TROUBLESHOOTING.md` with new issues found
- [ ] `04-prompting/LESSONS_LEARNED.md` with what went wrong and right
- [ ] This file (`AGENTS.md`) if project context changed
