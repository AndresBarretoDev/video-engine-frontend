/**
 * OP Video Engine — Dashboard Domain Types
 *
 * Spec: SPEC-DASH-001 through SPEC-DASH-005
 */

export interface DashboardMetric {
  key: string;
  label: string;
  value: number;
  href: string;
}

export interface DashboardSummary {
  metrics: DashboardMetric[];
  recentProjects: RecentProject[];
}

export interface RecentProject {
  id: string;
  name: string;
  status: string;
  brand: string | null;
  updatedAt: string;
}
