/**
 * OP Video Engine — Brands List Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * BrandList (Client Component) handles data fetching and interactions.
 *
 * Access: Admin role only — enforced by RoleGate inside BrandList.
 * Spec: SPEC-BRAND-001 through SPEC-BRAND-004
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { BrandList } from '@/domains/brands/components/brand-list';

export default function BrandsPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="card-grid" />}>
      <BrandList />
    </Suspense>
  );
}
