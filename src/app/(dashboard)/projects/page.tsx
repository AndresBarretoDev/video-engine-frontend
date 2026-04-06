/**
 * OP Video Engine — Projects List Page
 *
 * Server Component. Ultra-clean: only composition, zero business logic.
 * ProjectList (Client Component) handles data fetching and interactions.
 *
 * Access: Admin, Producer, Designer roles — enforced by RoleGate in the layout.
 * Spec: SPEC-PROJ-001 through SPEC-PROJ-004
 */

import { Suspense } from 'react';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ProjectList } from '@/domains/projects/components/project-list';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<PageSkeleton variant="card-grid" />}>
      <ProjectList />
    </Suspense>
  );
}
