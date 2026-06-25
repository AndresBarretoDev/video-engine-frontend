/**
 * OP Video Engine — Render Jobs Page
 *
 * Server Component. Ultra-clean: only composition.
 * RenderDashboard (Client Component) handles all data fetching + UI.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 3
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { RenderDashboard } from '@/domains/render-jobs/components/render-dashboard';
import { renderJobsTextMaps } from '@/domains/render-jobs/text-maps';

interface RenderPageProps {
  params: Promise<{ id: string }>;
}

export default async function RenderPage({ params }: RenderPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {renderJobsTextMaps.renderDashboard}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {renderJobsTextMaps.noBatchesDescription}
        </p>
      </div>

      <Suspense fallback={<PageSkeleton variant="card-grid" />}>
        <RenderDashboard projectId={id} />
      </Suspense>
    </div>
  );
}
