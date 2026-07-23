/**
 * OP Video Engine — Column Type Inference Utility
 *
 * Infers column data types from raw CSV sample values.
 * Spec: SPEC-DE-003
 */

import type { ParsedColumn } from '../types';

// ─── Type detection patterns ──────────────────────────────────────────────────

const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i;
const IMAGE_CDN_PATTERN =
  /(cdn\.|cloudinary\.com|s3\.amazonaws\.com|images\.|img\.)/i;
const VIDEO_URL_PATTERN = /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i;
const BOOLEAN_TRUTHY = new Set([
  'true',
  'false',
  'yes',
  'no',
  '1',
  '0',
  'si',
  'sí'
]);

// Number of sample values to inspect per column
const SAMPLE_SIZE = 10;

// ─── Individual type checks ───────────────────────────────────────────────────

function isNumberValue(val: string): boolean {
  if (val.trim() === '') return false;
  return (
    !isNaN(parseFloat(val.replace(/,/g, ''))) &&
    isFinite(Number(val.replace(/,/g, '')))
  );
}

function isBooleanValue(val: string): boolean {
  return BOOLEAN_TRUTHY.has(val.trim().toLowerCase());
}

function isDateValue(val: string): boolean {
  if (val.trim() === '') return false;
  // Avoid false positives — require at least one separator
  if (!/[-/.]/.test(val) && !/\d{8}/.test(val)) return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
}

function isImageUrl(val: string): boolean {
  if (!val.startsWith('http') && !val.startsWith('/')) return false;
  return IMAGE_URL_PATTERN.test(val) || IMAGE_CDN_PATTERN.test(val);
}

function isVideoUrl(val: string): boolean {
  if (!val.startsWith('http') && !val.startsWith('/')) return false;
  return VIDEO_URL_PATTERN.test(val);
}

// ─── Infer type for a single column ──────────────────────────────────────────

function inferTypeForColumn(samples: string[]): ParsedColumn['type'] {
  const nonEmpty = samples.filter(
    v => v !== null && v !== undefined && v.trim() !== ''
  );

  if (nonEmpty.length === 0) return 'unknown';

  const limit = Math.min(nonEmpty.length, SAMPLE_SIZE);
  const slice = nonEmpty.slice(0, limit);

  if (slice.every(isVideoUrl)) return 'video_url';
  if (slice.every(isImageUrl)) return 'image_url';
  if (slice.every(isBooleanValue)) return 'boolean';
  if (slice.every(isDateValue)) return 'date';
  if (slice.every(isNumberValue)) return 'number';

  return 'string';
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Infer types for all columns from raw row data.
 * Returns one ParsedColumn per header.
 */
export function inferColumnTypes(
  headers: string[],
  rows: string[][]
): ParsedColumn[] {
  return headers.map((header, colIndex) => {
    const allValues = rows.map(row => row[colIndex] ?? '');
    const nonEmpty = allValues.filter(v => v.trim() !== '');
    const sampleValues = nonEmpty.slice(0, 5);

    const type = inferTypeForColumn(allValues);

    return {
      name: header,
      index: colIndex,
      type,
      sampleValues,
      isEmpty: nonEmpty.length === 0
    };
  });
}
