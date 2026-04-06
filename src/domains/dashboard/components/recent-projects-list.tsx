/**
 * OP Video Engine — Recent Projects List
 *
 * Compact list of recent projects (max 5).
 * Reuses RecentProject type from dashboard types.
 *
 * Spec: SPEC-DASH-004
 */

import Link from 'next/link';
import type { RecentProject } from '@/domains/dashboard/types';
import { dashboardTextMap } from '@/domains/dashboard/text-maps';
import { projectsTextMaps } from '@/domains/projects/text-maps';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { FolderKanban } from 'lucide-react';

interface RecentProjectsListProps {
  projects: RecentProject[];
}

const STATUS_LABEL: Record<string, string> = {
  draft: projectsTextMaps.statusDraft,
  'in-progress': projectsTextMaps.statusInProgress,
  review: projectsTextMaps.statusReview,
  approved: projectsTextMaps.statusApproved,
  archived: projectsTextMaps.statusArchived
};

export function RecentProjectsList({ projects }: RecentProjectsListProps) {
  if (!projects.length) {
    return (
      <EmptyState
        icon={FolderKanban}
        title={dashboardTextMap.recentProjects.noProjects}
        description={dashboardTextMap.recentProjects.noProjectsDescription}
      />
    );
  }

  return (
    <ul className="space-y-2">
      {projects.map(project => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.id}`}
            className="hover:bg-accent flex items-center gap-3 rounded-[var(--radius-8)] p-3 transition-colors"
          >
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-8)]">
              <FolderKanban className="text-muted-foreground size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {project.brand ?? projectsTextMaps.noBrand}
              </p>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {STATUS_LABEL[project.status] ?? project.status}
            </Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
