import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const CtvOverlayTypeSchema = z.enum(['product', 'promo', 'lower-third']);
export type CtvOverlayType = z.infer<typeof CtvOverlayTypeSchema>;

export const CtvOverlaySchema = z.object({
  type: CtvOverlayTypeSchema,
  startFrame: z.number().int().min(0),
  duration: z.number().int().positive(),
  props: z.record(z.string(), z.unknown())
});

export type CtvOverlay = z.infer<typeof CtvOverlaySchema>;

export const CtvMainContentSchema = z.object({
  type: z.enum(['video', 'image']),
  src: z.string()
});

export type CtvMainContent = z.infer<typeof CtvMainContentSchema>;

export const CtvIntroVariantSchema = z.enum(['energetic', 'elegant']);
export type CtvIntroVariant = z.infer<typeof CtvIntroVariantSchema>;

export const CTVTemplateSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('16:9'),
  introVariant: CtvIntroVariantSchema.default('elegant'),
  mainContent: CtvMainContentSchema,
  overlays: z.array(CtvOverlaySchema).default([]),
  ctaText: z.string().min(1),
  legalText: z.string().optional(),
  totalDuration: z.number().int().positive().default(600)
});

export type CTVTemplateProps = z.infer<typeof CTVTemplateSchema>;
