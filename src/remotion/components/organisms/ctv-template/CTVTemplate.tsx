import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CortinillaEntrada } from '@/remotion/components/molecules/cortinilla-entrada/CortinillaEntrada';
import { CortinillaCierre } from '@/remotion/components/molecules/cortinilla-cierre/CortinillaCierre';
import { ProductOverlay } from '@/remotion/components/molecules/product-overlay/ProductOverlay';
import { PromoBar } from '@/remotion/components/molecules/promo-bar/PromoBar';
import { LowerThird } from '@/remotion/components/molecules/lower-third/LowerThird';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { VideoClip } from '@/remotion/components/atoms/video-clip/VideoClip';
import type { CTVTemplateProps, CtvOverlay } from './ctv-template.schema';

// ─── CTV timing constants (longer than PromoVideo) ────────────────────────────
const INTRO_DURATION = 120;
const OUTRO_DURATION = 120;

// ─── Type guards for overlay props ────────────────────────────────────────────

function isStringRecord(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null;
}

// ─── Overlay renderer ─────────────────────────────────────────────────────────

interface OverlayRendererProps {
  overlay: CtvOverlay;
  format: CTVTemplateProps['format'];
  brandConfig: CTVTemplateProps['brandConfig'];
}

const OverlayRenderer: React.FC<OverlayRendererProps> = ({
  overlay,
  format,
  brandConfig
}) => {
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';

  if (overlay.type === 'product') {
    const p = isStringRecord(overlay.props) ? overlay.props : {};
    const productName =
      typeof p['productName'] === 'string' ? p['productName'] : 'Product';
    const productImage =
      typeof p['productImage'] === 'string'
        ? p['productImage']
        : 'https://placehold.co/300x300/1a1a2e/white?text=Product';
    const price = typeof p['price'] === 'string' ? p['price'] : '0.00';
    const originalPrice =
      typeof p['originalPrice'] === 'string' ? p['originalPrice'] : undefined;

    return (
      <ProductOverlay
        productName={productName}
        productImage={productImage}
        price={price}
        originalPrice={originalPrice}
        position="bottom-right"
        animation="slide-in"
        duration={overlay.duration}
        format={format}
        brandConfig={brandConfig}
      />
    );
  }

  if (overlay.type === 'promo') {
    const p = isStringRecord(overlay.props) ? overlay.props : {};
    const message =
      typeof p['message'] === 'string' ? p['message'] : 'Special Offer';
    const backgroundColor =
      typeof p['backgroundColor'] === 'string'
        ? p['backgroundColor']
        : primaryColor;
    const textColor =
      typeof p['textColor'] === 'string' ? p['textColor'] : '#FFFFFF';

    return (
      <PromoBar
        message={message}
        backgroundColor={backgroundColor}
        textColor={textColor}
        position="bottom"
        animation="slide-in"
        duration={overlay.duration}
        format={format}
        brandConfig={brandConfig}
      />
    );
  }

  if (overlay.type === 'lower-third') {
    const p = isStringRecord(overlay.props) ? overlay.props : {};
    const title = typeof p['title'] === 'string' ? p['title'] : 'Title';
    const subtitle =
      typeof p['subtitle'] === 'string' ? p['subtitle'] : undefined;
    const barColor =
      typeof p['barColor'] === 'string' ? p['barColor'] : primaryColor;

    return (
      <LowerThird
        title={title}
        subtitle={subtitle}
        barColor={barColor}
        position="bottom-left"
        animation="slide-in"
        duration={overlay.duration}
        format={format}
        brandConfig={brandConfig}
      />
    );
  }

  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CTVTemplate: React.FC<CTVTemplateProps> = ({
  brandConfig,
  format,
  introVariant,
  mainContent,
  overlays,
  ctaText,
  legalText,
  totalDuration
}) => {
  const contentStart = INTRO_DURATION;
  const outroStart = totalDuration - OUTRO_DURATION;
  const contentDuration = Math.max(outroStart - contentStart, 1);

  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* ── Elaborate intro (120 frames) ── */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <CortinillaEntrada
          brandConfig={brandConfig}
          variant={introVariant}
          duration={INTRO_DURATION}
          format={format}
        />
      </Sequence>

      {/* ── Long main content ── */}
      <Sequence from={contentStart} durationInFrames={contentDuration}>
        <AbsoluteFill>
          {mainContent.type === 'image' ? (
            <ImageFrame
              src={mainContent.src}
              width={1920}
              height={1080}
              objectFit="cover"
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
              objectFit="cover"
              hasAlpha={false}
              loop={true}
              format={format}
              brandConfig={brandConfig}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── Periodic overlays — placed via their startFrame ── */}
      {overlays.map((overlay, idx) => (
        <Sequence
          key={idx}
          from={overlay.startFrame}
          durationInFrames={overlay.duration}
        >
          <OverlayRenderer
            overlay={overlay}
            format={format}
            brandConfig={brandConfig}
          />
        </Sequence>
      ))}

      {/* ── Elaborate outro (120 frames) ── */}
      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <CortinillaCierre
          brandConfig={brandConfig}
          ctaText={ctaText}
          legalText={legalText}
          variant="standard"
          duration={OUTRO_DURATION}
          format={format}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
