/**
 * OP Video Engine — Component Catalog Loading
 *
 * Next.js automatic loading.tsx — displayed while the page Suspense resolves.
 * Uses card-grid skeleton variant.
 *
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function ComponentsLoading() {
  return <PageSkeleton variant="card-grid" />;
}
