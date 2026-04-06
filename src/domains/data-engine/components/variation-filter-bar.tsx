'use client';

/**
 * OP Video Engine — VariationFilterBar
 *
 * Search input + status filter Select.
 * ALWAYS MOUNTED — never conditionally hidden.
 * Follows same pattern as ProjectList filter bar.
 *
 * Spec: SPEC-DE-008 / TASK-DE-027
 */

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { dataEngineTextMaps } from '../text-maps';
import type { VariationFilters } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariationFilterBarProps {
  filters: VariationFilters;
  totalCount?: number;
  onFiltersChange: (filters: VariationFilters) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VariationFilterBar({
  filters,
  totalCount,
  onFiltersChange
}: VariationFilterBarProps) {
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    onFiltersChange({ ...filters, search: e.target.value, page: 1 });
  }

  function handleStatusChange(value: string) {
    onFiltersChange({
      ...filters,
      status: value as VariationFilters['status'],
      page: 1
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-3">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="h-9 pl-9"
            placeholder={dataEngineTextMaps.searchPlaceholder}
            value={filters.search ?? ''}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status filter */}
        <Select
          value={filters.status ?? 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder={dataEngineTextMaps.filterLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dataEngineTextMaps.filterAll}</SelectItem>
            <SelectItem value="valid">
              {dataEngineTextMaps.filterValid}
            </SelectItem>
            <SelectItem value="errors">
              {dataEngineTextMaps.filterErrors}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Result count */}
      {totalCount !== undefined && (
        <p className="text-muted-foreground shrink-0 text-sm">
          {dataEngineTextMaps.totalVariations(totalCount)}
        </p>
      )}
    </div>
  );
}
