# Phase 4: Rendering Pipeline — Frontend SDD Plan

**Phase:** 4 — Rendering Pipeline
**Date:** 2026-04-11
**Status:** Planning
**Branch:** feat/phase-4
**Constraint:** Everything LOCAL for MVP (Redis local, Remotion CLI render, local file storage). No cloud costs.

---

## Scope

Frontend implementation for the rendering pipeline. The backend (NestJS) handles BullMQ queues, Remotion CLI rendering, and local file storage. This plan covers ONLY the frontend: hooks, mock data, components, pages, and integration with the existing Data Engine "Send to Render" flow.

## What Already Exists

| Artifact | Status | Location |
|----------|--------|----------|
| Types (9 interfaces) | Complete | `src/domains/render-jobs/types.ts` |
| Zod schemas | Complete | `src/domains/render-jobs/schema.ts` |
| Text-maps (116+ strings) | Complete | `src/domains/render-jobs/text-maps.ts` |
| API endpoints (7) | Complete | `src/lib/api/endpoints.ts` → `renderJobs` |
| "Send to Render" button | Placeholder toast | `src/domains/data-engine/components/selection-bar.tsx` |
| Empty directories | Ready | `hooks/`, `stores/`, `components/` |

## What Needs Building

### API Endpoints — Additions Needed

The current `API_ENDPOINTS.renderJobs` needs project-scoped batch endpoints:

```typescript
renderJobs: {
  // existing
  list: '/render-jobs',
  byId: (id: string) => `/render-jobs/${id}`,
  create: '/render-jobs',
  batch: '/render-jobs/batch',
  progress: (id: string) => `/render-jobs/${id}/progress`,
  cancel: (id: string) => `/render-jobs/${id}/cancel`,
  retry: (id: string) => `/render-jobs/${id}/retry`,
  // NEW — project-scoped
  byProject: (projectId: string) => `/projects/${projectId}/render-jobs`,
  batchByProject: (projectId: string) => `/projects/${projectId}/render-jobs/batch`,
  batches: (projectId: string) => `/projects/${projectId}/render-batches`,
  batchById: (projectId: string, batchId: string) => `/projects/${projectId}/render-batches/${batchId}`,
  batchCancel: (projectId: string, batchId: string) => `/projects/${projectId}/render-batches/${batchId}/cancel`,
  batchRetryFailed: (projectId: string, batchId: string) => `/projects/${projectId}/render-batches/${batchId}/retry-failed`,
  outputs: (jobId: string) => `/render-jobs/${jobId}/outputs`,
  download: (outputId: string) => `/render-jobs/outputs/${outputId}/download`,
  batchDownload: (batchId: string) => `/render-batches/${batchId}/download`,
}
```

---

## Implementation Groups

### Group 1: Foundation (Hooks + Query Keys + Mock Data)

**Files to create:**

1. **`src/domains/render-jobs/hooks/query-keys.ts`**
   - Pattern: follows `dataEngineKeys` style (project-scoped)
   - Keys: `all`, `lists`, `list`, `detail`, `progress`, `batches`, `batchDetail`, `outputs`

2. **`src/domains/render-jobs/hooks/use-render-jobs.ts`**
   - `useRenderJobs(projectId, filters?)` — list jobs for a project, staleTime 30s
   - `useRenderJob(jobId)` — single job detail
   - `useRenderProgress(jobId, enabled?)` — progress polling, refetchInterval 3s when enabled
   - `useCreateRenderBatch()` — mutation: creates batch from variation indices
   - `useCancelRenderJob()` — mutation: cancel a single job
   - `useRetryRenderJob()` — mutation: retry a failed job

3. **`src/domains/render-jobs/hooks/use-render-batches.ts`**
   - `useRenderBatches(projectId)` — list batches for a project
   - `useRenderBatch(projectId, batchId)` — single batch detail
   - `useCancelRenderBatch()` — mutation: cancel entire batch
   - `useRetryFailedInBatch()` — mutation: retry all failed jobs in batch

4. **`src/lib/api/mocks/render-jobs.mock.ts`**
   - Mock data: 2 batches, 8 render jobs (mixed statuses), 3 outputs
   - Realistic progress values, timestamps, file sizes

5. **Mock handlers in `src/lib/api/mock-client.ts`**
   - GET `/projects/:id/render-jobs` — list jobs by project
   - GET `/render-jobs/:id` — job detail
   - GET `/render-jobs/:id/progress` — progress (simulated advancing)
   - POST `/render-jobs/batch` — create batch (returns mock batch)
   - POST `/render-jobs/:id/cancel` — cancel job
   - POST `/render-jobs/:id/retry` — retry job
   - GET `/projects/:id/render-batches` — list batches
   - GET `/projects/:id/render-batches/:id` — batch detail

6. **Update `src/lib/api/endpoints.ts`** — add project-scoped endpoints

**Depends on:** Nothing
**Acceptance:** All hooks importable, mock data returns correctly with NEXT_PUBLIC_USE_MOCKS=true

---

### Group 2: Integration — Wire "Send to Render"

**Files to modify:**

1. **`src/domains/data-engine/components/selection-bar.tsx`**
   - Replace toast placeholder with real flow
   - Add `projectId` prop (needed for batch creation)
   - Add `selectedVariationIndices` prop (actual indices, not just count)
   - Call `useCreateRenderBatch()` on click
   - Show confirmation dialog before sending (batch name + priority selector)
   - On success: toast + optional navigate to render dashboard

2. **`src/domains/data-engine/components/send-to-render-dialog.tsx`** (NEW)
   - Confirmation dialog: batch name (auto-generated default), priority select, variation count summary
   - Uses `CreateRenderBatchInput` schema for validation
   - Submit calls the mutation

**Files to update props/types if needed:**
- `variation-grid.tsx` — pass `selectedVariationIndices` (not just count) to SelectionBar
- `preview-tab.tsx` — thread `projectId` through

**Depends on:** Group 1
**Acceptance:** Clicking "Send to Render" opens dialog, submitting creates batch via API, success toast shows

---

### Group 3: Render Dashboard Page

**Files to create:**

1. **`src/app/(dashboard)/projects/[id]/render/page.tsx`** — Server Component
   - Route: `/projects/:id/render`
   - Renders `RenderDashboard` client component

2. **`src/app/(dashboard)/projects/[id]/render/loading.tsx`** — PageSkeleton variant

3. **`src/domains/render-jobs/components/render-dashboard.tsx`** — Main client component
   - Batch list with aggregate progress
   - Filter: status (all/processing/completed/failed), search by name
   - Sort: newest first (default), priority
   - Empty state when no batches

4. **`src/domains/render-jobs/components/batch-card.tsx`**
   - Shows: batch name, status badge, progress bar (aggregate), job counts (total/completed/failed)
   - Created date, priority badge
   - Click → expands or navigates to batch detail
   - Actions: Cancel batch, Retry failed, Download all (when complete)

5. **`src/domains/render-jobs/components/render-status-badge.tsx`**
   - Reusable badge: maps RenderJobStatus → color + icon + label
   - Uses status CSS tokens (--status-*)
   - Also handles batch status

6. **Navigation: add "Render" link to project-card.tsx dropdown** (same pattern as Data Engine link)

**Depends on:** Group 1
**Acceptance:** Page loads at /projects/:id/render, shows batch cards with mock data, empty state works

---

### Group 4: Batch Detail View

**Files to create:**

1. **`src/domains/render-jobs/components/batch-detail-view.tsx`** — Main view
   - Batch header: name, status, aggregate progress bar, created/started/completed dates
   - Actions bar: Cancel All, Retry Failed, Download All (ZIP)
   - Job grid below

2. **`src/domains/render-jobs/components/render-job-card.tsx`**
   - Individual job card in the grid
   - Shows: job name (variation reference), status badge, progress bar, frame count
   - Duration (estimated vs actual), speed (fps)
   - Actions: Cancel, Retry (if failed), Download (if complete)
   - Error indicator with tooltip (if failed)

3. **`src/domains/render-jobs/components/render-progress-bar.tsx`**
   - Wraps shadcn Progress with render-specific features
   - Shows percentage, frame count text, ETA
   - Color changes by status (blue=processing, green=complete, red=failed)
   - Animated pulse when processing

4. **`src/domains/render-jobs/components/batch-actions-bar.tsx`**
   - Action buttons: Cancel Batch, Retry Failed, Download All
   - Enabled/disabled based on batch status
   - Confirmation dialogs for destructive actions

**Depends on:** Group 3
**Acceptance:** Clicking a batch shows detail with individual job cards, progress updates via polling

---

### Group 5: Job Detail Drawer + Output Downloads

**Files to create:**

1. **`src/domains/render-jobs/components/render-job-drawer.tsx`**
   - shadcn Sheet (right side, like variation-detail-drawer)
   - Sections: Status, Configuration, Progress, Output, Logs, Errors
   - Real-time progress polling when job is processing
   - Log viewer (scrollable, auto-scroll to bottom)
   - Error display with stack trace accordion (if failed)

2. **`src/domains/render-jobs/components/render-output-card.tsx`**
   - Shows completed output: format, resolution, file size, duration
   - Download button, preview thumbnail (if available)
   - Copy download URL

3. **`src/domains/render-jobs/components/render-log-viewer.tsx`**
   - Scrollable log container with monospace text
   - Auto-scroll toggle
   - Color-coded entries (info/warn/error)

**Depends on:** Group 4
**Acceptance:** Clicking a job opens drawer with full detail, logs stream, download works for completed jobs

---

### Group 6: Polish + Text-maps Audit + Type-check

1. **Audit all new components against text-maps** — zero hardcoded strings
2. **Audit all CSS against design tokens** — zero hardcoded colors/spacing/radius
3. **Run `npx tsc --noEmit`** — zero type errors
4. **Update `src/domains/render-jobs/text-maps.ts`** if new strings needed
5. **Update `src/domains/render-jobs/schema.ts`** if new validation needed (e.g., batch creation from selection-bar needs `variationIndices` field)

**Depends on:** Groups 1-5
**Acceptance:** Zero type errors, zero hardcoded strings, zero hardcoded CSS values

---

## Schema Additions Needed

The current `createRenderBatchSchema` expects `jobIds` but we actually need to create from variation indices. Add:

```typescript
export const createRenderBatchFromVariationsSchema = z.object({
  name: z.string().min(1).max(255),
  projectId: z.string().uuid(),
  variationIndices: z.array(z.number().int().nonnegative()).min(1).max(500),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  outputFormat: z.enum(['mp4', 'webm', 'mov', 'prores', 'h264', 'png-sequence']).default('mp4'),
});
```

## Types Additions Needed

Add to types.ts:

```typescript
export interface RenderJobFilters {
  status?: RenderJobStatus | 'all';
  search?: string;
  priority?: RenderPriority | 'all';
  sort?: 'newest' | 'priority' | 'status';
  page?: number;
  pageSize?: number;
}

export interface RenderBatchFilters {
  status?: RenderBatch['status'] | 'all';
  search?: string;
}
```

## Navigation

Add to project card dropdown (existing pattern):
- "Render Jobs" → `/projects/:id/render`
- Icon: `Play` from lucide-react (or `Film`)

## Real-time Strategy

**MVP**: React Query polling with `refetchInterval`:
- Batch list: 10s when any batch is `processing`, disabled otherwise
- Job progress: 3s when job is `processing`, disabled otherwise
- Use `enabled` flag to start/stop polling based on status

**Future (post-MVP)**: SSE or WebSocket from NestJS for push updates.

## State Management

- **Server state (React Query)**: All render jobs, batches, progress, outputs
- **UI state (local)**: Selected batch for detail view, expanded job cards, filter/sort selections
- **NO Zustand store** unless we need cross-component UI state (unlikely for this phase)

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Mock data doesn't match real backend shape | Types already defined + Zod schemas validate |
| Polling too aggressive | Conditional refetchInterval only when processing |
| Large batch (500 jobs) renders slow | Virtual scroll / paginate job grid |
| Type drift between schema.ts and types.ts | Schema infers types with `z.infer<>` |

---

## Order of Execution

```
Group 1 (Foundation) → Group 2 (Wire Send to Render) → Group 3 (Dashboard Page)
                                                          ↓
                                                      Group 4 (Batch Detail)
                                                          ↓
                                                      Group 5 (Job Drawer + Downloads)
                                                          ↓
                                                      Group 6 (Polish + Audit)
```

Total estimated files: ~18 new, ~5 modified
