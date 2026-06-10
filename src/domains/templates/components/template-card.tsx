'use client';

/**
 * OP Video Engine — Template Card
 *
 * Displays a single template with:
 * - Live looping @remotion/player preview (IntersectionObserver-gated)
 * - Template name, description, available formats
 * - "Use template" action
 *
 * Player mounts only when the card enters the viewport (+100px margin).
 * The preview loops automatically (autoPlay) so producers see the full motion.
 *
 * Spec: video-generation/spec.md — "Gallery is the first screen / each card MUST render
 * a live looping preview"
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Player } from '@remotion/player';
import { Play } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { LoopingProductPromo } from '@/remotion/components/organisms/looping-product-promo/LoopingProductPromo';
import { StayPromo } from '@/remotion/components/organisms/stay-promo/StayPromo';
import {
  loopingProductPromo16x9DefaultProps,
  stayPromo16x9DefaultProps,
  stayPromo9x16DefaultProps,
  stayPromo1x1DefaultProps
} from '@/remotion/compositions/organism-previews';
import type { TemplateDescriptor, TemplateCompositionRef } from '../types';
import { templatesTextMaps } from '../text-maps';

// ─── Component registry ───────────────────────────────────────────────────────
// Maps componentId (from TemplateDescriptor) → Remotion organism component.
// Extend this when new organisms are added.

type AnyProps = Record<string, unknown>;
type RemotionComponent = React.FC<AnyProps>;

const ORGANISM_REGISTRY: Record<string, RemotionComponent | undefined> = {
  LoopingProductPromo: LoopingProductPromo as RemotionComponent,
  StayPromo: StayPromo as RemotionComponent
};

// Maps compositionId → default preview props used by the live player.
// These must produce a visually representative preview with no brand applied.
const COMPOSITION_DEFAULT_PROPS: Record<string, AnyProps> = {
  'looping-product-promo-16-9': loopingProductPromo16x9DefaultProps as AnyProps,
  'looping-product-promo-9-16': loopingProductPromo16x9DefaultProps as AnyProps,
  'looping-product-promo-1-1': loopingProductPromo16x9DefaultProps as AnyProps,
  'stay-promo-16-9': stayPromo16x9DefaultProps as AnyProps,
  'stay-promo-9-16': stayPromo9x16DefaultProps as AnyProps,
  'stay-promo-1-1': stayPromo1x1DefaultProps as AnyProps
};

// ─── Format label helpers ─────────────────────────────────────────────────────

const FORMAT_LABEL: Record<string, string> = {
  '16:9': templatesTextMaps.format16x9,
  '9:16': templatesTextMaps.format9x16,
  '1:1': templatesTextMaps.format1x1
};

// ─── Live preview sub-component ───────────────────────────────────────────────

interface LivePreviewProps {
  templateRef: TemplateCompositionRef;
  component: RemotionComponent;
  ariaLabel: string;
}

function LivePreview({ templateRef, component, ariaLabel }: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry?.isIntersecting) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '100px',
      threshold: 0
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerCallback]);

  const defaultProps = COMPOSITION_DEFAULT_PROPS[templateRef.compositionId];
  // Enforce format override to match the displayed composition format
  const inputProps: AnyProps = { ...(defaultProps ?? {}), format: templateRef.format };

  // Aspect ratio based on composition dimensions
  const aspectRatio = templateRef.width / templateRef.height;

  return (
    <div
      ref={containerRef}
      className="bg-muted/40 relative w-full overflow-hidden rounded-t-[var(--radius-12)]"
      style={{ aspectRatio }}
      aria-label={ariaLabel}
      role="img"
    >
      {!isVisible ? (
        <Skeleton className="absolute inset-0 rounded-none" />
      ) : (
        <Player
          component={component}
          inputProps={inputProps}
          durationInFrames={templateRef.durationInFrames}
          fps={templateRef.fps}
          compositionWidth={templateRef.width}
          compositionHeight={templateRef.height}
          style={{ width: '100%', height: '100%' }}
          controls={false}
          autoPlay
          loop
          clickToPlay={false}
          numberOfSharedAudioTags={0}
          renderLoading={() => (
            <Skeleton className="absolute inset-0 rounded-none" />
          )}
        />
      )}

      {/* Play indicator overlay — subtle, disappears on hover */}
      {isVisible && (
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1 rounded-[var(--radius-8)] bg-black/50 px-2 py-1 text-xs text-white opacity-70 transition-opacity hover:opacity-0"
          aria-hidden
        >
          <Play className="size-2.5 fill-white" />
          <span>Live</span>
        </div>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: TemplateDescriptor;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TemplateCard({ template }: TemplateCardProps) {
  const component = ORGANISM_REGISTRY[template.componentId];

  // Preview uses the first format by default (16:9 is index 0 in the registry)
  const previewRef = template.formats[0];

  return (
    <Card className="group border-border bg-card hover:bg-accent/30 flex flex-col overflow-hidden transition-colors pt-0">
      {/* ─── Live preview ──────────────────────────────────────────────── */}
      {component && previewRef ? (
        <LivePreview
          templateRef={previewRef}
          component={component}
          ariaLabel={templatesTextMaps.cardPreviewAriaLabel(template.name)}
        />
      ) : (
        /* Fallback: no organism registered yet */
        <div
          className="bg-muted/40 flex aspect-video w-full items-center justify-center rounded-t-[var(--radius-12)]"
          aria-hidden
        >
          <Play className="text-muted-foreground size-8 opacity-40" />
        </div>
      )}

      {/* ─── Card body ─────────────────────────────────────────────────── */}
      <CardContent className="flex flex-1 flex-col gap-2 pt-4 pb-2">
        <h3
          className="text-foreground truncate text-sm font-semibold leading-tight"
          title={template.name}
        >
          {template.name}
        </h3>

        <p className="text-muted-foreground line-clamp-2 text-xs">
          {template.description}
        </p>

        {/* Format badges */}
        <div
          className="flex flex-wrap gap-1.5"
          aria-label={templatesTextMaps.cardFormatsLabel}
        >
          {template.formats.map(f => (
            <Badge
              key={f.format}
              variant="outline"
              className="text-muted-foreground text-[10px]"
              aria-label={templatesTextMaps.formatAriaLabel(f.format)}
            >
              {FORMAT_LABEL[f.format] ?? f.format}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* ─── Action ────────────────────────────────────────────────────── */}
      <CardFooter className="pt-0 pb-4">
        <Button asChild size="sm" className="w-full">
          <Link href={`/templates/${template.id}/author`}>
            {templatesTextMaps.cardSelectLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
