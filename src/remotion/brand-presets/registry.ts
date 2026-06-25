/**
 * Brand presets registry
 *
 * Maps slug → BrandConfig so resolveRemotionBrand can look up curated identities
 * without relying on backend tokens (which may be seeded as dummies).
 *
 * Used by brand-config-mapper.ts as the "slug bridge":
 *   if BRAND_PRESETS[brand.slug] exists → return the curated preset
 *   else if brand.tokens.colors.primary exists → map the tokens
 *   else → return null (caller falls back to template default)
 *
 * TODO(brand-data): bridge until backend seeds real tokens / brand form (Phase 5)
 * lets users author them. When a brand has real authored tokens, its slug will not
 * match any entry here (unless the user intentionally uses a reserved slug), so
 * the mapper falls through to the token-mapping path.
 */

import type { BrandConfig } from '@/remotion/types/brand-config.types';
import { OP_BRAND_PRESET } from './op.preset';
import { NIKE_BRAND_PRESET } from './nike.preset';
import { AIRBNB_BRAND_PRESET } from './airbnb.preset';

/**
 * Keyed by slug string — matches `BrandConfig.slug` from the brands domain.
 * Multiple slugs may point to the same preset (e.g. 'op' and 'op-brand').
 */
export const BRAND_PRESETS: Record<string, BrandConfig> = {
  'op-brand': OP_BRAND_PRESET,
  'op': OP_BRAND_PRESET,
  'nike': NIKE_BRAND_PRESET,
  'airbnb': AIRBNB_BRAND_PRESET,
  'demo-airbnb': AIRBNB_BRAND_PRESET
};
