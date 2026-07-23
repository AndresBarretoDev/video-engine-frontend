'use client';

/**
 * OP Video Engine — Render Output Card
 *
 * Shows completed render output: format, resolution, file size.
 * Download button and copy URL.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 5
 */

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { renderJobsTextMaps } from '../text-maps';
import type { RenderOutput } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RenderOutputCardProps {
  output: RenderOutput;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RenderOutputCard({ output }: RenderOutputCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(output.fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-border bg-muted/20 flex items-center justify-between gap-4 rounded-[var(--radius-8)] border p-3">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs uppercase">
            {output.format}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {renderJobsTextMaps.resolutionLabel(output.width, output.height)}
          </span>
          <span className="text-muted-foreground text-xs">
            {renderJobsTextMaps.durationLabel(output.duration)}
          </span>
          <span className="text-muted-foreground text-xs">
            {renderJobsTextMaps.fileSizeLabel(output.fileSize)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleCopyUrl}
          aria-label={renderJobsTextMaps.copyUrl}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <a href={output.fileUrl} download>
            <Download className="size-3.5" />
            {renderJobsTextMaps.downloadFile}
          </a>
        </Button>
      </div>
    </div>
  );
}
