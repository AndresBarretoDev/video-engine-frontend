import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const ShapeTypeSchema = z.enum([
  'circle',
  'rectangle',
  'star',
  'line',
  'wave',
  'blob'
]);

export type ShapeType = z.infer<typeof ShapeTypeSchema>;

export const ShapeAnimationSchema = z.enum([
  'scale-up',
  'rotate',
  'pulse',
  'draw-in',
  'morph'
]);

export type ShapeAnimation = z.infer<typeof ShapeAnimationSchema>;

export const ShapeElementSchema = z.object({
  type: ShapeTypeSchema,
  color: z.string().default('#FFFFFF'),
  strokeColor: z.string().optional(),
  strokeWidth: z.number().min(0).optional(),
  width: z.number().positive(),
  height: z.number().positive(),
  animation: ShapeAnimationSchema.default('scale-up'),
  opacity: z.number().min(0).max(1).default(1),
  delay: z.number().int().min(0).default(0),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type ShapeElementProps = z.infer<typeof ShapeElementSchema>;
