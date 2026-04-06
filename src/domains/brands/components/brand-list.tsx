'use client';

/**
 * OP Video Engine — Brand List
 *
 * Responsive card grid with search, status filter, and CRUD actions.
 * Client Component: needs React Query hooks + interactivity.
 *
 * Spec: SPEC-BRAND-001 through SPEC-BRAND-004, SPEC-BRAND-011
 */

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Palette } from 'lucide-react';

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
  useBrands,
  useArchiveBrand,
  useReactivateBrand
} from '../hooks/use-brands';
import type { BrandFilters } from '../hooks/use-brands';
import { brandsTextMaps } from '../text-maps';
import { BrandCard } from './brand-card';

export function BrandList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'archived'>('all');

  const filters: BrandFilters = {
    ...(search ? { search } : {}),
    ...(status !== 'all' ? { status } : {})
  };

  const { data: brands, isLoading, error, refetch } = useBrands(filters);
  const { mutate: archiveBrand, isPending: isArchiving } = useArchiveBrand();
  const { mutate: reactivateBrand, isPending: isReactivating } =
    useReactivateBrand();

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {brandsTextMaps.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {brandsTextMaps.pageDescription}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/brands/new">
            <Plus className="mr-2 size-4" />
            {brandsTextMaps.createBrand}
          </Link>
        </Button>
      </div>

      {/* ─── Filter bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={`${brandsTextMaps.columnName}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={brandsTextMaps.columnName}
        />
        <Select
          value={status}
          onValueChange={val => setStatus(val as typeof status)}
        >
          <SelectTrigger
            className="sm:w-40"
            aria-label={brandsTextMaps.columnStatus}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{brandsTextMaps.allBrands}</SelectItem>
            <SelectItem value="active">
              {brandsTextMaps.statusActive}
            </SelectItem>
            <SelectItem value="archived">
              {brandsTextMaps.statusArchived}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Card grid ───────────────────────────────────────────────────── */}
      {error ? (
        <ErrorAlert
          message={error.message || brandsTextMaps.errorLoad}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/40 h-64 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : !brands?.length ? (
        <EmptyState
          icon={Palette}
          title={brandsTextMaps.noBrandsTitle}
          description={brandsTextMaps.noBrandsDescription}
          action={{ label: brandsTextMaps.createBrand, href: '/brands/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map(brand => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onArchive={id => archiveBrand(id)}
              onReactivate={id => reactivateBrand(id)}
              isArchiving={isArchiving || isReactivating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
