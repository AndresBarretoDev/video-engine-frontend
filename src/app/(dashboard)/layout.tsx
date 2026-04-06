/**
 * OP Video Engine — Dashboard Authenticated Layout
 *
 * Shell for all authenticated routes.
 * Composes SidebarProvider + AppSidebar + SidebarInset + AppHeader + children.
 * Backgrounds use Vibe Coding surface tokens.
 *
 * This is a Server Component — client interactivity is in child components.
 * Spec: SPEC-LAYOUT-001 through SPEC-LAYOUT-008
 */

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { ModalRenderer } from '@/components/layout/modal-renderer';
import { PageSkeleton } from '@/components/shared/page-skeleton';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="bg-background flex min-h-screen flex-1 flex-col gap-4 p-4">
            <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <ModalRenderer />
    </NuqsAdapter>
  );
}
