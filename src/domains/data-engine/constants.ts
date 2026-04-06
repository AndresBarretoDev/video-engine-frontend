// Data Engine domain constants
// Shared configuration objects used across multiple components

// ─── Column type badge styles ────────────────────────────────────────────────
// Maps column data types to CSS classes using design system tokens.
// Used by: mapping-row.tsx, data-source-preview-table.tsx

export const COLUMN_TYPE_BADGE_CONFIG: Record<
  string,
  { className: string; label: string }
> = {
  string: {
    className:
      'bg-[var(--color-op-blue-100)] text-[var(--color-op-blue-700)] border-[var(--color-op-blue-200)]',
    label: 'Text'
  },
  number: {
    className:
      'bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border-[var(--status-warning-border)]',
    label: 'Number'
  },
  boolean: {
    className:
      'bg-[var(--dtype-boolean-bg)] text-[var(--dtype-boolean-text)] border-[var(--dtype-boolean-border)]',
    label: 'Boolean'
  },
  date: {
    className:
      'bg-[var(--dtype-date-bg)] text-[var(--dtype-date-text)] border-[var(--dtype-date-border)]',
    label: 'Date'
  },
  image_url: {
    className:
      'bg-[var(--dtype-image-bg)] text-[var(--dtype-image-text)] border-[var(--dtype-image-border)]',
    label: 'Image'
  },
  video_url: {
    className:
      'bg-[var(--dtype-video-bg)] text-[var(--dtype-video-text)] border-[var(--dtype-video-border)]',
    label: 'Video'
  },
  unknown: {
    className: 'bg-muted text-muted-foreground border-border',
    label: 'Unknown'
  }
};

// ─── Default template ID ─────────────────────────────────────────────────────
// Used when no template is specified (Phase 3 — component registry not yet integrated)

export const DEFAULT_TEMPLATE_ID = 'promo-video';
