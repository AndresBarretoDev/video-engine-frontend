import { z } from 'zod';

export const FruitCrateSchema = z.object({
  productName: z.string(),
  price: z.string(),
  imageSrc: z.string(),
  audioSrc: z.string().optional(),
  promoCopy: z.string().optional(),
  originalPrice: z.string().optional(),
  weight: z.string().optional(),
  durationSeconds: z.number().optional()
});

export const PreparedFoodSchema = z.object({
  productName: z.string(),
  price: z.string(),
  packshotUrl: z.string(),
  audioSrc: z.string().optional(),
  promoCopy: z.string().optional(),
  originalPrice: z.string().optional(),
  weight: z.string().optional(),
  durationSeconds: z.number().optional()
});

export const GardenSchema = z.object({
  productName: z.string(),
  price: z.string(),
  imageSrc: z.string(),
  audioSrc: z.string().optional(),
  promoCopy: z.string().optional(),
  originalPrice: z.string().optional(),
  weight: z.string().optional(),
  durationSeconds: z.number().optional()
});

export type FruitCrateProps = z.infer<typeof FruitCrateSchema>;
export type PreparedFoodProps = z.infer<typeof PreparedFoodSchema>;
export type GardenProps = z.infer<typeof GardenSchema>;
