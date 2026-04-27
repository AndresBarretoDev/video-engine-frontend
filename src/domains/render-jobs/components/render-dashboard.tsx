'use client';

/**
 * OP Video Engine — Render Dashboard
 *
 * Main client component for the render jobs page.
 * Lists batches with aggregate progress, filter by status.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 3
 */

import { useMemo, useState } from 'react';
import { Film } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ErrorAlert } from '@/components/shared/error-alert';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';

import { useRenderBatches } from '../hooks/use-render-batches';
import { BatchCard } from './batch-card';
import { BatchDetailView } from './batch-detail-view';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderBatch } from '../types';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border rounded-[var(--radius-12)] border p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderDashboardProps {
  projectId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderDashboard({ projectId }: RenderDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const hasProcessing = useMemo(() => {
    return false; // Will be computed from data below
  }, []);

  const { data: batches, isLoading, isError, refetch } = useRenderBatches(
    projectId,
    { status: statusFilter === 'all' ? undefined : statusFilter as RenderBatch['status'], search: search || undefined },
    hasProcessing,
  );

  const hasAnyProcessing = useMemo(
    () => batches?.some(b => b.status === 'processing') ?? false,
    [batches],
  );

  // If a batch is selected, show its detail view
  if (selectedBatchId) {
    return (
      <BatchDetailView
        projectId={projectId}
        batchId={selectedBatchId}
        onBack={() => setSelectedBatchId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder={renderJobsTextMaps.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={renderJobsTextMaps.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{renderJobsTextMaps.allStatuses}</SelectItem>
            <SelectItem value="pending">{renderJobsTextMaps.statusQueued}</SelectItem>
            <SelectItem value="processing">{renderJobsTextMaps.statusProcessing}</SelectItem>
            <SelectItem value="completed">{renderJobsTextMaps.statusCompleted}</SelectItem>
            <SelectItem value="failed">{renderJobsTextMaps.statusFailed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorAlert
          message={renderJobsTextMaps.errorOccurred}
          onRetry={() => refetch()}
        />
      ) : !batches || batches.length === 0 ? (
        <EmptyState
          icon={Film}
          title={renderJobsTextMaps.noBatches}
          description={renderJobsTextMaps.noBatchesDescription}
        />
      ) : (
        <div className="space-y-3">
          {batches.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onClick={setSelectedBatchId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
