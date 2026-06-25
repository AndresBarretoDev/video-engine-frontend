'use client';

/**
 * RenderCountBadge — compact badge that reopens the results sheet.
 *
 * Shows when there are render job entries in the store.
 * Progress details live in RenderResultsSheet; this is just the re-entry point.
 */

import { Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoGenerationStore } from '@/domains/video-generation/stores/video-generation-store';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderCountIndicator() {
  const { renderJobEntries, setResultsSheetOpen } = useVideoGenerationStore();

  if (renderJobEntries.length === 0) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setResultsSheetOpen(true)}
      className="w-full gap-2"
      aria-label={t.renderBadgeViewResults}
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        <span className="bg-primary relative inline-flex size-2 rounded-full" />
      </span>
      <Clapperboard className="size-3.5" aria-hidden />
      {t.renderBadgeActive(renderJobEntries.length)}
    </Button>
  );
}
