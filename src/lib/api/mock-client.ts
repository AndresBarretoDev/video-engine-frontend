/**
 * OP Video Engine — Mock API Interceptor
 *
 * When NEXT_PUBLIC_USE_MOCKS=true, intercepts API calls and returns
 * mock data instead of making real HTTP requests to the NestJS backend.
 *
 * URL matching is intentionally simple — path prefix matching only.
 * No MSW, no complex setup. Just a lookup table.
 */

import { mockAuthUser } from './mocks/auth.mock';
import { mockAssets } from './mocks/assets.mock';
import { mockBrands } from './mocks/brands.mock';
import { mockComponents } from './mocks/components.mock';
import { mockDashboardSummary } from './mocks/dashboard.mock';
import { mockProjects } from './mocks/projects.mock';
import { mockUsers } from './mocks/users.mock';
import {
  mockAutoMatchSuggestions,
  mockColumnMappings,
  mockDataSource,
  mockPaginatedVariations,
  mockRules,
  mockVariations
} from './mocks/data-engine.mock';
import {
  mockRenderJobs,
  mockRenderBatches,
  mockRenderOutputs,
  mockRenderProgress
} from './mocks/render-jobs.mock';

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

/**
 * Returns mock data for a given URL + method, or null if no match.
 * When null is returned, the real HTTP request proceeds normally.
 */
export function getMockResponse(
  url: string,
  method: string,
  params?: Record<string, unknown>
): unknown | null {
  if (!IS_MOCK) return null;

  const normalizedMethod = method.toUpperCase();

  // ── Auth ──────────────────────────────────────────────────────────────────

  if (url === '/auth/me' && normalizedMethod === 'GET') {
    return mockAuthUser;
  }

  if (url === '/auth/login' && normalizedMethod === 'POST') {
    return { user: mockAuthUser, message: 'Login successful' };
  }

  if (url === '/auth/logout' && normalizedMethod === 'POST') {
    return { message: 'Logged out' };
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  if (url === '/dashboard/summary' && normalizedMethod === 'GET') {
    return mockDashboardSummary;
  }

  // ── Assets ────────────────────────────────────────────────────────────────

  if (url === '/assets' && normalizedMethod === 'GET') {
    let filtered = [...mockAssets];

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(q));
    }

    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter(a => a.type === params.type);
    }

    if (params?.brandId && params.brandId !== 'all') {
      filtered = filtered.filter(a => a.brandId === params.brandId);
    }

    return filtered;
  }

  // GET /assets/:id
  const assetByIdMatch = url.match(/^\/assets\/([^/]+)$/);
  if (assetByIdMatch && normalizedMethod === 'GET') {
    const id = assetByIdMatch[1];
    return mockAssets.find(a => a.id === id) ?? null;
  }

  // POST /assets/upload
  if (url === '/assets/upload' && normalizedMethod === 'POST') {
    return {
      id: `asset-${Date.now()}`,
      name: 'uploaded-file.jpg',
      type: 'image',
      category: 'graphic',
      status: 'ready',
      fileSize: 512000,
      mimeType: 'image/jpeg',
      url: '/mock/uploaded-file.jpg',
      organizationId: 'org-001',
      uploadedBy: 'user-002',
      tags: [],
      metadata: {},
      uploadedAt: new Date(),
      updatedAt: new Date()
    };
  }

  // DELETE /assets/:id
  if (url.match(/^\/assets\/[^/]+$/) && normalizedMethod === 'DELETE') {
    return { success: true };
  }

  // ── Brands ────────────────────────────────────────────────────────────────

  if (url === '/brands' && normalizedMethod === 'GET') {
    let filtered = [...mockBrands];

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        b =>
          b.name.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          (b.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (params?.status === 'active') {
      filtered = filtered.filter(b => b.isActive);
    } else if (params?.status === 'archived') {
      filtered = filtered.filter(b => !b.isActive);
    }

    return filtered;
  }

  // GET /brands/:id
  const brandByIdMatch = url.match(/^\/brands\/([^/]+)$/);
  if (brandByIdMatch && normalizedMethod === 'GET') {
    const id = brandByIdMatch[1];
    return mockBrands.find(b => b.id === id) ?? null;
  }

  // POST /brands — create
  if (url === '/brands' && normalizedMethod === 'POST') {
    return {
      id: `brand-${Date.now()}`,
      organizationId: 'org-001',
      clientId: 'client-mock',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // PATCH /brands/:id
  if (url.match(/^\/brands\/[^/]+$/) && normalizedMethod === 'PATCH') {
    const id = url.split('/')[2];
    const existing = mockBrands.find(b => b.id === id);
    return existing ? { ...existing, updatedAt: new Date() } : null;
  }

  // ── Components Registry ───────────────────────────────────────────────────

  if (url === '/components-registry' && normalizedMethod === 'GET') {
    let filtered = [...mockComponents];

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter(c => c.type === params.type);
    }

    return filtered;
  }

  // GET /components-registry/:id
  const componentByIdMatch = url.match(/^\/components-registry\/([^/]+)$/);
  if (componentByIdMatch && normalizedMethod === 'GET') {
    const id = componentByIdMatch[1];
    return mockComponents.find(c => c.id === id) ?? null;
  }

  // GET /components-registry/type/:type
  const componentByTypeMatch = url.match(
    /^\/components-registry\/type\/([^/]+)$/
  );
  if (componentByTypeMatch && normalizedMethod === 'GET') {
    const type = componentByTypeMatch[1];
    return mockComponents.filter(c => c.type === type);
  }

  // ── Projects ──────────────────────────────────────────────────────────────

  if (url === '/projects' && normalizedMethod === 'GET') {
    let filtered = [...mockProjects];

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(p => p.status === params.status);
    }

    if (params?.brandId && params.brandId !== 'all') {
      filtered = filtered.filter(p => p.brandId === params.brandId);
    }

    return filtered;
  }

  // GET /projects/:id
  const projectByIdMatch = url.match(/^\/projects\/([^/]+)$/);
  if (projectByIdMatch && normalizedMethod === 'GET') {
    const id = projectByIdMatch[1];
    return mockProjects.find(p => p.id === id) ?? null;
  }

  // POST /projects — create
  if (url === '/projects' && normalizedMethod === 'POST') {
    return {
      id: `project-${Date.now()}`,
      organizationId: 'org-001',
      ownerId: 'user-002',
      status: 'draft',
      visibility: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // PATCH /projects/:id
  if (url.match(/^\/projects\/[^/]+$/) && normalizedMethod === 'PATCH') {
    const id = url.split('/')[2];
    const existing = mockProjects.find(p => p.id === id);
    return existing ? { ...existing, updatedAt: new Date() } : null;
  }

  // PATCH /projects/:id/archive
  if (
    url.match(/^\/projects\/[^/]+\/archive$/) &&
    normalizedMethod === 'PATCH'
  ) {
    const id = url.split('/')[2];
    const existing = mockProjects.find(p => p.id === id);
    return existing
      ? { ...existing, status: 'archived', updatedAt: new Date() }
      : null;
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  if (url === '/users' && normalizedMethod === 'GET') {
    let filtered = [...mockUsers];

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (params?.role && params.role !== 'all') {
      filtered = filtered.filter(u => u.role === params.role);
    }

    if (params?.status === 'active') {
      filtered = filtered.filter(u => u.isActive);
    } else if (params?.status === 'inactive') {
      filtered = filtered.filter(u => !u.isActive);
    }

    return filtered;
  }

  // GET /users/:id
  const userByIdMatch = url.match(/^\/users\/([^/]+)$/);
  if (userByIdMatch && normalizedMethod === 'GET') {
    const id = userByIdMatch[1];
    return mockUsers.find(u => u.id === id) ?? null;
  }

  // POST /users/invite
  if (url === '/users/invite' && normalizedMethod === 'POST') {
    const body = params as
      | { email?: string; name?: string; role?: string }
      | undefined;
    const nameParts = (body?.name ?? 'New User').split(' ');
    const firstName = nameParts[0] ?? 'New';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    return {
      id: `user-${Date.now()}`,
      email: body?.email ?? '',
      name: body?.name ?? 'New User',
      firstName,
      lastName,
      role: body?.role ?? 'designer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // PATCH /users/:id/role
  const userRoleMatch = url.match(/^\/users\/([^/]+)\/role$/);
  if (userRoleMatch && normalizedMethod === 'PATCH') {
    const id = userRoleMatch[1];
    const existing = mockUsers.find(u => u.id === id);
    const body = params as { role?: string } | undefined;
    return existing
      ? {
          ...existing,
          role: body?.role ?? existing.role,
          updatedAt: new Date()
        }
      : null;
  }

  // PATCH /users/:id/deactivate
  const userDeactivateMatch = url.match(/^\/users\/([^/]+)\/deactivate$/);
  if (userDeactivateMatch && normalizedMethod === 'PATCH') {
    const id = userDeactivateMatch[1];
    const existing = mockUsers.find(u => u.id === id);
    return existing
      ? { ...existing, isActive: false, updatedAt: new Date() }
      : null;
  }

  // ── Data Engine (project-scoped) ──────────────────────────────────────────

  // GET /projects/:id/data-engine/sources
  const projectSourcesMatch = url.match(
    /^\/projects\/([^/]+)\/data-engine\/sources$/
  );
  if (projectSourcesMatch && normalizedMethod === 'GET') {
    const projectId = projectSourcesMatch[1];
    if (mockDataSource.projectId === projectId) {
      return [mockDataSource];
    }
    return [];
  }

  // POST /projects/:id/data-engine/sources (create data source)
  if (
    url.match(/^\/projects\/[^/]+\/data-engine\/sources$/) &&
    normalizedMethod === 'POST'
  ) {
    return {
      ...mockDataSource,
      id: `ds-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // GET /projects/:id/data-engine/sources/:sourceId
  const projectSourceByIdMatch = url.match(
    /^\/projects\/([^/]+)\/data-engine\/sources\/([^/]+)$/
  );
  if (projectSourceByIdMatch && normalizedMethod === 'GET') {
    return mockDataSource;
  }

  // POST /projects/:id/data-engine/sources/:sourceId/sync
  const projectSourceSyncMatch = url.match(
    /^\/projects\/[^/]+\/data-engine\/sources\/[^/]+\/sync$/
  );
  if (projectSourceSyncMatch && normalizedMethod === 'POST') {
    return {
      ...mockDataSource,
      lastSyncedAt: new Date(),
      lastSyncAt: new Date(),
      status: 'synced'
    };
  }

  // GET /projects/:id/data-engine/mappings
  const projectMappingsMatch = url.match(
    /^\/projects\/([^/]+)\/data-engine\/mappings$/
  );
  if (projectMappingsMatch && normalizedMethod === 'GET') {
    return mockColumnMappings;
  }

  // PUT /projects/:id/data-engine/mappings (save mappings)
  if (
    url.match(/^\/projects\/[^/]+\/data-engine\/mappings$/) &&
    normalizedMethod === 'PUT'
  ) {
    return params?.mappings ?? mockColumnMappings;
  }

  // POST /projects/:id/data-engine/auto-match
  const projectAutoMatchMatch = url.match(
    /^\/projects\/[^/]+\/data-engine\/auto-match$/
  );
  if (projectAutoMatchMatch && normalizedMethod === 'POST') {
    return mockAutoMatchSuggestions;
  }

  // GET /projects/:id/data-engine/rules
  const projectRulesMatch = url.match(
    /^\/projects\/([^/]+)\/data-engine\/rules$/
  );
  if (projectRulesMatch && normalizedMethod === 'GET') {
    return mockRules;
  }

  // PUT /projects/:id/data-engine/rules (save rules)
  if (
    url.match(/^\/projects\/[^/]+\/data-engine\/rules$/) &&
    normalizedMethod === 'PUT'
  ) {
    return params?.rules ?? mockRules;
  }

  // GET /projects/:id/data-engine/variations
  const projectVariationsMatch = url.match(
    /^\/projects\/([^/]+)\/data-engine\/variations$/
  );
  if (projectVariationsMatch && normalizedMethod === 'GET') {
    const page = Number(params?.page ?? 1);
    const pageSize = Number(params?.pageSize ?? 20);
    const search = params?.search ? String(params.search).toLowerCase() : '';
    const statusFilter = params?.status ?? 'all';

    let items = [...mockVariations];

    // Apply search filter
    if (search) {
      items = items.filter(v =>
        Object.values(v.rowData).some(
          val => val !== null && String(val).toLowerCase().includes(search)
        )
      );
    }

    // Apply status filter
    if (statusFilter === 'valid') {
      items = items.filter(v => v.errors.length === 0);
    } else if (statusFilter === 'errors') {
      items = items.filter(v => v.errors.length > 0);
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);

    return { items: paged, total, page, pageSize };
  }

  // GET /projects/:id/data-engine/variations/:index/props
  const projectVariationPropsMatch = url.match(
    /^\/projects\/[^/]+\/data-engine\/variations\/(\d+)\/props$/
  );
  if (projectVariationPropsMatch && normalizedMethod === 'GET') {
    const index = parseInt(projectVariationPropsMatch[1], 10);
    return mockVariations[index] ?? null;
  }

  // ── Render Jobs (project-scoped) ────────────────────────────────────────────

  // GET /projects/:id/render-jobs
  const projectRenderJobsMatch = url.match(
    /^\/projects\/([^/]+)\/render-jobs$/
  );
  if (projectRenderJobsMatch && normalizedMethod === 'GET') {
    const projectId = projectRenderJobsMatch[1];
    let filtered = mockRenderJobs.filter(j => j.projectId === projectId);

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(j => j.status === params.status);
    }

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(j => j.name.toLowerCase().includes(q));
    }

    return filtered;
  }

  // GET /render-jobs/:id
  const renderJobByIdMatch = url.match(/^\/render-jobs\/([^/]+)$/);
  if (renderJobByIdMatch && normalizedMethod === 'GET') {
    const id = renderJobByIdMatch[1];
    return mockRenderJobs.find(j => j.id === id) ?? null;
  }

  // GET /render-jobs/:id/progress
  const renderJobProgressMatch = url.match(
    /^\/render-jobs\/([^/]+)\/progress$/
  );
  if (renderJobProgressMatch && normalizedMethod === 'GET') {
    const id = renderJobProgressMatch[1];
    return mockRenderProgress[id] ?? null;
  }

  // GET /render-jobs/:id/outputs
  const renderJobOutputsMatch = url.match(
    /^\/render-jobs\/([^/]+)\/outputs$/
  );
  if (renderJobOutputsMatch && normalizedMethod === 'GET') {
    const jobId = renderJobOutputsMatch[1];
    return mockRenderOutputs.filter(o => o.jobId === jobId);
  }

  // POST /projects/:id/render-jobs/batch — create batch from variations
  const createBatchMatch = url.match(
    /^\/projects\/([^/]+)\/render-jobs\/batch$/
  );
  if (createBatchMatch && normalizedMethod === 'POST') {
    const projectId = createBatchMatch[1];
    const body = params as {
      name?: string;
      variationIndices?: number[];
      priority?: string;
    } | undefined;
    const count = body?.variationIndices?.length ?? 0;
    return {
      id: `rb-${Date.now()}`,
      name: body?.name ?? 'New Batch',
      projectId,
      organizationId: 'org-001',
      jobIds: Array.from({ length: count }, (_, i) => `rj-new-${i}`),
      status: 'pending',
      priority: body?.priority ?? 'normal',
      createdBy: 'user-002',
      createdAt: new Date().toISOString(),
      totalJobs: count,
      completedJobs: 0,
      failedJobs: 0,
    };
  }

  // POST /render-jobs/:id/cancel
  const cancelJobMatch = url.match(/^\/render-jobs\/([^/]+)\/cancel$/);
  if (cancelJobMatch && normalizedMethod === 'POST') {
    const id = cancelJobMatch[1];
    const existing = mockRenderJobs.find(j => j.id === id);
    return existing ? { ...existing, status: 'cancelled' } : null;
  }

  // POST /render-jobs/:id/retry
  const retryJobMatch = url.match(/^\/render-jobs\/([^/]+)\/retry$/);
  if (retryJobMatch && normalizedMethod === 'POST') {
    const id = retryJobMatch[1];
    const existing = mockRenderJobs.find(j => j.id === id);
    return existing
      ? { ...existing, status: 'queued', progress: 0 }
      : null;
  }

  // GET /projects/:id/render-batches
  const projectBatchesMatch = url.match(
    /^\/projects\/([^/]+)\/render-batches$/
  );
  if (projectBatchesMatch && normalizedMethod === 'GET') {
    const projectId = projectBatchesMatch[1];
    let filtered = mockRenderBatches.filter(b => b.projectId === projectId);

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(b => b.status === params.status);
    }

    if (params?.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(b => b.name.toLowerCase().includes(q));
    }

    return filtered;
  }

  // GET /projects/:id/render-batches/:batchId
  const batchByIdMatch = url.match(
    /^\/projects\/([^/]+)\/render-batches\/([^/]+)$/
  );
  if (batchByIdMatch && normalizedMethod === 'GET') {
    const batchId = batchByIdMatch[2];
    return mockRenderBatches.find(b => b.id === batchId) ?? null;
  }

  // POST /projects/:id/render-batches/:batchId/cancel
  const cancelBatchMatch = url.match(
    /^\/projects\/[^/]+\/render-batches\/([^/]+)\/cancel$/
  );
  if (cancelBatchMatch && normalizedMethod === 'POST') {
    const batchId = cancelBatchMatch[1];
    const existing = mockRenderBatches.find(b => b.id === batchId);
    return existing ? { ...existing, status: 'cancelled' } : null;
  }

  // POST /projects/:id/render-batches/:batchId/retry-failed
  const retryBatchMatch = url.match(
    /^\/projects\/[^/]+\/render-batches\/([^/]+)\/retry-failed$/
  );
  if (retryBatchMatch && normalizedMethod === 'POST') {
    const batchId = retryBatchMatch[1];
    const existing = mockRenderBatches.find(b => b.id === batchId);
    return existing
      ? { ...existing, status: 'processing', failedJobs: 0 }
      : null;
  }

  // No match — let the real request through
  return null;
}
