import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate
} from 'remotion';
import { ShapeElement } from '@/remotion/components/atoms/shape-element/ShapeElement';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { prefersReducedMotion } from '@/remotion/utils/animation-helpers';
import type { PromoBarProps, PromoBarAnimation } from './promo-bar.schema';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Internal timing ──────────────────────────────────────────────────────────

const BAR_DELAY = 0;
const TEXT_DELAY = 8;
const ICON_DELAY = 5;

// ─── Bar height ───────────────────────────────────────────────────────────────

function getBarHeight(format: VideoFormat): number {
  switch (format) {
    case '9:16':
      return 100;
    case '1:1':
      return 90;
    default:
      return 80;
  }
}

// ─── Bar entry animation ───────────────────────────────────────────────────────

interface BarAnimation {
  opacity: number;
  translateY: number;
  scaleX: number;
}

function computeBarAnimation(
  animation: PromoBarAnimation,
  position: 'top' | 'bottom',
  frame: number,
  fps: number,
  reducedMotion: boolean
): BarAnimation {
  const relativeFrame = Math.max(0, frame - BAR_DELAY);

  if (reducedMotion || animation === 'fade') {
    const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateY: 0, scaleX: 1 };
  }

  if (animation === 'slide-in') {
    // Slide in from the edge: top position slides down, bottom slides up
    const direction = position === 'top' ? -1 : 1;
    const translateY = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 150, damping: 16, mass: 1 },
      from: 80 * direction,
      to: 0
    });
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateY, scaleX: 1 };
  }

  if (animation === 'expand') {
    // Bar expands from center: scaleX 0 → 1
    const scaleX = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 180, damping: 18, mass: 1 },
      from: 0,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateY: 0, scaleX };
  }

  // Fallback: fade
  const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity, translateY: 0, scaleX: 1 };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PromoBar: React.FC<PromoBarProps> = ({
  message,
  backgroundColor,
  textColor,
  position,
  icon,
  animation,
  duration,
  format,
  brandConfig
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reducedMotion = prefersReducedMotion();

  const barHeight = getBarHeight(format);
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';

  const { opacity, translateY, scaleX } = computeBarAnimation(
    animation,
    position,
    frame,
    fps,
    reducedMotion
  );

  // Font size
  const messageFontSize = format === '9:16' ? 36 : format === '1:1' ? 30 : 28;
  const messageFontWeight: 400 | 600 | 700 | 900 = 700;

  // Bar position style
  const positionStyle: React.CSSProperties =
    position === 'top'
      ? { top: 0, left: 0, right: 0 }
      : { bottom: 0, left: 0, right: 0 };

  const barStyle: React.CSSProperties = {
    position: 'absolute',
    ...positionStyle,
    height: barHeight,
    backgroundColor,
    opacity,
    transform: `translateY(${translateY}px) scaleX(${scaleX})`,
    transformOrigin: 'center center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingLeft: 32,
    paddingRight: 32,
    overflow: 'hidden'
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={barStyle}>
        {/* Optional icon — ShapeElement as placeholder visual anchor */}
        {icon !== undefined && (
          <div style={{ flexShrink: 0 }}>
            <ShapeElement
              type="circle"
              color={textColor}
              width={barHeight - 20}
              height={barHeight - 20}
              animation="scale-up"
              opacity={0.3}
              delay={ICON_DELAY}
              format={format}
              brandConfig={brandConfig}
            />
          </div>
        )}

        {/* Message text — positioned inside bar (absolute fill not needed) */}
        <TextBlock
          content={message}
          fontFamily={fontFamily}
          fontSize={messageFontSize}
          fontWeight={messageFontWeight}
          color={textColor}
          animation="fade-in"
          delay={TEXT_DELAY}
          duration={15}
          textAlign="center"
          format={format}
          brandConfig={brandConfig}
        />
      </div>
    </AbsoluteFill>
  );
};
