/**
 * Generates variations client-side from parsed CSV rows + mapping draft.
 * Used when there's no backend Data Engine module yet (Camino A híbrido).
 */

import type {
  ConditionalRuleDraft,
  ConditionOperator,
  MappingDraftEntry,
  RuleActionType,
  Variation,
  VariationFilters
} from '../types';

function setNestedProp(
  target: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const segments = path.split('.');
  let current = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[segments[segments.length - 1]] = value;
}

// ─── Rules engine ────────────────────────────────────────────────────────────

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.\-]/g, '');
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function isTruthyValue(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes' || s === 'sí' || s === 'si';
  }
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

export function evaluateCondition(
  row: Record<string, unknown>,
  condition: { column: string; operator: ConditionOperator; value?: unknown }
): boolean {
  const cellValue = row[condition.column];
  const expected = condition.value;

  switch (condition.operator) {
    case 'equals':
      return String(cellValue) === String(expected);
    case 'not_equals':
      return String(cellValue) !== String(expected);
    case 'contains':
      return String(cellValue ?? '')
        .toLowerCase()
        .includes(String(expected ?? '').toLowerCase());
    case 'gt': {
      const a = toNumber(cellValue);
      const b = toNumber(expected);
      return a !== null && b !== null && a > b;
    }
    case 'gte': {
      const a = toNumber(cellValue);
      const b = toNumber(expected);
      return a !== null && b !== null && a >= b;
    }
    case 'lt': {
      const a = toNumber(cellValue);
      const b = toNumber(expected);
      return a !== null && b !== null && a < b;
    }
    case 'lte': {
      const a = toNumber(cellValue);
      const b = toNumber(expected);
      return a !== null && b !== null && a <= b;
    }
    case 'is_true':
      return isTruthyValue(cellValue);
    case 'is_false':
      return !isTruthyValue(cellValue);
    case 'is_empty':
      return isEmptyValue(cellValue);
    case 'is_not_empty':
      return !isEmptyValue(cellValue);
    default:
      return false;
  }
}

function applyRuleAction(
  variation: Variation,
  action: { type: RuleActionType; target: string; value?: unknown }
): void {
  switch (action.type) {
    case 'show':
    case 'hide': {
      const visibility =
        (variation.props._visibility as Record<string, boolean> | undefined) ??
        {};
      visibility[action.target] = action.type === 'show';
      variation.props._visibility = visibility;
      return;
    }
    case 'change_prop': {
      if (!action.target) return;
      setNestedProp(variation.props, action.target, action.value);
      return;
    }
    case 'swap_template': {
      if (typeof action.value === 'string' && action.value) {
        variation.props._templateOverride = action.value;
      } else if (action.target) {
        variation.props._templateOverride = action.target;
      }
      return;
    }
    case 'change_format': {
      const formatValue =
        typeof action.value === 'string' ? action.value : action.target;
      if (formatValue) {
        variation.props.format = formatValue;
      }
      return;
    }
  }
}

/**
 * Applies enabled conditional rules to each variation in place.
 * Each rule is evaluated independently against the row data. When the
 * condition matches, the action mutates `variation.props`.
 */
export function applyRulesToVariations(
  variations: Variation[],
  rules: ConditionalRuleDraft[]
): Variation[] {
  const enabledRules = rules.filter(r => r.enabled);
  if (enabledRules.length === 0) return variations;

  return variations.map(variation => {
    const next: Variation = {
      ...variation,
      props: { ...variation.props }
    };

    for (const rule of enabledRules) {
      if (!rule.condition?.column) continue;
      if (evaluateCondition(next.rowData, rule.condition)) {
        applyRuleAction(next, rule.action);
      }
    }

    return next;
  });
}

// ─── Variation generation ────────────────────────────────────────────────────

export function generateVariationsClient(
  parsedRows: Record<string, unknown>[],
  mappingDraft: MappingDraftEntry[],
  rulesDraft: ConditionalRuleDraft[] = []
): Variation[] {
  const variations = parsedRows.map((row, index) => {
    const props: Record<string, unknown> = {};
    mappingDraft.forEach(m => {
      if (!m.propPath) return;
      const value = row[m.columnName];
      setNestedProp(props, m.propPath, value);
    });

    return {
      index,
      rowData: row,
      props,
      errors: [],
      selected: false
    } satisfies Variation;
  });

  return applyRulesToVariations(variations, rulesDraft);
}

export function applyVariationFilters(
  variations: Variation[],
  filters: VariationFilters
): { items: Variation[]; total: number } {
  const search = (filters.search ?? '').toLowerCase().trim();
  const status = filters.status ?? 'all';

  let filtered = variations;

  if (search) {
    filtered = filtered.filter(v =>
      Object.values(v.rowData).some(val =>
        String(val ?? '')
          .toLowerCase()
          .includes(search)
      )
    );
  }

  if (status === 'errors') {
    filtered = filtered.filter(v =>
      v.errors.some(e => e.severity === 'error')
    );
  } else if (status === 'valid') {
    filtered = filtered.filter(
      v => !v.errors.some(e => e.severity === 'error')
    );
  }

  const total = filtered.length;
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { items, total };
}
