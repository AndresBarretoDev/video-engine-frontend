# Backend Contract — `POST /projects/:projectId/render-single`

> **Source of truth (frontend):**
> - Body type: `src/domains/video-generation/types.ts` → `CreateSingleProductRenderDto`
> - `compositionProps` shapes (per template, = Remotion zod schemas):
>   - `src/remotion/components/organisms/looping-product-promo/looping-product-promo.schema.ts` → `LoopingProductPromoProps`
>   - `src/remotion/components/organisms/stay-promo/stay-promo.schema.ts` → `StayPromoProps`
> - Brand shape: `src/remotion/types/brand-config.types.ts` → `BrandConfig`
> - Mutation: `src/domains/video-generation/hooks/use-create-single-render.ts`
> - Contract version: **v1 (2026-06-10)**

---

## Problem this fixes

The render endpoint currently validates `compositionProps` with a DTO hardcoded to
the **LoopingProductPromo** shape (whitelist + `forbidNonWhitelisted`). A StayPromo
render fails with 15+ errors; even a LoopingProductPromo render fails on `radius`.
Observed response:

```
"compositionProps.slots.property listingName should not exist"   // ← rejects Stay slots
"compositionProps.slots.productName should not be empty"         // ← requires Product slots
"compositionProps.logoPosition must be one of ..."               // ← requires looping-only field
"compositionProps.brandConfig.tokens.property radius should not exist"  // ← affects BOTH templates
```

Root cause = the **same mono-template assumption** the frontend authoring view had:
the backend's `compositionProps` DTO only knows one template. It must become
**template-agnostic**, because `compositionProps` is template-specific by nature.

> The frontend `projectId` UUID error (`projectId must be a UUID`) is fixed on the
> frontend side — not part of this contract.

---

## Endpoint

| Method | Path                               | Body                          | Response                       |
| ------ | ---------------------------------- | ----------------------------- | ------------------------------ |
| POST   | `/projects/:projectId/render-single` | `CreateSingleProductRenderDto` | `{ jobIds: string[], totalJobs: number }` |

### Body — `CreateSingleProductRenderDto`

```ts
interface CreateSingleProductRenderDto {
  templateId: string;          // e.g. "stay-promo"
  compositionId: string;       // e.g. "stay-promo-16-9" (matches Remotion registration)
  compositionProps: object;    // template-specific — see below. DO NOT whitelist to one shape.
  format: '16:9' | '9:16' | '1:1';
  projectId: string;           // UUID
  outputNamePrefix?: string;
}
```

---

## The fix: validate `compositionProps` per template, not as one fixed shape

`compositionProps` differs by template. Pick ONE approach:

### Approach A — passthrough (recommended, drift-proof)

Do **not** deep-validate `compositionProps` with a hand-written DTO. The Remotion
zod schema (frontend) is the single source of truth and validates again at render.
Validate only the envelope (`templateId`, `compositionId`, `format`, `projectId`)
and accept `compositionProps` as a free-form object.

- ✅ Never drifts from the Remotion schemas (this bug can't recur).
- Use `@IsObject()` (no `forbidNonWhitelisted` on the nested prop).

### Approach B — discriminated union by componentId/compositionId

Keep per-template DTOs (`LoopingProductPromoPropsDto`, `StayPromoPropsDto`) and pick
the validator from the `compositionId` prefix. More code; must be updated for every
new template (the cost Approach A avoids).

Either way, these three rules MUST hold:

1. **Accept Stay slots** (`listingName`, `location`, `heroImage`, `rating`,
   `reviewCount?`, `pricePerNight`, `currency`, `ctaText`, `legalText?`).
2. **`logoPosition` is looping-only** — it must NOT be required globally. StayPromo
   has no `logoPosition`.
3. **`brandConfig.tokens.radius` is valid** — add it to the brand DTO (see below).
   This currently breaks BOTH templates.

---

## `compositionProps` shapes (per template)

### LoopingProductPromoProps

```ts
{
  brandConfig?: BrandConfig;
  format: '16:9' | '9:16' | '1:1';
  slots: {
    productName: string;
    productImage: string;
    priceCurrent: string;
    priceOriginal?: string;
    promoTag?: string;
    ctaText: string;
    legalText?: string;
  };
  timing: { totalDurationInFrames: number; introDurationInFrames: number; outroDurationInFrames: number };
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
```

### StayPromoProps

```ts
{
  brandConfig?: BrandConfig;
  format: '16:9' | '9:16' | '1:1';
  slots: {
    listingName: string;
    location: string;
    heroImage: string;
    rating: string;
    reviewCount?: string;
    pricePerNight: string;
    currency: string;
    ctaText: string;
    legalText?: string;
  };
  timing: { totalDurationInFrames: number; introDurationInFrames: number; outroDurationInFrames: number };
  // NOTE: no logoPosition.
}
```

### BrandConfig — `tokens.radius` is the missing piece

`brandConfig.tokens` must allow an **optional** `radius` object (px values). Airbnb's
rounded look depends on it:

```ts
tokens: {
  colors: { primary; secondary; accent; background; text; textInverse };   // all string
  fonts: { heading: { family: string; weights: number[] }; body: { ... } };
  animation: { defaultEasing: 'spring'|'ease-out'|'ease-in-out'; defaultDuration: number; springConfig: { damping; stiffness; mass } };
  spacing: { padding: number; gap: number };
  radius?: { button: number; badge: number; image: number };   // ← ADD THIS (optional)
}
```

---

## Acceptance criteria

- [ ] `POST /projects/:id/render-single` with a **StayPromo** `compositionProps` returns 2xx (jobIds).
- [ ] Same with a **LoopingProductPromo** `compositionProps` returns 2xx.
- [ ] `brandConfig.tokens.radius` (button/badge/image) is accepted for both templates.
- [ ] `logoPosition` is NOT required when absent (Stay), still accepted when present (looping).
- [ ] Stay slots are accepted; product slots are not required for a Stay render.
- [ ] A malformed envelope (bad `format`, non-UUID `projectId`) still 400s.
