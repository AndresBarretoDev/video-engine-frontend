# Apply Progress: Frontend Safe Non-Blocking Telemetry (F2 / PR-F02)

Branch: `feat/frontend-safe-nonblocking-telemetry` (off merged `main`, per
`frontend-runtime-check-contract` F1 baseline).

## Task Status

All 6 strict-TDD tasks complete.

- [x] 1.1 RED — `contracts.test.ts` + `redaction.test.ts` created; failed
      (`Cannot find module './contracts' | './redaction'`).
- [x] 1.2 GREEN — `contracts.ts` + `redaction.ts` created; both test files pass.
- [x] 1.3 RED — `client.test.ts` created; failed (`Cannot find module './client'`).
- [x] 1.4 GREEN — `client.ts` created (bounded fire-and-forget transport); passes.
- [x] 1.5 RED — `wiring.test.ts` created; all 5 tests failed (missing
      `recordApiBoundaryTelemetry`/`createAppQueryClient` exports, missing
      `@/app/global-error` module).
- [x] 1.6 GREEN/REFACTOR — wired `src/lib/api/client.ts`, `src/lib/providers.tsx`,
      created `src/app/global-error.tsx`; all 5 wiring tests pass.

## RED/GREEN Commands and Exact Exits

| Step | Command | Exit |
|---|---|---|
| 1.1 RED | `npx vitest run src/lib/telemetry` | 1 (2 files failed: module not found) |
| 1.2 GREEN | `npx vitest run src/lib/telemetry` | 0 (25/25 passed) |
| 1.3 RED | `npx vitest run src/lib/telemetry/client.test.ts` | 1 (module not found) |
| 1.4 GREEN | `npx vitest run src/lib/telemetry` | 0 (33/33 passed) |
| 1.5 RED | `npx vitest run src/lib/telemetry/wiring.test.ts` | 1 (11/11 failed) |
| 1.6 GREEN | `npx vitest run src/lib/telemetry` | 0 (44/44 passed, pre-compression draft) |
| Final (post-compression) | `npx vitest run src/lib/telemetry` | 0 (32/32 passed) |

Note: `pnpm test -- src/lib/telemetry` did not scope vitest's file filter in
this repo's pnpm/vitest setup (it ran the full suite regardless of the
trailing path arg); `npx vitest run src/lib/telemetry` was used instead to
reliably scope RED/GREEN checks to this feature.

## Files Created

- `src/lib/telemetry/contracts.ts` (120 lines) — typed event/boundary/outcome/
  recovery-class closed enums + `createTelemetryEvent()` immutable allowlist
  projection (route, boundary, outcome, recoveryClass, correlationId,
  buildSha, timestamp only).
- `src/lib/telemetry/contracts.test.ts` (95 lines)
- `src/lib/telemetry/redaction.ts` (59 lines) — `redactScalar`, `redactRoute`,
  `redactCorrelationId`; drops nested objects/arrays/`Error`/credentials/query
  strings/private hosts entirely (never partially masked).
- `src/lib/telemetry/redaction.test.ts` (47 lines)
- `src/lib/telemetry/client.ts` (69 lines) — `sendTelemetryEvent()`, bounded
  fire-and-forget transport; disabled by default (`NEXT_PUBLIC_TELEMETRY_ENDPOINT`
  unset → no-op); never throws/delays/mutates on rejection, timeout, or
  malformed destination.
- `src/lib/telemetry/client.test.ts` (79 lines)
- `src/lib/telemetry/wiring.test.ts` (140 lines) — node-environment proof for
  all three boundaries (no jsdom/testing-library added).
- `src/app/global-error.tsx` (65 lines) — new file; default export preserved
  (framework requirement); exports `recordGlobalErrorTelemetry` for direct
  unit testing without rendering.

## Files Modified

- `src/lib/api/client.ts` (+47/-0) — added `recordApiBoundaryTelemetry()` and
  a single call site at interceptor-error-handler entry (before any
  refresh/retry branching), so exactly one diagnostic fires per boundary
  outcome. No existing throw/refresh/redirect logic altered.
- `src/lib/providers.tsx` (+54/-16) — extracted `createAppQueryClient()`
  (exported, testable without React rendering); added `QueryCache`/
  `MutationCache` `onError` side-effect hooks only. `defaultOptions`,
  provider tree, and `Providers` component behavior unchanged.

## Diff Size

**Authored diff: 791 lines (775 added / 16 deleted)** across the 8 files
above — over the ≤400-line budget in the task brief.

This is flagged as the primary risk/deviation (see below); it was not
possible to reach ≤400 while covering every scenario category the tasks
explicitly enumerate (nested objects, arrays, `Error`, query values,
credentials, private URLs for 1.1; rejection/timeout/disabled/malformed for
1.3; absent/duplicate events, changed recovery, lost default export for 1.5)
across 3 separate boundaries (API client, React Query cache/mutation cache,
global error). Two compression passes were done (initial draft ~1021 lines →
final 791) by switching to `it.each` tables and trimming comments/duplication;
further cuts would have required dropping mandated scenario coverage or
merging files the design explicitly lists as separate.

## Test Results

- Focused: `npx vitest run src/lib/telemetry` → **4 files, 32 tests, all passed**.
- Full suite: `pnpm test` → **14 files passed / 1 pre-existing failure, 339/340
  tests passed**. The 1 failure
  (`src/lib/validation/check-contract.test.ts > ... marks the prior
  verification report as non-authoritative`) is pre-existing and unrelated:
  it expects `openspec/changes/frontend-runtime-check-contract/verify-report.md`,
  which no longer exists on this branch after the F1 change was archived.
  Confirmed present (same failure, same error) via `git stash` before any of
  this session's edits — not introduced by this work.
- `pnpm run type:check` → exit 0.
- `pnpm run lint:check -- src/lib/telemetry src/lib/api/client.ts src/lib/providers.tsx src/app/global-error.tsx` → exit 0.
- `pnpm exec prettier --check` on all touched files → all pass (note:
  `ops/production-validation.md` also fails prettier but that is pre-existing
  and untouched by this change — confirmed via `git stash`).

## Safety Confirmation — Destination Disabled by Default

- `sendTelemetryEvent()` reads the destination only from
  `NEXT_PUBLIC_TELEMETRY_ENDPOINT`; no real endpoint is hardcoded anywhere.
- When unset (default state), `sendTelemetryEvent()` never calls `fetch` and
  returns `undefined` synchronously — no-op, confirmed by
  `client.test.ts > 'is disabled by default...'`.
- Rejection, synchronous throw (malformed destination), and never-resolving
  timeout are all covered by one `it.each` in `client.test.ts` — none throw,
  none mutate the passed event, none delay the caller (function always
  returns synchronously).
- All boundary helpers (`recordApiBoundaryTelemetry`, `recordQueryBoundaryTelemetry`,
  `recordGlobalErrorTelemetry`) wrap `createTelemetryEvent` + `sendTelemetryEvent`
  in their own `try { } catch { }` — defense in depth, so even a hypothetical
  future defect inside contracts/redaction cannot escape into API results,
  React Query state, or the global error retry path.

## Risks / Deviations

1. **Diff size (791 > 400)** — see above; primary deviation from the task
   brief's budget. Full spec/scenario coverage was prioritized over hitting
   an arbitrary line count.
2. **API-client 401/refresh path** is telemetry-tagged (recoveryClass
   `retry`, outcome `recovered`) at the moment the failure is first observed,
   not after the refresh+retry actually completes — this keeps "exactly once"
   simple and avoids touching the existing refresh/queue logic, but means the
   event is emitted optimistically rather than reflecting final success/failure
   of the retry. Documented as a design simplification, not a spec violation
   (spec requires "exactly one diagnostic," not delayed/confirmed outcome).
3. **Real destination/browser proof is explicitly out of scope for F2** per
   design ("F3 supplies supporting browser evidence only") — this apply pass
   only covers the Vitest/node-environment layer.
4. No jsdom/testing-library was added; `global-error.tsx`'s React component
   is exercised only via its extracted pure `recordGlobalErrorTelemetry`
   function and a `typeof` check on the default export, per the explicit
   "no jsdom-only substitute" instruction.
