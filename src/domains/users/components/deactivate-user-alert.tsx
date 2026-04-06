'use client';

/**
 * OP Video Engine — Deactivate User Alert
 *
 * Confirmation alert dialog before deactivating a user account.
 * Self-protection: current user's own account cannot be deactivated
 * (enforced in user-table.tsx by hiding the action).
 * Submits to NestJS PATCH /users/:id/deactivate via useDeactivateUser mutation.
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

import { useDeactivateUser } from '../hooks/use-users';
import type { UserProfile } from '../types';
import { usersTextMaps } from '../text-maps';

interface DeactivateUserAlertProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateUserAlert({
  user,
  open,
  onOpenChange
}: DeactivateUserAlertProps) {
  const { mutate: deactivateUser, isPending } = useDeactivateUser();

  function handleConfirm() {
    deactivateUser(user.id, {
      onSuccess: () => onOpenChange(false)
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {usersTextMaps.deactivateDialogTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {usersTextMaps.deactivateDialogDescription(user.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {usersTextMaps.deactivateDialogCancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending
              ? usersTextMaps.deactivateDialogConfirming
              : usersTextMaps.deactivateDialogConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
