'use client';

/**
 * OP Video Engine — Root Error Boundary
 *
 * Required Next.js default export to recover from errors thrown above
 * the root layout. Renders its own <html>/<body> and must keep the
 * retry path usable regardless of whether telemetry succeeds.
 */

import { useEffect, useRef } from 'react';
import { sendTelemetryEvent } from '@/lib/telemetry/client';
import { createTelemetryEvent } from '@/lib/telemetry/contracts';

/** Emits exactly one allowlisted diagnostic; never reads error message/stack. */
export function recordGlobalErrorTelemetry(
  error: Error & { digest?: string }
): void {
  try {
    const event = createTelemetryEvent({
      name: 'boundaryRecoverableError',
      route:
        typeof window !== 'undefined' ? window.location.pathname : undefined,
      boundary: 'globalError',
      outcome: 'unrecovered',
      recoveryClass: 'reload',
      correlationId: error.digest
    });
    sendTelemetryEvent(event);
  } catch {
    // Telemetry must never block the recovery surface.
  }
}

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    recordGlobalErrorTelemetry(error);
    // Deterministic focus target for keyboard/AT users on this full-page failure.
    retryButtonRef.current?.focus();
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. You can try again.
          </p>
          <button
            ref={retryButtonRef}
            type="button"
            onClick={() => reset()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
