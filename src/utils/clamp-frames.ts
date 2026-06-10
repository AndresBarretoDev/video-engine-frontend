/**
 * Clamps a frame number to the inclusive range [min, max].
 * Used to ensure frame references stay within composition bounds.
 */
export function clampFrames(frame: number, min: number, max: number): number {
  return Math.min(Math.max(frame, min), max);
}
