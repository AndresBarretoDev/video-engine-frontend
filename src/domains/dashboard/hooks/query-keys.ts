/**
 * OP Video Engine — Dashboard Query Keys
 *
 * Centralized query key factory for the dashboard domain.
 */

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const
};
