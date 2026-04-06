/**
 * OP Video Engine — Data Source React Query Hooks
 *
 * All data source queries and mutations for a project.
 * Uses apiClient → NestJS REST (never Server Actions).
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { DataSource } from '../types';
import { dataEngineTextMaps } from '../text-maps';
import { dataEngineKeys } from './query-keys';
import type { CreateDataSourceInput } from '../schema';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get the data source for a project.
 * A project has at most one active data source.
 * staleTime: 2 minutes.
 */
export function useDataSources(projectId: string) {
  return useQuery({
    queryKey: dataEngineKeys.source(projectId),
    queryFn: () =>
      apiClient<DataSource[]>(
        API_ENDPOINTS.dataEngine.projectSource(projectId)
      ),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000
  });
}

/**
 * Get a single data source by ID.
 */
export function useDataSource(projectId: string, sourceId: string) {
  return useQuery({
    queryKey: dataEngineKeys.sourceDetail(projectId, sourceId),
    queryFn: () =>
      apiClient<DataSource>(
        API_ENDPOINTS.dataEngine.projectSourceById(projectId, sourceId)
      ),
    enabled: !!projectId && !!sourceId,
    staleTime: 2 * 60 * 1000
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new data source for a project.
 * On success: invalidates source cache + shows toast.
 */
export function useCreateDataSource(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDataSourceInput) =>
      apiClient<DataSource>(API_ENDPOINTS.dataEngine.projectSource(projectId), {
        method: 'POST',
        data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dataEngineKeys.source(projectId)
      });
      toast.success(dataEngineTextMaps.sourceCreated);
    },
    onError: (error: Error) => {
      toast.error(error.message || dataEngineTextMaps.errorCreate);
    }
  });
}

/**
 * Sync (refresh) a data source.
 * On success: invalidates source + variations cache + shows toast.
 */
export function useSyncDataSource(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sourceId: string) =>
      apiClient<DataSource>(
        API_ENDPOINTS.dataEngine.projectSourceSync(projectId, sourceId),
        {
          method: 'POST'
        }
      ),
    onSuccess: updated => {
      queryClient.invalidateQueries({
        queryKey: dataEngineKeys.source(projectId)
      });
      queryClient.invalidateQueries({
        queryKey: dataEngineKeys.variations(projectId)
      });
      if (updated.id) {
        queryClient.setQueryData(
          dataEngineKeys.sourceDetail(projectId, updated.id),
          updated
        );
      }
      toast.success(dataEngineTextMaps.sourceSynced);
    },
    onError: (error: Error) => {
      toast.error(error.message || dataEngineTextMaps.errorSync);
    }
  });
}
