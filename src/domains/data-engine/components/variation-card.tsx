'use client';

/**
 * OP Video Engine — VariationCard
 *
 * Card per variation (row from spreadsheet).
 * Shows: row index, key data values, format badge, error/warning indicators.
 * Checkbox for selection. Click opens detail drawer.
 *
 * Spec: SPEC-DE-008 / TASK-DE-025
 */

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  SkipForward
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { VariationThumbnail } from './variation-thumbnail';
import { dataEngineTextMaps } from '../text-maps';
import type { Variation } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getVariationStatus(variation: Variation) {
  if (variation.isSkipped) return 'skipped';
  const hasErrors = variation.errors.some(e => e.severity === 'error');
  const hasWarnings = variation.errors.some(e => e.severity === 'warning');
  if (hasErrors) return 'error';
  if (hasWarnings) return 'warning';
  return 'valid';
}

function getTopDataValues(
  rowData: Record<string, unknown>,
  maxValues = 2
): { key: string; value: string }[] {
  return Object.entries(rowData)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .slice(0, maxValues)
    .map(([k, v]) => ({ key: k, value: String(v) }));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariationCardProps {
  variation: Variation;
  templateId: string;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onClick: (variation: Variation) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VariationCard({
  variation,
  templateId,
  isSelected,
  onSelect,
  onClick
}: VariationCardProps) {
  const status = getVariationStatus(variation);
  const topValues = getTopDataValues(variation.rowData);
  const errorCount = variation.errors.filter(
    e => e.severity === 'error'
  ).length;
  const warningCount = variation.errors.filter(
    e => e.severity === 'warning'
  ).length;

  const borderClass = {
    valid: 'border-border',
    warning: 'border-[var(--status-warning-border)]',
    error: 'border-destructive',
    skipped: 'border-border opacity-60'
  }[status];

  return (
    <div
      className={[
        'bg-card cursor-pointer overflow-hidden rounded-[var(--radius-12)] border',
        'transition-shadow hover:shadow-md',
        borderClass,
        isSelected
          ? 'ring-2 ring-[var(--btn-principal-light-medium)] ring-offset-1'
          : ''
      ].join(' ')}
      onClick={() => onClick(variation)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(variation)}
      aria-label={dataEngineTextMaps.openDetail}
    >
      {/* Thumbnail */}
      <div className="relative">
        <VariationThumbnail
          resolvedProps={variation.props}
          templateId={templateId}
          hasErrors={status === 'error'}
          index={variation.index}
        />

        {/* Checkbox — top right */}
        <div
          className="absolute top-2 right-2"
          onClick={e => {
            e.stopPropagation();
            onSelect(variation.index);
          }}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(variation.index)}
            aria-label={dataEngineTextMaps.selectVariationLabel(
              variation.index + 1
            )}
            className="bg-background/90 shadow-sm"
          />
        </div>
      </div>

      {/* Card body */}
      <div className="space-y-2 p-3">
        {/* Row index + status */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-xs tabular-nums">
            {dataEngineTextMaps.rowIndex(variation.index)}
          </Badge>

          {status === 'valid' && (
            <span className="flex items-center gap-1 text-xs text-[var(--status-approved-text)]">
              <CheckCircle2 className="size-3" />
              {dataEngineTextMaps.variationValid}
            </span>
          )}
          {status === 'error' && (
            <span className="text-destructive flex items-center gap-1 text-xs">
              <AlertCircle className="size-3" />
              {dataEngineTextMaps.variationHasErrors(errorCount)}
            </span>
          )}
          {status === 'warning' && (
            <span className="flex items-center gap-1 text-xs text-[var(--status-warning-text)]">
              <AlertTriangle className="size-3" />
              {dataEngineTextMaps.variationHasErrors(warningCount)}
            </span>
          )}
          {status === 'skipped' && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <SkipForward className="size-3" />
              {dataEngineTextMaps.variationSkipped}
            </span>
          )}
        </div>

        {/* Top data values */}
        <div className="space-y-0.5">
          {topValues.map(({ key, value }) => (
            <p key={key} className="text-muted-foreground truncate text-xs">
              <span className="text-foreground font-medium">{key}:</span>{' '}
              <span className="truncate">{value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
