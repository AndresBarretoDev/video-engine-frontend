import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const PriceAnimationSchema = z.enum(['pop', 'slide-in', 'fade']);

export type PriceAnimation = z.infer<typeof PriceAnimationSchema>;

export const PricePatchSchema = z.object({
  price: z.string().min(1),
  originalPrice: z.string().optional(),
  currency: z.string().default('USD'),
  backgroundColor: z.string().default('#FF3B30'),
  textColor: z.string().default('#FFFFFF'),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  animation: PriceAnimationSchema.default('pop'),
  delay: z.number().int().min(0).default(0),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type PricePatchProps = z.infer<typeof PricePatchSchema>;
