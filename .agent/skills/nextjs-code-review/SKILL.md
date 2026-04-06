---
name: nextjs-code-review
description: Reviews Next.js code against architectural rules — security, separation of concerns, naming, and component reusability. Use this skill whenever the user asks to review, audit, check, or validate Next.js or React code — including "review my code", "check this file", "is this correct?", "validate my component", "audit my domain", or any request to verify that code follows Next.js 15, React 19, Supabase RLS, or domain-driven design conventions. Also trigger proactively after implementing significant features. Complements vercel-react-best-practices (performance) — this skill covers architecture and security.
license: MIT
metadata:
  author: andres
  version: "1.0.0"
---

# Next.js Code Review

Architecture and security code review for Next.js 15 + React 19 + Supabase projects. Produces a structured report with severity-rated findings and actionable fixes.

**Scope**: Architecture, security, and project conventions. For performance-specific reviews (bundle size, re-renders, waterfalls), also apply the `vercel-react-best-practices` skill.

## Review Scope

Accept file paths, directories, or glob patterns:
- Single file: `src/domains/tasks/actions.ts`
- Domain: `src/domains/tasks/`
- Pages: `src/app/tasks/`
- Full audit: `src/`

## The 10 Critical Rules

| # | Rule | What to check |
|---|------|---------------|
| 1 | **Reusable components** | Similar JSX appearing 2+ times → extract to component |
| 2 | **Separation of concerns** | Business logic NOT in components; goes in `/utils` or `/helpers` |
| 3 | **External types** | Interfaces/types NOT defined inside component files |
| 4 | **Clean pages** | `page.tsx` = composition only (Suspense + components). Zero logic. |
| 5 | **shadcn auto** | No manual component creation when shadcn equivalent exists |
| 6 | **Mobile-first** | Tailwind starts mobile → `md:` → `lg:`. Never desktop-first. |
| 7 | **Server Components default** | `'use client'` only when interactivity is genuinely required |
| 8 | **Naming conventions** | Files: kebab-case. Components: PascalCase. Hooks: `use` prefix. |
| 9 | **Absolute imports** | All imports use `@/`. No relative `../../` paths. |
| 10 | **Supabase RLS + auth** | Every Server Action validates session. RLS on all tables. |

## Additional Rules (Severity: WARNING)

- Server Actions: `'use server'` at file top, Zod on ALL inputs, try-catch blocks
- Suspense boundaries: async operations wrapped in `<Suspense fallback={<Skeleton />}>`
- Named exports: no `export default` except Next.js page/layout files
- React Query: server data via hooks, not raw `fetch` or `useEffect` + `useState`
- Zustand: UI state only (modals, filters, selection) — never server/async data
- Text-maps: no hardcoded strings in components
- File placement: `hooks/` and `stores/` are subdirectories, not domain root

## Review Process

### Step 1 — Discover Files

Use Glob and Read to collect all files in scope. Review in this order:
1. `page.tsx` files — Rule 4 (clean pages) is the most commonly violated
2. `actions.ts` files — security (Rules 3, 10)
3. Components — Rules 1, 2, 3, 6, 7, 9
4. Hooks and stores — state management correctness

### Step 2 — Analyze Each File

For `page.tsx`: Does it import non-component modules? Contain logic? Have async without Suspense?

For `actions.ts`: Does every function start with `'use server'`? Does every function call `supabase.auth.getUser()` before any DB operation? Does every mutating function validate input with Zod?

For components: Types defined in the file? Relative imports? Hardcoded strings? Client directive when not needed?

For hooks/stores: React Query for server data? Zustand only for UI state?

### Step 3 — Write Report

Use this exact structure:

```markdown
# Code Review Report
**Scope**: {path}
**Date**: {YYYY-MM-DD}
**Files reviewed**: {count}

---

## Summary
| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | X |
| 🟡 WARNING | X |
| ✅ PASS | X |

---

## Critical Issues (Must fix before shipping)

### 🔴 [Rule N] {Rule Name} — `{file path}`
**Finding**: {specific description}
**Current code**:
```{lang}
{problematic snippet}
```
**Fix**:
```{lang}
{corrected snippet}
```

---

## Warnings (Technical debt — fix soon)

### 🟡 {Issue} — `{file path}`
**Finding**: {description}
**Recommendation**: {what to do}

---

## What's Working Well
- ✅ {positive finding}

---

## Action Plan
1. {Most critical first}
2. {Second}
```

## Severity Definitions

**🔴 CRITICAL** — Ships bugs or security holes. Examples: missing session validation, no `'use server'`, business logic in page.tsx, types inside components, unauthenticated DB access.

**🟡 WARNING** — Technical debt, won't break immediately. Examples: missing text-maps, no Suspense, `export default` instead of named, relative imports, Zustand for server data.

**✅ PASS** — Rule followed correctly. Always acknowledge what's right.

## Output Scale

- **Single file**: full report with code snippets for every finding
- **Directory**: summary table + critical issues with snippets + warning list (file + line, no snippets)
- **Full `src/`**: executive summary + top 5 criticals + aggregated warning counts by category
