import type { ProjectStatus } from '../types';
import { projectsTextMaps } from '../text-maps';

export interface TransitionConfig {
  target: ProjectStatus;
  label: string;
  variant: 'default' | 'outline';
  requiresConfirmation: boolean;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel: string;
  successToast: string;
}

/**
 * Valid status transitions — mirrors backend VALID_TRANSITIONS.
 * Backend validates as safety net; frontend uses this for UI rendering.
 */
export const TRANSITIONS: Partial<Record<ProjectStatus, TransitionConfig[]>> = {
  draft: [
    {
      target: 'in-progress',
      label: projectsTextMaps.startProduction,
      variant: 'default',
      requiresConfirmation: false,
      confirmTitle: '',
      confirmDescription: '',
      confirmLabel: '',
      successToast: projectsTextMaps.transitionStarted
    }
  ],
  'in-progress': [
    {
      target: 'review',
      label: projectsTextMaps.submitForReview,
      variant: 'default',
      requiresConfirmation: false,
      confirmTitle: '',
      confirmDescription: '',
      confirmLabel: '',
      successToast: projectsTextMaps.transitionSubmitted
    }
  ],
  review: [
    {
      target: 'approved',
      label: projectsTextMaps.approve,
      variant: 'default',
      requiresConfirmation: true,
      confirmTitle: projectsTextMaps.approveTitle,
      confirmDescription: projectsTextMaps.approveDescription,
      confirmLabel: projectsTextMaps.confirmApprove,
      successToast: projectsTextMaps.transitionApproved
    },
    {
      target: 'draft',
      label: projectsTextMaps.requestChanges,
      variant: 'outline',
      requiresConfirmation: true,
      confirmTitle: projectsTextMaps.rejectTitle,
      confirmDescription: projectsTextMaps.rejectDescription,
      confirmLabel: projectsTextMaps.confirmReject,
      successToast: projectsTextMaps.transitionRejected
    }
  ]
};

/**
 * Ordered workflow steps for the stepper display.
 */
export const WORKFLOW_STEPS: { status: ProjectStatus; label: string }[] = [
  { status: 'draft', label: projectsTextMaps.stepDraft },
  { status: 'in-progress', label: projectsTextMaps.stepInProgress },
  { status: 'review', label: projectsTextMaps.stepReview },
  { status: 'approved', label: projectsTextMaps.stepApproved }
];
