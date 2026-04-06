import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const TextAnimationSchema = z.enum([
  'fade-in',
  'slide-up',
  'slide-left',
  'slide-right',
  'scale-up',
  'typewriter',
  'bounce'
]);

export type TextAnimation = z.infer<typeof TextAnimationSchema>;

export const TextBlockSchema = z.object({
  content: z.string().min(1),
  fontFamily: z.string().default('Mulish, sans-serif'),
  fontSize: z.number().positive(),
  fontWeight: z
    .union([z.literal(400), z.literal(600), z.literal(700), z.literal(900)])
    .default(400),
  color: z.string().default('#FFFFFF'),
  backgroundColor: z.string().optional(),
  animation: TextAnimationSchema.default('fade-in'),
  delay: z.number().int().min(0).default(0),
  duration: z.number().int().positive().default(20),
  maxWidth: z.number().positive().optional(),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type TextBlockProps = z.infer<typeof TextBlockSchema>;
