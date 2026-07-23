# Design: Frontend Artifact, CI, and Staging

## Technical Approach

Test artifact/workflow contracts without building. A minimal SHA route, standalone non-root image, and owner CI bind checks, build identity, digest, deployment, and Playwright staging to one candidate.

## Architecture Decisions

| Decision | Choice and rationale | Rejected tradeoff |
|---|---|---|
| Identity | Public build-info exposes only approved SHA/version; it grants no authorization. | Broad environment dump or private route. |
| Artifact | Frozen pnpm inputs, standalone Next.js output, non-root runtime, immutable digest. | Mutable install, root image, or retag-as-proof. |
| CI | Owner-dispatched named jobs fail closed and compare one SHA throughout. | Agent mutation of branch protection or cross-SHA evidence. |
| Staging | Playwright uses real NestJS/httpOnly cookies, protected assets, preview, recovery, telemetry; both flags false. | Mocks, auth bypass, or jsdom-only proof. |
| Architecture/UI | Preserve `/src/lib/api/client.ts`, React Query, Zustand UI-only, existing routes/UI, and global-error default-export exception. | Supabase, Server Actions, domain scaffold, or redesign. |

## Data Flow

```text
SHA/API target -> owner build -> BUILD_ID/digest -> CI -> staging
Playwright(real auth, flags=false) -> identity/NestJS/assets/preview/recovery -> promote or block
```

## File Changes

| File | Action | Responsibility |
|---|---|---|
| `src/app/api/build-info/route.ts` | Create | Minimal public SHA/version schema. |
| `next.config.ts` | Modify | Standalone output. |
| `Dockerfile`, `.dockerignore` | Create | Frozen non-root artifact contract. |
| `.github/workflows/frontend-ci.yml` | Create | Owner-dispatched blocking checks/build/staging jobs. |
| `src/lib/validation/image-contract.test.ts` | Create | Image-input and runtime rules. |
| `src/lib/validation/ci-contract.test.ts` | Create | Workflow, cancellation, limit, and identity rules. |
| `tests/e2e/staging.spec.ts` | Create | Real artifact/integration journey. |
| `ops/production-validation.md` | Modify | Scannable identity/environment/rollback record. |

## Interfaces / Contracts

Build-info returns approved `sha`/version only. Evidence binds runtime, flags, API target, exits, `.next/BUILD_ID`, digest, candidate/promoted SHA, staging, and rollback digest; missing/unequal identities fail closed.

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | Image/workflow/evidence | Vitest unsafe-input, failed-job, SHA-mismatch, cancellation, and limit fixtures. |
| E2E | Staging | Playwright wrong-SHA/flag/API/asset/recovery cases plus owner success. |
| Runtime | Build/deploy | Owner records build, digest, deployment, identity, and authenticated journey; agent never builds. |

Strict TDD records RED, GREEN, triangulation, REFACTOR, exact exits, paths, diff size, runtime observation, and rollback. Documentation work loads `cognitive-doc-design`.

## Queued Promotion and Instructions

This complete root package is NOT directly applyable; never run the root dispatcher or infer native relationships/edit roots here. After F3 is accepted, the parent copies all four artifacts into `op-video-engine-frontend/openspec/changes/frontend-artifact-ci-staging/`, with root `tasks.queued.md` copied as canonical `tasks.md`. Only repo-local native status is authoritative, and only one frontend change is promoted at a time.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/.codex/skills/cognitive-doc-design/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rule entrypoints: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`.

Review with `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`.

## Threat Matrix

| Boundary | Applicability | Safe/failure response | Planned RED test |
|---|---|---|---|
| Workflow command execution | Applicable — `frontend-ci.yml` runs validation processes. | Fixed repo-local commands only; injection, missing dependency, or nonzero exit blocks promotion. | `ci-contract.test.ts`: composed/untrusted command, absent dependency, and failed exit. |
| Image build process | Applicable — owner builds a standalone image. | Frozen inputs, validated SHA/API target, bounded context, non-root runtime; unsafe input fails before publish. | `image-contract.test.ts`: mutable lock, malformed input, excessive context, root user. |
| Partial failure | Applicable — checks/build/deploy/staging can diverge. | All required jobs bind one SHA; any partial success or mismatch blocks promotion and preserves prior digest. | `ci-contract.test.ts` and `staging.spec.ts`: each failed stage and cross-SHA fixture. |
| Cancellation and cleanup | Applicable — workflow or staging can cancel. | Cancellation never promotes; temporary credentials/artifacts are cleaned while immutable evidence is retained. | `ci-contract.test.ts`: cancelled job and absent cleanup/retention step. |
| Resource limits | Applicable — CI/browser/image work consumes bounded resources. | Concurrency, timeout, trace retention, and image context are bounded; limit exhaustion fails closed. | `ci-contract.test.ts`: missing concurrency/timeout; `staging.spec.ts`: bounded trace policy. |
| Documentation-like executable classification | N/A — no path classifier or documentation execution is introduced. | Documentation remains inert input. | None. |
| Git selection/commit state | N/A — promotion is repo-local and defines no Git command. | Native repo-local status supplies authority after copying. | None. |
| Push/PR automation | N/A — no push, PR, branch-protection, or remote mutation command is created. | Owner-managed remote configuration remains external. | None. |
| Route authorization | N/A — build-info is informational and cannot authorize protected routes. | Existing NestJS/httpOnly-cookie protection remains authoritative. | None. |

## Rollout / Rollback

Land after F3. Owner builds, publishes, deploys, and promotes only after matching evidence. Roll back by redeploying the prior digest; never rebuild/retag it.
