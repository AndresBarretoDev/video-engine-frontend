import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client', () => ({ sendTelemetryEvent: vi.fn() }));

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('api client boundary wiring', () => {
  it('preserves the public API surface and is not itself a telemetry emission source', async () => {
    const apiClientModule = await import('@/lib/api/client');
    const { sendTelemetryEvent } = await import('./client');

    expect(typeof apiClientModule.apiClient).toBe('function');
    expect(typeof apiClientModule.ApiError).toBe('function');
    expect(apiClientModule.httpClient).toBeDefined();

    // Regression guard: the per-HTTP-attempt emitter must stay removed.
    // React Query's `retry: 1` means one logical outcome can trigger 2+
    // HTTP attempts — an interceptor-level emitter would duplicate events.
    expect(
      (apiClientModule as Record<string, unknown>).recordApiBoundaryTelemetry
    ).toBeUndefined();
    expect(sendTelemetryEvent).not.toHaveBeenCalled();
  });
});

describe('React Query boundary wiring', () => {
  it('retains query/mutation ownership of their own errors while emitting one telemetry event each', async () => {
    const { createAppQueryClient } = await import('@/lib/providers');
    const { sendTelemetryEvent } = await import('./client');
    const queryClient = createAppQueryClient();
    const queryFailure = new Error('contract mismatch');
    const mutationFailure = new Error('mutation contract mismatch');

    await expect(
      queryClient.fetchQuery({
        queryKey: ['wiring-query-failure'],
        queryFn: () => Promise.reject(queryFailure),
        retry: false
      })
    ).rejects.toBe(queryFailure);

    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject(mutationFailure),
      retry: false
    });
    await expect(mutation.execute(undefined)).rejects.toBe(mutationFailure);

    expect(sendTelemetryEvent).toHaveBeenCalledTimes(2);
    const [queryEvent, mutationEvent] = vi
      .mocked(sendTelemetryEvent)
      .mock.calls.map(call => call[0]);
    expect(Object.keys(queryEvent).sort()).toEqual(ALLOWED_KEYS);
    expect(queryEvent.boundary).toBe('queryCache');
    expect(mutationEvent.boundary).toBe('mutationCache');
  });

  it('does not emit telemetry for a successful query', async () => {
    const { createAppQueryClient } = await import('@/lib/providers');
    const { sendTelemetryEvent } = await import('./client');
    const queryClient = createAppQueryClient();

    await expect(
      queryClient.fetchQuery({
        queryKey: ['wiring-query-success'],
        queryFn: () => Promise.resolve('ok')
      })
    ).resolves.toBe('ok');
    expect(sendTelemetryEvent).not.toHaveBeenCalled();
  });
});

describe('joint apiClient + React Query wiring (exactly-once)', () => {
  it('emits exactly one event when a queryFn failure comes from apiClient', async () => {
    const { apiClient, httpClient } = await import('@/lib/api/client');
    const { createAppQueryClient } = await import('@/lib/providers');
    const { sendTelemetryEvent } = await import('./client');
    const originalAdapter = httpClient.defaults.adapter;
    httpClient.defaults.adapter = () =>
      Promise.reject({ config: { url: '/x' }, response: { status: 500 } });

    await expect(
      createAppQueryClient().fetchQuery({
        queryKey: ['wiring-joint-failure'],
        queryFn: () => apiClient('/x'),
        retry: false
      })
    ).rejects.toBeInstanceOf(Error);
    httpClient.defaults.adapter = originalAdapter;

    expect(sendTelemetryEvent).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendTelemetryEvent).mock.calls[0][0].boundary).toBe(
      'queryCache'
    );
  });

  it('emits exactly one event per outcome even when React Query retries the apiClient call across multiple HTTP attempts', async () => {
    // Regression test for the real matrix defect: with `retry: 1`, a single
    // logical query outcome produced 2+ telemetry events because the axios
    // interceptor emitted once PER ATTEMPT. The fix ties emission to the
    // query lifecycle (onError, after retries exhaust) instead of wall-clock
    // HTTP attempts.
    const { apiClient, httpClient } = await import('@/lib/api/client');
    const { createAppQueryClient } = await import('@/lib/providers');
    const { sendTelemetryEvent } = await import('./client');
    const originalAdapter = httpClient.defaults.adapter;
    let attempts = 0;
    httpClient.defaults.adapter = () => {
      attempts += 1;
      return Promise.reject({
        config: { url: '/x' },
        response: { status: 500 }
      });
    };

    await expect(
      createAppQueryClient().fetchQuery({
        queryKey: ['wiring-joint-retry-failure'],
        queryFn: () => apiClient('/x'),
        retry: 1,
        retryDelay: 0
      })
    ).rejects.toBeInstanceOf(Error);
    httpClient.defaults.adapter = originalAdapter;

    // Proves the retry actually happened (the condition that used to
    // multiply telemetry events) while the outcome is still recorded once.
    expect(attempts).toBeGreaterThanOrEqual(2);
    expect(sendTelemetryEvent).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendTelemetryEvent).mock.calls[0][0].boundary).toBe(
      'queryCache'
    );
  });
});

describe('global error boundary wiring', () => {
  it('preserves the default export and emits one allowlisted event without leaking the message', async () => {
    const globalErrorModule = await import('@/app/global-error');
    const { sendTelemetryEvent } = await import('./client');

    expect(typeof globalErrorModule.default).toBe('function');

    globalErrorModule.recordGlobalErrorTelemetry(
      new Error('leaked-secret-value-should-not-appear')
    );

    expect(sendTelemetryEvent).toHaveBeenCalledTimes(1);
    const event = vi.mocked(sendTelemetryEvent).mock.calls[0][0];
    expect(Object.keys(event).sort()).toEqual(ALLOWED_KEYS);
    expect(event.boundary).toBe('globalError');
    expect(JSON.stringify(event)).not.toContain(
      'leaked-secret-value-should-not-appear'
    );

    vi.mocked(sendTelemetryEvent).mockImplementationOnce(() => {
      throw new Error('transport exploded');
    });
    expect(() =>
      globalErrorModule.recordGlobalErrorTelemetry(new Error('boom'))
    ).not.toThrow();
  });
});
