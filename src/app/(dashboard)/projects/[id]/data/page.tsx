/**
 * OP Video Engine — Data Engine Page
 *
 * Server Component. Ultra-clean: only composition.
 * DataEngineTabs (Client Component) handles all tab logic + data fetching.
 *
 * Spec: SPEC-DE-001 through SPEC-DE-009 / TASK-DE-032
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { DataEngineTabs } from '@/domains/data-engine/components/data-engine-tabs';
import { dataEngineTextMaps } from '@/domains/data-engine/text-maps';

interface DataPageProps {
  params: Promise<{ id: string }>;
}

export default async function DataPage({ params }: DataPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {dataEngineTextMaps.pageTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {dataEngineTextMaps.pageSubtitle}
        </p>
      </div>

      <Suspense fallback={<PageSkeleton variant="detail" />}>
        <DataEngineTabs projectId={id} />
      </Suspense>
    </div>
  );
}
