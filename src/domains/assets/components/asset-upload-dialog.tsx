'use client';

/**
 * OP Video Engine — Asset Upload Dialog
 *
 * shadcn Dialog with drag & drop file selection area.
 * Validates file type, shows selected file info, calls upload mutation.
 *
 * Spec: SPEC-ASSET-005
 */

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useUploadAsset } from '../hooks/use-assets';
import { assetsTextMaps } from '../text-maps';

// ─── Accepted types ───────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = [
  'image/*',
  'video/*',
  'audio/*',
  'font/ttf',
  'font/woff',
  'font/woff2',
  'image/svg+xml',
  '.ttf',
  '.woff',
  '.woff2',
  '.svg'
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssetUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssetUploadDialog({
  open,
  onOpenChange
}: AssetUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadAsset, isPending } = useUploadAsset();

  const handleFileSelect = useCallback((file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;
    uploadAsset(
      { file: selectedFile },
      {
        onSuccess: () => {
          setSelectedFile(null);
          onOpenChange(false);
        }
      }
    );
  }, [selectedFile, uploadAsset, onOpenChange]);

  const handleClose = useCallback(() => {
    if (isPending) return;
    setSelectedFile(null);
    onOpenChange(false);
  }, [isPending, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{assetsTextMaps.uploadDialogTitle}</DialogTitle>
          <DialogDescription>
            {assetsTextMaps.uploadDialogDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label={assetsTextMaps.dragDropHint}
          className={[
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-12)]',
            'border-2 border-dashed p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/50 hover:bg-muted/30'
          ].join(' ')}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <Upload className="text-muted-foreground size-8" />
          <div className="space-y-1">
            <p className="text-foreground text-sm font-medium">
              {isDragging
                ? assetsTextMaps.dragDropActive
                : assetsTextMaps.dragDropHint}
            </p>
            <p className="text-muted-foreground text-xs">
              {assetsTextMaps.acceptedFormats}
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={ACCEPTED_MIME_TYPES.join(',')}
            onChange={handleInputChange}
          />
        </div>

        {/* Selected file info */}
        {selectedFile && (
          <div className="border-border bg-muted/30 flex items-center gap-3 rounded-[var(--radius-8)] border p-3">
            <FileIcon className="text-muted-foreground size-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {selectedFile.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              onClick={e => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              aria-label={assetsTextMaps.deleteCancel}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {assetsTextMaps.cancelButton}
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isPending}>
            {isPending ? assetsTextMaps.uploading : assetsTextMaps.uploadButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
