import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  spring,
  interpolate
} from 'remotion';
import type { BrandConfig } from '@/remotion/types/brand-config.types';
import { prefersReducedMotion } from '@/remotion/utils/animation-helpers';
import { getFormatScale } from '@/remotion/utils/format-utils';
import type { LogoRevealProps } from './logo-reveal.schema';

// ─── Brand resolution ──────────────────────────────────────────────────────────

interface ResolvedBrandStyles {
  springConfig: { damping: number; stiffness: number; mass: number };
  logoUrl?: string;
}

function resolveBrandStyles(brandConfig?: BrandConfig): ResolvedBrandStyles {
  if (!brandConfig) {
    return { springConfig: { damping: 14, stiffness: 150, mass: 1 } };
  }
  return {
    springConfig: brandConfig.tokens.animation.springConfig,
    logoUrl: brandConfig.assets.logo.url
  };
}

// ─── Animation computation ────────────────────────────────────────────────────

interface AnimationValues {
  opacity: number;
  transform: string;
}

function computeLogoAnimation(
  animation: 'scale-bounce' | 'fade-in' | 'slide-down' | 'spin-in' | 'morph',
  frame: number,
  fps: number,
  delay: number,
  duration: number,
  height: number,
  reducedMotion: boolean,
  springConfig: { damping: number; stiffness: number; mass: number }
): AnimationValues {
  // Before delay: invisible
  if (frame < delay) {
    return { opacity: 0, transform: 'none' };
  }

  const relativeFrame = frame - delay;

  // Reduced motion: opacity-only reveal
  if (reducedMotion) {
    const opacity = interpolate(relativeFrame, [0, duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: 'none' };
  }

  // spin-in falls back to fade-in when reduced motion is active (handled above).
  // Explicit spin-in → fade-in fallback is also applied here for clarity.
  const resolvedAnimation =
    animation === 'spin-in' && reducedMotion ? 'fade-in' : animation;

  if (resolvedAnimation === 'fade-in') {
    const opacity = interpolate(relativeFrame, [0, duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: 'none' };
  }

  if (resolvedAnimation === 'scale-bounce') {
    // Spring with bouncy preset (stiffness=200, damping=12) — slight overshoot
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 200, damping: 12, mass: 1 },
      from: 0,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: `scale(${scale})` };
  }

  if (resolvedAnimation === 'slide-down') {
    // translateY from -height → 0 (spring), opacity 0 → 1
    const translateY = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: -height,
      to: 0
    });
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: `translateY(${translateY}px)` };
  }

  if (resolvedAnimation === 'spin-in') {
    // rotate spring from -180deg → 0deg, scale from 0.3 → 1
    const rotate = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: -180,
      to: 0
    });
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: springConfig,
      from: 0.3,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: `rotate(${rotate}deg) scale(${scale})` };
  }

  if (resolvedAnimation === 'morph') {
    // Dramatic shrink-in: scale 2.0 → 1.0 (spring, stiffness=80, damping=20)
    // No opacity fade — logo starts fully visible but oversized
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 80, damping: 20, mass: 1 },
      from: 2.0,
      to: 1.0
    });
    return { opacity: 1, transform: `scale(${scale})` };
  }

  // Fallback: fade-in
  const opacity = interpolate(relativeFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity, transform: 'none' };
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const LogoReveal: React.FC<LogoRevealProps> = ({
  logoUrl,
  width,
  height,
  animation,
  delay,
  duration,
  format,
  brandConfig
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reducedMotion = prefersReducedMotion();
  const brand = resolveBrandStyles(brandConfig);

  // BrandConfig fallback: if no explicit logoUrl differs from schema default,
  // use brandConfig.assets.logo.url when available.
  // Per spec: explicit logoUrl always wins; BrandConfig is the brand-wide default.
  const resolvedLogoUrl = logoUrl ?? brand.logoUrl ?? '';

  // Format-responsive: scale width/height with getFormatScale()
  const formatScale = getFormatScale(format);
  const scaledWidth = Math.round(width * formatScale);
  const scaledHeight = Math.round(height * formatScale);

  const { opacity, transform } = computeLogoAnimation(
    animation,
    frame,
    fps,
    delay,
    duration,
    scaledHeight,
    reducedMotion,
    brand.springConfig
  );

  const containerStyle: React.CSSProperties = {
    display: 'inline-block',
    opacity,
    transform,
    transformOrigin: 'center center',
    // Explicit dimensions required for SVG logos without intrinsic dimensions
    width: scaledWidth,
    height: scaledHeight
  };

  return (
    <div style={containerStyle}>
      {/*
       * Use Remotion <Img> (not native <img>) for frame-accurate preloading.
       * Explicit width/height are required for SVG logos without intrinsic dimensions.
       */}
      <Img
        src={resolvedLogoUrl}
        width={scaledWidth}
        height={scaledHeight}
        style={{
          display: 'block',
          width: scaledWidth,
          height: scaledHeight,
          objectFit: 'contain'
        }}
        alt=""
      />
    </div>
  );
};
