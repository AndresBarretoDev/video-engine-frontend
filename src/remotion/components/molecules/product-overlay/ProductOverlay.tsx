import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ImageFrame } from '@/remotion/components/atoms/image-frame/ImageFrame';
import { PricePatch } from '@/remotion/components/atoms/price-patch/PricePatch';
import { TextBlock } from '@/remotion/components/atoms/text-block/TextBlock';
import type { VideoFormat } from '@/remotion/types/video-format.types';
import type {
  ProductOverlayProps,
  ProductOverlayPosition,
  ProductOverlayAnimation
} from './product-overlay.schema';

// ─── Internal timing (molecules own their timing) ─────────────────────────────
// Image appears at frame 0, product name at +8, price at +15

const IMAGE_DELAY = 0;
const NAME_DELAY = 8;
const PRICE_DELAY = 15;
const WEIGHT_DELAY = 20;

// ─── Image dimensions per position ────────────────────────────────────────────

interface ImageDimensions {
  width: number;
  height: number;
}

function getImageDimensions(
  position: ProductOverlayPosition,
  format: VideoFormat
): ImageDimensions {
  const isPortrait = format === '9:16';
  const isSquare = format === '1:1';

  if (position === 'full-width') {
    return { width: 960, height: isPortrait ? 600 : 400 };
  }

  if (position === 'center') {
    return { width: isPortrait ? 500 : 400, height: isPortrait ? 500 : 400 };
  }

  // bottom-right / bottom-left
  return {
    width: isPortrait ? 360 : isSquare ? 320 : 280,
    height: isPortrait ? 360 : isSquare ? 320 : 280
  };
}

// ─── Container style per position ─────────────────────────────────────────────

function getContainerStyle(
  position: ProductOverlayPosition,
  format: VideoFormat
): React.CSSProperties {
  const isPortrait = format === '9:16';
  const padding = isPortrait ? 32 : 24;

  switch (position) {
    case 'bottom-right':
      return {
        position: 'absolute',
        bottom: padding,
        right: padding,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 16
      };
    case 'bottom-left':
      return {
        position: 'absolute',
        bottom: padding,
        left: padding,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 16
      };
    case 'center':
      return {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16
      };
    case 'full-width':
      return {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        padding: '20px 40px',
        backgroundColor: 'rgba(0,0,0,0.65)'
      };
    default:
      return {
        position: 'absolute',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 16
      };
  }
}

// ─── Image entry animation ─────────────────────────────────────────────────────

function getImageAnimation(
  animation: ProductOverlayAnimation
): 'fade-in' | 'zoom-in' | 'parallax' | 'ken-burns' | 'slide' {
  switch (animation) {
    case 'slide-in':
      return 'slide';
    case 'pop':
      return 'zoom-in';
    case 'fade':
      return 'fade-in';
    default:
      return 'slide';
  }
}

// ─── Price animation ───────────────────────────────────────────────────────────

function getPriceAnimation(
  animation: ProductOverlayAnimation
): 'pop' | 'slide-in' | 'fade' {
  switch (animation) {
    case 'slide-in':
      return 'slide-in';
    case 'pop':
      return 'pop';
    case 'fade':
      return 'fade';
    default:
      return 'slide-in';
  }
}

// ─── Name/weight animation ─────────────────────────────────────────────────────

function getNameAnimation(
  animation: ProductOverlayAnimation
): 'fade-in' | 'slide-up' | 'scale-up' {
  switch (animation) {
    case 'slide-in':
      return 'slide-up';
    case 'pop':
      return 'scale-up';
    case 'fade':
      return 'fade-in';
    default:
      return 'slide-up';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProductOverlay: React.FC<ProductOverlayProps> = ({
  productName,
  productImage,
  price,
  originalPrice,
  weight,
  position,
  animation,
  format,
  brandConfig
}) => {
  const primaryColor = brandConfig?.tokens.colors.primary ?? '#FF3B30';
  const textColor = brandConfig?.tokens.colors.text ?? '#FFFFFF';
  const fontFamily =
    brandConfig?.tokens.fonts.heading.family ?? 'Mulish, sans-serif';

  const imageDims = getImageDimensions(position, format);
  const containerStyle = getContainerStyle(position, format);
  const imageAnimation = getImageAnimation(animation);
  const priceAnimation = getPriceAnimation(animation);
  const nameAnimation = getNameAnimation(animation);

  // Font sizes
  const nameFontSize = format === '9:16' ? 34 : format === '1:1' ? 28 : 26;
  const weightFontSize = format === '9:16' ? 22 : 18;

  // For center/full-width, layout is column; for corner positions, text is beside image
  const isCorner = position === 'bottom-right' || position === 'bottom-left';
  const textGroupStyle: React.CSSProperties = isCorner
    ? {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'flex-start'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center'
      };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={containerStyle}>
        {/* Packshot image */}
        <ImageFrame
          src={productImage}
          width={imageDims.width}
          height={imageDims.height}
          objectFit="contain"
          animation={imageAnimation}
          borderRadius={8}
          shadow={true}
          delay={IMAGE_DELAY}
          format={format}
          brandConfig={brandConfig}
        />

        {/* Text + price group */}
        <div style={textGroupStyle}>
          {/* Product name */}
          <TextBlock
            content={productName}
            fontFamily={fontFamily}
            fontSize={nameFontSize}
            fontWeight={700}
            color={textColor}
            animation={nameAnimation}
            delay={NAME_DELAY}
            duration={20}
            textAlign={isCorner ? 'left' : 'center'}
            format={format}
            brandConfig={brandConfig}
          />

          {/* Weight/detail — optional */}
          {weight !== undefined && (
            <TextBlock
              content={weight}
              fontFamily={fontFamily}
              fontSize={weightFontSize}
              fontWeight={400}
              color={textColor}
              animation="fade-in"
              delay={WEIGHT_DELAY}
              duration={18}
              textAlign={isCorner ? 'left' : 'center'}
              format={format}
              brandConfig={brandConfig}
            />
          )}

          {/* Price badge */}
          <PricePatch
            price={price}
            originalPrice={originalPrice}
            currency=""
            backgroundColor={primaryColor}
            textColor="#FFFFFF"
            size={format === '9:16' ? 'large' : 'medium'}
            animation={priceAnimation}
            delay={PRICE_DELAY}
            format={format}
            brandConfig={brandConfig}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
