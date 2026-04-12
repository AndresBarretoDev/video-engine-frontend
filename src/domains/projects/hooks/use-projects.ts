/**
 * OP Video Engine — Project React Query Hooks
 *
 * All project-related queries and mutations.
 * Uses apiClient → NestJS REST (never Server Actions).
 *
 * Spec: SPEC-PROJ-001 through SPEC-PROJ-009
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Project } from '../types';
import { projectsTextMaps } from '../text-maps';
import { projectKeys } from './query-keys';
import type { CreateProjectInput, UpdateProjectInput } from '../schema';

// ─── Filters type ────────────────────────────────────────────────────────────

export interface ProjectFilters {
  search?: string;
  status?: 'draft' | 'in-progress' | 'review' | 'approved' | 'archived' | 'all';
  brandId?: string;
  sort?: 'name' | 'date';
  page?: number;
  [key: string]: unknown;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * List projects with optional filters.
 * staleTime: 2 minutes — projects change more frequently than brands.
 */
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters ?? {}),
    queryFn: () =>
      apiClient<Project[]>(API_ENDPOINTS.projects.list, {
        params: filters as Record<string, unknown>
      }),
    staleTime: 2 * 60 * 1000
  });
}

/**
 * Get a single project by ID.
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => apiClient<Project>(API_ENDPOINTS.projects.byId(id)),
    enabled: !!id,
    staleTime: 2 * 60 * 1000
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Create a new project.
 * On success: invalidates projects list + shows success toast.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) =>
      apiClient<Project>(API_ENDPOINTS.projects.create, {
        method: 'POST',
        data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success(projectsTextMaps.projectCreated);
    },
    onError: (error: Error) => {
      toast.error(error.message || projectsTextMaps.errorCreate);
    }
  });
}

/**
 * Update an existing project.
 * On success: invalidates project detail + list + shows success toast.
 */
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectInput) =>
      apiClient<Project>(API_ENDPOINTS.projects.update(id), {
        method: 'PATCH',
        data
      }),
    onSuccess: updated => {
      queryClient.setQueryData(projectKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success(projectsTextMaps.projectUpdated);
    },
    onError: (error: Error) => {
      toast.error(error.message || projectsTextMaps.errorUpdate);
    }
  });
}

/**
 * Archive a project (soft delete).
 * On success: invalidates projects list + shows success toast.
 */
export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Project>(API_ENDPOINTS.projects.archive(id), {
        method: 'PATCH'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success(projectsTextMaps.projectArchived);
    },
    onError: (error: Error) => {
      toast.error(error.message || projectsTextMaps.errorArchive);
    }
  });
}

/**
 * Reactivate an archived project.
 * On success: invalidates projects list + shows success toast.
 */
export function useReactivateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Project>(API_ENDPOINTS.projects.reactivate(id), {
        method: 'PATCH'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success(projectsTextMaps.projectReactivated);
    },
    onError: (error: Error) => {
      toast.error(error.message || projectsTextMaps.errorReactivate);
    }
  });
}

/**
 * Update a project's status (workflow transition).
 * On success: invalidates project detail + list + shows custom toast.
 */
export function useUpdateProjectStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ status, successToast }: { status: string; successToast: string }) =>
      apiClient<Project>(API_ENDPOINTS.projects.update(id), {
        method: 'PATCH',
        data: { status },
      }).then((result) => ({ result, successToast })),
    onSuccess: ({ result, successToast }) => {
      queryClient.setQueryData(projectKeys.detail(id), result);
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success(successToast);
    },
    onError: (error: Error) => {
      toast.error(error.message || projectsTextMaps.errorTransition);
    },
  });
}
