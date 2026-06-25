'use client';

/**
 * OP Video Engine — Image Upload Component
 *
 * Inspired by 21.st design patterns. Drag & drop, preview with hover actions,
 * filename display, upload to backend. Connected to useImageUpload hook.
 */

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Upload, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/components/hooks/use-image-upload';
import { layoutTextMap } from '@/constants/layout-text-maps';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  hint?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
}

const ASPECT_CLASSES = {
  square: 'h-64',
  landscape: 'h-52',
  portrait: 'h-72'
};

export function ImageUpload({
  value,
  onChange,
  label,
  hint = layoutTextMap.imageUpload.supportedFormats,
  aspectRatio = 'landscape'
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    previewUrl,
    fileName,
    fileInputRef,
    isUploading,
    handleThumbnailClick,
    handleFileChange,
    handleRemove
  } = useImageUpload({
    initialUrl: value,
    onUpload: url => onChange(url),
    onRemove: () => onChange(undefined)
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const fakeEvent = {
          target: { files: [file] }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange]
  );

  return (
    <div className="w-full space-y-3">
      {label && <p className="text-foreground text-sm font-medium">{label}</p>}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {!previewUrl ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-8)] border-2 border-dashed transition-colors',
            'border-muted-foreground/25 bg-muted/30 hover:bg-muted/50',
            isDragging && 'border-primary/50 bg-primary/5',
            isUploading && 'pointer-events-none opacity-60',
            ASPECT_CLASSES[aspectRatio]
          )}
        >
          {isUploading ? (
            <Loader2 className="text-muted-foreground size-8 animate-spin" />
          ) : (
            <>
              <div className="bg-background rounded-full p-3 shadow-sm">
                <ImagePlus className="text-muted-foreground size-5" />
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-medium">
                  {layoutTextMap.imageUpload.clickToSelect}
                </p>
                <p className="text-muted-foreground text-xs">
                  {layoutTextMap.imageUpload.dragAndDrop}
                </p>
              </div>
              {hint && (
                <p className="text-muted-foreground/70 text-xs">{hint}</p>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={cn(
              'group border-border relative overflow-hidden rounded-[var(--radius-8)] border',
              ASPECT_CLASSES[aspectRatio]
            )}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Hover overlay with actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleThumbnailClick}
                className="size-9 p-0"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                className="size-9 p-0"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Filename bar */}
          {fileName && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="truncate">{fileName}</span>
              <button
                type="button"
                onClick={handleRemove}
                className="hover:bg-muted ml-auto shrink-0 rounded-full p-1 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
