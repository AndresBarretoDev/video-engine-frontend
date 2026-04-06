/**
 * OP Video Engine — CSV Parser Utility
 *
 * Wraps Papa Parse for CSV/TSV parsing.
 * Runs client-side — no server round-trip.
 * Spec: SPEC-DE-001, SPEC-DE-003
 */

import Papa from 'papaparse';

import type { CsvParseError, CsvParseResult, ParsedColumn } from '../types';
import { inferColumnTypes } from './type-inference';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_EXTENSIONS = ['.csv', '.tsv'];
const MAX_CLIENT_ROWS = 5000;

// ─── File validation ──────────────────────────────────────────────────────────

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCsvFile(file: File): FileValidationResult {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: 'Only CSV and TSV files are supported'
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File exceeds the 10 MB limit'
    };
  }
  return { valid: true };
}

// ─── Main parse function ──────────────────────────────────────────────────────

/**
 * Parse a CSV/TSV file using Papa Parse.
 * Returns headers, raw rows, inferred columns, errors, and total row count.
 */
export function parseCsvFile(file: File): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: false, // Type inference is done separately
      encoding: 'UTF-8',
      complete: results => {
        const rawData = results.data as string[][];

        if (rawData.length === 0) {
          resolve({
            headers: [],
            rows: [],
            columns: [],
            errors: [],
            totalRows: 0
          });
          return;
        }

        const headers = rawData[0] ?? [];
        const dataRows = rawData.slice(1);

        // Cap at MAX_CLIENT_ROWS to avoid memory issues
        const cappedRows = dataRows.slice(0, MAX_CLIENT_ROWS);

        const columns = inferColumnTypes(headers, cappedRows);

        const mappedErrors: CsvParseError[] = results.errors.map(e => ({
          type: e.type,
          code: e.code,
          message: e.message,
          row: e.row
        }));

        resolve({
          headers,
          rows: cappedRows,
          columns,
          errors: mappedErrors,
          totalRows: dataRows.length
        });
      },
      error: error => {
        reject(new Error(error.message));
      }
    });
  });
}
