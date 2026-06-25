# Backend Handoff — Seed real brand design tokens

> **For the backend agent (op-video-engine-backend).** The frontend brand-identity engine
> is implemented: it themes videos entirely from a brand's `tokens` JSON. Today the seeded
> brands carry only dummy tokens, so videos can't show real brand identity. This doc gives
> the **exact token values** to seed + asks you to **add an Airbnb brand**.
>
> Contract version: v2 (2026-06-12). Supersedes the colors-only shape in `GET-brand-tokens.contract.md`.
> Frontend consumer: `src/domains/video-generation/utils/brand-config-mapper.ts` → `resolveRemotionBrand`.
> NO frontend fallback/bridge exists — a brand renders ONLY from its own `tokens`. If `tokens`
> lacks `colors.primary`, the selector shows the template's house default, not the brand.

## What to do

1. **Store `tokens` as free-form JSON — do NOT strip unknown fields.** The frontend owns the
   token shape; the backend persists it verbatim. If any DTO/validator whitelists `tokens`
   sub-fields, loosen it so `surface`, `border`, `textOnBackground/Surface/Primary`, `radius`,
   `stroke`, and `structure` survive a round-trip. (Verify: POST a brand with these fields, GET
   it back, confirm nothing was dropped.)
2. **Add a new brand: Airbnb** (slug `airbnb`) — it doesn't exist in the seed yet.
3. **Seed each brand's `tokens`** with the values below (replaces the dummy data).

## Token shape (`Brand.tokens`)

```jsonc
{
  "colors": {
    "primary": "#hex",            // required — the brand's main color
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",         // page/canvas background of the video
    "text": "#hex",
    "surface": "#hex",            // card/panel background, distinct from background
    "border": "#hex",             // stroke color for buttons/cards/badges
    "textOnBackground": "#hex",   // declared legible ink on the background
    "textOnSurface": "#hex",      // declared legible ink on a card/panel
    "textOnPrimary": "#hex"       // declared legible ink on a primary-colored fill
  },
  "fonts": { "heading": "Family, fallback", "body": "Family, fallback" },
  "radius": { "button": 0, "badge": 0, "image": 0 },   // px
  "stroke": { "button": 0, "card": 0, "badge": 0 },    // px border widths
  "structure": {                                        // brand structural defaults (Level 2)
    "cortinillaEntrada": "fade",
    "cortinillaCierre": "fade | none",
    "promoBarStyle": "top | bottom",
    "productOverlayPosition": "bottom-right | bottom-left | center"
  },
  "logo": { "url": "https://…", "width": 240, "height": 80, "whiteUrl": "https://… (optional)" }
}
```

> Note: text inks are **declared**, not computed. Each brand states the legible ink per surface —
> this is what prevents black-on-black. Always provide `textOnBackground/Surface/Primary`.

---

## Brand tokens to seed

### Nike (slug `nike`) — source: `templates-designs/DESIGN-NIKE.md` (real)
```json
{
  "colors": {
    "primary": "#111111", "secondary": "#f5f5f5", "accent": "#d30005",
    "background": "#ffffff", "text": "#111111", "surface": "#f5f5f5", "border": "#cacacb",
    "textOnBackground": "#111111", "textOnSurface": "#111111", "textOnPrimary": "#ffffff"
  },
  "fonts": { "heading": "Oswald, sans-serif", "body": "Inter, sans-serif" },
  "radius": { "button": 30, "badge": 30, "image": 0 },
  "stroke": { "button": 0, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "none", "promoBarStyle": "bottom", "productOverlayPosition": "bottom-left" },
  "logo": { "url": "https://placehold.co/240x80/111111/FFFFFF?text=NIKE", "width": 240, "height": 80 }
}
```
Nike signature: pill CTAs (30px) + **square** product images (0px), black-on-white editorial.

### Airbnb (slug `airbnb`) — ADD THIS BRAND — source: `templates-designs/DESIGN-AIRBNB.md` (real)
```json
{
  "colors": {
    "primary": "#ff385c", "secondary": "#222222", "accent": "#ff385c",
    "background": "#ffffff", "text": "#222222", "surface": "#f7f7f7", "border": "#dddddd",
    "textOnBackground": "#222222", "textOnSurface": "#222222", "textOnPrimary": "#ffffff"
  },
  "fonts": { "heading": "Inter, sans-serif", "body": "Inter, sans-serif" },
  "radius": { "button": 8, "badge": 9999, "image": 14 },
  "stroke": { "button": 1, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "fade", "promoBarStyle": "top", "productOverlayPosition": "center" },
  "logo": { "url": "https://placehold.co/240x80/ff385c/FFFFFF?text=airbnb", "width": 240, "height": 80 }
}
```
Airbnb signature: single Rausch voltage (#ff385c) on white, soft 8px buttons / 14px cards.

### Bancolombia (slug `bancolombia`) — source: their published token export
```json
{
  "colors": { "primary": "#fdda24", "secondary": "#00448c", "accent": "#00448c", "background": "#ffffff", "text": "#2c2a29", "surface": "#f4f4f4", "border": "#dddddd", "textOnBackground": "#2c2a29", "textOnSurface": "#2c2a29", "textOnPrimary": "#2c2a29" },
  "fonts": { "heading": "Work Sans, sans-serif", "body": "Work Sans, sans-serif" },
  "radius": { "button": 8, "badge": 60, "image": 6 },
  "stroke": { "button": 0, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "fade", "promoBarStyle": "top", "productOverlayPosition": "bottom-left" },
  "assets": { "fonts": ["https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap"] },
  "logo": { "url": "https://placehold.co/240x80/fdda24/2c2a29?text=Bancolombia", "width": 240, "height": 80 }
}
```
Yellow primary with DARK ink on it (`textOnPrimary #2c2a29`) — never white-on-yellow.

### Samsung (slug `samsung`) — source: brand color guide
```json
{
  "colors": { "primary": "#1428a0", "secondary": "#000000", "accent": "#1428a0", "background": "#ffffff", "text": "#000000", "surface": "#f4f6fb", "border": "#dddddd", "textOnBackground": "#000000", "textOnSurface": "#000000", "textOnPrimary": "#ffffff" },
  "fonts": { "heading": "Inter, sans-serif", "body": "Inter, sans-serif" },
  "radius": { "button": 8, "badge": 8, "image": 4 },
  "stroke": { "button": 0, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "fade", "promoBarStyle": "bottom", "productOverlayPosition": "bottom-right" },
  "assets": { "fonts": ["https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"] },
  "logo": { "url": "https://placehold.co/240x80/1428a0/FFFFFF?text=SAMSUNG", "width": 240, "height": 80 }
}
```

### Avianca (slug `avianca`) — source: brand color guide
```json
{
  "colors": { "primary": "#da291c", "secondary": "#1a1a1a", "accent": "#da291c", "background": "#ffffff", "text": "#1a1a1a", "surface": "#f7f7f7", "border": "#e5e5e5", "textOnBackground": "#1a1a1a", "textOnSurface": "#1a1a1a", "textOnPrimary": "#ffffff" },
  "fonts": { "heading": "Mulish, sans-serif", "body": "Mulish, sans-serif" },
  "radius": { "button": 24, "badge": 24, "image": 8 },
  "stroke": { "button": 0, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "fade", "promoBarStyle": "bottom", "productOverlayPosition": "center" },
  "assets": { "fonts": ["https://fonts.googleapis.com/css2?family=Mulish:wght@400;700;800&display=swap"] },
  "logo": { "url": "https://placehold.co/240x80/da291c/FFFFFF?text=avianca", "width": 240, "height": 80 }
}
```

### Almacenes Éxito (slug `almacenes-exito`) — source: brand color guide
```json
{
  "colors": { "primary": "#ffe701", "secondary": "#e2231a", "accent": "#e2231a", "background": "#ffffff", "text": "#111111", "surface": "#fff8cc", "border": "#e5e5e5", "textOnBackground": "#111111", "textOnSurface": "#111111", "textOnPrimary": "#111111" },
  "fonts": { "heading": "Poppins, sans-serif", "body": "Poppins, sans-serif" },
  "radius": { "button": 8, "badge": 9999, "image": 8 },
  "stroke": { "button": 0, "card": 1, "badge": 1 },
  "structure": { "cortinillaEntrada": "fade", "cortinillaCierre": "none", "promoBarStyle": "top", "productOverlayPosition": "bottom-right" },
  "assets": { "fonts": ["https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"] },
  "logo": { "url": "https://placehold.co/240x80/ffe701/111111?text=exito", "width": 240, "height": 80 }
}
```

> Color sources: Nike/Airbnb = official `DESIGN.md` files in `templates-designs/`. Samsung/Avianca/Éxito = brand color guides (brandpalettes / schemecolor). Bancolombia = their published token export. Substitute fonts where the brand font is proprietary. These are the EXACT values the frontend loaded into the running DB for the demo — seed them verbatim so the seed matches the demo.

## Create-DTO note (how the backend should create the brands)
- The `POST /brands` DTO accepts ONLY `{ name, description? }` — it rejects `logoUrl`/`slug`/`tokens` ("property X should not exist"). The slug is derived from the name (`Airbnb` → `airbnb`).
- So in the seed: `prisma.brand.create({ data: { name, slug, description, organizationId, tokens: {...} } })` directly (the seed writes the DB, not the DTO), OR create then update tokens. The 6 token blocks above go in the `tokens` JSON column.
- The seed already runs `prisma.brand.deleteMany()` first, so re-seeding REPLACES the frontend's API-loaded copies with the seeded ones — no duplicates, the seed is authoritative.

## Round-trip status: ✅ CONFIRMED WORKING (2026-06-12)
A live `PATCH /api/brands/:id` with the full token shape above (Nike) returned 200 and
`GET` returned **every field intact** — `surface`, `border`, `textOnPrimary`, `radius`,
`stroke`, `structure`, `assets.fonts`. **The backend already persists `tokens` as
free-form JSON and strips nothing — NO backend change is required for the demo.**
This handoff is now about SEEDING the real values (below) + adding the Airbnb brand,
not about a schema fix.

## Acceptance
- [ ] `GET /brands` / `GET /brands/:id` return each brand with the full `tokens` above.
- [ ] A new `airbnb` brand exists (slug `airbnb`).
- [x] A round-trip (PATCH tokens → GET) preserves all new fields — verified 2026-06-12.

## Frontend follow-up (not backend)
- Map brand font CSS URLs into the preview (currently the two design.md fonts — Oswald/Inter — load from Google Fonts via the preset path; backend brands need their font URL carried in `tokens` or `assets` and mapped). Tracked separately; does not block seeding.
</content>
