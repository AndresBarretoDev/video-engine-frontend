'use client';

/**
 * OP Video Engine — Client Providers
 *
 * Wraps the app with all required client-side providers:
 * - React Query (server state from NestJS API)
 * - Auth Context (JWT session management)
 * - Toaster (sonner notifications)
 */

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { sendTelemetryEvent } from '@/lib/telemetry/client';
import {
  createTelemetryEvent,
  type TelemetryBoundary
} from '@/lib/telemetry/contracts';
import { useThemeStore } from '@/domains/layout/stores/theme-store';

/**
 * Emits exactly one coarse, allowlisted diagnostic per query/mutation
 * outcome. `QueryCache`/`MutationCache.onError` is the SINGLE source of
 * API/query boundary telemetry: it fires exactly once per outcome, after
 * React Query's retries are exhausted — unlike the axios interceptor in
 * `@/lib/api/client`, which runs once per HTTP attempt and must never
 * emit telemetry itself. This is a side effect only, never a second
 * failure path; React Query alone owns the error surfaced to callers.
 */
function recordQueryBoundaryTelemetry(boundary: TelemetryBoundary): void {
  try {
    const event = createTelemetryEvent({
      name: 'apiContractFailure',
      route:
        typeof window !== 'undefined' ? window.location.pathname : undefined,
      boundary,
      outcome: 'unrecovered',
      recoveryClass: 'none'
    });
    sendTelemetryEvent(event);
  } catch {
    // Telemetry must never affect React Query's own error surfacing.
  }
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: () => recordQueryBoundaryTelemetry('queryCache')
    }),
    mutationCache: new MutationCache({
      onError: () => recordQueryBoundaryTelemetry('mutationCache')
    }),
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
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore(s => s.theme);
  const [queryClient] = useState(() => createAppQueryClient());

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
