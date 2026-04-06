import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';
import { BrandConfigSchema } from '@/remotion/types/brand-config.types';
import { CortinillaEntradaVariantSchema } from '@/remotion/components/molecules/cortinilla-entrada/cortinilla-entrada.schema';

export const MainContentSchema = z.object({
  type: z.enum(['video', 'image']),
  src: z.string(),
  objectFit: z.enum(['cover', 'contain']).default('cover')
});

export type MainContent = z.infer<typeof MainContentSchema>;

export const ProductPropsSchema = z.object({
  name: z.string().min(1),
  image: z.string(),
  price: z.string().min(1),
  originalPrice: z.string().optional()
});

export type ProductProps = z.infer<typeof ProductPropsSchema>;

export const PromoVideoTemplateSchema = z.object({
  brandConfig: BrandConfigSchema.optional(),
  format: VideoFormatSchema.default('16:9'),
  introDuration: z.number().int().positive().default(90),
  outroDuration: z.number().int().positive().default(90),
  introVariant: CortinillaEntradaVariantSchema.default('minimal'),
  mainContent: MainContentSchema,
  product: ProductPropsSchema.optional(),
  promoMessage: z.string().optional(),
  ctaText: z.string().default('Visit us'),
  legalText: z.string().optional(),
  totalDuration: z.number().int().positive().default(300)
});

export type PromoVideoTemplateProps = z.infer<typeof PromoVideoTemplateSchema>;
