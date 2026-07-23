'use client';

/**
 * OP Video Engine — RuleRow
 *
 * Single conditional rule displayed as a card.
 * IF [column] [operator] [value] THEN [action] [target] [value?]
 * Includes enable/disable toggle and delete button.
 *
 * Spec: SPEC-DE-007 / TASK-DE-021
 */

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { dataEngineTextMaps } from '../text-maps';
import type {
  ConditionalRuleDraft,
  ConditionOperator,
  RuleActionType,
  DataColumn
} from '../types';

// ─── Operator options by column type ─────────────────────────────────────────

const STRING_OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: dataEngineTextMaps.operatorEquals },
  { value: 'not_equals', label: dataEngineTextMaps.operatorNotEquals },
  { value: 'contains', label: dataEngineTextMaps.operatorContains },
  { value: 'is_empty', label: dataEngineTextMaps.operatorIsEmpty },
  { value: 'is_not_empty', label: dataEngineTextMaps.operatorIsNotEmpty }
];

const NUMBER_OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: dataEngineTextMaps.operatorEquals },
  { value: 'not_equals', label: dataEngineTextMaps.operatorNotEquals },
  { value: 'gt', label: dataEngineTextMaps.operatorGreaterThan },
  { value: 'lt', label: dataEngineTextMaps.operatorLessThan },
  { value: 'gte', label: dataEngineTextMaps.operatorGte },
  { value: 'lte', label: dataEngineTextMaps.operatorLte },
  { value: 'is_empty', label: dataEngineTextMaps.operatorIsEmpty },
  { value: 'is_not_empty', label: dataEngineTextMaps.operatorIsNotEmpty }
];

const BOOLEAN_OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: 'is_true', label: dataEngineTextMaps.operatorIsTrue },
  { value: 'is_false', label: dataEngineTextMaps.operatorIsFalse },
  { value: 'is_empty', label: dataEngineTextMaps.operatorIsEmpty },
  { value: 'is_not_empty', label: dataEngineTextMaps.operatorIsNotEmpty }
];

const ACTION_OPTIONS: { value: RuleActionType; label: string }[] = [
  { value: 'show', label: dataEngineTextMaps.actionShow },
  { value: 'hide', label: dataEngineTextMaps.actionHide },
  { value: 'swap_template', label: dataEngineTextMaps.actionSwapTemplate },
  { value: 'change_prop', label: dataEngineTextMaps.actionChangeProp },
  { value: 'change_format', label: dataEngineTextMaps.actionChangeFormat }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOperatorsForColumnType(columns: DataColumn[], columnName: string) {
  const col = columns.find(c => (c.columnName ?? c.name) === columnName);
  const type = col?.dataType ?? col?.type ?? 'string';

  if (type === 'number') return NUMBER_OPERATORS;
  if (type === 'boolean') return BOOLEAN_OPERATORS;
  return STRING_OPERATORS;
}

function operatorNeedsValue(operator: ConditionOperator): boolean {
  return !['is_true', 'is_false', 'is_empty', 'is_not_empty'].includes(
    operator
  );
}

function actionNeedsValue(action: RuleActionType): boolean {
  return action === 'change_prop' || action === 'swap_template';
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RuleRowProps {
  rule: ConditionalRuleDraft;
  index: number;
  totalRules: number;
  columns: DataColumn[];
  onChange: (rule: ConditionalRuleDraft) => void;
  onDelete: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RuleRow({
  rule,
  index,
  columns,
  onChange,
  onDelete
}: RuleRowProps) {
  const operators = getOperatorsForColumnType(columns, rule.condition.column);
  const showConditionValue = operatorNeedsValue(rule.condition.operator);
  const showActionValue = actionNeedsValue(rule.action.type);

  function update(partial: Partial<ConditionalRuleDraft>) {
    onChange({ ...rule, ...partial });
  }

  function updateCondition(
    partial: Partial<ConditionalRuleDraft['condition']>
  ) {
    onChange({ ...rule, condition: { ...rule.condition, ...partial } });
  }

  function updateAction(partial: Partial<ConditionalRuleDraft['action']>) {
    onChange({ ...rule, action: { ...rule.action, ...partial } });
  }

  return (
    <div
      className={[
        'bg-card space-y-3 rounded-[var(--radius-12)] border p-4 transition-opacity',
        rule.enabled ? 'border-border opacity-100' : 'border-border opacity-60'
      ].join(' ')}
    >
      {/* Connector badge between rules */}
      {index > 0 && (
        <div className="-mt-1 mb-1 flex items-center gap-2">
          <div className="bg-border h-px flex-1" role="separator" />
          <Select
            value={rule.logicalConnector ?? 'and'}
            onValueChange={v => update({ logicalConnector: v as 'and' | 'or' })}
          >
            <SelectTrigger className="h-6 w-16 px-2 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="and">{dataEngineTextMaps.ruleAnd}</SelectItem>
              <SelectItem value="or">{dataEngineTextMaps.ruleOr}</SelectItem>
            </SelectContent>
          </Select>
          <div className="bg-border h-px flex-1" />
        </div>
      )}

      {/* Rule number badge + controls */}
      <div className="flex items-start gap-3">
        <Badge variant="outline" className="mt-0.5 shrink-0 tabular-nums">
          #{index + 1}
        </Badge>

        <div className="flex-1 space-y-3">
          {/* IF row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground w-8 shrink-0 text-xs font-semibold tracking-wide uppercase">
              {dataEngineTextMaps.ruleIf}
            </span>

            {/* Column select */}
            <Select
              value={rule.condition.column}
              onValueChange={v =>
                updateCondition({ column: v, value: undefined })
              }
            >
              <SelectTrigger className="h-8 min-w-[140px] flex-1 text-sm">
                <SelectValue placeholder={dataEngineTextMaps.selectColumn} />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem
                    key={col.id ?? col.name}
                    value={col.columnName ?? col.name}
                  >
                    {col.columnName ?? col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Operator select */}
            <Select
              value={rule.condition.operator}
              onValueChange={v =>
                updateCondition({ operator: v as ConditionOperator })
              }
            >
              <SelectTrigger className="h-8 min-w-[140px] flex-1 text-sm">
                <SelectValue placeholder={dataEngineTextMaps.operator} />
              </SelectTrigger>
              <SelectContent>
                {operators.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Condition value */}
            {showConditionValue && (
              <Input
                className="h-8 min-w-[120px] flex-1 text-sm"
                placeholder={dataEngineTextMaps.value}
                value={String(rule.condition.value ?? '')}
                onChange={e => updateCondition({ value: e.target.value })}
              />
            )}
          </div>

          {/* THEN row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground w-8 shrink-0 text-xs font-semibold tracking-wide uppercase">
              {dataEngineTextMaps.ruleThen}
            </span>

            {/* Action type select */}
            <Select
              value={rule.action.type}
              onValueChange={v =>
                updateAction({
                  type: v as RuleActionType,
                  target: '',
                  value: undefined
                })
              }
            >
              <SelectTrigger className="h-8 min-w-[160px] flex-1 text-sm">
                <SelectValue placeholder={dataEngineTextMaps.action} />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Target input */}
            <Input
              className="h-8 min-w-[160px] flex-1 text-sm"
              placeholder={dataEngineTextMaps.target}
              value={rule.action.target}
              onChange={e => updateAction({ target: e.target.value })}
            />

            {/* Action value (for change_prop / swap_template) */}
            {showActionValue && (
              <Input
                className="h-8 min-w-[120px] flex-1 text-sm"
                placeholder={dataEngineTextMaps.value}
                value={String(rule.action.value ?? '')}
                onChange={e => updateAction({ value: e.target.value })}
              />
            )}
          </div>
        </div>

        {/* Enable toggle + delete */}
        <div className="flex shrink-0 items-center gap-2">
          <Switch
            checked={rule.enabled}
            onCheckedChange={checked => update({ enabled: checked })}
            aria-label={
              rule.enabled
                ? dataEngineTextMaps.disableRule
                : dataEngineTextMaps.enableRule
            }
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive size-8"
            onClick={() => onDelete(rule.id)}
            aria-label={dataEngineTextMaps.deleteRule}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
