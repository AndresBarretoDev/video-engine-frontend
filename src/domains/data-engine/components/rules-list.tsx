'use client';

/**
 * OP Video Engine — RulesList
 *
 * Ordered list of RuleRow components.
 * "Add Rule" appends empty rule to rulesDraft.
 * "Save Rules" calls useSaveRules mutation.
 *
 * Spec: SPEC-DE-007 / TASK-DE-022
 */

import { useCallback } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

import { RuleRow } from './rule-row';
import { useDataEngineStore } from '../stores/data-engine-store';
import { dataEngineTextMaps } from '../text-maps';
import type { ConditionalRuleDraft, DataColumn } from '../types';

const MAX_RULES_SOFT_LIMIT = 20;
const MAX_RULES_WARNING_THRESHOLD = 15;

// ─── Props ────────────────────────────────────────────────────────────────────

interface RulesListProps {
  projectId: string;
  columns: DataColumn[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RulesList({ projectId, columns }: RulesListProps) {
  const rulesDraft = useDataEngineStore(s => s.rulesDraft);
  const addRuleDraft = useDataEngineStore(s => s.addRuleDraft);
  const updateRuleDraft = useDataEngineStore(s => s.updateRuleDraft);
  const removeRuleDraft = useDataEngineStore(s => s.removeRuleDraft);

  const handleAddRule = useCallback(() => {
    const newRule: ConditionalRuleDraft = {
      id: `rule-draft-${Date.now()}`,
      condition: {
        column: columns[0]?.columnName ?? columns[0]?.name ?? '',
        operator: 'equals',
        value: ''
      },
      action: {
        type: 'show',
        target: ''
      },
      enabled: true,
      logicalConnector: rulesDraft.length > 0 ? 'and' : undefined
    };
    addRuleDraft(newRule);
  }, [addRuleDraft, columns, rulesDraft.length]);

  const showMaxWarning = rulesDraft.length >= MAX_RULES_WARNING_THRESHOLD;

  return (
    <div className="space-y-4">
      {/* Max rules warning */}
      {showMaxWarning && (
        <Alert
          variant="default"
          className="border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]"
        >
          <AlertTriangle className="size-4 text-[var(--status-warning-icon)]" />
          <AlertDescription className="text-[var(--status-warning-text)]">
            {dataEngineTextMaps.maxRulesWarning(
              rulesDraft.length,
              MAX_RULES_SOFT_LIMIT
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Rules list */}
      {rulesDraft.length === 0 ? (
        <EmptyState
          title={dataEngineTextMaps.noRules}
          description={dataEngineTextMaps.noRulesDescription}
        />
      ) : (
        <div className="space-y-0">
          {rulesDraft.map((rule, index) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              index={index}
              totalRules={rulesDraft.length}
              columns={columns}
              onChange={updateRuleDraft}
              onDelete={removeRuleDraft}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRule}
          disabled={rulesDraft.length >= MAX_RULES_SOFT_LIMIT}
          className="gap-2"
        >
          <Plus className="size-4" />
          {dataEngineTextMaps.addRule}
        </Button>
      </div>
    </div>
  );
}
