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
import type {
  LowerThirdProps,
  LowerThirdAnimation
} from './lower-third.schema';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Internal timing ──────────────────────────────────────────────────────────
// Bar appears first, then title, then subtitle

const BAR_DELAY = 0;
const TITLE_DELAY = 8;
const SUBTITLE_DELAY = 16;

// ─── Sizing ───────────────────────────────────────────────────────────────────

function getBarDimensions(format: VideoFormat): {
  width: number;
  height: number;
} {
  switch (format) {
    case '9:16':
      return { width: 560, height: 6 };
    case '1:1':
      return { width: 480, height: 6 };
    default:
      return { width: 600, height: 6 };
  }
}

function getTitleFontSize(format: VideoFormat): number {
  switch (format) {
    case '9:16':
      return 48;
    case '1:1':
      return 40;
    default:
      return 44;
  }
}

function getSubtitleFontSize(format: VideoFormat): number {
  switch (format) {
    case '9:16':
      return 28;
    case '1:1':
      return 24;
    default:
      return 26;
  }
}

// ─── Container entry animation ────────────────────────────────────────────────

interface ContainerAnimation {
  opacity: number;
  translateX: number;
}

function computeContainerAnimation(
  animation: LowerThirdAnimation,
  position: 'bottom-left' | 'bottom-right',
  frame: number,
  fps: number,
  reducedMotion: boolean
): ContainerAnimation {
  const relativeFrame = Math.max(0, frame);

  if (reducedMotion || animation === 'fade') {
    const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateX: 0 };
  }

  if (animation === 'slide-in') {
    // Slides in from the side based on position
    const direction = position === 'bottom-left' ? -1 : 1;
    const translateX = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 150, damping: 16, mass: 1 },
      from: 120 * direction,
      to: 0
    });
    const opacity = interpolate(relativeFrame, [0, 12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateX };
  }

  if (animation === 'wipe') {
    // Wipe: elements fade in sequentially; container itself doesn't translate
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity, translateX: 0 };
  }

  // Fallback: fade
  const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return { opacity, translateX: 0 };
}

// ─── Text animation per mode ──────────────────────────────────────────────────

function getTitleAnimation(
  animation: LowerThirdAnimation
): 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' {
  switch (animation) {
    case 'slide-in':
      return 'slide-up';
    case 'wipe':
      return 'slide-left';
    case 'fade':
      return 'fade-in';
    default:
      return 'slide-up';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LowerThird: React.FC<LowerThirdProps> = ({
  title,
  subtitle,
  barColor,
  position,
  animation,
  duration,
  format,
  brandConfig
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reducedMotion = prefersReducedMotion();

  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';
  const textColor = brandConfig?.tokens.colors.textInverse ?? '#FFFFFF';
  const barDims = getBarDimensions(format);
  const titleFontSize = getTitleFontSize(format);
  const subtitleFontSize = getSubtitleFontSize(format);
  const titleAnimation = getTitleAnimation(animation);

  const { opacity, translateX } = computeContainerAnimation(
    animation,
    position,
    frame,
    fps,
    reducedMotion
  );

  // Padding from edge
  const edgePadding = format === '9:16' ? 40 : 32;
  const bottomPadding = format === '9:16' ? 80 : 60;

  // Horizontal alignment
  const isLeft = position === 'bottom-left';
  const positionStyle: React.CSSProperties = isLeft
    ? { left: edgePadding }
    : { right: edgePadding };
  const textAlign: 'left' | 'right' = isLeft ? 'left' : 'right';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: bottomPadding,
    ...positionStyle,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: isLeft ? 'flex-start' : 'flex-end',
    opacity,
    transform: `translateX(${translateX}px)`,
    transformOrigin: 'left center'
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={containerStyle}>
        {/* Accent bar */}
        <ShapeElement
          type="rectangle"
          color={barColor}
          width={barDims.width}
          height={barDims.height}
          animation={animation === 'wipe' ? 'scale-up' : 'scale-up'}
          opacity={1}
          delay={BAR_DELAY}
          format={format}
          brandConfig={brandConfig}
        />

        {/* Title */}
        <TextBlock
          content={title}
          fontFamily={fontFamily}
          fontSize={titleFontSize}
          fontWeight={700}
          color={textColor}
          animation={titleAnimation}
          delay={TITLE_DELAY}
          duration={20}
          textAlign={textAlign}
          format={format}
          brandConfig={brandConfig}
        />

        {/* Subtitle — optional */}
        {subtitle !== undefined && (
          <TextBlock
            content={subtitle}
            fontFamily={fontFamily}
            fontSize={subtitleFontSize}
            fontWeight={400}
            color={textColor}
            animation="fade-in"
            delay={SUBTITLE_DELAY}
            duration={18}
            textAlign={textAlign}
            format={format}
            brandConfig={brandConfig}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
