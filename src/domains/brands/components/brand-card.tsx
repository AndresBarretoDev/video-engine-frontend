'use client';

/**
 * OP Video Engine — Brand Card
 *
 * Displays a single brand in the grid: name, color swatches, logo thumbnail, status badge.
 * Actions: Edit, Archive/Reactivate (via Modal Manager).
 *
 * Spec: SPEC-BRAND-001, SPEC-BRAND-011
 */

import Link from 'next/link';
import Image from 'next/image';
import {
  MoreHorizontal,
  Pencil,
  Archive,
  ArchiveRestore,
  Palette
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

import { useModalStore } from '@/domains/layout/stores/modal-store';
import type { BrandConfig, BrandTokens } from '../types';
import { brandsTextMaps } from '../text-maps';

interface BrandCardProps {
  brand: BrandConfig;
  tokens?: Partial<BrandTokens>;
  onArchive: (id: string) => void;
  onReactivate?: (id: string) => void;
  isArchiving?: boolean;
}

export function BrandCard({
  brand,
  tokens,
  onArchive,
  onReactivate,
  isArchiving
}: BrandCardProps) {
  const openModal = useModalStore(s => s.open);
  const isArchived = !brand.isActive;

  const brandTokens = brand.tokens as Record<string, unknown> | undefined;
  const logoUrl = (brandTokens?.logo as Record<string, unknown> | undefined)
    ?.url as string | undefined;

  // Extract color swatches from brand.tokens.colors (seed format)
  const seedColors = brandTokens?.colors as Record<string, string> | undefined;
  const customColors =
    (brandTokens?.customColors as { name: string; hex: string }[]) ?? [];
  const derivedTokens: Partial<BrandTokens> = {
    ...tokens,
    ...(seedColors?.primary && { colorPrimary: seedColors.primary }),
    ...(seedColors?.secondary && { colorSecondary: seedColors.secondary }),
    ...(seedColors?.accent && { colorAccent: seedColors.accent })
  };

  function handleArchiveClick() {
    if (isArchived && onReactivate) {
      openModal('reactivate-brand', {
        type: 'alert',
        title: brandsTextMaps.reactivateTitle,
        description: brandsTextMaps.reactivateDescription,
        confirmLabel: brandsTextMaps.reactivateConfirm,
        cancelLabel: brandsTextMaps.reactivateCancel,
        variant: 'default',
        onConfirm: () => onReactivate(brand.id),
        isPending: isArchiving
      });
    } else {
      openModal('archive-brand', {
        type: 'alert',
        title: brandsTextMaps.archiveTitle,
        description: brandsTextMaps.archiveDescription,
        confirmLabel: brandsTextMaps.archiveConfirm,
        cancelLabel: brandsTextMaps.archiveCancel,
        variant: 'destructive',
        onConfirm: () => onArchive(brand.id),
        isPending: isArchiving
      });
    }
  }

  return (
    <Card
      className={[
        'group flex flex-col gap-2 overflow-hidden py-0 transition-colors',
        'border-border bg-card hover:bg-accent/30',
        isArchived ? 'opacity-60' : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Logo area */}
      <div className="border-border bg-muted/20 relative flex h-48 items-center justify-center border-b">
        {isArchived && (
          <div className="bg-background/40 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Badge variant="secondary" className="text-xs">
              {brandsTextMaps.statusArchived}
            </Badge>
          </div>
        )}
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={brand.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Palette className="size-8 opacity-30" />
          </div>
        )}
      </div>

      <CardHeader className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate leading-tight font-semibold">
              {brand.name}
            </p>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              {brand.slug}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={brandsTextMaps.columnActions}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/brands/${brand.id}`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="size-3.5" />
                  {brandsTextMaps.editBrand}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={
                  isArchived ? '' : 'text-destructive focus:text-destructive'
                }
                onClick={handleArchiveClick}
              >
                {isArchived ? (
                  <ArchiveRestore className="mr-2 size-3.5" />
                ) : (
                  <Archive className="mr-2 size-3.5" />
                )}
                {isArchived
                  ? brandsTextMaps.reactivateBrand
                  : brandsTextMaps.archiveBrand}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex items-center gap-1.5">
          {derivedTokens.colorPrimary && (
            <ColorSwatch
              color={derivedTokens.colorPrimary}
              label={brandsTextMaps.colorPrimary}
            />
          )}
          {derivedTokens.colorSecondary && (
            <ColorSwatch
              color={derivedTokens.colorSecondary}
              label={brandsTextMaps.colorSecondary}
            />
          )}
          {derivedTokens.colorAccent && (
            <ColorSwatch
              color={derivedTokens.colorAccent}
              label={brandsTextMaps.colorAccent}
            />
          )}
          {customColors.map(c => (
            <ColorSwatch key={c.name} color={c.hex} label={c.name} />
          ))}
          {!derivedTokens.colorPrimary &&
            !derivedTokens.colorSecondary &&
            !derivedTokens.colorAccent &&
            customColors.length === 0 && (
              <span className="text-muted-foreground text-xs">
                {brandsTextMaps.brandTokens}
              </span>
            )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Badge
          variant={isArchived ? 'secondary' : 'outline'}
          className="text-xs"
        >
          {isArchived
            ? brandsTextMaps.statusArchived
            : brandsTextMaps.statusActive}
        </Badge>
      </CardFooter>
    </Card>
  );
}

// ─── Color swatch ────────────────────────────────────────────────────────────

interface ColorSwatchProps {
  color: string;
  label: string;
}

function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <div
      className="border-border/60 ring-border/20 size-4 rounded-[var(--radius-infinite)] border ring-1"
      style={{ backgroundColor: color }}
      title={`${label}: ${color}`}
      aria-label={`${label}: ${color}`}
    />
  );
}
