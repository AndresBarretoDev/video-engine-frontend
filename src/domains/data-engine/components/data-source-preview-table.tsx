'use client';

/**
 * OP Video Engine — Data Source Preview Table
 *
 * Shows first 5 rows of parsed CSV data with inferred type badges.
 * Spec: SPEC-DE-003
 */

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useDataEngineStore } from '../stores/data-engine-store';
import { COLUMN_TYPE_BADGE_CONFIG } from '../constants';
import { dataEngineTextMaps } from '../text-maps';
import type { ParsedColumn } from '../types';

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ParsedColumn['type'] }) {
  const config =
    COLUMN_TYPE_BADGE_CONFIG[type] ?? COLUMN_TYPE_BADGE_CONFIG.unknown;
  return (
    <Badge
      variant="outline"
      className={`px-1.5 py-0 text-[10px] font-normal ${config?.className ?? ''}`}
    >
      {config?.label ?? type}
    </Badge>
  );
}

function TruncatedCell({ value }: { value: string }) {
  const MAX_LENGTH = 28;
  const isTruncated = value.length > MAX_LENGTH;
  const display = isTruncated ? value.slice(0, MAX_LENGTH) + '…' : value;

  if (!isTruncated) {
    return <span className="text-foreground text-xs">{display || '—'}</span>;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-foreground cursor-help text-xs">{display}</span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs break-all">
          {value}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const PREVIEW_ROWS = 5;

export function DataSourcePreviewTable() {
  const { parsedData, parsedColumns, parsedRows } = useDataEngineStore();

  if (!parsedData || parsedColumns.length === 0) return null;

  const previewRows = parsedRows.slice(0, PREVIEW_ROWS);

  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {dataEngineTextMaps.dataPreview}
      </p>
      <div className="overflow-hidden rounded-[var(--radius-8)] border border-[var(--color-stroke-default)]">
        <ScrollArea className="max-h-72">
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--color-surface-1)]">
                {parsedColumns.map(col => (
                  <TableHead
                    key={col.name}
                    className="max-w-[200px] min-w-[120px] px-3 py-2"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground truncate text-xs font-semibold">
                        {col.name}
                      </span>
                      <TypeBadge type={col.type} />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className="hover:bg-[var(--color-surface-1)]"
                >
                  {parsedColumns.map(col => {
                    const value = String(row[col.name] ?? '');
                    return (
                      <TableCell
                        key={col.name}
                        className="max-w-[200px] min-w-[120px] px-3 py-2"
                      >
                        <TruncatedCell value={value} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-[var(--color-surface-1)]">
                <TableCell
                  colSpan={parsedColumns.length}
                  className="text-muted-foreground px-3 py-2 text-xs"
                >
                  {dataEngineTextMaps.rowCount}:{' '}
                  <span className="text-foreground font-medium">
                    {dataEngineTextMaps.csvParseSuccess(parsedData.totalRows)}
                  </span>
                  {parsedData.totalRows > PREVIEW_ROWS && (
                    <span className="text-muted-foreground ml-1">
                      ({dataEngineTextMaps.preview}: {PREVIEW_ROWS})
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
