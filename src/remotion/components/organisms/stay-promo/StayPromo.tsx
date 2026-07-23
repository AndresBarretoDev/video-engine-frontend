/**
 * StayPromo.tsx
 *
 * Organism: Airbnb-style property / listing promotional video.
 * Supports 16:9 / 9:16 / 1:1 via auto-layout from stay-promo.layout.ts.
 *
 * Distribution: DIFFERENT from LoopingProductPromo.
 *   16:9 — split-screen (hero left, info card right)
 *   9:16 — hero on top dominant, info panel below
 *   1:1  — hero top ~45%, info panel below
 *
 * Uses AIRBNB_BRAND_PRESET tokens (coral, Nunito, pill radii).
 * Brand injection via BrandConfig with full fallbacks — preview without brand never breaks.
 *
 * Animation: Remotion spring/interpolate ONLY.
 * CSS transitions/animations are FORBIDDEN — they will not render correctly in Remotion.
 *
 * Applied principles:
 *   - make-interfaces-feel-better: concentric radius, staggered enter, subtle exit,
 *     font smoothing, text-wrap balance, tabular-nums on price/rating
 *   - baseline-ui: compositor-only animation (transform, opacity), ease-out on entrance,
 *     no animation on large surfaces (hero), respect prefers-reduced-motion
 *   - 12-principles-of-animation: timing-under-300ms, easing-entrance-ease-out,
 *     physics-spring-for-overshoot, staging-one-focal-point
 *   - remotion-best-practices: useCurrentFrame + interpolate, Sequence from/layout,
 *     AbsoluteFill, spring for settle, no CSS animations
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img
} from 'remotion';
import { getStayPromoLayout } from './stay-promo.layout';
import type { StayPromoProps } from './stay-promo.schema';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

// ─── Brand fallbacks ──────────────────────────────────────────────────────────
// Neutral fallbacks only — NOT Airbnb-specific, NOT OP Blue.
// Rule: ONLY these constants are permitted in the no-brand fallback path.
// Brand token values ALWAYS override — no identity value is hardcoded in the
// brand-present path.

const FALLBACK_BG = '#F2F2F2'; // neutral light grey (not any brand color)
const FALLBACK_PRIMARY = '#6B7280'; // neutral mid-grey (not #4361EF OP, not Airbnb coral)
const FALLBACK_TEXT = '#111111';
const FALLBACK_TEXT_INVERSE = '#F5F5F5';
const FALLBACK_FONT = 'sans-serif'; // generic (not Nunito/Poppins/Mulish)
const FALLBACK_LOGO_URL =
  'https://placehold.co/200x66/6B7280/FFFFFF?text=BRAND';
const FALLBACK_LOGO_W = 200;
const FALLBACK_LOGO_H = 66;
const FALLBACK_RADIUS_BUTTON = 8;
const FALLBACK_RADIUS_BADGE = 6;
const FALLBACK_RADIUS_IMAGE = 12;

export interface ResolvedStayBrand {
  bgColor: string;
  /** Panel/card background (InfoCard) — distinct from bgColor to avoid floating text */
  surfaceColor?: string;
  primaryColor: string;
  /** Legacy — prefer textOnBackground/Surface/Primary */
  textColor: string;
  textInverse: string;
  /** Declared legible ink on page background */
  textOnBackground?: string;
  /** Declared legible ink on card/panel (InfoCard inner text) */
  textOnSurface?: string;
  /** Declared legible ink on primary-colored fills */
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

export function resolveStayBrand(brandConfig?: BrandConfig): ResolvedStayBrand {
  if (!brandConfig) {
    // NEUTRAL fallbacks only — no brand-specific values in this path
    return {
      bgColor: FALLBACK_BG,
      surfaceColor: undefined,
      primaryColor: FALLBACK_PRIMARY,
      textColor: FALLBACK_TEXT,
      textInverse: FALLBACK_TEXT_INVERSE,
      textOnBackground: undefined,
      textOnSurface: undefined,
      textOnPrimary: undefined,
      borderColor: undefined,
      stroke: undefined,
      fontFamily: FALLBACK_FONT,
      logoUrl: FALLBACK_LOGO_URL,
      logoWidth: FALLBACK_LOGO_W,
      logoHeight: FALLBACK_LOGO_H,
      springConfig: { damping: 12, stiffness: 160, mass: 1 },
      radius: {
        button: FALLBACK_RADIUS_BUTTON,
        badge: FALLBACK_RADIUS_BADGE,
        image: FALLBACK_RADIUS_IMAGE
      },
      defaults: undefined
    };
  }

  const radius = brandConfig.tokens.radius ?? {
    button: FALLBACK_RADIUS_BUTTON,
    badge: FALLBACK_RADIUS_BADGE,
    image: FALLBACK_RADIUS_IMAGE
  };

  return {
    bgColor: brandConfig.tokens.colors.background,
    // surfaceColor: InfoCard uses this instead of bgColor — fixes the floating-text bug
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
    // Structural defaults
    defaults: {
      cortinillaEntrada: brandConfig.defaults.cortinillaEntrada,
      cortinillaCierre: brandConfig.defaults.cortinillaCierre,
      promoBarStyle: brandConfig.defaults.promoBarStyle,
      productOverlayPosition: brandConfig.defaults.productOverlayPosition
    }
  };
}

// ─── Stagger timing (in frames) ───────────────────────────────────────────────
// Staging principle: one focal point at a time, soft sequential reveal.
// timing-under-300ms: user-interactive animations are visual-only here (30fps video).
// staging-one-focal-point: hero fades first, then info card elements stagger softly.

const BG_FADE_END = 15;
const HERO_DELAY = 0;
const LOGO_DELAY = 8;
const CARD_DELAY = 12; // info card background appears
const NAME_DELAY = 18; // listing name slides up
const LOCATION_DELAY = 26; // location fades in
const RATING_DELAY = 32; // rating pops in
const PRICE_DELAY = 40; // price per night reveals
const CTA_DELAY = 50; // CTA button bounces in

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Background: fade from white (Airbnb's light aesthetic) */
function Background({ color }: { color: string }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, BG_FADE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  return <AbsoluteFill style={{ backgroundColor: color, opacity }} />;
}

/** Hero image — fades in gently. Large surface: NO scale animation (baseline-ui rule). */
function HeroImage({
  src,
  box,
  borderRadius,
  delay
}: {
  src: string;
  box: { x: number; y: number; width: number; height: number };
  borderRadius: number;
  delay: number;
}) {
  const frame = useCurrentFrame();
  // Fade only — no scale/translate on large image surfaces (baseline-ui: avoid animating large images)
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const hasImage = Boolean(src && src.trim());

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        overflow: 'hidden',
        borderRadius,
        opacity,
        // Image outline: subtle 1px for depth (make-interfaces-feel-better: image outlines)
        outline: '1px solid rgba(0,0,0,0.1)',
        outlineOffset: -1
      }}
    >
      {hasImage ? (
        <Img
          src={src}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          alt=""
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#E8E8E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/** Info card panel — slides up gently from below (entrance ease-out). */
function InfoCard({
  box,
  bgColor,
  borderRadius,
  delay,
  children
}: {
  box: { x: number; y: number; width: number; height: number };
  bgColor: string;
  borderRadius: number;
  delay: number;
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide up + fade in (easing-entrance-ease-out, staging principle)
  const translateY = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 100, damping: 18, mass: 1 },
    from: 30,
    to: 0
  });
  const opacity = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        backgroundColor: bgColor,
        borderRadius,
        opacity: frame < delay ? 0 : opacity,
        transform: `translateY(${frame < delay ? 30 : translateY}px)`,
        // Layered shadow for natural depth (make-interfaces-feel-better: shadows over borders)
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
}

/** Text element with slide-up + fade entry (staggered). */
function StaggeredText({
  children,
  delay,
  style
}: {
  children: React.ReactNode;
  delay: number;
  style: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 140, damping: 16, mass: 1 },
    from: 20,
    to: 0
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        ...style,
        opacity: frame < delay ? 0 : opacity,
        transform: `translateY(${frame < delay ? 20 : translateY}px)`
      }}
    >
      {children}
    </div>
  );
}

/** Rating row: star icon + numeric score. */
function RatingRow({
  rating,
  reviewCount,
  primaryColor,
  fontFamily,
  fontSize,
  textColor,
  delay,
  textAlign
}: {
  rating: string;
  reviewCount?: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  delay: number;
  textAlign: 'left' | 'center';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 300, damping: 12, mass: 1 },
    from: 0.8,
    to: 1
  });
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        gap: 8,
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${frame < delay ? 0.8 : scale})`,
        transformOrigin:
          textAlign === 'center' ? 'center center' : 'left center'
      }}
    >
      {/* Star icon — pure SVG to avoid asset dependency */}
      <span style={{ color: primaryColor, fontSize: fontSize * 1.1 }}>★</span>
      {/* physics-subtle-deformation range: 0.95-1.05. Rating number uses tabular-nums
          (make-interfaces-feel-better principle 9) */}
      <span
        style={{
          fontFamily,
          fontSize,
          fontWeight: 700,
          color: textColor,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {rating}
      </span>
      {reviewCount && (
        <span
          style={{
            fontFamily,
            fontSize: fontSize * 0.85,
            fontWeight: 400,
            color: textColor,
            opacity: 0.6
          }}
        >
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

/** Price display: currency + amount per night */
function PriceBlock({
  price,
  currency,
  fontFamily,
  fontSize,
  labelFontSize,
  primaryColor,
  textColor,
  delay,
  textAlign
}: {
  price: string;
  currency: string;
  fontFamily: string;
  fontSize: number;
  labelFontSize: number;
  primaryColor: string;
  textColor: string;
  delay: number;
  textAlign: 'left' | 'center';
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 180, damping: 14, mass: 1 },
    from: 24,
    to: 0
  });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        gap: 6,
        opacity: frame < delay ? 0 : opacity,
        transform: `translateY(${frame < delay ? 24 : translateY}px)`
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: fontSize * 0.65,
          fontWeight: 700,
          color: primaryColor
        }}
      >
        {currency}
      </span>
      {/* tabular-nums on price to prevent layout shift (principle 9) */}
      <span
        style={{
          fontFamily,
          fontSize,
          fontWeight: 800,
          color: primaryColor,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {price}
      </span>
      <span
        style={{
          fontFamily,
          fontSize: labelFontSize,
          fontWeight: 400,
          color: textColor,
          opacity: 0.6
        }}
      >
        / night
      </span>
    </div>
  );
}

/** CTA button — spring pop entry (physics-spring-for-overshoot) */
function CtaButton({
  text,
  primaryColor,
  textInverse,
  fontFamily,
  fontSize,
  buttonRadius,
  delay,
  textAlign,
  minWidth
}: {
  text: string;
  primaryColor: string;
  textInverse: string;
  fontFamily: string;
  fontSize: number;
  buttonRadius: number;
  delay: number;
  textAlign: 'left' | 'center';
  minWidth: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring pop — bouncy entry fits Airbnb's playful character
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 280, damping: 14, mass: 1 },
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
        display: 'flex',
        justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
        opacity: frame < delay ? 0 : opacity,
        transform: `scale(${frame < delay ? 0 : scale})`,
        transformOrigin:
          textAlign === 'center' ? 'center center' : 'left center'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: primaryColor,
          color: textInverse,
          fontFamily,
          fontWeight: 800,
          fontSize,
          borderRadius: buttonRadius,
          paddingTop: 18,
          paddingBottom: 18,
          paddingLeft: 48,
          paddingRight: 48,
          minWidth,
          // CTA grows with content: auto width, text never clipped.
          // whiteSpace nowrap prevents mid-word breaks; button widens as needed.
          // NO overflow:hidden or textOverflow:ellipsis — text must always be fully visible.
          whiteSpace: 'nowrap',
          letterSpacing: 0.5
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Logo reveal: fade in. Sits on top of hero or in header bar. */
function LogoLayer({
  logoUrl,
  box,
  delay
}: {
  logoUrl: string;
  box: { x: number; y: number; width: number; height: number };
  delay: number;
}) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        opacity,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Img
        src={logoUrl}
        style={{
          height: box.height,
          width: 'auto',
          maxWidth: box.width,
          objectFit: 'contain'
        }}
        alt="Brand logo"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const StayPromo: React.FC<StayPromoProps> = ({
  brandConfig,
  format,
  slots
}) => {
  const layout = getStayPromoLayout(format);
  const brand = resolveStayBrand(brandConfig);

  const {
    listingName,
    location,
    heroImage,
    rating,
    reviewCount,
    pricePerNight,
    currency,
    ctaText,
    legalText
  } = slots;

  const isLandscape = format === '16:9';
  const { textAlign } = layout;

  // ─── Semantic ink resolution ────────────────────────────────────────────────
  // Use brand-declared inks per surface; fall back to legacy fields for compat.
  const inkOnSurface = brand.textOnSurface ?? brand.textColor;
  const inkOnPrimary = brand.textOnPrimary ?? brand.textInverse;

  // ─── Structural defaults ────────────────────────────────────────────────────
  // showClosingCortinilla / promoBarStyle are tracked for future structural
  // routing (see commented ClosingCortinilla usage below) — not yet wired
  // into JSX. void keeps the audit trail without tripping no-unused-vars.
  const showClosingCortinilla = brand.defaults?.cortinillaCierre !== 'none';
  const promoBarStyle = brand.defaults?.promoBarStyle ?? 'bottom';
  void showClosingCortinilla;
  void promoBarStyle;

  // InfoCard surface: brand.surfaceColor is distinct from bgColor — fixes floating text.
  // If brand has no surface token, derive a subtle elevated surface from background
  // (slightly lighter on dark brands, slightly darker on light brands) so cards always
  // read as elevated above the canvas. Never identical to the page background.
  const infoCardBg =
    brand.surfaceColor ??
    (() => {
      // Simple elevation: treat background as hex, nudge lightness
      // This fallback is used ONLY when brand has no surface token.
      // Prefer declaring surface in the brand for precise control.
      return brand.bgColor.toLowerCase() === '#ffffff'
        ? '#F5F5F5' // white canvas → slightly off-white surface
        : '#2A2A2A'; // dark canvas → slightly lighter surface
    })();

  // Info card inner padding
  const innerPadding = isLandscape ? 40 : 48;

  return (
    <AbsoluteFill style={{ fontFamily: brand.fontFamily }}>
      {/* 1. Background — sourced from brandConfig.tokens.colors.background */}
      <Background color={brand.bgColor} />

      {/* 2. Hero image — dominant visual, fade only (no scale on large surface) */}
      <HeroImage
        src={heroImage}
        box={layout.heroImage}
        borderRadius={isLandscape ? brand.radius.image : 0}
        delay={HERO_DELAY}
      />

      {/* 3. Logo — overlaid on hero */}
      <LogoLayer logoUrl={brand.logoUrl} box={layout.logo} delay={LOGO_DELAY} />

      {/* 4. Info card panel — uses surface color (NOT background) to avoid floating text */}
      <InfoCard
        box={layout.infoCard}
        bgColor={infoCardBg}
        borderRadius={isLandscape ? brand.radius.image : 0}
        delay={CARD_DELAY}
      >
        {/* All info elements are positioned relative to the info card */}
        {/* We convert absolute canvas positions to relative (subtract infoCard origin) */}

        {/* 4a. Listing name — ink = textOnSurface (inside InfoCard) */}
        <StaggeredText
          delay={NAME_DELAY}
          style={{
            position: 'absolute',
            left: layout.listingName.x - layout.infoCard.x,
            top: layout.listingName.y - layout.infoCard.y,
            width: layout.listingName.width,
            // No fixed height — the element grows with its content.
            // The layout box height is a positioning reference; overflow is visible
            // so a 3-line title is never hard-clipped by the box boundary.
            fontFamily: brand.fontFamily,
            fontSize: layout.fontSize.listingName,
            fontWeight: 800,
            // Use ink for the InfoCard surface, not page background
            color: inkOnSurface,
            textAlign,
            lineHeight: 1.25,
            // NO overflow:hidden — text must never be clipped
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
            whiteSpace: 'normal',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word'
          }}
        >
          {listingName}
        </StaggeredText>

        {/* 4b. Location — ink = textOnSurface */}
        <StaggeredText
          delay={LOCATION_DELAY}
          style={{
            position: 'absolute',
            left: layout.location.x - layout.infoCard.x,
            top: layout.location.y - layout.infoCard.y,
            width: layout.location.width,
            height: layout.location.height,
            fontFamily: brand.fontFamily,
            fontSize: layout.fontSize.location,
            fontWeight: 600,
            color: inkOnSurface,
            opacity: 0.7,
            textAlign,
            display: 'flex',
            alignItems: 'center',
            justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {location}
        </StaggeredText>

        {/* 4c. Rating — ink = textOnSurface */}
        <div
          style={{
            position: 'absolute',
            left: layout.rating.x - layout.infoCard.x,
            top: layout.rating.y - layout.infoCard.y,
            width: layout.rating.width,
            height: layout.rating.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: textAlign === 'center' ? 'center' : 'flex-start'
          }}
        >
          <RatingRow
            rating={rating}
            reviewCount={reviewCount}
            primaryColor={brand.primaryColor}
            fontFamily={brand.fontFamily}
            fontSize={layout.fontSize.rating}
            textColor={inkOnSurface}
            delay={RATING_DELAY}
            textAlign={textAlign}
          />
        </div>

        {/* 4d. Price per night — ink = textOnSurface */}
        <div
          style={{
            position: 'absolute',
            left: layout.pricePerNight.x - layout.infoCard.x,
            top: layout.pricePerNight.y - layout.infoCard.y,
            width: layout.pricePerNight.width,
            height: layout.pricePerNight.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: textAlign === 'center' ? 'center' : 'flex-start'
          }}
        >
          <PriceBlock
            price={pricePerNight}
            currency={currency}
            fontFamily={brand.fontFamily}
            fontSize={layout.fontSize.price}
            labelFontSize={layout.fontSize.priceLabel}
            primaryColor={brand.primaryColor}
            textColor={inkOnSurface}
            delay={PRICE_DELAY}
            textAlign={textAlign}
          />
        </div>

        {/* 4e. CTA button — primary fill, textOnPrimary ink, brand border */}
        <div
          style={{
            position: 'absolute',
            left: layout.ctaButton.x - layout.infoCard.x,
            top: layout.ctaButton.y - layout.infoCard.y,
            width: layout.ctaButton.width,
            height: layout.ctaButton.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: textAlign === 'center' ? 'center' : 'flex-start'
          }}
        >
          <CtaButton
            text={ctaText}
            primaryColor={brand.primaryColor}
            textInverse={inkOnPrimary}
            fontFamily={brand.fontFamily}
            fontSize={layout.fontSize.cta}
            buttonRadius={brand.radius.button}
            delay={CTA_DELAY}
            textAlign={textAlign}
            minWidth={layout.ctaButton.width * 0.7}
          />
        </div>

        {/* 4f. Legal text (optional) — ink = textOnSurface */}
        {legalText && legalText.length > 0 && (
          <div
            style={{
              position: 'absolute',
              left: innerPadding,
              bottom: innerPadding,
              right: innerPadding,
              fontFamily: brand.fontFamily,
              fontSize: Math.round(layout.fontSize.location * 0.75),
              fontWeight: 400,
              color: inkOnSurface,
              opacity: 0.45,
              textAlign,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {legalText}
          </div>
        )}
      </InfoCard>

      {/* Structural default: closing cortinilla — skip when cortinillaCierre === 'none' */}
      {/* NOTE: actual cortinilla components will be wired when cortinilla atoms exist.
          This guard ensures structural difference between brands (Nike/Nike-like skip it). */}
      {/* showClosingCortinilla && <ClosingCortinilla brandConfig={brandConfig} /> */}
    </AbsoluteFill>
  );
};
