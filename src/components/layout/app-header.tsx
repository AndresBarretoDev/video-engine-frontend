'use client';

/**
 * OP Video Engine — Application Header
 *
 * Contains:
 * - Mobile: SidebarTrigger (hamburger) + app name
 * - Desktop: breadcrumbs + user dropdown
 *
 * Spec: SPEC-LAYOUT-005, SPEC-LAYOUT-006
 */

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { AppBreadcrumbs } from './app-breadcrumbs';
import { ThemeToggle } from './theme-toggle';

export function AppHeader() {
  return (
    <header className="border-border flex h-14 shrink-0 items-center gap-2 border-b px-4">
      {/* Mobile sidebar trigger + separator */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumbs — auto-generated from route */}
      <div className="flex-1">
        <AppBreadcrumbs />
      </div>

      {/* Theme toggle */}
      <ThemeToggle />
    </header>
  );
}
