/**
 * OP Video Engine — Project Detail / Edit Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * ProjectEditView (Client Component) handles data fetching and form state.
 *
 * Spec: SPEC-PROJ-008 through SPEC-PROJ-009
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ProjectEditView } from '@/domains/projects/components/project-edit-view';
import { projectsTextMaps } from '@/domains/projects/text-maps';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {projectsTextMaps.editProjectTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {projectsTextMaps.editProjectDescription}
          </p>
        </div>
        {/* Project-first entry: pick a template scoped to this project. */}
        <Button asChild size="sm" className="shrink-0">
          <Link href={`/templates?projectId=${id}`}>
            <Video className="size-4" aria-hidden />
            {projectsTextMaps.createVideoLabel}
          </Link>
        </Button>
      </div>
      <Suspense fallback={<PageSkeleton variant="detail" />}>
        <ProjectEditView id={id} />
      </Suspense>
    </div>
  );
}
