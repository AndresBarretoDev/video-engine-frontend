/**
 * OP Video Engine — API Endpoints
 *
 * Centralized endpoint constants for the NestJS API.
 * Matches the backend module structure from ARCHITECTURE.md.
 */

export const API_ENDPOINTS = {
  /* Auth Module */
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me'
  },

  /* Dashboard Module */
  dashboard: {
    summary: '/dashboard/summary'
  },

  /* Users Module */
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    byId: (id: string) => `/users/${id}`,
    profile: '/users/profile',
    invite: '/users/invite',
    updateRole: (id: string) => `/users/${id}/role`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
    reactivate: (id: string) => `/users/${id}/reactivate`
  },

  /* Projects Module */
  projects: {
    list: '/projects',
    byId: (id: string) => `/projects/${id}`,
    create: '/projects',
    update: (id: string) => `/projects/${id}`,
    archive: (id: string) => `/projects/${id}/archive`,
    reactivate: (id: string) => `/projects/${id}/reactivate`,
    settings: (id: string) => `/projects/${id}/settings`
  },

  /* Assets Module */
  assets: {
    list: '/assets',
    byId: (id: string) => `/assets/${id}`,
    upload: '/assets/upload',
    delete: (id: string) => `/assets/${id}`,
    byBrand: (brandId: string) => `/assets/brand/${brandId}`,
    folders: '/assets/folders'
  },

  /* Brands Module */
  brands: {
    list: '/brands',
    byId: (id: string) => `/brands/${id}`,
    create: '/brands',
    update: (id: string) => `/brands/${id}`,
    archive: (id: string) => `/brands/${id}/archive`,
    reactivate: (id: string) => `/brands/${id}/reactivate`,
    config: (id: string) => `/brands/${id}/config`,
    tokens: (id: string) => `/brands/${id}/tokens`
  },

  /* Components Registry Module */
  componentsRegistry: {
    list: '/components-registry',
    create: '/components-registry',
    byId: (id: string) => `/components-registry/${id}`,
    update: (id: string) => `/components-registry/${id}`,
    byType: (type: string) => `/components-registry/type/${type}`,
    schemas: (id: string) => `/components-registry/${id}/schema`
  },

  /* Data Engine Module */
  dataEngine: {
    // Legacy global endpoints (kept for backward compat)
    sources: '/data-engine/sources',
    sourceById: (id: string) => `/data-engine/sources/${id}`,
    mappings: (sourceId: string) => `/data-engine/sources/${sourceId}/mappings`,
    preview: (sourceId: string) => `/data-engine/sources/${sourceId}/preview`,
    import: '/data-engine/import',

    // Project-scoped endpoints
    projectSource: (projectId: string) =>
      `/projects/${projectId}/data-engine/sources`,
    projectSourceById: (projectId: string, sourceId: string) =>
      `/projects/${projectId}/data-engine/sources/${sourceId}`,
    projectSourceSync: (projectId: string, sourceId: string) =>
      `/projects/${projectId}/data-engine/sources/${sourceId}/sync`,
    projectSourcePreview: (projectId: string, sourceId: string) =>
      `/projects/${projectId}/data-engine/sources/${sourceId}/preview`,
    projectMappings: (projectId: string) =>
      `/projects/${projectId}/data-engine/mappings`,
    projectAutoMatch: (projectId: string) =>
      `/projects/${projectId}/data-engine/auto-match`,
    projectRules: (projectId: string) =>
      `/projects/${projectId}/data-engine/rules`,
    projectVariations: (projectId: string) =>
      `/projects/${projectId}/data-engine/variations`,
    projectVariationProps: (projectId: string, index: number) =>
      `/projects/${projectId}/data-engine/variations/${index}/props`
  },

  /* Render Jobs Module */
  renderJobs: {
    list: '/render-jobs',
    byId: (id: string) => `/render-jobs/${id}`,
    create: '/render-jobs',
    batch: '/render-jobs/batch',
    progress: (id: string) => `/render-jobs/${id}/progress`,
    cancel: (id: string) => `/render-jobs/${id}/cancel`,
    retry: (id: string) => `/render-jobs/${id}/retry`,
    // Project-scoped
    byProject: (projectId: string) => `/projects/${projectId}/render-jobs`,
    batchByProject: (projectId: string) =>
      `/projects/${projectId}/render-jobs/batch`,
    batches: (projectId: string) => `/projects/${projectId}/render-batches`,
    batchById: (projectId: string, batchId: string) =>
      `/projects/${projectId}/render-batches/${batchId}`,
    batchCancel: (projectId: string, batchId: string) =>
      `/projects/${projectId}/render-batches/${batchId}/cancel`,
    batchRetryFailed: (projectId: string, batchId: string) =>
      `/projects/${projectId}/render-batches/${batchId}/retry-failed`,
    outputs: (jobId: string) => `/render-jobs/${jobId}/outputs`,
    download: (outputId: string) => `/render-jobs/outputs/${outputId}/download`,
    batchDownload: (batchId: string) => `/render-batches/${batchId}/download`
  },

  /* Reviews Module */
  reviews: {
    list: '/reviews',
    byId: (id: string) => `/reviews/${id}`,
    byJob: (jobId: string) => `/reviews/job/${jobId}`,
    approve: (id: string) => `/reviews/${id}/approve`,
    reject: (id: string) => `/reviews/${id}/reject`,
    comments: (id: string) => `/reviews/${id}/comments`
  },

  /* Uploads Module */
  uploads: {
    upload: '/uploads'
  },

  /* Templates Module — backend task 3.1 (not yet implemented) */
  templates: {
    list: '/templates',
    byId: (id: string) => `/templates/${id}`
  },

  /* Video Generation Module — single-product golden path (D9, backend task 2.6) */
  videoGeneration: {
    /**
     * BACKEND CONTRACT (task 2.6):
     *   POST /projects/:projectId/render-single
     *   Body   : CreateSingleProductRenderDto
     *   Response: { jobIds: string[]; totalJobs: number }
     *   Behavior: Creates N render jobs (one per format selected).
     *   NOT the batch endpoint — dedicated single-product entry point.
     */
    renderSingle: (projectId: string) => `/projects/${projectId}/render-single`
  }
} as const;
