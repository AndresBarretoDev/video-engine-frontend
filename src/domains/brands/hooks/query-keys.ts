/**
 * OP Video Engine — Brand Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All brand-related queries MUST use these keys for proper cache invalidation.
 */

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...brandKeys.lists(), filters] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
  tokens: (id: string) => [...brandKeys.detail(id), 'tokens'] as const
};
