'use client';

/**
 * FormatSelector — checkboxes to choose which output formats to render.
 *
 * Separate from FormatTabs (which controls the live preview).
 * FormatTabs = "which format am I previewing?"
 * FormatSelector = "which formats do I want in the output?"
 *
 * Enforces minimum 1 selected — the last checked item cannot be unchecked.
 */

import { Checkbox } from '@/components/ui/checkbox';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import { useVideoGenerationStore } from '@/domains/video-generation/stores/video-generation-store';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface FormatSelectorProps {
  availableFormats: VideoFormat[];
}

// ─── Label map ────────────────────────────────────────────────────────────────

const FORMAT_DISPLAY: Record<VideoFormat, { label: string; sub: string }> = {
  '16:9': { label: t.format16x9, sub: t.formatLandscape },
  '9:16': { label: t.format9x16, sub: t.formatVertical },
  '1:1': { label: t.format1x1, sub: t.formatSquare }
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FormatSelector({ availableFormats }: FormatSelectorProps) {
  const { selectedFormats, setSelectedFormats } = useVideoGenerationStore();

  function toggle(format: VideoFormat) {
    const isSelected = selectedFormats.includes(format);
    if (isSelected && selectedFormats.length === 1) return;
    const next = isSelected
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format];
    setSelectedFormats(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-foreground text-sm font-medium">
        {t.formatSelectorLabel}
      </span>
      <div className="flex flex-wrap gap-2">
        {availableFormats.map(format => {
          const isSelected = selectedFormats.includes(format);
          const isOnlyOne = isSelected && selectedFormats.length === 1;
          const display = FORMAT_DISPLAY[format] ?? { label: format, sub: '' };

          return (
            <label
              key={format}
              className={[
                'flex cursor-pointer items-center gap-2 rounded-[var(--radius-8)] border px-3 py-2 transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted/40',
                isOnlyOne ? 'cursor-not-allowed opacity-60' : ''
              ].join(' ')}
            >
              <Checkbox
                id={`format-${format}`}
                checked={isSelected}
                onCheckedChange={() => toggle(format)}
                disabled={isOnlyOne}
                aria-label={t.formatAriaLabel(format)}
              />
              <div className="flex flex-col leading-none">
                <span className="text-foreground text-xs font-semibold">
                  {display.label}
                </span>
                <span className="text-muted-foreground text-[10px]">
                  {display.sub}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      <p className="text-muted-foreground text-[11px]">
        {t.formatSelectorHint}
      </p>
    </div>
  );
}
