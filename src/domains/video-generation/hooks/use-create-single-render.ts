/**
 * useCreateSingleRender — React Query mutation hook
 *
 * Calls POST /projects/:projectId/render-single (D9 — dedicated single-product endpoint).
 * Returns jobIds for subsequent progress polling.
 *
 * Design ref: design.md §D8 + D9
 * Backend status: POST /projects/:id/render-single IS IMPLEMENTED (verified
 * 2026-06-11 with real 201s). Note: RENDER_PROVIDER=mock currently writes
 * placeholder files, so outputs are not playable until local render is enabled.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  CreateSingleProductRenderDto,
  SingleProductRenderResponse
} from '../types';

// ─── Query key ────────────────────────────────────────────────────────────────

export const VIDEO_GEN_JOBS_KEY = ['video-generation', 'render-jobs'] as const;

// ─── Mutation hook ────────────────────────────────────────────────────────────

/**
 * useCreateSingleRender
 *
 * Creates a single-product render job via the golden-path endpoint.
 * On success: returns jobIds to the caller (for progress polling).
 *
 * NOTE: No toast here on purpose. This hook fires ONCE PER FORMAT (the caller
 * loops it inside Promise.allSettled). User-facing messaging belongs in the
 * caller so a single user action produces a single toast — not one per format.
 * The mutation still rejects on error so the caller's allSettled sees it.
 *
 * @param projectId - The project to render under
 */
export function useCreateSingleRender(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Omit<CreateSingleProductRenderDto, 'projectId'>) =>
      apiClient<SingleProductRenderResponse>(
        API_ENDPOINTS.videoGeneration.renderSingle(projectId),
        {
          method: 'POST',
          data: { ...dto, projectId }
        }
      ),
    onSuccess: () => {
      // Invalidate render-jobs list so the count indicator refreshes
      queryClient.invalidateQueries({ queryKey: VIDEO_GEN_JOBS_KEY });
    }
  });
}
