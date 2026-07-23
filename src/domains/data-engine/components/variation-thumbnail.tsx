'use client';

/**
 * OP Video Engine — VariationThumbnail
 *
 * Lazy-initialized Remotion Player for variation cards.
 * Uses IntersectionObserver to mount Player only when visible in viewport.
 * Shows skeleton while loading, error placeholder if variation has errors.
 *
 * Spec: SPEC-DE-008 / TASK-DE-024
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Player } from '@remotion/player';
import { AlertCircle } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  PromoVideoTemplate,
  StoryTemplate,
  CTVTemplate,
  BannerVideoTemplate
} from '@/remotion/components/organisms';
import { dataEngineTextMaps } from '../text-maps';

type TemplateComponent = React.FC<Record<string, unknown>>;

const TEMPLATE_REGISTRY: Record<
  string,
  {
    component: TemplateComponent;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
  }
> = {
  'promo-video': {
    component: PromoVideoTemplate as TemplateComponent,
    durationInFrames: 900,
    fps: 30,
    width: 1920,
    height: 1080
  },
  story: {
    component: StoryTemplate as TemplateComponent,
    durationInFrames: 450,
    fps: 30,
    width: 1080,
    height: 1920
  },
  ctv: {
    component: CTVTemplate as TemplateComponent,
    durationInFrames: 900,
    fps: 30,
    width: 1920,
    height: 1080
  },
  'banner-video': {
    component: BannerVideoTemplate as TemplateComponent,
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariationThumbnailProps {
  resolvedProps: Record<string, unknown>;
  templateId: string;
  hasErrors: boolean;
  index: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VariationThumbnail({
  resolvedProps,
  templateId,
  hasErrors
}: VariationThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // IntersectionObserver: mount Player only when in viewport
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        setIsVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '200px',
      threshold: 0
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [observerCallback]);

  const template = TEMPLATE_REGISTRY[templateId];

  // Error placeholder
  if (hasErrors || !template) {
    return (
      <div
        ref={containerRef}
        className="bg-destructive/10 flex aspect-video w-full items-center justify-center rounded-t-[var(--radius-12)]"
        aria-hidden
      >
        <div className="text-destructive flex flex-col items-center gap-1.5">
          <AlertCircle className="size-6" />
          <span className="text-xs font-medium">
            {!template
              ? dataEngineTextMaps.unknownTemplate(templateId)
              : dataEngineTextMaps.variationHasErrors(1)}
          </span>
        </div>
      </div>
    );
  }

  // Skeleton while waiting for intersection
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className="aspect-video w-full overflow-hidden rounded-t-[var(--radius-12)]"
      >
        <Skeleton className="size-full" />
      </div>
    );
  }

  // Remotion Player — static frame (no autoplay)
  return (
    <div
      ref={containerRef}
      className="bg-card aspect-video w-full overflow-hidden rounded-t-[var(--radius-12)]"
    >
      <Player
        component={template.component}
        inputProps={resolvedProps}
        durationInFrames={template.durationInFrames}
        fps={template.fps}
        compositionWidth={template.width}
        compositionHeight={template.height}
        style={{ width: '100%', height: '100%' }}
        controls={false}
        autoPlay={false}
        clickToPlay={false}
        numberOfSharedAudioTags={0}
        renderLoading={() => (
          <div className="flex size-full items-center justify-center">
            <Skeleton className="size-full" />
          </div>
        )}
      />
    </div>
  );
}
