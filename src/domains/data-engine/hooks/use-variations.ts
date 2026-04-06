/**
 * OP Video Engine — Variation React Query Hooks
 *
 * Queries for paginated variation list and single variation detail.
 * Uses apiClient → NestJS REST.
 */

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  PaginatedVariations,
  Variation,
  VariationFilters
} from '../types';
import { dataEngineKeys } from './query-keys';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Get paginated variations for a project.
 * Depends on mappings + rules being saved.
 * staleTime: 30 seconds — variations change when mappings/rules are updated.
 */
export function useVariations(projectId: string, filters?: VariationFilters) {
  const resolvedFilters: VariationFilters = {
    page: 1,
    pageSize: 20,
    ...filters
  };

  return useQuery({
    queryKey: dataEngineKeys.variations(projectId, resolvedFilters),
    queryFn: () =>
      apiClient<PaginatedVariations>(
        API_ENDPOINTS.dataEngine.projectVariations(projectId),
        { params: resolvedFilters as Record<string, unknown> }
      ),
    enabled: !!projectId,
    staleTime: 30 * 1000
  });
}

/**
 * Get the resolved props for a single variation row.
 * Used by the variation detail drawer.
 * staleTime: 5 minutes.
 */
export function useVariation(projectId: string, index: number) {
  return useQuery({
    queryKey: dataEngineKeys.variation(projectId, index),
    queryFn: () =>
      apiClient<Variation>(
        API_ENDPOINTS.dataEngine.projectVariationProps(projectId, index)
      ),
    enabled: !!projectId && index >= 0,
    staleTime: 5 * 60 * 1000
  });
}
