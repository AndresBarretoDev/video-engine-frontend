'use client';

/**
 * OP Video Engine — Project Card
 *
 * Displays a single project in the grid: name, brand, description, status badge.
 * Actions: Edit, Archive (with confirmation).
 *
 * Spec: SPEC-PROJ-001, SPEC-PROJ-009
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  FolderKanban,
  Database
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

import type { Project, ProjectStatus } from '../types';
import { projectsTextMaps } from '../text-maps';

// ─── Status badge helper ──────────────────────────────────────────────────────

const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: projectsTextMaps.statusDraft,
  'in-progress': projectsTextMaps.statusInProgress,
  review: projectsTextMaps.statusReview,
  approved: projectsTextMaps.statusApproved,
  archived: projectsTextMaps.statusArchived
};

// Maps status → Tailwind utility classes using design tokens
const STATUS_CLASS: Record<ProjectStatus, string> = {
  draft: 'border-border text-muted-foreground',
  'in-progress':
    'border-[var(--status-in-review)] text-[var(--status-in-review)] bg-[var(--status-in-review)]/10',
  review:
    'border-[var(--status-pending)] text-[var(--status-pending)] bg-[var(--status-pending)]/10',
  approved:
    'border-[var(--status-approved)] text-[var(--status-approved)] bg-[var(--status-approved)]/10',
  archived: 'border-border text-muted-foreground bg-muted/20'
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  brandName?: string;
  onArchive: (id: string) => void;
  onReactivate?: (id: string) => void;
  isArchiving?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectCard({
  project,
  brandName,
  onArchive,
  onReactivate,
  isArchiving
}: ProjectCardProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);

  const isArchived = project.status === 'archived';

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(project.updatedAt));

  return (
    <>
      <Card
        className={[
          'group flex flex-col overflow-hidden transition-colors',
          'border-border bg-card hover:bg-accent/30 gap-2 py-0',
          isArchived ? 'opacity-60' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Thumbnail area */}
        <div className="border-border bg-muted/20 relative flex h-48 items-center justify-center border-b">
          {isArchived && (
            <div className="bg-background/40 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
              <Badge variant="secondary" className="text-xs">
                {projectsTextMaps.statusArchived}
              </Badge>
            </div>
          )}
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
              <FolderKanban className="size-8 opacity-30" />
            </div>
          )}
        </div>

        <CardHeader className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate leading-tight font-semibold">
                {project.name}
              </p>
              {brandName && (
                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                  {brandName}
                </p>
              )}
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label={projectsTextMaps.columnActions}
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="size-3.5" />
                    {projectsTextMaps.editProject}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/projects/${project.id}/data`}
                    className="flex items-center gap-2"
                  >
                    <Database className="size-3.5" />
                    {projectsTextMaps.dataEngine}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isArchived && onReactivate ? (
                  <DropdownMenuItem
                    onClick={() => setShowReactivateDialog(true)}
                  >
                    <ArchiveRestore className="mr-2 size-3.5" />
                    {projectsTextMaps.reactivateProject}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowArchiveDialog(true)}
                  >
                    <Archive className="mr-2 size-3.5" />
                    {projectsTextMaps.archiveProject}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {project.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {project.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0 pb-4">
          <Badge
            variant="outline"
            className={`text-xs ${STATUS_CLASS[project.status]}`}
          >
            {STATUS_LABEL[project.status]}
          </Badge>
          <span className="text-muted-foreground text-xs">{formattedDate}</span>
        </CardFooter>
      </Card>

      {/* Archive confirmation dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{projectsTextMaps.archiveTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {projectsTextMaps.archiveDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {projectsTextMaps.archiveCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onArchive(project.id);
                setShowArchiveDialog(false);
              }}
              disabled={isArchiving}
            >
              {projectsTextMaps.archiveConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate confirmation dialog */}
      <AlertDialog
        open={showReactivateDialog}
        onOpenChange={setShowReactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {projectsTextMaps.reactivateTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {projectsTextMaps.reactivateDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {projectsTextMaps.reactivateCancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReactivate?.(project.id);
                setShowReactivateDialog(false);
              }}
              disabled={isArchiving}
            >
              {projectsTextMaps.reactivateConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
