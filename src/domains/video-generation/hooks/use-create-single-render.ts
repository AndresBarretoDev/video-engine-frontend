/**
 * useCreateSingleRender — React Query mutation hook
 *
 * Calls POST /projects/:projectId/render-single (D9 — dedicated single-product endpoint).
 * Returns jobIds for subsequent progress polling.
 *
 * Design ref: design.md §D8 + D9
 * BACKEND CONTRACT: task 2.6 must implement POST /projects/:id/render-single
 * until then, the mutation will fail gracefully (ApiError) and show the error state.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { videoGenerationTextMaps as t } from '../text-maps';
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
 * On error: shows a toast — does NOT throw (fails gracefully).
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
    onSuccess: data => {
      // Invalidate render-jobs list so the count indicator refreshes
      queryClient.invalidateQueries({ queryKey: VIDEO_GEN_JOBS_KEY });
      toast.success(t.renderJobCreated);
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || t.errorRenderFailed);
    }
  });
}
