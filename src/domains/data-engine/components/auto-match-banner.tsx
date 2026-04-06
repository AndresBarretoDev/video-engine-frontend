'use client';

/**
 * OP Video Engine — Auto-Match Banner
 *
 * Banner shown when auto-match algorithm finds suggestions.
 * "Apply Suggestions" applies them to the Zustand mapping draft.
 * Spec: SPEC-DE-005
 */

import { Wand2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { dataEngineTextMaps } from '../text-maps';
import type { AutoMatchSuggestion } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AutoMatchBannerProps {
  suggestions: AutoMatchSuggestion[];
  onApply: () => void;
  onDismiss: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AutoMatchBanner({
  suggestions,
  onApply,
  onDismiss
}: AutoMatchBannerProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-8)] border border-[var(--color-op-blue-200)] bg-[var(--color-op-blue-50)] px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-8)] bg-[var(--color-op-blue-100)]">
        <Wand2 className="size-4 text-[var(--color-op-blue-600)]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium">
          {dataEngineTextMaps.suggestionsFound(suggestions.length)}
        </p>
        <p className="text-muted-foreground text-xs">
          {dataEngineTextMaps.applyAutoMatch}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" onClick={onApply} className="h-7 text-xs">
          {dataEngineTextMaps.applyAutoMatch}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-7"
          onClick={onDismiss}
        >
          <X className="size-3.5" />
          <span className="sr-only">
            {dataEngineTextMaps.autoMatchDismissed}
          </span>
        </Button>
      </div>
    </div>
  );
}
