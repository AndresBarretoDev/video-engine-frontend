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

// NOTE (Phase 4): the data-driven polling below is correct by construction, but
// has NOT been visually validated end-to-end because the backend currently
// completes renders near-instantly (jobs jump straight to a terminal state, with
// no observable pending/processing window). Re-verify the live progress UX once
// the backend produces real, slower renders that actually serve their output files.

/**
 * List render batches for a project.
 * Polls every 10s while ANY batch is still active (pending/processing).
 *
 * The poll cadence is derived from the query's OWN data so the caller never has
 * to pass a flag computed from data that doesn't exist yet on first render.
 * `forcePolling` is an optional override to keep polling on regardless.
 */
export function useRenderBatches(
  projectId: string,
  filters?: RenderBatchFilters,
  forcePolling: boolean = false
) {
  return useQuery({
    queryKey: renderJobKeys.batchList(projectId, filters),
    queryFn: () =>
      apiClient<RenderBatch[]>(API_ENDPOINTS.renderJobs.batches(projectId), {
        params: filters as Record<string, unknown>
      }),
    enabled: !!projectId,
    staleTime: 30 * 1000,
    refetchInterval: query => {
      const data = query.state.data;
      const anyActive =
        Array.isArray(data) &&
        data.some(b => b.status === 'pending' || b.status === 'processing');
      return forcePolling || anyActive ? 10 * 1000 : false;
    }
  });
}

/**
 * Get a single render batch by ID.
 * Polls every 5s while the batch is still active (pending/processing).
 *
 * Cadence is derived from the query's own data (see useRenderBatches).
 * `forcePolling` is an optional override.
 */
export function useRenderBatch(
  projectId: string,
  batchId: string,
  forcePolling: boolean = false
) {
  return useQuery({
    queryKey: renderJobKeys.batchDetail(projectId, batchId),
    queryFn: () =>
      apiClient<RenderBatch>(
        API_ENDPOINTS.renderJobs.batchById(projectId, batchId)
      ),
    enabled: !!projectId && !!batchId,
    staleTime: 15 * 1000,
    refetchInterval: query => {
      const status = query.state.data?.status;
      const active = status === 'pending' || status === 'processing';
      return forcePolling || active ? 5 * 1000 : false;
    }
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
        queryKey: renderJobKeys.batches(projectId)
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId)
      });
      toast.success(renderJobsTextMaps.batchCreated);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    }
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
        queryKey: renderJobKeys.batchDetail(projectId, batchId)
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId)
      });
      toast.success(renderJobsTextMaps.jobCancelled);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    }
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
        queryKey: renderJobKeys.batchDetail(projectId, batchId)
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId)
      });
      toast.success(renderJobsTextMaps.jobStarted);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    }
  });
}
