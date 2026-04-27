'use client';

/**
 * OP Video Engine — Render Log Viewer
 *
 * Scrollable log container with monospace text.
 * Auto-scrolls to bottom by default.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 5
 */

import { useEffect, useRef } from 'react';

import { renderJobsTextMaps } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderLogViewerProps {
  logs: string[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderLogViewer({ logs }: RenderLogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {renderJobsTextMaps.noLogs}
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 border-border max-h-60 overflow-y-auto rounded-[var(--radius-8)] border p-3"
    >
      <pre className="text-foreground space-y-0.5 font-mono text-xs leading-relaxed">
        {logs.map((line, i) => {
          const isError =
            line.toLowerCase().includes('error') ||
            line.toLowerCase().includes('fail');
          const isWarning = line.toLowerCase().includes('warn');

          return (
            <div
              key={i}
              className={
                isError
                  ? 'text-[var(--status-rejected-text)]'
                  : isWarning
                    ? 'text-[var(--status-warning-text)]'
                    : ''
              }
            >
              {line}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
