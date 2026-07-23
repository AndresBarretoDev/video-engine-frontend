/**
 * TDD RED → GREEN
 * Task 3.1 — LoopingProductPromo: brand token consumption
 *
 * Asserts that resolveBrand correctly sources ALL identity values from brandConfig:
 * - No hardcoded identity values (only neutral undefined-brand fallbacks)
 * - surface is distinct from background when brandConfig is present
 * - text inks come from declared semantic tokens
 * - borders and stroke flow through
 * - radius flows through
 * - spacing flows through
 * - structural defaults honored (productOverlayPosition, cortinillaCierre, promoBarStyle)
 * - font family flows through
 */

import { describe, it, expect } from 'vitest';
import { resolveBrand } from './LoopingProductPromo';
import { OP_BRAND_PRESET } from '@/remotion/brand-presets/op.preset';
import { AIRBNB_BRAND_PRESET } from '@/remotion/brand-presets/airbnb.preset';
import { NIKE_BRAND_PRESET } from '@/remotion/brand-presets/nike.preset';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Brand with ALL new token fields set to distinct, testable values */
const FULL_BRAND: BrandConfig = {
  id: 'full-test',
  name: 'Full Test Brand',
  tokens: {
    colors: {
      primary: '#AA0011',
      secondary: '#001122',
      accent: '#FF6600',
      background: '#FAFAFA',
      text: '#111111',
      textInverse: '#FEFEFE',
      surface: '#EEEEEE', // distinct from background
      border: '#C0C0C0',
      textOnBackground: '#222222',
      textOnSurface: '#333333',
      textOnPrimary: '#FFFFFF'
    },
    fonts: {
      heading: { family: 'Playfair Display, serif', weights: [700, 900] },
      body: { family: 'Source Sans Pro, sans-serif', weights: [400, 600] }
    },
    animation: {
      defaultEasing: 'spring',
      defaultDuration: 20,
      springConfig: { damping: 18, stiffness: 180, mass: 1 }
    },
    spacing: { padding: 72, gap: 20 },
    radius: { button: 16, badge: 12, image: 24 },
    stroke: { button: 2, card: 1, badge: 1 }
  },
  assets: {
    logo: { url: 'https://example.com/logo.png', width: 200, height: 80 },
    fonts: [
      'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'
    ]
  },
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'none',
    promoBarStyle: 'top',
    productOverlayPosition: 'center'
  }
};

// ─── resolveBrand: sources tokens from brandConfig ───────────────────────────

describe('resolveBrand: sources ALL identity tokens from brandConfig', () => {
  const resolved = resolveBrand(FULL_BRAND);

  it('bgColor comes from colors.background', () => {
    expect(resolved.bgColor).toBe('#FAFAFA');
  });

  it('surface comes from colors.surface (distinct from background)', () => {
    expect(resolved.surfaceColor).toBe('#EEEEEE');
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('primaryColor comes from colors.primary', () => {
    expect(resolved.primaryColor).toBe('#AA0011');
  });

  it('borderColor comes from colors.border', () => {
    expect(resolved.borderColor).toBe('#C0C0C0');
  });

  it('stroke comes from tokens.stroke', () => {
    expect(resolved.stroke).toEqual({ button: 2, card: 1, badge: 1 });
  });

  it('textOnBackground ink comes from colors.textOnBackground', () => {
    expect(resolved.textOnBackground).toBe('#222222');
  });

  it('textOnSurface ink comes from colors.textOnSurface', () => {
    expect(resolved.textOnSurface).toBe('#333333');
  });

  it('textOnPrimary ink comes from colors.textOnPrimary', () => {
    expect(resolved.textOnPrimary).toBe('#FFFFFF');
  });

  it('fontFamily comes from tokens.fonts.heading.family', () => {
    expect(resolved.fontFamily).toBe('Playfair Display, serif');
  });

  it('radius.button comes from tokens.radius.button', () => {
    expect(resolved.radius.button).toBe(16);
  });

  it('radius.badge comes from tokens.radius.badge', () => {
    expect(resolved.radius.badge).toBe(12);
  });

  it('radius.image comes from tokens.radius.image', () => {
    expect(resolved.radius.image).toBe(24);
  });

  it('springConfig comes from tokens.animation.springConfig', () => {
    expect(resolved.springConfig).toEqual({
      damping: 18,
      stiffness: 180,
      mass: 1
    });
  });

  it('logoUrl comes from assets.logo.url', () => {
    expect(resolved.logoUrl).toBe('https://example.com/logo.png');
  });
});

// ─── resolveBrand: defaults flow through ─────────────────────────────────────

describe('resolveBrand: structural defaults flow through', () => {
  const resolved = resolveBrand(FULL_BRAND);

  it('productOverlayPosition comes from defaults', () => {
    expect(resolved.defaults?.productOverlayPosition).toBe('center');
  });

  it('cortinillaCierre comes from defaults', () => {
    expect(resolved.defaults?.cortinillaCierre).toBe('none');
  });

  it('promoBarStyle comes from defaults', () => {
    expect(resolved.defaults?.promoBarStyle).toBe('top');
  });
});

// ─── resolveBrand: OP preset — dark brand ────────────────────────────────────

describe('resolveBrand: OP preset (dark brand)', () => {
  const resolved = resolveBrand(OP_BRAND_PRESET);

  it('OP background is dark #080808', () => {
    expect(resolved.bgColor).toBe('#080808');
  });

  it('OP surface is distinct from background (cards float above canvas)', () => {
    expect(resolved.surfaceColor).toBeDefined();
    expect(resolved.surfaceColor).not.toBe(resolved.bgColor);
  });

  it('OP textOnBackground is light (readable on dark canvas)', () => {
    expect(resolved.textOnBackground).toBeDefined();
    // Must be a light color — not black on black
    expect(resolved.textOnBackground).not.toBe('#000000');
    expect(resolved.textOnBackground).not.toBe('#111111');
  });

  it('OP fontFamily is Mulish', () => {
    expect(resolved.fontFamily).toContain('Mulish');
  });

  it('OP defaults have cortinillaCierre fade (not none)', () => {
    expect(resolved.defaults?.cortinillaCierre).toBe('fade');
  });

  it('OP productOverlayPosition is bottom-right', () => {
    expect(resolved.defaults?.productOverlayPosition).toBe('bottom-right');
  });
});

// ─── resolveBrand: Airbnb preset — light brand ────────────────────────────────

describe('resolveBrand: Airbnb preset (light brand)', () => {
  const resolved = resolveBrand(AIRBNB_BRAND_PRESET);

  it('Airbnb background is white', () => {
    expect(resolved.bgColor.toLowerCase()).toBe('#ffffff');
  });

  it('Airbnb surface is off-white (separate from pure white background)', () => {
    expect(resolved.surfaceColor).toBeDefined();
    expect(resolved.surfaceColor!.toLowerCase()).not.toBe('#ffffff');
  });

  it('Airbnb textOnBackground is dark ink (readable on white)', () => {
    expect(resolved.textOnBackground).toBe('#222222');
  });

  it('Airbnb fontFamily is Inter', () => {
    expect(resolved.fontFamily).toContain('Inter');
  });

  it('Airbnb promoBarStyle is top (different structure from OP)', () => {
    expect(resolved.defaults?.promoBarStyle).toBe('top');
  });

  it('Airbnb productOverlayPosition is center (different from OP bottom-right)', () => {
    expect(resolved.defaults?.productOverlayPosition).toBe('center');
  });
});

// ─── resolveBrand: Nike preset ────────────────────────────────────────────────

describe('resolveBrand: Nike preset', () => {
  const resolved = resolveBrand(NIKE_BRAND_PRESET);

  it('Nike background is white', () => {
    expect(resolved.bgColor.toLowerCase()).toBe('#ffffff');
  });

  it('Nike primary is near-black #111111', () => {
    expect(resolved.primaryColor).toBe('#111111');
  });

  it('Nike image radius is 0 (SQUARE — Nike signature)', () => {
    expect(resolved.radius.image).toBe(0);
  });

  it('Nike button radius is pill (30px)', () => {
    expect(resolved.radius.button).toBe(30);
  });

  it('Nike cortinillaCierre is none (hard cut)', () => {
    expect(resolved.defaults?.cortinillaCierre).toBe('none');
  });

  it('Nike productOverlayPosition is bottom-left', () => {
    expect(resolved.defaults?.productOverlayPosition).toBe('bottom-left');
  });
});

// ─── resolveBrand: no config — neutral fallbacks only ─────────────────────────

describe('resolveBrand: no brandConfig — neutral grey fallbacks', () => {
  const resolved = resolveBrand(undefined);

  it('bgColor is a neutral grey (not OP Blue, not white)', () => {
    expect(resolved.bgColor).not.toBe('#4361EF');
    expect(resolved.bgColor.toLowerCase()).not.toBe('#ffffff');
  });

  it('primaryColor is a neutral grey (not OP Blue)', () => {
    expect(resolved.primaryColor).not.toBe('#4361EF');
  });

  it('fontFamily is generic sans-serif', () => {
    expect(resolved.fontFamily).toBe('sans-serif');
  });

  it('surfaceColor is undefined or a neutral grey — not OP Blue', () => {
    if (resolved.surfaceColor !== undefined) {
      expect(resolved.surfaceColor).not.toBe('#4361EF');
    }
  });

  it('defaults is undefined when no brand provided', () => {
    // No brand → no structural defaults to honor
    expect(resolved.defaults).toBeUndefined();
  });
});

// ─── OP and Airbnb produce DIFFERENT structural defaults ─────────────────────

describe('Structural defaults differ: OP vs Airbnb (Level 2 — skeleton by brand)', () => {
  const op = resolveBrand(OP_BRAND_PRESET);
  const airbnb = resolveBrand(AIRBNB_BRAND_PRESET);

  it('promoBarStyle differs between OP and Airbnb', () => {
    expect(op.defaults?.promoBarStyle).not.toBe(airbnb.defaults?.promoBarStyle);
  });

  it('productOverlayPosition differs between OP and Airbnb', () => {
    expect(op.defaults?.productOverlayPosition).not.toBe(
      airbnb.defaults?.productOverlayPosition
    );
  });

  it('at least one default differs between OP and Airbnb (promoBarStyle)', () => {
    // promoBarStyle: OP = bottom, Airbnb = top
    expect(op.defaults?.promoBarStyle).toBe('bottom');
    expect(airbnb.defaults?.promoBarStyle).toBe('top');
  });

  it('Nike cortinillaCierre is none — different from OP fade', () => {
    const nike = resolveBrand(NIKE_BRAND_PRESET);
    expect(nike.defaults?.cortinillaCierre).toBe('none');
    expect(op.defaults?.cortinillaCierre).toBe('fade');
    expect(nike.defaults?.cortinillaCierre).not.toBe(
      op.defaults?.cortinillaCierre
    );
  });
});
