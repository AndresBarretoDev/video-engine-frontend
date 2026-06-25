import { describe, it, expect } from 'vitest';
import { clampFrames } from '@/utils/clamp-frames';

describe('clampFrames', () => {
  it('returns the frame count when within bounds', () => {
    expect(clampFrames(150, 0, 300)).toBe(150);
  });

  it('clamps to max when frame exceeds composition duration', () => {
    expect(clampFrames(400, 0, 300)).toBe(300);
  });

  it('clamps to min when frame is below start', () => {
    expect(clampFrames(-10, 0, 300)).toBe(0);
  });
});
