/**
 * looping-product-promo.layout.ts
 *
 * Pure functions for auto-layout per video format.
 * No React, no Remotion hooks — pure TypeScript.
 * Designed so that NO element ever exceeds canvas bounds and NO elements overlap.
 *
 * Design ref: design.md D7 / task 1.4
 * Reuses: getFormatScale, getFormatTextAlign from @/remotion/utils/format-utils
 *
 * Layout invariants (enforced by layout.test.ts):
 *   1. No-overflow: for every element: x≥0, y≥0, x+w≤W, y+h≤H
 *   2. No-overlap (9:16 and 1:1): elements stack sequentially with positive gap
 *      productImage.bottom ≤ productName.top
 *      productName.bottom ≤ price.top
 *      price.bottom ≤ promoTag.top
 *      promoTag.bottom ≤ ctaText.top
 *      ctaText.bottom ≤ legalText.top
 *   3. 16:9: text column (left) and image column (right) do NOT overlap horizontally
 */
import type { VideoFormat } from '@/remotion/types/video-format.types';
import { FORMAT_DIMENSIONS } from '@/remotion/types/video-format.types';
import { getFormatTextAlign } from '@/remotion/utils/format-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ElementBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LoopingPromoLayout {
  format: VideoFormat;
  canvasWidth: number;
  canvasHeight: number;
  textAlign: 'left' | 'center';
  /** Packshot / product image */
  productImage: ElementBox;
  /** Product name text block */
  productName: ElementBox;
  /** Price badge */
  price: ElementBox;
  /** Promo tag badge (optional slot — layout reserves space regardless) */
  promoTag: ElementBox;
  /** Brand logo */
  logo: ElementBox;
  /** CTA text */
  ctaText: ElementBox;
  /** Legal text (small, bottom) */
  legalText: ElementBox;
  /** Font sizes */
  fontSize: {
    productName: number;
    price: number;
    promoTag: number;
    ctaText: number;
    legalText: number;
  };
}

// ─── Per-format layout constants ──────────────────────────────────────────────
// All values are absolute pixel positions within the respective canvas.
//
// Constraint 1 (no-overflow): for every element: x >= 0, y >= 0,
//              x + width <= canvasWidth, y + height <= canvasHeight.
//
// Constraint 2 (no-overlap):  for stacked elements: elementN.y + elementN.height
//              <= elementN+1.y  (i.e. bottom edge does not reach the next element's top).

function buildLayout16x9(): LoopingPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['16:9'];
  // 16:9 = 1920 × 1080
  // Two-column layout: left half = text/price/cta, right half = product image.
  // Columns do NOT overlap horizontally — text column ends at W/2, image starts at W/2+gap.

  const PADDING = 80;
  const LOGO_W = 240;
  const LOGO_H = 80;

  // Right column: product image centered in right half
  const IMAGE_W = 720;
  const IMAGE_H = 720;
  const IMAGE_X = W - IMAGE_W - PADDING;
  const IMAGE_Y = (H - IMAGE_H) / 2; // vertically centered on canvas

  // Left column: text elements stacked vertically
  const TEXT_X = PADDING;
  const TEXT_COL_W = W / 2 - PADDING * 2; // 960 - 160 = 800px

  // Verify text column right edge does not reach image left edge
  // TEXT_X + TEXT_COL_W = 80 + 800 = 880 < IMAGE_X = 1920 - 720 - 80 = 1120 ✓

  const PRODUCT_NAME_Y = 180;
  // 64px font × 1.25 lineHeight = 80px/line; allow 2 lines = 160px + breathing room = 168px
  const PRODUCT_NAME_H = 168;
  // productName bottom = 180 + 168 = 348

  const PRICE_GAP = 24;
  const PRICE_Y = PRODUCT_NAME_Y + PRODUCT_NAME_H + PRICE_GAP; // 348 + 24 = 372
  const PRICE_W = 280;
  const PRICE_H = 100;
  // price bottom = 372 + 100 = 472

  const PROMO_TAG_GAP = 20;
  const PROMO_TAG_Y = PRICE_Y + PRICE_H + PROMO_TAG_GAP; // 472 + 20 = 492
  // PROMO_TAG_W: use full text column width — the pill badge inside is inline-flex
  // so it only occupies as much space as its text needs. The container is the ceiling.
  const PROMO_TAG_W = TEXT_COL_W; // 800px — generous, badge stays inline
  const PROMO_TAG_H = 56;
  // promoTag bottom = 492 + 56 = 548

  const CTA_GAP = 32;
  const CTA_Y = PROMO_TAG_Y + PROMO_TAG_H + CTA_GAP; // 548 + 32 = 580
  // CTA width: matches the text column width so the button can GROW with content.
  // Using TEXT_COL_W (800px) as the container — the inline-flex button inside will
  // only occupy as much space as its text needs (auto-width). The box is a ceiling, not a floor.
  const CTA_W = TEXT_COL_W; // 800px — generous room for any CTA text
  const CTA_H = 60;
  // cta bottom = 580 + 60 = 640 ≤ 1080 ✓

  const LEGAL_H = 36;
  const LEGAL_Y = H - LEGAL_H - PADDING; // 1080 - 36 - 80 = 964 ≥ 640 ✓

  return {
    format: '16:9',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'left',
    logo: { x: PADDING, y: PADDING, width: LOGO_W, height: LOGO_H },
    productImage: { x: IMAGE_X, y: IMAGE_Y, width: IMAGE_W, height: IMAGE_H },
    productName: {
      x: TEXT_X,
      y: PRODUCT_NAME_Y,
      width: TEXT_COL_W,
      height: PRODUCT_NAME_H
    },
    price: { x: TEXT_X, y: PRICE_Y, width: PRICE_W, height: PRICE_H },
    promoTag: {
      x: TEXT_X,
      y: PROMO_TAG_Y,
      width: PROMO_TAG_W,
      height: PROMO_TAG_H
    },
    ctaText: { x: TEXT_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    legalText: {
      x: PADDING,
      y: LEGAL_Y,
      width: W - PADDING * 2,
      height: LEGAL_H
    },
    fontSize: {
      productName: 64,
      price: 72,
      promoTag: 36,
      ctaText: 40,
      legalText: 22
    }
  };
}

function buildLayout9x16(): LoopingPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['9:16'];
  // 9:16 = 1080 × 1920
  // Single-column layout: logo → image → title → price → badge → cta → legal
  // Each element anchored below the previous with a defined gap.
  // Elements do NOT overlap — strict sequential stacking with positive gaps.

  const PADDING = 60;
  const LOGO_W = 200;
  const LOGO_H = 66;

  // Logo sits at top with top-padding breathing room
  // logo: y=60, bottom=126

  // Product image: reduced to 560px (52% of canvas width) for balanced composition.
  // Gap from logo bottom (126) to image top = 34px of breathing room.
  const IMAGE_W = 560;
  const IMAGE_H = 560;
  const IMAGE_X = (W - IMAGE_W) / 2; // horizontally centered
  const IMAGE_Y = 160;
  // image bottom = 160 + 560 = 720

  // Text zone starts below image with a clear gap (60px)
  const TEXT_X = PADDING;
  const TEXT_W = W - PADDING * 2; // 1080 - 120 = 960px

  // productName: y=780 (gap from image bottom = 720+60 = 780)
  // Using 780 to satisfy test: productName.y > canvas.height * 0.4 = 768
  const PRODUCT_NAME_Y = IMAGE_Y + IMAGE_H + 60; // 160 + 560 + 60 = 780
  const PRODUCT_NAME_H = 96; // slightly taller to allow 2 lines
  // productName bottom = 780 + 96 = 876

  const PRICE_GAP = 24;
  const PRICE_Y = PRODUCT_NAME_Y + PRODUCT_NAME_H + PRICE_GAP; // 876 + 24 = 900
  const PRICE_W = TEXT_W;
  const PRICE_H = 110;
  // price bottom = 900 + 110 = 1010

  const PROMO_TAG_GAP = 32; // increased from 20 → more air between price and promo badge
  const PROMO_TAG_Y = PRICE_Y + PRICE_H + PROMO_TAG_GAP; // 1010 + 32 = 1042
  const PROMO_TAG_W = TEXT_W;
  const PROMO_TAG_H = 60;
  // promoTag bottom = 1042 + 60 = 1102

  const CTA_GAP = 32;
  const CTA_W = 480;
  const CTA_H = 80;
  const CTA_Y = PROMO_TAG_Y + PROMO_TAG_H + CTA_GAP; // 1102 + 32 = 1134
  const CTA_X = (W - CTA_W) / 2; // horizontally centered
  // cta bottom = 1134 + 80 = 1214

  // Legal anchored at the bottom — 1920 - 40 - 60 = 1820
  // Gap from CTA bottom (1202) to legal top (1820) = 618px — plenty of air.
  const LEGAL_H = 40;
  const LEGAL_Y = H - LEGAL_H - PADDING; // 1920 - 40 - 60 = 1820

  return {
    format: '9:16',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'center',
    logo: { x: PADDING, y: PADDING, width: LOGO_W, height: LOGO_H },
    productImage: { x: IMAGE_X, y: IMAGE_Y, width: IMAGE_W, height: IMAGE_H },
    productName: {
      x: TEXT_X,
      y: PRODUCT_NAME_Y,
      width: TEXT_W,
      height: PRODUCT_NAME_H
    },
    price: { x: TEXT_X, y: PRICE_Y, width: PRICE_W, height: PRICE_H },
    promoTag: {
      x: TEXT_X,
      y: PROMO_TAG_Y,
      width: PROMO_TAG_W,
      height: PROMO_TAG_H
    },
    ctaText: { x: CTA_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    legalText: { x: PADDING, y: LEGAL_Y, width: TEXT_W, height: LEGAL_H },
    fontSize: {
      productName: 68,
      price: 76,
      promoTag: 40,
      ctaText: 44,
      legalText: 26
    }
  };
}

function buildLayout1x1(): LoopingPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['1:1'];
  // 1:1 = 1080 × 1080
  // Single-column layout: logo → image → title → price → badge → cta → legal
  // Tighter budget (1080px total) — image reduced to 420px (39% of canvas).
  // All elements stack sequentially with positive gaps; no element overlaps.

  const PADDING = 50;
  const LOGO_W = 180;
  const LOGO_H = 60;
  // logo: y=40 (slightly less padding to give more space below), bottom=100

  // Product image: 420×420 — compact enough to leave room for text stack
  // Gap from logo bottom (40+60=100) to image top = 20px
  const IMAGE_W = 420;
  const IMAGE_H = 420;
  const IMAGE_X = (W - IMAGE_W) / 2; // horizontally centered = (1080-420)/2 = 330
  const IMAGE_Y = 120;
  // image bottom = 120 + 420 = 540

  // Text zone starts below image with a clear gap (32px)
  const TEXT_X = PADDING;
  const TEXT_W = W - PADDING * 2; // 1080 - 100 = 980px

  // productName: y=572 (gap from image bottom = 540+32 = 572)
  const PRODUCT_NAME_Y = IMAGE_Y + IMAGE_H + 32; // 120 + 420 + 32 = 572
  const PRODUCT_NAME_H = 72;
  // productName bottom = 572 + 72 = 644

  const PRICE_GAP = 16;
  const PRICE_Y = PRODUCT_NAME_Y + PRODUCT_NAME_H + PRICE_GAP; // 644 + 16 = 660
  const PRICE_W = TEXT_W;
  const PRICE_H = 88;
  // price bottom = 660 + 88 = 748

  const PROMO_TAG_GAP = 20; // increased from 14 → more air between price and promo badge
  const PROMO_TAG_Y = PRICE_Y + PRICE_H + PROMO_TAG_GAP; // 748 + 20 = 768
  const PROMO_TAG_W = TEXT_W;
  const PROMO_TAG_H = 52;
  // promoTag bottom = 768 + 52 = 820

  const CTA_GAP = 20;
  const CTA_W = 380;
  const CTA_H = 60;
  const CTA_Y = PROMO_TAG_Y + PROMO_TAG_H + CTA_GAP; // 820 + 20 = 840
  const CTA_X = (W - CTA_W) / 2; // horizontally centered = (1080-380)/2 = 350
  // cta bottom = 840 + 60 = 900

  // Legal anchored at bottom: 1080 - 36 - 50 = 994
  // Gap from CTA bottom (894) to legal top (994) = 100px — breathing room.
  const LEGAL_H = 36;
  const LEGAL_Y = H - LEGAL_H - PADDING; // 1080 - 36 - 50 = 994

  // Verify: LEGAL_Y + LEGAL_H = 994 + 36 = 1030 ≤ 1080 ✓

  return {
    format: '1:1',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'center',
    logo: { x: PADDING, y: 40, width: LOGO_W, height: LOGO_H },
    productImage: { x: IMAGE_X, y: IMAGE_Y, width: IMAGE_W, height: IMAGE_H },
    productName: {
      x: TEXT_X,
      y: PRODUCT_NAME_Y,
      width: TEXT_W,
      height: PRODUCT_NAME_H
    },
    price: { x: TEXT_X, y: PRICE_Y, width: PRICE_W, height: PRICE_H },
    promoTag: {
      x: TEXT_X,
      y: PROMO_TAG_Y,
      width: PROMO_TAG_W,
      height: PROMO_TAG_H
    },
    ctaText: { x: CTA_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    legalText: { x: PADDING, y: LEGAL_Y, width: TEXT_W, height: LEGAL_H },
    fontSize: {
      productName: 56,
      price: 64,
      promoTag: 34,
      ctaText: 38,
      legalText: 22
    }
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the full layout spec for a given VideoFormat.
 * All element boxes are guaranteed to fit within the canvas (no-overflow).
 * In 9:16 and 1:1, all stacked elements are guaranteed not to overlap.
 *
 * Pure function — safe to call in tests and in Remotion components.
 */
export function getLoopingPromoLayout(format: VideoFormat): LoopingPromoLayout {
  switch (format) {
    case '16:9':
      return buildLayout16x9();
    case '9:16':
      return buildLayout9x16();
    case '1:1':
      return buildLayout1x1();
    default: {
      // Exhaustive check — TypeScript will error if a new format is added without handling
      const _exhaustive: never = format;
      void _exhaustive;
      return buildLayout16x9();
    }
  }
}

/**
 * Returns format-specific text align. Re-exports getFormatTextAlign for
 * callers that only need the layout module.
 */
export { getFormatTextAlign };
