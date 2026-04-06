import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const SubtitleSegmentSchema = z
  .object({
    text: z.string().min(1),
    startFrame: z.number().int().min(0),
    endFrame: z.number().int().positive()
  })
  .refine(data => data.endFrame > data.startFrame, {
    message: 'endFrame must be greater than startFrame',
    path: ['endFrame']
  });

export type SubtitleSegment = z.infer<typeof SubtitleSegmentSchema>;

export const SubtitleAnimationSchema = z.enum(['fade', 'slide-up', 'pop']);

export type SubtitleAnimation = z.infer<typeof SubtitleAnimationSchema>;

export const SubtitleTrackSchema = z.object({
  segments: z.array(SubtitleSegmentSchema).min(1),
  fontFamily: z.string().default('Mulish, sans-serif'),
  fontSize: z.number().positive().default(24),
  color: z.string().default('#FFFFFF'),
  backgroundColor: z.string().optional(),
  position: z.enum(['bottom', 'top', 'center']).default('bottom'),
  animation: SubtitleAnimationSchema.default('fade'),
  format: VideoFormatSchema.default('16:9'),
  brandConfig: BrandConfigSchema.optional()
});

export type SubtitleTrackProps = z.infer<typeof SubtitleTrackSchema>;
