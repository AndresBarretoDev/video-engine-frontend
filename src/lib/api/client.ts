/**
 * OP Video Engine — Centralized API Client
 *
 * All frontend ↔ NestJS communication flows through this client.
 * JWT authentication via httpOnly cookies (automatic, no manual token handling).
 *
 * Usage:
 *   const projects = await apiClient<Project[]>('/projects');
 *   const job = await apiClient<RenderJob>('/render-jobs', { method: 'POST', data: payload });
 */

import type { AxiosError } from 'axios';
import axios from 'axios';
import { sendTelemetryEvent } from '@/lib/telemetry/client';
import {
  createTelemetryEvent,
  type TelemetryOutcome,
  type TelemetryRecoveryClass
} from '@/lib/telemetry/contracts';
import { getMockResponse } from './mock-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/* ========================================
 * Telemetry
 * Emits exactly one coarse, allowlisted diagnostic per boundary
 * outcome. Never alters the error thrown to the caller.
 * ======================================== */
export function recordApiBoundaryTelemetry(params: {
  route?: string;
  status: number;
  isAuthEndpoint: boolean;
}): void {
  try {
    const attemptsAutomaticRetry =
      params.status === 401 && !params.isAuthEndpoint;
    const outcome: TelemetryOutcome = attemptsAutomaticRetry
      ? 'recovered'
      : 'unrecovered';
    const recoveryClass: TelemetryRecoveryClass = attemptsAutomaticRetry
      ? 'retry'
      : 'none';

    const event = createTelemetryEvent({
      name: 'apiContractFailure',
      route: params.route,
      boundary: 'apiClient',
      outcome,
      recoveryClass
    });

    sendTelemetryEvent(event);
  } catch {
    // Telemetry must never affect the API boundary contract.
  }
}

/* ========================================
 * Custom Error Class
 * ======================================== */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/* ========================================
 * Axios Instance
 * withCredentials: true → sends httpOnly JWT cookie automatically
 * ======================================== */
const httpClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* ========================================
 * Request Interceptor
 * JWT is in httpOnly cookie — no manual header injection needed.
 * ======================================== */
httpClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

/* ========================================
 * Token Refresh Logic
 * On 401, attempt to refresh the access_token via the refresh_token cookie.
 * If refresh succeeds, retry the original request once.
 * If refresh fails, redirect to login.
 * ======================================== */
let isRefreshing = false;
let refreshSubscribers: ((retry: boolean) => void)[] = [];

function subscribeToRefresh(callback: (retry: boolean) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshComplete(success: boolean) {
  refreshSubscribers.forEach(cb => cb(success));
  refreshSubscribers = [];
}

/* ========================================
 * Response Interceptor
 * Extracts .data from response and transforms errors.
 * ======================================== */
httpClient.interceptors.response.use(
  response => response.data,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    const originalRequest = error.config;
    const status = error.response?.status || 0;

    // Only attempt refresh on 401, and not for auth endpoints themselves
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    // Exactly one diagnostic per boundary outcome, before any recovery logic runs.
    recordApiBoundaryTelemetry({
      route: originalRequest?.url,
      status,
      isAuthEndpoint: Boolean(isAuthEndpoint)
    });
    if (status === 401 && !isAuthEndpoint && originalRequest) {
      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        return new Promise((resolve, reject) => {
          subscribeToRefresh(success => {
            if (success) {
              resolve(httpClient(originalRequest));
            } else {
              reject(new ApiError('Session expired', 401, 'SESSION_EXPIRED'));
            }
          });
        });
      }

      isRefreshing = true;
      try {
        await axios.post(`${API_BASE}/auth/refresh`, null, {
          withCredentials: true
        });
        isRefreshing = false;
        onRefreshComplete(true);
        // Retry original request — new access_token cookie is set
        return httpClient(originalRequest);
      } catch {
        isRefreshing = false;
        onRefreshComplete(false);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new ApiError('Session expired', 401, 'SESSION_EXPIRED');
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Request failed';
    const code = error.response?.data?.code;

    // Auth endpoints (login, me, refresh) handle their own 401s —
    // AuthProvider catches the error and sets isAuthenticated: false.
    // Do NOT redirect here or it causes an infinite loop on /login.

    throw new ApiError(message, status, code);
  }
);

/* ========================================
 * Generic API Client Function
 * When NEXT_PUBLIC_USE_MOCKS=true, returns mock data without
 * making real HTTP requests to the NestJS backend.
 * ======================================== */
export async function apiClient<T>(
  endpoint: string,
  options?: {
    method?: string;
    data?: unknown;
    params?: Record<string, unknown>;
  }
): Promise<T> {
  const method = options?.method || 'GET';
  const mockResponse = getMockResponse(endpoint, method, options?.params);

  if (mockResponse !== null) {
    return mockResponse as T;
  }

  return httpClient({
    url: endpoint,
    method,
    data: options?.data,
    params: options?.params
  });
}

export { httpClient };
