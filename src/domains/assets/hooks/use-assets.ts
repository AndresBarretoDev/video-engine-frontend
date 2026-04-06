/**
 * OP Video Engine — Asset React Query Hooks
 *
 * All asset-related queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Spec: SPEC-ASSET-001 through SPEC-ASSET-006
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Asset } from '../types';
import { assetsTextMaps } from '../text-maps';
import { assetKeys } from './query-keys';

// ─── Filters type ─────────────────────────────────────────────────────────────

export interface AssetFilters {
  search?: string;
  type?: 'image' | 'video' | 'audio' | 'font' | 'document' | 'all';
  brandId?: string;
  [key: string]: unknown;
}

// ─── Upload input ─────────────────────────────────────────────────────────────

export interface UploadAssetPayload {
  file: File;
  brandId?: string;
  tags?: string[];
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * List assets with optional filters.
 * staleTime: 2 minutes — assets may be uploaded frequently.
 */
export function useAssets(filters?: AssetFilters) {
  return useQuery({
    queryKey: assetKeys.list(filters ?? {}),
    queryFn: () =>
      apiClient<Asset[]>(API_ENDPOINTS.assets.list, {
        params: filters as Record<string, unknown>
      }),
    staleTime: 2 * 60 * 1000
  });
}

/**
 * Get a single asset by ID.
 */
export function useAsset(id: string) {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => apiClient<Asset>(API_ENDPOINTS.assets.byId(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Upload a new asset.
 * On success: invalidates asset list + shows success toast.
 */
export function useUploadAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadAssetPayload) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.brandId) formData.append('brandId', payload.brandId);
      if (payload.tags?.length) formData.append('tags', payload.tags.join(','));

      return apiClient<Asset>(API_ENDPOINTS.assets.upload, {
        method: 'POST',
        data: formData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
      toast.success(assetsTextMaps.assetUploaded);
    },
    onError: (error: Error) => {
      toast.error(error.message || assetsTextMaps.uploadFailed);
    }
  });
}

/**
 * Delete an asset by ID.
 * On success: invalidates asset list + shows success toast.
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<{ success: boolean }>(API_ENDPOINTS.assets.delete(id), {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
      toast.success(assetsTextMaps.assetDeleted);
    },
    onError: (error: Error) => {
      toast.error(error.message || assetsTextMaps.errorDelete);
    }
  });
}
