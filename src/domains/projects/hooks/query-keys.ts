/**
 * OP Video Engine — Project Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All project-related queries MUST use these keys for proper cache invalidation.
 */

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const
};
