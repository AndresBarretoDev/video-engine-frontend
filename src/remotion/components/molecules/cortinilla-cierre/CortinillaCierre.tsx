import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LogoReveal } from '@/remotion/components/atoms/logo-reveal/LogoReveal';
import { ShapeElement } from '@/remotion/components/atoms/shape-element/ShapeElement';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import type {
  CortinillaCierreProps,
  CortinillaCierreVariant
} from './cortinilla-cierre.schema';

// ─── Default placeholder brand ────────────────────────────────────────────────

const PLACEHOLDER_LOGO = 'https://placehold.co/200x70/4361EF/white?text=BRAND';
const PLACEHOLDER_LOGO_WIDTH = 200;
const PLACEHOLDER_LOGO_HEIGHT = 70;

// ─── Variant timing ───────────────────────────────────────────────────────────

interface VariantTiming {
  logoDelay: number;
  logoDuration: number;
  ctaDelay: number;
  shapeDelay: number;
  legalDelay: number;
}

function getVariantTiming(variant: CortinillaCierreVariant): VariantTiming {
  switch (variant) {
    case 'bold':
      return {
        logoDelay: 0,
        logoDuration: 20,
        ctaDelay: 10,
        shapeDelay: 5,
        legalDelay: 30
      };
    case 'minimal':
      return {
        logoDelay: 10,
        logoDuration: 30,
        ctaDelay: 35,
        shapeDelay: 0,
        legalDelay: 50
      };
    default: // standard
      return {
        logoDelay: 5,
        logoDuration: 25,
        ctaDelay: 25,
        shapeDelay: 10,
        legalDelay: 40
      };
  }
}

// ─── Variant logo animation ────────────────────────────────────────────────────

function getLogoAnimation(
  variant: CortinillaCierreVariant
): 'scale-bounce' | 'fade-in' | 'slide-down' | 'spin-in' | 'morph' {
  switch (variant) {
    case 'bold':
      return 'scale-bounce';
    case 'minimal':
      return 'fade-in';
    default:
      return 'slide-down';
  }
}

// ─── Variant CTA animation ────────────────────────────────────────────────────

function getCtaAnimation(
  variant: CortinillaCierreVariant
): 'fade-in' | 'slide-up' | 'scale-up' | 'bounce' {
  switch (variant) {
    case 'bold':
      return 'scale-up';
    case 'minimal':
      return 'fade-in';
    default:
      return 'slide-up';
  }
}

// ─── Variant shape count ───────────────────────────────────────────────────────

function getShapeCount(variant: CortinillaCierreVariant): number {
  switch (variant) {
    case 'bold':
      return 3;
    case 'minimal':
      return 0;
    default:
      return 2;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CortinillaCierre: React.FC<CortinillaCierreProps> = ({
  brandConfig,
  ctaText,
  legalText,
  variant,
  format
}) => {
  // Resolve brand values
  const logoUrl = brandConfig?.assets.logo.url ?? PLACEHOLDER_LOGO;
  const logoWidth = brandConfig?.assets.logo.width ?? PLACEHOLDER_LOGO_WIDTH;
  const logoHeight = brandConfig?.assets.logo.height ?? PLACEHOLDER_LOGO_HEIGHT;
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';
  const secondaryColor = brandConfig?.tokens.colors.secondary ?? '#FFFFFF';
  const accentColor = brandConfig?.tokens.colors.accent ?? '#FF3B30';
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';
  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';

  const timing = getVariantTiming(variant);
  const logoAnimation = getLogoAnimation(variant);
  const ctaAnimation = getCtaAnimation(variant);
  const shapeCount = getShapeCount(variant);

  // CTA font size
  const ctaFontSize = format === '9:16' ? 52 : format === '1:1' ? 44 : 48;
  const ctaWeight: 400 | 600 | 700 | 900 = variant === 'bold' ? 900 : 700;

  // Legal font size — always small
  const legalFontSize = format === '9:16' ? 20 : 16;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Background decorative shapes */}
      {shapeCount >= 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <ShapeElement
            type="rectangle"
            color={primaryColor}
            width={600}
            height={6}
            animation="scale-up"
            opacity={variant === 'bold' ? 0.8 : 0.4}
            delay={timing.shapeDelay}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}

      {shapeCount >= 2 && (
        <div style={{ position: 'absolute', top: 40, right: 80 }}>
          <ShapeElement
            type="circle"
            color={accentColor}
            width={80}
            height={80}
            animation="pulse"
            opacity={0.5}
            delay={timing.shapeDelay + 5}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}

      {shapeCount >= 3 && (
        <div style={{ position: 'absolute', top: 60, left: 60 }}>
          <ShapeElement
            type="star"
            color={secondaryColor}
            width={60}
            height={60}
            animation="rotate"
            opacity={0.6}
            delay={timing.shapeDelay + 10}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}

      {/* Main content: logo + CTA + legal */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          paddingBottom: legalText !== undefined ? 60 : 0
        }}
      >
        {/* Logo at top of centered group */}
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

        {/* CTA text */}
        <TextBlock
          content={ctaText}
          fontFamily={fontFamily}
          fontSize={ctaFontSize}
          fontWeight={ctaWeight}
          color={secondaryColor}
          animation={ctaAnimation}
          delay={timing.ctaDelay}
          duration={20}
          textAlign="center"
          format={format}
          brandConfig={brandConfig}
        />
      </AbsoluteFill>

      {/* Legal text — bottom of screen, small */}
      {legalText !== undefined && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <TextBlock
            content={legalText}
            fontFamily={fontFamily}
            fontSize={legalFontSize}
            fontWeight={400}
            color={secondaryColor}
            animation="fade-in"
            delay={timing.legalDelay}
            duration={20}
            textAlign="center"
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
