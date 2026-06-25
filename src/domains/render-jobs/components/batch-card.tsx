'use client';

/**
 * OP Video Engine — Batch Card
 *
 * Displays a render batch summary: name, status, progress, job counts.
 * Clickable to expand/navigate to batch detail.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 3
 */

import { ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { RenderStatusBadge } from './render-status-badge';
import { RenderProgressBar } from './render-progress-bar';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderBatch } from '../types';

// ─── Priority badge ──────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<string, string> = {
  low: renderJobsTextMaps.priorityLow,
  normal: renderJobsTextMaps.priorityNormal,
  high: renderJobsTextMaps.priorityHigh,
  urgent: renderJobsTextMaps.priorityUrgent,
};

const PRIORITY_CLASS: Record<string, string> = {
  low: 'border-border text-muted-foreground',
  normal: 'border-border text-muted-foreground',
  high: 'border-[var(--status-warning-border)] text-[var(--status-warning-text)] bg-[var(--status-warning-bg)]',
  urgent:
    'border-[var(--status-rejected-border)] text-[var(--status-rejected-text)] bg-[var(--status-rejected-bg)]',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface BatchCardProps {
  batch: RenderBatch;
  onClick: (batchId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BatchCard({ batch, onClick }: BatchCardProps) {
  const progressPercent =
    batch.totalJobs > 0
      ? Math.round((batch.completedJobs / batch.totalJobs) * 100)
      : 0;

  const batchStatus =
    batch.status === 'processing' ? 'processing' : batch.status === 'completed' ? 'completed' : batch.status === 'failed' ? 'failed' : 'queued';

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(batch.createdAt));

  return (
    <Card
      className="group cursor-pointer transition-colors hover:bg-accent/30"
      onClick={() => onClick(batch.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate font-semibold leading-tight">
              {batch.name}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {formattedDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RenderStatusBadge status={batch.status} />
            {batch.priority !== 'normal' && (
              <Badge
                variant="outline"
                className={`text-xs ${PRIORITY_CLASS[batch.priority]}`}
              >
                {PRIORITY_LABEL[batch.priority]}
              </Badge>
            )}
            <ChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress bar */}
        <RenderProgressBar
          progress={progressPercent}
          status={batchStatus}
          compact
        />

        {/* Job counts */}
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span>{renderJobsTextMaps.batchProgress(batch.completedJobs, batch.totalJobs)}</span>
          {batch.failedJobs > 0 && (
            <span className="text-[var(--status-rejected-text)]">
              {batch.failedJobs} {renderJobsTextMaps.failedJobs.toLowerCase()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
