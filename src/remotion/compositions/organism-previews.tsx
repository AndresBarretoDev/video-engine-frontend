import React from 'react';
import { AbsoluteFill } from 'remotion';
import { PromoVideoTemplate } from '@/remotion/components/organisms/promo-video-template/PromoVideoTemplate';
import { StoryTemplate } from '@/remotion/components/organisms/story-template/StoryTemplate';
import { BannerVideoTemplate } from '@/remotion/components/organisms/banner-video-template/BannerVideoTemplate';
import { CTVTemplate } from '@/remotion/components/organisms/ctv-template/CTVTemplate';
import { LoopingProductPromo } from '@/remotion/components/organisms/looping-product-promo/LoopingProductPromo';
import { StayPromo } from '@/remotion/components/organisms/stay-promo/StayPromo';
import type { PromoVideoTemplateProps } from '@/remotion/components/organisms/promo-video-template/promo-video-template.schema';
import type { StoryTemplateProps } from '@/remotion/components/organisms/story-template/story-template.schema';
import type { BannerVideoTemplateProps } from '@/remotion/components/organisms/banner-video-template/banner-video-template.schema';
import type { CTVTemplateProps } from '@/remotion/components/organisms/ctv-template/ctv-template.schema';
import type { LoopingProductPromoProps } from '@/remotion/components/organisms/looping-product-promo/looping-product-promo.schema';
import type { StayPromoProps } from '@/remotion/components/organisms/stay-promo/stay-promo.schema';
import { AIRBNB_BRAND_PRESET } from '@/remotion/brand-presets/airbnb.preset';

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

// ─── CTVTemplate Preview ─────────────────────────────────────────────────────

const PLACEHOLDER_CTV_MAIN =
  'https://placehold.co/1920x1080/0a1628/4361EF?text=CTV+Long-Form+Content';

export const ctvTemplateDefaultProps: CTVTemplateProps = {
  format: '16:9',
  introVariant: 'elegant',
  mainContent: {
    type: 'image',
    src: PLACEHOLDER_CTV_MAIN
  },
  overlays: [
    {
      type: 'product',
      startFrame: 180,
      duration: 120,
      props: {
        productName: 'Featured Product',
        productImage: PLACEHOLDER_PRODUCT,
        price: '12.99',
        originalPrice: '19.99'
      }
    },
    {
      type: 'promo',
      startFrame: 340,
      duration: 100,
      props: {
        message: 'Limited Time Offer',
        textColor: '#FFFFFF'
      }
    },
    {
      type: 'lower-third',
      startFrame: 460,
      duration: 80,
      props: {
        title: 'Featured Series',
        subtitle: 'New Episodes Weekly'
      }
    }
  ],
  ctaText: 'Visit Our Store',
  legalText: '*Terms and conditions apply.',
  totalDuration: 600
};

export const CTVTemplatePreview: React.FC<CTVTemplateProps> = props => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A1A' }}>
      <CTVTemplate {...props} />
    </AbsoluteFill>
  );
};

// ─── LoopingProductPromo Previews (3 formats) ─────────────────────────────────

const PLACEHOLDER_PRODUCT_LPP =
  'https://placehold.co/600x600/1a1a3e/white?text=Product';

const loopingProductPromoBaseSlots = {
  productName: 'Fresh Blueberries 500g',
  productImage: PLACEHOLDER_PRODUCT_LPP,
  priceCurrent: '5.49',
  priceOriginal: '8.99',
  promoTag: 'SUMMER SALE',
  ctaText: 'Shop Now',
  legalText: '*Offer valid while stocks last.'
};

const loopingProductPromoBaseTiming = {
  totalDurationInFrames: 300,
  introDurationInFrames: 60,
  outroDurationInFrames: 60
};

// 16:9 (1920 × 1080)
export const loopingProductPromo16x9DefaultProps: LoopingProductPromoProps = {
  format: '16:9',
  slots: loopingProductPromoBaseSlots,
  timing: loopingProductPromoBaseTiming,
  logoPosition: 'top-left'
};

export const LoopingProductPromo16x9Preview: React.FC<
  LoopingProductPromoProps
> = props => (
  <AbsoluteFill>
    <LoopingProductPromo {...props} />
  </AbsoluteFill>
);

// 9:16 (1080 × 1920)
export const loopingProductPromo9x16DefaultProps: LoopingProductPromoProps = {
  format: '9:16',
  slots: loopingProductPromoBaseSlots,
  timing: loopingProductPromoBaseTiming,
  logoPosition: 'top-left'
};

export const LoopingProductPromo9x16Preview: React.FC<
  LoopingProductPromoProps
> = props => (
  <AbsoluteFill>
    <LoopingProductPromo {...props} />
  </AbsoluteFill>
);

// 1:1 (1080 × 1080)
export const loopingProductPromo1x1DefaultProps: LoopingProductPromoProps = {
  format: '1:1',
  slots: loopingProductPromoBaseSlots,
  timing: loopingProductPromoBaseTiming,
  logoPosition: 'top-left'
};

export const LoopingProductPromo1x1Preview: React.FC<
  LoopingProductPromoProps
> = props => (
  <AbsoluteFill>
    <LoopingProductPromo {...props} />
  </AbsoluteFill>
);

// ─── StayPromo Previews (3 formats — Airbnb brand) ────────────────────────────

const AIRBNB_HERO_IMAGE =
  'https://placehold.co/1080x920/FF5A5F/FFFFFF?text=Beautiful+Beach+House';

const stayPromoBaseSlots = {
  listingName: 'Beautiful Beach House',
  location: 'Malibu, California',
  heroImage: AIRBNB_HERO_IMAGE,
  rating: '4.92',
  reviewCount: '128 reviews',
  pricePerNight: '250',
  currency: '$',
  ctaText: 'Book now',
  legalText: '*Prices subject to availability.'
};

const stayPromoBaseTiming = {
  totalDurationInFrames: 300,
  introDurationInFrames: 60,
  outroDurationInFrames: 60
};

// 16:9 (1920 × 1080)
export const stayPromo16x9DefaultProps: StayPromoProps = {
  brandConfig: AIRBNB_BRAND_PRESET,
  format: '16:9',
  slots: stayPromoBaseSlots,
  timing: stayPromoBaseTiming
};

export const StayPromo16x9Preview: React.FC<StayPromoProps> = props => (
  <AbsoluteFill>
    <StayPromo {...props} />
  </AbsoluteFill>
);

// 9:16 (1080 × 1920)
export const stayPromo9x16DefaultProps: StayPromoProps = {
  brandConfig: AIRBNB_BRAND_PRESET,
  format: '9:16',
  slots: stayPromoBaseSlots,
  timing: stayPromoBaseTiming
};

export const StayPromo9x16Preview: React.FC<StayPromoProps> = props => (
  <AbsoluteFill>
    <StayPromo {...props} />
  </AbsoluteFill>
);

// 1:1 (1080 × 1080)
export const stayPromo1x1DefaultProps: StayPromoProps = {
  brandConfig: AIRBNB_BRAND_PRESET,
  format: '1:1',
  slots: stayPromoBaseSlots,
  timing: stayPromoBaseTiming
};

export const StayPromo1x1Preview: React.FC<StayPromoProps> = props => (
  <AbsoluteFill>
    <StayPromo {...props} />
  </AbsoluteFill>
);
