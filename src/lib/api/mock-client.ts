/**
 * OP Video Engine — Mock API Interceptor (SURGICAL)
 *
 * When NEXT_PUBLIC_USE_MOCKS=true, intercepts API calls ONLY for modules that do
 * NOT exist in the backend yet, and returns mock data. Everything else falls
 * through to the real NestJS backend.
 *
 * PRINCIPLE: mock ONLY what the backend hasn't built. As the backend implements a
 * module, delete its mock here. Two sources of truth for the same data = bug.
 *
 * Mocked here (NO backend controller as of 2026-06-10):
 *   - data-engine        (Module 3 — backend deferred)
 *   - components-registry (Module 2 — scaffold, lives in Remotion code only)
 *   - assets             (no backend module yet)
 *
 * NOT mocked (backend EXISTS — uses the real API): auth, brands, users, dashboard,
 * projects, uploads, templates, render-jobs (incl. render-single). Their mocks were
 * removed so the real JWT/data flows (the half-mock/half-real mix caused 401s).
 */

import { mockAssets } from './mocks/assets.mock';
import { mockComponents } from './mocks/components.mock';
import {
  mockAutoMatchSuggestions,
  mockColumnMappings,
  mockDataSource,
  mockRules,
  mockVariations
} from './mocks/data-engine.mock';

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

  // ── Assets (no backend module yet) ──────────────────────────────────────────

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

  // ── Components Registry (Module 2 — scaffold, no backend API) ────────────────

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

  // ── Data Engine (Module 3 — backend deferred, project-scoped) ────────────────

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

    if (search) {
      items = items.filter(v =>
        Object.values(v.rowData).some(
          val => val !== null && String(val).toLowerCase().includes(search)
        )
      );
    }

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

  // No match — let the real request through to the backend.
  return null;
}
