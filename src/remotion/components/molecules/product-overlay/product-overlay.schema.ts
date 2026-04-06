import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const ProductOverlayPositionSchema = z.enum([
  'bottom-right',
  'bottom-left',
  'center',
  'full-width'
]);

export type ProductOverlayPosition = z.infer<
  typeof ProductOverlayPositionSchema
>;

export const ProductOverlayAnimationSchema = z.enum([
  'slide-in',
  'pop',
  'fade'
]);

export type ProductOverlayAnimation = z.infer<
  typeof ProductOverlayAnimationSchema
>;

export const ProductOverlaySchema = z.object({
  productName: z.string().min(1),
  productImage: z.string().url(),
  price: z.string().min(1),
  originalPrice: z.string().optional(),
  weight: z.string().optional(),
  position: ProductOverlayPositionSchema.default('bottom-right'),
  animation: ProductOverlayAnimationSchema.default('slide-in'),
  duration: z.number().int().positive().default(90),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type ProductOverlayProps = z.infer<typeof ProductOverlaySchema>;
