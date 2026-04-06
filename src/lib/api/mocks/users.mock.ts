/**
 * OP Video Engine — Users Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches UserProfile from @/domains/users/types.
 */

import type { UserProfile } from '@/domains/users/types';

export const mockUsers: UserProfile[] = [
  {
    id: 'mock-admin-001',
    email: 'admin@opvideoengine.com',
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    department: 'Engineering',
    createdAt: new Date('2025-01-10T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-10T00:00:00Z').toISOString()
  },
  {
    id: 'mock-designer-001',
    email: 'maria.designer@opvideoengine.com',
    name: 'Maria Designer',
    firstName: 'Maria',
    lastName: 'Designer',
    role: 'designer',
    isActive: true,
    department: 'Creative',
    createdAt: new Date('2025-02-14T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-03-01T00:00:00Z').toISOString()
  },
  {
    id: 'mock-producer-001',
    email: 'carlos.producer@opvideoengine.com',
    name: 'Carlos Producer',
    firstName: 'Carlos',
    lastName: 'Producer',
    role: 'producer',
    isActive: true,
    department: 'Production',
    createdAt: new Date('2025-02-20T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-02-20T00:00:00Z').toISOString()
  },
  {
    id: 'mock-qc-001',
    email: 'ana.qc@opvideoengine.com',
    name: 'Ana QC',
    firstName: 'Ana',
    lastName: 'QC',
    role: 'qc',
    isActive: true,
    department: 'Quality Control',
    createdAt: new Date('2025-03-05T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-03-05T00:00:00Z').toISOString()
  },
  {
    id: 'mock-client-001',
    email: 'contact@lidl.com',
    name: 'Client Lidl',
    firstName: 'Client',
    lastName: 'Lidl',
    role: 'client',
    isActive: true,
    department: 'Lidl Marketing',
    createdAt: new Date('2025-03-15T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-03-15T00:00:00Z').toISOString()
  },
  {
    id: 'mock-designer-002',
    email: 'leo.design@opvideoengine.com',
    name: 'Leo Fernandez',
    firstName: 'Leo',
    lastName: 'Fernandez',
    role: 'designer',
    isActive: true,
    department: 'Creative',
    createdAt: new Date('2025-04-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-04-01T00:00:00Z').toISOString()
  },
  {
    id: 'mock-inactive-001',
    email: 'inactive.user@opvideoengine.com',
    name: 'Inactive User',
    firstName: 'Inactive',
    lastName: 'User',
    role: 'designer',
    isActive: false,
    department: 'Creative',
    createdAt: new Date('2024-12-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-01-05T00:00:00Z').toISOString()
  },
  {
    id: 'mock-client-002',
    email: 'brand@omnicom.com',
    name: 'Omnicom Brand',
    firstName: 'Omnicom',
    lastName: 'Brand',
    role: 'client',
    isActive: true,
    department: 'Omnicom Group',
    createdAt: new Date('2025-05-10T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-10T00:00:00Z').toISOString()
  }
];
