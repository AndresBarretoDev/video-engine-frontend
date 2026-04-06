import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const BannerBackgroundContentSchema = z.object({
  type: z.enum(['video', 'image', 'color']),
  src: z.string().optional(),
  color: z.string().optional()
});

export type BannerBackgroundContent = z.infer<
  typeof BannerBackgroundContentSchema
>;

export const BannerVideoTemplateSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('16:9'),
  backgroundContent: BannerBackgroundContentSchema,
  headline: z.string().min(1),
  price: z.string().optional(),
  originalPrice: z.string().optional(),
  ctaText: z.string().min(1),
  totalDuration: z.number().int().positive().default(150)
});

export type BannerVideoTemplateProps = z.infer<
  typeof BannerVideoTemplateSchema
>;
