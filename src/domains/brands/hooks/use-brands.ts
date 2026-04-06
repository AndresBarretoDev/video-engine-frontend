/**
 * OP Video Engine — Brand React Query Hooks
 *
 * All brand-related queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Spec: SPEC-BRAND-001 through SPEC-BRAND-012
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { BrandConfig } from '../types';
import { brandsTextMaps } from '../text-maps';
import { brandKeys } from './query-keys';
import type { CreateBrandInput } from '../schema';

// ─── Filters type ────────────────────────────────────────────────────────────

export interface BrandFilters {
  search?: string;
  status?: 'active' | 'archived';
  sort?: 'name' | 'date';
  page?: number;
  [key: string]: unknown;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List brands with optional filters.
 * staleTime: 5 minutes — brands don't change frequently.
 */
export function useBrands(filters?: BrandFilters) {
  return useQuery({
    queryKey: brandKeys.list(filters ?? {}),
    queryFn: () =>
      apiClient<BrandConfig[]>(API_ENDPOINTS.brands.list, {
        params: filters as Record<string, unknown>
      }),
    staleTime: 5 * 60 * 1000
  });
}

/**
 * Get a single brand by ID.
 */
export function useBrand(id: string) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => apiClient<BrandConfig>(API_ENDPOINTS.brands.byId(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create a new brand.
 * On success: invalidates brands list + shows success toast.
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandInput) =>
      apiClient<BrandConfig>(API_ENDPOINTS.brands.create, {
        method: 'POST',
        data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(brandsTextMaps.brandCreated);
    },
    onError: (error: Error) => {
      toast.error(error.message || brandsTextMaps.errorCreate);
    }
  });
}

/**
 * Update an existing brand.
 * On success: invalidates brand detail + list + shows success toast.
 */
export function useUpdateBrand(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateBrandInput>) =>
      apiClient<BrandConfig>(API_ENDPOINTS.brands.update(id), {
        method: 'PATCH',
        data
      }),
    onSuccess: updated => {
      queryClient.setQueryData(brandKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(brandsTextMaps.brandUpdated);
    },
    onError: (error: Error) => {
      toast.error(error.message || brandsTextMaps.errorUpdate);
    }
  });
}

/**
 * Archive a brand (soft delete).
 * On success: invalidates brands list + shows success toast.
 */
export function useArchiveBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<BrandConfig>(API_ENDPOINTS.brands.archive(id), {
        method: 'PATCH'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(brandsTextMaps.brandArchived);
    },
    onError: (error: Error) => {
      toast.error(error.message || brandsTextMaps.errorArchive);
    }
  });
}

/**
 * Reactivate an archived brand.
 * On success: invalidates brands list + shows success toast.
 */
export function useReactivateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<BrandConfig>(API_ENDPOINTS.brands.reactivate(id), {
        method: 'PATCH'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      toast.success(brandsTextMaps.brandReactivated);
    },
    onError: (error: Error) => {
      toast.error(error.message || brandsTextMaps.errorReactivate);
    }
  });
}
