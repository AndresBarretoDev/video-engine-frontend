'use client';

/**
 * OP Video Engine — Component Catalog Grid
 *
 * Filterable grid of registered Remotion components.
 * Filters: type, brand, search query.
 * URL state via nuqs for shareable links + browser back/forward.
 *
 * Spec: SPEC-COMP-001, SPEC-COMP-002, SPEC-COMP-004
 */

import { Blocks } from 'lucide-react';
import { useQueryState, parseAsString, parseAsStringLiteral } from 'nuqs';

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

import { useComponents } from '../hooks/use-components';
import type { ComponentFilters } from '../hooks/use-components';
import type { ComponentType } from '../types';
import { componentsRegistryTextMaps } from '../text-maps';
import { ComponentCard } from './component-card';

// ─── Type filter options ─────────────────────────────────────────────────────

const COMPONENT_TYPE_OPTIONS: Array<{
  value: ComponentType | 'all';
  label: string;
}> = [
  { value: 'all', label: componentsRegistryTextMaps.filterAllTypes },
  { value: 'atom', label: componentsRegistryTextMaps.typeAtom },
  { value: 'molecule', label: componentsRegistryTextMaps.typeMolecule },
  { value: 'organism', label: componentsRegistryTextMaps.typeOrganism },
  { value: 'template', label: componentsRegistryTextMaps.typeTemplate }
];

const VALID_TYPES = [
  'all',
  'atom',
  'molecule',
  'organism',
  'template'
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function ComponentCatalogGrid() {
  // URL-based filter state via nuqs
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));
  const [typeFilter, setTypeFilter] = useQueryState(
    'type',
    parseAsStringLiteral(VALID_TYPES).withDefault('all')
  );
  const [brandFilter, setBrandFilter] = useQueryState(
    'brand',
    parseAsString.withDefault('')
  );

  const filters: ComponentFilters = {
    ...(search ? { search } : {}),
    ...(typeFilter && typeFilter !== 'all'
      ? { type: typeFilter as ComponentType }
      : {}),
    ...(brandFilter ? { brandId: brandFilter } : {})
  };

  const {
    data: components,
    isLoading,
    error,
    refetch
  } = useComponents(filters);

  if (isLoading) {
    // Skeleton is handled via loading.tsx at route level
    return null;
  }

  if (error) {
    return (
      <ErrorAlert
        message={error.message || componentsRegistryTextMaps.errorLoad}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {componentsRegistryTextMaps.pageTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {componentsRegistryTextMaps.pageDescription}
        </p>
      </div>

      {/* ─── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder={componentsRegistryTextMaps.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value || null)}
          className="max-w-xs"
          aria-label={componentsRegistryTextMaps.searchPlaceholder}
        />
        <Select
          value={typeFilter}
          onValueChange={val => setTypeFilter(val as typeof typeFilter)}
        >
          <SelectTrigger
            className="w-40"
            aria-label={componentsRegistryTextMaps.filterType}
          >
            <SelectValue
              placeholder={componentsRegistryTextMaps.filterAllTypes}
            />
          </SelectTrigger>
          <SelectContent>
            {COMPONENT_TYPE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Brand filter — placeholder for future brand list hook integration */}
        <Select
          value={brandFilter || 'all'}
          onValueChange={val => setBrandFilter(val === 'all' ? null : val)}
        >
          <SelectTrigger
            className="w-44"
            aria-label={componentsRegistryTextMaps.filterBrand}
          >
            <SelectValue
              placeholder={componentsRegistryTextMaps.filterAllBrands}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {componentsRegistryTextMaps.filterAllBrands}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Card grid ───────────────────────────────────────────────────── */}
      {!components?.length ? (
        <EmptyState
          icon={Blocks}
          title={componentsRegistryTextMaps.noComponentsTitle}
          description={
            search || typeFilter !== 'all' || brandFilter
              ? componentsRegistryTextMaps.noComponentsFiltered
              : componentsRegistryTextMaps.noComponentsDescription
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {components.map(component => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}
