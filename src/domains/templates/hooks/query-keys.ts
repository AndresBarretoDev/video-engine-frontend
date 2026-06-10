/**
 * OP Video Engine — Templates Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All template-related queries MUST use these keys for proper cache invalidation.
 */

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const
};
