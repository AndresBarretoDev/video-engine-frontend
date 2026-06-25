# Tasks — Brand Identity Engine

Strict TDD: write the test, watch it fail, implement, watch it pass. `pnpm test` after each group.
Order is dependency-driven: token model → contrast helper → mapper → organisms → visual proof.

## Phase 1 — Token model (the foundation) ✅
- [x] 1.1 Extended `brand-config.types.ts`: added `colors.surface`, `colors.border`, semantic inks `textOnBackground/textOnSurface/textOnPrimary`, and `stroke: {button,card,badge}`. All optional (incremental-safe). zod + types updated.
- [x] 1.2 Both presets updated with surface/border/semantic inks/stroke. Airbnb `defaults` deliberately DIFFERENT from OP (cortinillaCierre 'none', promoBarStyle 'top', overlay 'bottom-left') so the skeleton visibly differs. Radius/fonts already differed.
- [x] 1.3 Extended `BrandDesignTokens` (domain) with surface/border/semantic inks/radius/stroke/structure (all optional).
- [x] Verify: tsc clean, 164 tests green.

## Phase 2 — Mapper (stop dropping/hardcoding)
- [x] 2.1 TEST: `brand-config-mapper` — radius, spacing, stroke, surface, border, semantic text inks, defaults, fonts all flow through; absent optionals → NEUTRAL (non-platform) fallbacks; the `=== '#FFFFFF'` inference is gone.
- [x] 2.2 Rewrite the identity section of `brand-config-mapper.ts`: pass every token through; use the declared semantic ink per surface; remove the string-compare inference and all platform-blue fallbacks (neutral grey only). Green.

## Phase 3 — Organisms consume tokens (remove hardcoded identity)
- [x] 3.1 `LoopingProductPromo`: source background/surface/border/stroke/radius/spacing/fonts from brandConfig; card uses `surface` not `background`; text uses the declared semantic ink per surface; buttons/cards/badges carry the brand border. Remove hardcoded identity values (keep only neutral undefined-brand fallbacks). Update `resolve-brand` + `*.brand-tokens.test.ts`.
- [x] 3.2 `StayPromo`: same treatment; InfoCard uses `surface` (fixes floating text). Update `*.brand-tokens.test.ts`.
- [x] 3.3 Honor structural `defaults` in both: logo/overlay position, which cortinilla blocks render, promo bar placement.

## Phase 4 — Fonts in preview
- [x] 4.1 Load `assets.fonts` URLs into the `@remotion/player` preview path. Graceful fallback if absent. (Render-side loading flagged for the local-render slice.)

## Phase 5 — Brand form authors the full token set (round-trip)
- [x] 5.1 TEST: brand form serializes the new fields into the `tokens` object sent to the API.
- [x] 5.2 Extend `brand-tokens-form.tsx` + brand schema: inputs for surface, border, semantic inks, stroke, radius, structural defaults (sensible defaults pre-filled). Green.
- [ ] 5.3 Round-trip verify (Chrome): create a brand in `/brands` → select it in authoring → video fully themed. If the backend strips unknown token fields, STOP and report (tiny backend tweak decided then).

## Phase 6 — Tokenization audit + visual proof
- [ ] 6.1 Audit gate: no identity hex/px hardcoded in the two organisms outside the documented neutral-fallback block.
- [ ] 6.2 Visual verification (Chrome MCP): both organisms × OP + Airbnb + one user-created brand × 16:9 / 9:16 / 1:1. Confirm switching brand visibly changes font, radius, spacing, color AND structure; legible text on every surface; card ≠ background; brand fonts showing. Screenshot each.
- [ ] 6.3 `pnpm test` full suite green. (Build NOT run — owner runs builds.)

## Acceptance checklist
- [ ] Switching OP ↔ Airbnb changes color, surface, border width, corner radius, spacing, font AND structure (logo position / cortinilla) — not just color. The change is OBVIOUS.
- [ ] No black-on-black or illegible text in any organism×format combo (ink is declared per surface).
- [ ] Every button/card/badge carries its brand-defined border (no border-less elements).
- [ ] No identity value hardcoded in organisms (only neutral undefined-brand fallbacks).
- [ ] All tokens (color/surface/border/stroke/radius/spacing/font/logo/defaults) flow from `brandConfig`.
- [ ] A user-created brand (made in `/brands`) themes a video fully — round-trip works.
- [ ] Existing tests still green + new mapper/form tests added.
