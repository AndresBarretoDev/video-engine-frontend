/**
 * OP Video Engine — Telemetry Redaction
 *
 * Pure helpers that turn hostile input into safe, allowlist-ready
 * scalars. Nested objects, arrays, `Error` instances, query strings,
 * credentials, and private URLs are dropped entirely, never masked.
 */

const MAX_LENGTH = 200;
const FORBIDDEN_PATTERN =
  /(password|token|secret|apikey|api_key|authorization|bearer)/i;
const PRIVATE_HOSTNAME_PATTERN =
  /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|.*\.local$|.*\.internal$)/i;
const CORRELATION_ID_PATTERN = /^[a-zA-Z0-9-]{1,64}$/;

function isPlainString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function generateCorrelationId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `cid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Reduces any value to a bounded, allowlist-safe scalar or `'unknown'`. */
export function redactScalar(value: unknown): string {
  if (!isPlainString(value)) return 'unknown';
  if (FORBIDDEN_PATTERN.test(value)) return 'unknown';
  return value.slice(0, MAX_LENGTH);
}

/** Strips query/fragment/credentials and collapses private hosts to `'unknown'`. */
export function redactRoute(value: unknown): string {
  if (!isPlainString(value)) return 'unknown';

  const path = value.split('?')[0]?.split('#')[0] ?? '';
  const isAbsolute = path.includes('://');

  try {
    const url = new URL(path, 'https://placeholder.invalid');
    if (url.username || url.password) return 'unknown';
    if (isAbsolute && PRIVATE_HOSTNAME_PATTERN.test(url.hostname))
      return 'unknown';
    return (isAbsolute ? url.pathname : path).slice(0, MAX_LENGTH) || '/';
  } catch {
    return 'unknown';
  }
}

/** Keeps a bounded identifier or generates a fresh one for hostile/missing input. */
export function redactCorrelationId(value: unknown): string {
  if (isPlainString(value) && CORRELATION_ID_PATTERN.test(value)) return value;
  return generateCorrelationId();
}
