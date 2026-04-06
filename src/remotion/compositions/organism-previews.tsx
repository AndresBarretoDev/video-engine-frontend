import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PromoVideoTemplate } from '@/remotion/components/organisms/promo-video-template/PromoVideoTemplate';
import { StoryTemplate } from '@/remotion/components/organisms/story-template/StoryTemplate';
import { BannerVideoTemplate } from '@/remotion/components/organisms/banner-video-template/BannerVideoTemplate';
import type { PromoVideoTemplateProps } from '@/remotion/components/organisms/promo-video-template/promo-video-template.schema';
import type { StoryTemplateProps } from '@/remotion/components/organisms/story-template/story-template.schema';
import type { BannerVideoTemplateProps } from '@/remotion/components/organisms/banner-video-template/banner-video-template.schema';

// ─── Placeholder URLs ─────────────────────────────────────────────────────────
const PLACEHOLDER_IMAGE =
  'https://placehold.co/1920x1080/1a1a3e/white?text=Main+Content';
const PLACEHOLDER_IMAGE_VERTICAL =
  'https://placehold.co/1080x1920/1a1a3e/white?text=Story+Content';
const PLACEHOLDER_PRODUCT =
  'https://placehold.co/400x400/2d2d4e/white?text=Product';
const PLACEHOLDER_BG =
  'https://placehold.co/1920x1080/0a1628/4361EF?text=Banner+Background';

// ─── PromoVideoTemplate Preview ───────────────────────────────────────────────

export const promoVideoTemplateDefaultProps: PromoVideoTemplateProps = {
  format: '16:9',
  introDuration: 90,
  outroDuration: 90,
  introVariant: 'energetic',
  mainContent: {
    type: 'image',
    src: PLACEHOLDER_IMAGE,
    objectFit: 'cover'
  },
  product: {
    name: 'Fresh Blueberries',
    image: PLACEHOLDER_PRODUCT,
    price: '5.49',
    originalPrice: '8.99'
  },
  promoMessage: 'Summer Sale — Up to 50% Off',
  ctaText: 'Shop Now',
  legalText: '*Offer valid while stocks last.',
  totalDuration: 300
};

export const PromoVideoTemplatePreview: React.FC<
  PromoVideoTemplateProps
> = props => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A1A' }}>
      <PromoVideoTemplate {...props} />
    </AbsoluteFill>
  );
};

// ─── StoryTemplate Preview ────────────────────────────────────────────────────

export const storyTemplateDefaultProps: StoryTemplateProps = {
  format: '9:16',
  hookText: "Don't miss this!",
  mainContent: {
    type: 'image',
    src: PLACEHOLDER_IMAGE_VERTICAL
  },
  product: {
    name: 'Premium Blueberries',
    image: PLACEHOLDER_PRODUCT,
    price: '5.49',
    originalPrice: '8.99'
  },
  ctaText: 'Swipe Up to Shop',
  totalDuration: 270
};

export const StoryTemplatePreview: React.FC<StoryTemplateProps> = props => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A1A' }}>
      <StoryTemplate {...props} />
    </AbsoluteFill>
  );
};

// ─── BannerVideoTemplate Preview ─────────────────────────────────────────────

export const bannerVideoTemplateDefaultProps: BannerVideoTemplateProps = {
  format: '16:9',
  backgroundContent: {
    type: 'image',
    src: PLACEHOLDER_BG
  },
  headline: 'Big Savings This Week',
  price: '5.49',
  originalPrice: '8.99',
  ctaText: 'Shop Now',
  totalDuration: 150
};

export const BannerVideoTemplatePreview: React.FC<
  BannerVideoTemplateProps
> = props => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A1A' }}>
      <BannerVideoTemplate {...props} />
    </AbsoluteFill>
  );
};
