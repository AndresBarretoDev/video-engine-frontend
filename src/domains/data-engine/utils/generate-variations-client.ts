/**
 * Generates variations client-side from parsed CSV rows + mapping draft.
 * Used when there's no backend Data Engine module yet (Camino A híbrido).
 */

import type {
  MappingDraftEntry,
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

export function generateVariationsClient(
  parsedRows: Record<string, unknown>[],
  mappingDraft: MappingDraftEntry[]
): Variation[] {
  return parsedRows.map((row, index) => {
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
    };
  });
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
