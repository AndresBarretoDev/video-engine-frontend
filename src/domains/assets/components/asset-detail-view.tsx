'use client';

/**
 * OP Video Engine — Asset Detail View
 *
 * Shows file metadata, type preview icon, and all asset properties.
 * Client Component: uses useAsset hook for data.
 *
 * Spec: SPEC-ASSET-004
 */

import Link from 'next/link';
import { Image, Video, Music, Type, FileText, ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ErrorAlert } from '@/components/shared/error-alert';

import { useAsset } from '../hooks/use-assets';
import { assetsTextMaps } from '../text-maps';
import type { AssetType } from '../types';

// ─── Type display config ──────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AssetType,
  {
    bg: string;
    text: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  image: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    Icon: Image
  },
  video: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    Icon: Video
  },
  audio: {
    bg: 'bg-green-500/15',
    text: 'text-green-600 dark:text-green-400',
    Icon: Music
  },
  font: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    Icon: Type
  },
  document: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-400',
    Icon: FileText
  }
};

const TYPE_LABEL: Record<AssetType, string> = {
  image: assetsTextMaps.typeImage,
  video: assetsTextMaps.typeVideo,
  audio: assetsTextMaps.typeAudio,
  font: assetsTextMaps.typeFont,
  document: assetsTextMaps.typeDocument
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssetDetailViewProps {
  id: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssetDetailView({ id }: AssetDetailViewProps) {
  const { data: asset, isLoading, error, refetch } = useAsset(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted/40 h-48 animate-pulse rounded-[var(--radius-12)]" />
        <div className="bg-muted/40 h-6 w-1/3 animate-pulse rounded" />
        <div className="bg-muted/40 h-4 w-1/2 animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        message={error.message || assetsTextMaps.errorLoad}
        onRetry={() => refetch()}
      />
    );
  }

  if (!asset) {
    return (
      <p className="text-muted-foreground text-sm">
        {assetsTextMaps.noAssetFound}
      </p>
    );
  }

  const typeConfig = TYPE_CONFIG[asset.type] ?? TYPE_CONFIG.document;
  const { Icon } = typeConfig;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(asset.uploadedAt));

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/assets"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        {assetsTextMaps.backToAssets}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Preview panel */}
        <div className="lg:col-span-1">
          <div
            className={[
              'flex h-48 items-center justify-center rounded-[var(--radius-12)]',
              typeConfig.bg
            ].join(' ')}
          >
            <Icon
              className={['size-16 opacity-60', typeConfig.text].join(' ')}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-foreground text-lg font-semibold break-all">
                {asset.name}
              </h2>
              {asset.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {asset.description}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className={[
                'shrink-0 border-current/30 text-xs',
                typeConfig.text
              ].join(' ')}
            >
              {TYPE_LABEL[asset.type]}
            </Badge>
          </div>

          {/* Metadata grid */}
          <div className="border-border bg-card rounded-[var(--radius-12)] border">
            <div className="border-border border-b px-4 py-2.5">
              <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                {assetsTextMaps.metadataSection}
              </p>
            </div>
            <dl className="divide-border divide-y">
              <MetaRow
                label={assetsTextMaps.fileSize}
                value={formatFileSize(asset.fileSize)}
              />
              <MetaRow label={assetsTextMaps.mimeType} value={asset.mimeType} />
              {asset.width && asset.height && (
                <MetaRow
                  label={assetsTextMaps.dimensions}
                  value={`${asset.width} × ${asset.height} px`}
                />
              )}
              {asset.duration != null && (
                <MetaRow
                  label={assetsTextMaps.duration}
                  value={`${asset.duration}s`}
                />
              )}
              <MetaRow
                label={assetsTextMaps.uploadedAt}
                value={formattedDate}
              />
              {asset.tags.length > 0 && (
                <MetaRow
                  label={assetsTextMaps.tags}
                  value={asset.tags.join(', ')}
                />
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Meta row sub-component ───────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 px-4 py-2.5">
      <dt className="text-muted-foreground w-32 shrink-0 text-sm">{label}</dt>
      <dd className="text-foreground min-w-0 flex-1 text-sm">{value}</dd>
    </div>
  );
}
