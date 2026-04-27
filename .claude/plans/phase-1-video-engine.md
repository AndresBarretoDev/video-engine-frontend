# Phase 1: Motor de Video — Vertical Slice Plan

**Phase:** 1 — Motor de Video (Component Registry + Compositor)
**Date:** 2026-04-12
**Status:** Planning
**Branch:** feat/phase-4 (continues from current work)
**Strategy:** Vertical Slice — build the minimum Remotion components needed to produce a REAL video end-to-end, then expand.

---

## Context

### Why now
Phases 2, 3, and 4 are built (UI shell, Data Engine, Render Farm) but produce ZERO real video. Phase 1 is the "floor" of the building — without it, everything above is a shell over void.

### Reference: AE Automation Script
The current team uses `docs/Final_Scripts_Automation_4_DynamicImage 4.jsx` in After Effects. It has 4 core capabilities:
1. **Dynamic Text** — JSON field → text layer content
2. **Dynamic Visibility** — JSON field → show/hide layer (opacity 0/100)
3. **Dynamic Color** — JSON hex/RGB → layer fill color
4. **Dynamic Image** — JSON field → swap layer image source

Our Remotion components MUST replicate these 4 capabilities as React props. This is the translation layer from AE → Remotion.

### What the PRD defines
- 8 atoms, 5 molecules, 4 organisms (templates)
- Brand Config system (tokens applied to all components)
- Responsive formats (16:9, 9:16, 1:1)
- Remotion Studio for preview
- Zod schemas for all props

### Vertical Slice Strategy
We do NOT build all 8 atoms + 5 molecules + 4 organisms upfront. We build the MINIMUM set needed for ONE complete video, then expand.

**Target:** Generate a 15-second PromoVideoTemplate with dynamic text, image, price, and brand colors — rendered to a real MP4 file.

---

## What Already Exists

| Artifact | Status | Location |
|----------|--------|----------|
| Component types (Remotion) | Empty scaffold | `src/remotion/` (directory exists) |
| Brand tokens (colors, fonts) | Complete | `src/domains/brands/` (CRUD + tokens editor) |
| Data Engine (variations) | Frontend complete | `src/domains/data-engine/` |
| Render Farm (BullMQ + processor) | Complete (mock render) | Backend `src/render-jobs/` |
| Remotion packages | Need to verify | `@remotion/player`, `@remotion/cli` |

---

## Implementation Groups

### Group 1: Remotion Setup + First Atom (TextBlock)

**Goal:** Remotion Studio running, one atom rendering text with brand tokens.

**Files to create:**

1. **`src/remotion/Root.tsx`** — Remotion entry point, registers all compositions
2. **`src/remotion/schemas/text-block.schema.ts`** — Zod schema for TextBlock props
3. **`src/remotion/components/atoms/text-block.tsx`** — TextBlock atom
   - Props: content, fontFamily, fontSize, fontWeight, color, animation, delay, duration
   - Animations: fade-in, slide-up, slide-left (start with 3, add more later)
   - Uses `useCurrentFrame()` + `interpolate()` from Remotion
   - Reads brand tokens from props (NOT from CSS variables — Remotion renders in headless browser, tokens must be passed as props)
4. **`src/remotion/utils/animations.ts`** — Shared animation helpers (fade, slide, scale)
5. **`remotion.config.ts`** — Remotion CLI config (if not already present)

**AE Script equivalent:** `applyJsonText()` — dynamic text from JSON field → TextBlock receives `content` prop from variation data.

**Acceptance:** `npx remotion studio` opens, shows TextBlock with animated text.

---

### Group 2: Core Atoms (ImageFrame + PricePatch + LogoReveal + ShapeElement)

**Goal:** The 4 remaining atoms needed for a PromoVideoTemplate.

**Files to create:**

1. **`src/remotion/schemas/image-frame.schema.ts`** + **`src/remotion/components/atoms/image-frame.tsx`**
   - Props: src, width, height, objectFit, animation (fade-in, zoom-in, ken-burns), delay
   - AE equivalent: `setLayerForDynamicImage()` — image swap from JSON field

2. **`src/remotion/schemas/price-patch.schema.ts`** + **`src/remotion/components/atoms/price-patch.tsx`**
   - Props: price, originalPrice, currency, backgroundColor, textColor, size, animation, delay
   - AE equivalent: `applyJsonText()` for price + `applyJsonColor()` for background

3. **`src/remotion/schemas/logo-reveal.schema.ts`** + **`src/remotion/components/atoms/logo-reveal.tsx`**
   - Props: logoUrl, width, height, animation (scale-bounce, fade-in), delay, duration

4. **`src/remotion/schemas/shape-element.schema.ts`** + **`src/remotion/components/atoms/shape-element.tsx`**
   - Props: type (circle, rectangle, line), color, width, height, animation, opacity, delay
   - AE equivalent: `applyJsonColor()` for dynamic fill color

**Depends on:** Group 1 (animation utils, Remotion setup)
**Acceptance:** All 5 atoms render independently in Remotion Studio.

---

### Group 3: Brand Config System

**Goal:** Components read brand tokens (colors, fonts, logo) and apply them automatically.

**Files to create:**

1. **`src/remotion/hooks/use-brand-config.ts`**
   - Hook/utility that provides brand tokens to all components
   - In Remotion context, brand config is passed via `inputProps` at composition level
   - Components access it via React context or direct props

2. **`src/remotion/context/brand-context.tsx`**
   - React context that wraps compositions with brand tokens
   - Provides: colors (primary, secondary, accent), fonts (heading, body), logo URL

3. **`src/remotion/schemas/brand-config.schema.ts`**
   - Zod schema for brand config passed as composition props
   - Maps to existing `BrandTokens` type from `src/domains/brands/types.ts`

**AE equivalent:** The brand config is like setting up the AE project with the correct logo, colors, and fonts BEFORE applying the JSON automation. In Remotion, it's props.

**Depends on:** Group 2
**Acceptance:** Changing brand config props changes all component appearances.

---

### Group 4: First Molecules (ProductOverlay + EndCard)

**Goal:** Two molecules that combine atoms into functional video segments.

**Files to create:**

1. **`src/remotion/schemas/product-overlay.schema.ts`** + **`src/remotion/components/molecules/product-overlay.tsx`**
   - Combines: ImageFrame (packshot) + PricePatch + TextBlock (product name)
   - Props: productName, productImage, price, originalPrice, position, animation
   - This is the CORE of what the AE script does: show a product with its data

2. **`src/remotion/schemas/end-card.schema.ts`** + **`src/remotion/components/molecules/end-card.tsx`**
   - Combines: LogoReveal + TextBlock (CTA) + ShapeElement (decorative)
   - Props: brandId (loads brand config), ctaText, legalText, variant, duration

**Depends on:** Group 3 (brand config system)
**Acceptance:** ProductOverlay shows product image + price + name. EndCard shows brand logo + CTA.

---

### Group 5: First Organism (PromoVideoTemplate)

**Goal:** ONE complete video template that produces a real 15-second MP4.

**Files to create:**

1. **`src/remotion/schemas/promo-video.schema.ts`** — Full template props (brand config + product data + settings)

2. **`src/remotion/components/organisms/promo-video-template.tsx`**
   - Structure (per PRD):
     1. Intro: LogoReveal + brand background (1-3s)
     2. Content: ImageFrame or solid background (5-8s)
     3. ProductOverlay: appears over content (product + price)
     4. EndCard: logo + CTA (2-3s)
   - Total: ~15 seconds at 30fps = 450 frames
   - Accepts variation data as props (from Data Engine)
   - Accepts brand config as props (from Brand tokens)
   - Responsive: width/height props for format switching (16:9, 9:16, 1:1)

3. **Register in `src/remotion/Root.tsx`** as a Remotion `<Composition>`

**Depends on:** Group 4
**Acceptance:** `npx remotion render PromoVideo --props '{"productName":"Coca-Cola Zero","price":"$2.990",...}'` produces a real MP4 file.

---

### Group 6: Connect to Render Farm (Real Rendering)

**Goal:** Replace the mock render processor with real Remotion CLI execution.

**Files to modify (backend):**

1. **`src/render-jobs/render-jobs.processor.ts`** — Replace mock sleep loop with:
   ```
   npx remotion render src/remotion/index.ts PromoVideo <outputPath> --props <variationJson>
   ```
   - Parse Remotion stdout for progress (`Rendered frame X/Y`)
   - Update job progress in database
   - On success: create RenderOutput with real file size/duration

2. **`src/render-jobs/remotion-cli.service.ts`** (NEW) — Wrapper around `child_process.spawn`
   - Executes Remotion CLI
   - Streams stdout for progress parsing
   - Handles timeout (configurable, default 10min)

**Depends on:** Group 5 + backend render-jobs module
**Acceptance:** "Send to Render" from Data Engine → real MP4 produced → downloadable from Render Dashboard.

---

### Group 7: Remotion Player Integration (Preview in Browser)

**Goal:** Preview compositions in the Next.js app using @remotion/player.

**Files to create:**

1. **`src/remotion/player/remotion-preview.tsx`** — Client component wrapping `<Player>` from `@remotion/player`
   - Lazy loaded (dynamic import)
   - Accepts composition ID + input props
   - Play/pause/seek controls

2. **Integration points:**
   - Variation detail drawer → show preview of that variation
   - Brand tokens editor → live preview with current tokens
   - Render dashboard → thumbnail previews

**Depends on:** Group 5
**Acceptance:** Clicking a variation shows a playable preview in the browser.

---

## What This Achieves (End-to-End Flow)

```
1. Upload CSV with product data (Data Engine — ALREADY BUILT)
2. Map columns: productName, price, productImage (Data Engine — ALREADY BUILT)
3. Generate 50 variations (Data Engine — ALREADY BUILT)
4. Select variations → "Send to Render" (Phase 4 — ALREADY BUILT)
5. BullMQ processes each variation through PromoVideoTemplate (Group 6 — NEW)
6. Real MP4 files produced with dynamic text, images, prices, brand colors (Group 5 — NEW)
7. Download individual or batch (Phase 4 — ALREADY BUILT)
```

**THIS is the vertical slice.** From CSV to MP4. The full loop.

---

## What This Does NOT Include (Expand Later)

- AudioTrack, VideoClip, SubtitleTrack atoms (not needed for first real video)
- CortinillaEntrada molecule (start with simple LogoReveal intro)
- PromoBar, LowerThird molecules (add as second iteration)
- StoryTemplate, CTVTemplate, BannerVideoTemplate organisms (add after PromoVideo works)
- Responsive format switching (start with 16:9 only, add 9:16 and 1:1 later)
- Component Registry web UI (Phase 2 territory)

---

## AE Script → Remotion Mapping (Reference)

| AE Function | What it does | Remotion Equivalent | Component |
|---|---|---|---|
| `applyJsonText()` | JSON field → text layer | `content` prop → TextBlock | TextBlock |
| `applyJsonOpacity()` | JSON field → show/hide layer | `{show && <Component/>}` or opacity prop | Any atom |
| `applyJsonColor()` | JSON hex → layer fill | `color` prop from brand config / variation data | TextBlock, PricePatch, ShapeElement |
| `setLayerForDynamicImage()` | JSON field → swap image source | `src` prop → ImageFrame | ImageFrame |
| `exportJsonComps()` | Batch add to AE render queue | BullMQ batch creation | Render Farm (DONE) |
| `processDynamicImagesInComp()` | Iterate layers, replace per JSON | Remotion receives all props at once — no iteration needed | PromoVideoTemplate |

---

## Order of Execution

```
Group 1 (Remotion Setup + TextBlock)
  └── Group 2 (Core Atoms)
        └── Group 3 (Brand Config)
              └── Group 4 (Molecules)
                    └── Group 5 (PromoVideoTemplate)
                          ├── Group 6 (Real Rendering)
                          └── Group 7 (Player Preview)
```

**The goal: at the end of Group 6, we have the vertical slice. CSV → MP4. Real video.**

Total estimated files: ~25 new, ~3 modified
