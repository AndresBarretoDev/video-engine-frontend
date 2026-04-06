'use client';

/**
 * OP Video Engine — Google Sheets Connector
 *
 * URL input + Connect button. Shows connection status, sync, and auto-refresh.
 * Spec: SPEC-DE-002
 */

import { useState } from 'react';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  useCreateDataSource,
  useSyncDataSource
} from '../hooks/use-data-sources';
import { dataEngineTextMaps } from '../text-maps';
import type { DataSource } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GoogleSheetsConnectorProps {
  projectId: string;
  /** Existing connected data source, if any */
  existingSource?: DataSource | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GoogleSheetsConnector({
  projectId,
  existingSource
}: GoogleSheetsConnectorProps) {
  const [url, setUrl] = useState(existingSource?.sourceUrl ?? '');
  const [autoSync, setAutoSync] = useState(existingSource?.autoSync ?? false);
  const [syncInterval, setSyncInterval] = useState<string>(
    existingSource?.syncInterval
      ? String(existingSource.syncInterval)
      : 'manual'
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const createDataSource = useCreateDataSource(projectId);
  const syncDataSource = useSyncDataSource(projectId);

  const isConnected = !!existingSource && existingSource.status !== 'error';
  const isSyncing =
    existingSource?.status === 'syncing' || syncDataSource.isPending;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleConnect() {
    setConnectionError(null);

    if (!url.trim()) return;

    const syncIntervalSeconds =
      syncInterval === 'manual'
        ? undefined
        : syncInterval === '5m'
          ? 300
          : syncInterval === '15m'
            ? 900
            : syncInterval === '30m'
              ? 1800
              : syncInterval === '1h'
                ? 3600
                : undefined;

    createDataSource.mutate(
      {
        name: dataEngineTextMaps.typeGoogleSheets,
        type: 'google_sheets',
        sourceUrl: url,
        autoSync,
        syncInterval: syncIntervalSeconds,
        config: {},
        sourceConfig: {}
      },
      {
        onError: err => {
          const msg = err.message.toLowerCase();
          if (
            msg.includes('access') ||
            msg.includes('permission') ||
            msg.includes('share')
          ) {
            setConnectionError(dataEngineTextMaps.googleSheetsAccessError);
          } else if (msg.includes('quota') || msg.includes('rate')) {
            setConnectionError(dataEngineTextMaps.googleSheetsQuotaError);
          } else {
            setConnectionError(err.message);
          }
        }
      }
    );
  }

  function handleSyncNow() {
    if (!existingSource?.id) return;
    syncDataSource.mutate(existingSource.id);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* URL input row */}
      <div className="space-y-1.5">
        <Label htmlFor="sheets-url" className="text-sm font-medium">
          {dataEngineTextMaps.googleSheetsPasteUrl}
        </Label>
        <div className="flex gap-2">
          <Input
            id="sheets-url"
            type="url"
            placeholder={dataEngineTextMaps.googleSheetsUrlPlaceholder}
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={createDataSource.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleConnect}
            disabled={!url.trim() || createDataSource.isPending}
          >
            {createDataSource.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {dataEngineTextMaps.googleSheetsConnecting}
              </>
            ) : (
              dataEngineTextMaps.googleSheetsConnect
            )}
          </Button>
        </div>
      </div>

      {/* Connection error */}
      {connectionError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}

      {/* Connected status */}
      {isConnected && existingSource && (
        <div className="space-y-3 rounded-[var(--radius-8)] border border-[var(--color-stroke-default)] bg-[var(--color-surface-1)] p-3">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSyncing ? (
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="size-4 text-[var(--color-status-approved-default)]" />
              )}
              <span className="text-foreground text-sm font-medium">
                {isSyncing
                  ? dataEngineTextMaps.syncing
                  : dataEngineTextMaps.sourceSynced}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--color-op-blue-500)] hover:underline"
              >
                {dataEngineTextMaps.viewPreview}
                <ExternalLink className="size-3" />
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncNow}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 size-3.5" />
                )}
                {dataEngineTextMaps.googleSheetsRefreshNow}
              </Button>
            </div>
          </div>

          {/* Last synced */}
          {existingSource.lastSyncedAt && (
            <p className="text-muted-foreground text-xs">
              {dataEngineTextMaps.googleSheetsLastSynced}:{' '}
              {new Date(existingSource.lastSyncedAt).toLocaleString()}
            </p>
          )}

          {/* Auto-refresh controls */}
          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-stroke-default)] pt-3">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-refresh"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
              <Label htmlFor="auto-refresh" className="text-sm">
                {dataEngineTextMaps.googleSheetsAutoRefresh}
              </Label>
            </div>

            {autoSync && (
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="sync-interval"
                  className="text-muted-foreground text-sm"
                >
                  {dataEngineTextMaps.googleSheetsRefreshInterval}:
                </Label>
                <Select value={syncInterval} onValueChange={setSyncInterval}>
                  <SelectTrigger id="sync-interval" className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(
                      dataEngineTextMaps.googleSheetsIntervalOptions
                    ).map(([val, label]) => (
                      <SelectItem key={val} value={val}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
