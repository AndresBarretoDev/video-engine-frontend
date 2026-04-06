import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const ImageAnimationSchema = z.enum([
  'fade-in',
  'zoom-in',
  'parallax',
  'ken-burns',
  'slide'
]);

export type ImageAnimation = z.infer<typeof ImageAnimationSchema>;

export const ImageFrameSchema = z.object({
  src: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
  objectFit: z.enum(['cover', 'contain', 'fill']).default('cover'),
  animation: ImageAnimationSchema.default('fade-in'),
  borderRadius: z.number().min(0).optional().default(0),
  shadow: z.boolean().default(false),
  /**
   * Semitransparent overlay color, e.g. "rgba(0,0,0,0.4)".
   * Should include alpha channel. Not enforced by schema — authoring constraint.
   */
  overlay: z.string().optional(),
  delay: z.number().int().min(0).default(0),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type ImageFrameProps = z.infer<typeof ImageFrameSchema>;
