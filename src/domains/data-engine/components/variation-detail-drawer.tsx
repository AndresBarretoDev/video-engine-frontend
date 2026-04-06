'use client';

/**
 * OP Video Engine — VariationDetailDrawer
 *
 * shadcn Sheet that shows full variation data:
 * - All row data as key-value pairs
 * - Resolved props after mapping
 * - List of errors/warnings
 * - Placeholder for Remotion Player
 * - Format selector
 *
 * Spec: SPEC-DE-008 / TASK-DE-026
 */

import {
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Monitor,
  Smartphone,
  Square
} from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

import { dataEngineTextMaps } from '../text-maps';
import type { Variation } from '../types';

// ─── Format types ─────────────────────────────────────────────────────────────

type VideoFormat = '16:9' | '9:16' | '1:1';

const FORMAT_OPTIONS: {
  value: VideoFormat;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: '16:9', label: '16:9', Icon: Monitor },
  { value: '9:16', label: '9:16', Icon: Smartphone },
  { value: '1:1', label: '1:1', Icon: Square }
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariationDetailDrawerProps {
  variation: Variation | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KeyValueRow({ label, value }: { label: string; value: unknown }) {
  const displayValue =
    value === null || value === undefined || value === '' ? (
      <span className="text-muted-foreground italic">
        {dataEngineTextMaps.emptyValue}
      </span>
    ) : (
      <span className="break-all">{String(value)}</span>
    );

  return (
    <div className="border-border flex gap-3 border-b py-2 last:border-0">
      <span className="text-muted-foreground w-[40%] min-w-0 shrink-0 truncate text-sm font-medium">
        {label}
      </span>
      <span className="text-foreground flex-1 text-sm">{displayValue}</span>
    </div>
  );
}

function ResolvedPropsTable({ props }: { props: Record<string, unknown> }) {
  function flattenProps(
    obj: Record<string, unknown>,
    prefix = ''
  ): { key: string; value: unknown }[] {
    return Object.entries(obj).flatMap(([k, v]) => {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        return flattenProps(v as Record<string, unknown>, fullKey);
      }
      return [{ key: fullKey, value: v }];
    });
  }

  const flat = flattenProps(props);

  return (
    <div className="space-y-0">
      {flat.map(({ key, value }) => (
        <KeyValueRow key={key} label={key} value={value} />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VariationDetailDrawer({
  variation,
  isOpen,
  onClose
}: VariationDetailDrawerProps) {
  if (!variation) return null;

  const errors = variation.errors.filter(e => e.severity === 'error');
  const warnings = variation.errors.filter(e => e.severity === 'warning');

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-border border-b px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            {dataEngineTextMaps.variationIndex(variation.index)}
            {errors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {dataEngineTextMaps.variationHasErrors(errors.length)}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {dataEngineTextMaps.variationDetail}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-4">
            {/* Remotion Player placeholder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {dataEngineTextMaps.variationPreview}
                </h3>
                {/* Format selector */}
                <div className="flex items-center gap-1">
                  {FORMAT_OPTIONS.map(({ value, label, Icon }) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="icon"
                      className="size-7"
                      title={label}
                    >
                      <Icon className="size-3.5" />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-border bg-muted/40 flex aspect-video w-full items-center justify-center rounded-[var(--radius-12)] border border-dashed text-center">
                <div className="space-y-1 px-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    {dataEngineTextMaps.previewComingSoon}
                  </p>
                  <p className="text-muted-foreground/70 text-xs">
                    {dataEngineTextMaps.previewPhaseLabel}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Errors & warnings */}
            {(errors.length > 0 || warnings.length > 0) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  {dataEngineTextMaps.variationErrors}
                </h3>
                <div className="space-y-1.5">
                  {errors.map((err, i) => (
                    <div
                      key={i}
                      className="text-destructive flex items-start gap-2 text-sm"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <span>{err.message}</span>
                    </div>
                  ))}
                  {warnings.map((warn, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-[var(--status-warning-text)]"
                    >
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                      <span>{warn.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(errors.length > 0 || warnings.length > 0) && <Separator />}

            {/* Resolved props */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">
                {dataEngineTextMaps.resolvedProps}
              </h3>
              <ResolvedPropsTable
                props={variation.props ?? variation.resolvedProps ?? {}}
              />
            </div>

            <Separator />

            {/* Raw row data */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold select-none">
                {dataEngineTextMaps.rawRowData}
                <ChevronRight className="text-muted-foreground size-4 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-3">
                {Object.entries(variation.rowData).map(([k, v]) => (
                  <KeyValueRow key={k} label={k} value={v} />
                ))}
              </div>
            </details>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
