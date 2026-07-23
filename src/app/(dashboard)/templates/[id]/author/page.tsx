/**
 * OP Video Engine — Author Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * Split layout: form-left / preview-right (D7 — confirmed in design.md).
 * Mobile-first: preview above / form below stacked on <768px.
 *
 * Inherits layout + JWT auth guards from (dashboard)/layout.tsx.
 * Spec: video-generation/spec.md — "Single-product authoring with live preview"
 * Task: 4.3 (golden-path-video-generation)
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthoringSkeleton } from './_components/authoring-skeleton';
import { AuthoringSection } from './_components/authoring-section';

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params
}: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Author Video — ${id} | OP Video Engine`,
    description:
      'Fill in product details and preview the video live before rendering.'
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<AuthoringSkeleton />}>
      <AuthoringSection templateId={id} />
    </Suspense>
  );
}
