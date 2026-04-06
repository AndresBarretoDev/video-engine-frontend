'use client';

/**
 * OP Video Engine — Unmapped Columns Alert
 *
 * Shows a warning when there are columns that haven't been mapped.
 * Can be dismissed by the user.
 * Spec: SPEC-DE-004
 */

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { dataEngineTextMaps } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UnmappedColumnsAlertProps {
  unmappedColumns: string[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UnmappedColumnsAlert({
  unmappedColumns
}: UnmappedColumnsAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || unmappedColumns.length === 0) return null;

  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-8)] border border-[var(--status-warning-border)] bg-[var(--status-warning-bg)] px-4 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--status-warning-text)]" />

      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="text-foreground text-sm font-medium">
          {dataEngineTextMaps.unmapped}{' '}
          {dataEngineTextMaps.columns.toLowerCase()}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {unmappedColumns.map(col => (
            <Badge
              key={col}
              variant="outline"
              className="border-[var(--status-warning-border)] bg-[var(--status-warning-bg)] text-xs font-normal text-[var(--status-warning-text)]"
            >
              {col}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-[var(--status-warning-text)]">
          {dataEngineTextMaps.imageUrlWarning}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-[var(--status-warning-text)] hover:bg-[var(--status-warning-bg)] hover:text-[var(--status-warning-icon)]"
        onClick={() => setDismissed(true)}
      >
        <X className="size-3.5" />
        <span className="sr-only">{dataEngineTextMaps.dismissAlert}</span>
      </Button>
    </div>
  );
}
