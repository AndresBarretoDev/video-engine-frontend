/**
 * OP Video Engine — Projects Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches Project from @/domains/projects/types.
 */

import type { Project } from '@/domains/projects/types';

export const mockProjects: Project[] = [
  {
    id: 'project-001',
    name: 'Lidl Summer Campaign 2026',
    description:
      'Full summer campaign with 3 spots for TV, digital and social.',
    status: 'draft',
    visibility: 'team',
    ownerId: 'user-002',
    brandId: 'brand-001',
    brandName: 'Lidl',
    isActive: true,
    createdAt: new Date('2026-02-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-28T14:30:00Z').toISOString()
  },
  {
    id: 'project-002',
    name: 'Coca-Cola Holiday Promo',
    description: 'Christmas and New Year promotional videos for social media.',
    status: 'in-progress',
    visibility: 'team',
    ownerId: 'user-002',
    brandId: 'brand-002',
    brandName: 'Coca-Cola',
    isActive: true,
    createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-30T11:00:00Z').toISOString()
  },
  {
    id: 'project-003',
    name: 'Nike Q2 Social Ads',
    description:
      'Second quarter performance ad series for Instagram and TikTok.',
    status: 'review',
    visibility: 'private',
    ownerId: 'user-003',
    brandId: 'brand-003',
    brandName: 'Nike',
    isActive: true,
    createdAt: new Date('2026-02-20T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-25T16:00:00Z').toISOString()
  },
  {
    id: 'project-004',
    name: 'Omnicom Internal Reel 2026',
    description: 'Agency capabilities showreel for new business pitches.',
    status: 'approved',
    visibility: 'team',
    ownerId: 'user-001',
    brandId: 'brand-004',
    brandName: 'Omnicom',
    isActive: true,
    createdAt: new Date('2025-12-01T07:00:00Z').toISOString(),
    updatedAt: new Date('2026-03-01T09:00:00Z').toISOString()
  },
  {
    id: 'project-005',
    name: 'Lidl Black Friday Deals',
    description: 'High-volume personalised ads for the Black Friday campaign.',
    status: 'draft',
    visibility: 'team',
    ownerId: 'user-002',
    brandId: 'brand-001',
    brandName: 'Lidl',
    isActive: true,
    createdAt: new Date('2026-03-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-04-01T08:00:00Z').toISOString()
  },
  {
    id: 'project-006',
    name: 'Nike Running Series — Spring',
    description: 'Spring running collection launch. 6x15s and 2x30s formats.',
    status: 'in-progress',
    visibility: 'private',
    ownerId: 'user-003',
    brandId: 'brand-003',
    brandName: 'Nike',
    isActive: true,
    createdAt: new Date('2026-02-28T09:30:00Z').toISOString(),
    updatedAt: new Date('2026-03-29T12:00:00Z').toISOString()
  },
  {
    id: 'project-007',
    name: 'Coca-Cola Zero — Launch',
    description: 'Zero sugar variant launch campaign across digital channels.',
    status: 'approved',
    visibility: 'team',
    ownerId: 'user-002',
    brandId: 'brand-002',
    brandName: 'Coca-Cola',
    isActive: true,
    createdAt: new Date('2025-11-10T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-02-15T10:00:00Z').toISOString()
  },
  {
    id: 'project-008',
    name: 'Archive Test Project',
    description: 'Archived project for testing purposes.',
    status: 'archived',
    visibility: 'private',
    ownerId: 'user-001',
    isActive: false,
    createdAt: new Date('2025-09-01T07:00:00Z').toISOString(),
    updatedAt: new Date('2025-12-01T09:00:00Z').toISOString()
  }
];
