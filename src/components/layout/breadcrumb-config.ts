/**
 * OP Video Engine — Breadcrumb Route Label Map
 *
 * Maps URL path segments to human-readable breadcrumb labels.
 * Dynamic segments ([id]) are replaced with entity names at runtime.
 *
 * Spec: SPEC-LAYOUT-007
 */

export const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  brands: 'Brands',
  components: 'Components',
  projects: 'Projects',
  assets: 'Assets',
  users: 'Users',
  settings: 'Settings',
  templates: 'Templates',
  new: 'New',
  edit: 'Edit',
  detail: 'Detail'
};

/**
 * Returns a human-readable label for a URL segment.
 * Falls back to capitalizing the segment if not mapped.
 */
export function getBreadcrumbLabel(segment: string): string {
  return (
    BREADCRUMB_LABELS[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}
