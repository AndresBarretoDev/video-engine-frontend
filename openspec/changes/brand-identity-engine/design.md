# Design — Brand Identity Engine

**Change id:** `brand-identity-engine`
**Principle (decision record `docs/architecture/brand-theming-levels.md`):** SKIN (tokens) vs SKELETON (structure) stay separate. Tokens flow through `brandConfig`; structure lives in the organism and is SELECTED by `brand.defaults`. This change makes both real without merging them — keeping the Level 3 (composition) door open with no debt.

---

## D0 — Tokenization completeness (the foundation rule)

Every property that expresses brand identity is a token on `BrandConfig`:

| Dimension | Token | Today | After |
|-----------|-------|-------|-------|
| Brand colors | `colors.primary/secondary/accent` | ✅ flows | ✅ |
| Page background | `colors.background` | 🟡 fallback `#FFFFFF` | ✅ flows, neutral fallback only if `brandConfig` undefined |
| **Panel/card surface** | `colors.surface` *(new)* | ❌ reuses background | ✅ distinct from background |
| Text inks | `colors.textOnBackground` / `textOnSurface` / `textOnPrimary` | 🔴 broken inference | ✅ brand DECLARES legible ink per surface (no math) |
| **Border color** | `colors.border` *(new)* | ❌ none | ✅ stroke color |
| **Stroke width** | `stroke.{button,card,badge}` *(new)* | ❌ none | ✅ visible, distinct borders |
| Corner radius | `radius.{button,badge,image}` | 🔴 dropped by mapper | ✅ flows |
| Spacing | `spacing.{padding,gap}` | 🔴 hardcoded 60/24 | ✅ flows |
| Typography | `fonts.heading/body` | 🟡 family only, not loaded | ✅ flows + loaded in preview |
| Logo | `assets.logo` | ✅ flows | ✅ |
| Structural defaults | `defaults.*` | 🔴 hardcoded in mapper | ✅ flows + honored |

**Rule:** organisms MUST NOT hardcode any identity value. The ONLY permitted hardcoded values are NEUTRAL fallbacks (greys, not platform OP blue) used exclusively when `brandConfig === undefined`. A token present in `brandConfig` is always used.

---

## D1 — Legibility by DECLARED semantic tokens (no runtime math)

Replace the broken `brand-config-mapper.ts:68` string-compare inference with explicit semantic tokens. The brand DECLARES which ink is legible on each surface:

- `colors.textOnBackground` — ink on the page background
- `colors.textOnSurface` — ink on a card/panel
- `colors.textOnPrimary` — ink on a primary-colored fill (button/badge)

Each organism uses the token for the surface it's painting on — e.g. a primary-filled badge labels with `textOnPrimary`. No luminance calculation, no "engine deciding".

- **Why declared, not computed:** the owner found auto-contrast confusing and it's unnecessary complexity. A design system declares legible pairs once; this is standard and predictable. The presets ship correct pairs; the brand form (D8) lets a user set them. Black-on-black is impossible because the legible ink is stated, not guessed.
- If a semantic ink is absent (older brand), fall back to a NEUTRAL ink chosen against the documented neutral surface fallback — never platform blue, never the same color as its surface.

**No `brand-contrast.ts` helper** — dropped from scope. Simpler.

---

## D2 — Surface vs background (fixes the floating-text card)

- Add `colors.surface`. Page background = `colors.background`; panels/cards/info-boxes = `colors.surface`.
- `StayPromo` InfoCard switches from `brand.bgColor` to `brand.surfaceColor`.
- If a brand omits `surface`, derive a subtle elevation from `background` (lighten on dark brands, darken on light brands) so a card is always distinguishable — never identical to the page.

---

## D3 — Borders / strokes (owner: must be visible and distinct)

- Add `stroke: { button: number; card: number; badge: number }` (px widths) + `colors.border`.
- Buttons, cards and badges render `border: {stroke.X}px solid {colors.border}`. No element is border-less.
- Stroke width is a brand signature: a brand can read "soft" (thin 1px + large radius) or "technical" (medium 2–3px + small radius). Stroke and radius are applied together so the border treatment is deliberate.
- Border color defaults: if `colors.border` absent, derive from the surface's readable ink at reduced opacity (so it's visible but not harsh) — never zero-width.

---

## D4 — Map radius, spacing, stroke, defaults through the mapper

`brand-config-mapper.ts` stops dropping/hardcoding:
- `tokens.radius` → pass through (was `undefined`).
- `tokens.spacing` → pass through brand values (was hardcoded 60/24).
- `tokens.stroke` + `colors.surface` + `colors.border` → new pass-through.
- `defaults.*` → pass through from the brand (was hardcoded `'fade'/'bottom'/'bottom-right'`).
- `assets.fonts` → pass through brand font URLs (was `[]`).
- Keep neutral fallbacks ONLY for genuinely-absent optional fields, and make them neutral grey — never platform OP blue.

---

## D5 — Structural defaults honored (Level 2 / SKELETON-by-brand)

`BrandConfig.defaults` already exists: `cortinillaEntrada`, `cortinillaCierre`, `promoBarStyle` (top|bottom), `productOverlayPosition` (bottom-right|bottom-left|center).

- Organisms READ these and arrange accordingly: logo/overlay position, which cortinilla blocks render, promo bar placement.
- Proof target: OP and Airbnb presets get DIFFERENT `defaults` so switching brand visibly changes the skeleton (e.g. Airbnb logo top-left / no closing cortinilla; OP logo bottom-right / animated cortinilla), per the owner's selected scope.
- SKIN/SKELETON stays separated: the organism still OWNS the structure; the brand only PICKS among variants the organism offers. No arbitrary layouts (that's Level 3 / Creative Studio).

---

## D6 — Fonts loaded in preview

- Load `assets.fonts` URLs into the `@remotion/player` preview (Remotion `<link>`/`loadFont` or `@remotion/fonts`) so brand typography actually shows. This is what makes "Avianca=Arial vs Bancolombia=Verdana" visible — the owner's exact example.
- **Dependency flagged:** render-side font loading (CLI) is needed when `RENDER_PROVIDER=local` turns on. Out of scope here (render is mock); noted for the local-render slice.

## D8 — Brand form authors the full token set (round-trip)

- Extend `src/domains/brands/components/brand-tokens-form.tsx` to capture the new tokens (surface, border, semantic text inks, stroke, radius, structural defaults) alongside the existing color/font fields.
- Saved via the existing `updateBrandTokens` mutation as a JSON object under `tokens` — the backend stores it as-is (free-form JSON, verified against the contract; no backend change).
- **Round-trip acceptance:** create a brand in `/brands` → pick it in authoring → the video is fully themed. This directly answers "what happens when I create another brand": it works, because the form captures every token and the backend persists the JSON.
- IF (only if) the round-trip shows the backend strips unknown token fields, a minimal backend adjustment is needed — decided at that point, not pre-built.

---

## D7 — What stays (already well-built, don't rebuild)

- The `componentId` authoring registry pattern, the preset structure, the brand selector, the format-aware layout helpers (`getFormatScale`, overflow handling), the multi-format render flow. These are sound — this change feeds them better tokens, it does not replace them.

---

## Testing strategy (Strict TDD)

- `brand-config-mapper.ts`: tests that radius/spacing/stroke/surface/border/semantic-text/defaults/fonts all flow through and that absent optionals get NEUTRAL (non-platform) fallbacks.
- Organism layout tests: extend existing `*.layout.test.ts` to assert no identity value is hardcoded (borders present, surface ≠ background, radius/spacing/inks sourced from brandConfig).
- Brand form: test that the new fields serialize into the `tokens` object sent to the API.
- Visual verification (Chrome MCP, owner's rule): both organisms × OP + Airbnb + one user-created brand × 3 formats — confirm switching brand visibly changes font, radius, spacing, color and structure; legible text everywhere; cards separated from background.

## Out of scope (deferred, written here so it isn't lost)

- Render-side font loading (local-render slice).
- A backend change — not expected (tokens is free-form JSON). Only if the round-trip reveals field-stripping.
- More molds (separate slice on top of this engine).
- Level 3 composition (Creative Studio, Fase C).
