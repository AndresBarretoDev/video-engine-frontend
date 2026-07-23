import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { prefersReducedMotion } from '@/remotion/utils/animation-helpers';
import { getFormatScale } from '@/remotion/utils/format-utils';
import type {
  ShapeElementProps,
  ShapeType,
  ShapeAnimation
} from './shape-element.schema';
import {
  getStarPath,
  getWavePath,
  getBlobPath,
  getWavePathLength,
  getBlobPathLength
} from './shape-utils';

// ─── Path-based shapes that support draw-in ───────────────────────────────────

const PATH_BASED_SHAPES: ReadonlySet<ShapeType> = new Set([
  'line',
  'wave',
  'blob'
]);

// ─── Animation values ─────────────────────────────────────────────────────────

interface ShapeAnimationValues {
  scale: number;
  rotate: number;
  opacity: number;
  strokeDashoffset: number | null;
  strokeDasharrayTotal: number | null;
}

function computeShapeAnimation(
  animation: ShapeAnimation,
  type: ShapeType,
  frame: number,
  fps: number,
  delay: number,
  totalFrames: number,
  scaledWidth: number,
  scaledHeight: number,
  seed: string,
  reducedMotion: boolean
): ShapeAnimationValues {
  // ── Continuous animations: rotate and pulse ignore delay ─────────────────────
  if (animation === 'rotate') {
    if (reducedMotion) {
      return {
        scale: 1,
        rotate: 0,
        opacity: 1,
        strokeDashoffset: null,
        strokeDasharrayTotal: null
      };
    }
    const rotate = interpolate(frame, [0, totalFrames], [0, 360], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      scale: 1,
      rotate,
      opacity: 1,
      strokeDashoffset: null,
      strokeDasharrayTotal: null
    };
  }

  if (animation === 'pulse') {
    if (reducedMotion) {
      return {
        scale: 1,
        rotate: 0,
        opacity: 1,
        strokeDashoffset: null,
        strokeDasharrayTotal: null
      };
    }
    // scale 1.0 → 1.05 → 1.0 using sine oscillation
    const scale = Math.sin(frame / 20) * 0.05 + 1;
    return {
      scale,
      rotate: 0,
      opacity: 1,
      strokeDashoffset: null,
      strokeDasharrayTotal: null
    };
  }

  // ── Entry animations: respect delay ──────────────────────────────────────────
  if (frame < delay) {
    return {
      scale: 0,
      rotate: 0,
      opacity: 0,
      strokeDashoffset: null,
      strokeDasharrayTotal: null
    };
  }

  const relativeFrame = frame - delay;

  if (
    animation === 'scale-up' ||
    (animation === 'draw-in' && !PATH_BASED_SHAPES.has(type))
  ) {
    // draw-in falls back to scale-up on non-path shapes (circle, rectangle, star)
    if (reducedMotion) {
      const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });
      return {
        scale: 1,
        rotate: 0,
        opacity,
        strokeDashoffset: null,
        strokeDasharrayTotal: null
      };
    }
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 150, damping: 14, mass: 1 },
      from: 0,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      scale,
      rotate: 0,
      opacity,
      strokeDashoffset: null,
      strokeDasharrayTotal: null
    };
  }

  if (animation === 'draw-in' && PATH_BASED_SHAPES.has(type)) {
    // Animate stroke-dashoffset from totalLength → 0
    let totalLength: number;
    if (type === 'line') {
      totalLength = scaledWidth;
    } else if (type === 'wave') {
      totalLength = getWavePathLength(scaledWidth, scaledHeight);
    } else {
      // blob
      totalLength = getBlobPathLength(scaledWidth, scaledHeight);
    }

    const drawDuration = 30;
    const strokeDashoffset = reducedMotion
      ? 0
      : interpolate(relativeFrame, [0, drawDuration], [totalLength, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

    const opacity = interpolate(relativeFrame, [0, 5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

    return {
      scale: 1,
      rotate: 0,
      opacity,
      strokeDashoffset,
      strokeDasharrayTotal: totalLength
    };
  }

  if (animation === 'morph') {
    // morph uses spring scale for blob; other shapes fall back to scale-up
    if (reducedMotion) {
      const opacity = interpolate(relativeFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });
      return {
        scale: 1,
        rotate: 0,
        opacity,
        strokeDashoffset: null,
        strokeDasharrayTotal: null
      };
    }
    const scale = spring({
      frame: relativeFrame,
      fps,
      config: { stiffness: 80, damping: 20, mass: 1 },
      from: 0,
      to: 1
    });
    const opacity = interpolate(relativeFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return {
      scale,
      rotate: 0,
      opacity,
      strokeDashoffset: null,
      strokeDasharrayTotal: null
    };
  }

  // Fallback: scale-up
  const scale = spring({
    frame: relativeFrame,
    fps,
    config: { stiffness: 150, damping: 14, mass: 1 },
    from: 0,
    to: 1
  });
  const opacity = interpolate(relativeFrame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return {
    scale,
    rotate: 0,
    opacity,
    strokeDashoffset: null,
    strokeDasharrayTotal: null
  };
}

// ─── SVG shape renderers ──────────────────────────────────────────────────────

interface ShapeRenderProps {
  type: ShapeType;
  scaledWidth: number;
  scaledHeight: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashoffset: number | null;
  strokeDasharrayTotal: number | null;
  seed: string;
}

function renderShape({
  type,
  scaledWidth,
  scaledHeight,
  color,
  strokeColor,
  strokeWidth,
  strokeDashoffset,
  strokeDasharrayTotal,
  seed
}: ShapeRenderProps): React.ReactElement {
  const strokeProps =
    strokeDashoffset !== null && strokeDasharrayTotal !== null
      ? {
          strokeDasharray: strokeDasharrayTotal,
          strokeDashoffset
        }
      : {};

  if (type === 'circle') {
    const cx = scaledWidth / 2;
    const cy = scaledHeight / 2;
    const r = Math.min(scaledWidth, scaledHeight) / 2;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  if (type === 'rectangle') {
    return (
      <rect
        x={0}
        y={0}
        width={scaledWidth}
        height={scaledHeight}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  if (type === 'star') {
    const cx = scaledWidth / 2;
    const cy = scaledHeight / 2;
    const outerR = Math.min(scaledWidth, scaledHeight) / 2;
    return (
      <polygon
        points={getStarPath(cx, cy, outerR)}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    );
  }

  if (type === 'line') {
    return (
      <line
        x1={0}
        y1={scaledHeight / 2}
        x2={scaledWidth}
        y2={scaledHeight / 2}
        stroke={strokeColor}
        strokeWidth={Math.max(strokeWidth, 2)}
        strokeLinecap="round"
        fill="none"
        {...strokeProps}
      />
    );
  }

  if (type === 'wave') {
    const d = getWavePath(scaledWidth, scaledHeight);
    return (
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={Math.max(strokeWidth, 2)}
        strokeLinecap="round"
        {...strokeProps}
      />
    );
  }

  if (type === 'blob') {
    const d = getBlobPath(scaledWidth, scaledHeight, seed);
    return (
      <path
        d={d}
        fill={color}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        {...strokeProps}
      />
    );
  }

  // TypeScript exhaustiveness fallback — should never reach here
  return (
    <rect x={0} y={0} width={scaledWidth} height={scaledHeight} fill={color} />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ShapeElement: React.FC<ShapeElementProps> = ({
  type,
  color,
  strokeColor,
  strokeWidth,
  width,
  height,
  animation,
  opacity: baseOpacity,
  delay,
  format
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const reducedMotion = prefersReducedMotion();

  // Format-responsive scaling
  const formatScale = getFormatScale(format);
  const scaledWidth = Math.round(width * formatScale);
  const scaledHeight = Math.round(height * formatScale);

  // Resolve stroke defaults
  const resolvedStrokeColor = strokeColor ?? color;
  const resolvedStrokeWidth =
    strokeWidth ?? (strokeColor !== undefined ? 1 : 0);

  // Use color as deterministic seed for blob path generation
  const blobSeed = color;

  const {
    scale,
    rotate,
    opacity: animOpacity,
    strokeDashoffset,
    strokeDasharrayTotal
  } = computeShapeAnimation(
    animation,
    type,
    frame,
    fps,
    delay,
    durationInFrames,
    scaledWidth,
    scaledHeight,
    blobSeed,
    reducedMotion
  );

  // Combine base opacity with animation opacity
  const finalOpacity = baseOpacity * animOpacity;

  const transforms: string[] = [];
  if (scale !== 1) transforms.push(`scale(${scale})`);
  if (rotate !== 0) transforms.push(`rotate(${rotate}deg)`);
  const transform = transforms.length > 0 ? transforms.join(' ') : 'none';

  const containerStyle: React.CSSProperties = {
    width: scaledWidth,
    height: scaledHeight,
    opacity: finalOpacity,
    transform,
    transformOrigin: 'center center',
    display: 'block',
    flexShrink: 0
  };

  return (
    <div style={containerStyle}>
      <svg
        width={scaledWidth}
        height={scaledHeight}
        viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {renderShape({
          type,
          scaledWidth,
          scaledHeight,
          color,
          strokeColor: resolvedStrokeColor,
          strokeWidth: resolvedStrokeWidth,
          strokeDashoffset,
          strokeDasharrayTotal,
          seed: blobSeed
        })}
      </svg>
    </div>
  );
};
