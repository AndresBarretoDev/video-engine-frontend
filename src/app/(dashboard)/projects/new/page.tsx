/**
 * OP Video Engine — Create Project Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * ProjectForm (Client Component) handles form state and API mutation.
 *
 * Spec: SPEC-PROJ-005 through SPEC-PROJ-007
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ProjectForm } from '@/domains/projects/components/project-form';
import { projectsTextMaps } from '@/domains/projects/text-maps';

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {projectsTextMaps.newProjectTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {projectsTextMaps.newProjectDescription}
        </p>
      </div>
      <Suspense fallback={<PageSkeleton variant="detail" />}>
        <ProjectForm />
      </Suspense>
    </div>
  );
}
