/**
 * OP Video Engine — Assets List Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * AssetGrid (Client Component) handles data fetching and interactions.
 *
 * Spec: SPEC-ASSET-001 through SPEC-ASSET-003
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { AssetGrid } from '@/domains/assets/components/asset-grid';

export default function AssetsPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="card-grid" />}>
      <AssetGrid />
    </Suspense>
  );
}
