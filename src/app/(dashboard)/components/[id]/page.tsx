/**
 * OP Video Engine — Component Detail Page
 *
 * Server Component. Ultra-clean: only composition.
 * Renders the ComponentDetail client component wrapped in Suspense.
 *
 * Spec: SPEC-COMP-005, SPEC-COMP-006, SPEC-COMP-007
 */

import { Suspense } from 'react';

import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ComponentDetail } from '@/domains/components-registry/components/component-detail';

interface ComponentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComponentDetailPage({
  params
}: ComponentDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <ComponentDetail id={id} />
    </Suspense>
  );
}
