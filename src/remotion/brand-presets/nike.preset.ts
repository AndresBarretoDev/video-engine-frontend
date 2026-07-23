/**
 * Nike Brand Preset — faithful to DESIGN-NIKE.md
 *
 * Source: templates-designs/DESIGN-NIKE.md
 *
 * Identity signature:
 *   - Monochrome: pure black (#111111) and white (#ffffff), single-gray (#f5f5f5)
 *   - Sale red (#d30005) used as accent — the ONLY chromatic moment in retail chrome
 *   - Pill CTAs ({rounded.lg} = 30px) — NO sharp-cornered buttons
 *   - SQUARE product images ({rounded.none} = 0px) — the photograph is the card
 *   - Oswald (public substitute for Futura/Helvetica Now) — bold condensed display
 *   - spacing.section = 48px canvas padding
 *   - Hairline borders (1px) at `{colors.hairline}` (#cacacb)
 *
 * Font substitute note (DESIGN-NIKE.md §Typography):
 *   "pair Inter with Bebas Neue or Anton at 96px/0.9 for campaign headline tier"
 *   We use Oswald (closer to Futura ND weight/shape) + Inter for body chrome.
 */

import type { BrandConfig } from '@/remotion/types/brand-config.types';

export const NIKE_BRAND_PRESET: BrandConfig = {
  id: 'nike',
  name: 'Nike',

  tokens: {
    colors: {
      // {colors.ink} — the brand's only "color"
      primary: '#111111',
      // {colors.soft-cloud} — most-used non-white surface
      secondary: '#f5f5f5',
      // {colors.sale} — sale red, the ONLY chromatic accent
      accent: '#d30005',
      // {colors.canvas} — pure white page background
      background: '#ffffff',
      // {colors.ink} — primary text on light surfaces
      text: '#111111',
      // {colors.on-primary} — white text on ink surfaces
      textInverse: '#ffffff',
      // {colors.soft-cloud} — product card image background / secondary surface
      surface: '#f5f5f5',
      // {colors.hairline} — 1px dividers, filter rows, footer columns
      border: '#cacacb',
      // declared legible inks per surface (no contrast math):
      textOnBackground: '#111111',
      textOnSurface: '#111111',
      textOnPrimary: '#ffffff'
    },

    fonts: {
      heading: {
        // Oswald: closest open-source substitute for Nike Futura ND / Helvetica Now Display
        // "Tighten letter-spacing slightly (-0.5%) on the substitute to approximate Futura ND's
        // optical weight." (DESIGN-NIKE.md §Typography §Note on Font Substitutes)
        family: 'Oswald, sans-serif',
        weights: [500, 700]
      },
      body: {
        // Inter: "safest substitute — match weights 400/500 and the system reads almost identically"
        family: 'Inter, sans-serif',
        weights: [400, 500]
      }
    },

    animation: {
      // Nike motion is precise and deliberate — ease-out matches the "athletic, kinetic, absolute" brand voice
      defaultEasing: 'ease-out',
      // motion_system: duration.standard ≈ 300ms = 18f @60fps
      defaultDuration: 18,
      springConfig: {
        // High damping: no bounce, matches OP-level clean settle
        // Nike video pacing is confident, not bouncy
        damping: 20,
        stiffness: 200,
        mass: 1
      }
    },

    spacing: {
      // {spacing.section} = 48px — "every page uses spacing.section as the vertical gap between
      // major content blocks" (DESIGN-NIKE.md §Layout §Spacing System)
      padding: 48,
      // {spacing.xl} = 24px — card internal gap
      gap: 16
    },

    // DESIGN-NIKE.md §Shapes:
    //   button: {rounded.lg} = 30px pill — "every CTA uses rounded.lg (30px)"
    //   badge:  {rounded.lg} = 30px pill — filter chips, promo badges
    //   image:  {rounded.none} = 0px — "cards: zero radius, zero shadow; the photograph is the card"
    radius: {
      button: 30, // pill CTAs — "Nike's primary pill is rounded.lg"
      badge: 30, // promo tag / filter chips share the pill treatment
      image: 0 // SQUARE — "product cards: zero radius" (Nike signature)
    },

    // DESIGN-NIKE.md §Elevation: "flat (no shadow) — dominant treatment"
    // Hairline border at 1px on cards/badges matches the hairline divider system.
    // Button: no visible border (filled black CTA is borderless in Nike's system)
    stroke: {
      button: 0, // filled black pill — no visible border (background = ink, border would be invisible)
      card: 1, // {colors.hairline} 1px — "hairline dividers between filter rows / card borders"
      badge: 1 // hairline on promo badge frame
    }
  },

  assets: {
    // Placeholder — white text on black, brand colors
    logo: {
      url: 'https://placehold.co/240x80/111111/FFFFFF?text=NIKE',
      width: 240,
      height: 80
    },
    fonts: [
      // Oswald (Futura ND substitute) + Inter (body chrome) from Google Fonts
      'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500&display=swap'
    ]
  },

  // Nike structural defaults:
  //   - Overlay: bottom-left ("anchor on-image CTAs at bottom-left" — DESIGN-NIKE.md §Do's)
  //   - promoBarStyle: bottom (retail convention)
  //   - cortinillaCierre: none (Nike video doesn't soft-exit; it cuts confidently)
  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'none',
    promoBarStyle: 'bottom',
    productOverlayPosition: 'bottom-left'
  }
};
