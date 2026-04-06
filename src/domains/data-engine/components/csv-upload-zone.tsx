'use client';

/**
 * OP Video Engine — CSV Upload Zone
 *
 * Drag-and-drop file upload zone for CSV/TSV files.
 * On drop/select: validates, parses via parseCsvFile(), stores in Zustand.
 * Spec: SPEC-DE-001
 */

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { parseCsvFile, validateCsvFile } from '../utils/csv-parser';
import { useDataEngineStore } from '../stores/data-engine-store';
import { dataEngineTextMaps } from '../text-maps';

// ─── Component ────────────────────────────────────────────────────────────────

export function CsvUploadZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    csvFile,
    parsedData,
    parsedColumns,
    parseStatus,
    parseError,
    setCsvFile,
    setParsedData,
    setParseStatus,
    clearParsedFile
  } = useDataEngineStore();

  // ── Drag handlers ────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── File processing ──────────────────────────────────────────────────────

  function processFile(file: File) {
    const validation = validateCsvFile(file);
    if (!validation.valid) {
      setParseStatus('error', validation.error);
      return;
    }

    setCsvFile(file);
    setParseStatus('parsing');

    parseCsvFile(file)
      .then(result => {
        setParsedData(result);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to parse file';
        setParseStatus('error', message);
      });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    clearParsedFile();
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── Render ───────────────────────────────────────────────────────────────

  // Parsed / done state
  if (parseStatus === 'done' && parsedData && csvFile) {
    return (
      <div className="space-y-3">
        <Card className="flex items-center gap-3 bg-[var(--color-surface-1)] px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-8)] bg-[var(--color-surface-2)]">
            <FileText className="size-4 text-[var(--color-op-blue-500)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">
              {csvFile.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {dataEngineTextMaps.csvParseSuccess(parsedData.totalRows)}
              {' · '}
              {parsedColumns.length} {dataEngineTextMaps.columns.toLowerCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground size-8 shrink-0"
            onClick={handleClear}
          >
            <X className="size-4" />
            <span className="sr-only">{dataEngineTextMaps.csvChangeFile}</span>
          </Button>
        </Card>

        {parsedData.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {dataEngineTextMaps.csvWarningInconsistentRows(
                parsedData.errors.length
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // Parsing state
  if (parseStatus === 'parsing') {
    return (
      <Card className="flex flex-col items-center gap-3 bg-[var(--color-surface-1)] px-6 py-8">
        <p className="text-muted-foreground text-sm">
          {dataEngineTextMaps.csvParsing}
        </p>
        <Progress value={undefined} className="w-48" />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={dataEngineTextMaps.csvUploadHint}
        className={[
          'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-12)] border-2 border-dashed px-6 py-10 transition-colors',
          isDragging
            ? 'border-[var(--color-op-blue-500)] bg-[var(--color-op-blue-50)]'
            : 'border-[var(--color-stroke-default)] bg-[var(--color-surface-1)] hover:border-[var(--color-op-blue-400)] hover:bg-[var(--color-surface-2)]'
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleBrowseClick();
        }}
      >
        <div
          className={[
            'flex size-12 items-center justify-center rounded-[var(--radius-12)] transition-colors',
            isDragging
              ? 'bg-[var(--color-op-blue-100)]'
              : 'bg-[var(--color-surface-2)]'
          ].join(' ')}
        >
          <Upload
            className={[
              'size-6 transition-colors',
              isDragging
                ? 'text-[var(--color-op-blue-600)]'
                : 'text-muted-foreground'
            ].join(' ')}
          />
        </div>

        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            {dataEngineTextMaps.csvDropHere}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {dataEngineTextMaps.csvOrBrowse}
          </p>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-muted-foreground text-xs">
            {dataEngineTextMaps.csvSupportedFormats}
          </p>
          <p className="text-muted-foreground text-xs">
            {dataEngineTextMaps.csvMaxFileSize}
          </p>
        </div>
      </div>

      {/* Error state */}
      {parseStatus === 'error' && parseError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
