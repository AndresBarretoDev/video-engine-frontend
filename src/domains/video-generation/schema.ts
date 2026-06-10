/**
 * OP Video Engine — Video Generation Zod Schemas
 *
 * Zod v3. Do NOT upgrade — existing codebase is pinned.
 * Scope: single-product authoring form validation.
 */

import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { isProductImageValue } from './utils/validate-image-url';

// ─── Product form schema ──────────────────────────────────────────────────────

/**
 * productFormSchema — validates the Producer's product input.
 * productImage is required (missing image blocks render — spec §"Validation gates render").
 *
 * productImage accepts:
 *   - https:// URLs (server images, e.g. from POST /uploads response)
 *   - http:// URLs (dev: localhost backend static files)
 *   - blob: objectURLs (local preview before backend upload completes)
 *   Rejects: empty, relative paths, data: URIs, other schemes.
 */
export const productFormSchema = z.object({
  productName: z
    .string()
    .min(1, 'Product name is required')
    .max(120, 'Product name must be 120 characters or fewer'),
  productImage: z
    .string()
    .min(1, 'Product image is required')
    .refine(isProductImageValue, 'Must be a valid image URL or an uploaded image'),
  priceCurrent: z
    .string()
    .min(1, 'Price is required')
    .max(30, 'Price must be 30 characters or fewer'),
  priceOriginal: z.string().max(30).optional(),
  promoTag: z.string().max(60).optional(),
  ctaText: z
    .string()
    .min(1, 'CTA text is required')
    .max(40, 'CTA text must be 40 characters or fewer'),
  legalText: z.string().max(200).optional()
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// ─── Stay form schema ──────────────────────────────────────────────────────────

/**
 * stayFormSchema — validates the Producer's property/listing input (StayPromo).
 * Mirrors StayPromoSlots (src/remotion/components/organisms/stay-promo/stay-promo.schema.ts).
 * heroImage is required (missing image blocks render — same gate as productImage).
 *
 * heroImage accepts the same value space as productImage (https/http/blob).
 */
export const stayFormSchema = z.object({
  listingName: z
    .string()
    .min(1, 'Listing name is required')
    .max(120, 'Listing name must be 120 characters or fewer'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(120, 'Location must be 120 characters or fewer'),
  heroImage: z
    .string()
    .min(1, 'Hero image is required')
    .refine(isProductImageValue, 'Must be a valid image URL or an uploaded image'),
  rating: z
    .string()
    .min(1, 'Rating is required')
    .max(10, 'Rating must be 10 characters or fewer'),
  reviewCount: z.string().max(40).optional(),
  pricePerNight: z
    .string()
    .min(1, 'Price per night is required')
    .max(30, 'Price must be 30 characters or fewer'),
  currency: z
    .string()
    .min(1, 'Currency is required')
    .max(8, 'Currency must be 8 characters or fewer'),
  ctaText: z
    .string()
    .min(1, 'CTA text is required')
    .max(40, 'CTA text must be 40 characters or fewer'),
  legalText: z.string().max(200).optional()
});

export type StayFormValues = z.infer<typeof stayFormSchema>;

// ─── Format selection schema ──────────────────────────────────────────────────

export const formatSelectionSchema = z.object({
  selectedFormats: z
    .array(VideoFormatSchema)
    .min(1, 'Select at least one format')
});

export type FormatSelectionValues = z.infer<typeof formatSelectionSchema>;
