'use client';

/**
 * OP Video Engine — Project List
 *
 * Responsive card grid with search, status filter, brand filter and CRUD actions.
 * Client Component: needs React Query hooks + interactivity.
 *
 * IMPORTANT: Header + filter bar are always mounted (never conditionally hidden).
 * Only the grid area switches between loading/error/empty/data states.
 * This prevents the search input from losing focus on every keystroke.
 *
 * Spec: SPEC-PROJ-001 through SPEC-PROJ-004, SPEC-PROJ-009
 */

import { useState } from 'react';
import Link from 'next/link';
import { Plus, FolderKanban } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorAlert } from '@/components/shared/error-alert';

import {
  useProjects,
  useArchiveProject,
  useReactivateProject
} from '../hooks/use-projects';
import type { ProjectFilters } from '../hooks/use-projects';
import { useBrands } from '@/domains/brands/hooks/use-brands';
import { projectsTextMaps } from '../text-maps';
import { ProjectCard } from './project-card';

export function ProjectList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectFilters['status']>('all');
  const [brandId, setBrandId] = useState<string>('all');

  const filters: ProjectFilters = {
    ...(search ? { search } : {}),
    ...(status && status !== 'all' ? { status } : {}),
    ...(brandId !== 'all' ? { brandId } : {})
  };

  const { data: projects, isLoading, error, refetch } = useProjects(filters);
  const { mutate: archiveProject, isPending: isArchiving } =
    useArchiveProject();
  const { mutate: reactivateProject, isPending: isReactivating } =
    useReactivateProject();
  const { data: brands } = useBrands();

  // Build brand lookup map for card display
  const brandMap = new Map(brands?.map(b => [b.id, b.name]) ?? []);

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {projectsTextMaps.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {projectsTextMaps.pageDescription}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <Plus className="mr-2 size-4" />
            {projectsTextMaps.createProject}
          </Link>
        </Button>
      </div>

      {/* ─── Filter bar — always mounted, never conditionally hidden ─────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={projectsTextMaps.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={projectsTextMaps.columnName}
        />
        <Select
          value={status ?? 'all'}
          onValueChange={val => setStatus(val as ProjectFilters['status'])}
        >
          <SelectTrigger
            className="sm:w-44"
            aria-label={projectsTextMaps.filterStatus}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{projectsTextMaps.statusAll}</SelectItem>
            <SelectItem value="draft">
              {projectsTextMaps.statusDraft}
            </SelectItem>
            <SelectItem value="in-progress">
              {projectsTextMaps.statusInProgress}
            </SelectItem>
            <SelectItem value="review">
              {projectsTextMaps.statusReview}
            </SelectItem>
            <SelectItem value="approved">
              {projectsTextMaps.statusApproved}
            </SelectItem>
            <SelectItem value="archived">
              {projectsTextMaps.statusArchived}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={brandId} onValueChange={setBrandId}>
          <SelectTrigger
            className="sm:w-40"
            aria-label={projectsTextMaps.filterBrand}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{projectsTextMaps.allBrands}</SelectItem>
            {brands?.map(brand => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ─── Card grid — only this area changes on loading/error/data ────── */}
      {error ? (
        <ErrorAlert
          message={error.message || projectsTextMaps.errorLoad}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/40 h-64 animate-pulse rounded-[var(--radius-12)]"
            />
          ))}
        </div>
      ) : !projects?.length ? (
        <EmptyState
          icon={FolderKanban}
          title={projectsTextMaps.noProjectsTitle}
          description={projectsTextMaps.noProjectsDescription}
          action={{
            label: projectsTextMaps.createProject,
            href: '/projects/new'
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              brandName={
                project.brandId ? brandMap.get(project.brandId) : undefined
              }
              onArchive={id => archiveProject(id)}
              onReactivate={id => reactivateProject(id)}
              isArchiving={isArchiving || isReactivating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
