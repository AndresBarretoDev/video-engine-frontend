/**
 * OP Video Engine — Navigation Configuration
 *
 * Defines sidebar nav items per role.
 * Filter at runtime using hasAnyRole() from role-guard.ts.
 *
 * Spec: SPEC-LAYOUT-001
 */

import {
  LayoutDashboard,
  Palette,
  Blocks,
  FolderKanban,
  Image,
  Users,
  LayoutTemplate
} from 'lucide-react';
import type { NavItem } from '@/domains/navigation/types';
import { navigationTextMap } from '@/domains/navigation/text-maps';

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'designer', 'producer', 'qc', 'client']
  },
  {
    key: 'brands',
    href: '/brands',
    icon: Palette,
    roles: ['admin']
  },
  {
    key: 'components',
    href: '/components',
    icon: Blocks,
    roles: ['admin', 'designer', 'producer']
  },
  {
    key: 'projects',
    href: '/projects',
    icon: FolderKanban,
    roles: ['admin', 'producer', 'designer']
  },
  {
    key: 'assets',
    href: '/assets',
    icon: Image,
    roles: ['admin', 'producer', 'designer']
  },
  {
    key: 'users',
    href: '/users',
    icon: Users,
    roles: ['admin']
  },
  {
    key: 'templates',
    href: '/templates',
    icon: LayoutTemplate,
    roles: ['admin', 'designer', 'producer']
  }
];

export const NAV_LABELS: Record<string, string> = {
  dashboard: navigationTextMap.nav.dashboard,
  brands: navigationTextMap.nav.brands,
  components: navigationTextMap.nav.components,
  projects: navigationTextMap.nav.projects,
  assets: navigationTextMap.nav.assets,
  users: navigationTextMap.nav.users,
  templates: navigationTextMap.nav.templates
};
