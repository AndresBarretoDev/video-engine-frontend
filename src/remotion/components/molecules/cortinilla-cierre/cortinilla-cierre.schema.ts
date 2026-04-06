import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const CortinillaCierreVariantSchema = z.enum([
  'standard',
  'bold',
  'minimal'
]);

export type CortinillaCierreVariant = z.infer<
  typeof CortinillaCierreVariantSchema
>;

export const CortinillaCierreSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  ctaText: z.string().min(1),
  legalText: z.string().optional(),
  variant: CortinillaCierreVariantSchema.default('standard'),
  duration: z.number().int().positive().default(90),
  format: VideoFormatSchema.default('16:9')
});

export type CortinillaCierreProps = z.infer<typeof CortinillaCierreSchema>;
