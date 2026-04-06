/**
 * OP Video Engine — Dashboard Home Page
 *
 * Ultra-clean Server Component. Only composition, zero business logic.
 * Delegates all rendering to DashboardContent (Client Component).
 *
 * Spec: SPEC-DASH-001
 */

import { Suspense } from 'react';
import { DashboardContent } from '@/domains/dashboard/components/dashboard-content';
import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="dashboard" />}>
      <DashboardContent />
    </Suspense>
  );
}
