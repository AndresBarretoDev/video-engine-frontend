/**
 * OP Video Engine — Render Batch React Query Hooks
 *
 * All render-batch queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Plan: phase-4-rendering-pipeline.md — Group 1
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { RenderBatch, RenderBatchFilters } from '../types';
import type { CreateRenderBatchFromVariationsInput } from '../schema';
import { renderJobsTextMaps } from '../text-maps';
import { renderJobKeys } from './query-keys';

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List render batches for a project.
 * Polls every 10s when any batch is processing.
 */
export function useRenderBatches(
  projectId: string,
  filters?: RenderBatchFilters,
  hasProcessing: boolean = false
) {
  return useQuery({
    queryKey: renderJobKeys.batchList(projectId, filters),
    queryFn: () =>
      apiClient<RenderBatch[]>(
        API_ENDPOINTS.renderJobs.batches(projectId),
        { params: filters as Record<string, unknown> }
      ),
    enabled: !!projectId,
    staleTime: 30 * 1000,
    refetchInterval: hasProcessing ? 10 * 1000 : false,
  });
}

/**
 * Get a single render batch by ID.
 * Polls every 5s when batch is processing.
 */
export function useRenderBatch(
  projectId: string,
  batchId: string,
  isProcessing: boolean = false
) {
  return useQuery({
    queryKey: renderJobKeys.batchDetail(projectId, batchId),
    queryFn: () =>
      apiClient<RenderBatch>(
        API_ENDPOINTS.renderJobs.batchById(projectId, batchId)
      ),
    enabled: !!projectId && !!batchId,
    staleTime: 15 * 1000,
    refetchInterval: isProcessing ? 5 * 1000 : false,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create a render batch from selected Data Engine variations.
 * On success: invalidates batch list + job list for the project.
 */
export function useCreateRenderBatch(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRenderBatchFromVariationsInput) =>
      apiClient<RenderBatch>(
        API_ENDPOINTS.renderJobs.batchByProject(projectId),
        { method: 'POST', data }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.batches(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId),
      });
      toast.success(renderJobsTextMaps.batchCreated);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    },
  });
}

/**
 * Cancel all jobs in a batch.
 * On success: invalidates batch detail + job list.
 */
export function useCancelRenderBatch(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) =>
      apiClient<RenderBatch>(
        API_ENDPOINTS.renderJobs.batchCancel(projectId, batchId),
        { method: 'POST' }
      ),
    onSuccess: (_data, batchId) => {
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.batchDetail(projectId, batchId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId),
      });
      toast.success(renderJobsTextMaps.jobCancelled);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    },
  });
}

/**
 * Retry all failed jobs in a batch.
 * On success: invalidates batch detail + job list.
 */
export function useRetryFailedInBatch(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) =>
      apiClient<RenderBatch>(
        API_ENDPOINTS.renderJobs.batchRetryFailed(projectId, batchId),
        { method: 'POST' }
      ),
    onSuccess: (_data, batchId) => {
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.batchDetail(projectId, batchId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId),
      });
      toast.success(renderJobsTextMaps.jobStarted);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    },
  });
}
