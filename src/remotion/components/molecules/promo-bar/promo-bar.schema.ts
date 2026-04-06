import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const PromoBarAnimationSchema = z.enum(['slide-in', 'expand', 'fade']);

export type PromoBarAnimation = z.infer<typeof PromoBarAnimationSchema>;

export const PromoBarSchema = z.object({
  message: z.string().min(1),
  backgroundColor: z.string().default('#FF3B30'),
  textColor: z.string().default('#FFFFFF'),
  position: z.enum(['top', 'bottom']).default('bottom'),
  icon: z.string().url().optional(),
  animation: PromoBarAnimationSchema.default('slide-in'),
  duration: z.number().int().positive().default(90),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type PromoBarProps = z.infer<typeof PromoBarSchema>;
