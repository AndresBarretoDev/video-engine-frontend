/**
 * OP Video Engine — Assets List Loading
 *
 * Route-level loading skeleton shown while assets page streams in.
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function AssetsLoading() {
  return <PageSkeleton variant="card-grid" />;
}
