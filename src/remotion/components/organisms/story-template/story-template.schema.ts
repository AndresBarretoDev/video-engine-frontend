import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const StoryMainContentSchema = z.object({
  type: z.enum(['video', 'image']),
  src: z.string()
});

export type StoryMainContent = z.infer<typeof StoryMainContentSchema>;

export const StoryProductSchema = z.object({
  name: z.string().min(1),
  image: z.string(),
  price: z.string().min(1),
  originalPrice: z.string().optional()
});

export type StoryProduct = z.infer<typeof StoryProductSchema>;

export const StoryTemplateSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('9:16'),
  hookText: z.string().min(1),
  mainContent: StoryMainContentSchema,
  product: StoryProductSchema.optional(),
  ctaText: z.string().min(1),
  totalDuration: z.number().int().positive().default(270)
});

export type StoryTemplateProps = z.infer<typeof StoryTemplateSchema>;
