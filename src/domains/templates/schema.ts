/**
 * OP Video Engine — Templates Domain Zod Schemas
 *
 * Zod@3 plain — no @remotion/zod-types, no zod@4 overrides.
 * Matches TemplateDescriptor shape from types.ts (= backend contract).
 */

import { z } from 'zod';
import { VideoFormatSchema } from '@/remotion/types/video-format.types';

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const TemplateCompositionRefSchema = z.object({
  format: VideoFormatSchema,
  compositionId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  durationInFrames: z.number().int().positive(),
  fps: z.number().int().positive()
});

// ─── Root schema ──────────────────────────────────────────────────────────────

export const TemplateDescriptorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  componentId: z.string().min(1),
  formats: z.array(TemplateCompositionRefSchema).min(1),
  thumbnailUrl: z.string().url().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TemplateDescriptorInput = z.infer<typeof TemplateDescriptorSchema>;
