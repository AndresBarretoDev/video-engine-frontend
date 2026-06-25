import { z } from 'zod';

export const BrandTokensSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
    textInverse: z.string(),
    /**
     * Panel/card background — distinct from `background` so cards don't blend
     * into the canvas. Optional; falls back to a subtle elevation of background.
     */
    surface: z.string().optional(),
    /** Border/stroke color for buttons, cards, badges. Optional. */
    border: z.string().optional(),
    /**
     * Semantic text inks — the brand DECLARES which ink is legible on each
     * surface (no runtime contrast math). Optional; fall back to text/textInverse.
     */
    textOnBackground: z.string().optional(),
    textOnSurface: z.string().optional(),
    textOnPrimary: z.string().optional()
  }),
  fonts: z.object({
    heading: z.object({ family: z.string(), weights: z.array(z.number()) }),
    body: z.object({ family: z.string(), weights: z.array(z.number()) })
  }),
  animation: z.object({
    defaultEasing: z.enum(['spring', 'ease-out', 'ease-in-out']),
    defaultDuration: z.number().int().positive(),
    springConfig: z.object({
      damping: z.number(),
      stiffness: z.number(),
      mass: z.number()
    })
  }),
  spacing: z.object({ padding: z.number(), gap: z.number() }),
  /**
   * Border radius tokens for video components.
   * Optional — existing BrandConfig without radius falls back to neutral defaults.
   */
  radius: z
    .object({
      /** Border radius applied to CTA button (px) */
      button: z.number(),
      /** Border radius applied to promo tag / badge pill (px) */
      badge: z.number(),
      /** Border radius applied to product image frame (px) */
      image: z.number()
    })
    .optional(),
  /**
   * Border/stroke WIDTHS per element (px). A brand signature: thin+rounded reads
   * "soft", medium+square reads "technical". Optional; falls back to neutral defaults.
   */
  stroke: z
    .object({
      /** Stroke width on CTA button (px) */
      button: z.number(),
      /** Stroke width on cards/panels (px) */
      card: z.number(),
      /** Stroke width on badges/tags (px) */
      badge: z.number()
    })
    .optional()
});

export const BrandAssetsSchema = z.object({
  logo: z.object({
    url: z.string().url(),
    width: z.number(),
    height: z.number()
  }),
  logoWhite: z
    .object({ url: z.string().url(), width: z.number(), height: z.number() })
    .optional(),
  jingle: z.string().url().optional(),
  sfxTransition: z.string().url().optional(),
  fonts: z.array(z.string().url())
});

export const BrandConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  tokens: BrandTokensSchema,
  assets: BrandAssetsSchema,
  defaults: z.object({
    cortinillaEntrada: z.string(),
    cortinillaCierre: z.string(),
    promoBarStyle: z.enum(['top', 'bottom']),
    productOverlayPosition: z.enum(['bottom-right', 'bottom-left', 'center'])
  })
});

export type BrandTokens = z.infer<typeof BrandTokensSchema>;
export type BrandAssets = z.infer<typeof BrandAssetsSchema>;
export type BrandConfig = z.infer<typeof BrandConfigSchema>;
