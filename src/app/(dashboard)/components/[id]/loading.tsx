/**
 * OP Video Engine — Component Detail Loading
 *
 * Next.js automatic loading.tsx — displayed while the detail page Suspense resolves.
 * Uses detail skeleton variant.
 *
 * Spec: SPEC-CROSS-001
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function ComponentDetailLoading() {
  return <PageSkeleton variant="detail" />;
}
