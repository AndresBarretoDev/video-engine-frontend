'use client';

/**
 * OP Video Engine — Data Engine Zustand Store
 *
 * UI state ONLY — no server state here.
 * React Query handles all server data (sources, mappings, rules, variations).
 *
 * State managed here:
 * - CSV file + parsed data (before backend save)
 * - Mapping draft (unsaved changes)
 * - Rules draft (unsaved changes)
 * - Variation selection
 */

import { create } from 'zustand';

import type {
  CsvParseResult,
  MappingDraftEntry,
  ConditionalRuleDraft,
  ParsedColumn
} from '../types';

// ─── Store state interface ────────────────────────────────────────────────────

interface DataEngineStore {
  // CSV parsing state
  csvFile: File | null;
  parsedData: CsvParseResult | null;
  parsedRows: Record<string, unknown>[];
  parsedColumns: ParsedColumn[];
  parseStatus: 'idle' | 'parsing' | 'done' | 'error';
  parseError: string | null;

  // Mapping draft (unsaved changes)
  mappingDraft: MappingDraftEntry[];
  mappingIsDirty: boolean;

  // Rules draft (unsaved changes)
  rulesDraft: ConditionalRuleDraft[];
  rulesIsDirty: boolean;

  // Variation selection (tracked by row index)
  selectedVariations: Set<number>;

  // Actions — CSV
  setCsvFile: (file: File | null) => void;
  setParsedData: (result: CsvParseResult) => void;
  setParseStatus: (
    status: 'idle' | 'parsing' | 'done' | 'error',
    error?: string
  ) => void;
  clearParsedFile: () => void;

  // Actions — Mappings
  setMappingDraft: (draft: MappingDraftEntry[]) => void;
  updateMappingEntry: (entry: MappingDraftEntry) => void;
  removeMappingEntry: (id: string) => void;
  markMappingClean: () => void;

  // Actions — Rules
  setRulesDraft: (rules: ConditionalRuleDraft[]) => void;
  addRuleDraft: (rule: ConditionalRuleDraft) => void;
  updateRuleDraft: (rule: ConditionalRuleDraft) => void;
  removeRuleDraft: (id: string) => void;
  reorderRulesDraft: (rules: ConditionalRuleDraft[]) => void;
  markRulesClean: () => void;

  // Actions — Variation selection
  toggleVariation: (index: number) => void;
  selectAll: (indices: number[]) => void;
  deselectAll: (indices: number[]) => void;
  clearAll: () => void;
}

// ─── Store implementation ─────────────────────────────────────────────────────

export const useDataEngineStore = create<DataEngineStore>(set => ({
  // ── Initial state ──────────────────────────────────────────────────────────

  csvFile: null,
  parsedData: null,
  parsedRows: [],
  parsedColumns: [],
  parseStatus: 'idle',
  parseError: null,

  mappingDraft: [],
  mappingIsDirty: false,

  rulesDraft: [],
  rulesIsDirty: false,

  selectedVariations: new Set<number>(),

  // ── CSV actions ────────────────────────────────────────────────────────────

  setCsvFile: file =>
    set({
      csvFile: file,
      parsedData: null,
      parsedRows: [],
      parsedColumns: [],
      parseStatus: 'idle',
      parseError: null
    }),

  setParsedData: result =>
    set({
      parsedData: result,
      parsedRows: result.rows.map(row =>
        result.headers.reduce<Record<string, unknown>>((acc, header, idx) => {
          acc[header] = row[idx] ?? null;
          return acc;
        }, {})
      ),
      parsedColumns: result.columns,
      parseStatus: 'done',
      parseError: null
    }),

  setParseStatus: (status, error) =>
    set({
      parseStatus: status,
      parseError: error ?? null
    }),

  clearParsedFile: () =>
    set({
      csvFile: null,
      parsedData: null,
      parsedRows: [],
      parsedColumns: [],
      parseStatus: 'idle',
      parseError: null
    }),

  // ── Mapping actions ────────────────────────────────────────────────────────

  setMappingDraft: draft =>
    set({
      mappingDraft: draft,
      mappingIsDirty: true
    }),

  updateMappingEntry: entry =>
    set(state => {
      const exists = state.mappingDraft.find(m => m.id === entry.id);
      return {
        mappingDraft: exists
          ? state.mappingDraft.map(m => (m.id === entry.id ? entry : m))
          : [...state.mappingDraft, entry],
        mappingIsDirty: true
      };
    }),

  removeMappingEntry: id =>
    set(state => ({
      mappingDraft: state.mappingDraft.filter(m => m.id !== id),
      mappingIsDirty: true
    })),

  markMappingClean: () => set({ mappingIsDirty: false }),

  // ── Rules actions ──────────────────────────────────────────────────────────

  setRulesDraft: rules =>
    set({
      rulesDraft: rules,
      rulesIsDirty: true
    }),

  addRuleDraft: rule =>
    set(state => ({
      rulesDraft: [...state.rulesDraft, rule],
      rulesIsDirty: true
    })),

  updateRuleDraft: rule =>
    set(state => ({
      rulesDraft: state.rulesDraft.map(r => (r.id === rule.id ? rule : r)),
      rulesIsDirty: true
    })),

  removeRuleDraft: id =>
    set(state => ({
      rulesDraft: state.rulesDraft.filter(r => r.id !== id),
      rulesIsDirty: true
    })),

  reorderRulesDraft: rules =>
    set({
      rulesDraft: rules,
      rulesIsDirty: true
    }),

  markRulesClean: () => set({ rulesIsDirty: false }),

  // ── Variation selection actions ────────────────────────────────────────────

  toggleVariation: index =>
    set(state => {
      const next = new Set(state.selectedVariations);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return { selectedVariations: next };
    }),

  selectAll: indices =>
    set(state => {
      const next = new Set(state.selectedVariations);
      indices.forEach(i => next.add(i));
      return { selectedVariations: next };
    }),

  deselectAll: indices =>
    set(state => {
      const next = new Set(state.selectedVariations);
      indices.forEach(i => next.delete(i));
      return { selectedVariations: next };
    }),

  clearAll: () => set({ selectedVariations: new Set<number>() })
}));
