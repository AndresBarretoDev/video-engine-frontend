import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  spring,
  interpolate
} from 'remotion';
import { prefersReducedMotion } from '@/remotion/utils/animation-helpers';
import { getFormatScale } from '@/remotion/utils/format-utils';
import type { ImageFrameProps } from './image-frame.schema';

// ─── Animation computation ────────────────────────────────────────────────────

interface ImageAnimationValues {
  /**
   * Container opacity — controlled during entry (fade-in, zoom-in, slide).
   * Continuous animations (parallax, ken-burns) never change opacity.
   */
  containerOpacity: number;
  /**
   * CSS transform applied to the container (entry animations).
   * slide: translateX for container entry.
   */
  containerTransform: string;
  /**
   * CSS transform applied to the <Img> element (continuous animations).
   * zoom-in / ken-burns: scale. parallax: translateY.
   * Applied on the inner image so overflow:hidden on the container clips it.
   */
  imageTransform: string;
}

function computeImageAnimation(
  animation: 'fade-in' | 'zoom-in' | 'parallax' | 'ken-burns' | 'slide',
  frame: number,
  fps: number,
  delay: number,
  width: number,
  totalFrames: number,
  reducedMotion: boolean
): ImageAnimationValues {
  // ── Continuous animations: parallax and ken-burns ignore delay ─────────────
  // Per spec: these run throughout the component's lifetime, not just on entry.

  if (animation === 'parallax') {
    if (reducedMotion) {
      return {
        containerOpacity: 1,
        containerTransform: 'none',
        imageTransform: 'none'
      };
    }
    // Gentle upward drift: translateY 0 → -20px across whole composition
    const translateY = interpolate(frame, [0, totalFrames], [0, -20], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      containerOpacity: 1,
      containerTransform: 'none',
      imageTransform: `translateY(${translateY}px)`
    };
  }

  if (animation === 'ken-burns') {
    if (reducedMotion) {
      return {
        containerOpacity: 1,
        containerTransform: 'none',
        imageTransform: 'none'
      };
    }
    // Continuous: scale 1.0 → 1.08 over total composition frames (slow zoom + slight pan)
    const scale = interpolate(frame, [0, totalFrames], [1.0, 1.08], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    // Slight pan: translateX 0 → -1% (relative, small drift for cinematic feel)
    const translateX = interpolate(frame, [0, totalFrames], [0, -8], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      containerOpacity: 1,
      containerTransform: 'none',
      imageTransform: `scale(${scale}) translateX(${translateX}px)`
    };
  }

  // ── Entry animations: respect delay ──────────────────────────────────────────

  if (frame < delay) {
    return {
      containerOpacity: 0,
      containerTransform: 'none',
      imageTransform: 'none'
    };
  }

  const relativeFrame = frame - delay;

  if (animation === 'fade-in' || reducedMotion) {
    // Opacity 0 → 1 over 20 frames
    const containerOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      containerOpacity,
      containerTransform: 'none',
      imageTransform: 'none'
    };
  }

  if (animation === 'zoom-in') {
    // Scale 1.2 → 1.0 (spring, stiffness=60, damping=20) + opacity 0 → 1 over first 10 frames
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 60, damping: 20, mass: 1 },
      from: 1.2,
      to: 1.0
    });
    const containerOpacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      containerOpacity,
      containerTransform: 'none',
      imageTransform: `scale(${scale})`
    };
  }

  if (animation === 'slide') {
    // translateX from +width → 0 (spring, stiffness=100, damping=18) + opacity 0 → 1
    const translateX = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 100, damping: 18, mass: 1 },
      from: width,
      to: 0
    });
    const containerOpacity = interpolate(relativeFrame, [0, 12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      containerOpacity,
      containerTransform: `translateX(${translateX}px)`,
      imageTransform: 'none'
    };
  }

  // Fallback: fade-in
  const containerOpacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return {
    containerOpacity,
    containerTransform: 'none',
    imageTransform: 'none'
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const ImageFrame: React.FC<ImageFrameProps> = ({
  src,
  width,
  height,
  objectFit,
  animation,
  borderRadius,
  shadow,
  overlay,
  delay,
  format
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const reducedMotion = prefersReducedMotion();

  // Format-responsive: scale width/height with getFormatScale()
  const formatScale = getFormatScale(format);
  const scaledWidth = Math.round(width * formatScale);
  const scaledHeight = Math.round(height * formatScale);

  const { containerOpacity, containerTransform, imageTransform } =
    computeImageAnimation(
      animation,
      frame,
      fps,
      delay,
      scaledWidth,
      durationInFrames,
      reducedMotion
    );

  // Container style — overflow:hidden clips zoom/parallax effects
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: scaledWidth,
    height: scaledHeight,
    overflow: 'hidden',
    opacity: containerOpacity,
    transform: containerTransform,
    transformOrigin: 'center center',
    borderRadius:
      borderRadius !== undefined && borderRadius > 0 ? borderRadius : undefined,
    // Per spec and tasks: use filter: drop-shadow() for Lambda compatibility (not box-shadow)
    ...(shadow && {
      filter: 'drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.45))'
    })
  };

  const imageStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit,
    transform: imageTransform,
    transformOrigin: 'center center'
  };

  return (
    <div style={containerStyle}>
      {/*
       * Use Remotion <Img> for frame-accurate preloading.
       * objectFit is applied via style — Remotion <Img> accepts style prop.
       */}
      <Img src={src} style={imageStyle} alt="" />

      {/* Optional semitransparent overlay — rendered above image */}
      {overlay !== undefined && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: overlay,
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
