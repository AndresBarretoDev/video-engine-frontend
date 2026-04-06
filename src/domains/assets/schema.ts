import { z } from 'zod';

// Assets domain validation schemas

export const uploadAssetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  type: z.enum(['image', 'video', 'audio', 'font', 'document']),
  category: z
    .enum([
      'logo',
      'background',
      'footage',
      'music',
      'sfx',
      'graphic',
      'font',
      'other'
    ])
    .optional(),
  brandId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional()
});

export type UploadAssetInput = z.infer<typeof uploadAssetSchema>;

export const assetFiltersSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'font', 'document']).optional(),
  category: z
    .enum([
      'logo',
      'background',
      'footage',
      'music',
      'sfx',
      'graphic',
      'font',
      'other'
    ])
    .optional(),
  brandId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  status: z
    .enum(['uploading', 'ready', 'processing', 'failed', 'archived'])
    .optional(),
  searchQuery: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type AssetFiltersInput = z.infer<typeof assetFiltersSchema>;

export const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentFolderId: z.string().uuid().optional()
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const updateAssetSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  category: z
    .enum([
      'logo',
      'background',
      'footage',
      'music',
      'sfx',
      'graphic',
      'font',
      'other'
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional()
});

export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

export const brandAssetsSchema = z.object({
  brandId: z.string().uuid(),
  logos: z.array(z.string().uuid()),
  fonts: z.array(z.string().uuid()),
  backgroundImages: z.array(z.string().uuid())
});

export type BrandAssetsInput = z.infer<typeof brandAssetsSchema>;
