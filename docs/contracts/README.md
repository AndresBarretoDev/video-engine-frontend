# Cross-Repo Contracts & Handoff — Frontend ↔ Backend

> **What this is:** the single channel through which the frontend tells the backend
> what API it needs. Frontend and backend are separate repos worked by separate
> Claude agents — they coordinate through these artifacts, NOT direct calls.
>
> **Convention:** when either side finishes something that affects the other, it
> (1) writes/updates the contract here, (2) updates the status table below, and
> (3) saves it to Engram (`project: "op-video-engine"`). One brain per repo.
>
> **Vision context:** [`../architecture/brand-theming-levels.md`](../architecture/brand-theming-levels.md)
> — SKIN vs SKELETON, the 3 levels of brand power, and why project-in-route is orthogonal.

---

## Status board

| Contract | Owner to implement | Status | File |
| --- | --- | --- | --- |
| `GET /templates` returns full catalog (2 templates) | Backend | ✅ Done (backend implemented) | [`GET-templates.contract.md`](./GET-templates.contract.md) |
| `POST /projects/:id/render-single` template-agnostic `compositionProps` | Backend | 🔴 **TODO — priority 1** | [`POST-render-single.contract.md`](./POST-render-single.contract.md) |
| `GET /brands[/:id]` return `tokens` (colors/fonts/logo) | Backend | 🟡 **TODO — priority 2** | [`GET-brand-tokens.contract.md`](./GET-brand-tokens.contract.md) |

---

## 🔴 Message to BACKEND — what's on your plate now

**Priority 1 — Generalize `POST /projects/:projectId/render-single`.**
Full spec: [`POST-render-single.contract.md`](./POST-render-single.contract.md).

The render DTO is hardcoded to the LoopingProductPromo shape. A StayPromo render
fails with 15+ validation errors; a LoopingProductPromo render still fails on
`radius`. Three concrete must-fixes:

1. **`compositionProps` must be template-agnostic.** Recommended: passthrough
   (`@IsObject()`, no `forbidNonWhitelisted` on the nested prop) — the Remotion zod
   schema is the source of truth and validates at render. Avoids future drift.
2. **Add `brandConfig.tokens.radius`** (optional `{ button, badge, image }` px).
   This breaks BOTH templates today. Airbnb's rounded look depends on it.
3. **`logoPosition` is looping-only** — must not be globally required (StayPromo
   has none).

> Architectural note (worth internalizing): this is the SAME mono-template bug the
> frontend just fixed in its authoring view. Both repos were built for one template.
> Every new template needs generalizing on BOTH ends. Validating `compositionProps`
> against the Remotion schema (instead of a hand-written DTO) makes the backend
> immune to this whole class of bug.

**Priority 2 — Serve brand design `tokens` on `GET /brands[/:id]`.**
Full spec: [`GET-brand-tokens.contract.md`](./GET-brand-tokens.contract.md).

The authoring brand selector re-skins the preview from a brand's `tokens`
(colors/fonts/logo). Brand entities currently lack tokens — populate `tokens` in the
documented shape so brand selection is real. Frontend falls back to a template preset
when tokens are absent, so this is non-breaking but inert until served.

---

## ✅ What the FRONTEND already did (so backend knows what's NOT its problem)

- **Authoring view is now multi-template.** A registry keyed by `componentId`
  (`template-authoring-registry.tsx`) wires each template's organism + form +
  prop-assembler + brand preset. Adding a template = one entry.
- **Frontend sends correct per-template `compositionProps`.** Proven by the backend's
  own 400: it received Stay slots (`listingName`, `location`, …) — i.e. the frontend
  assembles the right shape per template. The backend just needs to accept it.
- **`projectId` is now a valid UUID** in the render call (was `'demo-project-001'`,
  now a UUID stub). The `projectId must be a UUID` error is resolved frontend-side.
- **`GET /templates` consumed live** — the static fallback registry was deleted;
  backend is the single source of truth for the catalog.
- **Brand selector built & wired.** The authoring view now has a `BrandSelector`;
  selecting a brand re-skins the preview via its `tokens` (mapped by
  `resolveRemotionBrand`). Works locally with enriched mocks. Needs backend to serve
  `tokens` (Priority 2 above) for real brands. Registry preset is the fallback.

---

## ⚠️ Frontend's OWN remaining TODOs (tracked here for visibility, not backend work)

- **Project context — DONE (Option B, project-first).** Route
  `/projects/[projectId]/templates/[id]/author` reuses `AuthoringSection`, threading
  the real `projectId` into the render. Entry flow: project detail → "Create video" →
  `/templates?projectId=` → cards link to the nested route. Mock project ids are now
  valid UUIDs (3 mock files). Non-breaking: `/templates` stays a global showroom.
  Vision: [`../architecture/brand-theming-levels.md`](../architecture/brand-theming-levels.md).
- **Tests / Chrome verification:** test deps (`vitest`) not installed in the current
  env; full Chrome verification pending a running dev server + backend.
