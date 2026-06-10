'use client';

/**
 * FormatTabs — toggle between 16:9 / 9:16 / 1:1 preview formats.
 *
 * Uses Tabs (shadcn) for accessible keyboard navigation.
 * Only shows formats actually available on the template descriptor.
 *
 * Spec: video-generation/spec.md — "Multi-format auto-layout"
 * Task: 4.4 (golden-path-video-generation)
 */

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface FormatTabsProps {
  activeFormat: VideoFormat;
  formats: VideoFormat[];
  onFormatChange: (format: VideoFormat) => void;
}

// ─── Label map ────────────────────────────────────────────────────────────────

const FORMAT_LABELS: Record<VideoFormat, string> = {
  '16:9': t.format16x9,
  '9:16': t.format9x16,
  '1:1': t.format1x1
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FormatTabs({ activeFormat, formats, onFormatChange }: FormatTabsProps) {
  return (
    <Tabs
      value={activeFormat}
      onValueChange={v => onFormatChange(v as VideoFormat)}
      aria-label={t.formatTabsLabel}
    >
      <TabsList>
        {formats.map(format => (
          <TabsTrigger
            key={format}
            value={format}
            aria-label={t.formatAriaLabel(format)}
          >
            {FORMAT_LABELS[format] ?? format}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
