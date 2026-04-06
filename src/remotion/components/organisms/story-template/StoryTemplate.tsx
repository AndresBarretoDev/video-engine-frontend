import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CortinillaCierre } from '@/remotion/components/molecules/cortinilla-cierre/CortinillaCierre';
import { ProductOverlay } from '@/remotion/components/molecules/product-overlay/ProductOverlay';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import { ShapeElement } from '@/remotion/components/atoms/shape-element/ShapeElement';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { VideoClip } from '@/remotion/components/atoms/video-clip/VideoClip';
import type { StoryTemplateProps } from './story-template.schema';

// ─── Timing constants ─────────────────────────────────────────────────────────
// Hook: first 30 frames — bold visual opening
const HOOK_DURATION = 30;
// Outro: last 60 frames — CTA via CortinillaCierre "bold"
const OUTRO_DURATION = 60;
// ProductOverlay appears at the middle of the content section
const PRODUCT_OFFSET = 20;

// ─── Component ────────────────────────────────────────────────────────────────

export const StoryTemplate: React.FC<StoryTemplateProps> = ({
  brandConfig,
  format,
  hookText,
  mainContent,
  product,
  ctaText,
  totalDuration
}) => {
  const contentStart = HOOK_DURATION;
  const outroStart = totalDuration - OUTRO_DURATION;
  const contentDuration = Math.max(outroStart - contentStart, 1);

  const productStart = contentStart + PRODUCT_OFFSET;
  const productDuration = Math.max(outroStart - productStart, 1);

  const primaryColor = brandConfig?.tokens.colors.primary ?? '#4361EF';
  const secondaryColor = brandConfig?.tokens.colors.secondary ?? '#FFFFFF';
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';
  const bgColor = brandConfig?.tokens.colors.background ?? '#0A0A1A';

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* ── Main content — fills entire background (always visible) ── */}
      <Sequence
        from={HOOK_DURATION}
        durationInFrames={Math.max(totalDuration - HOOK_DURATION, 1)}
      >
        <AbsoluteFill>
          {mainContent.type === 'image' ? (
            <ImageFrame
              src={mainContent.src}
              width={1080}
              height={1920}
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
              loop={false}
              format={format}
              brandConfig={brandConfig}
            />
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── Hook — bold visual with shape background + impactful text ── */}
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
        <AbsoluteFill>
          {/* Bold background shape */}
          <AbsoluteFill>
            <ShapeElement
              type="rectangle"
              color={primaryColor}
              width={1080}
              height={1920}
              animation="scale-up"
              opacity={0.95}
              delay={0}
              format={format}
              brandConfig={brandConfig}
            />
          </AbsoluteFill>

          {/* Hook text — large and centered */}
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 60px'
            }}
          >
            <TextBlock
              content={hookText}
              fontFamily={fontFamily}
              fontSize={80}
              fontWeight={900}
              color={secondaryColor}
              animation="scale-up"
              delay={5}
              duration={20}
              textAlign="center"
              format={format}
              brandConfig={brandConfig}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* ── ProductOverlay — centered and large for 9:16 format ── */}
      {product !== undefined && productDuration > 0 && (
        <Sequence from={productStart} durationInFrames={productDuration}>
          <ProductOverlay
            productName={product.name}
            productImage={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            position="center"
            animation="pop"
            duration={productDuration}
            format={format}
            brandConfig={brandConfig}
          />
        </Sequence>
      )}

      {/* ── Outro / CTA — CortinillaCierre "bold" variant ── */}
      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <CortinillaCierre
          brandConfig={brandConfig}
          ctaText={ctaText}
          variant="bold"
          duration={OUTRO_DURATION}
          format={format}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
