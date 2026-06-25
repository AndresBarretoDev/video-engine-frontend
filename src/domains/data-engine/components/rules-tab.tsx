'use client';

/**
 * OP Video Engine — RulesTab
 *
 * Info banner + RulesList + "Continue to Preview" button.
 * Rules are optional — continue button is always enabled.
 *
 * Spec: SPEC-DE-007 / TASK-DE-023
 */

import { ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { RulesList } from './rules-list';
import { useDataEngineStore } from '../stores/data-engine-store';
import { dataEngineTextMaps } from '../text-maps';
import type { DataColumn } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RulesTabProps {
  projectId: string;
  onContinue?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RulesTab({ projectId, onContinue }: RulesTabProps) {
  // Client-side: columns vienen del CSV parseado en el store
  const parsedColumns = useDataEngineStore(s => s.parsedColumns);

  const columns: DataColumn[] = parsedColumns.map(c => ({
    columnName: c.name,
    name: c.name,
    columnIndex: c.index,
    type: c.type,
    sampleValues: c.sampleValues
  }));

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <Alert className="bg-muted/40 border-[var(--secondary-stroke-default-light)]">
        <Info className="text-muted-foreground size-4" />
        <AlertDescription className="text-muted-foreground">
          {dataEngineTextMaps.conditionalLogic}
          {' — '}
          {dataEngineTextMaps.rulesTabDescription}
        </AlertDescription>
      </Alert>

      {/* Rules list */}
      <RulesList projectId={projectId} columns={columns} />

      {/* Continue button — always enabled (rules are optional) */}
      {onContinue && (
        <div className="border-border flex justify-end border-t pt-2">
          <Button onClick={onContinue}>
            {dataEngineTextMaps.variationPreview}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
