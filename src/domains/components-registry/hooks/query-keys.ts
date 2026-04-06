/**
 * OP Video Engine — Component Registry Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All component-registry queries MUST use these keys for proper cache invalidation.
 *
 * Spec: SPEC-COMP-001 through SPEC-COMP-008
 */

export const componentKeys = {
  all: ['components-registry'] as const,
  lists: () => [...componentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...componentKeys.lists(), filters] as const,
  details: () => [...componentKeys.all, 'detail'] as const,
  detail: (id: string) => [...componentKeys.details(), id] as const,
  schema: (id: string) => [...componentKeys.detail(id), 'schema'] as const
};
