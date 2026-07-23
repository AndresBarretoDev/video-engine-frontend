/**
 * buildBrandTokensPayload — pure function
 *
 * Assembles the BrandDesignTokens-shaped JSON that is sent to the backend
 * via PATCH /brands/:id (as `{ tokens: <payload> }`).
 *
 * Extracted from BrandTokensForm.onSubmit so it is independently testable
 * (no DOM, no React, no hooks) — aligned with the node vitest environment.
 *
 * Design ref: design.md D8 — "Brand form authors the full token set (round-trip)"
 */

import type { BrandTokensEditInput } from '../schema';
import type { BrandDesignTokens } from '../types';

// ─── URL parsing ───────────────────────────────────────────────────────────────

/**
 * Parses a user-entered font-URLs string (comma and/or newline separated)
 * into a cleaned array of non-empty URL strings.
 */
function parseFontUrls(raw: string | undefined): string[] {
  if (!raw || raw.trim() === '') return [];
  return raw
    .split(/[\n,]+/)
    .map(u => u.trim())
    .filter(u => u.length > 0);
}

// ─── Payload builder ──────────────────────────────────────────────────────────

/**
 * Assembles the BrandDesignTokens payload from validated form data.
 *
 * @param data - Validated form values from BrandTokensEditInput
 * @param existingTokens - Current brand.tokens (merged via spread, preserves
 *   fields the form does not surface — e.g. logo, assets.logo, etc.)
 * @returns A BrandDesignTokens-compatible object ready for the mutation.
 */
export function buildBrandTokensPayload(
  data: Partial<BrandTokensEditInput>,
  existingTokens: Record<string, unknown>
): BrandDesignTokens & Record<string, unknown> {
  // ─── Colors ───────────────────────────────────────────────────────────────
  const colors: BrandDesignTokens['colors'] = {
    // Required primary — always present when form validates
    ...(data.colorPrimary ? { primary: data.colorPrimary } : {}),
    ...(data.colorSecondary ? { secondary: data.colorSecondary } : {}),
    ...(data.colorAccent ? { accent: data.colorAccent } : {}),
    // Surfaces & semantic inks
    ...(data.colorSurface ? { surface: data.colorSurface } : {}),
    ...(data.colorBorder ? { border: data.colorBorder } : {}),
    ...(data.colorTextOnBackground
      ? { textOnBackground: data.colorTextOnBackground }
      : {}),
    ...(data.colorTextOnSurface
      ? { textOnSurface: data.colorTextOnSurface }
      : {}),
    ...(data.colorTextOnPrimary
      ? { textOnPrimary: data.colorTextOnPrimary }
      : {})
  } as BrandDesignTokens['colors'];

  // ─── Fonts ────────────────────────────────────────────────────────────────
  const fonts: BrandDesignTokens['fonts'] | undefined =
    data.fontHeading || data.fontBody
      ? ({
          ...(data.fontHeading ? { heading: data.fontHeading } : {}),
          ...(data.fontBody ? { body: data.fontBody } : {})
        } as BrandDesignTokens['fonts'])
      : undefined;

  // ─── Radius ───────────────────────────────────────────────────────────────
  const hasRadius =
    data.radiusButton !== undefined ||
    data.radiusBadge !== undefined ||
    data.radiusImage !== undefined;

  const radius: BrandDesignTokens['radius'] | undefined = hasRadius
    ? {
        button: data.radiusButton ?? 8,
        badge: data.radiusBadge ?? 8,
        image: data.radiusImage ?? 12
      }
    : undefined;

  // ─── Stroke ───────────────────────────────────────────────────────────────
  const hasStroke =
    data.strokeButton !== undefined ||
    data.strokeCard !== undefined ||
    data.strokeBadge !== undefined;

  const stroke: BrandDesignTokens['stroke'] | undefined = hasStroke
    ? {
        button: data.strokeButton ?? 1,
        card: data.strokeCard ?? 1,
        badge: data.strokeBadge ?? 1
      }
    : undefined;

  // ─── Structure ────────────────────────────────────────────────────────────
  const hasStructure =
    data.cortinillaEntrada !== undefined ||
    data.cortinillaCierre !== undefined ||
    data.promoBarStyle !== undefined ||
    data.productOverlayPosition !== undefined;

  const structure: BrandDesignTokens['structure'] | undefined = hasStructure
    ? {
        ...(data.cortinillaEntrada !== undefined
          ? { cortinillaEntrada: data.cortinillaEntrada }
          : {}),
        ...(data.cortinillaCierre !== undefined
          ? { cortinillaCierre: data.cortinillaCierre }
          : {}),
        ...(data.promoBarStyle !== undefined
          ? { promoBarStyle: data.promoBarStyle }
          : {}),
        ...(data.productOverlayPosition !== undefined
          ? { productOverlayPosition: data.productOverlayPosition }
          : {})
      }
    : undefined;

  // ─── Font asset URLs ──────────────────────────────────────────────────────
  const fontUrlList = parseFontUrls(data.fontUrls);
  const assets: BrandDesignTokens['assets'] | undefined =
    fontUrlList.length > 0 ? { fonts: fontUrlList } : undefined;

  // ─── Merge with existing tokens ───────────────────────────────────────────
  return {
    ...existingTokens,
    colors,
    ...(fonts !== undefined ? { fonts } : {}),
    ...(radius !== undefined ? { radius } : {}),
    ...(stroke !== undefined ? { stroke } : {}),
    ...(structure !== undefined ? { structure } : {}),
    ...(assets !== undefined ? { assets } : {}),
    customColors: (data.customColors ?? []).filter(
      (c): c is { name: string; hex: string } => !!c?.name && !!c?.hex
    )
  };
}
