import { z } from 'zod';

// Brands domain validation schemas

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  logoUrl: z.string().url().optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

const hexColorField = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color').optional().or(z.literal(''));

export const customColorSchema = z.object({
  name: z.string().min(1, 'Color name is required').max(50),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
});

export type CustomColorInput = z.infer<typeof customColorSchema>;

export const brandTokensEditSchema = z.object({
  // ─── Core colors ──────────────────────────────────────────────────────────
  colorPrimary: hexColorField,
  colorSecondary: hexColorField,
  colorAccent: hexColorField,
  customColors: z.array(customColorSchema).optional(),

  // ─── Surfaces & semantic text inks ────────────────────────────────────────
  colorSurface: hexColorField,
  colorBorder: hexColorField,
  colorTextOnBackground: hexColorField,
  colorTextOnSurface: hexColorField,
  colorTextOnPrimary: hexColorField,

  // ─── Shape — radius (px, non-negative) ────────────────────────────────────
  radiusButton: z.number().nonnegative().optional(),
  radiusBadge: z.number().nonnegative().optional(),
  radiusImage: z.number().nonnegative().optional(),

  // ─── Shape — stroke widths (px, non-negative) ─────────────────────────────
  strokeButton: z.number().nonnegative().optional(),
  strokeCard: z.number().nonnegative().optional(),
  strokeBadge: z.number().nonnegative().optional(),

  // ─── Structure — cortinilla transitions ───────────────────────────────────
  cortinillaEntrada: z.enum(['fade', 'none', 'slide']).optional(),
  cortinillaCierre: z.enum(['fade', 'none', 'slide']).optional(),

  // ─── Structure — layout selectors ─────────────────────────────────────────
  promoBarStyle: z.enum(['top', 'bottom']).optional(),
  productOverlayPosition: z.enum(['bottom-right', 'bottom-left', 'center']).optional(),

  // ─── Typography ───────────────────────────────────────────────────────────
  fontHeading: z.string().max(100).optional(),
  fontBody: z.string().max(100).optional(),

  // ─── Font asset URLs (comma or newline-separated CSS stylesheet URLs) ──────
  fontUrls: z.string().max(2000).optional(),
});

export type BrandTokensEditInput = z.infer<typeof brandTokensEditSchema>;

export const brandTokensSchema = z.object({
  colorPrimary: z.string().regex(/^#[0-9A-F]{6}$/i),
  colorSecondary: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  colorAccent: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  colorNeutral: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
  fontFamilyHeading: z.string(),
  fontFamilyBody: z.string(),
  fontSizeBase: z.number().positive(),
  lineHeightBase: z.number().positive(),
  borderRadiusBase: z.number().nonnegative(),
  spacingBase: z.number().positive(),
  customTokens: z.record(z.union([z.string(), z.number()])).optional()
});

export type BrandTokensInput = z.infer<typeof brandTokensSchema>;

export const brandColorsSchema = z.object({
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string().regex(/^#[0-9A-F]{6}$/i),
      rgb: z.string().optional(),
      usage: z.array(z.string()).optional()
    })
  )
});

export type BrandColorsInput = z.infer<typeof brandColorsSchema>;

export const brandDefaultsSchema = z.object({
  defaultResolution: z.string(),
  defaultFrameRate: z.number().positive(),
  defaultDuration: z.number().positive(),
  defaultAspectRatio: z.string(),
  defaultOutputFormat: z.string(),
  watermarkEnabled: z.boolean(),
  watermarkPosition: z.enum([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'center'
  ]),
  watermarkOpacity: z.number().min(0).max(1)
});

export type BrandDefaultsInput = z.infer<typeof brandDefaultsSchema>;

export const clientBrandProfileSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  industry: z.string().optional(),
  brandGuidelinesUrl: z.string().url().optional(),
  contactPerson: z.string().optional()
});

export type ClientBrandProfileInput = z.infer<typeof clientBrandProfileSchema>;
