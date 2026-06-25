/**
 * useRenderProgressPolling — polls render job progress.
 *
 * Reuses existing `useRenderProgress` from render-jobs domain.
 * Design ref: design.md §D5 — "Progreso por polling GET /render-jobs/:id/progress"
 * Does NOT recreate the endpoint — it is already in API_ENDPOINTS.renderJobs.progress.
 */

import { useRenderProgress } from '@/domains/render-jobs/hooks/use-render-jobs';
import type { RenderProgress } from '@/domains/render-jobs/types';

export { useRenderProgress };
export type { RenderProgress };
