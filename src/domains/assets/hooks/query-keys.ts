/**
 * OP Video Engine — Asset Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All asset-related queries MUST use these keys for proper cache invalidation.
 */

export const assetKeys = {
  all: ['assets'] as const,
  lists: () => [...assetKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...assetKeys.lists(), filters] as const,
  details: () => [...assetKeys.all, 'detail'] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const
};
