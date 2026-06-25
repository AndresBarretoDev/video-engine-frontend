/**
 * OP Video Engine — Template Card Skeleton
 *
 * Layout-matched skeleton for TemplateCard.
 * Dimensions mirror the live card exactly → zero layout shift on data arrival.
 *
 * Spec: video-generation/spec.md — "skeleton matching the card grid MUST show (no layout shift on load)"
 */

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { templatesTextMaps } from '../text-maps';

export function TemplateCardSkeleton() {
  return (
    <Card
      className="border-border bg-card flex flex-col overflow-hidden"
      aria-label={templatesTextMaps.skeletonAriaLabel}
    >
      {/* Preview area — aspect-video matches 16:9 default */}
      <Skeleton className="aspect-video w-full rounded-none rounded-t-[var(--radius-12)]" />

      {/* Body */}
      <CardContent className="flex flex-1 flex-col gap-2 pt-4 pb-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Description — two lines */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        {/* Format badges row */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-10 rounded-[var(--radius-infinite)]" />
          <Skeleton className="h-5 w-10 rounded-[var(--radius-infinite)]" />
          <Skeleton className="h-5 w-10 rounded-[var(--radius-infinite)]" />
        </div>
      </CardContent>

      {/* Footer button */}
      <CardFooter className="pt-0 pb-4">
        <Skeleton className="h-8 w-full rounded-[var(--radius-8)]" />
      </CardFooter>
    </Card>
  );
}
