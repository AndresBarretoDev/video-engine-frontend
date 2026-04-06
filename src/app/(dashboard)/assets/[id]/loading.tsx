/**
 * OP Video Engine — Asset Detail Loading
 *
 * Route-level loading skeleton shown while asset detail page streams in.
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function AssetDetailLoading() {
  return <PageSkeleton variant="detail" />;
}
