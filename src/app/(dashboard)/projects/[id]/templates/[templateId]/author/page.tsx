/**
 * OP Video Engine — Project-scoped Author Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * Authors a video FROM a template, UNDER a project — the render belongs to the
 * project (POST /projects/:projectId/render-single). This is the real authoring
 * entry; /templates/[id]/author stays as the global showroom preview.
 *
 * Slug names: `id` = projectId (reuses the existing /projects/[id] segment so
 * Next.js doesn't complain about mismatched slug names), `templateId` = template.
 *
 * Reuses the same <AuthoringSection> as the showroom route, passing the projectId.
 * Inherits layout + JWT auth guards from (dashboard)/layout.tsx.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthoringSkeleton } from '@/app/(dashboard)/templates/[id]/author/_components/authoring-skeleton';
import { AuthoringSection } from '@/app/(dashboard)/templates/[id]/author/_components/authoring-section';

interface ProjectAuthorPageProps {
  params: Promise<{ id: string; templateId: string }>;
}

export async function generateMetadata({
  params
}: ProjectAuthorPageProps): Promise<Metadata> {
  const { templateId } = await params;
  return {
    title: `Author Video — ${templateId} | OP Video Engine`,
    description: 'Fill in details and preview the video live before rendering.'
  };
}

export default async function ProjectAuthorPage({
  params
}: ProjectAuthorPageProps) {
  const { id, templateId } = await params;

  return (
    <Suspense fallback={<AuthoringSkeleton />}>
      <AuthoringSection templateId={templateId} projectId={id} />
    </Suspense>
  );
}
