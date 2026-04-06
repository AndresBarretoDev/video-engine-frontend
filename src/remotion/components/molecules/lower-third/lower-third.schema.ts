import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const LowerThirdAnimationSchema = z.enum(['slide-in', 'wipe', 'fade']);

export type LowerThirdAnimation = z.infer<typeof LowerThirdAnimationSchema>;

export const LowerThirdSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  barColor: z.string().default('#4361EF'),
  position: z.enum(['bottom-left', 'bottom-right']).default('bottom-left'),
  animation: LowerThirdAnimationSchema.default('slide-in'),
  duration: z.number().int().positive().default(90),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type LowerThirdProps = z.infer<typeof LowerThirdSchema>;
