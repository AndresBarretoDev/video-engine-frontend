/**
 * OP Video Engine — Role Guard Utilities
 *
 * Client-side role verification helpers.
 * The actual security enforcement is on the NestJS backend (JWT Guards).
 * These are UI-level helpers for conditional rendering.
 *
 * Usage:
 *   if (hasRole(user, 'admin')) { ... }
 *   if (hasAnyRole(user, ['admin', 'producer'])) { ... }
 */

import type { AuthUser, UserRole } from './types';

export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role;
}

export function hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Role hierarchy for permission checks.
 * Admin > Producer > Designer/QC > Client
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  producer: 80,
  designer: 60,
  qc: 60,
  client: 20
};

export function hasMinimumRole(
  user: AuthUser | null,
  minimumRole: UserRole
): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minimumRole];
}
