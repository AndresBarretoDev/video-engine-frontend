'use client';

/**
 * OP Video Engine — Reactivate User Alert
 *
 * Confirmation alert dialog before reactivating a deactivated user account.
 * Submits to NestJS PATCH /users/:id/reactivate via useReactivateUser mutation.
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

import { useReactivateUser } from '../hooks/use-users';
import type { UserProfile } from '../types';
import { usersTextMaps } from '../text-maps';

interface ReactivateUserAlertProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReactivateUserAlert({
  user,
  open,
  onOpenChange
}: ReactivateUserAlertProps) {
  const { mutate: reactivateUser, isPending } = useReactivateUser();

  function handleConfirm() {
    reactivateUser(user.id, {
      onSuccess: () => onOpenChange(false)
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {usersTextMaps.reactivateDialogTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {usersTextMaps.reactivateDialogDescription(user.name)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {usersTextMaps.reactivateDialogCancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending
              ? usersTextMaps.reactivateDialogConfirming
              : usersTextMaps.reactivateDialogConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
