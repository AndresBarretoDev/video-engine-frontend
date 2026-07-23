/**
 * TDD RED → GREEN
 * Task 1.1 / 1.4 — auto-layout per format + no-overflow guarantee + no-overlap guarantee
 *
 * Tests cover:
 * 1. getLoopingPromoLayout() returns correct positions per format
 * 2. No element exceeds canvas bounds (no-overflow invariant)
 * 3. No element overlaps with adjacent stacked elements (no-overlap invariant)
 *    Applies to: 9:16 and 1:1 (vertical stack) and 16:9 (two-column horizontal separation)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLoopingPromoLayout,
  type LoopingPromoLayout
} from './looping-product-promo.layout';
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
    `${label}: right edge must fit in canvas width`
  ).toBeLessThanOrEqual(canvas.width);
  expect(
    element.y + element.height,
    `${label}: bottom edge must fit in canvas height`
  ).toBeLessThanOrEqual(canvas.height);
}

/**
 * Assert that elementA's bottom edge does not exceed elementB's top edge.
 * In a vertical stack: elementA is ABOVE elementB.
 */
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

describe('getLoopingPromoLayout', () => {
  describe('returns a layout object for each format', () => {
    FORMATS.forEach(format => {
      it(`returns layout for ${format}`, () => {
        const layout = getLoopingPromoLayout(format);
        expect(layout).toBeDefined();
        expect(layout.format).toBe(format);
        expect(layout.productImage).toBeDefined();
        expect(layout.productName).toBeDefined();
        expect(layout.price).toBeDefined();
        expect(layout.promoTag).toBeDefined();
        expect(layout.logo).toBeDefined();
        expect(layout.ctaText).toBeDefined();
        expect(layout.legalText).toBeDefined();
      });
    });
  });

  describe('16:9 landscape layout', () => {
    it('positions product image in the right half of the canvas', () => {
      const layout = getLoopingPromoLayout('16:9');
      const canvas = FORMAT_DIMENSIONS['16:9'];
      // In landscape, product image should be right-side
      expect(layout.productImage.x).toBeGreaterThan(canvas.width / 2);
    });

    it('positions product name left-aligned (text starts in left half)', () => {
      const layout = getLoopingPromoLayout('16:9');
      const canvas = FORMAT_DIMENSIONS['16:9'];
      expect(layout.productName.x).toBeLessThan(canvas.width / 2);
    });

    it('text alignment is left for 16:9', () => {
      const layout = getLoopingPromoLayout('16:9');
      expect(layout.textAlign).toBe('left');
    });

    it('text column right edge does not reach image left edge (no horizontal overlap)', () => {
      const layout = getLoopingPromoLayout('16:9');
      const textColRight = layout.productName.x + layout.productName.width;
      const imageLeft = layout.productImage.x;
      expect(textColRight).toBeLessThanOrEqual(imageLeft);
    });
  });

  describe('9:16 portrait layout', () => {
    it('positions product image in the upper portion of the canvas', () => {
      const layout = getLoopingPromoLayout('9:16');
      const canvas = FORMAT_DIMENSIONS['9:16'];
      // In portrait, product image should be in upper 60%
      expect(layout.productImage.y).toBeLessThan(canvas.height * 0.6);
    });

    it('positions product name below image center (below 40% of canvas height)', () => {
      const layout = getLoopingPromoLayout('9:16');
      const canvas = FORMAT_DIMENSIONS['9:16'];
      expect(layout.productName.y).toBeGreaterThan(canvas.height * 0.4);
    });

    it('text alignment is center for 9:16', () => {
      const layout = getLoopingPromoLayout('9:16');
      expect(layout.textAlign).toBe('center');
    });
  });

  describe('1:1 square layout', () => {
    it('positions product image in upper-center of the canvas', () => {
      const layout = getLoopingPromoLayout('1:1');
      const canvas = FORMAT_DIMENSIONS['1:1'];
      // In square, image horizontally centered
      expect(layout.productImage.x).toBeGreaterThanOrEqual(0);
      expect(layout.productImage.y).toBeLessThan(canvas.height * 0.55);
    });

    it('text alignment is center for 1:1', () => {
      const layout = getLoopingPromoLayout('1:1');
      expect(layout.textAlign).toBe('center');
    });
  });

  describe('NO-OVERFLOW invariant — all elements must fit within canvas bounds', () => {
    FORMATS.forEach(format => {
      describe(`format ${format}`, () => {
        let layout: LoopingPromoLayout;
        let canvas: { width: number; height: number };

        beforeEach(() => {
          layout = getLoopingPromoLayout(format);
          canvas = FORMAT_DIMENSIONS[format];
        });

        it('productImage does not overflow', () => {
          assertNoOverflow(layout.productImage, canvas, 'productImage');
        });

        it('productName does not overflow', () => {
          assertNoOverflow(layout.productName, canvas, 'productName');
        });

        it('price does not overflow', () => {
          assertNoOverflow(layout.price, canvas, 'price');
        });

        it('promoTag does not overflow', () => {
          assertNoOverflow(layout.promoTag, canvas, 'promoTag');
        });

        it('logo does not overflow', () => {
          assertNoOverflow(layout.logo, canvas, 'logo');
        });

        it('ctaText does not overflow', () => {
          assertNoOverflow(layout.ctaText, canvas, 'ctaText');
        });

        it('legalText does not overflow', () => {
          assertNoOverflow(layout.legalText, canvas, 'legalText');
        });
      });
    });
  });

  describe('NO-OVERLAP invariant — stacked elements must not overlap each other', () => {
    // In vertical-stack formats (9:16 and 1:1), each element must sit
    // strictly below the previous one (bottom edge ≤ next element's top).
    const VERTICAL_FORMATS: VideoFormat[] = ['9:16', '1:1'];

    VERTICAL_FORMATS.forEach(format => {
      describe(`format ${format}`, () => {
        let layout: LoopingPromoLayout;

        beforeEach(() => {
          layout = getLoopingPromoLayout(format);
        });

        it('productImage bottom does not overlap productName top', () => {
          assertNoVerticalOverlap(
            layout.productImage,
            layout.productName,
            'productImage',
            'productName'
          );
        });

        it('productName bottom does not overlap price top', () => {
          assertNoVerticalOverlap(
            layout.productName,
            layout.price,
            'productName',
            'price'
          );
        });

        it('price bottom does not overlap promoTag top', () => {
          assertNoVerticalOverlap(
            layout.price,
            layout.promoTag,
            'price',
            'promoTag'
          );
        });

        it('promoTag bottom does not overlap ctaText top', () => {
          assertNoVerticalOverlap(
            layout.promoTag,
            layout.ctaText,
            'promoTag',
            'ctaText'
          );
        });

        it('ctaText bottom does not overlap legalText top', () => {
          assertNoVerticalOverlap(
            layout.ctaText,
            layout.legalText,
            'ctaText',
            'legalText'
          );
        });
      });
    });

    describe('format 16:9', () => {
      it('text column right edge does not overlap product image left edge', () => {
        const layout = getLoopingPromoLayout('16:9');
        // In 16:9, the text column and image column must be horizontally separated.
        const textColRight = layout.productName.x + layout.productName.width;
        const imageLeft = layout.productImage.x;
        expect(textColRight).toBeLessThanOrEqual(imageLeft);
      });
    });
  });

  describe('layout differences per format', () => {
    it('16:9 and 9:16 produce different productImage positions', () => {
      const landscape = getLoopingPromoLayout('16:9');
      const portrait = getLoopingPromoLayout('9:16');
      // The positions must differ — not the same layout for different formats
      const samePos =
        landscape.productImage.x === portrait.productImage.x &&
        landscape.productImage.y === portrait.productImage.y;
      expect(samePos).toBe(false);
    });

    it('9:16 and 1:1 produce different productImage sizes', () => {
      const portrait = getLoopingPromoLayout('9:16');
      const square = getLoopingPromoLayout('1:1');
      // Canvas dimensions differ → image sizes should differ
      const sameDims =
        portrait.productImage.width === square.productImage.width &&
        portrait.productImage.height === square.productImage.height;
      expect(sameDims).toBe(false);
    });
  });
});
