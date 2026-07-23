'use client';

/**
 * OP Video Engine — Project Edit View
 *
 * Fetches a project by ID. Shows status stepper + transition actions + edit form.
 * Handles loading and error states.
 */

import { ErrorAlert } from '@/components/shared/error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useProject } from '../hooks/use-projects';
import { ProjectForm } from './project-form';
import { StatusStepper } from './status-stepper';
import { StatusActions } from './status-actions';
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
      <div className="space-y-6">
        {/* Stepper skeleton */}
        <div className="flex items-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-9 w-40 rounded-[var(--radius-8)]" />
        <div className="bg-border h-px" />
        {/* Form skeleton */}
        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-[var(--radius-8)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return <ErrorAlert message={projectsTextMaps.errorNotFound} />;
  }

  return (
    <div className="space-y-6">
      {/* Status workflow section */}
      <section className="space-y-4">
        <h2 className="text-muted-foreground text-sm font-medium">
          {projectsTextMaps.workflowStatus}
        </h2>
        <StatusStepper currentStatus={project.status} />
        <StatusActions projectId={project.id} currentStatus={project.status} />
      </section>

      <Separator />

      {/* Edit form */}
      <ProjectForm key={project.id} project={project} />
    </div>
  );
}
