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
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';

import { RulesList } from './rules-list';
import { useDataSources } from '../hooks/use-data-sources';
import { useRules } from '../hooks/use-rules';
import { useDataEngineStore } from '../stores/data-engine-store';
import { dataEngineTextMaps } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RulesTabProps {
  projectId: string;
  onContinue?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RulesTab({ projectId, onContinue }: RulesTabProps) {
  const setRulesDraft = useDataEngineStore(s => s.setRulesDraft);
  const rulesDraft = useDataEngineStore(s => s.rulesDraft);

  const {
    data: sources,
    isLoading: sourceLoading,
    isError: sourceError
  } = useDataSources(projectId);
  const dataSource = sources?.[0];
  const {
    data: savedRules,
    isLoading: rulesLoading,
    isError: rulesError,
    refetch
  } = useRules(projectId);

  // Seed draft from server on first load (only if draft is still empty)
  const hasSeeded = rulesDraft.length > 0;
  if (!hasSeeded && savedRules && savedRules.length > 0) {
    setRulesDraft(
      savedRules.map(r => ({
        id: r.id,
        condition: r.condition,
        action: r.action,
        enabled: r.enabled,
        logicalConnector: r.logicalOperator
      }))
    );
  }

  const columns = dataSource?.columns ?? [];

  if (sourceLoading || rulesLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 w-full rounded-[var(--radius-12)]"
          />
        ))}
      </div>
    );
  }

  if (sourceError || rulesError) {
    return <ErrorAlert onRetry={() => refetch()} />;
  }

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
