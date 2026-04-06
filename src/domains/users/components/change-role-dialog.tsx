'use client';

/**
 * OP Video Engine — Change Role Dialog
 *
 * Allows admins to change a user's role.
 * Shows current user name + role, then lets admin select a new role.
 * Submits to NestJS PATCH /users/:id/role via useUpdateRole mutation.
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { changeRoleSchema } from '../schema';
import type { ChangeRoleInput } from '../schema';
import { useUpdateRole } from '../hooks/use-users';
import type { UserProfile } from '../types';
import type { UserRole } from '@/domains/auth/types';
import { usersTextMaps } from '../text-maps';

interface ChangeRoleDialogProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: usersTextMaps.roleAdmin,
  designer: usersTextMaps.roleDesigner,
  producer: usersTextMaps.roleProducer,
  qc: usersTextMaps.roleQc,
  client: usersTextMaps.roleClient
};

export function ChangeRoleDialog({
  user,
  open,
  onOpenChange
}: ChangeRoleDialogProps) {
  const { mutate: updateRole, isPending } = useUpdateRole();

  const form = useForm<ChangeRoleInput>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: user.role
    }
  });

  // Sync default when user prop changes
  useEffect(() => {
    form.reset({ role: user.role });
  }, [user.id, user.role, form]);

  function onSubmit(data: ChangeRoleInput) {
    updateRole(
      { id: user.id, role: data.role },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{usersTextMaps.changeRoleDialogTitle}</DialogTitle>
          <DialogDescription>
            {usersTextMaps.changeRoleDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 rounded-[var(--radius-8)] px-4 py-3 text-sm">
          <span className="text-foreground font-medium">{user.name}</span>
          <span className="text-muted-foreground mx-2">·</span>
          <span className="text-muted-foreground">
            {usersTextMaps.changeRoleDialogCurrentRole}:{' '}
            <span className="text-foreground font-medium">
              {ROLE_LABELS[user.role]}
            </span>
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{usersTextMaps.changeRoleDialogNewRole}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={usersTextMaps.changeRoleDialogSelectRole}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">
                        {usersTextMaps.roleAdmin}
                      </SelectItem>
                      <SelectItem value="designer">
                        {usersTextMaps.roleDesigner}
                      </SelectItem>
                      <SelectItem value="producer">
                        {usersTextMaps.roleProducer}
                      </SelectItem>
                      <SelectItem value="qc">{usersTextMaps.roleQc}</SelectItem>
                      <SelectItem value="client">
                        {usersTextMaps.roleClient}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {usersTextMaps.changeRoleDialogCancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? usersTextMaps.changeRoleDialogSubmitting
                  : usersTextMaps.changeRoleDialogSubmit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
