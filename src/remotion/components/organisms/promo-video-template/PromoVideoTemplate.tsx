import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CortinillaEntrada } from '@/remotion/components/molecules/cortinilla-entrada/CortinillaEntrada';
import { CortinillaCierre } from '@/remotion/components/molecules/cortinilla-cierre/CortinillaCierre';
import { ProductOverlay } from '@/remotion/components/molecules/product-overlay/ProductOverlay';
import { PromoBar } from '@/remotion/components/molecules/promo-bar/PromoBar';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { VideoClip } from '@/remotion/components/atoms/video-clip/VideoClip';
import type { PromoVideoTemplateProps } from './promo-video-template.schema';

// ─── Frame offset constants ────────────────────────────────────────────────────
// ProductOverlay appears 30 frames after content starts
const PRODUCT_OFFSET = 30;
// PromoBar appears 60 frames after content starts
const PROMO_OFFSET = 60;

// ─── Component ────────────────────────────────────────────────────────────────

export const PromoVideoTemplate: React.FC<PromoVideoTemplateProps> = ({
  brandConfig,
  format,
  introDuration,
  outroDuration,
  introVariant,
  mainContent,
  product,
  promoMessage,
  ctaText,
  legalText,
  totalDuration
}) => {
  const contentStart = introDuration;
  const contentEnd = totalDuration - outroDuration;
  const contentDuration = contentEnd - contentStart;

  // Guard: ensure contentDuration is positive
  const safeContentDuration = Math.max(contentDuration, 1);

  const productStart = contentStart + PRODUCT_OFFSET;
  const productDuration = Math.max(contentEnd - productStart, 1);

  const promoStart = contentStart + PROMO_OFFSET;
  const promoDuration = Math.max(contentEnd - promoStart, 1);

  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* ── Intro ── */}
      <Sequence from={0} durationInFrames={introDuration}>
        <CortinillaEntrada
          brandConfig={brandConfig}
          variant={introVariant}
          duration={introDuration}
          format={format}
        />
      </Sequence>

      {/* ── Main content layer ── */}
      <Sequence from={contentStart} durationInFrames={safeContentDuration}>
        <AbsoluteFill>
          {mainContent.type === 'image' ? (
            <ImageFrame
              src={mainContent.src}
              width={1920}
              height={1080}
              objectFit={mainContent.objectFit}
              animation="fade-in"
              borderRadius={0}
              shadow={false}
              delay={0}
              format={format}
              brandConfig={brandConfig}
            />
          ) : (
            <VideoClip
              src={mainContent.src}
              startFrom={0}
              volume={1}
              playbackRate={1}
              objectFit={mainContent.objectFit}
              hasAlpha={false}
              loop={false}
              format={format}
              brandConfig={brandConfig}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── ProductOverlay — appears after content starts ── */}
      {product !== undefined && productDuration > 0 && (
        <Sequence from={productStart} durationInFrames={productDuration}>
          <ProductOverlay
            productName={product.name}
            productImage={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            position={
              brandConfig?.defaults.productOverlayPosition ?? 'bottom-right'
            }
            animation="slide-in"
            duration={productDuration}
            format={format}
            brandConfig={brandConfig}
          />
        </Sequence>
      )}

      {/* ── PromoBar — appears after product overlay ── */}
      {promoMessage !== undefined && promoDuration > 0 && (
        <Sequence from={promoStart} durationInFrames={promoDuration}>
          <PromoBar
            message={promoMessage}
            backgroundColor={primaryColor}
            textColor="#FFFFFF"
            position={brandConfig?.defaults.promoBarStyle ?? 'bottom'}
            animation="slide-in"
            duration={promoDuration}
            format={format}
            brandConfig={brandConfig}
          />
        </Sequence>
      )}

      {/* ── Outro ── */}
      <Sequence from={contentEnd} durationInFrames={outroDuration}>
        <CortinillaCierre
          brandConfig={brandConfig}
          ctaText={ctaText}
          legalText={legalText}
          variant="standard"
          duration={outroDuration}
          format={format}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
