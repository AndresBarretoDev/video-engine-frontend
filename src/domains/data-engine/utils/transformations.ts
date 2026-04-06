/**
 * OP Video Engine — Transformations Utility
 *
 * Pure functions to apply Transform configs to raw values.
 * Used both in the UI preview and (eventually) for client-side variation props.
 * Spec: SPEC-DE-006
 */

import type { Transform } from '../types';

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Apply a Transform to a raw string value.
 * Returns the transformed string or the original value if transform is null/undefined.
 */
export function applyTransformation(
  value: string,
  transform: Transform | null | undefined
): string {
  if (!transform) return value;

  switch (transform.type) {
    case 'currency':
    case 'format_currency': {
      const cfg = transform.config;
      const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
      if (isNaN(num)) return value;

      const thousands = cfg.thousands ?? '';
      const intPart = Math.trunc(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      const decimalPart =
        cfg.decimals > 0 ? (num.toFixed(cfg.decimals).split('.')[1] ?? '') : '';
      const formatted =
        cfg.decimals > 0 ? `${intPart}.${decimalPart}` : intPart;
      return `${cfg.symbol}${formatted}`;
    }

    case 'truncate': {
      const { maxChars, suffix } = transform.config;
      if (value.length <= maxChars) return value;
      return value.slice(0, maxChars) + suffix;
    }

    case 'uppercase':
      return value.toUpperCase();

    case 'lowercase':
      return value.toLowerCase();

    case 'title_case':
      return value.toLowerCase().replace(/(?:^|\s)\S/g, c => c.toUpperCase());

    case 'prepend':
      return transform.config.text + value;

    case 'append':
      return value + transform.config.text;

    case 'round': {
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return num.toFixed(transform.config.decimals);
    }

    case 'expression': {
      // Only supports {value} placeholder — no JS eval
      return transform.config.template.replace(/\{value\}/g, value);
    }

    default:
      return value;
  }
}

/**
 * Get a human-readable summary label for a transform.
 */
export function transformLabel(transform: Transform): string {
  switch (transform.type) {
    case 'currency':
    case 'format_currency':
      return `${transform.config.symbol} ${transform.config.currency} (${transform.config.decimals} dec)`;
    case 'truncate':
      return `Truncate at ${transform.config.maxChars} chars`;
    case 'uppercase':
      return 'UPPERCASE';
    case 'lowercase':
      return 'lowercase';
    case 'title_case':
      return 'Title Case';
    case 'prepend':
      return `Prepend "${transform.config.text}"`;
    case 'append':
      return `Append "${transform.config.text}"`;
    case 'round':
      return `Round (${transform.config.decimals} dec)`;
    case 'expression':
      return `Expression: ${transform.config.template}`;
    default:
      return 'Transform';
  }
}
