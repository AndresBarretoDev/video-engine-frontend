/**
 * OP Video Engine — Render Jobs React Query Hooks
 *
 * All render-job queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Plan: phase-4-rendering-pipeline.md — Group 1
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  RenderJob,
  RenderJobFilters,
  RenderProgress,
  RenderOutput,
} from '../types';
import { renderJobsTextMaps } from '../text-maps';
import { renderJobKeys } from './query-keys';

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List render jobs for a project with optional filters.
 * staleTime: 30s — jobs change frequently during rendering.
 */
export function useRenderJobs(projectId: string, filters?: RenderJobFilters) {
  return useQuery({
    queryKey: renderJobKeys.list(projectId, filters),
    queryFn: () =>
      apiClient<RenderJob[]>(API_ENDPOINTS.renderJobs.byProject(projectId), {
        params: filters as Record<string, unknown>,
      }),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

/**
 * Get a single render job by ID.
 */
export function useRenderJob(jobId: string) {
  return useQuery({
    queryKey: renderJobKeys.detail(jobId),
    queryFn: () =>
      apiClient<RenderJob>(API_ENDPOINTS.renderJobs.byId(jobId)),
    enabled: !!jobId,
    staleTime: 30 * 1000,
  });
}

/**
 * Poll render job progress.
 * refetchInterval: 3s when enabled (job is processing).
 * Disable polling when job is in a terminal state.
 */
export function useRenderProgress(jobId: string, enabled: boolean = false) {
  return useQuery({
    queryKey: renderJobKeys.progress(jobId),
    queryFn: () =>
      apiClient<RenderProgress>(API_ENDPOINTS.renderJobs.progress(jobId)),
    enabled: !!jobId && enabled,
    refetchInterval: enabled ? 3 * 1000 : false,
    staleTime: 0,
  });
}

/**
 * Get outputs for a completed render job.
 * Pass enabled=true only once the job status is 'completed' to avoid
 * premature requests that would return empty/404 and fill the cache with stale data.
 */
export function useRenderOutputs(jobId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: renderJobKeys.outputs(jobId),
    queryFn: () =>
      apiClient<RenderOutput[]>(API_ENDPOINTS.renderJobs.outputs(jobId)),
    enabled: !!jobId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Cancel a render job.
 * On success: invalidates job detail + project job list.
 */
export function useCancelRenderJob(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient<RenderJob>(API_ENDPOINTS.renderJobs.cancel(jobId), {
        method: 'POST',
      }),
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.detail(jobId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.batches(projectId),
      });
      toast.success(renderJobsTextMaps.jobCancelled);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    },
  });
}

/**
 * Retry a failed render job.
 * On success: invalidates job detail + project job list.
 */
export function useRetryRenderJob(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) =>
      apiClient<RenderJob>(API_ENDPOINTS.renderJobs.retry(jobId), {
        method: 'POST',
      }),
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.detail(jobId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.lists(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: renderJobKeys.batches(projectId),
      });
      toast.success(renderJobsTextMaps.jobStarted);
    },
    onError: (error: Error) => {
      toast.error(error.message || renderJobsTextMaps.errorOccurred);
    },
  });
}
