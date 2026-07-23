'use client';

/**
 * OP Video Engine — Render Job Drawer
 *
 * Right-side sheet showing full job detail:
 * Status, progress, configuration, logs, errors, output.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 5
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

import { useRenderProgress, useRenderOutputs } from '../hooks/use-render-jobs';
import { RenderStatusBadge } from './render-status-badge';
import { RenderProgressBar } from './render-progress-bar';
import { RenderLogViewer } from './render-log-viewer';
import { RenderOutputCard } from './render-output-card';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderJob } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderJobDrawerProps {
  job: RenderJob | null;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderJobDrawer({
  job,
  isOpen,
  onClose
}: RenderJobDrawerProps) {
  const isProcessing = job?.status === 'processing';

  const { data: progress } = useRenderProgress(
    job?.id ?? '',
    isOpen && isProcessing
  );

  const { data: outputs, isLoading: outputsLoading } = useRenderOutputs(
    job?.status === 'completed' ? (job?.id ?? '') : ''
  );

  if (!job) return null;

  const currentProgress = progress ?? {
    progress: job.progress,
    status: job.status,
    framesCurrent: job.framesCurrent,
    framesTotal: job.framesTotal
  };

  const formattedCreated = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(job.createdAt));

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">{job.name}</SheetTitle>
          <SheetDescription className="text-left">
            {formattedCreated}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <RenderStatusBadge status={currentProgress.status ?? job.status} />
          </div>

          {/* Progress */}
          <RenderProgressBar
            progress={currentProgress.progress ?? job.progress}
            status={currentProgress.status ?? job.status}
            framesCurrent={currentProgress.framesCurrent}
            framesTotal={currentProgress.framesTotal}
            estimatedTimeRemaining={
              'estimatedTimeRemaining' in currentProgress
                ? currentProgress.estimatedTimeRemaining
                : undefined
            }
            speed={
              'speed' in currentProgress ? currentProgress.speed : undefined
            }
          />

          {/* Accordion sections */}
          <Accordion type="multiple" defaultValue={['logs', 'output']}>
            {/* Logs */}
            <AccordionItem value="logs">
              <AccordionTrigger>
                {renderJobsTextMaps.logsSection}
              </AccordionTrigger>
              <AccordionContent>
                <RenderLogViewer logs={progress?.logs ?? []} />
              </AccordionContent>
            </AccordionItem>

            {/* Errors */}
            {job.status === 'failed' && (
              <AccordionItem value="errors">
                <AccordionTrigger>
                  {renderJobsTextMaps.errorsSection}
                </AccordionTrigger>
                <AccordionContent>
                  {progress?.logs?.filter(l =>
                    l.toLowerCase().includes('error')
                  ).length ? (
                    <RenderLogViewer
                      logs={progress.logs.filter(l =>
                        l.toLowerCase().includes('error')
                      )}
                    />
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {renderJobsTextMaps.noErrors}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Output */}
            {job.status === 'completed' && (
              <AccordionItem value="output">
                <AccordionTrigger>
                  {renderJobsTextMaps.outputSection}
                </AccordionTrigger>
                <AccordionContent>
                  {outputsLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : outputs && outputs.length > 0 ? (
                    <div className="space-y-2">
                      {outputs.map(output => (
                        <RenderOutputCard key={output.id} output={output} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {renderJobsTextMaps.noLogs}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
