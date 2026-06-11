# Branding & Composition — Vision / Decision Record

> **Status:** vision + guiding principle (not a task). Captures an architectural
> conversation so the direction isn't lost. Shared with backend.
> **Date:** 2026-06-10

---

## The core distinction: SKIN vs SKELETON

When we ask "how much does a brand control a video?", two things get conflated.
Separate them and the whole design space clears up:

- **SKIN (tokens):** colors, fonts, **radius**, spacing. Parameters applied ON TOP
  of a structure. Carried by `BrandConfig.tokens`.
- **SKELETON (structure / layout):** which elements exist and where they go. The
  arrangement. Owned by the template/organism (and, in the future, by composition).

**Worked example (the one that triggered this):**
- "Avianca buttons are 24px rounded, Samsung 8px" → **SKIN.** This is `tokens.radius`
  (`button`/`badge`/`image`) — already in the model. Solved by changing a token, no
  structural change.
- "Avianca distributes elements differently than Samsung" → **SKELETON.** Not a token.
  This is template/composition territory (see levels below).

**Guiding principle:** keep SKIN and SKELETON separate. Tokens flow through
`brandConfig`; structure lives in the organism. As long as that separation holds,
we never paint ourselves into a corner.

---

## The 3 levels of "brand power"

Templated-content systems climb these in order. You do NOT need to solve Level 3 to
ship Level 1.

| Level | Brand controls | Status in this repo |
| --- | --- | --- |
| **1 — Token theming** | Same structure, different skin (colors/fonts/radius) | ✅ **where we are** (brand selector + `tokens`) |
| **2 — Brand structural defaults** | Brand picks variants WITHIN a template (logo position, which blocks show, order) | 🟡 already hinted: `BrandConfig.defaults` (`promoBarStyle`, `productOverlayPosition`, `cortinillaEntrada`) |
| **3 — Composition ("panadería")** | The video is ASSEMBLED from components (atoms/molecules/organisms). Each brand its own "soul" | 🔮 the documented future — `COMPONENT-SYSTEM.md` taxonomy |

Note: Level 2 is **already half-open** — `BrandConfig.defaults` is structure-by-brand.
Level 3 is **already the documented vision** — the atoms/molecules/organisms taxonomy.

---

## What we deliberately decided

1. **Don't rush to Level 3 — by strategy, not laziness.** The data-driven video value
   (cf. the Lidl/Belgium inspiration) comes from CONSTRAINING structure and varying
   data + skin. Let every brand define arbitrary skeletons and you lose the scale and
   consistency that make the product valuable. A brand's "soul" is mostly skin + a few
   structural defaults — not a totally different skeleton. Brands want consistency too.

2. **Two product MODES, not one architecture.** "Scale/batch" (template + data + brand)
   and "custom composition" (panadería) are different surfaces for different customers.
   Don't force one architecture to be both — they likely coexist as two entry points.

3. **What we're building IS the foundation.** The `componentId` authoring registry is
   the same pattern a composition system uses downward (organisms ← molecules ← atoms).
   Skin/skeleton separation keeps the door to Level 3 open with no debt.

---

## Two worlds (showroom vs authoring) — and why project-in-route (Option B) is fine

These coexist without conflict because they're different intents:

- **Showroom / vidriera** (`/templates`): global, no project. "See what's possible."
  Browsing needs no project context.
- **Authoring / render**: scoped to a project. Creating/rendering a real video belongs
  to a project (the backend already models it: `POST /projects/:projectId/render-single`,
  and `Project.brandId` ties a project to a brand).

Putting `projectId` in the route (`/projects/:projectId/templates/:id/author`) mirrors
the backend's resource hierarchy, gives shareable/refresh-safe URLs, and avoids
global-state desync. It's **orthogonal** to the SKIN/SKELETON levels — it blocks nothing.
Bonus: `project.brandId` can pre-select the brand, so the producer enters already
on-brand and the brand selector becomes "try alternatives".

---

## Open questions (decide later, not now)

- Do brands eventually get custom layouts (Level 2.5/3) or stay token-themed (Level 1)?
  Tied to the business model (scale vs bespoke) and who the customer is.
- Where does the "panadería" composition mode live as a surface, and how does it reuse
  the atomic component library?
