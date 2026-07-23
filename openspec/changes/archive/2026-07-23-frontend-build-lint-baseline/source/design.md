# Technical Design: Frontend Build/Lint Baseline

## Technical Approach

Remove the existing full-source ESLint debt without changing product behavior or weakening enforcement. Implementation is delivered as a three-PR feature-branch chain. Each slice owns a stable path set, applies `eslint --fix` only as a candidate transformation, reviews every generated hunk, then resolves non-fixable findings semantically. The final slice makes the repository lint command cover all `src` files with zero warnings and produces owner-run isolated build evidence.

```text
feat/creative-compositor-mvp (tracker; draft/no-merge)
  <- lint-baseline-01-foundation
       <- lint-baseline-02-domains
            <- lint-baseline-03-release-gate
```

Each child PR targets its immediate predecessor; only the tracker is eventually merged to `main`. Target fewer than 350 authored changed lines per slice, leaving review-budget headroom. Before opening a PR, measure authored changes; if a slice would exceed 400 lines, move an entire cohesive directory/work unit forward rather than splitting a logical cleanup or taking a silent exception.

## Architecture Decisions

### 1. Treat autofix output as untrusted candidate edits

Run ESLint autofix only on the slice's explicit paths. Compare before/after diffs and accept formatting-only semicolon/comma/quote corrections. Revert any hunk that changes control flow, values, imports with runtime side effects, JSX structure, or public contracts; fix that finding manually instead. This captures the mechanical majority of the 406 errors while preventing a 508-line unchecked bulk patch.

### 2. Preserve strict rules with six exact schema exceptions

Keep `camelcase`, `no-unused-vars`, `no-explicit-any`, and `no-console` at their current severity. Extend the `camelcase.allow` list in `eslint.config.mjs` only with `image_url`, `video_url`, `original_price`, `required_error`, `product_name`, and `has_discount`. These names are external data/schema keys used by data-engine fixtures, mappings, and Zod options; renaming them would alter contracts. Do not add a wildcard, disable property checking globally, or introduce file-level suppression.

### 3. Resolve semantic findings at their ownership boundary

Remove unused imports, locals, parameters, and obsolete eslint-disable comments only after verifying they have no render, callback, serialization, type-narrowing, or side-effect role. Preserve required interface parameters with the project's accepted underscore convention only when the contract requires their presence. In `src/components/layout/modal-renderer.tsx`, remove the diagnostic `console.warn` while retaining the existing `return null` fallback. Preserve the scoped console suppression in `src/app/spike-demo/page.tsx`: serialization output is the spike's explicit user-visible purpose, not incidental diagnostics.

### 4. Make the final lint gate authoritative

Change `lint:check` in `package.json` to a non-writing full-source command equivalent to `eslint src --max-warnings=0`. `lint:fix` remains the explicit writing command. Do not add ignores or narrow build-time lint coverage.

## Slice Boundaries

1. **Foundation:** mechanical fixes in `src/app/**`, `src/components/**`, `src/constants/**`, `src/domains/brands/**`, and `src/domains/projects/**`; remove the obsolete media-caption disable; handle the modal warning as above.
2. **Domain contracts:** `src/domains/data-engine/**`, `src/domains/render-jobs/**`, `src/domains/users/schema.ts`, and `src/lib/api/mocks/data-engine.mock.ts`; add the six exact allow-list keys and perform verified unused-binding cleanup.
3. **Release gate:** `src/domains/video-generation/**`, `src/remotion/**`, `src/stories/**`, and remaining reported `src/**` paths; update `lint:check`, clear residual findings, run aggregate verification, and update `ops/production-validation.md` with owner evidence.

The path ledger may move a whole directory to the next slice to satisfy the 400-line cap, but no path may be edited concurrently in separate active slices.

## Contracts and Data Flow

No runtime API, component, state, Remotion, or data-model contract changes. The only configuration contract changes are the six exact camelcase exceptions and full-source `lint:check` coverage. Evidence flows from focused lint results per slice to aggregate checks, then to the immutable candidate SHA/tree and `BUILD_ID` recorded in `ops/production-validation.md`.

## Verification Strategy

For every slice: run `pnpm exec eslint <owned-paths> --max-warnings=0`, `pnpm run type:check`, `pnpm run test:unit`, and `git diff --check`; manually audit the diff against the behavior-preservation rules. On slice 3 also run `pnpm exec eslint src --max-warnings=0` and `pnpm run check:ci`.

The final production build is owner-run from an isolated clean candidate with the locked Node/pnpm versions, frozen install, and sanitized environment. Record candidate SHA/tree, lock/config hashes, command outcomes, and `.next/BUILD_ID`; verify tracked files, including `next-env.d.ts`, remain unchanged. A missing `BUILD_ID`, dirty candidate, or warning is a failed gate.

## Threat Model

N/A: this change introduces no routing, subprocess integration, shell construction, authentication, permission, or data-exposure surface. Build commands are an operator verification procedure, not runtime application functionality.

## Rollout and Rollback

Merge/review slices in chain order. Each slice is independently revertible; a failed focused gate stops the chain. Do not rebase a reviewed child onto a different content tree without revalidation. The tracker remains the single integration/rollback boundary.

## Open Questions

None. Exact path allocation is finalized by the pre-slice changed-line forecast without changing scope or acceptance criteria.
