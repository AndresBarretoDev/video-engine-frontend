'use client';

/**
 * OP Video Engine — Modal Manager Store
 *
 * Centralized modal management via Zustand.
 * Components call `useModalStore.getState().open(id, props)` to show a modal.
 * `<ModalRenderer />` at the layout level renders the active modal.
 *
 * Supports two modal types:
 * - 'alert': Confirmation dialogs (archive, delete, deactivate)
 * - 'dialog': Form dialogs (invite user, change role, upload asset)
 */

import { create } from 'zustand';

// ─── Modal Definitions ────────────────────────────────────────────────────────

export type ModalId =
  | 'archive-brand'
  | 'reactivate-brand'
  | 'archive-project'
  | 'restore-project'
  | 'deactivate-user'
  | 'reactivate-user'
  | 'delete-asset'
  | 'change-role'
  | 'invite-user'
  | 'upload-asset';

export interface AlertModalProps {
  type: 'alert';
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  isPending?: boolean;
}

export interface DialogModalProps {
  type: 'dialog';
  // Dialog modals render their own content — props passed through
  [key: string]: unknown;
}

export type ModalProps = AlertModalProps | DialogModalProps;

// ─── Store ────────────────────────────────────────────────────────────────────

interface ModalState {
  activeModal: ModalId | null;
  props: ModalProps | null;
  open: (id: ModalId, props: ModalProps) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>()(set => ({
  activeModal: null,
  props: null,
  open: (id, props) => set({ activeModal: id, props }),
  close: () => set({ activeModal: null, props: null })
}));
