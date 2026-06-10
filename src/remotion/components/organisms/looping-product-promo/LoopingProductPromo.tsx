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
  Sequence,
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
// Neutral accent = #6B7280 (mid-gray, not the OP Blue #4361EF).

const FALLBACK_BG_COLOR = '#1A1A1A';
const FALLBACK_PRIMARY = '#6B7280';
const FALLBACK_TEXT_COLOR = '#F9FAFB';
const FALLBACK_TEXT_INVERSE = '#111827';
const FALLBACK_FONT_FAMILY = 'sans-serif';
const FALLBACK_LOGO_URL = 'https://placehold.co/240x80/6B7280/FFFFFF?text=BRAND';
const FALLBACK_LOGO_W = 240;
const FALLBACK_LOGO_H = 80;
// Neutral radius — not too sharp, not too round; brand overrides these completely.
const FALLBACK_RADIUS_BUTTON = 8;
const FALLBACK_RADIUS_BADGE = 6;
const FALLBACK_RADIUS_IMAGE = 12;

interface ResolvedBrand {
  bgColor: string;
  primaryColor: string;
  textColor: string;
  textInverse: string;
  fontFamily: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  springConfig: { damping: number; stiffness: number; mass: number };
  radius: { button: number; badge: number; image: number };
}

export function resolveBrand(brandConfig?: BrandConfig): ResolvedBrand {
  if (!brandConfig) {
    return {
      bgColor: FALLBACK_BG_COLOR,
      primaryColor: FALLBACK_PRIMARY,
      textColor: FALLBACK_TEXT_COLOR,
      textInverse: FALLBACK_TEXT_INVERSE,
      fontFamily: FALLBACK_FONT_FAMILY,
      logoUrl: FALLBACK_LOGO_URL,
      logoWidth: FALLBACK_LOGO_W,
      logoHeight: FALLBACK_LOGO_H,
      springConfig: { damping: 14, stiffness: 150, mass: 1 },
      radius: {
        button: FALLBACK_RADIUS_BUTTON,
        badge: FALLBACK_RADIUS_BADGE,
        image: FALLBACK_RADIUS_IMAGE
      }
    };
  }

  // Radius: use brand's token if present; otherwise use neutral fallbacks.
  const radius = brandConfig.tokens.radius ?? {
    button: FALLBACK_RADIUS_BUTTON,
    badge: FALLBACK_RADIUS_BADGE,
    image: FALLBACK_RADIUS_IMAGE
  };

  return {
    bgColor: brandConfig.tokens.colors.background,
    primaryColor: brandConfig.tokens.colors.primary,
    textColor: brandConfig.tokens.colors.text,
    textInverse: brandConfig.tokens.colors.textInverse,
    fontFamily: brandConfig.tokens.fonts.heading.family,
    logoUrl: brandConfig.assets.logo.url,
    logoWidth: brandConfig.assets.logo.width,
    logoHeight: brandConfig.assets.logo.height,
    springConfig: brandConfig.tokens.animation.springConfig,
    radius
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

function BackgroundLayer({
  color,
  totalFrames
}: {
  color: string;
  totalFrames: number;
}) {
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
  textInverse,
  fontFamily,
  badgeRadius,
  delay,
  textAlign
}: {
  text: string;
  primaryColor: string;
  textInverse: string;
  fontFamily: string;
  badgeRadius: number;
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
        transformOrigin: textAlign === 'center' ? 'center center' : 'left center'
      }}
    >
      <span
        style={{
          backgroundColor: primaryColor,
          color: textInverse,
          fontFamily,
          fontWeight: 800,
          fontSize: 'inherit',
          borderRadius: badgeRadius,
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
  textInverse,
  fontFamily,
  buttonRadius,
  delay,
  textAlign,
  fontSize
}: {
  text: string;
  primaryColor: string;
  textInverse: string;
  fontFamily: string;
  buttonRadius: number;
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
          // CTA inverted: background = textInverse (usually white), text = primaryColor (brand accent)
          backgroundColor: textInverse,
          color: primaryColor,
          fontFamily,
          fontWeight: 800,
          // If fontSize is large and text is long, fit text within button by scaling down font.
          // The button GROWS with its text (auto width) — never clips or truncates.
          fontSize,
          borderRadius: buttonRadius,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 40,
          paddingRight: 40,
          // CTA button grows with content: auto width, text never clipped.
          // whiteSpace: nowrap prevents mid-word breaks; the layout box is wide enough
          // to hold a reasonable CTA (320px in 16:9, 480px in 9:16, 380px in 1:1).
          whiteSpace: 'nowrap',
          // NO textOverflow or overflow:hidden — text must never be clipped.
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
  slots,
  timing,
  logoPosition
}) => {
  const { fps } = useVideoConfig();
  const layout = getLoopingPromoLayout(format);
  const brand = resolveBrand(brandConfig);

  const {
    totalDurationInFrames,
    introDurationInFrames,
    outroDurationInFrames
  } = timing;

  const {
    productName,
    productImage,
    priceCurrent,
    priceOriginal,
    promoTag,
    ctaText,
    legalText
  } = slots;

  // ─── Absolute position style helpers ────────────────────────────────────────
  function absStyle(box: { x: number; y: number; width: number; height: number }): React.CSSProperties {
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
      {/* 1. Background */}
      <BackgroundLayer
        color={brand.bgColor}
        totalFrames={totalDurationInFrames}
      />

      {/* 2. Logo — respects logoPosition */}
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
          borderRadius={brand.radius.image}
          shadow={true}
          delay={IMAGE_DELAY}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 4. Product name */}
      <div style={absStyle(layout.productName)}>
        <TextBlock
          content={productName}
          fontFamily={brand.fontFamily}
          fontSize={layout.fontSize.productName}
          fontWeight={700}
          color={brand.textColor}
          animation="slide-up"
          delay={NAME_DELAY}
          duration={20}
          textAlign={layout.textAlign}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 5. Price badge */}
      <div style={absStyle(layout.price)}>
        <PricePatch
          price={priceCurrent}
          originalPrice={priceOriginal}
          currency=""
          backgroundColor={brand.primaryColor}
          textColor={brand.textInverse}
          size={format === '16:9' ? 'medium' : 'large'}
          animation="pop"
          delay={PRICE_DELAY}
          format={format}
          brandConfig={brandConfig}
        />
      </div>

      {/* 6. Promo tag — optional slot */}
      {promoTag !== undefined && promoTag.length > 0 && (
        <div style={{ ...absStyle(layout.promoTag), fontSize: layout.fontSize.promoTag }}>
          <PromoTagPill
            text={promoTag}
            primaryColor={brand.primaryColor}
            textInverse={brand.textInverse}
            fontFamily={brand.fontFamily}
            badgeRadius={brand.radius.badge}
            delay={PROMO_TAG_DELAY}
            textAlign={layout.textAlign}
          />
        </div>
      )}

      {/* 7. CTA text */}
      <div style={absStyle(layout.ctaText)}>
        <CtaButton
          text={ctaText}
          primaryColor={brand.primaryColor}
          textInverse={brand.textInverse}
          fontFamily={brand.fontFamily}
          buttonRadius={brand.radius.button}
          delay={CTA_DELAY}
          textAlign={layout.textAlign}
          fontSize={layout.fontSize.ctaText}
        />
      </div>

      {/* 8. Legal text — optional slot */}
      {legalText !== undefined && legalText.length > 0 && (
        <div style={absStyle(layout.legalText)}>
          <TextBlock
            content={legalText}
            fontFamily={brand.fontFamily}
            fontSize={layout.fontSize.legalText}
            fontWeight={400}
            color={brand.textColor}
            animation="fade-in"
            delay={LEGAL_DELAY}
            duration={15}
            textAlign={layout.textAlign}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
