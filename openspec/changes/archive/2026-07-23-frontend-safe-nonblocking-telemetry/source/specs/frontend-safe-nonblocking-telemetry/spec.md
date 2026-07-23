# Frontend Safe Non-Blocking Telemetry Specification

## Purpose

Define C02/F2 diagnostics. F2 is the sole acceptance owner for PR-F02; F3 supplies browser support evidence only.

## Requirements

<!-- Acceptance owner: F2; Gate: PR-F02 -->
### Requirement: Frontend Telemetry

Route, API-contract, preview, and recoverable failures MUST emit typed, non-blocking diagnostics through an owner-approved destination. Events MUST expose only route, boundary, outcome, recovery class, correlation ID, build SHA, and timestamp. Payloads, creative content, cookies, credentials, tokens, stacks, URL query values, and private asset URLs MUST NOT appear.

#### Scenario: Browser observes recoverable contract telemetry

- GIVEN real authentication and mocks are disabled in a browser journey
- WHEN a recoverable API contract failure is presented
- THEN recovery MUST remain usable and exactly one diagnostic MUST use only allowlisted keys
- AND forbidden values MUST NOT appear in serialized or nested form

#### Scenario: Telemetry destination fails

- GIVEN the destination is absent, rejects, times out, or returns malformed data
- WHEN a wired application boundary emits a diagnostic
- THEN the caller MUST retain its value, timing bound, error handling, and recovery behavior
- AND telemetry failure MUST NOT throw into the application flow

### Requirement: Immutable Allowlist Projection

Every event MUST be created by one centralized projection that discards unknown fields and normalizes permitted coarse values before transport.

#### Scenario: Hostile nested input is supplied

- GIVEN nested objects, arrays, `Error` values, query strings, credentials, or private URLs
- WHEN projection executes
- THEN forbidden and unknown data MUST be absent rather than masked incompletely
- AND the original input MUST remain unmodified

### Requirement: Stable Boundary Integration

Global-error, API-client, and React Query cache adapters MUST preserve existing architecture and MUST emit at most once for a single boundary outcome.

#### Scenario: Equivalent failure crosses one boundary

- GIVEN a recoverable failure reaches an existing wired boundary
- WHEN the boundary handles and retries it
- THEN one stable coarse event MUST be emitted
- AND React Query MUST retain server-state ownership, Zustand MUST remain UI-only, and `/src/lib/api/client.ts` MUST remain the NestJS/httpOnly-cookie boundary

#### Scenario: Global error recovers

- GIVEN `src/app/global-error.tsx` presents its retry path
- WHEN telemetry succeeds or fails
- THEN the framework-required default export and visible retry behavior MUST remain available

## Ownership

F2 exclusively closes PR-F02 and its named scenario. F3 Playwright evidence links here as supporting evidence and cannot transfer closure.
