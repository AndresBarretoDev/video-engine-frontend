'use client';

/**
 * OP Video Engine — Batch Actions Bar
 *
 * Action buttons for a batch: Cancel, Retry Failed, Download All.
 * Includes confirmation dialogs for destructive actions.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 4
 */

import { useState } from 'react';
import { Ban, RotateCcw, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

import { renderJobsTextMaps } from '../text-maps';
import type { RenderBatch } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface BatchActionsBarProps {
  batch: RenderBatch;
  onCancel: () => void;
  onRetryFailed: () => void;
  isCancelling?: boolean;
  isRetrying?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BatchActionsBar({
  batch,
  onCancel,
  onRetryFailed,
  isCancelling,
  isRetrying
}: BatchActionsBarProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);

  const canCancel = batch.status === 'pending' || batch.status === 'processing';
  const canRetry = batch.failedJobs > 0;
  const canDownload = batch.status === 'completed';

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {canCancel && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowCancelDialog(true)}
            disabled={isCancelling}
          >
            <Ban className="size-3.5" />
            {renderJobsTextMaps.cancelBatch}
          </Button>
        )}
        {canRetry && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowRetryDialog(true)}
            disabled={isRetrying}
          >
            <RotateCcw className="size-3.5" />
            {renderJobsTextMaps.retryFailed} ({batch.failedJobs})
          </Button>
        )}
        {canDownload && (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-3.5" />
            {renderJobsTextMaps.downloadAll}
          </Button>
        )}
      </div>

      {/* Cancel confirmation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {renderJobsTextMaps.cancelBatch}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {renderJobsTextMaps.confirmCancelBatch}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{renderJobsTextMaps.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onCancel();
                setShowCancelDialog(false);
              }}
            >
              {renderJobsTextMaps.cancelBatch}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Retry confirmation */}
      <AlertDialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {renderJobsTextMaps.retryFailed}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {renderJobsTextMaps.confirmRetryFailed}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{renderJobsTextMaps.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onRetryFailed();
                setShowRetryDialog(false);
              }}
            >
              {renderJobsTextMaps.retryFailed}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
