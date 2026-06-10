/**
 * OP Video Engine — Templates React Query Hooks
 *
 * GET /templates via the centralized API client → NestJS REST.
 *
 * The backend is the single source of truth for the template catalog. The old
 * STATIC_TEMPLATE_REGISTRY fallback was removed (task 3.1) once the backend began
 * serving the full catalog — a local static copy could drift from the backend
 * (it did: it caused confusion about looping-product-promo's description/tags),
 * so it's gone. React Query surfaces loading/error states to the UI.
 */

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { TemplateDescriptor } from '../types';
import { templateKeys } from './query-keys';

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * List all available templates from GET /templates.
 * staleTime: 5 minutes — templates are essentially static configuration.
 */
export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: () => apiClient<TemplateDescriptor[]>(API_ENDPOINTS.templates.list),
    staleTime: 5 * 60 * 1000
  });
}

/**
 * Get a single template by ID from GET /templates/:id.
 */
export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => apiClient<TemplateDescriptor>(API_ENDPOINTS.templates.byId(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
}
