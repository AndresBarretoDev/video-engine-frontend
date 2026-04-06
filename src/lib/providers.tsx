'use client';

/**
 * OP Video Engine — Client Providers
 *
 * Wraps the app with all required client-side providers:
 * - React Query (server state from NestJS API)
 * - Auth Context (JWT session management)
 * - Toaster (sonner notifications)
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useThemeStore } from '@/domains/layout/stores/theme-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore(s => s.theme);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default
            retry: 1,
            refetchOnWindowFocus: false
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            theme={theme}
            closeButton
          />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
