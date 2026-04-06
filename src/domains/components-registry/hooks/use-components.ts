/**
 * OP Video Engine — Component Registry React Query Hooks
 *
 * All component-registry-related queries.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Spec: SPEC-COMP-001 through SPEC-COMP-008
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { RegisteredComponent } from '../types';
import type { RegisterComponentInput } from '../schema';
import { componentsRegistryTextMaps } from '../text-maps';
import { componentKeys } from './query-keys';

// ─── Filters type ────────────────────────────────────────────────────────────

export interface ComponentFilters {
  type?: 'atom' | 'molecule' | 'organism' | 'template' | 'all';
  status?: 'published' | 'draft' | 'deprecated' | 'archived';
  brandId?: string;
  tags?: string[];
  search?: string;
  page?: number;
  [key: string]: unknown;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List components with optional filters.
 * staleTime: 5 minutes — components don't change frequently.
 */
export function useComponents(filters?: ComponentFilters) {
  const normalizedFilters = {
    ...filters,
    // Omit 'all' type — means no filter
    ...(filters?.type === 'all' ? { type: undefined } : {})
  };

  return useQuery({
    queryKey: componentKeys.list(normalizedFilters),
    queryFn: () =>
      apiClient<RegisteredComponent[]>(API_ENDPOINTS.componentsRegistry.list, {
        params: normalizedFilters as Record<string, unknown>
      }),
    staleTime: 5 * 60 * 1000
  });
}

/**
 * Get a single component by ID with full detail.
 * staleTime: 5 minutes.
 */
export function useComponent(id: string) {
  return useQuery({
    queryKey: componentKeys.detail(id),
    queryFn: () =>
      apiClient<RegisteredComponent>(API_ENDPOINTS.componentsRegistry.byId(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

/**
 * Register a new component.
 * Invalidates the components list on success.
 */
export function useCreateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterComponentInput) =>
      apiClient<RegisteredComponent>(API_ENDPOINTS.componentsRegistry.create, {
        method: 'POST',
        data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.all });
      toast.success(componentsRegistryTextMaps.componentRegistered);
    }
  });
}

/**
 * Update an existing component.
 * Invalidates both the list and the specific detail on success.
 */
export function useUpdateComponent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RegisterComponentInput>) =>
      apiClient<RegisteredComponent>(
        API_ENDPOINTS.componentsRegistry.update(id),
        {
          method: 'PATCH',
          data
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.all });
      toast.success(componentsRegistryTextMaps.componentUpdated);
    }
  });
}
