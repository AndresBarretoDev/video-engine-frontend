'use client';

/**
 * OP Video Engine — PreviewTab
 *
 * VariationGrid as main content + summary stats bar.
 * Shows: "N variations • X with errors • Y ready"
 *
 * Spec: SPEC-DE-008 / TASK-DE-030
 */

import { useVariations } from '../hooks/use-variations';
import { VariationGrid } from './variation-grid';
import { dataEngineTextMaps } from '../text-maps';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Props ────────────────────────────────────────────────────────────────────

interface PreviewTabProps {
  projectId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PreviewTab({ projectId }: PreviewTabProps) {
  const { data } = useVariations(projectId);

  // Compute stats
  const total = data?.total ?? 0;
  const withErrors =
    data?.items.filter(v => v.errors.some(e => e.severity === 'error'))
      .length ?? 0;
  const ready = total - withErrors;

  return (
    <div className="space-y-4">
      {/* Summary stats bar */}
      <div className="text-muted-foreground bg-muted/40 border-border flex items-center gap-3 rounded-[var(--radius-8)] border px-4 py-2 text-sm">
        {total > 0 ? (
          <>
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
          </>
        ) : (
          <Skeleton className="h-4 w-48" />
        )}
      </div>

      {/* Grid */}
      <VariationGrid projectId={projectId} />
    </div>
  );
}
