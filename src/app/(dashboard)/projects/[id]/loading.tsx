/**
 * OP Video Engine — Project Detail Loading
 *
 * Loading skeleton for the project detail/edit page.
 * Automatically shown by Next.js while the Suspense boundary resolves.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function ProjectDetailLoading() {
  return <PageSkeleton variant="detail" />;
}
