/**
 * TDD RED → GREEN
 * Task 4.2 — assembleCompositionProps + brand-config-mapper
 *
 * Tests cover:
 * 1. assembleCompositionProps maps form data + brand + format → LoopingProductPromoProps
 * 2. mapBrandConfigToRemotionBrand maps domain BrandTokens → RemotionBrandConfig
 * 3. Both functions handle missing/optional fields with fallbacks (preview without brand never breaks)
 */

import { describe, it, expect } from 'vitest';
import {
  assembleCompositionProps,
  assembleStayCompositionProps
} from './assemble-composition-props';
import {
  mapBrandConfigToRemotionBrand
} from './brand-config-mapper';
import type { ProductFormData, StayFormData, AuthoringState } from '../types';
import type { BrandConfig as RemotionBrandConfig } from '@/remotion/types/brand-config.types';

// ─── Test fixtures ────────────────────────────────────────────────────────────

const FULL_PRODUCT: ProductFormData = {
  productName: 'Nike Air Max 270',
  productImage: 'https://example.com/shoe.jpg',
  priceCurrent: '99.99',
  priceOriginal: '149.99',
  promoTag: '30% OFF',
  ctaText: 'Shop Now',
  legalText: '*Terms apply'
};

const MINIMAL_PRODUCT: ProductFormData = {
  productName: 'Basic Shoe',
  productImage: 'https://example.com/basic.jpg',
  priceCurrent: '50.00',
  ctaText: 'Buy'
};

const REMOTION_BRAND: RemotionBrandConfig = {
  id: 'brand-1',
  name: 'Omnicom',
  tokens: {
    colors: {
      primary: '#E5002B',
      secondary: '#0A0A0A',
      accent: '#E5002B',
      background: '#FFFFFF',
      text: '#0A0A0A',
      textInverse: '#FFFFFF'
    },
    fonts: {
      heading: { family: 'Nunito', weights: [700, 800] },
      body: { family: 'Nunito', weights: [400, 600] }
    },
    animation: {
      defaultEasing: 'ease-out',
      defaultDuration: 30,
      springConfig: { damping: 15, stiffness: 120, mass: 1 }
    },
    spacing: { padding: 60, gap: 24 }
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

// ─── assembleCompositionProps ────────────────────────────────────────────────

describe('assembleCompositionProps', () => {
  describe('maps product slots correctly', () => {
    it('full product: all slots are present in output', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);

      expect(props.slots.productName).toBe('Nike Air Max 270');
      expect(props.slots.productImage).toBe('https://example.com/shoe.jpg');
      expect(props.slots.priceCurrent).toBe('99.99');
      expect(props.slots.priceOriginal).toBe('149.99');
      expect(props.slots.promoTag).toBe('30% OFF');
      expect(props.slots.ctaText).toBe('Shop Now');
      expect(props.slots.legalText).toBe('*Terms apply');
    });

    it('minimal product: optional slots are undefined', () => {
      const state: AuthoringState = {
        form: MINIMAL_PRODUCT,
        brand: null,
        activeFormat: '9:16'
      };
      const props = assembleCompositionProps(state);

      expect(props.slots.productName).toBe('Basic Shoe');
      expect(props.slots.priceCurrent).toBe('50.00');
      expect(props.slots.priceOriginal).toBeUndefined();
      expect(props.slots.promoTag).toBeUndefined();
      expect(props.slots.legalText).toBeUndefined();
    });
  });

  describe('passes format through to output', () => {
    it('16:9 format is preserved', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);
      expect(props.format).toBe('16:9');
    });

    it('9:16 format is preserved', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '9:16'
      };
      const props = assembleCompositionProps(state);
      expect(props.format).toBe('9:16');
    });

    it('1:1 format is preserved', () => {
      const state: AuthoringState = {
        form: MINIMAL_PRODUCT,
        brand: null,
        activeFormat: '1:1'
      };
      const props = assembleCompositionProps(state);
      expect(props.format).toBe('1:1');
    });
  });

  describe('brand config passthrough', () => {
    it('includes brand config when provided', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: REMOTION_BRAND,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);
      expect(props.brandConfig).toBeDefined();
      expect(props.brandConfig?.id).toBe('brand-1');
      expect(props.brandConfig?.tokens.colors.accent).toBe('#E5002B');
    });

    it('brandConfig is undefined when brand is null (preview without brand)', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);
      expect(props.brandConfig).toBeUndefined();
    });
  });

  describe('timing defaults', () => {
    it('includes default timing values', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);
      expect(props.timing.totalDurationInFrames).toBe(300);
      expect(props.timing.introDurationInFrames).toBe(60);
      expect(props.timing.outroDurationInFrames).toBe(60);
    });
  });

  describe('logo position default', () => {
    it('defaults to top-left logo position', () => {
      const state: AuthoringState = {
        form: FULL_PRODUCT,
        brand: null,
        activeFormat: '16:9'
      };
      const props = assembleCompositionProps(state);
      expect(props.logoPosition).toBe('top-left');
    });
  });
});

// ─── assembleStayCompositionProps ────────────────────────────────────────────

const FULL_STAY: StayFormData = {
  listingName: 'Beachfront Villa',
  location: 'Tulum, Mexico',
  heroImage: 'https://example.com/villa.jpg',
  rating: '4.97',
  reviewCount: '212 reviews',
  pricePerNight: '320',
  currency: '$',
  ctaText: 'Book now',
  legalText: '*Taxes not included'
};

const MINIMAL_STAY: StayFormData = {
  listingName: 'City Loft',
  location: 'Berlin, Germany',
  heroImage: 'https://example.com/loft.jpg',
  rating: '4.5',
  pricePerNight: '90',
  currency: '€',
  ctaText: 'Reservar'
};

describe('assembleStayCompositionProps', () => {
  it('full stay: all slots are present in output', () => {
    const state: AuthoringState<StayFormData> = {
      form: FULL_STAY,
      brand: null,
      activeFormat: '16:9'
    };
    const props = assembleStayCompositionProps(state);

    expect(props.slots.listingName).toBe('Beachfront Villa');
    expect(props.slots.location).toBe('Tulum, Mexico');
    expect(props.slots.heroImage).toBe('https://example.com/villa.jpg');
    expect(props.slots.rating).toBe('4.97');
    expect(props.slots.reviewCount).toBe('212 reviews');
    expect(props.slots.pricePerNight).toBe('320');
    expect(props.slots.currency).toBe('$');
    expect(props.slots.ctaText).toBe('Book now');
    expect(props.slots.legalText).toBe('*Taxes not included');
  });

  it('minimal stay: optional slots are undefined', () => {
    const state: AuthoringState<StayFormData> = {
      form: MINIMAL_STAY,
      brand: null,
      activeFormat: '9:16'
    };
    const props = assembleStayCompositionProps(state);

    expect(props.slots.listingName).toBe('City Loft');
    expect(props.slots.reviewCount).toBeUndefined();
    expect(props.slots.legalText).toBeUndefined();
    expect(props.format).toBe('9:16');
  });

  it('brandConfig is undefined when brand is null', () => {
    const state: AuthoringState<StayFormData> = {
      form: MINIMAL_STAY,
      brand: null,
      activeFormat: '1:1'
    };
    const props = assembleStayCompositionProps(state);
    expect(props.brandConfig).toBeUndefined();
  });
});

// ─── mapBrandConfigToRemotionBrand ───────────────────────────────────────────

describe('mapBrandConfigToRemotionBrand', () => {
  it('maps accent color from brand tokens', () => {
    const result = mapBrandConfigToRemotionBrand({
      id: 'brand-1',
      name: 'Omnicom',
      colorAccent: '#E5002B',
      colorPrimary: '#0A0A0A',
      fontFamilyHeading: 'Nunito',
      fontFamilyBody: 'Nunito',
      logoUrl: 'https://example.com/logo.png'
    });

    expect(result.tokens.colors.accent).toBe('#E5002B');
    expect(result.tokens.colors.primary).toBe('#0A0A0A');
  });

  it('maps heading font family correctly', () => {
    const result = mapBrandConfigToRemotionBrand({
      id: 'brand-2',
      name: 'TestBrand',
      colorAccent: '#FF0000',
      colorPrimary: '#000000',
      fontFamilyHeading: 'Montserrat',
      fontFamilyBody: 'Roboto',
      logoUrl: 'https://example.com/logo2.png'
    });

    expect(result.tokens.fonts.heading.family).toBe('Montserrat');
    expect(result.tokens.fonts.body.family).toBe('Roboto');
  });

  it('maps logo URL to assets.logo', () => {
    const result = mapBrandConfigToRemotionBrand({
      id: 'brand-3',
      name: 'LogoBrand',
      colorAccent: '#123456',
      colorPrimary: '#ABCDEF',
      fontFamilyHeading: 'Arial',
      fontFamilyBody: 'Arial',
      logoUrl: 'https://example.com/mylogo.svg'
    });

    expect(result.assets.logo.url).toBe('https://example.com/mylogo.svg');
  });

  it('produces a valid RemotionBrandConfig shape (all required fields present)', () => {
    const result = mapBrandConfigToRemotionBrand({
      id: 'brand-4',
      name: 'FullBrand',
      colorAccent: '#AA0000',
      colorPrimary: '#001122',
      fontFamilyHeading: 'Georgia',
      fontFamilyBody: 'Verdana',
      logoUrl: 'https://example.com/logo4.png'
    });

    // Verify all top-level required fields of RemotionBrandConfig are present
    expect(result.id).toBe('brand-4');
    expect(result.name).toBe('FullBrand');
    expect(result.tokens).toBeDefined();
    expect(result.assets).toBeDefined();
    expect(result.defaults).toBeDefined();
    // Tokens sub-fields
    expect(result.tokens.colors).toBeDefined();
    expect(result.tokens.fonts).toBeDefined();
    expect(result.tokens.animation).toBeDefined();
    expect(result.tokens.spacing).toBeDefined();
  });
});
