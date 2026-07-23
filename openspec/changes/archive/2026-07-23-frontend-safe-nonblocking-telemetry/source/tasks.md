# Tasks: Frontend Safe Non-Blocking Telemetry

> **PROMOTED & EXECUTABLE (2026-07-23).** Copied from workspace root to this repo as canonical `tasks.md` after F1 acceptance (PR #2/#3 merged). Repo-local native status is authoritative. Destination approval for the telemetry sink remains a separate owner gate; the client is implemented disabled-by-default (safe when no destination is configured).

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated authored changed lines | 300-400 |
| Suggested split | One F2 work-unit PR |
| Delivery strategy | ask-on-risk; topology already resolved |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium
Apply authorization: Not granted; no automatic apply.

PR boundary: `feat/frontend-safe-nonblocking-telemetry` targets immediate parent `feat/frontend-runtime-check-contract`, never `main`. Parent C02: `frontend-production-validation-baseline`; dependency: F1. F2 exclusively owns PR-F02; F3 browser evidence is supporting.

## Queued Promotion Contract

This root package is complete but NOT directly applyable; do not run the root dispatcher or infer native relationships/edit roots. After F1 is accepted, the parent copies all four artifacts to `op-video-engine-frontend/openspec/changes/frontend-safe-nonblocking-telemetry/`, where root `tasks.queued.md` is copied as canonical `tasks.md`. Only repo-local native status is authoritative. Promote one dependency-ready frontend change at a time; after evidence, the parent alone reconciles root OpenSpec/Engram. Telemetry destination approval remains blocking.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rules: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`. Reviewer: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`.

## Work Unit Evidence

Focused command: `cd op-video-engine-frontend && pnpm test -- src/lib/telemetry`. Runtime: destination outage must not block visible recovery, navigation, or API handling. Rollback: disable endpoint/config, then revert telemetry and all boundary calls together.

## Strict TDD Tasks

- [x] 1.1 **RED:** create `src/lib/telemetry/contracts.test.ts` and `redaction.test.ts`; run the focused command and expect leaks/missing allowlisted fields for nested objects, arrays, `Error`, query values, credentials, and private URLs.
- [x] 1.2 **GREEN:** create `contracts.ts`/`redaction.ts` with typed event names and immutable positive projection limited to route, boundary, outcome, recovery class, correlation ID, SHA, and timestamp.
- [x] 1.3 **RED:** create `client.test.ts`; run it and expect rejection/timeout/disabled/malformed destination cases to throw, delay, mutate, or alter caller results.
- [x] 1.4 **GREEN:** create `client.ts` as bounded fire-and-forget transport; centralize construction and guarantee safe unavailable behavior.
- [x] 1.5 **RED:** create `wiring.test.ts`; expect absent/duplicate events, changed recovery, or lost `global-error.tsx` default export across API/query/global boundaries.
- [x] 1.6 **GREEN/REFACTOR:** wire `src/lib/api/client.ts`, `src/lib/providers.tsx`, and `src/app/global-error.tsx`; prove success/failure/retry, exactly once, stable repeated output, React Query/Zustand ownership, and unchanged recovery.

## Closure

Return RED/GREEN/REFACTOR commands/exits, paths, diff size ≤400, outage observable, rollback, and blockers. Do not add jsdom/testing-library solely for wiring or redesign UI.
