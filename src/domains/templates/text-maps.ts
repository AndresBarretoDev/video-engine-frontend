/**
 * OP Video Engine — Templates Domain Text Maps
 *
 * All strings externalized. No hardcoded labels in JSX.
 */

export const templatesTextMaps = {
  // Page
  pageTitle: 'Templates',
  pageDescription: 'Choose a template to start creating your video.',

  // Gallery
  galleryHeading: 'Template Gallery',
  galleryDescription:
    'Pick a template. Each card shows a live looping preview — what you see is what renders.',

  // Card
  cardSelectLabel: 'Use template',
  cardFormatsLabel: 'Formats',
  cardFormatsAvailable: (count: number) =>
    `${count} format${count === 1 ? '' : 's'} available`,
  cardPreviewAriaLabel: (name: string) => `Live preview of ${name}`,

  // Skeleton
  skeletonAriaLabel: 'Loading templates...',

  // Empty state
  emptyTitle: 'No templates yet',
  emptyDescription:
    'Templates will appear here once they are registered in the system.',

  // Error state
  errorLoad: 'Failed to load templates.',
  errorRetry: 'Try again',

  // Format labels
  format16x9: '16:9',
  format9x16: '9:16',
  format1x1: '1:1',

  // Format aria labels
  formatAriaLabel: (format: string) => `Format ${format}`,

  // Success
  templateSelected: 'Template selected'
} as const;
