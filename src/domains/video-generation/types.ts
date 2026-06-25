/**
 * OP Video Engine — Video Generation Domain Types
 *
 * Scope: single-product authoring (Capa 2 / golden path).
 * CSV/batch types deliberately excluded (Capa 3, out of scope).
 *
 * Design ref: design.md §Interfaces/Contracts + D4 + D8 + D9
 */

import type { VideoFormat } from '@/remotion/types/video-format.types';
import type { BrandConfig as RemotionBrandConfig } from '@/remotion/types/brand-config.types';
import type { LoopingProductPromoProps } from '@/remotion/components/organisms/looping-product-promo/looping-product-promo.schema';
import type { StayPromoProps } from '@/remotion/components/organisms/stay-promo/stay-promo.schema';

// ─── Re-export remotion BrandConfig for clarity ──────────────────────────────

export type { RemotionBrandConfig };

// ─── Per-template form data ────────────────────────────────────────────────────

/**
 * ProductFormData — values the Producer fills for the LoopingProductPromo template.
 * Maps 1:1 to the `slots` field in LoopingProductPromoProps.
 * Required: productName, productImage, priceCurrent, ctaText.
 * Optional: priceOriginal, promoTag, legalText.
 */
export interface ProductFormData {
  productName: string;
  productImage: string;
  priceCurrent: string;
  priceOriginal?: string;
  promoTag?: string;
  ctaText: string;
  legalText?: string;
}

/**
 * StayFormData — values the Producer fills for the StayPromo template.
 * Maps 1:1 to the `slots` field in StayPromoProps.
 * Required: listingName, location, heroImage, rating, pricePerNight, currency, ctaText.
 * Optional: reviewCount, legalText.
 */
export interface StayFormData {
  listingName: string;
  location: string;
  heroImage: string;
  rating: string;
  reviewCount?: string;
  pricePerNight: string;
  currency: string;
  ctaText: string;
  legalText?: string;
}

// ─── Authoring session state (what the editor knows) ─────────────────────────

/**
 * AuthoringState — the complete state needed to assemble composition props.
 * Generic over the template's form-values shape. Defaults to ProductFormData so
 * existing looping-product-promo call sites keep working unchanged.
 *
 * NOTE: brand is optional — preview renders with fallbacks when brand is absent.
 */
export interface AuthoringState<TForm = ProductFormData> {
  form: TForm;
  brand: RemotionBrandConfig | null;
  activeFormat: VideoFormat;
}

// ─── Assembled composition props (pure data, no React) ───────────────────────

/**
 * AssembledTemplateProps — the union of every organism's prop shape.
 * The output of a registry `assembleProps()` and what flows to @remotion/player
 * as `inputProps` + to the backend as `compositionProps`. Each entry is the real
 * organism prop type (single source of truth = the organism's own zod schema).
 */
export type AssembledTemplateProps = LoopingProductPromoProps | StayPromoProps;

/**
 * @deprecated Use AssembledTemplateProps. Kept as an alias for the looping shape
 * so older imports keep compiling; it equals LoopingProductPromoProps exactly.
 */
export type AssembledCompositionProps = LoopingProductPromoProps;

// ─── Single-product render request (D9 — new endpoint, not batch) ─────────────

/**
 * CreateSingleProductRenderDto — payload for POST /projects/:id/render-single
 * (D9: new endpoint dedicated to single-product golden path, NOT batch).
 *
 * BACKEND CONTRACT (task 2.6):
 *   Endpoint : POST /projects/:projectId/render-single
 *   Body     : CreateSingleProductRenderDto
 *   Response : SingleProductRenderResponse
 *   Behavior : Creates N render jobs (one per selected format).
 */
export interface CreateSingleProductRenderDto {
  templateId: string;
  compositionId: string;
  compositionProps: AssembledTemplateProps;
  format: VideoFormat;
  projectId: string;
  /** Optional custom output filename prefix */
  outputNamePrefix?: string;
}

/**
 * SingleProductRenderResponse — response from POST /projects/:id/render-single
 */
export interface SingleProductRenderResponse {
  jobIds: string[];
  totalJobs: number;
}

// ─── Render job progress (reuses existing render-jobs types) ─────────────────

export type { RenderProgress } from '@/domains/render-jobs/types';
export type { RenderOutput } from '@/domains/render-jobs/types';
export type { RenderJobStatus } from '@/domains/render-jobs/types';
