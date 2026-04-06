import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
  interpolate
} from 'remotion';
import type { BrandConfig } from '@/remotion/types/brand-config.types';
import type { VideoFormat } from '@/remotion/types/video-format.types';
import { prefersReducedMotion } from '@/remotion/utils/animation-helpers';
import { getResponsiveFontSize } from '@/remotion/utils/format-utils';
import type {
  SubtitleTrackProps,
  SubtitleSegment,
  SubtitleAnimation
} from './subtitle-track.schema';

// ─── Format responsive config ─────────────────────────────────────────────────

interface FormatConfig {
  fontSizeMultiplier: number;
  maxWidthPercent: number;
}

const FORMAT_CONFIG: Record<VideoFormat, FormatConfig> = {
  '16:9': { fontSizeMultiplier: 1.0, maxWidthPercent: 80 },
  '9:16': { fontSizeMultiplier: 1.3, maxWidthPercent: 90 },
  '1:1': { fontSizeMultiplier: 1.1, maxWidthPercent: 85 }
};

// ─── Position mapping ─────────────────────────────────────────────────────────

interface PositionStyles {
  top?: string;
  bottom?: string;
  alignItems: 'flex-start' | 'flex-end' | 'center';
  justifyContent: 'flex-start' | 'flex-end' | 'center';
}

function getPositionStyles(
  position: 'bottom' | 'top' | 'center'
): PositionStyles {
  if (position === 'bottom') {
    return {
      alignItems: 'flex-end',
      justifyContent: 'center'
    };
  }
  if (position === 'top') {
    return {
      alignItems: 'flex-start',
      justifyContent: 'center'
    };
  }
  return {
    alignItems: 'center',
    justifyContent: 'center'
  };
}

// ─── Brand resolution ─────────────────────────────────────────────────────────

interface ResolvedBrandStyles {
  fontFamily: string;
  springConfig: { damping: number; stiffness: number; mass: number };
}

function resolveBrandStyles(brandConfig?: BrandConfig): ResolvedBrandStyles {
  if (!brandConfig) {
    return {
      fontFamily: 'Mulish, sans-serif',
      springConfig: { damping: 14, stiffness: 150, mass: 1 }
    };
  }
  return {
    fontFamily: brandConfig.tokens.fonts.body.family,
    springConfig: brandConfig.tokens.animation.springConfig
  };
}

// ─── Segment animation ────────────────────────────────────────────────────────

interface SegmentAnimationValues {
  opacity: number;
  transform: string;
}

function computeSegmentAnimation(
  animation: SubtitleAnimation,
  segmentFrame: number,
  segmentDuration: number,
  fps: number,
  springConfig: { damping: number; stiffness: number; mass: number },
  reducedMotion: boolean
): SegmentAnimationValues {
  const FADE_FRAMES = 5;
  const SLIDE_FRAMES = 8;
  const POP_FRAMES = 6;

  // Exit fade (last 5 frames of any segment)
  const exitStart = segmentDuration - FADE_FRAMES;
  const isExiting = segmentFrame >= exitStart;
  const exitOpacity = isExiting
    ? interpolate(segmentFrame, [exitStart, segmentDuration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    : 1;

  if (animation === 'fade' || reducedMotion) {
    const entryOpacity = interpolate(segmentFrame, [0, FADE_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const opacity = Math.min(entryOpacity, exitOpacity);
    return { opacity, transform: 'none' };
  }

  if (animation === 'slide-up') {
    const translateY = spring({
      frame: segmentFrame,
      fps,
      config: springConfig,
      from: 20,
      to: 0
    });
    const entryOpacity = interpolate(segmentFrame, [0, SLIDE_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const opacity = Math.min(entryOpacity, exitOpacity);
    return { opacity, transform: `translateY(${translateY}px)` };
  }

  if (animation === 'pop') {
    const scale = spring({
      frame: segmentFrame,
      fps,
      config: springConfig,
      from: 0.8,
      to: 1
    });
    const entryOpacity = interpolate(segmentFrame, [0, POP_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    const opacity = Math.min(entryOpacity, exitOpacity);
    return { opacity, transform: `scale(${scale})` };
  }

  // Fallback: fade
  const entryOpacity = interpolate(segmentFrame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const opacity = Math.min(entryOpacity, exitOpacity);
  return { opacity, transform: 'none' };
}

// ─── Single segment renderer ──────────────────────────────────────────────────

interface SegmentDisplayProps {
  segment: SubtitleSegment;
  text: string;
  fontFamily: string;
  scaledFontSize: number;
  color: string;
  backgroundColor?: string;
  position: 'bottom' | 'top' | 'center';
  maxWidthPercent: number;
  animation: SubtitleAnimation;
  fps: number;
  springConfig: { damping: number; stiffness: number; mass: number };
  reducedMotion: boolean;
}

const SegmentDisplay: React.FC<SegmentDisplayProps> = ({
  segment,
  text,
  fontFamily,
  scaledFontSize,
  color,
  backgroundColor,
  position,
  maxWidthPercent,
  animation,
  fps,
  springConfig,
  reducedMotion
}) => {
  const segmentFrame = useCurrentFrame();
  const segmentDuration = segment.endFrame - segment.startFrame;

  const { opacity, transform } = computeSegmentAnimation(
    animation,
    segmentFrame,
    segmentDuration,
    fps,
    springConfig,
    reducedMotion
  );

  const positionStyles = getPositionStyles(position);

  const POSITION_PADDING = '10%';

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: positionStyles.alignItems,
    justifyContent: positionStyles.justifyContent,
    paddingBottom: position === 'bottom' ? POSITION_PADDING : undefined,
    paddingTop: position === 'top' ? POSITION_PADDING : undefined,
    pointerEvents: 'none'
  };

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize: scaledFontSize,
    color,
    backgroundColor,
    opacity,
    transform,
    transformOrigin: 'center center',
    maxWidth: `${maxWidthPercent}%`,
    textAlign: 'center',
    lineHeight: 1.3,
    padding: backgroundColor !== undefined ? '0.2em 0.6em' : undefined,
    borderRadius: backgroundColor !== undefined ? '0.25em' : undefined,
    overflowWrap: 'break-word',
    wordBreak: 'break-word'
  };

  return (
    <div style={containerStyle}>
      <span style={textStyle}>{text}</span>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({
  segments,
  fontFamily,
  fontSize,
  color,
  backgroundColor,
  position,
  animation,
  format,
  brandConfig
}) => {
  const { fps } = useVideoConfig();
  const reducedMotion = prefersReducedMotion();

  const brand = resolveBrandStyles(brandConfig);
  const resolvedFontFamily =
    fontFamily !== 'Mulish, sans-serif' ? fontFamily : brand.fontFamily;

  const formatConfig = FORMAT_CONFIG[format];
  const scaledFontSize = Math.round(
    getResponsiveFontSize(fontSize, format) * formatConfig.fontSizeMultiplier
  );

  // Sort segments defensively by startFrame
  const sortedSegments = [...segments].sort(
    (a, b) => a.startFrame - b.startFrame
  );

  return (
    <>
      {sortedSegments.map((segment, index) => {
        const durationInFrames = segment.endFrame - segment.startFrame;
        return (
          <Sequence
            key={index}
            from={segment.startFrame}
            durationInFrames={durationInFrames}
          >
            <SegmentDisplay
              segment={segment}
              text={segment.text}
              fontFamily={resolvedFontFamily}
              scaledFontSize={scaledFontSize}
              color={color}
              backgroundColor={backgroundColor}
              position={position}
              maxWidthPercent={formatConfig.maxWidthPercent}
              animation={animation}
              fps={fps}
              springConfig={brand.springConfig}
              reducedMotion={reducedMotion}
            />
          </Sequence>
        );
      })}
    </>
  );
};
