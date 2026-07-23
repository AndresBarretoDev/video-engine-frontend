import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTelemetryEvent } from './contracts';
import { sendTelemetryEvent } from './client';

const sampleEvent = createTelemetryEvent({
  name: 'apiContractFailure',
  route: '/dashboard',
  boundary: 'apiClient',
  outcome: 'unrecovered',
  recoveryClass: 'none'
});
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('sendTelemetryEvent', () => {
  it('is disabled by default: never calls fetch, returns undefined synchronously', async () => {
    vi.stubEnv('NEXT_PUBLIC_TELEMETRY_ENDPOINT', '');
    const fetchImpl = vi.fn();

    const result = sendTelemetryEvent(sampleEvent, { fetchImpl });
    await flush();

    expect(result).toBeUndefined();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it.each([
    [
      'a rejection',
      vi
        .fn()
        .mockRejectedValue(new Error('network down')) as unknown as typeof fetch
    ],
    [
      'a synchronous throw (malformed destination)',
      vi.fn(() => {
        throw new TypeError('Invalid URL');
      }) as unknown as typeof fetch
    ],
    [
      'a never-resolving timeout',
      vi.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch
    ]
  ])(
    'never throws, delays, or mutates the caller when the destination has %s',
    (_label, fetchImpl) => {
      const before = JSON.stringify(sampleEvent);
      expect(() =>
        sendTelemetryEvent(sampleEvent, {
          destination: 'https://telemetry.example.com/events',
          fetchImpl,
          timeoutMs: 5
        })
      ).not.toThrow();
      expect(JSON.stringify(sampleEvent)).toBe(before);
    }
  );

  it('delivers exactly one request to the resolved destination when healthy', async () => {
    vi.stubEnv(
      'NEXT_PUBLIC_TELEMETRY_ENDPOINT',
      'https://env-telemetry.example.com/events'
    );
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });

    sendTelemetryEvent(sampleEvent, { fetchImpl });
    await flush();

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://env-telemetry.example.com/events');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual(sampleEvent);
  });
});
