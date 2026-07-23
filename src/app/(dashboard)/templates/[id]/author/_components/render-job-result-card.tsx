'use client';

/**
 * RenderJobResultCard — single format card inside the results sheet.
 *
 * One fixed-width column whose media area keeps the format's REAL aspect ratio
 * (square / vertical / horizontal), so a row of cards reads at a glance — the
 * shape tells you the format. Inspired by the reference "Video Previews" gallery.
 *
 * Lifecycle:
 *   processing → muted box + spinner + "Generating…", disabled download
 *   completed  → <video> player + active download button
 *   failed     → error box
 *
 * Polls useRenderProgress until terminal, then fetches useRenderOutputs
 * (enabled only on completion). Reports the ready URL to the store so the
 * sheet's "Download All" can collect every output.
 */

import { useEffect, useState } from 'react';
import { Download, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  useRenderProgress,
  useRenderOutputs
} from '@/domains/render-jobs/hooks/use-render-jobs';
import { useVideoGenerationStore } from '@/domains/video-generation/stores/video-generation-store';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Aspect ratio per format ──────────────────────────────────────────────────

const ASPECT_CLASS: Record<VideoFormat, string> = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '1:1': 'aspect-square'
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderJobResultCardProps {
  jobId: string;
  format: VideoFormat;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderJobResultCard({
  jobId,
  format
}: RenderJobResultCardProps) {
  const [hasTerminated, setHasTerminated] = useState(false);
  const setReadyOutput = useVideoGenerationStore(s => s.setReadyOutput);

  const { data: progress, isError: progressError } = useRenderProgress(
    jobId,
    !hasTerminated
  );

  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed' || progressError;
  const isProcessing = !isCompleted && !isFailed;

  const { data: outputs } = useRenderOutputs(jobId, isCompleted);
  const output = outputs?.[0];

  useEffect(() => {
    if (isCompleted || isFailed) setHasTerminated(true);
  }, [isCompleted, isFailed]);

  // Report the ready file to the store so "Download All" can find it.
  useEffect(() => {
    if (isCompleted && output) {
      setReadyOutput(jobId, { url: output.fileUrl, format });
    }
  }, [isCompleted, output, jobId, format, setReadyOutput]);

  const aspectClass = ASPECT_CLASS[format];

  return (
    <div className="border-border bg-card flex w-64 shrink-0 flex-col gap-3 rounded-[var(--radius-12)] border p-4">
      {/* Header — friendly title + status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-foreground text-sm font-semibold">
          {t.resultsCardFormatTitle(format)}
        </span>
        {isCompleted && (
          <Badge className="bg-primary text-primary-foreground shrink-0 text-[10px]">
            {t.resultsCardReady}
          </Badge>
        )}
        {isFailed && (
          <Badge variant="destructive" className="shrink-0 gap-1 text-[10px]">
            <AlertCircle className="size-3" />
            {t.resultsCardFailed}
          </Badge>
        )}
        {isProcessing && (
          <Badge className="shrink-0 gap-1 border-transparent bg-amber-400 text-[10px] text-amber-950">
            <Loader2 className="size-3 animate-spin" />
            {t.resultsCardProcessing}
          </Badge>
        )}
      </div>

      {/* Media area — keeps the format's REAL aspect ratio */}
      <div
        className={`relative w-full overflow-hidden rounded-[var(--radius-8)] ${aspectClass} ${
          isCompleted && output ? 'bg-black' : 'bg-muted'
        }`}
      >
        {isCompleted && output ? (
          <video
            src={output.fileUrl}
            controls
            className="h-full w-full object-contain"
            aria-label={t.resultsDownloadFormat(format)}
          />
        ) : isFailed ? (
          <div className="flex h-full w-full items-center justify-center">
            <AlertCircle className="text-destructive size-7" aria-hidden />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
            <Loader2
              className="text-muted-foreground size-6 animate-spin"
              aria-hidden
            />
            <span className="text-muted-foreground text-xs">
              {t.resultsCardGenerating}
            </span>
            {progress && progress.progress > 0 && (
              <Progress
                value={progress.progress}
                className="mt-1 h-1 w-4/5"
                aria-label={t.progressAriaLabel}
                aria-valuenow={progress.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            )}
          </div>
        )}
      </div>

      {/* Download button — active when ready, disabled placeholder while processing */}
      {isFailed ? null : isCompleted && output ? (
        <Button variant="default" size="sm" className="w-full gap-2" asChild>
          <a href={output.fileUrl} download>
            <Download className="size-3.5" aria-hidden />
            {t.resultsDownloadFormat(format)}
          </a>
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 opacity-50"
          disabled
        >
          <Download className="size-3.5" aria-hidden />
          {t.resultsDownloadFormat(format)}
        </Button>
      )}

      {/* sr-only live region */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {isCompleted && t.renderJobCompleted}
        {isFailed && t.renderJobFailed}
        {isProcessing && progress ? t.progressPercent(progress.progress) : ''}
      </p>
    </div>
  );
}
