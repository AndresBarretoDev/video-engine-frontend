'use client';

/**
 * OP Video Engine — Asset Grid
 *
 * Responsive card grid with search, type filter, and brand filter.
 * Header + filters ALWAYS mounted — only the grid area is conditional.
 * Search input NEVER loses focus (no conditional unmounting of header).
 *
 * Spec: SPEC-ASSET-001 through SPEC-ASSET-004
 */

import { useState } from 'react';
import { Upload, FolderOpen } from 'lucide-react';

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

import { useAssets, useDeleteAsset } from '../hooks/use-assets';
import type { AssetFilters } from '../hooks/use-assets';
import { assetsTextMaps } from '../text-maps';
import { AssetCard } from './asset-card';
import { AssetUploadDialog } from './asset-upload-dialog';
import type { AssetType } from '../types';

// ─── Type filter options ──────────────────────────────────────────────────────

type TypeFilter = AssetType | 'all';

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: assetsTextMaps.typeAll },
  { value: 'image', label: assetsTextMaps.typeImage },
  { value: 'video', label: assetsTextMaps.typeVideo },
  { value: 'audio', label: assetsTextMaps.typeAudio },
  { value: 'font', label: assetsTextMaps.typeFont },
  { value: 'document', label: assetsTextMaps.typeDocument }
];

// ─── Mock brand options (will come from useBrands in a future iteration) ──────

const BRAND_OPTIONS = [
  { value: 'all', label: assetsTextMaps.allBrands },
  { value: 'brand-001', label: 'Lidl' },
  { value: 'brand-002', label: 'Coca-Cola' },
  { value: 'brand-003', label: 'Nike' },
  { value: 'brand-004', label: 'Omnicom' },
  { value: 'brand-005', label: 'Renault' }
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AssetGrid() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [brandId, setBrandId] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filters: AssetFilters = {
    ...(search ? { search } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
    ...(brandId !== 'all' ? { brandId } : {})
  };

  const { data: assets, isLoading, error, refetch } = useAssets(filters);
  const { mutate: deleteAsset, isPending: isDeleting } = useDeleteAsset();

  return (
    <div className="space-y-6">
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {assetsTextMaps.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {assetsTextMaps.pageDescription}
          </p>
        </div>
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 size-4" />
          {assetsTextMaps.uploadAsset}
        </Button>
      </div>

      {/* ─── Filter bar ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={assetsTextMaps.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label={assetsTextMaps.searchPlaceholder}
        />
        <Select
          value={typeFilter}
          onValueChange={val => setTypeFilter(val as TypeFilter)}
        >
          <SelectTrigger
            className="sm:w-40"
            aria-label={assetsTextMaps.filterByType}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={brandId} onValueChange={setBrandId}>
          <SelectTrigger
            className="sm:w-44"
            aria-label={assetsTextMaps.filterByBrand}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BRAND_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ─── Grid area (conditional: loading / error / empty / data) ─────── */}
      {error ? (
        <ErrorAlert
          message={error.message || assetsTextMaps.errorLoad}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/40 h-48 animate-pulse rounded-[var(--radius-12)]"
            />
          ))}
        </div>
      ) : !assets?.length ? (
        <EmptyState
          icon={FolderOpen}
          title={assetsTextMaps.noAssetsTitle}
          description={assetsTextMaps.noAssetsDescription}
          action={{
            label: assetsTextMaps.uploadAsset,
            onClick: () => setUploadOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDelete={id => deleteAsset(id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* ─── Upload dialog ─────────────────────────────────────────────────── */}
      <AssetUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
