/**
 * OP Video Engine — Page Skeleton
 *
 * Full-page loading skeleton using shadcn Skeleton.
 * Variants: dashboard, card-grid, table, detail
 *
 * Spec: SPEC-CROSS-001
 */

import { Skeleton } from '@/components/ui/skeleton';

type SkeletonVariant = 'dashboard' | 'card-grid' | 'table' | 'detail';

interface PageSkeletonProps {
  variant?: SkeletonVariant;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header greeting */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      {/* Summary cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card space-y-3 rounded-[var(--radius-12)] border p-6"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      {/* Recent list */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-[var(--radius-8)]" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-[var(--radius-infinite)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header + action bar */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32 rounded-[var(--radius-8)]" />
      </div>
      {/* Filter bar */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64 rounded-[var(--radius-8)]" />
        <Skeleton className="h-9 w-32 rounded-[var(--radius-8)]" />
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card overflow-hidden rounded-[var(--radius-12)] border"
          >
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32 rounded-[var(--radius-8)]" />
      </div>
      {/* Table */}
      <div className="border-border overflow-hidden rounded-[var(--radius-12)] border">
        {/* Table header */}
        <div className="border-border bg-muted/30 flex gap-4 border-b px-4 py-3">
          {[40, 60, 30, 40, 30].map((w, i) => (
            <Skeleton
              key={i}
              className={`h-4 w-${w > 50 ? '[60%]' : '[' + w + '%]'}`}
            />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-border flex gap-4 border-b px-4 py-3 last:border-0"
          >
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-5 w-16 rounded-[var(--radius-infinite)]" />
            <Skeleton className="h-4 w-[30%]" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      {/* Tabs */}
      <div className="border-border flex gap-2 border-b pb-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-t-[var(--radius-8)]" />
        ))}
      </div>
      {/* Content blocks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-48 w-full rounded-[var(--radius-12)]" />
          <Skeleton className="h-32 w-full rounded-[var(--radius-12)]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-[var(--radius-12)]" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton({ variant = 'dashboard' }: PageSkeletonProps) {
  switch (variant) {
    case 'card-grid':
      return <CardGridSkeleton />;
    case 'table':
      return <TableSkeleton />;
    case 'detail':
      return <DetailSkeleton />;
    case 'dashboard':
    default:
      return <DashboardSkeleton />;
  }
}
