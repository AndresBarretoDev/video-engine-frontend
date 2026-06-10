/**
 * TDD: resolveBrand + Airbnb preset
 *
 * Tests cover:
 * 1. resolveBrand with no config returns NEUTRAL fallbacks (NOT platform OP Blue)
 * 2. resolveBrand with brand reads tokens.radius when present
 * 3. resolveBrand with brand without radius falls back to neutral radius defaults
 * 4. AIRBNB_BRAND_PRESET has valid shape + expected coral color + pill radii
 * 5. BrandConfig Zod schema accepts radius as optional (retrocompatibility)
 */

import { describe, it, expect } from 'vitest';
import { resolveBrand } from './LoopingProductPromo';
import { AIRBNB_BRAND_PRESET } from '@/remotion/brand-presets/airbnb.preset';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BRAND_WITH_RADIUS: BrandConfig = {
  id: 'b1',
  name: 'TestBrand',
  tokens: {
    colors: {
      primary: '#FF0000',
      secondary: '#000000',
      accent: '#FF0000',
      background: '#FFFFFF',
      text: '#000000',
      textInverse: '#FFFFFF'
    },
    fonts: {
      heading: { family: 'Arial', weights: [700] },
      body: { family: 'Arial', weights: [400] }
    },
    animation: {
      defaultEasing: 'ease-out',
      defaultDuration: 30,
      springConfig: { damping: 14, stiffness: 150, mass: 1 }
    },
    spacing: { padding: 60, gap: 24 },
    radius: { button: 24, badge: 16, image: 8 }
  },
  assets: {
    logo: { url: 'https://example.com/logo.png', width: 200, height: 80 },
    fonts: []
  },
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'fade',
    promoBarStyle: 'bottom',
    productOverlayPosition: 'bottom-right'
  }
};

// Brand WITHOUT radius (retrocompatibility — radius is optional)
const BRAND_WITHOUT_RADIUS: BrandConfig = {
  ...BRAND_WITH_RADIUS,
  tokens: {
    ...BRAND_WITH_RADIUS.tokens,
    radius: undefined
  }
};

// ─── resolveBrand: no config (neutral fallbacks) ──────────────────────────────

describe('resolveBrand: no brandConfig (neutral fallbacks)', () => {
  const resolved = resolveBrand(undefined);

  it('background is NEUTRAL dark — NOT OP Blue app background #0A0A1A', () => {
    expect(resolved.bgColor).not.toBe('#0A0A1A');
    // Must be a neutral gray/near-black — not the platform color
    expect(resolved.bgColor).toBe('#1A1A1A');
  });

  it('primary is NEUTRAL mid-gray — NOT OP Blue #4361EF', () => {
    expect(resolved.primaryColor).not.toBe('#4361EF');
    expect(resolved.primaryColor).toBe('#6B7280');
  });

  it('fontFamily is neutral sans-serif — NOT Mulish', () => {
    expect(resolved.fontFamily).not.toContain('Mulish');
    expect(resolved.fontFamily).toBe('sans-serif');
  });

  it('radius has default neutral values', () => {
    expect(resolved.radius).toEqual({ button: 8, badge: 6, image: 12 });
  });

  it('textInverse is present', () => {
    expect(typeof resolved.textInverse).toBe('string');
    expect(resolved.textInverse.length).toBeGreaterThan(0);
  });
});

// ─── resolveBrand: with full brand including radius ───────────────────────────

describe('resolveBrand: with brandConfig including radius', () => {
  const resolved = resolveBrand(BRAND_WITH_RADIUS);

  it('reads radius.button from brand tokens', () => {
    expect(resolved.radius.button).toBe(24);
  });

  it('reads radius.badge from brand tokens', () => {
    expect(resolved.radius.badge).toBe(16);
  });

  it('reads radius.image from brand tokens', () => {
    expect(resolved.radius.image).toBe(8);
  });

  it('reads primaryColor from brand tokens', () => {
    expect(resolved.primaryColor).toBe('#FF0000');
  });

  it('reads textInverse from brand tokens', () => {
    expect(resolved.textInverse).toBe('#FFFFFF');
  });

  it('reads fontFamily from brand heading font', () => {
    expect(resolved.fontFamily).toBe('Arial');
  });
});

// ─── resolveBrand: brand without radius (retrocompatibility) ─────────────────

describe('resolveBrand: brandConfig without radius (retrocompatible)', () => {
  const resolved = resolveBrand(BRAND_WITHOUT_RADIUS);

  it('falls back to neutral radius when tokens.radius is absent', () => {
    expect(resolved.radius).toEqual({ button: 8, badge: 6, image: 12 });
  });

  it('still reads primary color from brand', () => {
    expect(resolved.primaryColor).toBe('#FF0000');
  });
});

// ─── Airbnb preset: shape + tokens ───────────────────────────────────────────

describe('AIRBNB_BRAND_PRESET', () => {
  it('has id and name', () => {
    expect(AIRBNB_BRAND_PRESET.id).toBe('demo-airbnb');
    expect(AIRBNB_BRAND_PRESET.name).toBe('Airbnb');
  });

  it('primary color is Airbnb coral #FF5A5F', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.colors.primary).toBe('#FF5A5F');
  });

  it('background is white #FFFFFF', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.colors.background).toBe('#FFFFFF');
  });

  it('text is dark #222222 for contrast on white', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.colors.text).toBe('#222222');
  });

  it('textInverse is white — buttons on coral are readable', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.colors.textInverse).toBe('#FFFFFF');
  });

  it('heading font is Nunito (open source Airbnb-like rounded font)', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.fonts.heading.family).toContain('Nunito');
  });

  it('radius.button is pill-shaped (>= 32) — Airbnb visual signature', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.radius).toBeDefined();
    expect(AIRBNB_BRAND_PRESET.tokens.radius!.button).toBeGreaterThanOrEqual(32);
  });

  it('radius.badge is highly rounded (>= 20)', () => {
    expect(AIRBNB_BRAND_PRESET.tokens.radius!.badge).toBeGreaterThanOrEqual(20);
  });

  it('passes BrandConfigSchema Zod validation', () => {
    const result = BrandConfigSchema.safeParse(AIRBNB_BRAND_PRESET);
    expect(result.success).toBe(true);
  });
});

// ─── BrandConfigSchema: radius is optional (retrocompatibility) ───────────────

describe('BrandConfigSchema: radius is optional', () => {
  it('accepts BrandConfig without radius field (retrocompatible)', () => {
    const brandWithoutRadius = {
      id: 'b-retro',
      name: 'Legacy',
      tokens: {
        colors: {
          primary: '#000',
          secondary: '#111',
          accent: '#222',
          background: '#FFF',
          text: '#000',
          textInverse: '#FFF'
        },
        fonts: {
          heading: { family: 'Arial', weights: [700] },
          body: { family: 'Arial', weights: [400] }
        },
        animation: {
          defaultEasing: 'ease-out',
          defaultDuration: 30,
          springConfig: { damping: 14, stiffness: 150, mass: 1 }
        },
        spacing: { padding: 60, gap: 24 }
        // NOTE: no `radius` field — tests retrocompatibility
      },
      assets: {
        logo: { url: 'https://example.com/logo.png', width: 200, height: 80 },
        fonts: []
      },
      defaults: {
        cortinillaEntrada: 'fade',
        cortinillaCierre: 'fade',
        promoBarStyle: 'bottom',
        productOverlayPosition: 'bottom-right'
      }
    };

    const result = BrandConfigSchema.safeParse(brandWithoutRadius);
    expect(result.success).toBe(true);
  });

  it('accepts BrandConfig with radius field', () => {
    const result = BrandConfigSchema.safeParse(BRAND_WITH_RADIUS);
    expect(result.success).toBe(true);
  });
});
