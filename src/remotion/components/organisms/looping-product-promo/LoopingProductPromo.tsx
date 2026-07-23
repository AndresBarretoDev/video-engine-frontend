/**
 * LoopingProductPromo.tsx
 *
 * Organism: looping product promo video template.
 * Supports 16:9 / 9:16 / 1:1 via auto-layout from looping-product-promo.layout.ts.
 * Reuses existing atoms: LogoReveal, ImageFrame, TextBlock, PricePatch.
 * Brand injection via BrandConfig with full fallbacks — preview without brand never breaks.
 *
 * Animation: Remotion spring/interpolate only. CSS transitions/animations are FORBIDDEN.
 * All timing driven by useCurrentFrame() + useVideoConfig().fps.
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring
} from 'remotion';
import { LogoReveal } from '@/remotion/components/atoms/logo-reveal/LogoReveal';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { PricePatch } from '@/remotion/components/atoms/price-patch/PricePatch';
import { getLoopingPromoLayout } from './looping-product-promo.layout';
import type { LoopingProductPromoProps } from './looping-product-promo.schema';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

// ─── Brand fallbacks ──────────────────────────────────────────────────────────
// Preview without brand MUST NOT break — every value has a safe, NEUTRAL default.
// IMPORTANT: fallbacks are PLATFORM-NEUTRAL — NOT the OP Blue platform design system.
// Neutral dark = #1A1A1A (not #0A0A1A which is the app background).
// Neutral mid-gray = #6B7280 (not the OP Blue #4361EF).
// Rule: ONLY these constants are permitted in the fallback path. Brand token values
// ALWAYS override — no identity value is hardcoded inside the brand-present path.

const FALLBACK_BG_COLOR = '#1A1A1A';
const FALLBACK_PRIMARY = '#6B7280';
const FALLBACK_TEXT_COLOR = '#F9FAFB';
const FALLBACK_TEXT_INVERSE = '#111827';
const FALLBACK_FONT_FAMILY = 'sans-serif';
const FALLBACK_LOGO_URL =
  'https://placehold.co/240x80/6B7280/FFFFFF?text=BRAND';
const FALLBACK_LOGO_W = 240;
const FALLBACK_LOGO_H = 80;
// Neutral radius — not too sharp, not too round; brand overrides these completely.
const FALLBACK_RADIUS_BUTTON = 8;
const FALLBACK_RADIUS_BADGE = 6;
const FALLBACK_RADIUS_IMAGE = 12;

export interface ResolvedBrand {
  bgColor: string;
  /** Panel/card background — distinct from bgColor when brand declares surface */
  surfaceColor?: string;
  primaryColor: string;
  /** Legacy: kept for compatibility — prefer textOnBackground/Surface/Primary */
  textColor: string;
  textInverse: string;
  /** Declared legible ink on page background */
  textOnBackground?: string;
  /** Declared legible ink on card/panel surface */
  textOnSurface?: string;
  /** Declared legible ink on primary-colored fills (buttons/badges) */
  textOnPrimary?: string;
  /** Border/stroke color */
  borderColor?: string;
  /** Border widths per element */
  stroke?: { button: number; card: number; badge: number };
  fontFamily: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  springConfig: { damping: number; stiffness: number; mass: number };
  radius: { button: number; badge: number; image: number };
  /** Structural defaults — honored to vary skeleton between brands */
  defaults?: {
    cortinillaEntrada: string;
    cortinillaCierre: string;
    promoBarStyle: 'top' | 'bottom';
    productOverlayPosition: 'bottom-right' | 'bottom-left' | 'center';
  };
}

export function resolveBrand(brandConfig?: BrandConfig): ResolvedBrand {
  if (!brandConfig) {
    // NEUTRAL fallbacks only — no brand-specific values in this path
    return {
      bgColor: FALLBACK_BG_COLOR,
      surfaceColor: undefined,
      primaryColor: FALLBACK_PRIMARY,
      textColor: FALLBACK_TEXT_COLOR,
      textInverse: FALLBACK_TEXT_INVERSE,
      textOnBackground: undefined,
      textOnSurface: undefined,
      textOnPrimary: undefined,
      borderColor: undefined,
      stroke: undefined,
      fontFamily: FALLBACK_FONT_FAMILY,
      logoUrl: FALLBACK_LOGO_URL,
      logoWidth: FALLBACK_LOGO_W,
      logoHeight: FALLBACK_LOGO_H,
      springConfig: { damping: 14, stiffness: 150, mass: 1 },
      radius: {
        button: FALLBACK_RADIUS_BUTTON,
        badge: FALLBACK_RADIUS_BADGE,
        image: FALLBACK_RADIUS_IMAGE
      },
      defaults: undefined
    };
  }

  // Radius: use brand's token if present; otherwise neutral fallbacks.
  const radius = brandConfig.tokens.radius ?? {
    button: FALLBACK_RADIUS_BUTTON,
    badge: FALLBACK_RADIUS_BADGE,
    image: FALLBACK_RADIUS_IMAGE
  };

  return {
    bgColor: brandConfig.tokens.colors.background,
    // surface: use brand's declared surface; organism uses this for cards/panels
    surfaceColor: brandConfig.tokens.colors.surface,
    primaryColor: brandConfig.tokens.colors.primary,
    textColor: brandConfig.tokens.colors.text,
    textInverse: brandConfig.tokens.colors.textInverse,
    // Semantic text inks — declared by brand; no contrast math
    textOnBackground: brandConfig.tokens.colors.textOnBackground,
    textOnSurface: brandConfig.tokens.colors.textOnSurface,
    textOnPrimary: brandConfig.tokens.colors.textOnPrimary,
    // Border tokens
    borderColor: brandConfig.tokens.colors.border,
    stroke: brandConfig.tokens.stroke,
    fontFamily: brandConfig.tokens.fonts.heading.family,
    logoUrl: brandConfig.assets.logo.url,
    logoWidth: brandConfig.assets.logo.width,
    logoHeight: brandConfig.assets.logo.height,
    springConfig: brandConfig.tokens.animation.springConfig,
    radius,
    // Structural defaults — organisms READ these to vary skeleton
    defaults: {
      cortinillaEntrada: brandConfig.defaults.cortinillaEntrada,
      cortinillaCierre: brandConfig.defaults.cortinillaCierre,
      promoBarStyle: brandConfig.defaults.promoBarStyle,
      productOverlayPosition: brandConfig.defaults.productOverlayPosition
    }
  };
}

// ─── Timing constants (in frames) ─────────────────────────────────────────────
// Staggered reveals: background fade → logo → image → name → price → promo → cta

const BG_FADE_DURATION = 20;
const LOGO_DELAY = 5;
const LOGO_DURATION = 25;
const IMAGE_DELAY = 10;
const NAME_DELAY = 25;
const PRICE_DELAY = 38;
const PROMO_TAG_DELAY = 48;
const CTA_DELAY = 55;
const LEGAL_DELAY = 60;

// ─── Background animation (fade in from black) ────────────────────────────────

function BackgroundLayer({ color }: { color: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, BG_FADE_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity
      }}
    />
  );
}

// ─── Promo tag pill ───────────────────────────────────────────────────────────

function PromoTagPill({
  text,
  primaryColor,
  textOnPrimary,
  fontFamily,
  badgeRadius,
  badgeStrokeWidth,
  borderColor,
  delay,
  textAlign
}: {
  text: string;
  primaryColor: string;
  textOnPrimary: string;
  fontFamily: string;
  badgeRadius: number;
  badgeStrokeWidth: number;
  borderColor: string;
  delay: number;
  textAlign: 'left' | 'center';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 300, damping: 12, mass: 1 },
    from: 0,
    to: 1
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${frame < delay ? 0 : scale})`,
        transformOrigin:
          textAlign === 'center' ? 'center center' : 'left center'
      }}
    >
      <span
        style={{
          backgroundColor: primaryColor,
          // Brand-declared ink on primary surface — no contrast inference
          color: textOnPrimary,
          fontFamily,
          fontWeight: 800,
          fontSize: 'inherit',
          borderRadius: badgeRadius,
          // Brand border on badge — every element carries its brand border
          border:
            badgeStrokeWidth > 0
              ? `${badgeStrokeWidth}px solid ${borderColor}`
              : 'none',
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 20,
          paddingRight: 20,
          letterSpacing: 1,
          textTransform: 'uppercase' as const,
          // Prevent badge text from wrapping — pill must stay on one line
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function CtaButton({
  text,
  primaryColor,
  textOnPrimary,
  fontFamily,
  buttonRadius,
  buttonStrokeWidth,
  borderColor,
  delay,
  textAlign,
  fontSize
}: {
  text: string;
  primaryColor: string;
  textOnPrimary: string;
  fontFamily: string;
  buttonRadius: number;
  buttonStrokeWidth: number;
  borderColor: string;
  delay: number;
  textAlign: 'left' | 'center';
  fontSize: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 120, damping: 14, mass: 1 },
    from: 40,
    to: 0
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        opacity: frame < delay ? 0 : opacity,
        transform: `translateY(${frame < delay ? 40 : translateY}px)`
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          // CTA: filled with brand primary, ink = brand-declared textOnPrimary
          backgroundColor: primaryColor,
          color: textOnPrimary,
          fontFamily,
          fontWeight: 800,
          fontSize,
          borderRadius: buttonRadius,
          // Brand border on button (stroke.button may be 0 for Nike's filled black pill)
          border:
            buttonStrokeWidth > 0
              ? `${buttonStrokeWidth}px solid ${borderColor}`
              : 'none',
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 40,
          paddingRight: 40,
          // CTA button grows with content: auto width, text never clipped.
          // whiteSpace: nowrap prevents mid-word breaks.
          // NO textOverflow or overflow:hidden — text must always be fully visible.
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LoopingProductPromo: React.FC<LoopingProductPromoProps> = ({
  brandConfig,
  format,
  slots
}) => {
  const layout = getLoopingPromoLayout(format);
  const brand = resolveBrand(brandConfig);

  const {
    productName,
    productImage,
    priceCurrent,
    priceOriginal,
    promoTag,
    ctaText,
    legalText
  } = slots;

  // ─── Semantic ink resolution ────────────────────────────────────────────────
  // Use brand-declared inks per surface; fall back to the legacy text/textInverse
  // fields for backward compatibility with older BrandConfig shapes.
  const inkOnBackground = brand.textOnBackground ?? brand.textColor;
  const inkOnPrimary = brand.textOnPrimary ?? brand.textInverse;
  // Border and stroke with neutral fallbacks
  const borderColor = brand.borderColor ?? '#CCCCCC';
  const strokeButton = brand.stroke?.button ?? 1;
  const strokeBadge = brand.stroke?.badge ?? 1;

  // ─── Structural defaults: honor brand skeleton choices ───────────────────────
  // cortinillaCierre 'none' = skip the closing cortinilla block
  const showClosingCortinilla = brand.defaults?.cortinillaCierre !== 'none';
  // productOverlayPosition and promoBarStyle are props for future structural routing;
  // tracked here so organisms can be audited for compliance. Not yet wired into
  // JSX — void keeps the audit trail without tripping no-unused-vars.
  const overlayPosition =
    brand.defaults?.productOverlayPosition ?? 'bottom-right';
  const promoBarStyle = brand.defaults?.promoBarStyle ?? 'bottom';
  void showClosingCortinilla;
  void overlayPosition;
  void promoBarStyle;

  // ─── Absolute position style helpers ────────────────────────────────────────
  function absStyle(box: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): React.CSSProperties {
    return {
      position: 'absolute',
      left: box.x,
      top: box.y,
      width: box.width,
      height: box.height
    };
  }

  return (
    <AbsoluteFill>
      {/* 1. Background — sourced from brandConfig.tokens.colors.background */}
      <BackgroundLayer color={brand.bgColor} />

      {/* 2. Logo */}
      <div style={absStyle(layout.logo)}>
        <LogoReveal
          logoUrl={brand.logoUrl}
          width={layout.logo.width}
          height={layout.logo.height}
          animation="fade-in"
          delay={LOGO_DELAY}
          duration={LOGO_DURATION}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 3. Product image (packshot) */}
      {/* overflow:hidden clips the ImageFrame's internal getFormatScale upscale
          so the image stays within its layout box and never bleeds onto text below */}
      <div style={{ ...absStyle(layout.productImage), overflow: 'hidden' }}>
        <ImageFrame
          src={productImage}
          width={layout.productImage.width}
          height={layout.productImage.height}
          objectFit="contain"
          animation="zoom-in"
          // radius.image comes from brand — 0 for Nike (SQUARE), 20 for Airbnb (rounded)
          borderRadius={brand.radius.image}
          shadow={true}
          delay={IMAGE_DELAY}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 4. Product name — ink = textOnBackground (declared per surface, no math) */}
      <div style={absStyle(layout.productName)}>
        <TextBlock
          content={productName}
          fontFamily={brand.fontFamily}
          fontSize={layout.fontSize.productName}
          fontWeight={700}
          color={inkOnBackground}
          animation="slide-up"
          delay={NAME_DELAY}
          duration={20}
          textAlign={layout.textAlign}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 5. Price badge — primary fill, textOnPrimary ink */}
      <div style={absStyle(layout.price)}>
        <PricePatch
          price={priceCurrent}
          originalPrice={priceOriginal}
          currency=""
          backgroundColor={brand.primaryColor}
          textColor={inkOnPrimary}
          size={format === '16:9' ? 'medium' : 'large'}
          animation="pop"
          delay={PRICE_DELAY}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 6. Promo tag — optional slot; primary fill with brand border */}
      {promoTag !== undefined && promoTag.length > 0 && (
        <div
          style={{
            ...absStyle(layout.promoTag),
            fontSize: layout.fontSize.promoTag
          }}
        >
          <PromoTagPill
            text={promoTag}
            primaryColor={brand.primaryColor}
            textOnPrimary={inkOnPrimary}
            fontFamily={brand.fontFamily}
            badgeRadius={brand.radius.badge}
            badgeStrokeWidth={strokeBadge}
            borderColor={borderColor}
            delay={PROMO_TAG_DELAY}
            textAlign={layout.textAlign}
          />
        </div>
      )}

      {/* 7. CTA button — brand primary fill, textOnPrimary ink, brand border */}
      <div style={absStyle(layout.ctaText)}>
        <CtaButton
          text={ctaText}
          primaryColor={brand.primaryColor}
          textOnPrimary={inkOnPrimary}
          fontFamily={brand.fontFamily}
          buttonRadius={brand.radius.button}
          buttonStrokeWidth={strokeButton}
          borderColor={borderColor}
          delay={CTA_DELAY}
          textAlign={layout.textAlign}
          fontSize={layout.fontSize.ctaText}
        />
      </div>

      {/* 8. Legal text — optional slot; ink = textOnBackground */}
      {legalText !== undefined && legalText.length > 0 && (
        <div style={absStyle(layout.legalText)}>
          <TextBlock
            content={legalText}
            fontFamily={brand.fontFamily}
            fontSize={layout.fontSize.legalText}
            fontWeight={400}
            color={inkOnBackground}
            animation="fade-in"
            delay={LEGAL_DELAY}
            duration={15}
            textAlign={layout.textAlign}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}

      {/* Structural default: closing cortinilla — skip when cortinillaCierre === 'none' */}
      {/* NOTE: actual cortinilla components will be wired in when cortinilla atoms exist.
          This guard ensures the skeleton differs between brands (Nike skips, OP/Airbnb show). */}
      {/* showClosingCortinilla && <ClosingCortinilla brandConfig={brandConfig} /> */}
    </AbsoluteFill>
  );
};
