import React from 'react';
import { AbsoluteFill } from 'remotion';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { PricePatch } from '@/remotion/components/atoms/price-patch/PricePatch';
import { LogoReveal } from '@/remotion/components/atoms/logo-reveal/LogoReveal';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { ShapeElement } from '@/remotion/components/atoms/shape-element/ShapeElement';
import { SubtitleTrack } from '@/remotion/components/atoms/subtitle-track/SubtitleTrack';
import type { TextBlockProps } from '@/remotion/components/atoms/text-block/text-block.schema';
import type { PricePatchProps } from '@/remotion/components/atoms/price-patch/price-patch.schema';
import type { LogoRevealProps } from '@/remotion/components/atoms/logo-reveal/logo-reveal.schema';
import type { ImageFrameProps } from '@/remotion/components/atoms/image-frame/image-frame.schema';
import type { ShapeElementProps } from '@/remotion/components/atoms/shape-element/shape-element.schema';
import type { SubtitleTrackProps } from '@/remotion/components/atoms/subtitle-track/subtitle-track.schema';

// ─── Shared dark background ────────────────────────────────────────────────────

const DARK_BG = '#0a0a1a';

const darkFill: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: DARK_BG,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// ─── TextBlock Preview ────────────────────────────────────────────────────────

export const textBlockDefaultProps: TextBlockProps = {
  content: 'Welcome to OP Video Engine',
  fontFamily: 'Mulish, sans-serif',
  fontSize: 72,
  fontWeight: 700,
  color: '#FFFFFF',
  animation: 'slide-up',
  delay: 10,
  duration: 30,
  textAlign: 'center',
  format: '16:9'
};

export const TextBlockPreview: React.FC<TextBlockProps> = props => {
  return (
    <AbsoluteFill style={darkFill}>
      <TextBlock {...props} />
    </AbsoluteFill>
  );
};

// ─── PricePatch Preview ───────────────────────────────────────────────────────

export const pricePatchDefaultProps: PricePatchProps = {
  price: '29.99',
  originalPrice: '49.99',
  currency: '$',
  backgroundColor: '#FF3B30',
  textColor: '#FFFFFF',
  size: 'large',
  animation: 'pop',
  delay: 10,
  format: '16:9'
};

export const PricePatchPreview: React.FC<PricePatchProps> = props => {
  return (
    <AbsoluteFill style={darkFill}>
      <PricePatch {...props} />
    </AbsoluteFill>
  );
};

// ─── LogoReveal Preview ───────────────────────────────────────────────────────

export const logoRevealDefaultProps: LogoRevealProps = {
  logoUrl: 'https://placehold.co/200x80/4361EF/white?text=BRAND+LOGO',
  width: 200,
  height: 80,
  animation: 'scale-bounce',
  delay: 10,
  duration: 30,
  format: '16:9'
};

export const LogoRevealPreview: React.FC<LogoRevealProps> = props => {
  return (
    <AbsoluteFill style={darkFill}>
      <LogoReveal {...props} />
    </AbsoluteFill>
  );
};

// ─── ImageFrame Preview ───────────────────────────────────────────────────────

export const imageFrameDefaultProps: ImageFrameProps = {
  src: 'https://placehold.co/800x600/1a1a2e/white?text=Product+Image',
  width: 800,
  height: 600,
  objectFit: 'cover',
  animation: 'ken-burns',
  borderRadius: 12,
  shadow: true,
  delay: 0,
  format: '16:9'
};

export const ImageFramePreview: React.FC<ImageFrameProps> = props => {
  return (
    <AbsoluteFill style={darkFill}>
      <ImageFrame {...props} />
    </AbsoluteFill>
  );
};

// ─── ShapeElement Preview ─────────────────────────────────────────────────────

export const shapeElementDefaultProps: ShapeElementProps = {
  type: 'star',
  color: '#9B59B6',
  strokeColor: '#D7BDE2',
  strokeWidth: 2,
  width: 200,
  height: 200,
  animation: 'scale-up',
  opacity: 1,
  delay: 10,
  format: '16:9'
};

export const ShapeElementPreview: React.FC<ShapeElementProps> = props => {
  return (
    <AbsoluteFill style={darkFill}>
      <ShapeElement {...props} />
    </AbsoluteFill>
  );
};

// ─── SubtitleTrack Preview ────────────────────────────────────────────────────

export const subtitleTrackDefaultProps: SubtitleTrackProps = {
  segments: [
    { text: 'Welcome to OP Video Engine', startFrame: 0, endFrame: 45 },
    {
      text: 'Automated video generation at scale',
      startFrame: 50,
      endFrame: 95
    },
    { text: 'Powered by Remotion', startFrame: 100, endFrame: 145 }
  ],
  fontFamily: 'Mulish, sans-serif',
  fontSize: 36,
  color: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  position: 'bottom',
  animation: 'slide-up',
  format: '16:9'
};

export const SubtitleTrackPreview: React.FC<SubtitleTrackProps> = props => {
  return (
    <AbsoluteFill style={{ ...darkFill, position: 'relative' }}>
      <SubtitleTrack {...props} />
    </AbsoluteFill>
  );
};

// ─── VideoClip Preview ────────────────────────────────────────────────────────
// VideoClip requires a real video URL to preview — registered in index.tsx with a placeholder comment.
// No preview component exported here to avoid loading errors in Remotion Studio.

// ─── AudioTrack Preview ───────────────────────────────────────────────────────
// AudioTrack has no visual output — not suitable for a visual preview composition.
// Verified via Remotion's timeline audio visualizer in a real composition.
