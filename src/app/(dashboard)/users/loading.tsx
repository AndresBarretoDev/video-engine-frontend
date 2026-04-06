/**
 * OP Video Engine — Users Loading
 *
 * Loading skeleton for the user management page.
 * Automatically shown by Next.js while the Suspense boundary resolves.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function UsersLoading() {
  return <PageSkeleton variant="table" />;
}
