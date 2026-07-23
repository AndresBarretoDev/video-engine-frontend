# Design: Frontend Safe Non-Blocking Telemetry

## Technical Approach

Separate telemetry into pure contracts/redaction and a bounded transport. Every adapter creates an event through the same allowlist projection; delivery is deferred and swallowed so diagnostics never alter application results. Wire only current recovery boundaries.

## Architecture Decisions

| Decision | Choice and rationale | Rejected tradeoff |
|---|---|---|
| Data safety | Positive allowlist projection drops unknown/nested data before serialization. | Best-effort blacklist masking. |
| Delivery | Approved endpoint, bounded fire-and-forget, safe disabled state, no caller-visible throw. | Awaiting vendor delivery or arbitrary exception forwarding. |
| Wiring | Existing API interceptor, React Query caches, and global error retry; exactly-once boundary ownership. | Component-wide logging or duplicate adapters. |
| State/API | Preserve React Query server state, Zustand UI-only state, `/src/lib/api/client.ts`, and NestJS/httpOnly cookies. | Supabase, Server Actions, or new state authority. |
| UI | No redesign; `global-error.tsx` keeps the framework-required default export. | Replacing recovery surfaces. |

## Data Flow

```text
failure -> existing boundary -> typed event -> allowlist projection -> bounded transport
   \-------------------------------------------------------> unchanged recovery
```

## File Changes

| File | Action | Responsibility |
|---|---|---|
| `src/lib/telemetry/contracts.ts` | Create | Event names and allowed fields. |
| `src/lib/telemetry/redaction.ts` | Create | Immutable positive projection. |
| `src/lib/telemetry/client.ts` | Create | Disabled/timeout/rejection-safe transport. |
| `src/lib/telemetry/*.test.ts` | Create | Contract, redaction, client, and wiring tests. |
| `src/app/global-error.tsx` | Create/modify | Preserve retry and default export. |
| `src/lib/api/client.ts`, `src/lib/providers.tsx` | Modify | Existing API/query boundary adapters. |

## Interfaces / Contracts

Allowed fields are `route`, `boundary`, `outcome`, `recoveryClass`, `correlationId`, `buildSha`, and `timestamp`. Event names are closed typed values for route, contract, preview, and recoverable failures. Transport receives only projected data and returns immediately.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | Projection and transport | Vitest covers nested/array/Error/URL input, immutability, success, rejection, timeout, malformed input, and disabled endpoint. |
| Integration | Boundary behavior | Node-environment wiring tests prove exactly once, retry preservation, API result preservation, and state ownership. |
| Browser | PR-F02 scenario | F3 Playwright observes one request with both bypass and mocks false; no jsdom-only substitute. |

Strict TDD records safety net, RED, GREEN, triangulation, REFACTOR, exact exits, paths, diff size, runtime observation, and rollback.

## Queued Promotion and Instructions

This complete root package is NOT directly applyable; never run the root dispatcher or infer native relationships/edit roots here. After F1 is accepted, the parent copies all four artifacts into `op-video-engine-frontend/openspec/changes/frontend-safe-nonblocking-telemetry/`, with root `tasks.queued.md` copied as canonical `tasks.md`. Only repo-local native status is authoritative, and only one frontend change is promoted at a time.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rule entrypoints: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`.

Review with `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`.

## Threat Matrix

N/A — no routing, shell/subprocess, VCS/PR automation, executable classification, or process integration.

## Rollout / Rollback

Land after F1. Enable only after the owner supplies the destination. Roll back by disabling endpoint/config first, then removing all adapters together; recovery behavior stays.

## Open Questions

None after destination approval; missing approval blocks apply.
