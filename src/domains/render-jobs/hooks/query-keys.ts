/**
 * OP Video Engine — Render Jobs Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All render-job-related queries MUST use these keys for proper cache invalidation.
 */

import type { RenderJobFilters, RenderBatchFilters } from '../types';

export const renderJobKeys = {
  all: (projectId: string) => ['render-jobs', projectId] as const,

  // Jobs
  lists: (projectId: string) =>
    [...renderJobKeys.all(projectId), 'list'] as const,
  list: (projectId: string, filters?: RenderJobFilters) =>
    [...renderJobKeys.lists(projectId), filters ?? {}] as const,
  details: () => ['render-jobs', 'detail'] as const,
  detail: (jobId: string) => [...renderJobKeys.details(), jobId] as const,
  progress: (jobId: string) =>
    ['render-jobs', 'progress', jobId] as const,

  // Batches
  batches: (projectId: string) =>
    [...renderJobKeys.all(projectId), 'batches'] as const,
  batchList: (projectId: string, filters?: RenderBatchFilters) =>
    [...renderJobKeys.batches(projectId), filters ?? {}] as const,
  batchDetail: (projectId: string, batchId: string) =>
    [...renderJobKeys.batches(projectId), batchId] as const,

  // Outputs
  outputs: (jobId: string) => ['render-jobs', 'outputs', jobId] as const,
};
