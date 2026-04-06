/**
 * OP Video Engine — Dashboard Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches DashboardSummary from @/domains/dashboard/types.
 */

import type { DashboardSummary } from '@/domains/dashboard/types';

export const mockDashboardSummary: DashboardSummary = {
  metrics: [
    { key: 'total-users', label: 'Total Users', value: 8, href: '/users' },
    { key: 'total-brands', label: 'Total Brands', value: 4, href: '/brands' },
    {
      key: 'total-projects',
      label: 'Total Projects',
      value: 12,
      href: '/projects'
    },
    {
      key: 'projects-in-review',
      label: 'Projects in Review',
      value: 7,
      href: '/projects?status=review'
    },
    {
      key: 'projects-approved',
      label: 'Projects Approved',
      value: 3,
      href: '/projects?status=approved'
    }
  ],
  recentProjects: [
    {
      id: 'proj-001',
      name: 'Lidl Summer Campaign',
      status: 'rendering',
      brand: 'Lidl',
      updatedAt: '2026-03-28T10:00:00Z'
    },
    {
      id: 'proj-002',
      name: 'Coca-Cola Holiday Promo',
      status: 'draft',
      brand: 'Coca-Cola',
      updatedAt: '2026-03-27T15:30:00Z'
    },
    {
      id: 'proj-003',
      name: 'Nike Q2 Social',
      status: 'delivered',
      brand: 'Nike',
      updatedAt: '2026-03-25T09:00:00Z'
    },
    {
      id: 'proj-004',
      name: 'Omnicom Internal Reel',
      status: 'review',
      brand: 'Omnicom',
      updatedAt: '2026-03-24T11:00:00Z'
    }
  ]
};
