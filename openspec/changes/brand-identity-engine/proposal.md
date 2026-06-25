# Proposal — Brand Identity Engine (Skin + Structural Defaults)

**Change id:** `brand-identity-engine`
**Date:** 2026-06-12
**Status:** proposed (awaiting owner OK to implement)
**Layer:** Capa 1 (Cimiento) — Módulo 2 (Component Library / brand→video seam)
**Theming level (per `docs/architecture/brand-theming-levels.md`):** Level 1 (skin, done right) + Level 2 (brand structural defaults). NOT Level 3 (composition = Creative Studio, Fase C).

## Problem

Switching brand today "only changes some colors and looks horrible in places" (black text on black background, colors that aren't the brand's, same look regardless of brand). Verified root causes:

1. **No real contrast logic.** `brand-config-mapper.ts:68` infers text color with an exact-string compare (`colorBackground === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'`). Any off-white, lowercase hex, or dark brand → invisible text. This is the black-on-black bug.
2. **`radius` is silently dropped.** The mapper never emits `tokens.radius`, so molds always fall back to platform radii — switching brand never changes corner shapes (Airbnb 40px vs OP 10px never shows).
3. **No surface token.** `StayPromo` paints the info card with the same color as the page background → no separation, text "floats".
4. **Structural defaults hardcoded.** `BrandConfig.defaults` (logo position, cortinillas, promo bar) is hardcoded in the mapper instead of flowing from the brand → every brand has the same skeleton.
5. **Brand fonts never loaded.** `assets.fonts` is mapped to `[]`; brand typography never reaches the preview.

The molds are sound; the **brand→video engine is half-built**. Adding more molds on top of this would multiply the bug.

## What we will do

Fix the engine so **changing brand changes IDENTITY** — skin (color/surface/contrast/radius/fonts/logo) AND structural defaults (logo position, which blocks show, cortinilla style) — proven with the two existing complete presets (OP dark / Airbnb light) across both organisms and all 3 formats.

Skin/skeleton separation stays intact per the decision record: tokens flow through `brandConfig`; structure stays in the organism but is selected by `brand.defaults`.

## Scope

**Guiding requirement (owner, 2026-06-12):** this is the FOUNDATION future phases build on. Everything that defines brand identity MUST be a token — zero hardcoded identity values in molds. Borders/strokes MUST be present and visibly distinct (no border-less buttons/elements). Spacing, radius, strokes, colors, surfaces, fonts — all tokenized and well-applied. Improve what is well-built; don't rebuild.

The goal (owner's words): switching brand must be VISIBLY different — change Avianca→Bancolombia and the font, corner radius, spacing, colors and structure all change noticeably. Today they don't, because tokens are dropped/hardcoded.

**In:**
- **Full tokenization of brand identity.** Extend the brand token model with the missing dimensions: `colors.surface` (panel/card bg), `colors.border`, semantic text tokens `colors.textOnBackground` / `textOnSurface` / `textOnPrimary` (the brand DECLARES which ink is legible on each surface — no runtime math), and a `stroke` token (border widths). `radius` and `spacing` already exist but are dropped/hardcoded — flow them through.
- **Legibility by declared tokens, not math.** The brand states its legible text-on-surface pairs explicitly. This kills black-on-black without any "engine deciding". Elements aren't border-less (a brand can carry a visible border treatment).
- **Map `radius`, `spacing`, `stroke`, `surface`, `border`, semantic text, and `defaults` through `brand-config-mapper.ts`** (stop dropping/hardcoding them).
- Both organisms (`LoopingProductPromo`, `StayPromo`) consume ALL tokens; **remove every hardcoded identity value** (only neutral, non-platform fallbacks remain, used solely when `brandConfig` is undefined).
- Brand font loading in the `@remotion/player` preview from `assets.fonts`.
- **Extend the `/brands` form** so a user can author the full token set; saved into the existing backend `tokens` JSON bag (NO backend change — verified: tokens is free-form JSON). Verify the round-trip: create brand → select → video fully themed.
- Proven against `OP_BRAND_PRESET` + `AIRBNB_BRAND_PRESET` (built-in) AND a user-created brand, across both organisms × all 3 formats.
- **Tokenization audit gate:** no identity value hardcoded in the organisms.

**Out (explicit, deferred):**
- Render-side font loading (render is `RENDER_PROVIDER=mock` now; preview-side loading is what we can verify today — render-side flagged as a dependency for local-render activation).
- A backend change for tokens — NOT expected (tokens is a free-form JSON bag). Only if the round-trip test reveals the backend strips unknown fields would a tiny backend tweak be needed; decide then, don't pre-build.
- Level 3 composition (Creative Studio, Fase C).
- More molds (separate slice, builds on this fixed engine).

## Why now

The owner's immediate priority is brand fidelity ("hagámoslo bien"). This is the foundation every later mold and the Creative Studio build on. Fixing it now prevents duplicating the bug across future molds.

## Rollback

Pure frontend, additive. If a regression appears, revert the mapper + organism changes; presets and the existing brand selector are untouched in shape. No backend or data migration involved.
