/**
 * TDD RED → GREEN
 * Task 3.2 — StayPromo: brand token consumption
 *
 * Asserts that resolveStayBrand correctly sources ALL identity values from brandConfig:
 * - surface is distinct from background (fixes the floating InfoCard text)
 * - text inks come from declared semantic tokens
 * - borders and stroke flow through
 * - radius flows through
 * - font family flows through
 * - structural defaults honored
 * - No hardcoded identity values (only neutral undefined-brand fallbacks)
 */

import { describe, it, expect } from 'vitest';
import { resolveStayBrand } from './StayPromo';
import { OP_BRAND_PRESET } from '@/remotion/brand-presets/op.preset';
import { AIRBNB_BRAND_PRESET } from '@/remotion/brand-presets/airbnb.preset';
import { NIKE_BRAND_PRESET } from '@/remotion/brand-presets/nike.preset';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const FULL_BRAND: BrandConfig = {
  id: 'stay-test',
  name: 'Stay Test Brand',
  tokens: {
    colors: {
      primary: '#BB2200',
      secondary: '#003344',
      accent: '#FF8800',
      background: '#F8F8F8',
      text: '#101010',
      textInverse: '#FFFEFE',
      surface: '#E0E0E0', // distinct from background
      border: '#AAAAAA',
      textOnBackground: '#101010',
      textOnSurface: '#202020',
      textOnPrimary: '#FFFFFF'
    },
    fonts: {
      heading: { family: 'Raleway, sans-serif', weights: [600, 800] },
      body: { family: 'Open Sans, sans-serif', weights: [400, 600] }
    },
    animation: {
      defaultEasing: 'ease-out',
      defaultDuration: 24,
      springConfig: { damping: 14, stiffness: 150, mass: 1 }
    },
    spacing: { padding: 56, gap: 18 },
    radius: { button: 24, badge: 9999, image: 16 },
    stroke: { button: 1, card: 1, badge: 1 }
  },
  assets: {
    logo: { url: 'https://example.com/stay-logo.png', width: 220, height: 72 },
    fonts: []
  },
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'fade',
    promoBarStyle: 'top',
    productOverlayPosition: 'bottom-left'
  }
};

// ─── resolveStayBrand: sources tokens from brandConfig ───────────────────────

describe('resolveStayBrand: sources ALL identity tokens from brandConfig', () => {
  const resolved = resolveStayBrand(FULL_BRAND);

  it('bgColor comes from colors.background', () => {
    expect(resolved.bgColor).toBe('#F8F8F8');
  });

  it('surfaceColor comes from colors.surface (InfoCard — fixes floating text)', () => {
    // KEY FIX: StayPromo InfoCard MUST use surface, NOT background
    // This is the fix for the "floating text" bug where the card blended into the canvas
    expect(resolved.surfaceColor).toBe('#E0E0E0');
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('primaryColor comes from colors.primary', () => {
    expect(resolved.primaryColor).toBe('#BB2200');
  });

  it('borderColor comes from colors.border', () => {
    expect(resolved.borderColor).toBe('#AAAAAA');
  });

  it('stroke comes from tokens.stroke', () => {
    expect(resolved.stroke).toEqual({ button: 1, card: 1, badge: 1 });
  });

  it('textOnBackground ink comes from colors.textOnBackground', () => {
    expect(resolved.textOnBackground).toBe('#101010');
  });

  it('textOnSurface ink comes from colors.textOnSurface', () => {
    expect(resolved.textOnSurface).toBe('#202020');
  });

  it('textOnPrimary ink comes from colors.textOnPrimary', () => {
    expect(resolved.textOnPrimary).toBe('#FFFFFF');
  });

  it('fontFamily comes from tokens.fonts.heading.family', () => {
    expect(resolved.fontFamily).toBe('Raleway, sans-serif');
  });

  it('radius.button comes from tokens.radius.button', () => {
    expect(resolved.radius.button).toBe(24);
  });

  it('radius.image comes from tokens.radius.image', () => {
    expect(resolved.radius.image).toBe(16);
  });
});

// ─── resolveStayBrand: structural defaults flow through ──────────────────────

describe('resolveStayBrand: structural defaults flow through', () => {
  const resolved = resolveStayBrand(FULL_BRAND);

  it('productOverlayPosition comes from defaults', () => {
    expect(resolved.defaults?.productOverlayPosition).toBe('bottom-left');
  });

  it('cortinillaCierre comes from defaults', () => {
    expect(resolved.defaults?.cortinillaCierre).toBe('fade');
  });

  it('promoBarStyle comes from defaults', () => {
    expect(resolved.defaults?.promoBarStyle).toBe('top');
  });
});

// ─── resolveStayBrand: OP preset (dark brand) ────────────────────────────────

describe('resolveStayBrand: OP preset', () => {
  const resolved = resolveStayBrand(OP_BRAND_PRESET);

  it('OP surface is darker than background (cards float above dark canvas)', () => {
    expect(resolved.surfaceColor).toBeDefined();
    // On OP dark brand: surface should be a slightly different dark (not same as bg)
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('OP textOnSurface is readable on the dark surface', () => {
    expect(resolved.textOnSurface).toBeDefined();
    // Not black-on-black: textOnSurface must not equal surface
    if (resolved.surfaceColor !== undefined) {
      expect(resolved.textOnSurface).not.toBe(resolved.surfaceColor);
    }
  });

  it('OP fontFamily is Mulish', () => {
    expect(resolved.fontFamily).toContain('Mulish');
  });
});

// ─── resolveStayBrand: Airbnb preset (light brand) ────────────────────────────

describe('resolveStayBrand: Airbnb preset', () => {
  const resolved = resolveStayBrand(AIRBNB_BRAND_PRESET);

  it('InfoCard surface is off-white (NOT pure white = not same as background)', () => {
    // Core bug fix: Airbnb has white background, card uses surface-soft (#f7f7f7)
    // so the info card is VISIBLE against the white canvas
    expect(resolved.surfaceColor).toBeDefined();
    expect(resolved.surfaceColor!.toLowerCase()).not.toBe('#ffffff');
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('textOnSurface is dark (#222222) — legible on off-white card', () => {
    expect(resolved.textOnSurface).toBe('#222222');
  });

  it('Airbnb fontFamily is Inter', () => {
    expect(resolved.fontFamily).toContain('Inter');
  });

  it('Airbnb promoBarStyle is top', () => {
    expect(resolved.defaults?.promoBarStyle).toBe('top');
  });
});

// ─── resolveStayBrand: Nike preset ────────────────────────────────────────────

describe('resolveStayBrand: Nike preset', () => {
  const resolved = resolveStayBrand(NIKE_BRAND_PRESET);

  it('Nike surface is soft-cloud (#f5f5f5) — card visible on white canvas', () => {
    expect(resolved.surfaceColor).toBeDefined();
    expect(resolved.surfaceColor!.toLowerCase()).not.toBe('#ffffff');
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('Nike image radius is 0 (SQUARE)', () => {
    expect(resolved.radius.image).toBe(0);
  });

  it('Nike cortinillaCierre is none (hard cut)', () => {
    expect(resolved.defaults?.cortinillaCierre).toBe('none');
  });
});

// ─── resolveStayBrand: no config — neutral fallbacks ─────────────────────────

describe('resolveStayBrand: no brandConfig — neutral fallbacks', () => {
  const resolved = resolveStayBrand(undefined);

  it('bgColor is a neutral grey (not Airbnb-specific, not OP Blue)', () => {
    expect(resolved.bgColor).not.toBe('#4361EF');
    // No longer hardcoded to Airbnb coral or Airbnb bg
    expect(resolved.bgColor).not.toBe('#FF5A5F');
  });

  it('primaryColor is a neutral grey (not any brand color)', () => {
    expect(resolved.primaryColor).not.toBe('#4361EF');
    expect(resolved.primaryColor).not.toBe('#FF5A5F');
    expect(resolved.primaryColor).not.toBe('#ff385c');
  });

  it('fontFamily is generic sans-serif (not brand-specific)', () => {
    // No longer hardcoded to Nunito/Poppins (Airbnb) or Mulish (OP)
    expect(resolved.fontFamily).toBe('sans-serif');
  });

  it('defaults is undefined when no brand provided', () => {
    expect(resolved.defaults).toBeUndefined();
  });
});
