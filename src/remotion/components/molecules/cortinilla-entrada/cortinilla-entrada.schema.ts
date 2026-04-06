import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';

export const CortinillaEntradaVariantSchema = z.enum([
  'minimal',
  'energetic',
  'elegant'
]);

export type CortinillaEntradaVariant = z.infer<
  typeof CortinillaEntradaVariantSchema
>;

export const CortinillaEntradaSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  claim: z.string().optional(),
  variant: CortinillaEntradaVariantSchema.default('minimal'),
  duration: z.number().int().positive().default(90),
  format: VideoFormatSchema.default('16:9')
});

export type CortinillaEntradaProps = z.infer<typeof CortinillaEntradaSchema>;
