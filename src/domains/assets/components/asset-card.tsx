'use client';

/**
 * OP Video Engine — Asset Card
 *
 * Displays a single asset in the grid.
 * Thumbnail area uses color-coded background by type.
 * Hover actions: View Detail, Delete (with confirmation).
 *
 * Spec: SPEC-ASSET-003
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  Image,
  Video,
  Music,
  Type,
  FileText,
  MoreHorizontal,
  Trash2,
  Eye
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

import type { Asset, AssetType } from '../types';
import { assetsTextMaps } from '../text-maps';

// ─── Type color + icon mapping ────────────────────────────────────────────────

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

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssetCard({ asset, onDelete, isDeleting }: AssetCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const typeConfig = TYPE_CONFIG[asset.type] ?? TYPE_CONFIG.document;
  const { Icon } = typeConfig;

  const hasDimensions = asset.width && asset.height;
  const hasDuration = asset.duration != null;

  return (
    <>
      <Card className="group border-border bg-card hover:bg-accent/30 ptcerrar-0 flex flex-col gap-2 overflow-hidden transition-colors">
        {/* Thumbnail area */}
        <div
          className={[
            'border-border relative flex h-48 items-center justify-center border-b',
            typeConfig.bg
          ].join(' ')}
        >
          <Icon className={['size-10 opacity-60', typeConfig.text].join(' ')} />

          {/* Hover actions overlay */}
          <div className="bg-background/70 absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/assets/${asset.id}`}>
                <Eye className="mr-1.5 size-3.5" />
                {assetsTextMaps.viewDetail}
              </Link>
            </Button>
          </div>
        </div>

        <CardHeader className="pt-3 pb-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="text-foreground truncate text-sm leading-tight font-semibold"
              title={asset.name}
            >
              {asset.name}
            </p>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label={assetsTextMaps.delete}
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/assets/${asset.id}`}
                    className="flex items-center gap-2"
                  >
                    <Eye className="size-3.5" />
                    {assetsTextMaps.viewDetail}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 size-3.5" />
                  {assetsTextMaps.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-2">
          <div className="text-muted-foreground space-y-1 text-xs">
            <p>{formatFileSize(asset.fileSize)}</p>
            {hasDimensions && (
              <p>
                {asset.width} × {asset.height} px
              </p>
            )}
            {hasDuration && !hasDimensions && <p>{asset.duration}s</p>}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-3">
          <Badge
            variant="outline"
            className={['border-current/30 text-xs', typeConfig.text].join(' ')}
          >
            {TYPE_LABEL[asset.type]}
          </Badge>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{assetsTextMaps.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {assetsTextMaps.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{assetsTextMaps.deleteCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(asset.id);
                setShowDeleteDialog(false);
              }}
              disabled={isDeleting}
            >
              {assetsTextMaps.deleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
