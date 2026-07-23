# Frontend Production Validation Handoff

Status: `PENDING_F4_EVIDENCE`

F4 (`frontend-artifact-ci-staging`) is the sole acceptor of the release
artifact: immutable image identity, owner-dispatched CI (PR-F03), and real
staging validation (PR-F04). Every field below stays `PENDING_F4_EVIDENCE`
until the owner builds, deploys, and runs `tests/e2e/staging.spec.ts` against
a real staging environment. F1 established Node/pnpm identity, package/lock
atomicity, and deterministic non-writing checks only — it does not build,
validate, or accept a release artifact.

## Quick path (owner, once F4 is dispatched)

1. Build the image: `docker build --build-arg BUILD_SHA=<candidate SHA> --build-arg NEXT_PUBLIC_API_URL=<staging API URL> .`
2. Push the immutable digest to the registry and deploy it to staging.
3. Run `NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false STAGING_PROMOTED_SHA=<candidate SHA> PLAYWRIGHT_BASE_URL=<staging URL> pnpm exec playwright test tests/e2e/staging.spec.ts --project=chromium`.
4. Record the fields below (BUILD_ID, digest, promoted SHA, staging result, rollback target) and flip Status once every field is filled.

## Owner Production Build Evidence (task 3.4)

Owner-run production build for the `frontend-build-lint-baseline` Ola 0 candidate. The owner ran `pnpm build` (clean, no errors) against the working tree now committed as the candidate below; the frozen install exit was captured separately.

| Evidence                   | Value                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| Candidate SHA              | `08b4e24fcab7bb90bb85bcc8a46b62a3f1fcbc58`                         |
| Candidate tree             | `a0f3d287c8638280b4648075b4925eb495de3e8d`                         |
| Branch                     | `chore/frontend-lint-01-foundation`                                |
| Node                       | `v22.22.3`                                                         |
| pnpm                       | `10.15.1`                                                          |
| Frozen install exit        | `0` (`pnpm install --frozen-lockfile`)                             |
| Production build exit      | `0` — owner-run `pnpm build`, no errors                            |
| `.next/BUILD_ID`           | `QFsbA9L7E36SWf1fWel1N`                                            |
| `package.json` sha256      | `4799cd5170b9958a2ce7b87c71e4128392ecdfa1ad8015a1930c1715a6fc6878` |
| `pnpm-lock.yaml` sha256    | `3595842854503814e892520d5f38956239b69a8ff083cc0433b78f1ca5adf1c4` |
| `eslint.config.mjs` sha256 | `f071175bcc6b3a11881f987bb249e3cd8cb880ab73d193d13026087722ce0827` |

Note: F4 (`frontend-artifact-ci-staging`) remains the authoritative acceptor of the release artifact and provenance per the handoff below. This record fulfils `frontend-build-lint-baseline` task 3.4 owner evidence only.

## Acceptance Owner

The existing C02/F4 package `frontend-artifact-ci-staging` owns candidate-bound frozen-install, build, `.next/BUILD_ID`, artifact, deployment, and provenance acceptance. This record is only the open handoff from F1.

## Pending F4 Evidence

| Evidence              | State               |
| --------------------- | ------------------- |
| Candidate SHA         | PENDING_F4_EVIDENCE |
| Frozen install result | PENDING_F4_EVIDENCE |
| Production build exit | PENDING_F4_EVIDENCE |
| .next/BUILD_ID        | PENDING_F4_EVIDENCE |
| Provenance            | PENDING_F4_EVIDENCE |

F4 MUST collect and evaluate these values outside F1 against its immutable artifact and staging contract. Nothing in this file closes a release gate.

## F4 Owner Evidence — Artifact, CI, and Staging

Links one owner-run cycle: build → publish → deploy → staging validation.
`ci-contract.test.ts` and `image-contract.test.ts` (`src/lib/validation/`)
enforce the workflow/image shape below in CI; they cannot supply the runtime
values themselves — only the owner's real build/deploy/staging run can.

| Evidence                      | Value               |
| ----------------------------- | ------------------- |
| Candidate SHA (build input)   | PENDING_F4_EVIDENCE |
| Promoted SHA (staging target) | PENDING_F4_EVIDENCE |
| Image digest                  | PENDING_F4_EVIDENCE |
| `.next/BUILD_ID` (image)      | PENDING_F4_EVIDENCE |
| Owner CI run (PR-F03)         | PENDING_F4_EVIDENCE |
| Staging result (PR-F04)       | PENDING_F4_EVIDENCE |
| `build-info` sha == promoted  | PENDING_F4_EVIDENCE |
| Rollback target digest        | PENDING_F4_EVIDENCE |

### Checklist (flip Status only when every row is checked)

- [ ] Image built with `--build-arg BUILD_SHA` / `--build-arg NEXT_PUBLIC_API_URL`, frozen lockfile, non-root runtime (`Dockerfile`, `src/lib/validation/image-contract.test.ts`)
- [ ] `.github/workflows/frontend-ci.yml` `checks` → `build` → `staging-gate` all green for one candidate SHA
- [ ] Staging deployed the same immutable digest; `GET /api/build-info` sha equals the promoted SHA
- [ ] `tests/e2e/staging.spec.ts` passed with `NEXT_PUBLIC_AUTH_BYPASS=false` and `NEXT_PUBLIC_USE_MOCKS=false`
- [ ] Rollback target digest recorded (prior immutable image, never a rebuild/retag)

## Rollback

Revert the F1 runtime, check, and package/lock boundary together. For F4,
block the candidate and redeploy the prior immutable digest recorded above —
never rebuild or retag it. Preserve this handoff as pending until F4 supplies
its own authoritative evidence.
