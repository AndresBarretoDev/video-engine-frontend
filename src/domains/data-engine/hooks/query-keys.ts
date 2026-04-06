/**
 * OP Video Engine — Data Engine Query Key Factory
 *
 * Centralized, type-safe query keys for React Query.
 * All data-engine-related queries MUST use these keys for proper cache invalidation.
 */

import type { VariationFilters } from '../types';

export const dataEngineKeys = {
  all: (projectId: string) => ['data-engine', projectId] as const,

  // Data source
  source: (projectId: string) => ['data-engine', projectId, 'source'] as const,
  sourceDetail: (projectId: string, sourceId: string) =>
    ['data-engine', projectId, 'source', sourceId] as const,

  // Mappings
  mappings: (projectId: string) =>
    ['data-engine', projectId, 'mappings'] as const,
  autoMatch: (projectId: string) =>
    ['data-engine', projectId, 'auto-match'] as const,

  // Rules
  rules: (projectId: string) => ['data-engine', projectId, 'rules'] as const,

  // Variations
  variations: (projectId: string, filters?: VariationFilters) =>
    ['data-engine', projectId, 'variations', filters ?? {}] as const,
  variation: (projectId: string, index: number) =>
    ['data-engine', projectId, 'variation', index] as const
};
