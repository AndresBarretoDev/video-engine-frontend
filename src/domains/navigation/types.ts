/**
 * OP Video Engine — Navigation Domain Types
 */

import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/lib/auth/types';

export interface NavItem {
  key: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export interface NavSection {
  key: string;
  items: NavItem[];
}

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
}
