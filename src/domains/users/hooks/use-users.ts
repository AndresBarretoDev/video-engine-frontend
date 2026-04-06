/**
 * OP Video Engine — Users React Query Hooks
 *
 * All user-related queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Spec: SPEC-USER-001 through SPEC-USER-007
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { UserProfile } from '../types';
import { usersTextMaps } from '../text-maps';
import { userKeys } from './query-keys';
import type { InviteUserInput } from '../schema';
import type { UserRole } from '@/domains/auth/types';

// ─── Filters type ────────────────────────────────────────────────────────────

export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: 'active' | 'inactive' | 'all';
  [key: string]: unknown;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List users with optional filters.
 * Admin only — enforced on the NestJS backend.
 * staleTime: 2 minutes — user list updates moderately.
 */
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters ?? {}),
    queryFn: () =>
      apiClient<UserProfile[]>(API_ENDPOINTS.users.list, {
        params: filters as Record<string, unknown>
      }),
    staleTime: 2 * 60 * 1000
  });
}

/**
 * Get a single user by ID.
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => apiClient<UserProfile>(API_ENDPOINTS.users.detail(id)),
    enabled: !!id,
    staleTime: 2 * 60 * 1000
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Invite a new user to the platform.
 * On success: invalidates users list + shows success toast.
 */
/**
 * Invite a new user to the platform.
 * Backend returns UserProfile + temporaryPassword.
 * On success: invalidates users list + shows success toast.
 */
export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserInput) =>
      apiClient<UserProfile & { temporaryPassword: string }>(
        API_ENDPOINTS.users.invite,
        {
          method: 'POST',
          data
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(usersTextMaps.invitationSent);
    },
    onError: (error: Error) => {
      toast.error(error.message || usersTextMaps.errorInvite);
    }
  });
}

/**
 * Update a user's role.
 * On success: invalidates user detail + list + shows success toast.
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      apiClient<UserProfile>(API_ENDPOINTS.users.updateRole(id), {
        method: 'PATCH',
        data: { role }
      }),
    onSuccess: updated => {
      queryClient.setQueryData(userKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(usersTextMaps.roleUpdated);
    },
    onError: (error: Error) => {
      toast.error(error.message || usersTextMaps.errorUpdateRole);
    }
  });
}

/**
 * Deactivate a user account.
 * On success: invalidates users list + shows success toast.
 */
export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<UserProfile>(API_ENDPOINTS.users.deactivate(id), {
        method: 'PATCH'
      }),
    onSuccess: updated => {
      queryClient.setQueryData(userKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(usersTextMaps.userDeactivated);
    },
    onError: (error: Error) => {
      toast.error(error.message || usersTextMaps.errorDeactivate);
    }
  });
}

/**
 * Reactivate a deactivated user account.
 * On success: invalidates users list + shows success toast.
 */
export function useReactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<UserProfile>(API_ENDPOINTS.users.reactivate(id), {
        method: 'PATCH'
      }),
    onSuccess: updated => {
      queryClient.setQueryData(userKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(usersTextMaps.userReactivated);
    },
    onError: (error: Error) => {
      toast.error(error.message || usersTextMaps.errorReactivate);
    }
  });
}
