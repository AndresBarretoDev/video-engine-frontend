# Backend Contract — Brand design tokens on `GET /brands` / `GET /brands/:id`

> **Source of truth (frontend):**
> - Domain type: `src/domains/brands/types.ts` → `BrandConfig.tokens` (holds `BrandDesignTokens`)
> - Consumer: `src/domains/video-generation/utils/brand-config-mapper.ts` → `resolveRemotionBrand()`
> - Selector: `src/domains/brands/components/brand-selector.tsx`
> - Remotion target: `src/remotion/types/brand-config.types.ts` → `BrandConfig`
> - Contract version: **v1 (2026-06-10)**

---

## Why this matters

The authoring view now has a **brand selector**: the producer picks a brand and the
live preview re-skins (colors, fonts, logo). For that to work, each brand must carry
its **design tokens**. Today the brand entities the backend would serve are skeletal
(`id`, `name`, `slug`, …) — **no colors, no fonts, no logo**. The frontend mocks were
enriched so the feature works locally; the backend must serve the same shape.

The frontend reads tokens via `resolveRemotionBrand(brand)`. If `brand.tokens` is
absent or has no `colors.primary`, it falls back to a template preset — so the selector
silently does nothing for that brand. To make brand selection real, populate `tokens`.

---

## Shape: `BrandConfig.tokens` = `BrandDesignTokens`

`GET /brands` and `GET /brands/:id` must return each brand with a `tokens` object:

```jsonc
{
  "id": "brand-001",
  "name": "Lidl",
  "slug": "lidl",
  "isActive": true,
  // ... existing fields ...
  "tokens": {
    "colors": {
      "primary":    "#0050AA",   // required
      "secondary":  "#FFF000",   // optional
      "accent":     "#E60A14",   // optional (defaults to primary if absent)
      "background": "#FFFFFF",   // optional (defaults #FFFFFF)
      "text":       "#0A0A0A"    // optional (defaults #0A0A0A)
    },
    "fonts": {                    // optional (defaults to Inter)
      "heading": "Lidl Font Pro, Arial, sans-serif",
      "body":    "Arial, sans-serif"
    },
    "logo": {                     // optional
      "url":      "https://cdn.example.com/brands/lidl/logo.png",
      "width":    240,
      "height":   80,
      "whiteUrl": "https://cdn.example.com/brands/lidl/logo-white.png"
    }
  }
}
```

### Rules

- `tokens.colors.primary` is the **only hard requirement** for a brand to be applied.
  Without it, the frontend uses the template's fallback preset (the selector appears
  to do nothing for that brand).
- Hex colors `#RRGGBB`. `fonts.*` are CSS font-family strings (the families must be
  loadable at render — see the Remotion font story).
- This `tokens` shape is the SAME "seed format" already read by `brand-card.tsx`
  (`tokens.colors`, `tokens.logo`) — do not invent a different shape.
- It maps to the Remotion `BrandConfig` via `resolveRemotionBrand` →
  `mapBrandConfigToRemotionBrand`. The frontend owns that mapping; the backend just
  needs to return `tokens` in this shape.

---

## Acceptance criteria

- [ ] `GET /brands` returns each brand with a `tokens` object (at least `colors.primary`).
- [ ] `GET /brands/:id` returns the full `tokens` (colors + fonts + logo when available).
- [ ] Hex colors validate as `#RRGGBB`; `logo.url` is a fetchable URL.
- [ ] Brands without configured tokens may omit `tokens` (frontend falls back gracefully).
