import { z } from 'zod';

export const VideoFormatSchema = z.enum(['16:9', '9:16', '1:1']);
export type VideoFormat = z.infer<typeof VideoFormatSchema>;

export interface FormatDimensions {
  width: number;
  height: number;
}

export const FORMAT_DIMENSIONS: Record<VideoFormat, FormatDimensions> = {
  '16:9': { width: 1920, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 }
};
