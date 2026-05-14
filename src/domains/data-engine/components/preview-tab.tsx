'use client';

/**
 * OP Video Engine — PreviewTab
 *
 * VariationGrid as main content + summary stats bar.
 * Shows: "N variations • X with errors • Y ready"
 *
 * Spec: SPEC-DE-008 / TASK-DE-030
 */

import { useMemo } from 'react';

import { VariationGrid } from './variation-grid';
import { useDataEngineStore } from '../stores/data-engine-store';
import { generateVariationsClient } from '../utils/generate-variations-client';
import { dataEngineTextMaps } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PreviewTabProps {
  projectId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PreviewTab({ projectId }: PreviewTabProps) {
  const parsedRows = useDataEngineStore(s => s.parsedRows);
  const mappingDraft = useDataEngineStore(s => s.mappingDraft);

  const variations = useMemo(
    () => generateVariationsClient(parsedRows, mappingDraft),
    [parsedRows, mappingDraft]
  );

  const total = variations.length;
  const withErrors = variations.filter(v =>
    v.errors.some(e => e.severity === 'error')
  ).length;
  const ready = total - withErrors;

  return (
    <div className="space-y-4">
      {/* Summary stats bar */}
      <div className="text-muted-foreground bg-muted/40 border-border flex items-center gap-3 rounded-[var(--radius-8)] border px-4 py-2 text-sm">
        <span className="text-foreground font-medium">
          {dataEngineTextMaps.totalVariations(total)}
        </span>
        <span aria-hidden>·</span>
        {withErrors > 0 && (
          <>
            <span className="text-destructive">
              {dataEngineTextMaps.variationsWithErrors(withErrors)}
            </span>
            <span aria-hidden>·</span>
          </>
        )}
        <span className="text-[var(--status-approved-text)]">
          {dataEngineTextMaps.variationsReady(ready)}
        </span>
      </div>

      {/* Grid */}
      <VariationGrid projectId={projectId} />
    </div>
  );
}
