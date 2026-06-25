/**
 * Airbnb Brand Preset — faithful to DESIGN-AIRBNB.md
 *
 * Source: templates-designs/DESIGN-AIRBNB.md
 *
 * Identity signature:
 *   - Single voltage: Rausch (#ff385c) on a pure white canvas (#ffffff)
 *   - Deep near-black ink (#222222) — never pure black
 *   - Surface Soft (#f7f7f7) for cards / info panels
 *   - Hairline borders (#dddddd) — soft light-gray, consistent with the card/search divider system
 *   - Softly rounded: button 8px ({rounded.sm}), badges pill, cards 14px ({rounded.md})
 *   - Custom Cereal VF → Inter substitute (open source, closest match)
 *   - Generous 64px section padding ({spacing.section})
 *   - Playful spring animation — "slightly bouncier fits Airbnb's playful, rounded character"
 *
 * Font substitute note (DESIGN-AIRBNB.md §Typography §Note on Font Substitutes):
 *   "If Airbnb Cereal VF and Circular are unavailable, Inter is the closest open-source
 *   substitute."
 */

import type { BrandConfig } from '@/remotion/types/brand-config.types';

export const AIRBNB_BRAND_PRESET: BrandConfig = {
  id: 'demo-airbnb',
  name: 'Airbnb',

  tokens: {
    colors: {
      // {colors.primary} — "Rausch" — the single brand voltage
      primary: '#ff385c',
      // {colors.ink} — deep near-black secondary text color
      secondary: '#222222',
      // Accent = same as primary (Rausch is the only brand accent)
      accent: '#ff385c',
      // {colors.canvas} — pure white page floor
      background: '#ffffff',
      // {colors.ink} — dominant text on light surfaces
      text: '#222222',
      // {colors.on-primary} — white text on Rausch CTAs
      textInverse: '#ffffff',
      // {colors.surface-soft} — "lightest fill — disabled fields, search filter band"
      // Used as card/panel background to separate from white canvas
      surface: '#f7f7f7',
      // {colors.hairline} — "default 1px border tone: search bar dividers, card borders"
      border: '#dddddd',
      // declared legible inks per surface (no contrast math):
      textOnBackground: '#222222',
      textOnSurface: '#222222',
      textOnPrimary: '#ffffff'
    },

    fonts: {
      heading: {
        // Inter — "closest open-source substitute for Airbnb Cereal VF"
        // Weights: display 600/700 (DESIGN-AIRBNB.md uses 500–700 range for display)
        family: 'Inter, sans-serif',
        weights: [600, 700]
      },
      body: {
        family: 'Inter, sans-serif',
        weights: [400, 500]
      }
    },

    animation: {
      // DESIGN-AIRBNB.md §Components: "spring pop — bouncy entry fits Airbnb's playful character"
      // "physics-spring-for-overshoot: use springs for settle animations"
      defaultEasing: 'spring',
      // Airbnb videos feel unhurried and editorial — 24 frames (~400ms @60fps)
      defaultDuration: 24,
      springConfig: {
        // Slightly bouncier spring — Airbnb's friendly, rounded character
        // damping 12 → some overshoot / light bounce; lower than OP's 20
        damping: 12,
        stiffness: 160,
        mass: 1
      }
    },

    spacing: {
      // {spacing.section} = 64px — "generous but not airy enough to feel editorial-magazine"
      // DESIGN-AIRBNB.md §Layout §Spacing System: "section padding (vertical): 64px"
      padding: 64,
      // {spacing.base} = 16px — "gutters between cards in the homepage city grid"
      gap: 16
    },

    // DESIGN-AIRBNB.md §Shapes (rounded scale):
    //   button: {rounded.sm} = 8px — "button-primary has 8px radius"
    //   badge:  {rounded.full} = 9999px — pill badges (guest-favorite, new-tag)
    //   image:  {rounded.md} = 14px — "property cards: ~14px corner clipping"
    radius: {
      button: 8,    // {rounded.sm} — primary CTA button
      badge: 9999,  // {rounded.full} — pill badges (guest-favorite, new-tag, category chips)
      image: 14     // {rounded.md} — property card photo corners
    },

    // DESIGN-AIRBNB.md §Elevation: one shadow tier + flat baseline.
    // All borders use {colors.hairline} (#dddddd) at 1px.
    // Button: 1px border (button-secondary has 1px ink outline; primary has no border but
    // we apply hairline for consistency with the brand's soft visual language)
    stroke: {
      button: 1, // hairline on button border (primary filled) — brand-soft treatment
      card: 1,   // "1px hairline: search bar dividers, card borders" — standard Airbnb border
      badge: 1   // hairline on badge frame
    }
  },

  assets: {
    // Placeholder — Rausch color background, white text
    logo: {
      url: 'https://placehold.co/240x80/ff385c/FFFFFF?text=airbnb',
      width: 240,
      height: 80
    },
    fonts: [
      // Inter from Google Fonts — Cereal VF substitute
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]
  },

  // Airbnb structural defaults — deliberately DIFFERENT from OP and Nike
  // so switching brand visibly changes the skeleton (Level 2):
  //   - promoBarStyle: 'top' — Airbnb surfaces context/category at the top
  //   - productOverlayPosition: 'center' — listing hero is center-focused
  //   - cortinillaCierre: 'fade' — Airbnb videos close gently (vs Nike's hard cut)
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'fade',
    promoBarStyle: 'top',
    productOverlayPosition: 'center'
  }
};
