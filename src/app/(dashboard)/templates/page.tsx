/**
 * OP Video Engine — Template Gallery Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * TemplateGrid (Client Component) handles data fetching and interactions.
 *
 * Inherits layout + JWT auth guards from (dashboard)/layout.tsx.
 *
 * Spec: video-generation/spec.md — "Gallery is the first screen"
 * Task: 3.4 (golden-path-video-generation)
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { TemplateGrid } from '@/domains/templates/components/template-grid';

export const metadata = {
  title: 'Templates — OP Video Engine',
  description: 'Choose a template to start creating your personalized video.'
};

interface TemplatesPageProps {
  /** When present (project-first flow), template cards author under this project. */
  searchParams: Promise<{ projectId?: string }>;
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const { projectId } = await searchParams;

  return (
    <Suspense fallback={<PageSkeleton variant="card-grid" />}>
      <TemplateGrid projectId={projectId} />
    </Suspense>
  );
}
