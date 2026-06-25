/**
 * looping-product-promo.schema.ts
 *
 * Zod@3 schema (no @remotion/zod-types, no zod@4 override).
 * Kept pure zod@3: z.object / z.string / z.number / z.enum.
 *
 * Design ref: design.md — LoopingProductPromo schema:
 *   brandConfig?, format (default 16:9), slots (productName, productImage,
 *   priceCurrent, priceOriginal?, promoTag?, ctaText, legalText?),
 *   timing (totalDurationInFrames 300, intro/outro 60), logoPosition.
 *   Each field with fallback → preview without brand never breaks.
 */
import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

// ─── Slots ────────────────────────────────────────────────────────────────────

export const LoopingProductPromoSlotsSchema = z.object({
  productName: z.string().default('Product Name'),
  productImage: z.string().default('https://placehold.co/600x600/1a1a3e/white?text=Product'),
  priceCurrent: z.string().default('0.00'),
  priceOriginal: z.string().optional(),
  promoTag: z.string().optional(),
  ctaText: z.string().default('Shop Now'),
  legalText: z.string().optional()
});

export type LoopingProductPromoSlots = z.infer<typeof LoopingProductPromoSlotsSchema>;

// ─── Timing ───────────────────────────────────────────────────────────────────

export const LoopingProductPromoTimingSchema = z.object({
  totalDurationInFrames: z.number().int().positive().default(300),
  introDurationInFrames: z.number().int().positive().default(60),
  outroDurationInFrames: z.number().int().positive().default(60)
});

export type LoopingProductPromoTiming = z.infer<typeof LoopingProductPromoTimingSchema>;

// ─── Logo position ────────────────────────────────────────────────────────────

export const LogoPositionSchema = z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
export type LogoPosition = z.infer<typeof LogoPositionSchema>;

// ─── Root schema ─────────────────────────────────────────────────────────────

export const LoopingProductPromoSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('16:9'),
  slots: LoopingProductPromoSlotsSchema.default({}),
  timing: LoopingProductPromoTimingSchema.default({}),
  logoPosition: LogoPositionSchema.default('top-left')
});

export type LoopingProductPromoProps = z.infer<typeof LoopingProductPromoSchema>;
