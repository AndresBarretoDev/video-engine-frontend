'use client';

/**
 * OP Video Engine — Project Edit View
 *
 * Fetches a project by ID and passes it to ProjectForm in edit mode.
 * Handles loading and error states.
 *
 * Spec: SPEC-PROJ-006 through SPEC-PROJ-009
 */

import { ErrorAlert } from '@/components/shared/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '../hooks/use-projects';
import { ProjectForm } from './project-form';
import { projectsTextMaps } from '../text-maps';

interface ProjectEditViewProps {
  id: string;
}

export function ProjectEditView({ id }: ProjectEditViewProps) {
  const { data: project, isLoading, error, refetch } = useProject(id);

  if (error) {
    return <ErrorAlert message={error.message} onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="bg-border h-px" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-[var(--radius-8)]" />
          </div>
        ))}
        <div className="flex gap-3">
          <Skeleton className="h-9 w-28 rounded-[var(--radius-8)]" />
          <Skeleton className="h-9 w-20 rounded-[var(--radius-8)]" />
        </div>
      </div>
    );
  }

  if (!project) {
    return <ErrorAlert message={projectsTextMaps.errorNotFound} />;
  }

  return <ProjectForm key={project.id} project={project} />;
}
