'use client';

/**
 * OP Video Engine — Mapping Row
 *
 * Single row: [Column name + type badge] → [Select prop path] → [Transform] → [Remove]
 * Shows type mismatch warning when column type doesn't match expected prop type.
 * Spec: SPEC-DE-004
 */

import { Wand2, X, AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { COLUMN_TYPE_BADGE_CONFIG } from '../constants';
import { dataEngineTextMaps } from '../text-maps';
import type {
  MappingDraftEntry,
  ParsedColumn,
  TemplatePropDefinition
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ColumnType = ParsedColumn['type'];

function hasTypeMismatch(
  columnType: ColumnType,
  propType: TemplatePropDefinition['type'] | undefined
): boolean {
  if (!propType) return false;
  // Known incompatibilities
  if (propType === 'image' && columnType !== 'image_url') return true;
  if (propType === 'video' && columnType !== 'video_url') return true;
  if (propType === 'number' && columnType === 'string') return true;
  return false;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface MappingRowProps {
  entry: MappingDraftEntry;
  column: ParsedColumn | undefined;
  availableProps: TemplatePropDefinition[];
  onUpdate: (entry: MappingDraftEntry) => void;
  onRemove: (id: string) => void;
  onConfigureTransform: (entry: MappingDraftEntry) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MappingRow({
  entry,
  column,
  availableProps,
  onUpdate,
  onRemove,
  onConfigureTransform
}: MappingRowProps) {
  const selectedProp = availableProps.find(p => p.path === entry.propPath);
  const typeMismatch = column
    ? hasTypeMismatch(column.type, selectedProp?.type)
    : false;

  function handlePropChange(propPath: string) {
    onUpdate({ ...entry, propPath, transform: undefined });
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-3 rounded-[var(--radius-8)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-1)] px-3 py-2.5">
        {/* Column info */}
        <div className="flex min-w-0 flex-[2] items-center gap-2">
          <Badge
            variant="outline"
            className={`shrink-0 px-1.5 py-0 text-[10px] font-normal ${
              COLUMN_TYPE_BADGE_CONFIG[column?.type ?? 'unknown']?.className ??
              ''
            }`}
          >
            {COLUMN_TYPE_BADGE_CONFIG[column?.type ?? 'unknown']?.label ?? ''}
          </Badge>
          <span
            className="text-foreground truncate text-sm font-medium"
            title={entry.columnName}
          >
            {entry.columnName}
          </span>
        </div>

        {/* Arrow */}
        <span className="text-muted-foreground shrink-0">→</span>

        {/* Prop selector */}
        <div className="min-w-0 flex-[3]">
          <Select value={entry.propPath} onValueChange={handlePropChange}>
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue placeholder={dataEngineTextMaps.selectProperty} />
            </SelectTrigger>
            <SelectContent>
              {availableProps.map(prop => (
                <SelectItem key={prop.path} value={prop.path}>
                  <span className="text-xs">{prop.label ?? prop.path}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type mismatch badge */}
        {typeMismatch && column && selectedProp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="shrink-0 cursor-help gap-1 border-[var(--status-warning-border)] bg-[var(--status-warning-bg)] px-1.5 py-0 text-[10px] font-normal text-[var(--status-warning-text)]"
              >
                <AlertTriangle className="size-2.5" />
                {dataEngineTextMaps.unmapped}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-56 text-xs">
              {dataEngineTextMaps.typeMismatchWarning(
                COLUMN_TYPE_BADGE_CONFIG[column.type]?.label ?? column.type,
                selectedProp.type
              )}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Transform button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={entry.transform ? 'secondary' : 'ghost'}
              size="icon"
              className="size-8 shrink-0"
              onClick={() => onConfigureTransform(entry)}
              disabled={!entry.propPath}
            >
              <Wand2 className="size-4" />
              <span className="sr-only">
                {dataEngineTextMaps.transformation}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {entry.transform
              ? `${dataEngineTextMaps.transformation}: ${entry.transform.type}`
              : dataEngineTextMaps.transformation}
          </TooltipContent>
        </Tooltip>

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive size-8 shrink-0"
          onClick={() => onRemove(entry.id)}
        >
          <X className="size-4" />
          <span className="sr-only">{dataEngineTextMaps.removeMapping}</span>
        </Button>
      </div>
    </TooltipProvider>
  );
}
