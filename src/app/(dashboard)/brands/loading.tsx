/**
 * OP Video Engine — Brands List Loading
 *
 * Route-level loading skeleton shown while brands page streams in.
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function BrandsLoading() {
  return <PageSkeleton variant="card-grid" />;
}
