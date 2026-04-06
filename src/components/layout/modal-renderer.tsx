'use client';

/**
 * OP Video Engine — Modal Renderer
 *
 * Single mount point for all modals in the app.
 * Reads the active modal from `useModalStore` and renders it.
 *
 * Alert modals render a generic AlertDialog.
 * Dialog modals render a registered component from DIALOG_REGISTRY.
 */

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

import {
  useModalStore,
  type ModalId,
  type AlertModalProps,
  type DialogModalProps
} from '@/domains/layout/stores/modal-store';
import type { ComponentType } from 'react';

// ─── Dialog Registry ─────────────────────────────────────────────────────────
// Register form-based dialog components here.
// Each entry maps a ModalId to a lazy-loaded component.

const DIALOG_REGISTRY: Partial<
  Record<ModalId, ComponentType<DialogModalProps>>
> = {
  // Will be populated as dialogs are migrated:
  // 'change-role': ChangeRoleDialog,
  // 'invite-user': InviteUserDialog,
  // 'upload-asset': AssetUploadDialog,
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ModalRenderer() {
  const { activeModal, props, close } = useModalStore();

  if (!activeModal || !props) return null;

  // ─── Alert modals (confirmation dialogs) ─────────────────────────────────
  if (props.type === 'alert') {
    const alertProps = props as AlertModalProps;
    return (
      <AlertDialog open onOpenChange={open => !open && close()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertProps.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertProps.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={close}>
              {alertProps.cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                alertProps.variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : undefined
              }
              onClick={() => {
                alertProps.onConfirm();
                close();
              }}
              disabled={alertProps.isPending}
            >
              {alertProps.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // ─── Dialog modals (form dialogs) ────────────────────────────────────────
  if (props.type === 'dialog') {
    const DialogComponent = DIALOG_REGISTRY[activeModal];
    if (!DialogComponent) {
      console.warn(`[ModalRenderer] No dialog registered for: ${activeModal}`);
      return null;
    }
    return <DialogComponent {...(props as DialogModalProps)} />;
  }

  return null;
}
