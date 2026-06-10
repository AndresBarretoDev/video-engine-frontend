'use client';

/**
 * OP Video Engine — Template Grid
 *
 * Responsive N-ready grid of template cards.
 * Handles all 4 UI states: loading (skeleton), error (alert + retry), empty, and data.
 *
 * Mobile-first: 1 col → md: 2 cols → lg: 3 cols
 *
 * Spec: video-generation/spec.md — Gallery scenarios
 */

import { LayoutTemplate } from 'lucide-react';

import { ErrorAlert } from '@/components/shared/error-alert';
import { EmptyState } from '@/components/shared/empty-state';

import { useTemplates } from '../hooks/use-templates';
import { templatesTextMaps } from '../text-maps';
import { TemplateCard } from './template-card';
import { TemplateCardSkeleton } from './template-card-skeleton';

// Number of skeleton placeholders shown during load.
// Matches the minimum expected number of templates (1) × 3 cols preview = 3
const SKELETON_COUNT = 3;

export function TemplateGrid() {
  const { data: templates, isLoading, error, refetch } = useTemplates();

  return (
    <div className="space-y-6">
      {/* ─── Page header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {templatesTextMaps.galleryHeading}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {templatesTextMaps.galleryDescription}
        </p>
      </div>

      {/* ─── Grid area ──────────────────────────────────────────────────────── */}
      {error ? (
        <ErrorAlert
          message={error.message || templatesTextMaps.errorLoad}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label={templatesTextMaps.skeletonAriaLabel}
        >
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : !templates?.length ? (
        <EmptyState
          icon={LayoutTemplate}
          title={templatesTextMaps.emptyTitle}
          description={templatesTextMaps.emptyDescription}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
