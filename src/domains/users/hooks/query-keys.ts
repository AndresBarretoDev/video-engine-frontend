/**
 * OP Video Engine — User Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All user-related queries MUST use these keys for proper cache invalidation.
 */

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const
};
