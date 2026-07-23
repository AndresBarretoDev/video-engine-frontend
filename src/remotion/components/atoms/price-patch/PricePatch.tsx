import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import {
  prefersReducedMotion,
  SPRING_SNAPPY
} from '@/remotion/utils/animation-helpers';
import type { PricePatchProps } from './price-patch.schema';

// ─── Size system ──────────────────────────────────────────────────────────────
// Spec: small: 18px / 8×16px padding / 36px height
//       medium: 28px / 12×24px padding / 56px height
//       large: 42px / 16×32px padding / 76px height

interface SizeTokens {
  fontSize: number;
  paddingV: number;
  paddingH: number;
  height: number;
}

const SIZE_TOKENS: Record<'small' | 'medium' | 'large', SizeTokens> = {
  small: { fontSize: 18, paddingV: 8, paddingH: 16, height: 36 },
  medium: { fontSize: 28, paddingV: 12, paddingH: 24, height: 56 },
  large: { fontSize: 42, paddingV: 16, paddingH: 32, height: 76 }
};

// Spec: format 9:16 → all sizes × 1.3 scale multiplier
const FORMAT_SCALE_9_16 = 1.3;

// ─── Animation helpers ────────────────────────────────────────────────────────

interface AnimationValues {
  opacity: number;
  transform: string;
}

function computeAnimation(
  animation: 'pop' | 'slide-in' | 'fade',
  frame: number,
  fps: number,
  delay: number,
  reducedMotion: boolean
): AnimationValues {
  if (frame < delay) {
    return { opacity: 0, transform: 'none' };
  }

  const relativeFrame = frame - delay;

  if (reducedMotion || animation === 'fade') {
    // Opacity 0 → 1 over 15 frames
    const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: 'none' };
  }

  if (animation === 'pop') {
    // Scale spring from 0 → 1 with stiffness=300, damping=10 (visible overshoot)
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 300, damping: 10, mass: 1 },
      from: 0,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: `scale(${scale})` };
  }

  if (animation === 'slide-in') {
    // translateX from +80px → 0 (spring, stiffness=120, damping=14), opacity 0 → 1
    const translateX = spring({
      frame: relativeFrame,
      fps,
      config: SPRING_SNAPPY,
      from: 80,
      to: 0
    });
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, transform: `translateX(${translateX}px)` };
  }

  // Fallback: fade
  const opacity = interpolate(relativeFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity, transform: 'none' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PricePatch: React.FC<PricePatchProps> = ({
  price,
  originalPrice,
  currency,
  backgroundColor,
  textColor,
  size,
  animation,
  delay,
  format
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reducedMotion = prefersReducedMotion();

  // Apply format scale for 9:16
  const formatMultiplier = format === '9:16' ? FORMAT_SCALE_9_16 : 1;

  const tokens = SIZE_TOKENS[size];
  const scaledFontSize = Math.round(tokens.fontSize * formatMultiplier);
  const scaledPaddingV = Math.round(tokens.paddingV * formatMultiplier);
  const scaledPaddingH = Math.round(tokens.paddingH * formatMultiplier);
  const scaledHeight = Math.round(tokens.height * formatMultiplier);

  // Main price animation
  const { opacity, transform } = computeAnimation(
    animation,
    frame,
    fps,
    delay,
    reducedMotion
  );

  // Original price: delayed 5 frames after main price
  const originalPriceDelay = delay + 5;
  const originalPriceOpacity = interpolate(
    frame,
    [originalPriceDelay, originalPriceDelay + 12],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  // Original price font size: 60% of main price size
  const originalPriceFontSize = Math.round(scaledFontSize * 0.6);

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    color: textColor,
    borderRadius: 12,
    paddingTop: scaledPaddingV,
    paddingBottom: scaledPaddingV,
    paddingLeft: scaledPaddingH,
    paddingRight: scaledPaddingH,
    minHeight: scaledHeight,
    opacity,
    transform,
    // Ensure transform origin is center for pop animation
    transformOrigin: 'center center'
  };

  const priceStyle: React.CSSProperties = {
    fontSize: scaledFontSize,
    fontWeight: 700,
    lineHeight: 1,
    fontFamily: 'Mulish, sans-serif',
    color: textColor
  };

  const currencyStyle: React.CSSProperties = {
    fontSize: Math.round(scaledFontSize * 0.55),
    fontWeight: 600,
    lineHeight: 1,
    fontFamily: 'Mulish, sans-serif',
    color: textColor,
    alignSelf: 'flex-start',
    paddingTop: Math.round(scaledFontSize * 0.08)
  };

  const originalPriceStyle: React.CSSProperties = {
    fontSize: originalPriceFontSize,
    fontWeight: 400,
    lineHeight: 1,
    fontFamily: 'Mulish, sans-serif',
    color: textColor,
    textDecoration: 'line-through',
    opacity: originalPriceOpacity,
    // Slight transparency to differentiate from main price
    filter: 'opacity(0.75)',
    marginTop: 4
  };

  return (
    <div style={badgeStyle}>
      {/* Main price row: currency symbol + amount */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 2
        }}
      >
        <span style={currencyStyle}>{currency}</span>
        <span style={priceStyle}>{price}</span>
      </div>

      {/* Original price (crossed out) — shown only when provided */}
      {originalPrice !== undefined && (
        <div style={originalPriceStyle}>{originalPrice}</div>
      )}
    </div>
  );
};
