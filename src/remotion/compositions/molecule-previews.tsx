import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CortinillaEntrada } from '@/remotion/components/molecules/cortinilla-entrada/CortinillaEntrada';
import { ProductOverlay } from '@/remotion/components/molecules/product-overlay/ProductOverlay';
import { PromoBar } from '@/remotion/components/molecules/promo-bar/PromoBar';
import { LowerThird } from '@/remotion/components/molecules/lower-third/LowerThird';
import type { CortinillaEntradaProps } from '@/remotion/components/molecules/cortinilla-entrada/cortinilla-entrada.schema';
import type { ProductOverlayProps } from '@/remotion/components/molecules/product-overlay/product-overlay.schema';
import type { PromoBarProps } from '@/remotion/components/molecules/promo-bar/promo-bar.schema';
import type { LowerThirdProps } from '@/remotion/components/molecules/lower-third/lower-third.schema';

// ─── Shared dark background ────────────────────────────────────────────────────

const darkBg: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#0a0a1a'
};

// ─── CortinillaEntrada Preview ────────────────────────────────────────────────

export const cortinillaEntradaDefaultProps: CortinillaEntradaProps = {
  claim: 'Quality at its finest',
  variant: 'energetic',
  duration: 90,
  format: '16:9'
};

export const CortinillaEntradaPreview: React.FC<
  CortinillaEntradaProps
> = props => {
  return (
    <AbsoluteFill style={darkBg}>
      <CortinillaEntrada {...props} />
    </AbsoluteFill>
  );
};

// ─── ProductOverlay Preview ───────────────────────────────────────────────────

export const productOverlayDefaultProps: ProductOverlayProps = {
  productName: 'Fresh Blueberries',
  productImage: 'https://placehold.co/400x400/1a1a2e/white?text=Blueberries',
  price: '5.49',
  originalPrice: '8.99',
  weight: '500g · €10.98/kg',
  position: 'bottom-right',
  animation: 'slide-in',
  duration: 90,
  format: '16:9'
};

export const ProductOverlayPreview: React.FC<ProductOverlayProps> = props => {
  return (
    <AbsoluteFill style={darkBg}>
      {/* Background placeholder to simulate video content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #1a1a3e 0%, #0a0a2e 100%)'
        }}
      />
      <ProductOverlay {...props} />
    </AbsoluteFill>
  );
};

// ─── PromoBar Preview ─────────────────────────────────────────────────────────

export const promoBarDefaultProps: PromoBarProps = {
  message: 'Summer Sale — Up to 50% Off',
  backgroundColor: '#FF3B30',
  textColor: '#FFFFFF',
  position: 'bottom',
  animation: 'slide-in',
  duration: 90,
  format: '16:9'
};

export const PromoBarPreview: React.FC<PromoBarProps> = props => {
  return (
    <AbsoluteFill
      style={{
        ...darkBg,
        background: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a3e 100%)'
      }}
    >
      <PromoBar {...props} />
    </AbsoluteFill>
  );
};

// ─── LowerThird Preview ───────────────────────────────────────────────────────

export const lowerThirdDefaultProps: LowerThirdProps = {
  title: 'Omar Barreto',
  subtitle: 'Senior Frontend Architect',
  barColor: '#4361EF',
  position: 'bottom-left',
  animation: 'slide-in',
  duration: 90,
  format: '16:9'
};

export const LowerThirdPreview: React.FC<LowerThirdProps> = props => {
  return (
    <AbsoluteFill
      style={{
        ...darkBg,
        background: 'linear-gradient(180deg, #111827 0%, #0a0a1a 100%)'
      }}
    >
      <LowerThird {...props} />
    </AbsoluteFill>
  );
};
