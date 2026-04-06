/**
 * OP Video Engine — Column Mappings React Query Hooks
 *
 * Queries and mutations for column-to-prop mappings.
 * Uses apiClient → NestJS REST.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { AutoMatchSuggestion, ColumnMapping } from '../types';
import { dataEngineTextMaps } from '../text-maps';
import { dataEngineKeys } from './query-keys';
import type { SaveColumnMappingsInput } from '../schema';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get saved column mappings for a project.
 * staleTime: 5 minutes — mappings rarely change between saves.
 */
export function useMappings(projectId: string) {
  return useQuery({
    queryKey: dataEngineKeys.mappings(projectId),
    queryFn: () =>
      apiClient<ColumnMapping[]>(
        API_ENDPOINTS.dataEngine.projectMappings(projectId)
      ),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Save column mappings for a project.
 * On success: invalidates mappings + variations cache + shows toast.
 */
export function useSaveMappings(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveColumnMappingsInput) =>
      apiClient<ColumnMapping[]>(
        API_ENDPOINTS.dataEngine.projectMappings(projectId),
        {
          method: 'PUT',
          data
        }
      ),
    onSuccess: saved => {
      queryClient.setQueryData(dataEngineKeys.mappings(projectId), saved);
      // Invalidate variations — they depend on mappings
      queryClient.invalidateQueries({
        queryKey: dataEngineKeys.variations(projectId)
      });
      toast.success(dataEngineTextMaps.mappingUpdated);
    },
    onError: (error: Error) => {
      toast.error(error.message || dataEngineTextMaps.errorSaveMappings);
    }
  });
}

/**
 * Request auto-match suggestions from backend.
 * Returns suggested mappings based on column names vs prop paths.
 * On success: does NOT save — caller applies suggestions to the Zustand draft.
 */
export function useAutoMatch(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<AutoMatchSuggestion[]>(
        API_ENDPOINTS.dataEngine.projectAutoMatch(projectId),
        {
          method: 'POST'
        }
      ),
    onSuccess: suggestions => {
      // Cache suggestions for reference
      queryClient.setQueryData(
        dataEngineKeys.autoMatch(projectId),
        suggestions
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || dataEngineTextMaps.errorSaveMappings);
    }
  });
}
