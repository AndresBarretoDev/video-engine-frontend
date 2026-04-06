/**
 * OP Video Engine — Auto-Match Algorithm
 *
 * Client-side auto-matching of CSV columns to template prop paths.
 * Spec: SPEC-DE-005
 */

import type { AutoMatchSuggestion, DataColumn, ParsedColumn } from '../types';

// ─── Synonym map ──────────────────────────────────────────────────────────────

const SYNONYM_MAP: Record<string, string[]> = {
  price: ['precio', 'cost', 'valor', 'monto', 'importe', 'costo'],
  name: ['nombre', 'title', 'titulo', 'producto', 'product', 'item'],
  image: ['img', 'foto', 'imagen', 'picture', 'packshot', 'photo', 'thumbnail'],
  description: [
    'desc',
    'detail',
    'detalle',
    'texto',
    'copy',
    'text',
    'content'
  ],
  discount: ['descuento', 'promo', 'offer', 'oferta', 'promocion'],
  original_price: [
    'precio_original',
    'price_before',
    'old_price',
    'precio_antes'
  ],
  video: ['video_url', 'clip', 'footage'],
  format: ['formato', 'size', 'dimension', 'template']
};

// Minimum score to include a suggestion
const MIN_SCORE = 0.7;

// ─── Text normalization ───────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ') // replace non-alphanumeric with space
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extract last segment of a dot-notation prop path */
function extractPropLeaf(propPath: string): string {
  const parts = propPath.split('.');
  return parts[parts.length - 1] ?? propPath;
}

// ─── Levenshtein distance ─────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// ─── Synonym lookup ───────────────────────────────────────────────────────────

function hasSynonymMatch(a: string, b: string): boolean {
  for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
    const group = [canonical, ...synonyms];
    const aMatch = group.some(s => a.includes(s) || s.includes(a));
    const bMatch = group.some(s => b.includes(s) || s.includes(b));
    if (aMatch && bMatch) return true;
  }
  return false;
}

// ─── Score a single pair ──────────────────────────────────────────────────────

function scorePair(
  columnName: string,
  propPath: string
): { score: number; matchType: AutoMatchSuggestion['matchType'] } {
  const col = normalize(columnName);
  const prop = normalize(extractPropLeaf(propPath));

  // Exact match after normalization
  if (col === prop) {
    return { score: 1.0, matchType: 'exact' };
  }

  // Contains match (either direction)
  if (col.includes(prop) || prop.includes(col)) {
    return { score: 0.85, matchType: 'contains' };
  }

  // Levenshtein distance ≤ 2
  if (levenshtein(col, prop) <= 2) {
    return { score: 0.75, matchType: 'levenshtein' };
  }

  // Synonym match
  if (hasSynonymMatch(col, prop)) {
    return { score: 0.7, matchType: 'synonym' };
  }

  return { score: 0, matchType: 'exact' };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Compute auto-match suggestions for a set of columns vs prop paths.
 * Returns only suggestions with score >= MIN_SCORE (0.7).
 * One suggestion per prop path (highest scoring column wins).
 */
export function autoMatchColumns(
  columns: (DataColumn | ParsedColumn)[],
  propPaths: string[]
): AutoMatchSuggestion[] {
  const suggestions: AutoMatchSuggestion[] = [];

  for (const propPath of propPaths) {
    let best: AutoMatchSuggestion | null = null;

    for (const col of columns) {
      const colName =
        col.name ?? (col as { columnName?: string }).columnName ?? '';
      const { score, matchType } = scorePair(colName, propPath);

      if (score >= MIN_SCORE && (!best || score > best.score)) {
        best = { columnName: colName, propPath, score, matchType };
      }
    }

    if (best) {
      suggestions.push(best);
    }
  }

  // Sort by score descending
  return suggestions.sort((a, b) => b.score - a.score);
}
