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

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface RenderJobEntry {
  jobId: string;
  format: VideoFormat;
}

/** A completed render output, reported by each card when its job finishes.
 *  Keyed by jobId so "Download All" can collect every ready file at once. */
export interface ReadyOutput {
  url: string;
  format: VideoFormat;
}

// ─── Store state interface ────────────────────────────────────────────────────

interface VideoGenerationStore {
  // Active format for the preview player
  activeFormat: VideoFormat;

  // Mobile preview sheet open/closed
  isMobilePreviewOpen: boolean;

  // Debounced form snapshot — updated 400ms after form changes.
  formSnapshot: FieldValues | null;

  // Selected brand id for the preview, or null for the template's default preset.
  selectedBrandId: string | null;

  // Formats selected for rendering (checkboxes). Min 1 required.
  selectedFormats: VideoFormat[];

  // Results sheet visibility (opens when render is triggered).
  isResultsSheetOpen: boolean;

  // Render jobs created this session — jobId + format pairs for the results sheet.
  renderJobEntries: RenderJobEntry[];

  // Ready outputs reported by each card on completion, keyed by jobId.
  // Powers the "Download All" action in the results sheet.
  readyOutputs: Record<string, ReadyOutput>;

  // Actions
  setActiveFormat: (format: VideoFormat) => void;
  setMobilePreviewOpen: (open: boolean) => void;
  toggleMobilePreview: () => void;
  setFormSnapshot: (values: FieldValues) => void;
  setSelectedBrandId: (brandId: string | null) => void;
  setSelectedFormats: (formats: VideoFormat[]) => void;
  setResultsSheetOpen: (open: boolean) => void;
  addRenderJobEntries: (entries: RenderJobEntry[]) => void;
  setReadyOutput: (jobId: string, output: ReadyOutput) => void;
  clearRenderJobEntries: () => void;
  resetEditor: () => void;
}

// ─── Store implementation ─────────────────────────────────────────────────────

export const useVideoGenerationStore = create<VideoGenerationStore>(set => ({
  // ── Initial state ──────────────────────────────────────────────────────────

  activeFormat: '16:9',
  isMobilePreviewOpen: false,
  formSnapshot: null,
  selectedBrandId: null,
  selectedFormats: ['16:9'],
  isResultsSheetOpen: false,
  renderJobEntries: [],
  readyOutputs: {},

  // ── Actions ────────────────────────────────────────────────────────────────

  setActiveFormat: format => set({ activeFormat: format }),

  setMobilePreviewOpen: open => set({ isMobilePreviewOpen: open }),

  toggleMobilePreview: () =>
    set(state => ({ isMobilePreviewOpen: !state.isMobilePreviewOpen })),

  setFormSnapshot: values => set({ formSnapshot: values }),

  setSelectedBrandId: brandId => set({ selectedBrandId: brandId }),

  setSelectedFormats: formats => set({ selectedFormats: formats }),

  setResultsSheetOpen: open => set({ isResultsSheetOpen: open }),

  addRenderJobEntries: entries =>
    set(state => ({ renderJobEntries: [...state.renderJobEntries, ...entries] })),

  setReadyOutput: (jobId, output) =>
    set(state => ({ readyOutputs: { ...state.readyOutputs, [jobId]: output } })),

  clearRenderJobEntries: () => set({ renderJobEntries: [], readyOutputs: {} }),

  resetEditor: () =>
    set({
      activeFormat: '16:9',
      isMobilePreviewOpen: false,
      formSnapshot: null,
      selectedBrandId: null,
      selectedFormats: ['16:9'],
      isResultsSheetOpen: false,
      renderJobEntries: [],
      readyOutputs: {},
    })
}));
