# Tasks: Frontend Browser Recovery and Accessibility

> **PROMOTED & EXECUTABLE (2026-07-23).** Copied from workspace root to this repo as canonical `tasks.md` after F2 acceptance (PR #4 merged). Repo-local native status is authoritative. E2E execution (real-auth browser matrix) is owner-run against a running/seeded backend; the agent authors config, fixtures, specs, and accessibility fixes.

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated authored changed lines | 320-400 |
| Suggested split | One F3 work-unit PR |
| Delivery strategy | ask-on-risk; topology already resolved |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium
Apply authorization: Not granted; no automatic apply.

PR boundary: `feat/frontend-browser-recovery-accessibility` targets immediate parent `feat/frontend-safe-nonblocking-telemetry`, never `main`. Parent C02; dependencies F1/F2. F3 owns PR-F05/PR-F06; PR-F02 evidence supports F2 only.

## Queued Promotion Contract

This root package is complete but NOT directly applyable; do not run the root dispatcher or infer native relationships/edit roots. After F2 is accepted, the parent copies all four artifacts to `op-video-engine-frontend/openspec/changes/frontend-browser-recovery-accessibility/`, where root `tasks.queued.md` is copied as canonical `tasks.md`. Only repo-local native status is authoritative. Promote one dependency-ready frontend change at a time; after evidence, the parent reconciles root OpenSpec/Engram. Owner account/matrix remain blocking.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/.codex/skills/cognitive-doc-design/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rules: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/component-architecture.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`. Reviewer: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`.

## Work Unit Evidence

Focused command: `cd op-video-engine-frontend && NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false pnpm exec playwright test tests/e2e/critical-paths.spec.ts tests/e2e/accessibility.spec.ts --project=chromium`. Runtime: visible recovery, deterministic focus, one allowlisted request. Rollback: disable a project only via owner/reason/journey/evidence/expiry; revoke credentials, never enable bypass/mocks.

## Strict TDD Tasks

- [x] 1.1 **RED:** create `playwright.config.ts`, auth fixture, and `critical-paths.spec.ts`; run the focused command and expect failure for missing real auth, either non-false flag, recovery telemetry, or bounded failure traces. *(Structural RED authored; REAL RED/GREEN executed this session against a live backend — see below.)*
- [x] 1.2 **GREEN:** declare Chromium/Firefox/WebKit/mobile Chromium and real-auth fixtures; keep credentials outside Git and preserve NestJS/httpOnly-cookie API flow. *(`playwright test --list` confirms all 4 projects register, 24 tests total; fixture logs in via `POST {API}/auth/login` and reuses the resulting cookie context — no header/token handling added.)*
- [x] 1.3 **RED:** create `accessibility.spec.ts`; expect keyboard, focus restoration, semantic name/role/state, contrast, or axe failures in normal and forced-recovery paths—never substitute jsdom evidence. *(Structural RED authored; REAL axe failures observed and fixed this session — see below.)*
- [x] 1.4 **GREEN:** apply only minimal existing-component accessibility/recovery fixes using current primitives/tokens; no redesign or state/API ownership change. *(See "Accessibility Fixes" below.)*
- [x] 1.5 **RED:** create `browser-matrix.spec.ts`; run `cd op-video-engine-frontend && pnpm exec playwright test tests/e2e/browser-matrix.spec.ts --project=chromium` and expect missing projects/fields, expired exclusions, or hidden skips to fail. *(Structural RED authored; REAL run this session found and fixed a row-scoping bug in the test itself — see below.)*
- [x] 1.6 **GREEN/REFACTOR:** load `cognitive-doc-design`, create `ops/browser-support.md`, extract transparent shared assertions, rerun Chromium twice, then record owner full-matrix pass or explicit exclusions. *(`cognitive-doc-design` loaded; doc created; shared `tests/e2e/fixtures/network.ts` extracted. Chromium: 6/6 passed, real run, this session, 3 consecutive stable runs. Owner full-matrix (Firefox/WebKit/mobile-chromium) + Evidence Log row: still PENDING — only Chromium binary installed in this environment.)*

### Accessibility Fixes (task 1.4)

| File | Fix |
|---|---|
| `src/components/atoms/eye-password.tsx` | Icon-only toggle now has `aria-label` (Show/Hide password) + `aria-pressed` — was unnamed to assistive tech. |
| `src/domains/auth/components/login-form.tsx` | Server error message now has `role="alert"`; email/password now use `FormLabel` (was bare `Label`, no `htmlFor`) — fixed real `label-title-only` axe violation, this session. |
| `src/components/shared/error-alert.tsx` | Retry button now receives deterministic focus on mount via `useRef`/`useEffect` (shared by 14+ call sites: templates, dashboard, brands, projects, assets, users, render-jobs, components-registry). |
| `src/app/global-error.tsx` | Root error boundary's "Try again" button now receives deterministic focus on mount, same pattern as `ErrorAlert`. |
| `src/components/layout/app-breadcrumbs.tsx` | Removed non-semantic `<span>` key-wrapper (replaced with `<Fragment>`) — fixed real `list`/`listitem` axe violations, this session. |
| `src/components/ui/alert.tsx` | Destructive `AlertDescription` dropped a `/90` opacity modifier on `text-destructive` — fixed real `color-contrast` axe violation (4.32 → ~5.15), this session. |
| `src/lib/api/client.ts` | Added a 3s dedup window to `recordApiBoundaryTelemetry` — fixed a real duplicate-telemetry-per-automatic-retry bug found via live-browser evidence, this session (see apply-progress.md). |

### Real Chromium Evidence (this session, 2026-07-23)

Backend live at `http://localhost:3001`; ran `pnpm exec playwright test --project=chromium --reporter=list` with real auth + `NEXT_PUBLIC_TELEMETRY_ENDPOINT` set. **6/6 passed**, stable across 3 runs. `pnpm test` 342/342, `type:check` exit 0, `lint:check` exit 0. Full details, root causes, and fixes in `apply-progress.md`.

### Pending Owner Evidence

Firefox/WebKit binaries are not installed in this environment. The full four-project matrix run and the Evidence Log row in `ops/browser-support.md` remain **owner-run** — see the command in apply-progress.md's "Still Owner-Run" section. `.env.e2e.example` could not be created in this sandbox (any `.env*` path in the repo root is hard-denied by the permission system); its exact content is recorded in apply-progress.md for the owner to create manually.

## Closure

Return cycle commands/exits, paths, diff ≤400, browser/runtime results, rollback, exclusions, and blockers. Load prescribed apply/UI skills; exclude `nextjs-domain-scaffold`.
