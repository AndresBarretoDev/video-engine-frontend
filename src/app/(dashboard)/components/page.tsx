/**
 * OP Video Engine — Component Catalog Page
 *
 * Server Component. Ultra-clean: only composition.
 * Suspense boundary wraps the filterable catalog grid.
 *
 * Accessible to: admin, designer, producer
 * Spec: SPEC-COMP-001, SPEC-COMP-004
 */

import { Suspense } from 'react';

import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ComponentCatalogGrid } from '@/domains/components-registry/components/component-catalog-grid';

export const metadata = {
  title: 'Component Catalog | OP Video Engine',
  description: 'Browse and preview registered Remotion components.'
};

export default function ComponentsPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="card-grid" />}>
      <ComponentCatalogGrid />
    </Suspense>
  );
}
