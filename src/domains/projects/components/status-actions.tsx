'use client';

/**
 * OP Video Engine — Status Actions
 *
 * Renders valid transition buttons for the current project status.
 * Shows confirmation dialog for significant transitions (approve, reject).
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { ProjectStatus } from '../types';
import { TRANSITIONS, type TransitionConfig } from '../constants/status-transitions';
import { useUpdateProjectStatus } from '../hooks/use-projects';
import { projectsTextMaps } from '../text-maps';

interface StatusActionsProps {
  projectId: string;
  currentStatus: ProjectStatus;
}

export function StatusActions({ projectId, currentStatus }: StatusActionsProps) {
  const [pendingTransition, setPendingTransition] =
    useState<TransitionConfig | null>(null);
  const { mutate: updateStatus, isPending } =
    useUpdateProjectStatus(projectId);

  const transitions = TRANSITIONS[currentStatus] ?? [];

  if (transitions.length === 0) return null;

  function executeTransition(transition: TransitionConfig) {
    updateStatus(
      { status: transition.target, successToast: transition.successToast },
      { onSuccess: () => setPendingTransition(null) },
    );
  }

  function handleClick(transition: TransitionConfig) {
    if (transition.requiresConfirmation) {
      setPendingTransition(transition);
    } else {
      executeTransition(transition);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {transitions.map((transition) => (
          <Button
            key={transition.target}
            variant={transition.variant}
            size="sm"
            onClick={() => handleClick(transition)}
            disabled={isPending}
          >
            {transition.label}
          </Button>
        ))}
      </div>

      {/* Confirmation dialog */}
      <AlertDialog
        open={!!pendingTransition}
        onOpenChange={(open) => {
          if (!open) setPendingTransition(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingTransition?.confirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingTransition?.confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {projectsTextMaps.confirmCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingTransition) executeTransition(pendingTransition);
              }}
              disabled={isPending}
            >
              {pendingTransition?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
