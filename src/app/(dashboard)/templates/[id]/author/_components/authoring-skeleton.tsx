/**
 * AuthoringSkeleton — matches the split-layout structure.
 * Shown while the authoring section loads. Zero layout shift.
 */
import { Skeleton } from '@/components/ui/skeleton';

export function AuthoringSkeleton() {
  return (
    <div
      className="flex min-h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row"
      aria-label="Loading authoring view…"
      aria-busy="true"
    >
      {/* Form panel skeleton */}
      <div className="flex flex-col gap-4 lg:w-[420px] lg:shrink-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>

      {/* Preview panel skeleton */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Format tabs skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-14" />
        </div>
        {/* Player skeleton — 16:9 aspect ratio */}
        <Skeleton className="w-full rounded-[var(--radius-12)]" style={{ aspectRatio: '16/9' }} />
      </div>
    </div>
  );
}
