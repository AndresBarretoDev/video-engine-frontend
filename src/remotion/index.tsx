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
  ctvTemplateDefaultProps
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
    </>
  );
};

registerRoot(Root);
