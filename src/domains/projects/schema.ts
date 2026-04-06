import { z } from 'zod';

// Projects domain validation schemas

/**
 * Aligned with backend CreateProjectDto.
 * Backend auto-sets: id, status (DRAFT), ownerId (from JWT), organizationId, isActive, timestamps.
 * Backend @Transform uppercases visibility before @IsEnum validation.
 */
export const createProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
  brandId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  templateId: z.string().uuid().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Aligned with backend UpdateProjectDto.
 * Backend @Transform uppercases status + replaces hyphens with underscores.
 */
export const updateProjectSchema = createProjectSchema.partial().extend({
  status: z
    .enum(['draft', 'in-progress', 'review', 'approved', 'archived'])
    .optional(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  frameRate: z.number().int().positive().optional(),
  resolution: z.string().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const projectSettingsSchema = z.object({
  autoSave: z.boolean(),
  notifications: z.boolean(),
  collaborationMode: z.enum(['edit', 'view', 'comment']),
  defaultBrandId: z.string().uuid().optional(),
  allowClientReview: z.boolean(),
  enableVersionControl: z.boolean(),
  maxVersions: z.number().int().min(1).max(100)
});

export type ProjectSettingsInput = z.infer<typeof projectSettingsSchema>;

export const projectMetadataSchema = z.object({
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  customFields: z.record(z.union([z.string(), z.number(), z.boolean()])),
  sourceFormat: z.string().optional(),
  outputFormats: z.array(z.string()).optional(),
  estimatedRenderTime: z.number().int().optional()
});

export type ProjectMetadataInput = z.infer<typeof projectMetadataSchema>;

export const addCollaboratorSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['owner', 'editor', 'viewer', 'commenter']),
  permissions: z.array(z.string()).optional()
});

export type AddCollaboratorInput = z.infer<typeof addCollaboratorSchema>;
