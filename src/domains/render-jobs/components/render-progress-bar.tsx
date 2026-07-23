'use client';

/**
 * OP Video Engine — Render Progress Bar
 *
 * Wraps shadcn Progress with render-specific features:
 * - Percentage + frame count text
 * - Color changes by status
 * - Animated pulse when processing
 *
 * Plan: phase-4-rendering-pipeline.md — Group 4
 */

import { Progress } from '@/components/ui/progress';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderJobStatus } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderProgressBarProps {
  progress: number;
  status: RenderJobStatus;
  framesCurrent?: number;
  framesTotal?: number;
  estimatedTimeRemaining?: number;
  speed?: number;
  compact?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProgressColor(status: RenderJobStatus): string {
  switch (status) {
    case 'completed':
      return '[&>[data-slot=indicator]]:bg-[var(--status-approved-text)]';
    case 'failed':
      return '[&>[data-slot=indicator]]:bg-[var(--status-rejected-text)]';
    case 'cancelled':
      return '[&>[data-slot=indicator]]:bg-muted-foreground';
    case 'paused':
      return '[&>[data-slot=indicator]]:bg-[var(--status-warning-text)]';
    default:
      return '[&>[data-slot=indicator]]:bg-[var(--status-in-review-text)]';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderProgressBar({
  progress,
  status,
  framesCurrent,
  framesTotal,
  estimatedTimeRemaining,
  speed,
  compact = false
}: RenderProgressBarProps) {
  const colorClass = getProgressColor(status);
  const isProcessing = status === 'processing';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Progress
          value={progress}
          className={`h-2 flex-1 ${colorClass} ${isProcessing ? 'animate-pulse' : ''}`}
        />
        <span className="text-muted-foreground w-10 text-right text-xs tabular-nums">
          {progress}%
        </span>
      </div>

      {!compact && (
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
          {framesCurrent != null && framesTotal != null && (
            <span>
              {renderJobsTextMaps.framesProgress(framesCurrent, framesTotal)}
            </span>
          )}
          {isProcessing && speed != null && (
            <span>{renderJobsTextMaps.renderSpeed(speed)}</span>
          )}
          {isProcessing && estimatedTimeRemaining != null && (
            <span>{renderJobsTextMaps.eta(estimatedTimeRemaining)}</span>
          )}
        </div>
      )}
    </div>
  );
}
