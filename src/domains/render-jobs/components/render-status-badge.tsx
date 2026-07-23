'use client';

/**
 * OP Video Engine — Render Status Badge
 *
 * Reusable badge mapping render job/batch status → color + icon + label.
 * Uses status CSS tokens (--status-*).
 *
 * Plan: phase-4-rendering-pipeline.md — Group 3
 */

import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Ban,
  Pause,
  CircleDot
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { renderJobsTextMaps } from '../text-maps';
import type { RenderJobStatus, RenderBatch } from '../types';

// ─── Status config ───────────────────────────────────────────────────────────

type StatusType = RenderJobStatus | RenderBatch['status'];

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

const STATUS_MAP: Record<StatusType, StatusConfig> = {
  queued: {
    label: renderJobsTextMaps.statusQueued,
    icon: Clock,
    className:
      'border-[var(--status-pending-border)] text-[var(--status-pending-text)] bg-[var(--status-pending-bg)]'
  },
  pending: {
    label: renderJobsTextMaps.statusQueued,
    icon: Clock,
    className:
      'border-[var(--status-pending-border)] text-[var(--status-pending-text)] bg-[var(--status-pending-bg)]'
  },
  processing: {
    label: renderJobsTextMaps.statusProcessing,
    icon: Loader2,
    className:
      'border-[var(--status-in-review-border)] text-[var(--status-in-review-text)] bg-[var(--status-in-review-bg)]'
  },
  completed: {
    label: renderJobsTextMaps.statusCompleted,
    icon: CheckCircle2,
    className:
      'border-[var(--status-approved-border)] text-[var(--status-approved-text)] bg-[var(--status-approved-bg)]'
  },
  failed: {
    label: renderJobsTextMaps.statusFailed,
    icon: XCircle,
    className:
      'border-[var(--status-rejected-border)] text-[var(--status-rejected-text)] bg-[var(--status-rejected-bg)]'
  },
  cancelled: {
    label: renderJobsTextMaps.statusCancelled,
    icon: Ban,
    className: 'border-border text-muted-foreground bg-muted/20'
  },
  paused: {
    label: renderJobsTextMaps.statusPaused,
    icon: Pause,
    className:
      'border-[var(--status-warning-border)] text-[var(--status-warning-text)] bg-[var(--status-warning-bg)]'
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

interface RenderStatusBadgeProps {
  status: StatusType;
}

export function RenderStatusBadge({ status }: RenderStatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    icon: CircleDot,
    className: 'border-border text-muted-foreground'
  };

  const Icon = config.icon;
  const isAnimated = status === 'processing';

  return (
    <Badge variant="outline" className={`gap-1.5 text-xs ${config.className}`}>
      <Icon className={`size-3 ${isAnimated ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}
