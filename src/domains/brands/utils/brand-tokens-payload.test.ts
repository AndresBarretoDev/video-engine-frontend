/**
 * TDD RED → GREEN
 * Task 5.1 — brand form: full token set serialization
 *
 * Tests verify that:
 * 1. brandTokensEditSchema validates the new fields (surfaces, semantic inks,
 *    shape, structure, fontUrls).
 * 2. buildBrandTokensPayload assembles the BrandDesignTokens shape the
 *    mutation expects — including every new field from Phase 5.
 * 3. resolveRemotionBrand maps fontUrls through to assets.fonts so the
 *    preview's useBrandFonts hook picks them up.
 */

import { describe, it, expect } from 'vitest';
import { brandTokensEditSchema } from '../schema';
import { buildBrandTokensPayload } from './brand-tokens-payload';
import { resolveRemotionBrand } from '@/domains/video-generation/utils/brand-config-mapper';
import type { BrandConfig } from '../types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Full form data representing every field the extended form captures */
const FULL_FORM_DATA = {
  // Existing fields
  colorPrimary: '#111111',
  colorSecondary: '#f5f5f5',
  colorAccent: '#d30005',
  customColors: [{ name: 'Sale', hex: '#d30005' }],
  fontHeading: 'Oswald, sans-serif',
  fontBody: 'Inter, sans-serif',

  // New Phase 5 fields — Surfaces & text
  colorSurface: '#F2F2F2',
  colorBorder: '#CCCCCC',
  colorTextOnBackground: '#111111',
  colorTextOnSurface: '#111111',
  colorTextOnPrimary: '#FFFFFF',

  // New Phase 5 fields — Shape
  radiusButton: 8,
  radiusBadge: 8,
  radiusImage: 12,
  strokeButton: 1,
  strokeCard: 1,
  strokeBadge: 1,

  // New Phase 5 fields — Structure
  cortinillaEntrada: 'fade' as const,
  cortinillaCierre: 'fade' as const,
  promoBarStyle: 'bottom' as const,
  productOverlayPosition: 'bottom-right' as const,

  // New Phase 5 fields — Font URLs
  fontUrls: 'https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap',
};

// ─── Schema validation tests ──────────────────────────────────────────────────

describe('brandTokensEditSchema — new Phase 5 fields', () => {
  it('accepts surface color as optional hex', () => {
    const result = brandTokensEditSchema.safeParse({ colorSurface: '#F2F2F2' });
    expect(result.success).toBe(true);
  });

  it('accepts border color as optional hex', () => {
    const result = brandTokensEditSchema.safeParse({ colorBorder: '#CCCCCC' });
    expect(result.success).toBe(true);
  });

  it('accepts textOnBackground as optional hex', () => {
    const result = brandTokensEditSchema.safeParse({ colorTextOnBackground: '#111111' });
    expect(result.success).toBe(true);
  });

  it('accepts textOnSurface as optional hex', () => {
    const result = brandTokensEditSchema.safeParse({ colorTextOnSurface: '#111111' });
    expect(result.success).toBe(true);
  });

  it('accepts textOnPrimary as optional hex', () => {
    const result = brandTokensEditSchema.safeParse({ colorTextOnPrimary: '#FFFFFF' });
    expect(result.success).toBe(true);
  });

  it('rejects non-hex surface color', () => {
    const result = brandTokensEditSchema.safeParse({ colorSurface: 'notacolor' });
    expect(result.success).toBe(false);
  });

  it('accepts radius fields as optional numbers', () => {
    const result = brandTokensEditSchema.safeParse({
      radiusButton: 8,
      radiusBadge: 8,
      radiusImage: 12,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative radius values', () => {
    const result = brandTokensEditSchema.safeParse({ radiusButton: -1 });
    expect(result.success).toBe(false);
  });

  it('accepts stroke fields as optional numbers', () => {
    const result = brandTokensEditSchema.safeParse({
      strokeButton: 1,
      strokeCard: 1,
      strokeBadge: 1,
    });
    expect(result.success).toBe(true);
  });

  it('accepts cortinillaEntrada enum values', () => {
    for (const v of ['fade', 'none', 'slide'] as const) {
      const result = brandTokensEditSchema.safeParse({ cortinillaEntrada: v });
      expect(result.success, `expected "${v}" to be valid`).toBe(true);
    }
  });

  it('rejects unknown cortinillaEntrada value', () => {
    const result = brandTokensEditSchema.safeParse({ cortinillaEntrada: 'zoom' });
    expect(result.success).toBe(false);
  });

  it('accepts promoBarStyle enum values top and bottom', () => {
    for (const v of ['top', 'bottom'] as const) {
      const result = brandTokensEditSchema.safeParse({ promoBarStyle: v });
      expect(result.success, `expected "${v}" to be valid`).toBe(true);
    }
  });

  it('accepts productOverlayPosition enum values', () => {
    for (const v of ['bottom-right', 'bottom-left', 'center'] as const) {
      const result = brandTokensEditSchema.safeParse({ productOverlayPosition: v });
      expect(result.success, `expected "${v}" to be valid`).toBe(true);
    }
  });

  it('accepts fontUrls as an optional string', () => {
    const result = brandTokensEditSchema.safeParse({
      fontUrls: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
    });
    expect(result.success).toBe(true);
  });

  it('validates the full form data without errors', () => {
    const result = brandTokensEditSchema.safeParse(FULL_FORM_DATA);
    expect(result.success).toBe(true);
  });
});

// ─── buildBrandTokensPayload tests ────────────────────────────────────────────

describe('buildBrandTokensPayload — assembles BrandDesignTokens shape', () => {
  it('maps colorPrimary into tokens.colors.primary', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.primary).toBe('#111111');
  });

  it('maps colorSecondary into tokens.colors.secondary', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.secondary).toBe('#f5f5f5');
  });

  it('maps colorAccent into tokens.colors.accent', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.accent).toBe('#d30005');
  });

  it('maps colorSurface into tokens.colors.surface', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.surface).toBe('#F2F2F2');
  });

  it('maps colorBorder into tokens.colors.border', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.border).toBe('#CCCCCC');
  });

  it('maps colorTextOnBackground into tokens.colors.textOnBackground', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.textOnBackground).toBe('#111111');
  });

  it('maps colorTextOnSurface into tokens.colors.textOnSurface', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.textOnSurface).toBe('#111111');
  });

  it('maps colorTextOnPrimary into tokens.colors.textOnPrimary', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.colors.textOnPrimary).toBe('#FFFFFF');
  });

  it('maps radius fields into tokens.radius.*', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.radius).toEqual({ button: 8, badge: 8, image: 12 });
  });

  it('maps stroke fields into tokens.stroke.*', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.stroke).toEqual({ button: 1, card: 1, badge: 1 });
  });

  it('maps structure fields into tokens.structure.*', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.structure).toEqual({
      cortinillaEntrada: 'fade',
      cortinillaCierre: 'fade',
      promoBarStyle: 'bottom',
      productOverlayPosition: 'bottom-right',
    });
  });

  it('maps fontHeading and fontBody into tokens.fonts.*', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.fonts?.heading).toBe('Oswald, sans-serif');
    expect(payload.fonts?.body).toBe('Inter, sans-serif');
  });

  it('maps fontUrls string into tokens.assets.fonts array (split by newline/comma)', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.assets?.fonts).toContain(
      'https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap'
    );
  });

  it('handles empty fontUrls gracefully — assets.fonts is empty or absent', () => {
    const data = { ...FULL_FORM_DATA, fontUrls: '' };
    const payload = buildBrandTokensPayload(data, {});
    expect(payload.assets?.fonts?.length ?? 0).toBe(0);
  });

  it('preserves customColors in the payload', () => {
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, {});
    expect(payload.customColors).toEqual([{ name: 'Sale', hex: '#d30005' }]);
  });

  it('merges existing tokens — does not drop fields not in the form', () => {
    const existing = { logo: { url: 'https://example.com/logo.png' } };
    const payload = buildBrandTokensPayload(FULL_FORM_DATA, existing);
    expect((payload as Record<string, unknown>).logo).toEqual(existing.logo);
  });

  it('omits radius when all radius fields are undefined', () => {
    const data = {
      colorPrimary: '#111111',
      radiusButton: undefined,
      radiusBadge: undefined,
      radiusImage: undefined,
    } as Parameters<typeof buildBrandTokensPayload>[0];
    const payload = buildBrandTokensPayload(data, {});
    expect(payload.radius).toBeUndefined();
  });

  it('omits stroke when all stroke fields are undefined', () => {
    const data = {
      colorPrimary: '#111111',
      strokeButton: undefined,
      strokeCard: undefined,
      strokeBadge: undefined,
    } as Parameters<typeof buildBrandTokensPayload>[0];
    const payload = buildBrandTokensPayload(data, {});
    expect(payload.stroke).toBeUndefined();
  });
});

// ─── resolveRemotionBrand — fontUrls round-trip ───────────────────────────────

describe('resolveRemotionBrand — fontUrls flow to assets.fonts', () => {
  const BRAND_WITH_FONT_URLS: BrandConfig = {
    id: 'brand-font-test',
    name: 'Font Test Brand',
    slug: 'font-test',
    organizationId: 'org-1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    tokens: {
      colors: { primary: '#111111' },
      fonts: { heading: 'Oswald, sans-serif', body: 'Inter, sans-serif' },
      assets: {
        fonts: [
          'https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap',
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
        ],
      },
    },
  };

  it('passes font URLs from tokens.assets.fonts into RemotionBrandConfig.assets.fonts', () => {
    const remotionBrand = resolveRemotionBrand(BRAND_WITH_FONT_URLS);
    expect(remotionBrand).not.toBeNull();
    expect(remotionBrand!.assets.fonts).toEqual([
      'https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
    ]);
  });

  it('returns empty fonts array when tokens.assets.fonts is absent', () => {
    const brandWithoutFonts: BrandConfig = {
      ...BRAND_WITH_FONT_URLS,
      tokens: { colors: { primary: '#111111' } },
    };
    const remotionBrand = resolveRemotionBrand(brandWithoutFonts);
    expect(remotionBrand).not.toBeNull();
    expect(remotionBrand!.assets.fonts).toEqual([]);
  });

  it('returns null for a brand with no primary color', () => {
    const emptyBrand: BrandConfig = {
      id: 'b',
      name: 'Empty',
      slug: 'empty',
      organizationId: 'org-1',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tokens: {},
    };
    expect(resolveRemotionBrand(emptyBrand)).toBeNull();
  });
});
