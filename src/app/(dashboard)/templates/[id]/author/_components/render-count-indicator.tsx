'use client';

/**
 * RenderCountIndicator — shows active render jobs count + individual progress.
 *
 * Polls progress via GET /render-jobs/:id/progress (existing endpoint).
 * Uses aria-live so progress updates are announced to screen readers.
 *
 * Design ref: design.md §D5 — polling GET /render-jobs/:id/progress
 * Spec: "Render progress (30–90s) MUST be announced via aria-live"
 * Task: 4.5 (golden-path-video-generation)
 */

import { useRenderProgress } from '@/domains/video-generation/hooks/use-render-progress-polling';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderCountIndicatorProps {
  templateId: string;
  jobIds?: string[];
}

// ─── Per-job progress sub-component ──────────────────────────────────────────

interface JobProgressItemProps {
  jobId: string;
}

function JobProgressItem({ jobId }: JobProgressItemProps) {
  const isActive = true; // poll while this component is mounted
  const { data: progress, isError } = useRenderProgress(jobId, isActive);

  if (!progress) return null;

  const isProcessing = progress.status === 'processing' || progress.status === 'queued';
  const isCompleted = progress.status === 'completed';
  const isFailed = progress.status === 'failed';

  return (
    <div
      className="flex flex-col gap-1.5 rounded-[var(--radius-8)] border border-border p-2"
      role="region"
      aria-label={t.progressAriaLabel}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground truncate font-mono text-[10px]">
          {jobId.slice(0, 8)}…
        </span>
        <div className="flex items-center gap-1.5">
          {isCompleted && (
            <>
              <CheckCircle2 className="size-3.5 text-emerald-500" aria-hidden />
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-[10px]"
                asChild
              >
                {/* TODO(task 5.x): replace with real download URL from render output */}
                <a href={`#download-${jobId}`} aria-label={t.downloadAriaLabel('MP4')}>
                  <Download className="size-3" aria-hidden />
                  {t.downloadLabel('MP4')}
                </a>
              </Button>
            </>
          )}
          {isFailed && (
            <AlertCircle className="size-3.5 text-destructive" aria-hidden />
          )}
        </div>
      </div>

      {/* Progress bar — only shown while processing */}
      {isProcessing && (
        <Progress
          value={progress.progress}
          className="h-1.5"
          aria-label={t.progressAriaLabel}
          aria-valuenow={progress.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}

      {/* aria-live region for screen readers */}
      <p
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {isProcessing && t.progressPercent(progress.progress)}
        {isCompleted && t.renderJobCompleted}
        {isFailed && t.renderJobFailed}
      </p>

      {/* Human-readable status */}
      {isProcessing && (
        <span className="text-muted-foreground text-[10px]">
          {t.progressPercent(progress.progress)}
          {progress.estimatedTimeRemaining
            ? ` · ${t.progressEstimate(progress.estimatedTimeRemaining)}`
            : ''}
        </span>
      )}

      {isError && (
        <span className="text-[10px] text-destructive">{t.renderJobFailed}</span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RenderCountIndicator({ templateId, jobIds = [] }: RenderCountIndicatorProps) {
  if (jobIds.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px]">
          {t.renderCountLabel(jobIds.length)}
        </Badge>
      </div>
      <div className="flex flex-col gap-1.5">
        {jobIds.map(id => (
          <JobProgressItem key={id} jobId={id} />
        ))}
      </div>
    </div>
  );
}
