'use client';

/**
 * OP Video Engine — Video Generation Zustand Store
 *
 * UI state ONLY — no server state here.
 * React Query handles server state (render job status, progress).
 *
 * State managed here:
 * - Active preview format (tab selection)
 * - Mobile preview sheet visibility
 * - Debounced form snapshot (for @remotion/player inputProps)
 *
 * The form snapshot is template-agnostic: it holds whatever the active template's
 * form produces (ProductFormValues, StayFormValues, …). The authoring view casts
 * it back to the concrete shape via the template authoring registry. Keeping it
 * generic here lets one store serve every template without per-template coupling.
 *
 * Intentionally minimal: the form state lives in React Hook Form (RHF).
 * This store only holds DERIVED/UI state that needs to cross component boundaries.
 */

import { create } from 'zustand';
import type { FieldValues } from 'react-hook-form';
import type { VideoFormat } from '@/remotion/types/video-format.types';

// ─── Store state interface ────────────────────────────────────────────────────

interface VideoGenerationStore {
  // Active format for the preview player
  activeFormat: VideoFormat;

  // Mobile preview sheet open/closed
  isMobilePreviewOpen: boolean;

  // Debounced form snapshot — updated 400ms after form changes.
  // Template-agnostic: this is what the Remotion player renders. Null until the
  // first form change (the view falls back to the template's default values).
  formSnapshot: FieldValues | null;

  // Actions
  setActiveFormat: (format: VideoFormat) => void;
  setMobilePreviewOpen: (open: boolean) => void;
  toggleMobilePreview: () => void;
  setFormSnapshot: (values: FieldValues) => void;
  resetEditor: () => void;
}

// ─── Store implementation ─────────────────────────────────────────────────────

export const useVideoGenerationStore = create<VideoGenerationStore>(set => ({
  // ── Initial state ──────────────────────────────────────────────────────────

  activeFormat: '16:9',
  isMobilePreviewOpen: false,
  formSnapshot: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  setActiveFormat: format => set({ activeFormat: format }),

  setMobilePreviewOpen: open => set({ isMobilePreviewOpen: open }),

  toggleMobilePreview: () =>
    set(state => ({ isMobilePreviewOpen: !state.isMobilePreviewOpen })),

  setFormSnapshot: values => set({ formSnapshot: values }),

  resetEditor: () =>
    set({
      activeFormat: '16:9',
      isMobilePreviewOpen: false,
      formSnapshot: null
    })
}));
