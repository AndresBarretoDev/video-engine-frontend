/**
 * OP Video Engine — Navigation Text Maps
 *
 * All navigation-related strings externalized.
 * No hardcoded labels in JSX.
 */

export const navigationTextMap = {
  /* Sidebar nav labels */
  nav: {
    dashboard: 'Dashboard',
    brands: 'Brands',
    components: 'Components',
    projects: 'Projects',
    assets: 'Assets',
    users: 'Users',
    settings: 'Settings',
    templates: 'Templates'
  },

  /* Sidebar branding */
  sidebar: {
    appName: 'OP Video Engine',
    appSubtitle: 'Video Engine',
    appShortName: 'OPVE',
    logoAlt: 'OP Video Engine logo'
  },

  /* Header */
  header: {
    openSidebar: 'Open sidebar',
    closeSidebar: 'Close sidebar',
    notifications: 'Notifications',
    userMenuTrigger: 'User menu'
  },

  /* User dropdown */
  userMenu: {
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    roleBadgeLabel: 'Role'
  },

  /* Breadcrumbs */
  breadcrumbs: {
    home: 'Home'
  },

  /* Theme toggle */
  themeToggle: {
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode'
  }
} as const;
