'use client';

/**
 * OP Video Engine — SelectionBar
 *
 * Sticky bottom bar showing selection count + actions.
 * Only visible when at least 1 variation is selected.
 * "Send to Render" opens confirmation dialog → creates render batch.
 *
 * Spec: SPEC-DE-009 / TASK-DE-028
 * Plan: phase-4-rendering-pipeline.md — Group 2
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { dataEngineTextMaps } from '../text-maps';
import { SendToRenderDialog } from './send-to-render-dialog';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SelectionBarProps {
  projectId: string;
  selectedCount: number;
  selectedIndices: number[];
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClear: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SelectionBar({
  projectId,
  selectedCount,
  selectedIndices,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onClear,
}: SelectionBarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (selectedCount === 0) return null;

  const MAX_BATCH = 500;
  const isOverLimit = selectedCount > MAX_BATCH;

  function handleSendToRender() {
    if (isOverLimit) {
      toast.error(dataEngineTextMaps.maxBatchWarning(MAX_BATCH));
      return;
    }
    setIsDialogOpen(true);
  }

  return (
    <>
      <div
        className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t px-4 py-3 shadow-lg backdrop-blur-sm"
        role="toolbar"
        aria-label={dataEngineTextMaps.selectionToolbarLabel}
      >
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4">
          {/* Count */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">
              {dataEngineTextMaps.nVariationsSelected(selectedCount)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={onClear}
              aria-label={dataEngineTextMaps.clearSelection}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              {dataEngineTextMaps.selectAll}
            </Button>
            <Button variant="outline" size="sm" onClick={onDeselectAll}>
              {dataEngineTextMaps.deselectAll}
            </Button>
            <Button
              size="sm"
              disabled={selectedCount === 0}
              onClick={handleSendToRender}
              className="gap-2"
            >
              {dataEngineTextMaps.sendToRender}
            </Button>
          </div>
        </div>
      </div>

      <SendToRenderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectId={projectId}
        selectedIndices={selectedIndices}
      />
    </>
  );
}
