'use client';

/**
 * OP Video Engine — Import Tab
 *
 * Assembles CsvUploadZone / GoogleSheetsConnector + preview table.
 * "Continue to Mapping" sends data to backend then navigates.
 * Spec: SPEC-DE-001, SPEC-DE-002
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileSpreadsheet, Link2, ArrowRight } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useDataEngineStore } from '../stores/data-engine-store';
import { CsvUploadZone } from './csv-upload-zone';
import { GoogleSheetsConnector } from './google-sheets-connector';
import { DataSourcePreviewTable } from './data-source-preview-table';
import { dataEngineTextMaps } from '../text-maps';
import type { DataSource } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImportTabProps {
  projectId: string;
  existingSource?: DataSource | null;
  onDataSaved?: (source: DataSource) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImportTab({
  projectId,
  existingSource,
  onDataSaved
}: ImportTabProps) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<'csv' | 'google_sheets'>(
    existingSource?.type === 'google_sheets' ? 'google_sheets' : 'csv'
  );

  const { parseStatus, parsedData, parsedColumns } = useDataEngineStore();

  const csvDataReady =
    parseStatus === 'done' && parsedData && parsedColumns.length > 0;
  const sheetsDataReady =
    !!existingSource && existingSource.type === 'google_sheets';
  const canContinue = sourceType === 'csv' ? csvDataReady : sheetsDataReady;

  function handleContinue() {
    if (sourceType === 'csv' && csvDataReady) {
      router.push(`/projects/${projectId}/data?tab=mapping`);
    } else if (sourceType === 'google_sheets' && sheetsDataReady) {
      onDataSaved?.(existingSource);
      router.push(`/projects/${projectId}/data?tab=mapping`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Source type selector */}
      <Tabs
        value={sourceType}
        onValueChange={v => setSourceType(v as 'csv' | 'google_sheets')}
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="csv" className="gap-1.5">
            <FileSpreadsheet className="size-4" />
            {dataEngineTextMaps.typeCSV}
          </TabsTrigger>
          <TabsTrigger value="google_sheets" className="gap-1.5">
            <Link2 className="size-4" />
            {dataEngineTextMaps.typeGoogleSheets}
          </TabsTrigger>
        </TabsList>

        {/* CSV upload */}
        <TabsContent value="csv" className="mt-4">
          <CsvUploadZone />
        </TabsContent>

        {/* Google Sheets connector */}
        <TabsContent value="google_sheets" className="mt-4">
          <GoogleSheetsConnector
            projectId={projectId}
            existingSource={
              existingSource?.type === 'google_sheets' ? existingSource : null
            }
          />
        </TabsContent>
      </Tabs>

      {/* Preview table — shown after CSV parsed */}
      {csvDataReady && sourceType === 'csv' && (
        <>
          <Separator />
          <DataSourcePreviewTable />
        </>
      )}

      {/* Continue button */}
      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={!canContinue}>
          {dataEngineTextMaps.tabMapping}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
