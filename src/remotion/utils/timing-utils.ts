/**
 * Timing utilities for Remotion compositions.
 * MOTION_DURATIONS values are sourced from motion_system.json (design tokens source of truth).
 */

/**
 * Duration tokens mapped from motion_system.json raw.duration values.
 * fast: 120ms | standard: 300ms | slow: 400ms | story: 600ms
 */
export const MOTION_DURATIONS = {
  fast: 120,
  standard: 300,
  slow: 400,
  story: 600
} as const;

export type MotionDurationToken = keyof typeof MOTION_DURATIONS;

/**
 * Convert milliseconds to frames at a given fps.
 */
export function msToFrames(ms: number, fps: number): number {
  return Math.round((ms / 1000) * fps);
}

/**
 * Convert frames to milliseconds at a given fps.
 */
export function framesToMs(frames: number, fps: number): number {
  return (frames / fps) * 1000;
}

/**
 * Get normalized progress (0 to 1) for a frame within a [start, end] window.
 * Returns 0 before start, 1 after end.
 */
export function getProgress(frame: number, start: number, end: number): number {
  if (frame <= start) return 0;
  if (frame >= end) return 1;
  return (frame - start) / (end - start);
}

/**
 * Convert a motion_system.json duration token to frames at a given fps.
 */
export function motionDurationToFrames(
  token: MotionDurationToken,
  fps: number
): number {
  return msToFrames(MOTION_DURATIONS[token], fps);
}
