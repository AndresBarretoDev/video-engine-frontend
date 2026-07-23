/**
 * stay-promo.schema.ts
 *
 * Zod@3 schema for the StayPromo organism.
 * No @remotion/zod-types, no zod@4 override.
 *
 * Slots for an Airbnb-style property/listing promotional video:
 *   - listingName: property or listing title
 *   - location: city, neighborhood, country
 *   - heroImage: dominant property photo
 *   - rating: e.g. "4.92" (numeric string for tabular-nums)
 *   - reviewCount: optional, e.g. "128 reviews"
 *   - pricePerNight: e.g. "150" (numeric string, no currency symbol)
 *   - currency: e.g. "$" or "USD"
 *   - ctaText: e.g. "Book now" or "Reservar"
 *   - legalText: optional fine print
 *
 * All fields have safe defaults so preview without brand never breaks.
 */
import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

// ─── Slots ────────────────────────────────────────────────────────────────────

export const StayPromoSlotsSchema = z.object({
  listingName: z.string().default('Beautiful Beach House'),
  location: z.string().default('Malibu, California'),
  heroImage: z
    .string()
    .default('https://placehold.co/1080x920/FF5A5F/FFFFFF?text=Stay'),
  rating: z.string().default('4.92'),
  reviewCount: z.string().optional(),
  pricePerNight: z.string().default('250'),
  currency: z.string().default('$'),
  ctaText: z.string().default('Book now'),
  legalText: z.string().optional()
});

export type StayPromoSlots = z.infer<typeof StayPromoSlotsSchema>;

// ─── Timing ───────────────────────────────────────────────────────────────────

export const StayPromoTimingSchema = z.object({
  totalDurationInFrames: z.number().int().positive().default(300),
  introDurationInFrames: z.number().int().positive().default(60),
  outroDurationInFrames: z.number().int().positive().default(60)
});

export type StayPromoTiming = z.infer<typeof StayPromoTimingSchema>;

// ─── Root schema ─────────────────────────────────────────────────────────────

export const StayPromoSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('16:9'),
  slots: StayPromoSlotsSchema.default({}),
  timing: StayPromoTimingSchema.default({})
});

export type StayPromoProps = z.infer<typeof StayPromoSchema>;
