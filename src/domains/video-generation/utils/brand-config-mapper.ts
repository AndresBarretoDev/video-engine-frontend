/**
 * brand-config-mapper — pure function
 *
 * Maps domain-level brand data (from brands API / BrandTokens)
 * → RemotionBrandConfig (the shape LoopingProductPromo/StayPromo consumes).
 *
 * Design ref: design.md D4 — "brand-config-mapper.ts stops dropping/hardcoding"
 *
 * Key invariants:
 * - The '#FFFFFF'-string-compare contrast inference is GONE (was the black-on-black bug).
 * - radius, spacing, stroke, surface, border, textOnBackground/Surface/Primary, defaults,
 *   and assets.fonts ALL flow through from input tokens.
 * - Absent optionals fall back to NEUTRAL grey values (never platform OP blue #4361EF).
 * - This is a PURE MAPPER of the brand's REAL tokens — no slug bridge, no fake-brand
 *   fallback. A brand renders from its own data (seeded in the backend or authored via
 *   the brand form). The only fallback is the per-template house default for the
 *   no-brand-selected preview (config.fallbackBrandPreset, handled by the caller).
 *
 * Pure: no side effects, no imports of React/hooks/stores.
 */

import type { BrandConfig as RemotionBrandConfig } from '@/remotion/types/brand-config.types';
import type { BrandConfig, BrandDesignTokens } from '@/domains/brands/types';

// ─── Input type ───────────────────────────────────────────────────────────────

/**
 * BrandConfigInput — domain data received from the brands API.
 * Extended to include all new token fields introduced in the Brand Identity Engine.
 * Maps to `BrandTokens` + `BrandAssets` from `src/domains/brands/types.ts`.
 */
export interface BrandConfigInput {
  id: string;
  name: string;

  // Core colors (required)
  colorPrimary: string;
  colorAccent: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  logoUrl: string;

  // Optional colors
  colorSecondary?: string;
  colorBackground?: string;
  colorText?: string;
  /** Explicit textInverse value — replaces the broken '#FFFFFF' string-compare inference */
  colorTextInverse?: string;
  /** Panel/card background — distinct from background */
  colorSurface?: string;
  /** Border/stroke color */
  colorBorder?: string;
  /** Declared legible ink on page background */
  colorTextOnBackground?: string;
  /** Declared legible ink on panel/card surface */
  colorTextOnSurface?: string;
  /** Declared legible ink on primary-colored fills (buttons/badges) */
  colorTextOnPrimary?: string;

  // Logo
  logoWidth?: number;
  logoHeight?: number;
  logoWhiteUrl?: string;

  // Token groups (pass-through)
  radius?: { button: number; badge: number; image: number };
  spacing?: { padding: number; gap: number };
  stroke?: { button: number; card: number; badge: number };
  defaults?: {
    cortinillaEntrada: string;
    cortinillaCierre: string;
    promoBarStyle: 'top' | 'bottom';
    productOverlayPosition: 'bottom-right' | 'bottom-left' | 'center';
  };
  /** Font URLs to load in preview */
  fontUrls?: string[];
}

// ─── Neutral fallbacks ────────────────────────────────────────────────────────
// Used ONLY when a brand has no tokens for a given field.
// These are neutral greys — NEVER platform OP blue or any brand-specific value.

const NEUTRAL_TEXT = '#111111';
const NEUTRAL_TEXT_INVERSE = '#F5F5F5';
const NEUTRAL_SURFACE = '#F2F2F2';
const NEUTRAL_BORDER = '#CCCCCC';
const NEUTRAL_TEXT_ON_SURFACE = '#111111';

// ─── Pure mapping function ────────────────────────────────────────────────────

/**
 * Maps domain brand data to the RemotionBrandConfig shape.
 * All optional token groups flow through; absent optionals get NEUTRAL grey fallbacks.
 *
 * @param brand - Domain brand data
 * @returns RemotionBrandConfig ready for assembleCompositionProps
 */
export function mapBrandConfigToRemotionBrand(
  brand: BrandConfigInput
): RemotionBrandConfig {
  const colorPrimary = brand.colorPrimary;
  const colorSecondary = brand.colorSecondary ?? '#1A1A1A';
  const colorAccent = brand.colorAccent;
  const colorBackground = brand.colorBackground ?? '#FFFFFF';
  const colorText = brand.colorText ?? NEUTRAL_TEXT;

  // textInverse: use the explicitly declared value when present.
  // REMOVED: the old `colorBackground === '#FFFFFF' ? '#0A0A0A' : '#FFFFFF'` inference
  // that caused black-on-black bugs. The brand DECLARES its legible inverse ink.
  const colorTextInverse = brand.colorTextInverse ?? NEUTRAL_TEXT_INVERSE;

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
        textInverse: colorTextInverse,
        // New fields — pass through when present:
        ...(brand.colorSurface !== undefined ? { surface: brand.colorSurface } : {}),
        ...(brand.colorBorder !== undefined ? { border: brand.colorBorder } : {}),
        // Semantic text inks — use declared values; fall back to text/textInverse or neutral
        textOnBackground: brand.colorTextOnBackground ?? colorText,
        textOnSurface: brand.colorTextOnSurface ?? NEUTRAL_TEXT_ON_SURFACE,
        textOnPrimary: brand.colorTextOnPrimary ?? colorTextInverse
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

      // spacing: pass through brand values when present (was hardcoded 60/24 — fixed)
      spacing: brand.spacing ?? { padding: 60, gap: 24 },

      // radius: pass through (was undefined — dropped)
      ...(brand.radius !== undefined ? { radius: brand.radius } : {}),

      // stroke: pass through (was missing entirely)
      ...(brand.stroke !== undefined ? { stroke: brand.stroke } : {})
    },

    assets: {
      logo: {
        url: brand.logoUrl,
        width: brand.logoWidth ?? 200,
        height: brand.logoHeight ?? 80
      },
      ...(brand.logoWhiteUrl
        ? {
            logoWhite: {
              url: brand.logoWhiteUrl,
              width: brand.logoWidth ?? 200,
              height: brand.logoHeight ?? 80
            }
          }
        : {}),
      // assets.fonts: pass through brand font URLs (was always [])
      fonts: brand.fontUrls ?? []
    },

    // defaults: pass through brand defaults (was hardcoded 'fade'/'bottom'/'bottom-right')
    defaults: brand.defaults ?? {
      cortinillaEntrada: 'fade',
      cortinillaCierre: 'fade',
      promoBarStyle: 'bottom',
      productOverlayPosition: 'bottom-right'
    }
  };
}

// ─── Domain BrandConfig → RemotionBrandConfig ─────────────────────────────────

/**
 * resolveRemotionBrand — adapts a domain BrandConfig (as returned by useBrand)
 * into a RemotionBrandConfig the preview/render can consume.
 *
 * Maps the brand's OWN structured tokens (no slug bridge, no fake-brand fallback):
 * - brand.tokens.colors.primary present → map the structured design tokens.
 * - No usable tokens → null. The caller uses the template's house default preset
 *   (config.fallbackBrandPreset) only for the no-brand-selected preview.
 *
 * A real brand must carry real tokens — seeded in the backend or authored via the
 * brand form. See docs/contracts for the backend seed handoff.
 */
export function resolveRemotionBrand(
  brand: BrandConfig | null | undefined
): RemotionBrandConfig | null {
  if (!brand) return null;

  const tokens = brand.tokens as BrandDesignTokens | undefined;
  const primary = tokens?.colors?.primary;

  // No structured tokens → caller falls back to the template's house default preset.
  if (!tokens || !primary) return null;

  return mapBrandConfigToRemotionBrand({
    id: brand.id,
    name: brand.name,

    colorPrimary: primary,
    colorAccent: tokens.colors.accent ?? primary,
    colorSecondary: tokens.colors.secondary,
    colorBackground: tokens.colors.background,
    colorText: tokens.colors.text,
    colorTextInverse: undefined, // not in BrandDesignTokens; falls back to neutral
    colorSurface: tokens.colors.surface,
    colorBorder: tokens.colors.border,
    colorTextOnBackground: tokens.colors.textOnBackground,
    colorTextOnSurface: tokens.colors.textOnSurface,
    colorTextOnPrimary: tokens.colors.textOnPrimary,

    fontFamilyHeading: tokens.fonts?.heading ?? 'Inter, sans-serif',
    fontFamilyBody: tokens.fonts?.body ?? 'Inter, sans-serif',

    logoUrl: tokens.logo?.url ?? 'https://placehold.co/240x80/CCCCCC/333333?text=Logo',
    logoWidth: tokens.logo?.width,
    logoHeight: tokens.logo?.height,
    logoWhiteUrl: tokens.logo?.whiteUrl,

    radius: tokens.radius,
    // BrandDesignTokens.spacing is not yet declared — omit for now
    stroke: tokens.stroke,
    defaults: tokens.structure
      ? {
          cortinillaEntrada: tokens.structure.cortinillaEntrada ?? 'fade',
          cortinillaCierre: tokens.structure.cortinillaCierre ?? 'fade',
          promoBarStyle: tokens.structure.promoBarStyle ?? 'bottom',
          productOverlayPosition: tokens.structure.productOverlayPosition ?? 'bottom-right'
        }
      : undefined,
    // assets.fonts: populated from the brand's stored font stylesheet URLs (Phase 5)
    fontUrls: tokens.assets?.fonts ?? undefined
  });
}
