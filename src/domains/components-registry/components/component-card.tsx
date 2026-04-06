'use client';

/**
 * OP Video Engine — Component Card
 *
 * Card for a single registered component in the catalog grid.
 * Shows: thumbnail placeholder, name, type badge (color-coded), description, tags, version.
 * Click navigates to the component detail/playground page.
 *
 * Spec: SPEC-COMP-001, SPEC-COMP-003
 */

import Link from 'next/link';
import { Blocks } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RegisteredComponent } from '../types';
import { COMPONENT_TYPE_BADGE_CLASSES } from '../constants';
import { componentsRegistryTextMaps } from '../text-maps';

// ─── Type labels ─────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  atom: componentsRegistryTextMaps.typeAtom,
  molecule: componentsRegistryTextMaps.typeMolecule,
  organism: componentsRegistryTextMaps.typeOrganism,
  template: componentsRegistryTextMaps.typeTemplate
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

interface ComponentCardProps {
  component: RegisteredComponent;
}

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link href={`/components/${component.id}`} className="group block h-full">
      <Card className="hover:border-primary/50 h-full gap-4 overflow-hidden pt-0 transition-all duration-[var(--duration-standard)] hover:shadow-md">
        {/* Thumbnail placeholder */}
        <div className="bg-muted/50 border-border relative flex h-48 items-center justify-center border-b">
          {component.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={component.thumbnailUrl}
              alt={component.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2">
              <Blocks className="size-8 opacity-40" />
              <span className="text-xs font-medium opacity-60">
                {component.name}
              </span>
            </div>
          )}
          {/* Type badge — top right */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className={`text-xs font-medium ${COMPONENT_TYPE_BADGE_CLASSES[component.type]}`}
            >
              {TYPE_LABELS[component.type]}
            </Badge>
          </div>
        </div>

        <CardHeader className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-sm leading-tight font-semibold transition-colors">
              {component.name}
            </h3>
            <span className="text-muted-foreground shrink-0 font-mono text-xs">
              v{component.version}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {component.description && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {component.description}
            </p>
          )}

          {/* Tags */}
          {component.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {component.tags.slice(0, 3).map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-5 px-1.5 py-0 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {component.tags.length > 3 && (
                <span className="text-muted-foreground self-center text-xs">
                  +{component.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
