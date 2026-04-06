'use client';

/**
 * OP Video Engine — Invite User Dialog
 *
 * Allows admins to invite new users to the platform.
 * After successful invite, shows temporary credentials for the admin to share.
 * TODO: Replace credentials display with email invitation when mailer is configured.
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Check } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

import { inviteUserSchema } from '../schema';
import type { InviteUserInput } from '../schema';
import { useInviteUser } from '../hooks/use-users';
import { usersTextMaps } from '../text-maps';

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InviteCredentials {
  email: string;
  temporaryPassword: string;
}

export function InviteUserDialog({
  open,
  onOpenChange
}: InviteUserDialogProps) {
  const { mutate: inviteUser, isPending } = useInviteUser();
  const [credentials, setCredentials] = useState<InviteCredentials | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const form = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      name: '',
      role: undefined
    }
  });

  // Reset form and credentials when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setCredentials(null);
      setCopied(false);
    }
  }, [open, form]);

  function onSubmit(data: InviteUserInput) {
    inviteUser(data, {
      onSuccess: response => {
        const res = response as { email: string; temporaryPassword?: string };
        if (res.temporaryPassword) {
          setCredentials({
            email: data.email,
            temporaryPassword: res.temporaryPassword
          });
        } else {
          onOpenChange(false);
        }
      }
    });
  }

  async function handleCopyCredentials() {
    if (!credentials) return;
    const text = `Email: ${credentials.email}\nTemporary Password: ${credentials.temporaryPassword}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // After invite success — show credentials
  if (credentials) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{usersTextMaps.credentialsTitle}</DialogTitle>
            <DialogDescription>
              {usersTextMaps.credentialsDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="border-border bg-muted/30 space-y-3 rounded-[var(--radius-8)] border p-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                {usersTextMaps.inviteDialogEmail}
              </p>
              <p className="text-foreground font-mono text-sm">
                {credentials.email}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                {usersTextMaps.credentialsPassword}
              </p>
              <p className="text-foreground font-mono text-sm">
                {credentials.temporaryPassword}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground text-xs">
            {usersTextMaps.credentialsWarning}
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCopyCredentials}
              className="gap-2"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied
                ? usersTextMaps.credentialsCopied
                : usersTextMaps.credentialsCopy}
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              {usersTextMaps.credentialsDone}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Invite form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{usersTextMaps.inviteDialogTitle}</DialogTitle>
          <DialogDescription>
            {usersTextMaps.inviteDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{usersTextMaps.inviteDialogEmail}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={usersTextMaps.inviteDialogEmailPlaceholder}
                      type="email"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{usersTextMaps.inviteDialogName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={usersTextMaps.inviteDialogNamePlaceholder}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{usersTextMaps.inviteDialogRole}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={usersTextMaps.inviteDialogSelectRole}
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
                {usersTextMaps.inviteDialogCancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? usersTextMaps.inviteDialogSubmitting
                  : usersTextMaps.inviteDialogSubmit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
