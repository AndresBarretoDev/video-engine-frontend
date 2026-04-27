'use client';

/**
 * OP Video Engine — Batch Detail View
 *
 * Expanded view of a single render batch.
 * Shows batch header, aggregate progress, actions, and job grid.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 4
 */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';
import { EmptyState } from '@/components/shared/empty-state';

import {
  useRenderBatch,
  useCancelRenderBatch,
  useRetryFailedInBatch,
} from '../hooks/use-render-batches';
import { useRenderJobs, useCancelRenderJob, useRetryRenderJob } from '../hooks/use-render-jobs';
import { RenderStatusBadge } from './render-status-badge';
import { RenderProgressBar } from './render-progress-bar';
import { BatchActionsBar } from './batch-actions-bar';
import { RenderJobCard } from './render-job-card';
import { RenderJobDrawer } from './render-job-drawer';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderJob } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BatchDetailViewProps {
  projectId: string;
  batchId: string;
  onBack: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BatchDetailView({
  projectId,
  batchId,
  onBack,
}: BatchDetailViewProps) {
  const [selectedJob, setSelectedJob] = useState<RenderJob | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isProcessing = false; // Will be derived from data
  const {
    data: batch,
    isLoading: batchLoading,
    isError: batchError,
    refetch: refetchBatch,
  } = useRenderBatch(projectId, batchId, isProcessing);

  const {
    data: jobs,
    isLoading: jobsLoading,
    isError: jobsError,
    refetch: refetchJobs,
  } = useRenderJobs(projectId);

  const cancelBatch = useCancelRenderBatch(projectId);
  const retryFailed = useRetryFailedInBatch(projectId);
  const cancelJob = useCancelRenderJob(projectId);
  const retryJob = useRetryRenderJob(projectId);

  // Filter jobs belonging to this batch
  const batchJobs = jobs?.filter(j => batch?.jobIds.includes(j.id)) ?? [];

  const progressPercent =
    batch && batch.totalJobs > 0
      ? Math.round((batch.completedJobs / batch.totalJobs) * 100)
      : 0;

  function handleJobClick(job: RenderJob) {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  }

  if (batchLoading || jobsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-[var(--radius-12)]" />
          ))}
        </div>
      </div>
    );
  }

  if (batchError || jobsError) {
    return (
      <ErrorAlert
        message={renderJobsTextMaps.errorOccurred}
        onRetry={() => {
          refetchBatch();
          refetchJobs();
        }}
      />
    );
  }

  if (!batch) return null;

  const batchStatus =
    batch.status === 'processing' ? 'processing' : batch.status === 'completed' ? 'completed' : batch.status === 'failed' ? 'failed' : 'queued';

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onBack}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="text-foreground text-xl font-bold tracking-tight">
                {batch.name}
              </h2>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-sm">
                <RenderStatusBadge status={batch.status} />
                <span>
                  {renderJobsTextMaps.batchProgress(
                    batch.completedJobs,
                    batch.totalJobs,
                  )}
                </span>
              </div>
            </div>
          </div>

          <BatchActionsBar
            batch={batch}
            onCancel={() => cancelBatch.mutate(batchId)}
            onRetryFailed={() => retryFailed.mutate(batchId)}
            isCancelling={cancelBatch.isPending}
            isRetrying={retryFailed.isPending}
          />
        </div>

        {/* Aggregate progress */}
        <RenderProgressBar
          progress={progressPercent}
          status={batchStatus}
        />

        {/* Job grid */}
        {batchJobs.length === 0 ? (
          <EmptyState title={renderJobsTextMaps.noJobs} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {batchJobs.map(job => (
              <RenderJobCard
                key={job.id}
                job={job}
                onCancel={id => cancelJob.mutate(id)}
                onRetry={id => retryJob.mutate(id)}
                onClick={handleJobClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Job detail drawer */}
      <RenderJobDrawer
        job={selectedJob}
        projectId={projectId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
