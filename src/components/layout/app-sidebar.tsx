'use client';

/**
 * OP Video Engine — Application Sidebar
 *
 * Responsive sidebar with role-based navigation.
 * - Desktop (≥1024px): expanded sidebar
 * - Tablet (768–1023px): collapsed icon rail
 * - Mobile (<768px): hidden, opens as sheet overlay
 *
 * Spec: SPEC-LAYOUT-001 through SPEC-LAYOUT-004
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth/auth-context';
import { hasAnyRole } from '@/lib/auth/role-guard';
import {
  NAV_ITEMS,
  NAV_LABELS
} from '@/domains/navigation/constants/nav-config';
import { navigationTextMap } from '@/domains/navigation/text-maps';
import { layoutTextMap } from '@/constants/layout-text-maps';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const filteredNavItems = NAV_ITEMS.filter(
    item => user && hasAnyRole(user, item.roles)
  );

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <Sidebar collapsible="icon">
      {/* Header: App branding */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent"
            >
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-[var(--radius-8)] text-xs font-bold">
                  OP
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-sm font-semibold">
                    {navigationTextMap.sidebar.appName}
                  </span>
                  <span className="text-sidebar-foreground/60 text-xs">
                    {navigationTextMap.sidebar.appSubtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Content: Navigation items filtered by role */}
      <SidebarContent>
        <SidebarMenu>
          {isLoading
            ? // Skeleton nav items while auth is loading
              Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuItem key={`skeleton-${i}`}>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                </SidebarMenuItem>
              ))
            : filteredNavItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={NAV_LABELS[item.key]}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{NAV_LABELS[item.key]}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: User profile + logout */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              <div className="flex items-center gap-2 px-2 py-2">
                <Skeleton className="size-8 rounded-[var(--radius-8)]" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    aria-label={navigationTextMap.header.userMenuTrigger}
                  >
                    <Avatar className="size-8 rounded-[var(--radius-8)]">
                      {user?.avatarUrl && (
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={user?.name ?? ''}
                        />
                      )}
                      <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-[var(--radius-8)] text-xs">
                        {user?.name ? getInitials(user.name) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 text-left leading-none">
                      <span className="max-w-[120px] truncate text-sm font-medium">
                        {user?.name}
                      </span>
                      <span className="text-sidebar-foreground/60 max-w-[120px] truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs capitalize"
                      >
                        {layoutTextMap.roles[user.role]}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      {layoutTextMap.userSection.settings}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    {layoutTextMap.userSection.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{layoutTextMap.userSection.logoutTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {layoutTextMap.userSection.logoutDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{layoutTextMap.userSection.logoutCancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
            >
              {layoutTextMap.userSection.logoutConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
