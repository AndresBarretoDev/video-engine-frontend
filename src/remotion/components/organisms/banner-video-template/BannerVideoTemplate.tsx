import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { LogoReveal } from '@/remotion/components/atoms/logo-reveal/LogoReveal';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { PricePatch } from '@/remotion/components/atoms/price-patch/PricePatch';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { VideoClip } from '@/remotion/components/atoms/video-clip/VideoClip';
import type { BannerVideoTemplateProps } from './banner-video-template.schema';

// ─── Stagger delays (frames) ──────────────────────────────────────────────────
// Elements stagger in for a compact, punchy feel
const HEADLINE_DELAY = 8;
const PRICE_DELAY = 18;
const CTA_DELAY = 26;
const LOGO_DELAY = 5;

// ─── Default placeholder brand ────────────────────────────────────────────────
const PLACEHOLDER_LOGO = 'https://placehold.co/160x50/4361EF/white?text=BRAND';

// ─── Component ────────────────────────────────────────────────────────────────

export const BannerVideoTemplate: React.FC<BannerVideoTemplateProps> = ({
  brandConfig,
  format,
  backgroundContent,
  headline,
  price,
  originalPrice,
  ctaText,
  totalDuration
}) => {
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';
  const secondaryColor = brandConfig?.tokens.colors.secondary ?? '#FFFFFF';
  const accentColor = brandConfig?.tokens.colors.accent ?? '#FF3B30';
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';
  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';

  const logoUrl = brandConfig?.assets.logo.url ?? PLACEHOLDER_LOGO;
  const logoWidth = brandConfig?.assets.logo.width ?? 160;
  const logoHeight = brandConfig?.assets.logo.height ?? 50;

  // Font sizes — compact for display ads
  const headlineFontSize = format === '9:16' ? 72 : format === '1:1' ? 56 : 64;
  const ctaFontSize = format === '9:16' ? 40 : format === '1:1' ? 34 : 36;

  // Background overlay to ensure text legibility
  const overlayColor = 'rgba(0,0,0,0.45)';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* ── Background layer ── */}
      <Sequence from={0} durationInFrames={totalDuration}>
        <AbsoluteFill>
          {backgroundContent.type === 'color' ? (
            <AbsoluteFill
              style={{ backgroundColor: backgroundContent.color ?? bgColor }}
            />
          ) : backgroundContent.type === 'image' &&
            backgroundContent.src !== undefined ? (
            <ImageFrame
              src={backgroundContent.src}
              width={1920}
              height={1080}
              objectFit="cover"
              animation="ken-burns"
              borderRadius={0}
              shadow={false}
              delay={0}
              format={format}
              brandConfig={brandConfig}
            />
          ) : backgroundContent.type === 'video' &&
            backgroundContent.src !== undefined ? (
            <VideoClip
              src={backgroundContent.src}
              startFrom={0}
              volume={0}
              playbackRate={1}
              objectFit="cover"
              hasAlpha={false}
              loop={true}
              format={format}
              brandConfig={brandConfig}
            />
          ) : (
            <AbsoluteFill style={{ backgroundColor: bgColor }} />
          )}

          {/* Darkening overlay for text legibility */}
          <AbsoluteFill style={{ backgroundColor: overlayColor }} />
        </AbsoluteFill>
      </Sequence>

      {/* ── Logo — top-left, staggered in first ── */}
      <Sequence from={0} durationInFrames={totalDuration}>
        <div
          style={{
            position: 'absolute',
            top: format === '9:16' ? 48 : 32,
            left: format === '9:16' ? 48 : 40
          }}
        >
          <LogoReveal
            logoUrl={logoUrl}
            width={logoWidth}
            height={logoHeight}
            animation="fade-in"
            delay={LOGO_DELAY}
            duration={20}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      </Sequence>

      {/* ── Content group: headline + price + CTA ── */}
      <Sequence from={0} durationInFrames={totalDuration}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: format === '9:16' ? 'center' : 'flex-start',
            justifyContent: 'center',
            gap: 24,
            paddingLeft: format === '9:16' ? 60 : 80,
            paddingRight: format === '9:16' ? 60 : 80
          }}
        >
          {/* Headline */}
          <TextBlock
            content={headline}
            fontFamily={fontFamily}
            fontSize={headlineFontSize}
            fontWeight={900}
            color={secondaryColor}
            animation="slide-up"
            delay={HEADLINE_DELAY}
            duration={18}
            textAlign={format === '9:16' ? 'center' : 'left'}
            format={format}
            brandConfig={brandConfig}
          />

          {/* Price — optional */}
          {price !== undefined && (
            <PricePatch
              price={price}
              originalPrice={originalPrice}
              currency=""
              backgroundColor={accentColor}
              textColor="#FFFFFF"
              size={format === '9:16' ? 'large' : 'medium'}
              animation="pop"
              delay={PRICE_DELAY}
              format={format}
              brandConfig={brandConfig}
            />
          )}

          {/* CTA text */}
          <TextBlock
            content={ctaText}
            fontFamily={fontFamily}
            fontSize={ctaFontSize}
            fontWeight={700}
            color={primaryColor}
            backgroundColor="rgba(255,255,255,0.92)"
            animation="fade-in"
            delay={CTA_DELAY}
            duration={15}
            textAlign={format === '9:16' ? 'center' : 'left'}
            format={format}
            brandConfig={brandConfig}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
