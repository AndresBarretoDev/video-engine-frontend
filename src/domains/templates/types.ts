/**
 * OP Video Engine — Templates Domain Types
 *
 * TemplateDescriptor is the cross-repo contract between frontend and backend.
 * This shape MUST match exactly what GET /templates returns (backend task 3.1).
 *
 * Contract version: v1 (2026-06-09)
 * Backend TODO: Implement GET /templates returning TemplateDescriptor[] — see design.md §Interfaces/Contracts
 */

import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Video composition reference ─────────────────────────────────────────────

/**
 * Links a template format variant to its Remotion composition.
 * compositionId MUST match the id registered in src/remotion/index.tsx.
 */
export interface TemplateCompositionRef {
  format: VideoFormat;
  compositionId: string;
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
}

// ─── Core descriptor (= backend contract) ────────────────────────────────────

/**
 * TemplateDescriptor — the canonical shape served by GET /templates.
 *
 * BACKEND CONTRACT (task 3.1):
 *   GET /templates → TemplateDescriptor[]
 *   Each descriptor has exactly these fields; backend must not add/remove.
 *
 * Frontend uses this type directly; no mapping layer needed.
 */
export interface TemplateDescriptor {
  id: string;
  name: string;
  description: string;
  /** Remotion organism component identifier, e.g. "LoopingProductPromo" */
  componentId: string;
  /** Available format variants for this template */
  formats: TemplateCompositionRef[];
  /** Thumbnail URL for static preview (used as fallback before live player mounts) */
  thumbnailUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

export type TemplateId = string;
