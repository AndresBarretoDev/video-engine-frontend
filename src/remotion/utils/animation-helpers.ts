import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import type {
  SpringConfig,
  EntryAnimationResult
} from '@/remotion/types/animation.types';

// ─── Spring Presets ────────────────────────────────────────────────────────────
// Values chosen to match motion_system.json semantic roles:
//   ui      → standard UI interactions (matches motion.raw.easing.ui intent)
//   bouncy  → high-energy entry with visible overshoot (e.g. TextBlock "bounce")
//   snappy  → quick, precise (e.g. PricePatch "slide-in")
//   slow    → deliberate, editorial (e.g. ImageFrame "zoom-in")

export const SPRING_UI: SpringConfig = { damping: 14, stiffness: 150, mass: 1 };
export const SPRING_BOUNCY: SpringConfig = {
  damping: 6,
  stiffness: 300,
  mass: 1
};
export const SPRING_SNAPPY: SpringConfig = {
  damping: 20,
  stiffness: 200,
  mass: 1
};
export const SPRING_SLOW: SpringConfig = {
  damping: 20,
  stiffness: 80,
  mass: 1
};

// ─── Reduced Motion ────────────────────────────────────────────────────────────

/**
 * Checks if the user has requested reduced motion.
 * Guards against SSR environments where `window` is not available.
 * In Remotion, components run in a browser context during preview;
 * in Lambda rendering there is no window — returns false (safe default).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── springWithDelay ──────────────────────────────────────────────────────────

/**
 * Offset-safe spring interpolation: returns `from` before `delay` frames,
 * then springs from `from` → `to` after the delay.
 */
export function springWithDelay(options: {
  frame: number;
  fps: number;
  delay: number;
  from: number;
  to: number;
  config?: SpringConfig;
}): number {
  const { frame, fps, delay, from, to, config = SPRING_UI } = options;

  if (frame < delay) return from;

  const value = spring({
    frame: frame - delay,
    fps,
    config,
    from,
    to
  });

  return value;
}

// ─── useEntryAnimation ────────────────────────────────────────────────────────

export interface UseEntryAnimationOptions {
  delay: number;
  duration: number;
  animation: string;
  springConfig?: SpringConfig;
}

/**
 * Hook: computes `{ opacity, transform }` for an entry animation.
 *
 * Supported animation values:
 *   "fade-in"    → opacity 0 → 1
 *   "slide-up"   → translateY +40px → 0, opacity 0 → 1
 *   "slide-left" → translateX +60px → 0, opacity 0 → 1
 *   "slide-right"→ translateX -60px → 0, opacity 0 → 1
 *   "scale-up"   → scale 0.7 → 1, opacity 0 → 1
 *   "typewriter" → no transform (managed by component); returns opacity 1 after delay
 *   "bounce"     → scale 0.5 → 1 (SPRING_BOUNCY), opacity 0 → 1
 *   (unknown)    → falls back to "fade-in"
 *
 * When prefers-reduced-motion is true:
 *   - translate/scale transforms are suppressed
 *   - only opacity animates (respecting accessibility)
 */
export function useEntryAnimation(
  options: UseEntryAnimationOptions
): EntryAnimationResult {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay, duration, animation, springConfig = SPRING_UI } = options;

  const reducedMotion = prefersReducedMotion();

  // Opacity: interpolate 0 → 1 from delay to delay+duration (all animations)
  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  if (reducedMotion || animation === 'fade-in' || animation === 'typewriter') {
    return { opacity, transform: 'none' };
  }

  const relativeFrame = Math.max(0, frame - delay);

  if (animation === 'slide-up') {
    const translateY = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: 40,
      to: 0
    });
    return { opacity, transform: `translateY(${translateY}px)` };
  }

  if (animation === 'slide-left') {
    const translateX = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: 60,
      to: 0
    });
    return { opacity, transform: `translateX(${translateX}px)` };
  }

  if (animation === 'slide-right') {
    const translateX = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: -60,
      to: 0
    });
    return { opacity, transform: `translateX(${translateX}px)` };
  }

  if (animation === 'scale-up') {
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: 0.7,
      to: 1
    });
    return { opacity, transform: `scale(${scale})` };
  }

  if (animation === 'bounce') {
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: SPRING_BOUNCY,
      from: 0.5,
      to: 1
    });
    return { opacity, transform: `scale(${scale})` };
  }

  // Fallback: fade-in
  return { opacity, transform: 'none' };
}
