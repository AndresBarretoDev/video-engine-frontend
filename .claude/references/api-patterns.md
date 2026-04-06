# API Patterns - NestJS Integration

**Full details**: Architecture documentation and API specifications (separate backend repo)

---

## Overview

This frontend communicates with a **NestJS backend** via HTTP REST API. All requests flow through a centralized API client that handles:

1. Authentication (JWT in httpOnly cookies)
2. Request/response transformation
3. Error handling
4. Data fetching (React Query)

**No Supabase, no Server Actions for mutations** — all data operations go through NestJS API.

---

## Centralized API Client

### Setup: `/src/lib/api/client.ts`

```typescript
import type { AxiosError } from 'axios';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Core API client with axios
const httpClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send httpOnly cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (future: add JWT refresh logic if needed)
httpClient.interceptors.request.use(
  (config) => {
    // JWT is automatically sent via httpOnly cookie with 'withCredentials: true'
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (error handling + response transformation)
httpClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    const message = error.response?.data?.message || error.message || 'Request failed';
    const status = error.response?.status || 0;
    const code = error.response?.data?.code;
    throw new ApiError(message, status, code);
  },
);

export async function apiClient<T>(
  endpoint: string,
  options?: { method?: string; data?: any; params?: Record<string, any> },
): Promise<T> {
  return httpClient({
    url: endpoint,
    method: options?.method || 'GET',
    data: options?.data,
    params: options?.params,
  });
}

export { httpClient };
```

### Usage: Simple GET/POST

```typescript
// GET
const projects = await apiClient<Project[]>('/projects');

// POST
const newJob = await apiClient<RenderJob>('/render-jobs', {
  method: 'POST',
  data: { projectId: '123', templateId: 'abc' },
});

// GET with query params
const jobs = await apiClient<RenderJob[]>('/render-jobs', {
  params: { projectId: '123', status: 'pending' },
});
```

---

## React Query Hooks Pattern

### Query Hook (Fetching Data)

```typescript
// src/domains/render-jobs/hooks/use-render-jobs.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { RenderJob } from '../types';

export function useRenderJobs(projectId: string) {
  return useQuery({
    queryKey: ['render-jobs', projectId],
    queryFn: async () => {
      return apiClient<RenderJob[]>('/render-jobs', {
        params: { projectId },
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRenderJobById(jobId: string) {
  return useQuery({
    queryKey: ['render-jobs', jobId],
    queryFn: () => apiClient<RenderJob>(`/render-jobs/${jobId}`),
    enabled: !!jobId, // Skip if no jobId
  });
}
```

### Mutation Hook (Create/Update/Delete)

```typescript
// src/domains/render-jobs/hooks/use-create-render-job.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import type { RenderJob, CreateRenderJobDto } from '../types';

export function useCreateRenderJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRenderJobDto) =>
      apiClient<RenderJob>('/render-jobs', {
        method: 'POST',
        data,
      }),

    onSuccess: (newJob) => {
      // Invalidate cache for render-jobs list
      queryClient.invalidateQueries({ queryKey: ['render-jobs'] });
      toast.success('Render job created successfully');
      return newJob;
    },

    onError: (error: any) => {
      const message = error?.message || 'Failed to create render job';
      toast.error(message);
    },
  });
}

export function useUpdateRenderJob(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RenderJob>) =>
      apiClient<RenderJob>(`/render-jobs/${jobId}`, {
        method: 'PATCH',
        data,
      }),

    onSuccess: (updated) => {
      // Update cache for this job + invalidate list
      queryClient.setQueryData(['render-jobs', jobId], updated);
      queryClient.invalidateQueries({ queryKey: ['render-jobs'] });
      toast.success('Render job updated');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update render job');
    },
  });
}

export function useDeleteRenderJob(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<void>(`/render-jobs/${jobId}`, {
        method: 'DELETE',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['render-jobs'] });
      toast.success('Render job deleted');
    },

    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete render job');
    },
  });
}
```

---

## Error Handling Pattern

### Global Error Handler

```typescript
// src/lib/api/error-handler.ts
import type { ApiError } from './client';

export function handleApiError(error: unknown): string {
  if (error instanceof Error && 'status' in error) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Please log in again';
      case 403:
        return 'You do not have permission';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Conflict: resource already exists';
      case 429:
        return 'Too many requests, please try again later';
      case 500:
      case 502:
      case 503:
        return 'Server error, please try again later';
      default:
        return apiError.message || 'An error occurred';
    }
  }

  return 'An unexpected error occurred';
}
```

### Component Error Handling

```typescript
'use client';

import { useRenderJobs } from '@/domains/render-jobs/hooks/use-render-jobs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function RenderJobsList({ projectId }: { projectId: string }) {
  const { data: jobs, isLoading, error, refetch } = useRenderJobs(projectId);

  if (isLoading) return <Skeleton />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!jobs?.length) {
    return <EmptyState title="No render jobs" />;
  }

  return <div>{/* render jobs */}</div>;
}
```

---

## Domain Hook Pattern (Complete Example)

### Types: `/src/domains/render-jobs/types.ts`

```typescript
export interface RenderJob {
  id: string;
  projectId: string;
  templateId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputUrl?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
}

export interface CreateRenderJobDto {
  projectId: string;
  templateId: string;
  variables?: Record<string, any>;
}
```

### Hooks: `/src/domains/render-jobs/hooks/use-render-jobs.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import type { RenderJob, CreateRenderJobDto } from '../types';

export const RENDER_JOBS_QUERY_KEY = ['render-jobs'] as const;

export function useRenderJobs(projectId?: string) {
  return useQuery({
    queryKey: [...RENDER_JOBS_QUERY_KEY, projectId],
    queryFn: () =>
      apiClient<RenderJob[]>('/render-jobs', {
        params: projectId ? { projectId } : undefined,
      }),
    enabled: !!projectId, // Don't fetch if no projectId
    staleTime: 10 * 1000, // 10 seconds (render jobs change frequently)
  });
}

export function useRenderJobById(jobId: string) {
  return useQuery({
    queryKey: [...RENDER_JOBS_QUERY_KEY, jobId],
    queryFn: () => apiClient<RenderJob>(`/render-jobs/${jobId}`),
    enabled: !!jobId,
    refetchInterval: 5 * 1000, // Poll every 5s while processing
  });
}

export function useCreateRenderJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRenderJobDto) =>
      apiClient<RenderJob>('/render-jobs', { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENDER_JOBS_QUERY_KEY });
      toast.success('Render job created');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRenderJob(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<RenderJob>) =>
      apiClient<RenderJob>(`/render-jobs/${jobId}`, { method: 'PATCH', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENDER_JOBS_QUERY_KEY });
    },
  });
}

export function useDeleteRenderJob(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient<void>(`/render-jobs/${jobId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RENDER_JOBS_QUERY_KEY });
      toast.success('Render job deleted');
    },
  });
}
```

---

## Component Usage Pattern

```typescript
'use client';

import { useRenderJobs, useCreateRenderJob } from '@/domains/render-jobs/hooks/use-render-jobs';
import { RenderJobCard } from '../components/render-job-card';
import { CreateJobForm } from '../components/create-job-form';

export function RenderJobsSection({ projectId }: { projectId: string }) {
  const { data: jobs, isLoading } = useRenderJobs(projectId);
  const { mutate: createJob, isPending } = useCreateRenderJob();

  const handleCreate = (formData: CreateRenderJobDto) => {
    createJob(formData);
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="space-y-6">
      <CreateJobForm onSubmit={handleCreate} isLoading={isPending} />
      <div className="grid gap-4">
        {jobs?.map((job) => (
          <RenderJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
```

---

## Authentication Flow

### JWT in httpOnly Cookie

1. **Login** (handled by backend)
   - User submits credentials to `POST /auth/login`
   - Backend validates and issues JWT
   - Backend sets JWT in httpOnly cookie: `Set-Cookie: token=...`

2. **Every Request**
   - Browser automatically includes httpOnly cookie
   - `apiClient` sends all requests with `withCredentials: true`
   - Backend reads JWT from cookie, validates signature

3. **Logout**
   - Frontend calls `POST /auth/logout`
   - Backend clears the httpOnly cookie

### No Manual Token Handling

```typescript
// ✅ CORRECT - httpOnly cookie sent automatically
const jobs = await apiClient<RenderJob[]>('/render-jobs');

// ❌ WRONG - don't manually manage tokens
const token = localStorage.getItem('token'); // Never do this
```

---

## Rate Limiting & Retry Logic

### Retry Configuration (Optional)

```typescript
// src/lib/api/client.ts - Enhanced with retry
import { AxiosError } from 'axios';

const retryConfig = {
  maxRetries: 3,
  retryDelay: (count: number) => count * 1000, // Exponential backoff
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

httpClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const config = error.config as any;
    config.retryCount = config.retryCount || 0;

    if (
      retryConfig.retryableStatuses.includes(error.response?.status || 0) &&
      config.retryCount < retryConfig.maxRetries
    ) {
      config.retryCount++;
      await new Promise((resolve) =>
        setTimeout(resolve, retryConfig.retryDelay(config.retryCount)),
      );
      return httpClient(config);
    }

    throw new ApiError(
      error.response?.data?.message || error.message,
      error.response?.status || 0,
    );
  },
);
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Production
NEXT_PUBLIC_API_URL=https://api.opvideoengine.com/api
```

---

## Summary

| Layer | Tool | Responsibility |
|-------|------|-----------------|
| HTTP Client | axios | Request/response, credentials, error transformation |
| React Query | React Query | Caching, invalidation, refetch strategies |
| Hooks | Custom hooks | Domain-specific queries/mutations |
| Components | React Components | UI state, form submission, error display |
| Auth | httpOnly Cookies | JWT storage, automatic transmission, security |
