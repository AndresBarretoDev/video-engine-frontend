'use client';

/**
 * OP Video Engine — VariationGrid
 *
 * Responsive grid of VariationCard components.
 * Integrates VariationFilterBar above grid + SelectionBar fixed at bottom.
 * Handles loading/error/empty states.
 *
 * Spec: SPEC-DE-008 / TASK-DE-029
 */

import { useCallback, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';
import { EmptyState } from '@/components/shared/empty-state';
import { Grid2X2 } from 'lucide-react';

import { VariationCard } from './variation-card';
import { VariationFilterBar } from './variation-filter-bar';
import { VariationDetailDrawer } from './variation-detail-drawer';
import { SelectionBar } from './selection-bar';

import { useVariations } from '../hooks/use-variations';
import { useDataEngineStore } from '../stores/data-engine-store';
import { DEFAULT_TEMPLATE_ID } from '../constants';
import { dataEngineTextMaps } from '../text-maps';
import type { Variation, VariationFilters } from '../types';

// ─── Skeleton grid ────────────────────────────────────────────────────────────

function VariationGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border-border overflow-hidden rounded-[var(--radius-12)] border"
        >
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariationGridProps {
  projectId: string;
  templateId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VariationGrid({
  projectId,
  templateId = DEFAULT_TEMPLATE_ID
}: VariationGridProps) {
  const [filters, setFilters] = useState<VariationFilters>({
    page: 1,
    pageSize: 20,
    search: '',
    status: 'all'
  });
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedVariations = useDataEngineStore(s => s.selectedVariations);
  const toggleVariation = useDataEngineStore(s => s.toggleVariation);
  const selectAll = useDataEngineStore(s => s.selectAll);
  const deselectAll = useDataEngineStore(s => s.deselectAll);
  const clearAll = useDataEngineStore(s => s.clearAll);

  const { data, isLoading, isError, refetch } = useVariations(
    projectId,
    filters
  );

  const handleFilterChange = useCallback((newFilters: VariationFilters) => {
    setFilters(newFilters);
  }, []);

  const handleCardClick = useCallback((variation: Variation) => {
    setSelectedVariation(variation);
    setIsDrawerOpen(true);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      toggleVariation(index);
    },
    [toggleVariation]
  );

  const allIndices = data?.items.map(v => v.index) ?? [];

  function handleSelectAll() {
    selectAll(allIndices);
  }

  function handleDeselectAll() {
    deselectAll(allIndices);
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filter bar — ALWAYS MOUNTED */}
        <VariationFilterBar
          filters={filters}
          totalCount={data?.total}
          onFiltersChange={handleFilterChange}
        />

        {/* Grid content */}
        {isLoading ? (
          <VariationGridSkeleton />
        ) : isError ? (
          <ErrorAlert
            message={dataEngineTextMaps.errorLoadVariations}
            onRetry={() => refetch()}
          />
        ) : !data || data.items.length === 0 ? (
          <EmptyState icon={Grid2X2} title={dataEngineTextMaps.noVariations} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {data.items.map(variation => (
              <VariationCard
                key={variation.index}
                variation={variation}
                templateId={templateId}
                isSelected={selectedVariations.has(variation.index)}
                onSelect={handleSelect}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Bottom padding to avoid content hidden behind SelectionBar */}
        {selectedVariations.size > 0 && <div className="h-16" />}
      </div>

      {/* Detail drawer */}
      <VariationDetailDrawer
        variation={selectedVariation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Selection bar — fixed at bottom, only when selections > 0 */}
      <SelectionBar
        selectedCount={selectedVariations.size}
        totalCount={data?.total ?? 0}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onClear={clearAll}
      />
    </>
  );
}
