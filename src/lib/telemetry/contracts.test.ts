import { describe, expect, it } from 'vitest';
import {
  createTelemetryEvent,
  TELEMETRY_BOUNDARIES,
  TELEMETRY_EVENT_NAMES,
  TELEMETRY_OUTCOMES,
  TELEMETRY_RECOVERY_CLASSES
} from './contracts';

const ALLOWED_KEYS = [
  'name',
  'route',
  'boundary',
  'outcome',
  'recoveryClass',
  'correlationId',
  'buildSha',
  'timestamp'
].sort();

const validInput = {
  name: 'apiContractFailure' as const,
  route: '/dashboard/projects/123',
  boundary: 'apiClient' as const,
  outcome: 'recovered' as const,
  recoveryClass: 'retry' as const,
  correlationId: 'abc-123',
  buildSha: 'sha-abc',
  timestamp: '2026-07-23T00:00:00.000Z'
};

describe('createTelemetryEvent', () => {
  it('projects only the allowlisted fields, discarding hostile extras', () => {
    const event = createTelemetryEvent({
      ...validInput,
      password: 'hunter2',
      cookies: { session: 'abc' },
      queryParams: ['token=1']
    });

    expect(Object.keys(event).sort()).toEqual(ALLOWED_KEYS);
    expect(JSON.stringify(event)).not.toContain('hunter2');
  });

  it('drops nested objects, arrays, and Error values used as field input', () => {
    const event = createTelemetryEvent({
      ...validInput,
      route: new Error('leaked-secret-xyz'),
      correlationId: { nested: true }
    });

    expect(event.route).toBe('unknown');
    expect(JSON.stringify(event)).not.toContain('leaked-secret-xyz');
  });

  it('strips query strings, credentials, and private hosts from a hostile route', () => {
    expect(
      createTelemetryEvent({
        ...validInput,
        route: 'https://user:pass@example.com/path?token=abc'
      }).route
    ).toBe('unknown');
    expect(
      createTelemetryEvent({ ...validInput, route: 'http://localhost:3001/x' })
        .route
    ).toBe('unknown');
  });

  it('falls back to safe defaults for values outside the closed enums', () => {
    const event = createTelemetryEvent({
      ...validInput,
      name: 'bogus' as never,
      boundary: 'bogus' as never,
      outcome: 'bogus' as never,
      recoveryClass: 'bogus' as never
    });

    expect(TELEMETRY_EVENT_NAMES).toContain(event.name);
    expect(TELEMETRY_BOUNDARIES).toContain(event.boundary);
    expect(TELEMETRY_OUTCOMES).toContain(event.outcome);
    expect(TELEMETRY_RECOVERY_CLASSES).toContain(event.recoveryClass);
  });

  it('returns an immutable event and never mutates the original input', () => {
    const input = { ...validInput, extra: { nested: true } };
    const before = JSON.stringify(input);
    const event = createTelemetryEvent(input as unknown as typeof validInput);

    expect(Object.isFrozen(event)).toBe(true);
    expect(() => {
      (event as unknown as Record<string, unknown>).route = 'mutated';
    }).toThrow();
    expect(JSON.stringify(input)).toBe(before);
  });
});
