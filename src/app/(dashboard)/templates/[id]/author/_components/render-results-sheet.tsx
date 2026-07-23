'use client';

/**
 * RenderResultsSheet — immediate summary of the videos just generated.
 *
 * Opens automatically when render is triggered (isResultsSheetOpen in store).
 * This is the AT-THIS-MOMENT view of the current batch — distinct from the
 * project's render-jobs page, which is the full history.
 *
 * Layout (inspired by the reference "Video Previews" gallery): a wide BOTTOM
 * sheet with a horizontal row of cards, each keeping its real aspect ratio so
 * the row reads at a glance and never becomes a tall vertical scroll.
 * "Download All" pulls every ready output at once.
 */

import { Download } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useVideoGenerationStore } from '@/domains/video-generation/stores/video-generation-store';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';

import { RenderJobResultCard } from './render-job-result-card';

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderResultsSheet() {
  const {
    isResultsSheetOpen,
    setResultsSheetOpen,
    renderJobEntries,
    readyOutputs
  } = useVideoGenerationStore();

  if (renderJobEntries.length === 0) return null;

  const readyList = Object.values(readyOutputs);
  const allReady = readyList.length === renderJobEntries.length;

  // Trigger a download for each ready output. A short stagger avoids the browser
  // collapsing rapid same-tick navigations into a single download.
  function handleDownloadAll() {
    readyList.forEach(({ url }, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 150);
    });
  }

  return (
    <Sheet open={isResultsSheetOpen} onOpenChange={setResultsSheetOpen}>
      <SheetContent side="bottom" className="flex max-h-[85dvh] flex-col gap-0">
        <SheetHeader className="shrink-0 border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SheetTitle>{t.resultsSheetTitle}</SheetTitle>
              <SheetDescription>{t.resultsSheetDescription}</SheetDescription>
            </div>
            {readyList.length > 0 && (
              <Button
                variant={allReady ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={handleDownloadAll}
              >
                <Download className="size-4" aria-hidden />
                {t.resultsDownloadAll}
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Horizontal row of aspect-correct cards, top-aligned, scroll-x on overflow */}
        <div className="flex flex-1 items-start gap-4 overflow-x-auto overflow-y-hidden py-5">
          {renderJobEntries.map(({ jobId, format }) => (
            <RenderJobResultCard key={jobId} jobId={jobId} format={format} />
          ))}
        </div>

        {/* Footer count */}
        <div className="shrink-0 border-t pt-4">
          <p className="text-muted-foreground text-center text-xs">
            {t.resultsJobCount(renderJobEntries.length)}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
