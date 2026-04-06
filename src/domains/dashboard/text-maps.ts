/**
 * OP Video Engine — Dashboard Text Maps
 *
 * All user-visible strings for the dashboard domain.
 * No hardcoded strings in JSX.
 *
 * Spec: SPEC-CROSS-005
 */

export const dashboardTextMap = {
  /* Page */
  page: {
    title: 'Dashboard',
    description: 'Overview of your workspace'
  },

  /* Greeting */
  greeting: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
    welcome: 'Welcome back'
  },

  /* Metric card labels */
  metrics: {
    totalProjects: 'Total Projects',
    myProjects: 'My Projects',
    activeRenders: 'Active Renders',
    pendingReviews: 'Pending Reviews',
    totalBrands: 'Total Brands',
    totalComponents: 'Total Components',
    totalAssets: 'Total Assets',
    totalUsers: 'Total Users'
  },

  /* Recent projects */
  recentProjects: {
    sectionTitle: 'Recent Projects',
    viewAll: 'View all',
    noProjects: 'No recent projects',
    noProjectsDescription: 'Projects you work on will appear here.'
  },

  /* Metrics placeholder */
  metricsPlaceholder: 'No metrics available.',

  /* Summary card */
  viewLink: 'View',

  /* Loading / Error */
  loading: 'Loading dashboard...',
  errorTitle: 'Failed to load dashboard',
  errorDescription: 'Could not fetch your dashboard summary. Please try again.'
} as const;
