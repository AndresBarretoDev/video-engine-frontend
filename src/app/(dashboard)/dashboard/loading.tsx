/**
 * OP Video Engine — Dashboard Loading Skeleton
 *
 * Next.js loading.tsx — shown while dashboard page suspends.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function DashboardLoading() {
  return <PageSkeleton variant="dashboard" />;
}
