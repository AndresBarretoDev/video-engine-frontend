/**
 * OP Video Engine — Render Jobs Loading
 *
 * Suspense fallback for the Render Jobs page.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 3
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function RenderLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted h-4 w-96 animate-pulse rounded" />
      </div>
      <PageSkeleton variant="card-grid" />
    </div>
  );
}
