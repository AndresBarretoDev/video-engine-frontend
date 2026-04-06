/**
 * OP Video Engine — Projects Loading
 *
 * Loading skeleton for the projects list page.
 * Automatically shown by Next.js while the Suspense boundary resolves.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function ProjectsLoading() {
  return <PageSkeleton variant="card-grid" />;
}
