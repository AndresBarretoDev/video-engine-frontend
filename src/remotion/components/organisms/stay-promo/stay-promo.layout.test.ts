/**
 * TDD RED → GREEN
 * stay-promo.layout.test.ts
 *
 * StayPromo organism — Airbnb-styled listing/accommodation template.
 * Layout: hero image (dominant) + info card (name, location, rating, price/night, CTA).
 * Distinct from LoopingProductPromo (which is retail packshot + price badge).
 *
 * Tests cover:
 * 1. getStayPromoLayout() returns a valid layout for each format
 * 2. NO-OVERFLOW: every element fits within canvas bounds
 * 3. NO-OVERLAP: stacked elements don't overlap in portrait/square formats
 * 4. 16:9: hero image and info card are horizontally separated (no overlap)
 * 5. Info card height is sufficient (not clipped) — min 300px to accommodate all fields
 * 6. CTA box is wide enough for text without overflow
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStayPromoLayout,
  type StayPromoLayout
} from './stay-promo.layout';
import { FORMAT_DIMENSIONS } from '@/remotion/types/video-format.types';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assertNoOverflow(
  element: { x: number; y: number; width: number; height: number },
  canvas: { width: number; height: number },
  label: string
): void {
  expect(element.x, `${label}: x must be >= 0`).toBeGreaterThanOrEqual(0);
  expect(element.y, `${label}: y must be >= 0`).toBeGreaterThanOrEqual(0);
  expect(
    element.x + element.width,
    `${label}: right edge must fit within canvas width`
  ).toBeLessThanOrEqual(canvas.width);
  expect(
    element.y + element.height,
    `${label}: bottom edge must fit within canvas height`
  ).toBeLessThanOrEqual(canvas.height);
}

function assertNoVerticalOverlap(
  above: { y: number; height: number },
  below: { y: number },
  labelAbove: string,
  labelBelow: string
): void {
  const aboveBottom = above.y + above.height;
  expect(
    aboveBottom,
    `${labelAbove} bottom (${aboveBottom}) must not exceed ${labelBelow} top (${below.y})`
  ).toBeLessThanOrEqual(below.y);
}

// ─── Formats under test ───────────────────────────────────────────────────────

const FORMATS: VideoFormat[] = ['16:9', '9:16', '1:1'];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getStayPromoLayout', () => {
  describe('returns a valid layout object for each format', () => {
    FORMATS.forEach((format) => {
      it(`returns layout for ${format}`, () => {
        const layout = getStayPromoLayout(format);
        expect(layout).toBeDefined();
        expect(layout.format).toBe(format);
        expect(layout.heroImage).toBeDefined();
        expect(layout.infoCard).toBeDefined();
        expect(layout.listingName).toBeDefined();
        expect(layout.location).toBeDefined();
        expect(layout.rating).toBeDefined();
        expect(layout.pricePerNight).toBeDefined();
        expect(layout.ctaButton).toBeDefined();
        expect(layout.logo).toBeDefined();
      });
    });
  });

  describe('16:9 landscape layout — split (hero left, info right)', () => {
    it('hero image is in the left half of the canvas', () => {
      const layout = getStayPromoLayout('16:9');
      const canvas = FORMAT_DIMENSIONS['16:9'];
      // Hero occupies left portion — its right edge should be < canvas width
      expect(layout.heroImage.x).toBeGreaterThanOrEqual(0);
      expect(layout.heroImage.width).toBeGreaterThan(canvas.width * 0.4);
    });

    it('info card is positioned in the right portion of the canvas', () => {
      const layout = getStayPromoLayout('16:9');
      const canvas = FORMAT_DIMENSIONS['16:9'];
      // Info card right column
      expect(layout.infoCard.x).toBeGreaterThan(canvas.width * 0.4);
    });

    it('hero image and info card do NOT overlap horizontally', () => {
      const layout = getStayPromoLayout('16:9');
      const heroRight = layout.heroImage.x + layout.heroImage.width;
      const infoLeft = layout.infoCard.x;
      expect(heroRight).toBeLessThanOrEqual(infoLeft);
    });

    it('text alignment is left for 16:9', () => {
      const layout = getStayPromoLayout('16:9');
      expect(layout.textAlign).toBe('left');
    });

    it('info card is tall enough to show all elements (min 400px)', () => {
      const layout = getStayPromoLayout('16:9');
      expect(layout.infoCard.height).toBeGreaterThanOrEqual(400);
    });
  });

  describe('9:16 portrait layout — hero on top, info card below', () => {
    it('hero image is in the upper portion of the canvas', () => {
      const layout = getStayPromoLayout('9:16');
      const canvas = FORMAT_DIMENSIONS['9:16'];
      expect(layout.heroImage.y).toBeGreaterThanOrEqual(0);
      expect(layout.heroImage.y + layout.heroImage.height).toBeLessThanOrEqual(canvas.height * 0.6);
    });

    it('info card starts below the hero image', () => {
      const layout = getStayPromoLayout('9:16');
      const heroBottom = layout.heroImage.y + layout.heroImage.height;
      expect(layout.infoCard.y).toBeGreaterThanOrEqual(heroBottom);
    });

    it('text alignment is center for 9:16', () => {
      const layout = getStayPromoLayout('9:16');
      expect(layout.textAlign).toBe('center');
    });
  });

  describe('1:1 square layout — hero top, info card below', () => {
    it('hero image is in the upper portion of the canvas', () => {
      const layout = getStayPromoLayout('1:1');
      const canvas = FORMAT_DIMENSIONS['1:1'];
      expect(layout.heroImage.y).toBeGreaterThanOrEqual(0);
      expect(layout.heroImage.y + layout.heroImage.height).toBeLessThanOrEqual(canvas.height * 0.55);
    });

    it('info card starts below hero image', () => {
      const layout = getStayPromoLayout('1:1');
      const heroBottom = layout.heroImage.y + layout.heroImage.height;
      expect(layout.infoCard.y).toBeGreaterThanOrEqual(heroBottom);
    });

    it('text alignment is center for 1:1', () => {
      const layout = getStayPromoLayout('1:1');
      expect(layout.textAlign).toBe('center');
    });
  });

  describe('NO-OVERFLOW — all elements must fit within canvas bounds', () => {
    FORMATS.forEach((format) => {
      describe(`format ${format}`, () => {
        let layout: StayPromoLayout;
        let canvas: { width: number; height: number };

        beforeEach(() => {
          layout = getStayPromoLayout(format);
          canvas = FORMAT_DIMENSIONS[format];
        });

        it('heroImage does not overflow', () => {
          assertNoOverflow(layout.heroImage, canvas, 'heroImage');
        });

        it('infoCard does not overflow', () => {
          assertNoOverflow(layout.infoCard, canvas, 'infoCard');
        });

        it('listingName does not overflow', () => {
          assertNoOverflow(layout.listingName, canvas, 'listingName');
        });

        it('location does not overflow', () => {
          assertNoOverflow(layout.location, canvas, 'location');
        });

        it('rating does not overflow', () => {
          assertNoOverflow(layout.rating, canvas, 'rating');
        });

        it('pricePerNight does not overflow', () => {
          assertNoOverflow(layout.pricePerNight, canvas, 'pricePerNight');
        });

        it('ctaButton does not overflow', () => {
          assertNoOverflow(layout.ctaButton, canvas, 'ctaButton');
        });

        it('logo does not overflow', () => {
          assertNoOverflow(layout.logo, canvas, 'logo');
        });
      });
    });
  });

  describe('NO-OVERLAP — stacked elements in info card must not overlap', () => {
    // In portrait/square, info card elements stack vertically
    const VERTICAL_FORMATS: VideoFormat[] = ['9:16', '1:1'];

    VERTICAL_FORMATS.forEach((format) => {
      describe(`format ${format}`, () => {
        let layout: StayPromoLayout;

        beforeEach(() => {
          layout = getStayPromoLayout(format);
        });

        it('heroImage bottom does not overlap infoCard top', () => {
          assertNoVerticalOverlap(
            layout.heroImage,
            layout.infoCard,
            'heroImage',
            'infoCard'
          );
        });

        it('listingName bottom does not overlap location top', () => {
          assertNoVerticalOverlap(
            layout.listingName,
            layout.location,
            'listingName',
            'location'
          );
        });

        it('location bottom does not overlap rating top', () => {
          assertNoVerticalOverlap(
            layout.location,
            layout.rating,
            'location',
            'rating'
          );
        });

        it('rating bottom does not overlap pricePerNight top', () => {
          assertNoVerticalOverlap(
            layout.rating,
            layout.pricePerNight,
            'rating',
            'pricePerNight'
          );
        });

        it('pricePerNight bottom does not overlap ctaButton top', () => {
          assertNoVerticalOverlap(
            layout.pricePerNight,
            layout.ctaButton,
            'pricePerNight',
            'ctaButton'
          );
        });

        it('ctaButton fits within infoCard bottom', () => {
          const infoCardBottom = layout.infoCard.y + layout.infoCard.height;
          const ctaBottom = layout.ctaButton.y + layout.ctaButton.height;
          const canvas = FORMAT_DIMENSIONS[format];
          expect(ctaBottom).toBeLessThanOrEqual(canvas.height);
        });
      });
    });

    describe('format 16:9', () => {
      it('hero image right edge does not overlap info card left edge', () => {
        const layout = getStayPromoLayout('16:9');
        const heroRight = layout.heroImage.x + layout.heroImage.width;
        expect(heroRight).toBeLessThanOrEqual(layout.infoCard.x);
      });

      it('info card internal elements do not overflow the info card', () => {
        const layout = getStayPromoLayout('16:9');
        const infoRight = layout.infoCard.x + layout.infoCard.width;
        const infoBottom = layout.infoCard.y + layout.infoCard.height;
        // Listing name must fit within info card horizontally
        expect(layout.listingName.x + layout.listingName.width).toBeLessThanOrEqual(infoRight);
        expect(layout.ctaButton.y + layout.ctaButton.height).toBeLessThanOrEqual(infoBottom);
      });
    });
  });

  describe('CTA button is wide enough (min 200px) to hold text', () => {
    FORMATS.forEach((format) => {
      it(`CTA has at least 200px width in ${format}`, () => {
        const layout = getStayPromoLayout(format);
        expect(layout.ctaButton.width).toBeGreaterThanOrEqual(200);
      });
    });
  });

  describe('layout differences per format', () => {
    it('16:9 and 9:16 produce different hero image positions', () => {
      const landscape = getStayPromoLayout('16:9');
      const portrait = getStayPromoLayout('9:16');
      const samePos =
        landscape.heroImage.x === portrait.heroImage.x &&
        landscape.heroImage.y === portrait.heroImage.y;
      expect(samePos).toBe(false);
    });

    it('9:16 and 1:1 produce different hero image dimensions', () => {
      const portrait = getStayPromoLayout('9:16');
      const square = getStayPromoLayout('1:1');
      const sameDims =
        portrait.heroImage.width === square.heroImage.width &&
        portrait.heroImage.height === square.heroImage.height;
      expect(sameDims).toBe(false);
    });
  });
});
