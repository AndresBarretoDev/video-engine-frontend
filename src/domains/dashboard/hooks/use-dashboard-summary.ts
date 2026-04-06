/**
 * OP Video Engine — Dashboard Summary Hook
 *
 * React Query hook for GET /dashboard/summary.
 * Returns role-adapted metrics from the NestJS backend.
 *
 * Spec: SPEC-DASH-005
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { DashboardSummary } from '@/domains/dashboard/types';
import { dashboardKeys } from './query-keys';

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: dashboardKeys.summary(),
    queryFn: () => apiClient<DashboardSummary>(API_ENDPOINTS.dashboard.summary),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true
  });
}
