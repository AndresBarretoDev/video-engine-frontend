# Design: Frontend Browser Recovery and Accessibility

## Technical Approach

Introduce Playwright as the user-observable harness, declare four projects, and compose transparent fixtures for owner-supplied auth, recovery, telemetry capture, keyboard/focus, and axe. Keep UI corrections minimal and capture support decisions in a scannable operational record.

## Architecture Decisions

| Decision | Choice and rationale | Rejected tradeoff |
|---|---|---|
| Harness | Playwright Chromium, Firefox, WebKit, and mobile Chromium. | jsdom/testing-library as acceptance evidence. |
| Auth/mocks | Fail before the journey unless both public flags equal false; credentials stay outside Git. | Missing flags, bypass, mocks, or committed storage state. |
| Accessibility | Existing primitives/tokens, keyboard/focus/semantics/contrast/axe; minimal fixes only. | Redesign or hand-built focus primitives. |
| Exclusions | Versioned data with owner, reason, journey, evidence, expiry, cadence. | Hidden skip or permanent waiver. |
| Architecture | Preserve React Query, Zustand UI-only, `/src/lib/api/client.ts`, NestJS/httpOnly cookies, and existing routes. | Server Actions, Supabase, or new domain scaffold. |

## Data Flow

```text
owner account + flags=false -> Playwright project -> existing critical journey
forced contract failure -> visible recovery + focus + axe + telemetry observation
project result/exclusion -> browser-support record -> F3 closure; telemetry link -> F2
```

## File Changes

| File | Action | Responsibility |
|---|---|---|
| `playwright.config.ts` | Create | Four projects, failure traces, flag guards. |
| `tests/e2e/fixtures/auth.ts` | Create | Owner-supplied real-auth fixture without secrets. |
| `tests/e2e/critical-paths.spec.ts` | Create | Normal/recoverable browser journeys and telemetry observation. |
| `tests/e2e/accessibility.spec.ts` | Create | Keyboard, focus, semantics, contrast, axe. |
| `tests/e2e/browser-matrix.spec.ts` | Create | Matrix/exclusion contract. |
| Existing components/pages | Modify if required | Minimal accessible recovery corrections. |
| `ops/browser-support.md` | Create | Cognitive-load-aware policy and evidence index. |

## Interfaces / Contracts

Each project result names browser/version, device, journey, both flags, outcome, trace policy, and owner disposition. Exclusions additionally require reason, evidence, expiry, and review cadence. Shared fixtures contain assertions and never conditional skips.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Contract | Matrix/exclusion schema | Playwright/Vitest-compatible pure fixtures for missing, expired, and complete entries. |
| E2E | Recovery/a11y | Real Chromium first; then full declared matrix with owner evidence. |
| Runtime | Real auth | Owner account reaches NestJS/httpOnly-cookie paths with both flags false. |

Strict TDD uses the exact Playwright command as RED before fixes, then GREEN, triangulation, and REFACTOR. Browser support documentation loads `cognitive-doc-design` before editing.

## Queued Promotion and Instructions

This complete root package is NOT directly applyable; never run the root dispatcher or infer native relationships/edit roots here. After F2 is accepted, the parent copies all four artifacts into `op-video-engine-frontend/openspec/changes/frontend-browser-recovery-accessibility/`, with root `tasks.queued.md` copied as canonical `tasks.md`. Only repo-local native status is authoritative, and only one frontend change is promoted at a time.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/.codex/skills/cognitive-doc-design/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rule entrypoints: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/component-architecture.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`.

Review with `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`; retain the framework-required `global-error.tsx` default export.

## Threat Matrix

N/A — tests do not introduce shell/subprocess, VCS/PR automation, executable classification, or new routing authority.

## Rollout / Rollback

Land after F2. Stabilize Chromium, then record full owner-approved matrix. A project may be disabled only through an explicit expiring exclusion; revoke/rotate test credentials on rollback.

## Open Questions

None after owner supplies account and matrix; either missing prerequisite blocks apply.
