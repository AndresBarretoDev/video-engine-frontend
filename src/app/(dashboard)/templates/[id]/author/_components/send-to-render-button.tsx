'use client';

/**
 * SendToRenderButton — multi-format render trigger for the golden path.
 *
 * Fires one POST /render-single per selected format (Promise.allSettled so a
 * single format failure doesn't block the others). Calls onJobsCreated with
 * every { jobId, format } pair collected from all successful responses.
 *
 * Design ref: design.md §D8 — send-to-render NUEVO single-product
 * Spec: "Render MUST be blocked while any required field is missing"
 *       "At least one format must be selected"
 */

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateSingleRender } from '@/domains/video-generation/hooks/use-create-single-render';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import type { AssembledTemplateProps } from '@/domains/video-generation/types';
import type { RenderJobEntry } from '@/domains/video-generation/stores/video-generation-store';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Demo project ID ─────────────────────────────────────────────────────────
// TODO(task 5.x): replace with real project context.
// Must be a valid UUID v4 — backend validates with @IsUUID().
const DEMO_PROJECT_ID = '00000000-0000-4000-8000-000000000000';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SendToRenderButtonProps {
  templateId: string;
  compositionIdPrefix: string;
  compositionProps: AssembledTemplateProps;
  /** Formats selected via FormatSelector — one job is created per format. */
  selectedFormats: VideoFormat[];
  isFormValid: boolean;
  projectId?: string;
  /** Called with all { jobId, format } pairs from successful render calls. */
  onJobsCreated?: (entries: RenderJobEntry[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SendToRenderButton({
  templateId,
  compositionIdPrefix,
  compositionProps,
  selectedFormats,
  isFormValid,
  projectId = DEMO_PROJECT_ID,
  onJobsCreated
}: SendToRenderButtonProps) {
  const { mutateAsync } = useCreateSingleRender(projectId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canRender = isFormValid && selectedFormats.length > 0 && !isSubmitting;

  async function handleRender() {
    if (!canRender) return;
    setIsSubmitting(true);
    setHasError(false);

    const results = await Promise.allSettled(
      selectedFormats.map(format =>
        mutateAsync({
          templateId,
          compositionId: `${compositionIdPrefix}-${format.replace(':', '-')}`,
          compositionProps,
          format
        })
      )
    );

    const entries: RenderJobEntry[] = results.flatMap((result, i) => {
      if (result.status === 'fulfilled') {
        return result.value.jobIds.map(jobId => ({
          jobId,
          format: selectedFormats[i]
        }));
      }
      return [];
    });

    // ONE toast per user action — never one-per-format. The mutation hook is
    // intentionally silent; messaging is decided here from the aggregate result.
    const okCount = results.filter(r => r.status === 'fulfilled').length;
    const total = results.length;

    if (entries.length > 0) {
      if (okCount === total) {
        toast.success(t.videosSentToRender(okCount));
      } else {
        toast.warning(t.videosSentPartial(okCount, total));
      }
      setHasError(false);
      onJobsCreated?.(entries);
    } else {
      toast.error(t.errorRenderFailed);
      setHasError(true);
    }

    setIsSubmitting(false);
  }

  const buttonLabel = isSubmitting
    ? t.renderButtonRendering
    : t.renderButtonMultiple(selectedFormats.length);

  const disabledHint = !isFormValid
    ? t.renderButtonDisabledMissingFields
    : selectedFormats.length === 0
      ? t.formatSelectorHint
      : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleRender}
        disabled={!canRender}
        className="w-full"
        aria-label={disabledHint ?? buttonLabel}
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
        )}
        {buttonLabel}
      </Button>

      {disabledHint && (
        <p className="text-muted-foreground text-xs" role="status">
          {disabledHint}
        </p>
      )}

      {hasError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="flex items-center justify-between text-xs">
            <span>{t.errorRenderFailed}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleRender}
              disabled={!canRender}
            >
              {t.errorRetry}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
