/**
 * OP Video Engine — Asset Detail Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * AssetDetailView (Client Component) handles data fetching.
 *
 * Spec: SPEC-ASSET-004
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { AssetDetailView } from '@/domains/assets/components/asset-detail-view';
import { assetsTextMaps } from '@/domains/assets/text-maps';

interface AssetPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {assetsTextMaps.detailTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {assetsTextMaps.detailDescription}
        </p>
      </div>
      <Suspense fallback={<PageSkeleton variant="detail" />}>
        <AssetDetailView id={id} />
      </Suspense>
    </div>
  );
}
