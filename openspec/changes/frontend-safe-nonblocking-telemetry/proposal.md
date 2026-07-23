# Proposal: Frontend Safe Non-Blocking Telemetry

## Intent

Close C02's telemetry gate without turning diagnostics into a second failure path. Operators need recoverable route, API-contract, preview, and error-boundary failures to emit useful coarse evidence while protected content and credentials never leave the browser.

## Scope

### In Scope
- Own PR-F02 and its browser-observed recoverable-contract scenario.
- Define typed event names, a strict field allowlist, forbidden-data redaction, bounded non-blocking delivery, and exactly-once boundary emission.
- Wire the existing API client, React Query provider caches, and global error recovery without changing request outcomes or displayed recovery.

### Out of Scope
- Browser matrix/accessibility ownership, deployment/CI, product redesign, or backend changes.
- jsdom/testing-library added solely to prove wiring.
- Server Actions, Supabase, domain scaffolding, or credentials in fixtures.

## Ownership and Lineage

- Parent: C02 `frontend-production-validation-baseline`; dependency: `frontend-runtime-check-contract` (F1).
- Acceptance owner: PR-F02 requirement and `Browser observes recoverable contract telemetry` scenario.
- F3 supplies supporting browser evidence only; ownership remains here.
- Authority: `op-video-engine-docs/PRODUCT.md` and current root SDD artifacts.
- Planning state: complete queued root package, not directly applyable. After F1, parent copies proposal/spec/design and root `tasks.queued.md` into frontend repo-local OpenSpec, renaming it canonical `tasks.md`; the root dispatcher is prohibited.

## Capabilities

### New Capabilities
- `frontend-safe-nonblocking-telemetry`: typed, allowlisted, recoverable client diagnostics.

### Modified Capabilities
None.

## Approach

Build pure contract/redaction functions first, wrap the approved destination in a bounded fire-and-forget adapter, then connect existing global/API/query boundaries. Preserve React Query server state, Zustand UI-only state, and `/src/lib/api/client.ts` as the NestJS/httpOnly-cookie boundary.

## Affected Areas

| Area | Impact |
|---|---|
| `src/lib/telemetry/**` | Typed events, projection, redaction, delivery |
| `src/app/global-error.tsx` | Recoverable error emission; required default export |
| `src/lib/api/client.ts`, `src/lib/providers.tsx` | API/query boundary adapters |

## Risks and Rollback

Telemetry could leak data, duplicate events, or delay recovery. Fail closed on schema input, never on application flow. Rollback disables the approved destination and removes all boundary calls together while preserving user-visible recovery.

## Dependencies

Owner-approved telemetry destination is blocking and remains outside Git.

## Success Criteria

- [ ] PR-F02 has strict-TDD evidence for allowlist, forbidden data, timeout/outage, and exactly-once recovery emission.
- [ ] Browser-observed payload contains only route, boundary, outcome, recovery class, correlation ID, SHA, and timestamp.
