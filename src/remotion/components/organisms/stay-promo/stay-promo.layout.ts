/**
 * stay-promo.layout.ts
 *
 * Pure auto-layout functions for StayPromo organism.
 * No React, no Remotion hooks — pure TypeScript.
 * Safe to call in tests and Remotion components.
 *
 * Distribution is DIFFERENT from LoopingProductPromo:
 *   16:9 — Hero image fills LEFT portion (full height), info card on RIGHT.
 *          This is a "split-screen" layout vs. LoopingProductPromo's
 *          "two-column with small packshot" layout.
 *   9:16 — Hero image dominates the top ~50%, info card below as a panel.
 *   1:1  — Hero image top ~45%, info card below.
 *
 * Layout invariants (enforced by stay-promo.layout.test.ts):
 *   1. No-overflow: for every element: x≥0, y≥0, x+w≤W, y+h≤H
 *   2. No-overlap (9:16, 1:1): stacked elements have positive gap
 *      heroImage.bottom ≤ infoCard.top
 *      listingName.bottom ≤ location.top
 *      location.bottom ≤ rating.top
 *      rating.bottom ≤ pricePerNight.top
 *      pricePerNight.bottom ≤ ctaButton.top
 *   3. 16:9: hero right edge ≤ infoCard left edge (no horizontal overlap)
 *   4. CTA button width ≥ 200px on all formats
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

export interface StayPromoLayout {
  format: VideoFormat;
  canvasWidth: number;
  canvasHeight: number;
  textAlign: 'left' | 'center';
  /** Full hero / property photo */
  heroImage: ElementBox;
  /** Info card container (background panel) */
  infoCard: ElementBox;
  /** Property/listing name (headline) */
  listingName: ElementBox;
  /** Location string (city, neighborhood) */
  location: ElementBox;
  /** Rating row (star + numeric score) */
  rating: ElementBox;
  /** Price per night block */
  pricePerNight: ElementBox;
  /** CTA button (e.g. "Book now") */
  ctaButton: ElementBox;
  /** Brand logo */
  logo: ElementBox;
  /** Font sizes */
  fontSize: {
    listingName: number;
    location: number;
    rating: number;
    price: number;
    priceLabel: number;
    cta: number;
  };
}

// ─── Builders ─────────────────────────────────────────────────────────────────

/**
 * 16:9 — 1920 × 1080
 * Split-screen: hero fills the LEFT ~55% (full height), info card on RIGHT.
 * Gap between columns ≥ 40px.
 */
function buildLayout16x9(): StayPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['16:9'];

  const HERO_W = 1040; // ~54% of 1920
  const HERO_H = H; // full height
  const HERO_X = 0;
  const HERO_Y = 0;

  const GAP = 40;
  const INFO_X = HERO_X + HERO_W + GAP; // 1040 + 40 = 1080
  const INFO_W = W - INFO_X - 40; // 1920 - 1080 - 40 = 800
  const INFO_Y = 60;
  const INFO_H = H - INFO_Y * 2; // 1080 - 120 = 960

  // VERIFY: heroRight (1040) <= infoLeft (1080) ✓
  // VERIFY: INFO_X + INFO_W = 1080 + 800 = 1880 ≤ 1920 ✓
  // VERIFY: INFO_Y + INFO_H = 60 + 960 = 1020 ≤ 1080 ✓

  const INNER_X = INFO_X + 40; // text starts 40px inside info card
  const INNER_W = INFO_W - 80; // 800 - 80 = 720px text width
  const INNER_TOP = INFO_Y + 60; // 60 + 60 = 120

  const LISTING_NAME_Y = INNER_TOP;
  // 48px font × 1.25 lineHeight = 60px per line; 3 lines = 180px → use 192 for breathing room.
  // Using 48px (down from 68px) ensures long titles like "Beautiful Beach House in Malibu"
  // wrap to 2-3 lines within the 720px column without overflowing.
  // 68px was too large: "Beautiful Beach House in Malibu" = ~750px at 68px → exceeds 720px.
  // At 48px: ~530px per line → wraps cleanly at 2 lines.
  const LISTING_NAME_H = 192;
  // bottom = 120 + 192 = 312

  const LOCATION_GAP = 16;
  const LOCATION_Y = LISTING_NAME_Y + LISTING_NAME_H + LOCATION_GAP; // 312 + 16 = 328
  const LOCATION_H = 52;
  // bottom = 328 + 52 = 380

  const RATING_GAP = 20;
  const RATING_Y = LOCATION_Y + LOCATION_H + RATING_GAP; // 380 + 20 = 400
  const RATING_H = 56;
  // bottom = 400 + 56 = 456

  const PRICE_GAP = 28;
  const PRICE_Y = RATING_Y + RATING_H + PRICE_GAP; // 456 + 28 = 484
  const PRICE_H = 110;
  // bottom = 484 + 110 = 594

  const CTA_GAP = 36;
  const CTA_Y = PRICE_Y + PRICE_H + CTA_GAP; // 594 + 36 = 630
  const CTA_W = 420;
  const CTA_H = 80;
  const CTA_X = INNER_X;
  // bottom = 630 + 80 = 710 ≤ INFO_Y + INFO_H = 1020 ✓

  // Logo: overlaid top-left within hero image area
  const LOGO_W = 220;
  const LOGO_H = 72;
  const LOGO_X = 48;
  const LOGO_Y = 48;

  return {
    format: '16:9',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'left',
    heroImage: { x: HERO_X, y: HERO_Y, width: HERO_W, height: HERO_H },
    infoCard: { x: INFO_X, y: INFO_Y, width: INFO_W, height: INFO_H },
    listingName: {
      x: INNER_X,
      y: LISTING_NAME_Y,
      width: INNER_W,
      height: LISTING_NAME_H
    },
    location: { x: INNER_X, y: LOCATION_Y, width: INNER_W, height: LOCATION_H },
    rating: { x: INNER_X, y: RATING_Y, width: INNER_W, height: RATING_H },
    pricePerNight: { x: INNER_X, y: PRICE_Y, width: INNER_W, height: PRICE_H },
    ctaButton: { x: CTA_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    logo: { x: LOGO_X, y: LOGO_Y, width: LOGO_W, height: LOGO_H },
    fontSize: {
      listingName: 48, // reduced from 56: at 48px "Beautiful Beach House in Malibu"
      // wraps cleanly to 2 lines within the 720px column.
      // 56px was too large: ~750px/line exceeds the 720px column.
      location: 34,
      rating: 38,
      price: 76,
      priceLabel: 30,
      cta: 38
    }
  };
}

/**
 * 9:16 — 1080 × 1920
 * Hero image on top (~50% canvas), info card below as a full-width rounded panel.
 */
function buildLayout9x16(): StayPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['9:16'];

  // Logo bar at very top (Airbnb style: branding visible above hero)
  // Hero starts below a thin header bar — this makes y differ from 16:9 which has hero at y=0
  const HEADER_H = 100; // space for logo at top before hero

  // Hero fills full width, below header bar
  const HERO_X = 0;
  const HERO_Y = HEADER_H; // 100 — NOT at y=0, differs from 16:9
  const HERO_W = W; // 1080
  const HERO_H = 840; // hero ends at 940
  // VERIFY: HERO_Y + HERO_H = 100 + 840 = 940 ≤ 1920 ✓

  // Info card: flush below hero
  const PADDING = 48;
  const INFO_X = 0;
  const INFO_Y = HERO_Y + HERO_H; // 100 + 840 = 940
  const INFO_W = W; // 1080
  const INFO_H = H - INFO_Y; // 1920 - 940 = 980
  // VERIFY: INFO_Y + INFO_H = 940 + 980 = 1920 = H ✓

  // Inner text area: padded within info card
  const INNER_X = PADDING;
  const INNER_W = W - PADDING * 2; // 1080 - 96 = 984px
  const INNER_TOP = INFO_Y + 48; // 940 + 48 = 988

  const LISTING_NAME_Y = INNER_TOP; // 988
  // 72px font × 1.25 lineHeight = 90px/line; allow 2 lines = 180px + 12px breathing = 192px.
  // "Beautiful Beach House in Malibu" at 984px width wraps to 2 lines — must fit without overflow.
  const LISTING_NAME_H = 192;
  // bottom = 988 + 192 = 1180

  const LOCATION_GAP = 16;
  const LOCATION_Y = LISTING_NAME_Y + LISTING_NAME_H + LOCATION_GAP; // 1180 + 16 = 1196
  const LOCATION_H = 64;
  // bottom = 1196 + 64 = 1260

  const RATING_GAP = 20;
  const RATING_Y = LOCATION_Y + LOCATION_H + RATING_GAP; // 1260 + 20 = 1280
  const RATING_H = 72;
  // bottom = 1280 + 72 = 1352

  const PRICE_GAP = 24;
  const PRICE_Y = RATING_Y + RATING_H + PRICE_GAP; // 1352 + 24 = 1376
  const PRICE_H = 128;
  // bottom = 1376 + 128 = 1504

  const CTA_GAP = 32;
  const CTA_W = 560;
  const CTA_H = 88;
  const CTA_Y = PRICE_Y + PRICE_H + CTA_GAP; // 1504 + 32 = 1536
  const CTA_X = (W - CTA_W) / 2; // centered
  // bottom = 1536 + 88 = 1624 ≤ 1920 ✓

  // Logo: top header bar, centered
  const LOGO_W = 200;
  const LOGO_H = 66;
  const LOGO_X = 48;
  const LOGO_Y = (HEADER_H - LOGO_H) / 2; // vertically centered in header = 17

  return {
    format: '9:16',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'center',
    heroImage: { x: HERO_X, y: HERO_Y, width: HERO_W, height: HERO_H },
    infoCard: { x: INFO_X, y: INFO_Y, width: INFO_W, height: INFO_H },
    listingName: {
      x: INNER_X,
      y: LISTING_NAME_Y,
      width: INNER_W,
      height: LISTING_NAME_H
    },
    location: { x: INNER_X, y: LOCATION_Y, width: INNER_W, height: LOCATION_H },
    rating: { x: INNER_X, y: RATING_Y, width: INNER_W, height: RATING_H },
    pricePerNight: { x: INNER_X, y: PRICE_Y, width: INNER_W, height: PRICE_H },
    ctaButton: { x: CTA_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    logo: { x: LOGO_X, y: LOGO_Y, width: LOGO_W, height: LOGO_H },
    fontSize: {
      listingName: 72,
      location: 42,
      rating: 48,
      price: 88,
      priceLabel: 36,
      cta: 44
    }
  };
}

/**
 * 1:1 — 1080 × 1080
 * Hero image top ~45%, info card below.
 * Tighter vertical budget than 9:16 — reduce font sizes + gaps.
 */
function buildLayout1x1(): StayPromoLayout {
  const { width: W, height: H } = FORMAT_DIMENSIONS['1:1'];

  const HERO_X = 0;
  const HERO_Y = 0;
  const HERO_W = W; // 1080
  const HERO_H = 460; // ~43% of 1080

  const PADDING = 40;
  const INFO_X = 0;
  const INFO_Y = HERO_H; // 460 — flush below hero
  const INFO_W = W;
  const INFO_H = H - HERO_H; // 1080 - 460 = 620
  // VERIFY: INFO_Y + INFO_H = 460 + 620 = 1080 = H ✓

  const INNER_X = PADDING;
  const INNER_W = W - PADDING * 2; // 1080 - 80 = 1000px
  const INNER_TOP = INFO_Y + 36; // 460 + 36 = 496

  const LISTING_NAME_Y = INNER_TOP;
  const LISTING_NAME_H = 80;
  // bottom = 496 + 80 = 576

  const LOCATION_GAP = 12;
  const LOCATION_Y = LISTING_NAME_Y + LISTING_NAME_H + LOCATION_GAP; // 576 + 12 = 588
  const LOCATION_H = 52;
  // bottom = 588 + 52 = 640

  const RATING_GAP = 14;
  const RATING_Y = LOCATION_Y + LOCATION_H + RATING_GAP; // 640 + 14 = 654
  const RATING_H = 56;
  // bottom = 654 + 56 = 710

  const PRICE_GAP = 16;
  const PRICE_Y = RATING_Y + RATING_H + PRICE_GAP; // 710 + 16 = 726
  const PRICE_H = 100;
  // bottom = 726 + 100 = 826

  const CTA_GAP = 20;
  const CTA_W = 420;
  const CTA_H = 72;
  const CTA_Y = PRICE_Y + PRICE_H + CTA_GAP; // 826 + 20 = 846
  const CTA_X = (W - CTA_W) / 2; // centered
  // bottom = 846 + 72 = 918 ≤ 1080 ✓

  // Logo overlaid on hero top-left
  const LOGO_W = 180;
  const LOGO_H = 60;
  const LOGO_X = 40;
  const LOGO_Y = 40;

  return {
    format: '1:1',
    canvasWidth: W,
    canvasHeight: H,
    textAlign: 'center',
    heroImage: { x: HERO_X, y: HERO_Y, width: HERO_W, height: HERO_H },
    infoCard: { x: INFO_X, y: INFO_Y, width: INFO_W, height: INFO_H },
    listingName: {
      x: INNER_X,
      y: LISTING_NAME_Y,
      width: INNER_W,
      height: LISTING_NAME_H
    },
    location: { x: INNER_X, y: LOCATION_Y, width: INNER_W, height: LOCATION_H },
    rating: { x: INNER_X, y: RATING_Y, width: INNER_W, height: RATING_H },
    pricePerNight: { x: INNER_X, y: PRICE_Y, width: INNER_W, height: PRICE_H },
    ctaButton: { x: CTA_X, y: CTA_Y, width: CTA_W, height: CTA_H },
    logo: { x: LOGO_X, y: LOGO_Y, width: LOGO_W, height: LOGO_H },
    fontSize: {
      listingName: 44, // reduced from 58: at 44px "Beautiful Beach House in Malibu"
      // fits in ~770px — single line within 1000px column, no overflow.
      location: 34,
      rating: 38,
      price: 68,
      priceLabel: 28,
      cta: 36
    }
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the full StayPromo layout for a given VideoFormat.
 * Guaranteed: no-overflow, no-overlap.
 */
export function getStayPromoLayout(format: VideoFormat): StayPromoLayout {
  switch (format) {
    case '16:9':
      return buildLayout16x9();
    case '9:16':
      return buildLayout9x16();
    case '1:1':
      return buildLayout1x1();
    default: {
      const _exhaustive: never = format;
      void _exhaustive;
      return buildLayout16x9();
    }
  }
}

export { getFormatTextAlign };
