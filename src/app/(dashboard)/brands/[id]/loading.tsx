/**
 * OP Video Engine — Brand Detail Loading
 *
 * Route-level loading skeleton shown while brand detail page streams in.
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function BrandDetailLoading() {
  return <PageSkeleton variant="detail" />;
}
