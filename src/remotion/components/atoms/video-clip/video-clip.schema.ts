import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const VideoClipSchema = z.object({
  src: z.string().url(),
  startFrom: z.number().int().min(0).default(0),
  endAt: z.number().int().positive().optional(),
  volume: z.number().min(0).max(1).default(1),
  playbackRate: z.number().min(0.5).max(2).default(1),
  objectFit: z.enum(['cover', 'contain']).default('cover'),
  hasAlpha: z.boolean().default(false),
  loop: z.boolean().default(false),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type VideoClipProps = z.infer<typeof VideoClipSchema>;
