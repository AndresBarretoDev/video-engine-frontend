/**
 * OP Brand Preset — Omnicom Production
 *
 * Tokens derived exclusively from the Vibe Coding design system JSONs:
 *   - colors:    src/styles/tokens/source/colors_system.json
 *   - typography: src/styles/tokens/source/typography_system.json
 *   - radius:    src/styles/tokens/source/strokes_and_radius_system.json
 *   - spacing:   src/styles/tokens/source/spacing_system.json
 *   - motion:    src/styles/tokens/source/motion_system.json
 *
 * Colors (raw_colors.op_blue):
 *   - Primary:     op_blue_600_principal = #4361EF
 *   - Secondary:   op_blue_500           = #6689F4
 *   - Accent:      op_blue_700           = #2C40E4
 *   - Background:  level_1.background    = #080808 (dark canvas — OP is a dark-first brand)
 *   - Text:        level_1.contrast      = #F5F5F5
 *   - TextInverse: #FFFFFF (white — used on dark button labels / price badges)
 *
 * Typography: Mulish (OP font, weights 400/700/800 from Google Fonts)
 *
 * Radius (strokes_and_radius_system.json):
 *   - button: radius-10 = 10px (modern button standard)
 *   - badge:  radius-8  = 8px  (standard UI badge / tag)
 *   - image:  radius-12 = 12px (card/container standard)
 *
 * Spacing (spacing_system.json):
 *   - padding: container.padding.spacious = 32
 *   - gap:     card.gap.xl               = 24
 *
 * Spring config (motion_system.json):
 *   - OP motion is clean, not bouncy.
 *   - ui easing: cubic-bezier(0.2, 0, 0, 1) → translated to spring: damping=20, stiffness=200
 *   - duration.standard = 300ms (≈18f @60fps) → defaultDuration=18
 *
 * TODO: conectar al selector de marca del módulo brands (futuro)
 */

import type { BrandConfig } from '@/remotion/types/brand-config.types';

export const OP_BRAND_PRESET: BrandConfig = {
  id: 'op-brand',
  name: 'OP — Omnicom Production',

  tokens: {
    colors: {
      // op_blue_600_principal — the OP blue signature
      primary: '#4361EF',
      // op_blue_500 — secondary/hover state of the primary
      secondary: '#6689F4',
      // op_blue_700 — darker accent for depth
      accent: '#2C40E4',
      // level_1.background — OP is dark-first; the video canvas is near-black
      background: '#080808',
      // level_1.contrast — primary text on dark surface
      text: '#F5F5F5',
      // pure white for text on colored (blue) surfaces — badges, CTA labels
      textInverse: '#FFFFFF',
      // general_surfaces.level_2.background / card.background — cards sit above the canvas
      surface: '#0D0D0D',
      // component.stroke.default_light — the design system's documented stroke color
      border: '#DCDCDC',
      // declared legible inks per surface (from the design system, no contrast math):
      // level_1.contrast on the canvas, card.foreground on the card surface.
      textOnBackground: '#F5F5F5',
      textOnSurface: '#FFFFFF',
      textOnPrimary: '#FFFFFF'
    },

    fonts: {
      heading: {
        // Mulish — the OP design system font. ExtoBold (800) for display, Bold (700) for headings.
        family: 'Mulish, sans-serif',
        weights: [700, 800]
      },
      body: {
        family: 'Mulish, sans-serif',
        weights: [400, 500]
      }
    },

    animation: {
      // OP motion is precise and deliberate — ui easing (cubic-bezier(0.2,0,0,1))
      // Spring equivalent: higher damping (less bounce), medium stiffness.
      // motion_system: duration.standard = 300ms ≈ 18 frames @60fps
      defaultEasing: 'spring',
      defaultDuration: 18,
      springConfig: {
        // Clean settle, zero overshoot — matches OP's ui easing (cubic-bezier 0.2,0,0,1)
        // High damping: 20 → no bounce, matches the "clean and modern" easing curve.
        // Stiffness: 200 → responsive without feeling mechanical.
        damping: 20,
        stiffness: 200,
        mass: 1
      }
    },

    spacing: {
      // container.padding.spacious = 32 (used as canvas-level padding in video components)
      padding: 32,
      // card.gap.xl = 24 (element-to-element gap within the layout)
      gap: 24
    },

    // Border radius from strokes_and_radius_system.json
    // Concentric rule: outer container (card) = radius-12, inner elements smaller.
    radius: {
      // radius-10: "Variante moderna para botones medianos/grandes."
      button: 10,
      // radius-8: "Estándar UI: Botones pequeños, Inputs, Cards densas." — for badges/tags
      badge: 8,
      // radius-12: "Estándar UI: Cards principales, Modales, Contenedores de sección."
      image: 12
    },

    // strokes_and_radius_system.json usage rules: default_border = stroke-thin (1px),
    // outline button / focus = stroke-medium (2px). OP separates by surface, thin borders.
    stroke: {
      button: 2, // medium — outline CTA
      card: 1, // thin — card hairline (surface does the separation)
      badge: 1 // thin
    }
  },

  assets: {
    // OP Blue logo placeholder — dark background, white OP text, brand blue border
    logo: {
      url: 'https://placehold.co/240x80/4361EF/FFFFFF?text=OP',
      width: 240,
      height: 80
    },
    // Mulish from Google Fonts — loadable in Remotion via staticFile or CDN
    fonts: [
      'https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;700;800&display=swap'
    ]
  },

  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'fade',
    promoBarStyle: 'bottom',
    productOverlayPosition: 'bottom-right'
  }
};
