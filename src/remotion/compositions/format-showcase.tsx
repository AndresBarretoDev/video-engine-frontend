import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import type { TextBlockProps } from '@/remotion/components/atoms/text-block/text-block.schema';
import { TextBlockSchema } from '@/remotion/components/atoms/text-block/text-block.schema';
import type { VideoFormat } from '@/remotion/types/video-format.types';
import { FORMAT_DIMENSIONS } from '@/remotion/types/video-format.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormatShowcaseProps {
  content: string;
  fontSize: number;
  fontWeight: TextBlockProps['fontWeight'];
  color: string;
  animation: TextBlockProps['animation'];
  delay: number;
  duration: number;
}

export const formatShowcaseDefaultProps: FormatShowcaseProps = {
  content: 'Welcome to OP Video Engine',
  fontSize: 72,
  fontWeight: 700,
  color: '#FFFFFF',
  animation: 'slide-up',
  delay: 10,
  duration: 30
};

// ─── Format Panel ─────────────────────────────────────────────────────────────
// Renders a labelled miniature viewport for a given format, scaled to fit
// inside a 320px-wide column so all three fit side-by-side in a 1920×1080 frame.

const COLUMN_WIDTH = 540; // px in the 1920-wide composition
const DARK_BG = '#0a0a1a';
const LABEL_COLOR = '#6b7280';

interface FormatPanelProps {
  format: VideoFormat;
  content: string;
  fontSize: number;
  fontWeight: TextBlockProps['fontWeight'];
  color: string;
  animation: TextBlockProps['animation'];
  delay: number;
  duration: number;
}

const FormatPanel: React.FC<FormatPanelProps> = ({
  format,
  content,
  fontSize,
  fontWeight,
  color,
  animation,
  delay,
  duration
}) => {
  const dims = FORMAT_DIMENSIONS[format];
  const scale = COLUMN_WIDTH / dims.width;

  const viewportWidth = dims.width;
  const viewportHeight = dims.height;
  const scaledHeight = Math.round(viewportHeight * scale);

  const panelWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Mulish, sans-serif',
    fontSize: 24,
    fontWeight: 600,
    color: LABEL_COLOR,
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  const viewportStyle: React.CSSProperties = {
    width: COLUMN_WIDTH,
    height: scaledHeight,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)'
  };

  const innerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: viewportWidth,
    height: viewportHeight,
    backgroundColor: DARK_BG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `scale(${scale})`,
    transformOrigin: 'top left'
  };

  const textBlockProps = TextBlockSchema.parse({
    content,
    fontSize,
    fontWeight,
    color,
    animation,
    delay,
    duration,
    textAlign: 'center',
    format
  });

  return (
    <div style={panelWrapperStyle}>
      <div style={labelStyle}>{format}</div>
      <div style={viewportStyle}>
        <div style={innerStyle}>
          <TextBlock {...textBlockProps} />
        </div>
      </div>
    </div>
  );
};

// ─── FormatShowcase Composition ───────────────────────────────────────────────

const FORMATS: VideoFormat[] = ['16:9', '9:16', '1:1'];

export const FormatShowcase: React.FC<FormatShowcaseProps> = ({
  content,
  fontSize,
  fontWeight,
  color,
  animation,
  delay,
  duration
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#080810',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    padding: '40px 60px',
    boxSizing: 'border-box'
  };

  return (
    <AbsoluteFill style={containerStyle}>
      {FORMATS.map(format => (
        <FormatPanel
          key={format}
          format={format}
          content={content}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          animation={animation}
          delay={delay}
          duration={duration}
        />
      ))}
    </AbsoluteFill>
  );
};
