import { z } from 'zod';

// Render Jobs domain validation schemas

export const createRenderJobSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
});

export type CreateRenderJobInput = z.infer<typeof createRenderJobSchema>;

export const renderJobConfigSchema = z.object({
  resolution: z.string(),
  frameRate: z.number().positive(),
  codec: z.string(),
  bitrate: z.string().optional(),
  crf: z.number().int().min(0).max(51).optional(),
  outputFormat: z.enum([
    'mp4',
    'webm',
    'mov',
    'prores',
    'h264',
    'png-sequence'
  ]),
  duration: z.number().positive().optional(),
  timeoutMinutes: z.number().int().positive(),
  retryCount: z.number().int().min(0).max(5),
  customSettings: z.record(z.unknown()).optional()
});

export type RenderJobConfigInput = z.infer<typeof renderJobConfigSchema>;

export const createRenderBatchSchema = z.object({
  name: z.string().min(1).max(255),
  projectId: z.string().uuid(),
  jobIds: z.array(z.string().uuid()),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal')
});

export type CreateRenderBatchInput = z.infer<typeof createRenderBatchSchema>;

export const updateRenderJobStatusSchema = z.object({
  status: z.enum([
    'queued',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'paused'
  ])
});

export type UpdateRenderJobStatusInput = z.infer<
  typeof updateRenderJobStatusSchema
>;

export const renderProgressSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum([
    'queued',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'paused'
  ]),
  progress: z.number().int().min(0).max(100),
  framesCurrent: z.number().int().nonnegative().optional(),
  framesTotal: z.number().int().positive().optional(),
  estimatedTimeRemaining: z.number().int().optional(),
  speed: z.number().positive().optional(),
  currentFrame: z.number().int().nonnegative().optional(),
  logs: z.array(z.string()).optional()
});

export type RenderProgressInput = z.infer<typeof renderProgressSchema>;

export const renderErrorSchema = z.object({
  jobId: z.string().uuid(),
  errorCode: z.string(),
  errorMessage: z.string(),
  stackTrace: z.string().optional(),
  frame: z.number().int().optional(),
  isRetryable: z.boolean()
});

export type RenderErrorInput = z.infer<typeof renderErrorSchema>;

export const renderStatisticsSchema = z.object({
  organizationId: z.string().uuid(),
  period: z.enum(['today', 'week', 'month', 'year'])
});

export type RenderStatisticsInput = z.infer<typeof renderStatisticsSchema>;
