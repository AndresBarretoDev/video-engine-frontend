/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import {
  TextBlockPreview,
  textBlockDefaultProps,
  PricePatchPreview,
  pricePatchDefaultProps,
  LogoRevealPreview,
  logoRevealDefaultProps,
  ImageFramePreview,
  imageFrameDefaultProps,
  ShapeElementPreview,
  shapeElementDefaultProps,
  SubtitleTrackPreview,
  subtitleTrackDefaultProps
} from './compositions/atom-previews';
import {
  FormatShowcase,
  formatShowcaseDefaultProps
} from './compositions/format-showcase';
import {
  CortinillaEntradaPreview,
  cortinillaEntradaDefaultProps,
  ProductOverlayPreview,
  productOverlayDefaultProps,
  PromoBarPreview,
  promoBarDefaultProps,
  LowerThirdPreview,
  lowerThirdDefaultProps
} from './compositions/molecule-previews';
import {
  PromoVideoTemplatePreview,
  promoVideoTemplateDefaultProps,
  StoryTemplatePreview,
  storyTemplateDefaultProps,
  BannerVideoTemplatePreview,
  bannerVideoTemplateDefaultProps,
  CTVTemplatePreview,
  ctvTemplateDefaultProps,
  LoopingProductPromo16x9Preview,
  loopingProductPromo16x9DefaultProps,
  LoopingProductPromo9x16Preview,
  loopingProductPromo9x16DefaultProps,
  LoopingProductPromo1x1Preview,
  loopingProductPromo1x1DefaultProps,
  StayPromo16x9Preview,
  stayPromo16x9DefaultProps,
  StayPromo9x16Preview,
  stayPromo9x16DefaultProps,
  StayPromo1x1Preview,
  stayPromo1x1DefaultProps
} from './compositions/organism-previews';
import { CortinillaEntradaSchema } from './components/molecules/cortinilla-entrada/cortinilla-entrada.schema';
import { ProductOverlaySchema } from './components/molecules/product-overlay/product-overlay.schema';
import { PromoBarSchema } from './components/molecules/promo-bar/promo-bar.schema';
import { LowerThirdSchema } from './components/molecules/lower-third/lower-third.schema';
import { TextBlockSchema } from './components/atoms/text-block/text-block.schema';
import { PricePatchSchema } from './components/atoms/price-patch/price-patch.schema';
import { LogoRevealSchema } from './components/atoms/logo-reveal/logo-reveal.schema';
import { ImageFrameSchema } from './components/atoms/image-frame/image-frame.schema';
import { ShapeElementSchema } from './components/atoms/shape-element/shape-element.schema';
import { SubtitleTrackSchema } from './components/atoms/subtitle-track/subtitle-track.schema';
import { PromoVideoTemplateSchema } from './components/organisms/promo-video-template/promo-video-template.schema';
import { StoryTemplateSchema } from './components/organisms/story-template/story-template.schema';
import { BannerVideoTemplateSchema } from './components/organisms/banner-video-template/banner-video-template.schema';
import { CTVTemplateSchema } from './components/organisms/ctv-template/ctv-template.schema';
// SPIKE — Creative Studio keystone proof (delete after verdict)
import {
  SpikeRemotionComposition,
  spikeRemotionSchema,
  spikeRemotionDefaultProps
} from '../_spike-creative-studio/SpikeRemotion';

export const Root: React.FC = () => {
  return (
    <>
      {/* ─── Atom Previews ──────────────────────────────────────────────── */}

      <Composition
        id="atom-text-block"
        component={TextBlockPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={TextBlockSchema}
        defaultProps={textBlockDefaultProps}
      />

      <Composition
        id="atom-price-patch"
        component={PricePatchPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={PricePatchSchema}
        defaultProps={pricePatchDefaultProps}
      />

      <Composition
        id="atom-logo-reveal"
        component={LogoRevealPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={LogoRevealSchema}
        defaultProps={logoRevealDefaultProps}
      />

      <Composition
        id="atom-image-frame"
        component={ImageFramePreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={ImageFrameSchema}
        defaultProps={imageFrameDefaultProps}
      />

      <Composition
        id="format-showcase"
        component={FormatShowcase as any}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={formatShowcaseDefaultProps}
      />

      <Composition
        id="atom-shape-element"
        component={ShapeElementPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={ShapeElementSchema}
        defaultProps={shapeElementDefaultProps}
      />

      {/*
        atom-video-clip: VideoClip requires a real video URL for Remotion Studio preview.
        Register manually with a valid src when testing.
      */}

      {/*
        atom-audio-track: AudioTrack has no visual output.
        Verify via Remotion's timeline audio visualizer in a real composition.
      */}

      <Composition
        id="atom-subtitle-track"
        component={SubtitleTrackPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={SubtitleTrackSchema}
        defaultProps={subtitleTrackDefaultProps}
      />

      {/* ─── Molecule Previews ───────────────────────────────────────────────── */}

      <Composition
        id="molecule-cortinilla-entrada"
        component={CortinillaEntradaPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={CortinillaEntradaSchema}
        defaultProps={cortinillaEntradaDefaultProps}
      />

      <Composition
        id="molecule-product-overlay"
        component={ProductOverlayPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={ProductOverlaySchema}
        defaultProps={productOverlayDefaultProps}
      />

      <Composition
        id="molecule-promo-bar"
        component={PromoBarPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={PromoBarSchema}
        defaultProps={promoBarDefaultProps}
      />

      <Composition
        id="molecule-lower-third"
        component={LowerThirdPreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={LowerThirdSchema}
        defaultProps={lowerThirdDefaultProps}
      />

      {/* ─── Organism Previews ───────────────────────────────────────────────── */}

      <Composition
        id="organism-promo-video-template"
        component={PromoVideoTemplatePreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={PromoVideoTemplateSchema}
        defaultProps={promoVideoTemplateDefaultProps}
      />

      <Composition
        id="organism-story-template"
        component={StoryTemplatePreview}
        durationInFrames={270}
        fps={30}
        width={1080}
        height={1920}
        schema={StoryTemplateSchema}
        defaultProps={storyTemplateDefaultProps}
      />

      <Composition
        id="organism-banner-video-template"
        component={BannerVideoTemplatePreview}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={BannerVideoTemplateSchema}
        defaultProps={bannerVideoTemplateDefaultProps}
      />

      <Composition
        id="organism-ctv-template"
        component={CTVTemplatePreview}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        schema={CTVTemplateSchema}
        defaultProps={ctvTemplateDefaultProps}
      />

      {/* SPIKE — same SpikeProductCard component, rendered in Remotion (delete after verdict) */}
      <Composition
        id="spike-product-card"
        component={SpikeRemotionComposition}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
        schema={spikeRemotionSchema}
        defaultProps={spikeRemotionDefaultProps}
      />

      {/* ─── LoopingProductPromo — 3 formats ──────────────────────────────── */}
      {/*
        NOTE (zod@3 / Composition schema prop):
        LoopingProductPromoSchema is zod@3. All existing organism schemas in this
        file (PromoVideoTemplateSchema etc.) are also zod@3 and are passed via
        schema={...} without issues at Remotion 4.0.443.
        The schema prop is used by Remotion Studio for UI editing only.
        Vitest validates props via the schema independently (no Remotion runtime).
        Decision: pass schema={...} as-is (same as other organisms). If a future
        Remotion upgrade enforces zod@4 for the schema prop, remove schema here
        and document as a pending decision — do NOT add a pnpm override.
      */}

      <Composition
        id="looping-product-promo-16-9"
        component={LoopingProductPromo16x9Preview as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={loopingProductPromo16x9DefaultProps}
      />

      <Composition
        id="looping-product-promo-9-16"
        component={LoopingProductPromo9x16Preview as any}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={loopingProductPromo9x16DefaultProps}
      />

      <Composition
        id="looping-product-promo-1-1"
        component={LoopingProductPromo1x1Preview as any}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={loopingProductPromo1x1DefaultProps}
      />

      {/* ─── StayPromo (Airbnb) — 3 formats ──────────────────────────────── */}
      {/*
        Template 2: StayPromo — Airbnb-style property / listing promotional video.
        Layout: hero image (dominant) + info card (name, location, rating, price/night, CTA).
        Split-screen (16:9) vs. stacked (9:16 / 1:1) — DIFFERENT from LoopingProductPromo.
        Brand: AIRBNB_BRAND_PRESET (coral #FF5A5F, Nunito, pill radii).
      */}

      <Composition
        id="stay-promo-16-9"
        component={StayPromo16x9Preview as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={stayPromo16x9DefaultProps}
      />

      <Composition
        id="stay-promo-9-16"
        component={StayPromo9x16Preview as any}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={stayPromo9x16DefaultProps}
      />

      <Composition
        id="stay-promo-1-1"
        component={StayPromo1x1Preview as any}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={stayPromo1x1DefaultProps}
      />
    </>
  );
};

registerRoot(Root);
