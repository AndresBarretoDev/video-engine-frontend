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
  it('preserves the public API surface and emits exactly one allowlisted event per failure', async () => {
    const apiClientModule = await import('@/lib/api/client');
    const { sendTelemetryEvent } = await import('./client');

    expect(typeof apiClientModule.apiClient).toBe('function');
    expect(typeof apiClientModule.ApiError).toBe('function');
    expect(apiClientModule.httpClient).toBeDefined();

    apiClientModule.recordApiBoundaryTelemetry({
      route: '/api/render-jobs',
      status: 500,
      isAuthEndpoint: false
    });

    expect(sendTelemetryEvent).toHaveBeenCalledTimes(1);
    const event = vi.mocked(sendTelemetryEvent).mock.calls[0][0];
    expect(Object.keys(event).sort()).toEqual(ALLOWED_KEYS);
    expect(event.boundary).toBe('apiClient');
    expect(event.outcome).toBe('unrecovered');
  });

  it('classifies a non-auth 401 as an attempted retry recovery and never throws on transport failure', async () => {
    const { recordApiBoundaryTelemetry } = await import('@/lib/api/client');
    const { sendTelemetryEvent } = await import('./client');

    recordApiBoundaryTelemetry({
      route: '/api/projects',
      status: 401,
      isAuthEndpoint: false
    });
    const event = vi.mocked(sendTelemetryEvent).mock.calls[0][0];
    expect(event.recoveryClass).toBe('retry');
    expect(event.outcome).toBe('recovered');

    vi.mocked(sendTelemetryEvent).mockImplementationOnce(() => {
      throw new Error('transport exploded');
    });
    expect(() =>
      recordApiBoundaryTelemetry({
        route: '/api/projects',
        status: 500,
        isAuthEndpoint: false
      })
    ).not.toThrow();
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
