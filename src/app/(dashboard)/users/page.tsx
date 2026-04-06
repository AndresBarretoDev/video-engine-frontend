/**
 * OP Video Engine — User Management Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * UserTable (Client Component) handles data fetching, filtering, and interactions.
 *
 * Access: Admin role only.
 * - Sidebar nav-config already hides this link for non-admins.
 * - UserTable component performs a client-side role check as defense-in-depth.
 * - NestJS backend enforces admin guard on all /users endpoints.
 *
 * Spec: SPEC-USER-001
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { UserTable } from '@/domains/users/components/user-table';

export default function UsersPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="table" />}>
      <UserTable />
    </Suspense>
  );
}
