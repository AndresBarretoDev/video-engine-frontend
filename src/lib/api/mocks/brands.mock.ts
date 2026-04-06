/**
 * OP Video Engine — Brands Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches BrandConfig from @/domains/brands/types.
 */

import type { BrandConfig } from '@/domains/brands/types';

export const mockBrands: BrandConfig[] = [
  {
    id: 'brand-001',
    name: 'Lidl',
    slug: 'lidl',
    description:
      'Lidl — discount supermarket chain. Bold blue and yellow identity.',
    organizationId: 'org-001',
    clientId: 'client-001',
    isActive: true,
    createdAt: new Date('2025-10-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-20T14:00:00Z').toISOString()
  },
  {
    id: 'brand-002',
    name: 'Coca-Cola',
    slug: 'coca-cola',
    description:
      'Coca-Cola — iconic red and white brand with a timeless identity.',
    organizationId: 'org-001',
    clientId: 'client-002',
    isActive: true,
    createdAt: new Date('2025-10-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-18T11:30:00Z').toISOString()
  },
  {
    id: 'brand-003',
    name: 'Nike',
    slug: 'nike',
    description:
      'Nike — just do it. Minimal black and white athletic identity.',
    organizationId: 'org-001',
    clientId: 'client-003',
    isActive: true,
    createdAt: new Date('2025-11-01T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-10T16:00:00Z').toISOString()
  },
  {
    id: 'brand-004',
    name: 'Omnicom',
    slug: 'omnicom',
    description: 'Omnicom Production — internal brand for agency content.',
    organizationId: 'org-001',
    clientId: 'client-004',
    isActive: true,
    createdAt: new Date('2025-09-01T07:00:00Z').toISOString(),
    updatedAt: new Date('2026-02-28T09:00:00Z').toISOString()
  },
  {
    id: 'brand-005',
    name: 'Renault',
    slug: 'renault',
    description: 'Renault — French automotive brand. Yellow diamond logo.',
    organizationId: 'org-001',
    clientId: 'client-005',
    isActive: false,
    createdAt: new Date('2025-12-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-15T13:00:00Z').toISOString()
  }
];
