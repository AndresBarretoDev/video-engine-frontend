'use client';

/**
 * OP Video Engine — Dashboard Content
 *
 * Client Component. Renders greeting + metric cards + recent projects.
 * Fetches data via React Query (GET /dashboard/summary).
 * Handles loading, error, and empty states.
 *
 * Spec: SPEC-DASH-001 through SPEC-DASH-005
 */

import {
  LayoutDashboard,
  FolderKanban,
  Clapperboard,
  Eye,
  Palette,
  Users
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useDashboardSummary } from '@/domains/dashboard/hooks/use-dashboard-summary';
import { dashboardTextMap } from '@/domains/dashboard/text-maps';
import { layoutTextMap } from '@/constants/layout-text-maps';
import { SummaryCard } from './summary-card';
import { RecentProjectsList } from './recent-projects-list';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/lib/auth/types';

/* Icons map for metric keys — must match backend kebab-case keys */
const METRIC_ICONS: Record<string, LucideIcon> = {
  'total-projects': FolderKanban,
  'my-projects': FolderKanban,
  'projects-in-review': Eye,
  'projects-in-progress': Clapperboard,
  'projects-approved': FolderKanban,
  'projects-delivered': FolderKanban,
  'total-brands': Palette,
  'brands-available': Palette,
  'total-users': Users
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return dashboardTextMap.greeting.morning;
  if (hour < 18) return dashboardTextMap.greeting.afternoon;
  return dashboardTextMap.greeting.evening;
}

function getRoleLabel(role: UserRole): string {
  return layoutTextMap.roles[role];
}

export function DashboardContent() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useDashboardSummary();

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  if (error) {
    return (
      <ErrorAlert
        title={dashboardTextMap.errorTitle}
        message={dashboardTextMap.errorDescription}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          {user?.role && (
            <span>
              {getRoleLabel(user.role)} · {dashboardTextMap.page.description}
            </span>
          )}
        </p>
      </div>

      {/* Metric cards */}
      {data?.metrics && data.metrics.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.metrics.map(metric => {
              const Icon = METRIC_ICONS[metric.key] ?? LayoutDashboard;
              return (
                <SummaryCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  icon={Icon}
                  href={metric.href}
                />
              );
            })}
          </div>
        </section>
      ) : (
        /* Placeholder when no API data available yet */
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-dashed opacity-60">
              <CardContent className="text-muted-foreground p-6 text-center text-sm">
                {dashboardTextMap.metricsPlaceholder}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Recent Projects */}
      {data?.recentProjects !== undefined && (
        <section>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">
                {dashboardTextMap.recentProjects.sectionTitle}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">
                  {dashboardTextMap.recentProjects.viewAll}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentProjectsList projects={data.recentProjects} />
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
