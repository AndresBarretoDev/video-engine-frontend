import type { VideoFormat } from '@/remotion/types/video-format.types';

/**
 * Returns a scale multiplier for visual sizing relative to the 16:9 baseline.
 * 16:9 = 1.0 | 9:16 = 1.25 | 1:1 = 1.1
 */
export function getFormatScale(format: VideoFormat): number {
  const scales: Record<VideoFormat, number> = {
    '16:9': 1.0,
    '9:16': 1.25,
    '1:1': 1.1
  };
  return scales[format];
}

/**
 * Returns the recommended default text alignment for a given format.
 * Landscape (16:9) → left; portrait/square → center.
 */
export function getFormatTextAlign(format: VideoFormat): 'left' | 'center' {
  return format === '16:9' ? 'left' : 'center';
}

/**
 * Detects VideoFormat from pixel dimensions.
 * Ratio > 1.5 → 16:9 | Ratio < 0.75 → 9:16 | Otherwise → 1:1
 */
export function detectFormat(width: number, height: number): VideoFormat {
  const ratio = width / height;
  if (ratio > 1.5) return '16:9';
  if (ratio < 0.75) return '9:16';
  return '1:1';
}

/**
 * Returns a responsive font size scaled for the given format.
 * Applies getFormatScale() multiplier and rounds to the nearest integer.
 */
export function getResponsiveFontSize(
  baseFontSize: number,
  format: VideoFormat
): number {
  return Math.round(baseFontSize * getFormatScale(format));
}
