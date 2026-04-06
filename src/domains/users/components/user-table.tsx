'use client';

/**
 * OP Video Engine — User Table
 *
 * Admin-only table for managing team members.
 * Displays users with role badges, status indicators, and action menus.
 *
 * IMPORTANT: Header + filter bar are always mounted (never conditionally hidden).
 * Only the table body area switches between loading/error/empty/data states.
 * This prevents the search input from losing focus on every keystroke.
 *
 * Spec: SPEC-USER-001 through SPEC-USER-007
 */

import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorAlert } from '@/components/shared/error-alert';

import { useUsers } from '../hooks/use-users';
import type { UserFilters } from '../hooks/use-users';
import { useAuth } from '@/lib/auth/auth-context';
import { hasRole } from '@/lib/auth/role-guard';
import type { UserProfile } from '../types';
import type { UserRole } from '@/domains/auth/types';
import { usersTextMaps } from '../text-maps';
import { InviteUserDialog } from './invite-user-dialog';
import { ChangeRoleDialog } from './change-role-dialog';
import { DeactivateUserAlert } from './deactivate-user-alert';
import { ReactivateUserAlert } from './reactivate-user-alert';

// ─── Role badge colors ────────────────────────────────────────────────────────

const ROLE_BADGE_VARIANTS: Record<UserRole, string> = {
  admin: 'bg-destructive/15 text-destructive border-destructive/30',
  designer: 'bg-op-blue-500/15 text-op-blue-300 border-op-blue-500/30',
  producer:
    'bg-[color:var(--color-status-approved)]/15 text-[color:var(--color-status-approved)] border-[color:var(--color-status-approved)]/30',
  qc: 'bg-[color:var(--color-status-warning)]/15 text-[color:var(--color-status-warning)] border-[color:var(--color-status-warning)]/30',
  client: 'bg-muted text-muted-foreground border-border'
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: usersTextMaps.roleAdmin,
  designer: usersTextMaps.roleDesigner,
  producer: usersTextMaps.roleProducer,
  qc: usersTextMaps.roleQc,
  client: usersTextMaps.roleClient
};

// ─── Initials helper ─────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase();
  return (
    (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')
  ).toUpperCase();
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-infinite)] border px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE_VARIANTS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
      {isActive ? usersTextMaps.statusActive : usersTextMaps.statusInactive}
    </Badge>
  );
}

// ─── Table row skeleton ───────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5].map(i => (
        <TableCell key={i}>
          <div className="bg-muted/60 h-4 animate-pulse rounded-[var(--radius-4)]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UserTable() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [changeRoleTarget, setChangeRoleTarget] = useState<UserProfile | null>(
    null
  );
  const [deactivateTarget, setDeactivateTarget] = useState<UserProfile | null>(
    null
  );
  const [reactivateTarget, setReactivateTarget] = useState<UserProfile | null>(
    null
  );

  const filters: UserFilters = {
    ...(search ? { search } : {}),
    ...(role !== 'all' ? { role: role as UserRole } : {}),
    ...(status !== 'all' ? { status: status as 'active' | 'inactive' } : {})
  };

  const { data: users, isLoading, error, refetch } = useUsers(filters);

  // ─── Access guard ─────────────────────────────────────────────────────────
  if (!isAuthLoading && !hasRole(currentUser, 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-foreground text-xl font-semibold">
          {usersTextMaps.accessDeniedTitle}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {usersTextMaps.accessDeniedDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header — always mounted ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {usersTextMaps.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {usersTextMaps.pageDescription}
          </p>
        </div>
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="mr-2 size-4" />
          {usersTextMaps.inviteUser}
        </Button>
      </div>

      {/* ─── Filter bar — always mounted, never conditionally hidden ─────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={usersTextMaps.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={usersTextMaps.searchPlaceholder}
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger
            className="sm:w-44"
            aria-label={usersTextMaps.filterRole}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{usersTextMaps.allRoles}</SelectItem>
            <SelectItem value="admin">{usersTextMaps.roleAdmin}</SelectItem>
            <SelectItem value="designer">
              {usersTextMaps.roleDesigner}
            </SelectItem>
            <SelectItem value="producer">
              {usersTextMaps.roleProducer}
            </SelectItem>
            <SelectItem value="qc">{usersTextMaps.roleQc}</SelectItem>
            <SelectItem value="client">{usersTextMaps.roleClient}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className="sm:w-40"
            aria-label={usersTextMaps.filterStatus}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{usersTextMaps.allStatuses}</SelectItem>
            <SelectItem value="active">{usersTextMaps.statusActive}</SelectItem>
            <SelectItem value="inactive">
              {usersTextMaps.statusInactive}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Table area — only this section reacts to loading/error/data ──── */}
      {error ? (
        <ErrorAlert
          message={error.message || usersTextMaps.errorLoad}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="border-border overflow-hidden rounded-[var(--radius-12)] border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{usersTextMaps.columnUser}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {usersTextMaps.columnEmail}
                </TableHead>
                <TableHead>{usersTextMaps.columnRole}</TableHead>
                <TableHead>{usersTextMaps.columnStatus}</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">{usersTextMaps.columnActions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))
              ) : !users?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <EmptyState
                      icon={Users}
                      title={usersTextMaps.noUsersTitle}
                      description={usersTextMaps.noUsersDescription}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    {/* Avatar + Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-op-blue-900 text-op-blue-200 text-xs font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground text-sm font-medium">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                      {user.email}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge isActive={user.isActive} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label={usersTextMaps.openMenu}
                          >
                            <span className="text-muted-foreground text-base leading-none">
                              ⋯
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setChangeRoleTarget(user)}
                          >
                            {usersTextMaps.changeRole}
                          </DropdownMenuItem>
                          {user.id !== currentUser?.id && (
                            <>
                              <DropdownMenuSeparator />
                              {user.isActive ? (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setDeactivateTarget(user)}
                                >
                                  {usersTextMaps.deactivate}
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => setReactivateTarget(user)}
                                >
                                  {usersTextMaps.reactivate}
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ─── Dialogs ─────────────────────────────────────────────────────── */}
      <InviteUserDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />

      {changeRoleTarget && (
        <ChangeRoleDialog
          user={changeRoleTarget}
          open={!!changeRoleTarget}
          onOpenChange={open => {
            if (!open) setChangeRoleTarget(null);
          }}
        />
      )}

      {deactivateTarget && (
        <DeactivateUserAlert
          user={deactivateTarget}
          open={!!deactivateTarget}
          onOpenChange={open => {
            if (!open) setDeactivateTarget(null);
          }}
        />
      )}

      {reactivateTarget && (
        <ReactivateUserAlert
          user={reactivateTarget}
          open={!!reactivateTarget}
          onOpenChange={open => {
            if (!open) setReactivateTarget(null);
          }}
        />
      )}
    </div>
  );
}
