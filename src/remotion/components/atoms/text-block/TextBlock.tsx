import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { BrandConfig } from '@/remotion/types/brand-config.types';
import type { VideoFormat } from '@/remotion/types/video-format.types';
import {
  useEntryAnimation,
  prefersReducedMotion
} from '@/remotion/utils/animation-helpers';
import { getResponsiveFontSize } from '@/remotion/utils/format-utils';
import { TEXT_BLOCK_TEXT_MAP } from './text-block.text-map';
import type { TextBlockProps } from './text-block.schema';

// ─── Brand resolution ─────────────────────────────────────────────────────────

interface ResolvedBrandStyles {
  primaryColor: string;
  fontFamily: string;
  springConfig: { damping: number; stiffness: number; mass: number };
}

function resolveBrandStyles(brandConfig?: BrandConfig): ResolvedBrandStyles {
  if (!brandConfig) {
    return {
      primaryColor: '#F9FAFB',
      fontFamily: 'sans-serif',
      springConfig: { damping: 14, stiffness: 150, mass: 1 }
    };
  }
  return {
    primaryColor: brandConfig.tokens.colors.primary,
    fontFamily: brandConfig.tokens.fonts.heading.family,
    springConfig: brandConfig.tokens.animation.springConfig
  };
}

// ─── Typewriter helper ─────────────────────────────────────────────────────────

/**
 * Computes how many characters to display and whether to show the cursor.
 *
 * Spec: charsToShow = Math.floor((frame - delay) / (duration / content.length))
 * Cursor blinks every 15 frames until text is fully revealed.
 *
 * Constraint: duration must be >= content.length frames for smooth reveal.
 */
function getTypewriterState(
  frame: number,
  delay: number,
  duration: number,
  content: string
): { visible: string; showCursor: boolean } {
  if (frame < delay) {
    return { visible: '', showCursor: true };
  }

  const relativeFrame = frame - delay;
  const charFrameInterval = duration / content.length;
  const charsToShow = Math.min(
    content.length,
    Math.floor(relativeFrame / charFrameInterval)
  );
  const isComplete = charsToShow >= content.length;
  const showCursor = !isComplete && Math.floor(relativeFrame / 15) % 2 === 0;

  return {
    visible: content.substring(0, charsToShow),
    showCursor
  };
}

// ─── Format-aware text align ───────────────────────────────────────────────────

function resolveTextAlign(
  explicitAlign: 'left' | 'center' | 'right',
  format: VideoFormat
): 'left' | 'center' | 'right' {
  void format;
  // Explicit prop wins; if it defaults to 'left' and format is portrait/square,
  // the parent can override by passing 'center' explicitly.
  return explicitAlign;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const TextBlock: React.FC<TextBlockProps> = ({
  content,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  backgroundColor,
  animation,
  delay,
  duration,
  maxWidth,
  textAlign,
  format,
  brandConfig
}) => {
  const frame = useCurrentFrame();

  // 1. Resolve brand styles — explicit props override brand defaults.
  // Explicit fontFamily/color always win; fall through to brand only when the
  // parent explicitly passes the brand's font (via brand.fontFamily).
  const brand = resolveBrandStyles(brandConfig);
  // fontFamily from parent is already resolved by the organism (= brand.fontFamily).
  // Color from parent is already resolved. Both are passed explicitly — use them.
  const resolvedFontFamily = fontFamily ?? brand.fontFamily;
  const resolvedColor = color ?? brand.primaryColor;

  // 2. Compute responsive font size
  const scaledFontSize = getResponsiveFontSize(fontSize, format);

  // 3. Handle typewriter animation separately (no opacity/transform from useEntryAnimation)
  const isTypewriter = animation === 'typewriter';
  const reducedMotion = prefersReducedMotion();

  // 4. Compute entry animation (handles opacity + transform for non-typewriter)
  const { opacity, transform } = useEntryAnimation({
    delay,
    duration,
    animation,
    springConfig: brand.springConfig
  });

  // 5. Typewriter state
  const typewriterState = isTypewriter
    ? getTypewriterState(frame, delay, duration, content)
    : null;

  // 6. Chip/badge styles when backgroundColor is set
  const hasBadge = backgroundColor !== undefined;

  const containerStyle: React.CSSProperties = {
    opacity: isTypewriter ? (frame >= delay ? 1 : 0) : opacity,
    transform: isTypewriter || reducedMotion ? 'none' : transform,
    fontFamily: resolvedFontFamily,
    fontSize: scaledFontSize,
    fontWeight,
    color: resolvedColor,
    textAlign: resolveTextAlign(textAlign, format),
    maxWidth: maxWidth !== undefined ? `${maxWidth}px` : undefined,
    // Overflow protection — long product names / legal text must not escape layout bounds.
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    overflow: 'hidden',
    lineHeight: 1.2,
    // Badge styles
    ...(hasBadge && {
      backgroundColor,
      padding: '0.2em 0.5em',
      borderRadius: '0.2em',
      display: 'inline-block'
    })
  };

  if (isTypewriter) {
    const { visible, showCursor } = typewriterState!;
    return (
      <div
        style={containerStyle}
        aria-label={TEXT_BLOCK_TEXT_MAP.ariaLabel}
        role="text"
      >
        {visible}
        {showCursor && (
          <span style={{ opacity: 1 }} aria-hidden="true">
            {TEXT_BLOCK_TEXT_MAP.typewriterCursor}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      aria-label={TEXT_BLOCK_TEXT_MAP.ariaLabel}
      role="text"
    >
      {content}
    </div>
  );
};
