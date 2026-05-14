'use client';

/**
 * OP Video Engine — DataEngineTabs
 *
 * Main tab navigation for the Data Engine page.
 * 4 tabs: Import, Mapping, Rules, Preview.
 *
 * Tab state: URL query param `?tab=` (nuqs).
 * Tab access guards: disabled tabs show Tooltip explaining prerequisites.
 *
 * Spec: SPEC-DE-001 through SPEC-DE-009 / TASK-DE-031
 */

import { Suspense } from 'react';
import { useQueryState } from 'nuqs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

import { ImportTab } from './import-tab';
import { MappingTab } from './mapping-tab';
import { RulesTab } from './rules-tab';
import { PreviewTab } from './preview-tab';

import { useDataEngineStore } from '../stores/data-engine-store';
import { dataEngineTextMaps } from '../text-maps';
import type { DataEngineTabId } from '../types';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS: { id: DataEngineTabId; label: string }[] = [
  { id: 'import', label: dataEngineTextMaps.tabImport },
  { id: 'mapping', label: dataEngineTextMaps.tabMapping },
  { id: 'rules', label: dataEngineTextMaps.tabRules },
  { id: 'preview', label: dataEngineTextMaps.tabPreview }
];

// ─── Tab skeleton ─────────────────────────────────────────────────────────────

function TabContentSkeleton() {
  return (
    <div className="space-y-4 pt-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-[var(--radius-12)]" />
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataEngineTabsProps {
  projectId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataEngineTabs({ projectId }: DataEngineTabsProps) {
  const [activeTab, setActiveTab] = useQueryState<DataEngineTabId>('tab', {
    defaultValue: 'import',
    parse: (v): DataEngineTabId => {
      if (['import', 'mapping', 'rules', 'preview'].includes(v)) {
        return v as DataEngineTabId;
      }
      return 'import';
    }
  });

  // Client-side state for tab guards (no backend dependency)
  const { parseStatus, parsedColumns, mappingDraft } = useDataEngineStore();

  const hasDataSource = parseStatus === 'done' && parsedColumns.length > 0;
  const hasMappings = mappingDraft.length > 0;

  function isTabDisabled(tabId: DataEngineTabId): boolean {
    if (tabId === 'mapping') return !hasDataSource;
    if (tabId === 'rules') return !hasMappings;
    if (tabId === 'preview') return !hasMappings;
    return false;
  }

  function getDisabledTooltip(tabId: DataEngineTabId): string {
    if (tabId === 'mapping')
      return dataEngineTextMaps.tabMappingDisabledTooltip;
    if (tabId === 'rules') return dataEngineTextMaps.tabRulesDisabledTooltip;
    if (tabId === 'preview')
      return dataEngineTextMaps.tabPreviewDisabledTooltip;
    return '';
  }

  // If current active tab is now disabled, fall back to import
  const resolvedTab: DataEngineTabId = isTabDisabled(activeTab ?? 'import')
    ? 'import'
    : (activeTab ?? 'import');

  function handleTabChange(value: string) {
    const tabId = value as DataEngineTabId;
    if (!isTabDisabled(tabId)) {
      setActiveTab(tabId);
    }
  }

  return (
    <TooltipProvider>
      <Tabs
        value={resolvedTab}
        onValueChange={handleTabChange}
        className="space-y-0"
      >
        {/* Tab header */}
        <div className="border-border border-b">
          <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
            {TABS.map(({ id, label }) => {
              const disabled = isTabDisabled(id);
              const trigger = (
                <TabsTrigger
                  key={id}
                  value={id}
                  disabled={disabled}
                  className={[
                    'relative rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium',
                    'data-[state=active]:text-foreground data-[state=active]:border-[var(--btn-principal-light-medium)]',
                    'data-[state=inactive]:text-muted-foreground',
                    disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:text-foreground'
                  ].join(' ')}
                >
                  {label}
                </TabsTrigger>
              );

              if (disabled) {
                return (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} className="inline-flex">
                        {trigger}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{getDisabledTooltip(id)}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return trigger;
            })}
          </TabsList>
        </div>

        {/* Tab content */}
        <div className="pt-6">
          <TabsContent value="import" className="mt-0">
            <Suspense fallback={<TabContentSkeleton />}>
              <ImportTab
                projectId={projectId}
                existingSource={null}
                onDataSaved={() => setActiveTab('mapping')}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="mapping" className="mt-0">
            <Suspense fallback={<TabContentSkeleton />}>
              <MappingTab projectId={projectId} dataSource={null} />
            </Suspense>
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            <Suspense fallback={<TabContentSkeleton />}>
              <RulesTab
                projectId={projectId}
                onContinue={() => setActiveTab('preview')}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <Suspense fallback={<TabContentSkeleton />}>
              <PreviewTab projectId={projectId} />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>
    </TooltipProvider>
  );
}
