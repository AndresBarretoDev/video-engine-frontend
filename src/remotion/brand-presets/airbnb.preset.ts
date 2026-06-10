/**
 * Airbnb Brand Preset — Demo / Verification
 *
 * Uses publicly-known Airbnb brand tokens:
 *   - Primary coral: #FF5A5F
 *   - Background: #FFFFFF
 *   - Text: #222222 (Rausch dark)
 *   - textInverse: #FFFFFF
 *
 * Airbnb Cereal is proprietary — using Nunito as a close open-source
 * alternative (rounded humanist sans, available on Google Fonts).
 * Airbnb is characteristically very rounded — large radii throughout.
 *
 * Logo: text placeholder since no asset is available.
 *
 * TODO: conectar al selector de marca del módulo brands (futuro)
 */

import type { BrandConfig } from '@/remotion/types/brand-config.types';

export const AIRBNB_BRAND_PRESET: BrandConfig = {
  id: 'demo-airbnb',
  name: 'Airbnb',

  tokens: {
    colors: {
      primary: '#FF5A5F',
      secondary: '#00A699',
      accent: '#FC642D',
      background: '#FFFFFF',
      text: '#222222',
      textInverse: '#FFFFFF'
    },

    fonts: {
      heading: {
        family: 'Nunito, Poppins, sans-serif',
        weights: [700, 800]
      },
      body: {
        family: 'Nunito, Poppins, sans-serif',
        weights: [400, 600]
      }
    },

    animation: {
      defaultEasing: 'spring',
      defaultDuration: 24,
      springConfig: {
        // Slightly bouncier spring — fits Airbnb's playful, rounded character.
        // physics-spring-for-overshoot: use springs for settle animations.
        damping: 12,
        stiffness: 160,
        mass: 1
      }
    },

    spacing: {
      padding: 64,
      gap: 24
    },

    // Airbnb is VERY rounded — large radii are the visual signature.
    // Concentric radius rule: button outer ≈ badge + padding, image can be large.
    radius: {
      button: 40,  // pill-shaped CTAs (Airbnb signature)
      badge: 28,   // highly rounded promo tags
      image: 20    // softly rounded product images
    }
  },

  assets: {
    // No official asset available — coral text placeholder preserves brand color.
    logo: {
      url: 'https://placehold.co/240x80/FF5A5F/FFFFFF?text=airbnb',
      width: 240,
      height: 80
    },
    fonts: [
      // Nunito from Google Fonts — loadable in Remotion via staticFile or CDN
      'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'
    ]
  },

  defaults: {
    cortinillaEntrada: 'fade',
    cortinillaCierre: 'fade',
    promoBarStyle: 'bottom',
    productOverlayPosition: 'bottom-right'
  }
};
