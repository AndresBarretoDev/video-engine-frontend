/**
 * brand-config-mapper — pure function
 *
 * Maps domain-level brand data (from brands API / BrandTokens)
 * → RemotionBrandConfig (the shape LoopingProductPromo consumes).
 *
 * This is the "D4" mapping layer from design.md:
 * "brand-config-mapper.ts: BrandConfig (dominio) → BrandConfigSchema (Remotion)"
 *
 * Two types for the same concept must be reconciled before assembling props.
 * Pure: no side effects, no imports of React/hooks/stores.
 */

import type { BrandConfig as RemotionBrandConfig } from '@/remotion/types/brand-config.types';

// ─── Input type: subset of domain BrandTokens ────────────────────────────────

/**
 * BrandConfigInput — the domain data we receive from the brands API.
 * This is the minimal shape needed to map to RemotionBrandConfig.
 * Maps to `BrandTokens` + `BrandAssets` from `src/domains/brands/types.ts`.
 */
export interface BrandConfigInput {
  id: string;
  name: string;
  colorAccent: string;
  colorPrimary: string;
  colorSecondary?: string;
  colorBackground?: string;
  colorText?: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  logoUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  logoWhiteUrl?: string;
}

// ─── Pure mapping function ────────────────────────────────────────────────────

/**
 * Maps domain brand data to the RemotionBrandConfig shape.
 * Applies sensible defaults for any missing optional fields.
 *
 * @param brand - Domain brand data (from brands API)
 * @returns RemotionBrandConfig — ready to be passed to assembleCompositionProps
 */
export function mapBrandConfigToRemotionBrand(
  brand: BrandConfigInput
): RemotionBrandConfig {
  const colorPrimary = brand.colorPrimary;
  const colorSecondary = brand.colorSecondary ?? '#1A1A1A';
  const colorAccent = brand.colorAccent;
  const colorBackground = brand.colorBackground ?? '#FFFFFF';
  const colorText = brand.colorText ?? '#0A0A0A';

  return {
    id: brand.id,
    name: brand.name,
    tokens: {
      colors: {
        primary: colorPrimary,
        secondary: colorSecondary,
        accent: colorAccent,
        background: colorBackground,
        text: colorText,
        textInverse: colorBackground === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'
      },
      fonts: {
        heading: {
          family: brand.fontFamilyHeading,
          weights: [700, 800]
        },
        body: {
          family: brand.fontFamilyBody,
          weights: [400, 600]
        }
      },
      animation: {
        defaultEasing: 'ease-out',
        defaultDuration: 30,
        springConfig: {
          damping: 15,
          stiffness: 120,
          mass: 1
        }
      },
      spacing: {
        padding: 60,
        gap: 24
      }
    },
    assets: {
      logo: {
        url: brand.logoUrl,
        width: brand.logoWidth ?? 200,
        height: brand.logoHeight ?? 80
      },
      ...(brand.logoWhiteUrl
        ? { logoWhite: { url: brand.logoWhiteUrl, width: brand.logoWidth ?? 200, height: brand.logoHeight ?? 80 } }
        : {}),
      fonts: []
    },
    defaults: {
      cortinillaEntrada: 'fade',
      cortinillaCierre: 'fade',
      promoBarStyle: 'bottom',
      productOverlayPosition: 'bottom-right'
    }
  };
}
