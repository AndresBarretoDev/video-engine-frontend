'use client';

/**
 * OP Video Engine — Mapping Tab
 *
 * Assembles AutoMatchBanner + list of MappingRow + UnmappedColumnsAlert + Save button.
 * Reads column data from Zustand (parsed CSV) or from server (existing data source).
 * Spec: SPEC-DE-004, SPEC-DE-005
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useDataEngineStore } from '../stores/data-engine-store';
import { useMappings, useSaveMappings } from '../hooks/use-mappings';
import { autoMatchColumns } from '../utils/auto-match';
import { AutoMatchBanner } from './auto-match-banner';
import { MappingRow } from './mapping-row';
import { TransformationDrawer } from './transformation-drawer';
import { UnmappedColumnsAlert } from './unmapped-columns-alert';
import { dataEngineTextMaps } from '../text-maps';
import type {
  AutoMatchSuggestion,
  DataSource,
  MappingDraftEntry,
  ParsedColumn,
  TemplatePropDefinition
} from '../types';

// ─── Mock template props ──────────────────────────────────────────────────────
// In production this comes from GET /components-registry/:templateId/schema

const MOCK_TEMPLATE_PROPS: TemplatePropDefinition[] = [
  {
    path: 'productOverlay.productName',
    type: 'string',
    label: 'Product Name',
    required: true
  },
  { path: 'pricePatch.price', type: 'number', label: 'Price', required: true },
  {
    path: 'pricePatch.originalPrice',
    type: 'number',
    label: 'Original Price',
    required: false
  },
  {
    path: 'imageFrame.src',
    type: 'image',
    label: 'Product Image',
    required: true
  },
  {
    path: 'productOverlay.description',
    type: 'string',
    label: 'Description',
    required: false
  },
  { path: 'badge.show', type: 'boolean', label: 'Show Badge', required: false },
  { path: 'badge.label', type: 'string', label: 'Badge Label', required: false }
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface MappingTabProps {
  projectId: string;
  dataSource?: DataSource | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `mapping-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MappingTab({ projectId, dataSource }: MappingTabProps) {
  const router = useRouter();

  // Zustand store
  const {
    parsedColumns,
    mappingDraft,
    mappingIsDirty,
    setMappingDraft,
    updateMappingEntry,
    removeMappingEntry,
    markMappingClean
  } = useDataEngineStore();

  // Server state
  const { data: savedMappings, isLoading: mappingsLoading } =
    useMappings(projectId);
  const saveMappings = useSaveMappings(projectId);

  // Local UI state
  const [autoMatchSuggestions, setAutoMatchSuggestions] = useState<
    AutoMatchSuggestion[]
  >([]);
  const [autoMatchDismissed, setAutoMatchDismissed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<MappingDraftEntry | null>(
    null
  );

  // Derive columns: prefer parsed CSV, fallback to server columns
  const columns: ParsedColumn[] =
    parsedColumns.length > 0
      ? parsedColumns
      : (dataSource?.columns ?? []).map(col => ({
          name: col.columnName ?? col.name,
          index: col.columnIndex ?? 0,
          type: (col.type as ParsedColumn['type']) ?? 'string',
          sampleValues: col.sampleValues.map(String),
          isEmpty: col.sampleValues.length === 0
        }));

  // Initialize mapping draft from server data if draft is empty
  useEffect(() => {
    if (
      savedMappings &&
      savedMappings.length > 0 &&
      mappingDraft.length === 0
    ) {
      const draft: MappingDraftEntry[] = savedMappings.map(m => ({
        id: m.id,
        columnName: m.columnName,
        propPath: m.propPath,
        transform: m.transform
      }));
      setMappingDraft(draft);
      markMappingClean();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMappings]);

  // Run auto-match when columns change
  useEffect(() => {
    if (columns.length > 0 && mappingDraft.length === 0) {
      const suggestions = autoMatchColumns(
        columns,
        MOCK_TEMPLATE_PROPS.map(p => p.path)
      );
      setAutoMatchSuggestions(suggestions);
      setAutoMatchDismissed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleApplyAutoMatch() {
    const newEntries: MappingDraftEntry[] = autoMatchSuggestions.map(s => ({
      id: generateId(),
      columnName: s.columnName,
      propPath: s.propPath,
      transform: undefined
    }));
    setMappingDraft(newEntries);
    setAutoMatchDismissed(true);
    setAutoMatchSuggestions([]);
  }

  function handleAddMapping() {
    if (columns.length === 0) return;
    const firstUnmapped = columns.find(
      col => !mappingDraft.some(m => m.columnName === col.name)
    );
    updateMappingEntry({
      id: generateId(),
      columnName: firstUnmapped?.name ?? columns[0]?.name ?? '',
      propPath: ''
    });
  }

  function handleConfigureTransform(entry: MappingDraftEntry) {
    setActiveEntry(entry);
    setDrawerOpen(true);
  }

  function handleSaveTransform(updated: MappingDraftEntry) {
    updateMappingEntry(updated);
  }

  function handleSaveMappings() {
    if (!dataSource?.id) return;
    saveMappings.mutate(
      {
        dataSourceId: dataSource.id,
        mappings: mappingDraft.map(m => ({
          id: m.id,
          columnName: m.columnName,
          propPath: m.propPath,
          transform: m.transform
        }))
      },
      {
        onSuccess: () => {
          markMappingClean();
        }
      }
    );
  }

  function handleContinue() {
    router.push(`/projects/${projectId}/data?tab=rules`);
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const mappedColumnNames = new Set(mappingDraft.map(m => m.columnName));
  const unmappedColumns = columns
    .filter(col => !mappedColumnNames.has(col.name))
    .map(col => col.name);

  const showAutoMatchBanner =
    autoMatchSuggestions.length > 0 && !autoMatchDismissed;

  // ── Render ────────────────────────────────────────────────────────────────

  if (mappingsLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-[var(--radius-8)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Auto-match banner */}
      {showAutoMatchBanner && (
        <AutoMatchBanner
          suggestions={autoMatchSuggestions}
          onApply={handleApplyAutoMatch}
          onDismiss={() => {
            setAutoMatchDismissed(true);
            setAutoMatchSuggestions([]);
          }}
        />
      )}

      {/* Unsaved changes warning */}
      {mappingIsDirty && (
        <Alert className="border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]">
          <AlertDescription className="text-sm text-[var(--status-warning-text)]">
            {dataEngineTextMaps.unsavedChanges}
          </AlertDescription>
        </Alert>
      )}

      {/* Column list header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {dataEngineTextMaps.columnMapping}
        </p>
        <p className="text-muted-foreground text-xs">
          {dataEngineTextMaps.propsMappedCount(
            mappingDraft.filter(m => m.propPath).length,
            MOCK_TEMPLATE_PROPS.length
          )}
        </p>
      </div>

      {/* Mapping rows */}
      <ScrollArea className="max-h-[480px] pr-2">
        <div className="space-y-2">
          {mappingDraft.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-12)] border-2 border-dashed border-[var(--color-stroke-default)] py-12 text-center">
              <p className="text-muted-foreground text-sm">
                {dataEngineTextMaps.mappingSetup}
              </p>
              <Button variant="outline" size="sm" onClick={handleAddMapping}>
                <Plus className="mr-1.5 size-3.5" />
                {dataEngineTextMaps.addMapping}
              </Button>
            </div>
          ) : (
            mappingDraft.map(entry => {
              const col = columns.find(c => c.name === entry.columnName);
              return (
                <MappingRow
                  key={entry.id}
                  entry={entry}
                  column={col}
                  availableProps={MOCK_TEMPLATE_PROPS}
                  onUpdate={updateMappingEntry}
                  onRemove={removeMappingEntry}
                  onConfigureTransform={handleConfigureTransform}
                />
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Add mapping button */}
      {mappingDraft.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddMapping}
          className="w-full"
        >
          <Plus className="mr-1.5 size-3.5" />
          {dataEngineTextMaps.addMapping}
        </Button>
      )}

      {/* Unmapped columns warning */}
      {unmappedColumns.length > 0 && mappingDraft.length > 0 && (
        <UnmappedColumnsAlert unmappedColumns={unmappedColumns} />
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-stroke-default)] pt-2">
        <Button
          variant="outline"
          onClick={handleSaveMappings}
          disabled={!mappingIsDirty || saveMappings.isPending}
        >
          {saveMappings.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              {dataEngineTextMaps.savingMappings}
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" />
              {dataEngineTextMaps.saveMapping}
            </>
          )}
        </Button>

        <Button
          onClick={handleContinue}
          disabled={mappingDraft.filter(m => m.propPath).length === 0}
        >
          {dataEngineTextMaps.tabRules}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>

      {/* Transformation drawer */}
      <TransformationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        entry={activeEntry}
        column={
          activeEntry
            ? columns.find(c => c.name === activeEntry.columnName)
            : undefined
        }
        onSave={handleSaveTransform}
      />
    </div>
  );
}
