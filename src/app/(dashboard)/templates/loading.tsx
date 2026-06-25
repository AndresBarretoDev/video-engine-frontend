/**
 * OP Video Engine — Templates Loading UI
 *
 * Shown by Next.js while the templates segment is loading.
 * Matches the card-grid layout variant to prevent layout shift.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function TemplatesLoading() {
  return <PageSkeleton variant="card-grid" />;
}
