'use client';

/**
 * OP Video Engine — Status Stepper
 *
 * Horizontal workflow indicator: Draft → In Progress → Review → Approved.
 * Shows completed/active/future states with icons and connecting lines.
 */

import { CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '../types';
import { WORKFLOW_STEPS } from '../constants/status-transitions';

interface StatusStepperProps {
  currentStatus: ProjectStatus;
}

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const currentIndex = WORKFLOW_STEPS.findIndex(
    s => s.status === currentStatus
  );

  // Archived projects show all steps as muted
  const isArchived = currentStatus === 'archived';

  return (
    <div className="flex items-center gap-0">
      {WORKFLOW_STEPS.map((step, index) => {
        const isCompleted = !isArchived && index < currentIndex;
        const isActive = !isArchived && index === currentIndex;
        const isFuture = isArchived || index > currentIndex;

        return (
          <div key={step.status} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full transition-colors',
                  isCompleted && 'bg-[var(--status-approved-icon)] text-white',
                  isActive &&
                    'border-primary bg-primary/10 text-primary border-2',
                  isFuture &&
                    'border-border bg-muted/30 text-muted-foreground border'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : isActive ? (
                  <CircleDot className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isCompleted && 'text-[var(--status-approved-icon)]',
                  isActive && 'text-primary',
                  isFuture && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < WORKFLOW_STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-2 mt-[-1.25rem] h-0.5 w-8 sm:w-12 lg:w-16',
                  index < currentIndex && !isArchived
                    ? 'bg-[var(--status-approved-icon)]'
                    : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
