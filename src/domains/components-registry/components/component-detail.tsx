'use client';

/**
 * OP Video Engine — Component Detail / Playground
 *
 * Shows component metadata + a playground section with:
 * - Left: JSON props editor (full form generation is a future enhancement)
 * - Right: Placeholder for Remotion Player preview
 * - Format selector: 16:9, 9:16, 1:1
 *
 * NOTE: Remotion Player is NOT imported here — no compositions are registered
 * in the backend yet. The placeholder explains this clearly.
 *
 * Spec: SPEC-COMP-005, SPEC-COMP-006, SPEC-COMP-007
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Blocks,
  Tag,
  Monitor,
  Smartphone,
  Square
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ErrorAlert } from '@/components/shared/error-alert';

import { useComponent } from '../hooks/use-components';
import { COMPONENT_TYPE_BADGE_CLASSES } from '../constants';
import { componentsRegistryTextMaps } from '../text-maps';

// ─── Type labels ─────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  atom: componentsRegistryTextMaps.typeAtom,
  molecule: componentsRegistryTextMaps.typeMolecule,
  organism: componentsRegistryTextMaps.typeOrganism,
  template: componentsRegistryTextMaps.typeTemplate
} as const;

// ─── Format selector ─────────────────────────────────────────────────────────

type AspectRatio = '16:9' | '9:16' | '1:1';

const FORMAT_OPTIONS: Array<{
  value: AspectRatio;
  label: string;
  icon: typeof Monitor;
}> = [
  {
    value: '16:9',
    label: componentsRegistryTextMaps.playgroundFormat16x9,
    icon: Monitor
  },
  {
    value: '9:16',
    label: componentsRegistryTextMaps.playgroundFormat9x16,
    icon: Smartphone
  },
  {
    value: '1:1',
    label: componentsRegistryTextMaps.playgroundFormat1x1,
    icon: Square
  }
];

const ASPECT_RATIO_CLASSES: Record<AspectRatio, string> = {
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16] max-h-96',
  '1:1': 'aspect-square'
};

// ─── Component ───────────────────────────────────────────────────────────────

interface ComponentDetailProps {
  id: string;
}

export function ComponentDetail({ id }: ComponentDetailProps) {
  const { data: component, isLoading, error, refetch } = useComponent(id);
  const [selectedFormat, setSelectedFormat] = useState<AspectRatio>('16:9');
  const [propsJson, setPropsJson] = useState('{}');

  if (isLoading) {
    // Loading handled by loading.tsx at route level
    return null;
  }

  if (error) {
    return (
      <ErrorAlert
        message={error.message || componentsRegistryTextMaps.errorLoadDetail}
        onRetry={() => refetch()}
      />
    );
  }

  if (!component) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ─── Back nav + header ───────────────────────────────────────────── */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/components">
            <ArrowLeft className="mr-2 size-4" />
            {componentsRegistryTextMaps.detailBackToList}
          </Link>
        </Button>

        <div className="flex flex-wrap items-start gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-8)]">
            <Blocks className="text-muted-foreground size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                {component.name}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${COMPONENT_TYPE_BADGE_CLASSES[component.type]}`}
              >
                {TYPE_LABELS[component.type]}
              </Badge>
            </div>
            {component.description && (
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                {component.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Metadata row ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">
            {componentsRegistryTextMaps.metaVersion}:
          </span>
          <span className="text-foreground font-mono">
            v{component.version}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">
            {componentsRegistryTextMaps.metaStatus}:
          </span>
          <Badge variant="secondary" className="text-xs capitalize">
            {component.status}
          </Badge>
        </div>
        {component.tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Tag className="text-muted-foreground size-3.5" />
            <div className="flex flex-wrap gap-1">
              {component.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-5 px-1.5 py-0 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* ─── Playground section ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-semibold">
          {componentsRegistryTextMaps.playgroundTitle}
        </h2>

        {/* Format selector */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {componentsRegistryTextMaps.playgroundFormatLabel}:
          </span>
          <div className="flex gap-1">
            {FORMAT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={selectedFormat === value ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setSelectedFormat(value)}
                aria-pressed={selectedFormat === value}
              >
                <Icon className="size-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Two-column playground layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Props editor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {componentsRegistryTextMaps.playgroundPropsLabel}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="props-json"
                  className="text-muted-foreground sr-only text-xs"
                >
                  {componentsRegistryTextMaps.playgroundPropsLabel}
                </Label>
                <Textarea
                  id="props-json"
                  value={propsJson}
                  onChange={e => setPropsJson(e.target.value)}
                  placeholder={
                    componentsRegistryTextMaps.playgroundPropsPlaceholder
                  }
                  className="min-h-[200px] resize-y font-mono text-xs"
                  spellCheck={false}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {componentsRegistryTextMaps.playgroundPropsHint}
              </p>
            </CardContent>
          </Card>

          {/* Right: Preview placeholder */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {componentsRegistryTextMaps.playgroundPreviewTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`w-full ${ASPECT_RATIO_CLASSES[selectedFormat]} border-border bg-muted/30 flex flex-col items-center justify-center gap-3 rounded-[var(--radius-8)] border border-dashed`}
              >
                <Blocks className="text-muted-foreground/40 size-10" />
                <p className="text-muted-foreground max-w-xs px-4 text-center text-xs leading-relaxed">
                  {componentsRegistryTextMaps.playgroundPreviewPlaceholder}
                </p>
                <Badge variant="outline" className="text-xs">
                  {selectedFormat}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
