/**
 * assembleCompositionProps — pure functions, one per template organism.
 *
 * Maps the current authoring state (form data + brand + format) into the prop
 * shape each organism expects, ready for @remotion/player `inputProps`.
 *
 * Design ref: design.md §Data Flow — "assembleCompositionProps(pure)"
 * "Each field with fallback → preview without brand never breaks"
 *
 * Pure: no side effects, no imports of React/hooks/stores.
 */

import type { AuthoringState, ProductFormData, StayFormData } from '../types';
import type { LoopingProductPromoProps } from '@/remotion/components/organisms/looping-product-promo/looping-product-promo.schema';
import type { StayPromoProps } from '@/remotion/components/organisms/stay-promo/stay-promo.schema';

// ─── Default timing values (mirrors the organism schema defaults) ─────────────

const DEFAULT_TIMING = {
  totalDurationInFrames: 300,
  introDurationInFrames: 60,
  outroDurationInFrames: 60
} as const;

// ─── LoopingProductPromo ────────────────────────────────────────────────────

/**
 * Assembles authoring state into the props expected by LoopingProductPromo.
 *
 * @param state - AuthoringState<ProductFormData> with form, brand, and activeFormat
 * @returns LoopingProductPromoProps ready to pass as `inputProps`
 */
export function assembleCompositionProps(
  state: AuthoringState<ProductFormData>
): LoopingProductPromoProps {
  const { form, brand, activeFormat } = state;

  return {
    // Brand config is optional — undefined means preview uses organism fallbacks
    brandConfig: brand ?? undefined,

    format: activeFormat,

    // Slots: map directly from product form data
    slots: {
      productName: form.productName,
      productImage: form.productImage,
      priceCurrent: form.priceCurrent,
      priceOriginal: form.priceOriginal,
      promoTag: form.promoTag,
      ctaText: form.ctaText,
      legalText: form.legalText
    },

    timing: DEFAULT_TIMING,

    logoPosition: 'top-left'
  };
}

// ─── StayPromo ───────────────────────────────────────────────────────────────

/**
 * Assembles authoring state into the props expected by StayPromo.
 *
 * @param state - AuthoringState<StayFormData> with form, brand, and activeFormat
 * @returns StayPromoProps ready to pass as `inputProps`
 */
export function assembleStayCompositionProps(
  state: AuthoringState<StayFormData>
): StayPromoProps {
  const { form, brand, activeFormat } = state;

  return {
    brandConfig: brand ?? undefined,

    format: activeFormat,

    slots: {
      listingName: form.listingName,
      location: form.location,
      heroImage: form.heroImage,
      rating: form.rating,
      reviewCount: form.reviewCount,
      pricePerNight: form.pricePerNight,
      currency: form.currency,
      ctaText: form.ctaText,
      legalText: form.legalText
    },

    timing: DEFAULT_TIMING
  };
}
