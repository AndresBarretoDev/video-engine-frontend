import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const LogoAnimationSchema = z.enum([
  'scale-bounce',
  'fade-in',
  'slide-down',
  'spin-in',
  'morph'
]);

export type LogoAnimation = z.infer<typeof LogoAnimationSchema>;

export const LogoRevealSchema = z.object({
  logoUrl: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
  animation: LogoAnimationSchema.default('scale-bounce'),
  delay: z.number().int().min(0).default(0),
  duration: z.number().int().positive().default(30),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type LogoRevealProps = z.infer<typeof LogoRevealSchema>;
