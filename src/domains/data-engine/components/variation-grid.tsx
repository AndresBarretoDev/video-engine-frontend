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

import { useCallback, useMemo, useState } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Grid2X2 } from 'lucide-react';

import { VariationCard } from './variation-card';
import { VariationFilterBar } from './variation-filter-bar';
import { VariationDetailDrawer } from './variation-detail-drawer';
import { SelectionBar } from './selection-bar';

import { useDataEngineStore } from '../stores/data-engine-store';
import {
  generateVariationsClient,
  applyVariationFilters
} from '../utils/generate-variations-client';
import { DEFAULT_TEMPLATE_ID } from '../constants';
import { dataEngineTextMaps } from '../text-maps';
import type { Variation, VariationFilters } from '../types';

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
  const parsedRows = useDataEngineStore(s => s.parsedRows);
  const mappingDraft = useDataEngineStore(s => s.mappingDraft);
  const rulesDraft = useDataEngineStore(s => s.rulesDraft);

  // Client-side variations from parsed CSV + mapping + rules
  const allVariations = useMemo(
    () => generateVariationsClient(parsedRows, mappingDraft, rulesDraft),
    [parsedRows, mappingDraft, rulesDraft]
  );

  const data = useMemo(
    () => applyVariationFilters(allVariations, filters),
    [allVariations, filters]
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

  const allIndices = data.items.map(v => v.index);

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
          totalCount={data.total}
          onFiltersChange={handleFilterChange}
        />

        {/* Grid content */}
        {data.items.length === 0 ? (
          <EmptyState icon={Grid2X2} title={dataEngineTextMaps.noVariations} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {data.items.map(variation => {
              const override = variation.props._templateOverride;
              const effectiveTemplateId =
                typeof override === 'string' && override
                  ? override
                  : templateId;
              return (
                <VariationCard
                  key={variation.index}
                  variation={variation}
                  templateId={effectiveTemplateId}
                  isSelected={selectedVariations.has(variation.index)}
                  onSelect={handleSelect}
                  onClick={handleCardClick}
                />
              );
            })}
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
        projectId={projectId}
        selectedCount={selectedVariations.size}
        selectedIndices={Array.from(selectedVariations)}
        totalCount={data.total}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onClear={clearAll}
      />
    </>
  );
}
