---
name: nextjs-code-review
description: >
  Reviews Next.js code against architectural best practices: Server Components, RLS security,
  naming conventions, separation of concerns, and component reusability. Use this skill whenever
  the user asks to review, audit, check, or validate Next.js code — including "review my code",
  "check this file", "is this correct?", "validate my component", "audit my domain", or any
  request to verify that code follows Next.js 15, React 19, Supabase RLS, or domain-driven
  design conventions. Also trigger proactively after implementing significant features.
---

# Next.js Code Review Skill

Deep multi-file code review against Next.js 15 + React 19 + Supabase architectural rules. Produces a structured report with severity-rated findings and actionable fixes.

## Review Scope

Accept file paths, directories, or glob patterns. Default: review all files provided.

**Typical targets**:
- Single file: `src/domains/tasks/actions.ts`
- Domain: `src/domains/tasks/`
- Pages: `src/app/tasks/`
- Full audit: `src/`

## The 10 Critical Rules (Severity: CRITICAL if violated)

| # | Rule | What to check |
|---|------|---------------|
| 1 | **Reusable components** | If similar JSX appears 2+ times → should be a component |
| 2 | **Separation of concerns** | Business logic NOT in components; logic in `/utils` or `/helpers` |
| 3 | **External types** | Interfaces/types NOT defined inside component files |
| 4 | **Clean pages** | `page.tsx` files ONLY have composition (Suspense + components). No logic. |
| 5 | **shadcn auto** | No manual component creation when shadcn equivalent exists |
| 6 | **Mobile-first** | Tailwind classes start mobile, then `md:`, then `lg:` |
| 7 | **Server Components default** | `'use client'` only when interactivity is required |
| 8 | **Naming conventions** | Files: kebab-case. Components: PascalCase. Hooks: camelCase with `use` prefix |
| 9 | **Absolute imports** | All imports use `@/` prefix. No relative `../../` |
| 10 | **Supabase RLS** | Every Server Action validates session. RLS enabled on all tables. |

## Additional Rules (Severity: WARNING if violated)

- Server Actions: `'use server'` at top, Zod validation on ALL inputs, try-catch blocks
- Suspense: Async operations wrapped in `<Suspense fallback={<Skeleton />}>`
- Named exports: No `export default` (except Next.js page/layout conventions)
- React Query: Server data via React Query (not raw fetch or useEffect+useState)
- Zustand: ONLY for UI state (modals, filters, selection). Never for server data.
- Text-maps: No hardcoded strings in components — use `text-maps.ts`
- `useTransition` or React Query mutations for form submissions (not manual loading states)

## Review Process

### Step 1 — Discover Files

Read all files in the specified scope using Glob and Read tools. For large directories, focus on:
1. `page.tsx` files first (Rule 4 — clean pages is most commonly violated)
2. Server Actions / `actions.ts` (security — Rules 3, 10)
3. Components (Rules 1, 2, 3, 6, 7, 9)
4. Hooks and stores (state management correctness)

### Step 2 — Analyze Each File

For each file, check applicable rules. Create an internal list of findings before writing the report.

**For `page.tsx` files**: Does it contain any logic? Any imports of non-component modules? Any async operations without Suspense?

**For `actions.ts` files**: Does every exported function have `'use server'`? Does every function validate session before any DB call? Does every function validate input with Zod?

**For component files**: Are types defined outside the file? Are imports absolute? Is there client-side logic that should be server-side? Are there hardcoded strings?

**For hook files**: Is React Query used for server data? Is Zustand used for UI state only?

### Step 3 — Write Report

Use this exact structure:

```markdown
# Code Review Report
**Scope**: {path reviewed}
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
**Finding**: {specific description of the problem}
**Current code**:
```{lang}
{problematic code snippet}
```
**Fix**:
```{lang}
{corrected code snippet}
```

---

## Warnings (Should fix, technical debt)

### 🟡 {Issue description} — `{file path}`
**Finding**: {description}
**Recommendation**: {what to do}

---

## What's Working Well

- ✅ {positive finding}
- ✅ {positive finding}

---

## Action Plan
1. {Most critical fix first}
2. {Second most critical}
3. {Warnings in priority order}
```

## Severity Definitions

**🔴 CRITICAL** — Security vulnerabilities, missing session validation, data exposed without RLS, missing `'use server'`, business logic in page.tsx, types defined inside components. These ship bugs or security holes.

**🟡 WARNING** — Missing text-maps, missing Suspense, `export default` instead of named, relative imports, Zustand for server data. These create technical debt but don't break production immediately.

**✅ PASS** — Rule is followed correctly. Always acknowledge what's done right.

## Output Behavior

- If reviewing a single file: full detailed report with code snippets
- If reviewing a directory: summary table + critical issues with snippets + warning list (no snippets for warnings, just file + line reference)
- If reviewing `src/`: executive summary + top 5 critical issues + aggregated warning count by category

## Example Output (single file)

```markdown
# Code Review Report
**Scope**: src/domains/tasks/actions.ts
**Date**: 2026-03-02
**Files reviewed**: 1

---

## Summary
| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟡 WARNING | 2 |
| ✅ PASS | 8 |

---

## Critical Issues

### 🔴 [Rule 10] Missing Session Validation — `actions.ts`
**Finding**: `getTasks()` reads from DB without validating user session first.
Any unauthenticated call can reach this function.

**Current code**:
```typescript
export async function getTasks() {
  const supabase = createServerClient(cookies());
  const { data } = await supabase.from('tasks').select('*');
  return data;
}
```
**Fix**:
```typescript
export async function getTasks() {
  const supabase = createServerClient(cookies());
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  const { data } = await supabase
    .from('tasks').select('*').eq('user_id', user.id);
  return data ?? [];
}
```

---

## Warnings

### 🟡 Missing try-catch — `actions.ts:createTask`
**Finding**: DB operation not wrapped in try-catch. Supabase errors will bubble up as unhandled exceptions.
**Recommendation**: Wrap `.insert()` in try-catch and return `{ success: false, error: '...' }` on failure.

### 🟡 No Zod validation — `actions.ts:createTask`
**Finding**: Input passed directly to DB without schema validation.
**Recommendation**: Add `createTaskSchema.safeParse(input)` before the insert.

---

## What's Working Well

- ✅ `'use server'` present at top of file
- ✅ `revalidatePath` called after mutations
- ✅ Named exports throughout
- ✅ Absolute imports with `@/`
```
