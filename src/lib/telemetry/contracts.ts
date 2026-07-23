/**
 * OP Video Engine — Telemetry Contracts
 *
 * Typed event names and the single centralized allowlist projection.
 * No caller may attach fields outside this list; unknown or hostile
 * data is discarded rather than forwarded.
 */

import { redactCorrelationId, redactRoute, redactScalar } from './redaction';

export const TELEMETRY_EVENT_NAMES = [
  'routeFailure',
  'apiContractFailure',
  'previewFailure',
  'boundaryRecoverableError'
] as const;
export type TelemetryEventName = (typeof TELEMETRY_EVENT_NAMES)[number];

export const TELEMETRY_BOUNDARIES = [
  'apiClient',
  'queryCache',
  'mutationCache',
  'globalError'
] as const;
export type TelemetryBoundary = (typeof TELEMETRY_BOUNDARIES)[number];

export const TELEMETRY_OUTCOMES = ['recovered', 'unrecovered'] as const;
export type TelemetryOutcome = (typeof TELEMETRY_OUTCOMES)[number];

export const TELEMETRY_RECOVERY_CLASSES = [
  'retry',
  'redirect',
  'reload',
  'fallback',
  'none'
] as const;
export type TelemetryRecoveryClass =
  (typeof TELEMETRY_RECOVERY_CLASSES)[number];

export interface TelemetryEvent {
  readonly name: TelemetryEventName;
  readonly route: string;
  readonly boundary: TelemetryBoundary;
  readonly outcome: TelemetryOutcome;
  readonly recoveryClass: TelemetryRecoveryClass;
  readonly correlationId: string;
  readonly buildSha: string;
  readonly timestamp: string;
}

export interface TelemetryEventInput {
  name: unknown;
  route: unknown;
  boundary: unknown;
  outcome: unknown;
  recoveryClass: unknown;
  correlationId?: unknown;
  buildSha?: unknown;
  timestamp?: unknown;
  [extraField: string]: unknown;
}

function pickFromClosedList<T extends string>(
  allowed: readonly T[],
  value: unknown,
  fallback: T
): T {
  return typeof value === 'string' &&
    (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function resolveBuildSha(explicit: unknown): string {
  const provided = redactScalar(explicit);
  return provided !== 'unknown'
    ? provided
    : redactScalar(process.env.NEXT_PUBLIC_BUILD_SHA);
}

function resolveTimestamp(explicit: unknown): string {
  return typeof explicit === 'string' && !Number.isNaN(Date.parse(explicit))
    ? explicit
    : new Date().toISOString();
}

const recordedErrors = new WeakSet<object>();

/** Tags an error as already recorded, so a downstream boundary can skip it. */
export function markTelemetryRecorded(error: unknown): void {
  if (error !== null && typeof error === 'object') recordedErrors.add(error);
}

/** True when `markTelemetryRecorded` already tagged this exact error. */
export function isTelemetryRecorded(error: unknown): boolean {
  return (
    error !== null && typeof error === 'object' && recordedErrors.has(error)
  );
}

/**
 * Creates a single, immutable telemetry event from raw boundary input.
 * Every field outside this allowlist is dropped before transport.
 */
export function createTelemetryEvent(
  input: TelemetryEventInput
): TelemetryEvent {
  return Object.freeze({
    name: pickFromClosedList(
      TELEMETRY_EVENT_NAMES,
      input.name,
      'boundaryRecoverableError'
    ),
    route: redactRoute(input.route),
    boundary: pickFromClosedList(
      TELEMETRY_BOUNDARIES,
      input.boundary,
      'globalError'
    ),
    outcome: pickFromClosedList(
      TELEMETRY_OUTCOMES,
      input.outcome,
      'unrecovered'
    ),
    recoveryClass: pickFromClosedList(
      TELEMETRY_RECOVERY_CLASSES,
      input.recoveryClass,
      'none'
    ),
    correlationId: redactCorrelationId(input.correlationId),
    buildSha: resolveBuildSha(input.buildSha),
    timestamp: resolveTimestamp(input.timestamp)
  });
}
