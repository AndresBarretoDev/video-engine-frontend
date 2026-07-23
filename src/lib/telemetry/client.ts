/**
 * OP Video Engine — Telemetry Transport
 *
 * Bounded, fire-and-forget delivery for already-projected events.
 * Disabled by default — a destination is required and never hardcoded.
 * Never throws, delays, or mutates anything the caller can observe.
 */

import type { TelemetryEvent } from './contracts';

export interface SendTelemetryOptions {
  /** Explicit destination override, primarily for tests. */
  destination?: string;
  /** Injectable fetch implementation, primarily for tests. */
  fetchImpl?: typeof fetch;
  /** Bound on how long the in-flight request may run before aborting. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 2000;

function resolveDestination(explicit?: string): string | undefined {
  const value = explicit ?? process.env.NEXT_PUBLIC_TELEMETRY_ENDPOINT;
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

/**
 * Sends a projected telemetry event to the configured destination.
 * Always returns `undefined` synchronously — never a promise to await
 * and never a thrown error to catch.
 */
export function sendTelemetryEvent(
  event: TelemetryEvent,
  options: SendTelemetryOptions = {}
): void {
  try {
    const destination = resolveDestination(options.destination);
    if (!destination) return; // Safe no-op: disabled by default.

    const fetchImpl = options.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== 'function') return;

    const controller =
      typeof AbortController !== 'undefined'
        ? new AbortController()
        : undefined;
    const timer = controller
      ? setTimeout(
          () => controller.abort(),
          options.timeoutMs ?? DEFAULT_TIMEOUT_MS
        )
      : undefined;

    void Promise.resolve()
      .then(() =>
        fetchImpl(destination, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
          signal: controller?.signal,
          keepalive: true
        })
      )
      .catch(() => undefined)
      .finally(() => timer && clearTimeout(timer));
  } catch {
    // Telemetry must never throw into the caller's flow.
  }
}
