'use client';

/**
 * SendToRenderButton — NEW single-product render trigger (D8).
 *
 * This is the golden-path send-to-render. It calls useCreateSingleRender,
 * NOT the data-engine batch endpoint (which lives in data-engine domain, untouched).
 *
 * - Disabled when form is invalid (spec: "Validation gates render")
 * - Shows error state clearly when backend is unavailable
 * - Stores jobIds returned from the backend for downstream polling
 *
 * Design ref: design.md §D8 — "send-to-render NUEVO single-product"
 * Spec: "Render MUST be blocked while any required field is missing"
 * Task: 4.5 (golden-path-video-generation)
 */

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateSingleRender } from '@/domains/video-generation/hooks/use-create-single-render';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import type { AssembledTemplateProps } from '@/domains/video-generation/types';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Demo project ID — will be replaced with real project context ─────────────
// TODO(task 5.x): integrate project selector / active project from context
const DEMO_PROJECT_ID = 'demo-project-001';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SendToRenderButtonProps {
  templateId: string;
  /** compositionId prefix from the registry — final id is `${prefix}-${format}`. */
  compositionIdPrefix: string;
  compositionProps: AssembledTemplateProps;
  activeFormat: VideoFormat;
  isFormValid: boolean;
  projectId?: string;
  /** Called with the job IDs returned by the backend so the parent can poll progress. */
  onJobsCreated?: (jobIds: string[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SendToRenderButton({
  templateId,
  compositionIdPrefix,
  compositionProps,
  activeFormat,
  isFormValid,
  projectId = DEMO_PROJECT_ID,
  onJobsCreated
}: SendToRenderButtonProps) {
  const { mutate: createRender, isPending, isError, error } = useCreateSingleRender(projectId);

  const handleRender = () => {
    if (!isFormValid) return;

    createRender(
      {
        templateId,
        compositionId: `${compositionIdPrefix}-${activeFormat.replace(':', '-')}`,
        compositionProps,
        format: activeFormat
      },
      {
        onSuccess: data => {
          onJobsCreated?.(data.jobIds);
        }
      }
    );
  };

  const isDisabled = !isFormValid || isPending;

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleRender}
        disabled={isDisabled}
        className="w-full"
        aria-label={isDisabled && !isFormValid ? t.renderButtonDisabledMissingFields : t.renderButtonLabel}
        aria-busy={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
            {t.renderButtonRendering}
          </>
        ) : (
          t.renderButtonLabel
        )}
      </Button>

      {/* Validation hint — shown when form is not valid */}
      {!isFormValid && (
        <p className="text-muted-foreground text-xs" role="status">
          {t.renderButtonDisabledMissingFields}
        </p>
      )}

      {/* Backend error — graceful failure (backend task 2.6 not yet implemented) */}
      {isError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="flex items-center justify-between text-xs">
            <span>{(error as Error).message || t.errorRenderFailed}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleRender}
              disabled={!isFormValid}
            >
              {t.errorRetry}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
