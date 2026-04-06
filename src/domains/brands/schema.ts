import { z } from 'zod';

// Brands domain validation schemas

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional()
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

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
