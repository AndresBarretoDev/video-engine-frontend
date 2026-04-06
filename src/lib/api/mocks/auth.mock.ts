/**
 * OP Video Engine — Auth Mock Data
 *
 * Used when NEXT_PUBLIC_USE_MOCKS=true.
 * Shape matches AuthUser from @/lib/auth/types.
 */

import type { AuthUser } from '@/lib/auth/types';

export const mockAuthUser: AuthUser = {
  id: 'mock-admin-001',
  email: 'admin@opvideoengine.com',
  name: 'Admin User',
  role: 'admin',
  avatarUrl: undefined,
  createdAt: '2025-09-01T00:00:00.000Z',
  updatedAt: '2025-09-01T00:00:00.000Z'
};
