import { z } from 'zod';

export const BrandTokensSchema = z.object({
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string(),
    textInverse: z.string()
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
  spacing: z.object({ padding: z.number(), gap: z.number() })
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
