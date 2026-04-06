/**
 * OP Video Engine — Conditional Rules React Query Hooks
 *
 * Queries and mutations for conditional logic rules per project.
 * Uses apiClient → NestJS REST.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { ConditionalRule } from '../types';
import { dataEngineTextMaps } from '../text-maps';
import { dataEngineKeys } from './query-keys';
import type { SaveRulesInput } from '../schema';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get saved conditional rules for a project.
 * staleTime: 5 minutes.
 */
export function useRules(projectId: string) {
  return useQuery({
    queryKey: dataEngineKeys.rules(projectId),
    queryFn: () =>
      apiClient<ConditionalRule[]>(
        API_ENDPOINTS.dataEngine.projectRules(projectId)
      ),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Save conditional rules for a project.
 * On success: invalidates rules + variations cache + shows toast.
 */
export function useSaveRules(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveRulesInput) =>
      apiClient<ConditionalRule[]>(
        API_ENDPOINTS.dataEngine.projectRules(projectId),
        {
          method: 'PUT',
          data
        }
      ),
    onSuccess: saved => {
      queryClient.setQueryData(dataEngineKeys.rules(projectId), saved);
      // Invalidate variations — they depend on rules
      queryClient.invalidateQueries({
        queryKey: dataEngineKeys.variations(projectId)
      });
      toast.success(dataEngineTextMaps.logicUpdated);
    },
    onError: (error: Error) => {
      toast.error(error.message || dataEngineTextMaps.errorSaveRules);
    }
  });
}
