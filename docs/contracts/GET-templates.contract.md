# Backend Contract — `GET /templates`

> **Source of truth:** this contract is derived from the frontend types and the
> static registry that the frontend uses as a fallback. The backend MUST return
> exactly this shape so the frontend can drop the fallback (task 3.1).
>
> - Frontend type: `src/domains/templates/types.ts` → `TemplateDescriptor`
> - Frontend reference data: `src/constants/template-registry.ts` → `STATIC_TEMPLATE_REGISTRY`
> - Frontend consumer: `src/domains/templates/hooks/use-templates.ts`
> - Contract version: **v1 (2026-06-09)**

---

## Problem this fixes

`GET /templates` currently returns **only one** template (`looping-product-promo`).

The frontend hook treats the endpoint as **all-or-nothing**:

```ts
const result = await apiClient<TemplateDescriptor[]>('/templates');
if (Array.isArray(result) && result.length > 0) {
  return result;                  // backend wins as soon as it returns ANY item
}
return STATIC_TEMPLATE_REGISTRY;  // only used on empty/failed response
```

Because the backend returns 1 item, `length > 0` is true and the static registry
(which holds 2 templates) is never consulted. **Result: `stay-promo` disappears.**
The fix is to make the backend return the full catalog.

---

## Endpoints

| Method | Path             | Response                | Notes                          |
| ------ | ---------------- | ----------------------- | ------------------------------ |
| GET    | `/templates`     | `TemplateDescriptor[]`  | Full catalog (currently 2)     |
| GET    | `/templates/:id` | `TemplateDescriptor`    | Single template by `id`; 404 if missing |

---

## Response shape — `TemplateDescriptor`

```ts
interface TemplateCompositionRef {
  format: '16:9' | '9:16' | '1:1';   // VideoFormat enum
  compositionId: string;             // MUST match an id registered in remotion/index.tsx
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
}

interface TemplateDescriptor {
  id: string;
  name: string;
  description: string;
  componentId: string;               // Remotion organism id, e.g. "LoopingProductPromo"
  formats: TemplateCompositionRef[];
  thumbnailUrl?: string;             // optional — static preview fallback
  tags: string[];
  createdAt: string;                 // ISO 8601
  updatedAt: string;                 // ISO 8601
}
```

**Rules — what is hard contract vs. what the backend owns:**

- **HARD contract (must match exactly, or Remotion breaks at runtime):**
  - `formats[].compositionId` — must match an id registered in `src/remotion/index.tsx`.
  - `formats[].width`, `height`, `durationInFrames`, `fps` — must match the registered composition.
  - `formats[].format` — one of `16:9 | 9:16 | 1:1`, nothing else.
  - `id` and `componentId` — identify the template + its Remotion organism.
- **SOFT fields (backend is the source of truth — frontend just displays them):**
  - `description`, `tags`, `createdAt`, `updatedAt`, `thumbnailUrl`.
  - These do NOT need to match the static registry. The static registry is a
    disposable fallback that gets deleted in cleanup — do not align to it.
- Backend must NOT add or remove top-level fields (shape is fixed); it consumes
  this type directly with no mapping layer.

---

## Payload `GET /templates` must return

> ⚠️ `looping-product-promo` ALREADY works in the backend — **leave it exactly as
> it is**. Its `description`/`tags`/dates may differ from the JSON below and that
> is FINE (soft fields, backend owns them). The real gap is the **`stay-promo`**
> entry, which is missing. For `stay-promo`, the `formats` block below is the hard
> contract and must be copied verbatim.

```json
[
  {
    "id": "looping-product-promo",
    "name": "Looping Product Promo",
    "description": "A looping promotional video for a single product. Shows product image, price, promo tag, and CTA. Auto-adapts layout per format.",
    "componentId": "LoopingProductPromo",
    "formats": [
      { "format": "16:9", "compositionId": "looping-product-promo-16-9", "width": 1920, "height": 1080, "durationInFrames": 300, "fps": 30 },
      { "format": "9:16", "compositionId": "looping-product-promo-9-16", "width": 1080, "height": 1920, "durationInFrames": 300, "fps": 30 },
      { "format": "1:1",  "compositionId": "looping-product-promo-1-1",  "width": 1080, "height": 1080, "durationInFrames": 300, "fps": 30 }
    ],
    "tags": ["product", "promo", "looping", "social"],
    "createdAt": "2026-06-09T00:00:00.000Z",
    "updatedAt": "2026-06-09T00:00:00.000Z"
  },
  {
    "id": "stay-promo",
    "name": "Stay Promo",
    "description": "An Airbnb-style promotional video for a property or listing. Features a dominant hero image with name, location, star rating, price per night, and a pill-shaped CTA. Split-screen layout for 16:9, stacked for 9:16 and 1:1.",
    "componentId": "StayPromo",
    "formats": [
      { "format": "16:9", "compositionId": "stay-promo-16-9", "width": 1920, "height": 1080, "durationInFrames": 300, "fps": 30 },
      { "format": "9:16", "compositionId": "stay-promo-9-16", "width": 1080, "height": 1920, "durationInFrames": 300, "fps": 30 },
      { "format": "1:1",  "compositionId": "stay-promo-1-1",  "width": 1080, "height": 1080, "durationInFrames": 300, "fps": 30 }
    ],
    "tags": ["stay", "listing", "airbnb", "hospitality", "social"],
    "createdAt": "2026-06-10T00:00:00.000Z",
    "updatedAt": "2026-06-10T00:00:00.000Z"
  }
]
```

> The `looping-product-promo` block above must match what the backend already
> returns. The **missing item is `stay-promo`** — that is the actual gap.

---

## NestJS implementation guide (backend repo)

> Run this in a Claude session opened **inside the backend repo** so its NestJS
> rules load. One brain per repo.

1. **DTOs** — model `TemplateCompositionRefDto` and `TemplateDescriptorDto`
   (class-validator) to match the shape above. `format` as an enum
   (`'16:9' | '9:16' | '1:1'`); `thumbnailUrl` optional.
2. **Source of the data** — two options:
   - **Seed/config (recommended for v1):** the catalog is essentially static
     configuration. A seeded table or a config constant returning the 2
     descriptors is enough. Add `stay-promo` to whatever currently produces the
     single item.
   - **DB-driven:** if templates live in a table, the bug is a **missing seed
     row for `stay-promo`** — add it with the exact `compositionId`s above.
3. **Controller** — `GET /templates` → `TemplateDescriptorDto[]`,
   `GET /templates/:id` → `TemplateDescriptorDto` (404 when not found).
4. **Guards** — apply the same JWT guard used by the rest of the read endpoints.

---

## Acceptance criteria

- [ ] `GET /templates` returns an array of length **2**.
- [ ] The array contains both `looping-product-promo` **and** `stay-promo`.
- [ ] `looping-product-promo` is **unchanged** (do not edit its existing values).
- [ ] Each descriptor has the `TemplateDescriptor` top-level fields (no extra/missing fields).
- [ ] Every `compositionId` + dimensions + fps matches a composition registered in the frontend `remotion/index.tsx`.
- [ ] `GET /templates/stay-promo` returns the single `stay-promo` descriptor.
- [ ] `GET /templates/:unknownId` returns 404.

## Frontend cleanup (after backend ships — task 3.1)

Once the backend returns the full catalog, remove the static fallback:

- `src/domains/templates/hooks/use-templates.ts` — drop the `try/catch` fallback
  to `STATIC_TEMPLATE_REGISTRY` in both `useTemplates` and `useTemplate`.
- `src/constants/template-registry.ts` — delete once nothing imports it.
