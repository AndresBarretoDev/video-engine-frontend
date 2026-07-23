import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { LogoReveal } from '@/remotion/components/atoms/logo-reveal/LogoReveal';
import { ShapeElement } from '@/remotion/components/atoms/shape-element/ShapeElement';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { AudioTrack } from '@/remotion/components/atoms/audio-track/AudioTrack';
import type {
  CortinillaEntradaProps,
  CortinillaEntradaVariant
} from './cortinilla-entrada.schema';

// ─── Default placeholder brand ────────────────────────────────────────────────

const PLACEHOLDER_LOGO = 'https://placehold.co/240x80/4361EF/white?text=BRAND';
const PLACEHOLDER_LOGO_WIDTH = 240;
const PLACEHOLDER_LOGO_HEIGHT = 80;

// ─── Variant timing configs ────────────────────────────────────────────────────

interface VariantTiming {
  logoDelay: number;
  logoDuration: number;
  claimDelay: number;
  shapeDelays: number[];
}

function getVariantTiming(variant: CortinillaEntradaVariant): VariantTiming {
  // All timing in frames
  switch (variant) {
    case 'minimal':
      return {
        logoDelay: 5,
        logoDuration: 25,
        claimDelay: 30,
        shapeDelays: []
      };
    case 'energetic':
      return {
        logoDelay: 0,
        logoDuration: 20,
        claimDelay: 20,
        shapeDelays: [5, 10, 15]
      };
    case 'elegant':
      return {
        logoDelay: 8,
        logoDuration: 35,
        claimDelay: 40,
        shapeDelays: [0, 15]
      };
    default:
      return {
        logoDelay: 5,
        logoDuration: 25,
        claimDelay: 30,
        shapeDelays: []
      };
  }
}

// ─── Variant logo animation ────────────────────────────────────────────────────

function getLogoAnimation(
  variant: CortinillaEntradaVariant
): 'scale-bounce' | 'fade-in' | 'slide-down' | 'spin-in' | 'morph' {
  switch (variant) {
    case 'minimal':
      return 'fade-in';
    case 'energetic':
      return 'scale-bounce';
    case 'elegant':
      return 'morph';
    default:
      return 'fade-in';
  }
}

// ─── Variant claim animation ───────────────────────────────────────────────────

function getClaimAnimation(
  variant: CortinillaEntradaVariant
): 'fade-in' | 'slide-up' | 'bounce' {
  switch (variant) {
    case 'minimal':
      return 'slide-up';
    case 'energetic':
      return 'bounce';
    case 'elegant':
      return 'fade-in';
    default:
      return 'slide-up';
  }
}

// ─── Variant shape configs ─────────────────────────────────────────────────────

interface ShapeConfig {
  type: 'circle' | 'rectangle' | 'star' | 'line' | 'wave' | 'blob';
  color: string;
  width: number;
  height: number;
  animation: 'scale-up' | 'rotate' | 'pulse' | 'draw-in' | 'morph';
  opacity: number;
  style: React.CSSProperties;
}

function getShapeConfigs(
  variant: CortinillaEntradaVariant,
  primaryColor: string,
  secondaryColor: string
): ShapeConfig[] {
  switch (variant) {
    case 'energetic':
      return [
        {
          type: 'circle',
          color: primaryColor,
          width: 120,
          height: 120,
          animation: 'scale-up',
          opacity: 0.6,
          style: { position: 'absolute', top: 60, left: 80 }
        },
        {
          type: 'star',
          color: secondaryColor,
          width: 80,
          height: 80,
          animation: 'rotate',
          opacity: 0.8,
          style: { position: 'absolute', bottom: 100, right: 120 }
        },
        {
          type: 'rectangle',
          color: primaryColor,
          width: 200,
          height: 8,
          animation: 'scale-up',
          opacity: 0.5,
          style: { position: 'absolute', bottom: 80, left: 0 }
        }
      ];
    case 'elegant':
      return [
        {
          type: 'wave',
          color: primaryColor,
          strokeColor: primaryColor,
          width: 400,
          height: 60,
          animation: 'draw-in',
          opacity: 0.3,
          style: {
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)'
          }
        } as ShapeConfig,
        {
          type: 'circle',
          color: secondaryColor,
          width: 300,
          height: 300,
          animation: 'pulse',
          opacity: 0.08,
          style: { position: 'absolute', top: -80, right: -80 }
        }
      ];
    default:
      return [];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CortinillaEntrada: React.FC<CortinillaEntradaProps> = ({
  brandConfig,
  claim,
  variant,
  format
}) => {
  const { fps } = useVideoConfig();

  // Resolve brand values
  const logoUrl = brandConfig?.assets.logo.url ?? PLACEHOLDER_LOGO;
  const logoWidth = brandConfig?.assets.logo.width ?? PLACEHOLDER_LOGO_WIDTH;
  const logoHeight = brandConfig?.assets.logo.height ?? PLACEHOLDER_LOGO_HEIGHT;
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';
  const secondaryColor = brandConfig?.tokens.colors.secondary ?? '#FFFFFF';
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';
  const jingleUrl = brandConfig?.assets.jingle;

  const timing = getVariantTiming(variant);
  const logoAnimation = getLogoAnimation(variant);
  const claimAnimation = getClaimAnimation(variant);
  const shapeConfigs = getShapeConfigs(variant, primaryColor, secondaryColor);
  const shapeDelays = timing.shapeDelays;

  // Background color
  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';

  // Claim font size — responsive
  const claimFontSize = format === '9:16' ? 42 : format === '1:1' ? 36 : 32;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Decorative shapes — rendered behind logo */}
      {shapeConfigs.map((shape, idx) => (
        <div key={idx} style={{ position: 'absolute', ...shape.style }}>
          <ShapeElement
            type={shape.type}
            color={shape.color}
            strokeColor={
              (shape as ShapeConfig & { strokeColor?: string }).strokeColor ??
              shape.color
            }
            width={shape.width}
            height={shape.height}
            animation={shape.animation}
            opacity={shape.opacity}
            delay={shapeDelays[idx] ?? 0}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      ))}

      {/* Logo — centered */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24
        }}
      >
        <LogoReveal
          logoUrl={logoUrl}
          width={logoWidth}
          height={logoHeight}
          animation={logoAnimation}
          delay={timing.logoDelay}
          duration={timing.logoDuration}
          format={format}
          brandConfig={brandConfig}
        />

        {/* Claim text — optional, below logo */}
        {claim !== undefined && claim.length > 0 && (
          <TextBlock
            content={claim}
            fontFamily={fontFamily}
            fontSize={claimFontSize}
            fontWeight={400}
            color={secondaryColor}
            animation={claimAnimation}
            delay={timing.claimDelay}
            duration={20}
            textAlign="center"
            format={format}
            brandConfig={brandConfig}
          />
        )}
      </AbsoluteFill>

      {/* Jingle audio — plays from frame 0 if brandConfig has it */}
      {jingleUrl !== undefined && (
        <AudioTrack
          src={jingleUrl}
          volume={1}
          fadeInDuration={0}
          fadeOutDuration={Math.round(fps * 0.5)}
          startFrom={0}
          loop={false}
        />
      )}
    </AbsoluteFill>
  );
};
