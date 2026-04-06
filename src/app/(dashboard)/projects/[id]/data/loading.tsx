/**
 * OP Video Engine — Data Engine Loading
 *
 * Suspense fallback for the Data Engine page.
 * Shows a detail skeleton (tabs + content area).
 *
 * TASK-DE-032
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function DataLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-96 animate-pulse rounded" />
      </div>
      <PageSkeleton variant="detail" />
    </div>
  );
}
