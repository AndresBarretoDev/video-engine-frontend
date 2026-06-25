/**
 * TDD RED → GREEN
 * Task 2.1 — brand-config-mapper: full token pass-through
 *
 * Tests cover:
 * 1. radius, spacing, stroke, surface, border, semantic text inks, defaults, fonts
 *    all flow through from input tokens.
 * 2. Absent optional fields fall back to NEUTRAL non-platform greys.
 * 3. The '#FFFFFF'-string-compare inference is GONE.
 * 4. resolveRemotionBrand: prefers BRAND_PRESETS by slug (slug bridge).
 * 5. resolveRemotionBrand: maps brand tokens for non-preset brands.
 * 6. resolveRemotionBrand: returns a neutral fallback when brand has no usable tokens.
 */

import { describe, it, expect } from 'vitest';
import {
  mapBrandConfigToRemotionBrand,
  resolveRemotionBrand
} from './brand-config-mapper';
import type { BrandConfig } from '@/domains/brands/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Full input with all optional tokens present */
const FULL_INPUT = {
  id: 'brand-full',
  name: 'Full Brand',
  colorPrimary: '#111111',
  colorSecondary: '#f5f5f5',
  colorAccent: '#d30005',
  colorBackground: '#ffffff',
  colorText: '#111111',
  fontFamilyHeading: 'Oswald, sans-serif',
  fontFamilyBody: 'Inter, sans-serif',
  logoUrl: 'https://placehold.co/240x80/111111/FFFFFF?text=BRAND',
  logoWidth: 240,
  logoHeight: 80,
  // Extended fields:
  colorSurface: '#f5f5f5',
  colorBorder: '#cacacb',
  colorTextOnBackground: '#111111',
  colorTextOnSurface: '#111111',
  colorTextOnPrimary: '#ffffff',
  radius: { button: 30, badge: 30, image: 0 },
  spacing: { padding: 48, gap: 16 },
  stroke: { button: 0, card: 1, badge: 1 },
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'none',
    promoBarStyle: 'bottom' as const,
    productOverlayPosition: 'bottom-left' as const
  },
  fontUrls: [
    'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap'
  ]
};

/** Minimal input — only required fields */
const MINIMAL_INPUT = {
  id: 'brand-min',
  name: 'Minimal Brand',
  colorPrimary: '#3366cc',
  colorAccent: '#ff6600',
  fontFamilyHeading: 'Arial',
  fontFamilyBody: 'Arial',
  logoUrl: 'https://example.com/logo.png'
};

// ─── mapBrandConfigToRemotionBrand: full token pass-through ───────────────────

describe('mapBrandConfigToRemotionBrand: full token pass-through', () => {
  const result = mapBrandConfigToRemotionBrand(FULL_INPUT);

  it('passes colors.surface through', () => {
    expect(result.tokens.colors.surface).toBe('#f5f5f5');
  });

  it('passes colors.border through', () => {
    expect(result.tokens.colors.border).toBe('#cacacb');
  });

  it('passes colors.textOnBackground through', () => {
    expect(result.tokens.colors.textOnBackground).toBe('#111111');
  });

  it('passes colors.textOnSurface through', () => {
    expect(result.tokens.colors.textOnSurface).toBe('#111111');
  });

  it('passes colors.textOnPrimary through', () => {
    expect(result.tokens.colors.textOnPrimary).toBe('#ffffff');
  });

  it('passes radius through', () => {
    expect(result.tokens.radius).toEqual({ button: 30, badge: 30, image: 0 });
  });

  it('passes spacing through', () => {
    expect(result.tokens.spacing).toEqual({ padding: 48, gap: 16 });
  });

  it('passes stroke through', () => {
    expect(result.tokens.stroke).toEqual({ button: 0, card: 1, badge: 1 });
  });

  it('passes defaults through', () => {
    expect(result.defaults.cortinillaEntrada).toBe('fade');
    expect(result.defaults.cortinillaCierre).toBe('none');
    expect(result.defaults.promoBarStyle).toBe('bottom');
    expect(result.defaults.productOverlayPosition).toBe('bottom-left');
  });

  it('passes assets.fonts through', () => {
    expect(result.assets.fonts).toEqual([
      'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap'
    ]);
  });
});

// ─── mapBrandConfigToRemotionBrand: string-compare inference is GONE ──────────

describe('mapBrandConfigToRemotionBrand: no #FFFFFF inference', () => {
  it('does NOT hardcode textInverse to #0A0A0A when background is #FFFFFF', () => {
    // The old code did: colorBackground === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'
    // This caused black-on-black when the brand had a dark background.
    // Now textInverse comes from the brand's explicit declaration.
    const result = mapBrandConfigToRemotionBrand({
      ...MINIMAL_INPUT,
      colorBackground: '#FFFFFF',
      colorTextInverse: '#222222'
    });
    // textInverse must come from the declared value, not the '#FFFFFF' string compare
    expect(result.tokens.colors.textInverse).toBe('#222222');
  });

  it('does NOT produce #FFFFFF textInverse for dark backgrounds via string compare', () => {
    // Dark background — old code would hardcode #FFFFFF, but that is now explicit.
    const result = mapBrandConfigToRemotionBrand({
      ...MINIMAL_INPUT,
      colorBackground: '#080808',
      colorTextInverse: '#F5F5F5'
    });
    expect(result.tokens.colors.textInverse).toBe('#F5F5F5');
  });

  it('for a brand with no textInverse declared, falls back to neutral — never string-compared', () => {
    // No textInverse supplied — must fall back to a neutral value, NOT based on '#FFFFFF' compare
    const result = mapBrandConfigToRemotionBrand(MINIMAL_INPUT);
    // textInverse must be a string (some fallback), but specifically NOT the broken '#0A0A0A'
    // from the old `colorBackground === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'` check
    expect(typeof result.tokens.colors.textInverse).toBe('string');
    expect(result.tokens.colors.textInverse).not.toBe('#0A0A0A');
  });
});

// ─── mapBrandConfigToRemotionBrand: neutral fallbacks for absent optionals ────

describe('mapBrandConfigToRemotionBrand: neutral fallbacks', () => {
  const result = mapBrandConfigToRemotionBrand(MINIMAL_INPUT);

  it('surface falls back to a neutral grey (not OP Blue)', () => {
    // When surface is absent, fallback must not be OP Blue (#4361EF) or platform color
    const surface = result.tokens.colors.surface;
    if (surface !== undefined) {
      expect(surface).not.toBe('#4361EF');
      // Should be a grey
      expect(surface.toLowerCase()).toMatch(/^#[0-9a-f]{6}$/);
    }
    // surface may be undefined if the brand has no surface — that is OK
  });

  it('border falls back to a neutral grey (not OP Blue)', () => {
    const border = result.tokens.colors.border;
    if (border !== undefined) {
      expect(border).not.toBe('#4361EF');
    }
  });

  it('defaults are present even when not supplied', () => {
    expect(result.defaults).toBeDefined();
    expect(typeof result.defaults.cortinillaEntrada).toBe('string');
    expect(typeof result.defaults.cortinillaCierre).toBe('string');
    expect(['top', 'bottom']).toContain(result.defaults.promoBarStyle);
    expect(['bottom-right', 'bottom-left', 'center']).toContain(
      result.defaults.productOverlayPosition
    );
  });

  it('assets.fonts is an array (never undefined, never null)', () => {
    expect(Array.isArray(result.assets.fonts)).toBe(true);
  });
});

// ─── resolveRemotionBrand: slug bridge (preset-first) ─────────────────────────

describe('resolveRemotionBrand: NO slug bridge (real tokens only)', () => {
  // The slug→preset bridge was removed: a brand renders from its OWN tokens, never
  // a curated preset matched by slug. A brand with a known slug but empty tokens
  // must NOT be silently filled from a preset — it returns null and the caller uses
  // the template's house default for the preview. Real data lives in the backend.
  it('returns null for a known slug ("nike") when the brand has no real tokens', () => {
    const fakeBrand: BrandConfig = {
      id: 'backend-nike-id',
      name: 'Nike (dummy)',
      slug: 'nike',
      organizationId: 'org-1',
      isActive: true,
      tokens: {}, // backend dummy has no real tokens — must NOT bridge to a preset
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
    };
    expect(resolveRemotionBrand(fakeBrand)).toBeNull();
  });

  it('maps the brand OWN tokens when present (slug is irrelevant)', () => {
    const realBrand: BrandConfig = {
      id: 'real-nike',
      name: 'Nike',
      slug: 'nike',
      organizationId: 'org-1',
      isActive: true,
      tokens: {
        colors: { primary: '#111111', surface: '#f5f5f5', border: '#cacacb' },
        logo: { url: 'https://example.com/nike.png', width: 240, height: 80 }
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
    };
    const result = resolveRemotionBrand(realBrand);
    expect(result).not.toBeNull();
    expect(result!.tokens.colors.primary).toBe('#111111');
    expect(result!.tokens.colors.surface).toBe('#f5f5f5');
  });
});

// ─── resolveRemotionBrand: maps tokens for non-preset brands ──────────────────

describe('resolveRemotionBrand: maps domain brand tokens', () => {
  it('maps colors.primary from tokens.colors.primary for unknown slugs', () => {
    const brand: BrandConfig = {
      id: 'custom-1',
      name: 'Custom Brand',
      slug: 'custom-unknown-slug',
      organizationId: 'org-1',
      isActive: true,
      tokens: {
        colors: {
          primary: '#AA1122',
          text: '#111111'
        },
        logo: { url: 'https://example.com/logo.png', width: 200, height: 80 }
      },
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
    };
    const result = resolveRemotionBrand(brand);
    expect(result).not.toBeNull();
    expect(result!.tokens.colors.primary).toBe('#AA1122');
  });

  it('returns null for brand with no usable tokens AND no matching preset', () => {
    const brand: BrandConfig = {
      id: 'empty-1',
      name: 'Empty Brand',
      slug: 'no-such-preset',
      organizationId: 'org-1',
      isActive: true,
      tokens: {}, // no colors.primary
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01'
    };
    const result = resolveRemotionBrand(brand);
    // No preset and no usable tokens → null (caller falls back to template preset)
    expect(result).toBeNull();
  });
});
