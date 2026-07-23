'use client';

/**
 * OP Video Engine — Render Job Card
 *
 * Individual job card in the batch detail grid.
 * Shows: name, status badge, progress bar, frame count, actions.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 4
 */

import { RotateCcw, Square, ExternalLink } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { RenderStatusBadge } from './render-status-badge';
import { RenderProgressBar } from './render-progress-bar';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderJob } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderJobCardProps {
  job: RenderJob;
  onCancel: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onClick: (job: RenderJob) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderJobCard({
  job,
  onCancel,
  onRetry,
  onClick
}: RenderJobCardProps) {
  const canCancel = job.status === 'queued' || job.status === 'processing';
  const canRetry = job.status === 'failed';

  const durationText = job.actualDuration
    ? `${Math.round(job.actualDuration)}s`
    : job.estimatedDuration
      ? `~${Math.round(job.estimatedDuration)}s`
      : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              className="text-foreground hover:text-primary truncate text-left text-sm font-medium transition-colors"
              onClick={() => onClick(job)}
            >
              {job.name}
            </button>
          </div>
          <RenderStatusBadge status={job.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress */}
        <RenderProgressBar
          progress={job.progress}
          status={job.status}
          framesCurrent={job.framesCurrent}
          framesTotal={job.framesTotal}
          compact
        />

        {/* Meta + Actions */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            {durationText && <span>{durationText}</span>}
          </div>

          <div className="flex items-center gap-1">
            {canRetry && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={e => {
                  e.stopPropagation();
                  onRetry(job.id);
                }}
                aria-label={renderJobsTextMaps.retryJob}
              >
                <RotateCcw className="size-3.5" />
              </Button>
            )}
            {canCancel && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={e => {
                  e.stopPropagation();
                  onCancel(job.id);
                }}
                aria-label={renderJobsTextMaps.cancelJob}
              >
                <Square className="size-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={e => {
                e.stopPropagation();
                onClick(job);
              }}
              aria-label={renderJobsTextMaps.jobDetail}
            >
              <ExternalLink className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
