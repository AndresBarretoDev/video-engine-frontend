import { z } from 'zod';

// Components Registry domain validation schemas

export const registerComponentSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  type: z.enum(['atom', 'molecule', 'organism', 'template']),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sourceUrl: z.string().url().optional(),
  documentation: z.string().optional()
});

export type RegisterComponentInput = z.infer<typeof registerComponentSchema>;

export const componentPropSchemaSchema = z.object({
  type: z.enum(['string', 'number', 'boolean', 'array', 'object', 'enum']),
  required: z.boolean(),
  default: z.unknown().optional(),
  description: z.string().optional(),
  enum: z.array(z.unknown()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional()
});

export type ComponentPropSchemaInput = z.infer<
  typeof componentPropSchemaSchema
>;

export const componentPropsSchema = z.object({
  schema: z.record(componentPropSchemaSchema)
});

export type ComponentPropsInput = z.infer<typeof componentPropsSchema>;

export const componentPreviewSchema = z.object({
  previewFrames: z.array(
    z.object({
      url: z.string().url(),
      timestamp: z.number().nonnegative()
    })
  ),
  videoUrl: z.string().url().optional(),
  duration: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive()
});

export type ComponentPreviewInput = z.infer<typeof componentPreviewSchema>;

export const componentPresetSchema = z.object({
  name: z.string().min(1).max(255),
  componentId: z.string().uuid(),
  presetProps: z.record(z.unknown()),
  description: z.string().optional(),
  thumbnail: z.string().url().optional()
});

export type ComponentPresetInput = z.infer<typeof componentPresetSchema>;

export const componentLibrarySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  version: z.string()
});

export type ComponentLibraryInput = z.infer<typeof componentLibrarySchema>;
