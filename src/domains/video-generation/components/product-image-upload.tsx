'use client';

/**
 * OP Video Engine — ProductImageUpload
 *
 * Domain-specific image upload for the authoring product form.
 *
 * Features:
 * - File picker + drag & drop (click or drag zone)
 * - Local objectURL preview IMMEDIATELY on file select (no backend wait)
 * - Background upload to POST /uploads via useProductImageUpload
 * - Graceful degradation: if backend is unavailable, keeps objectURL + shows
 *   a subtle "pending upload" notice (no blocking, no reverting)
 * - File type + size validation (JPG, PNG, WebP · max 10 MB) with inline error
 * - Preview with hover overlay: change / remove actions
 * - Accessible: keyboard-navigable, aria-label on icon buttons, role descriptions
 *
 * Design tokens: Vibe Coding Platform Tokens only. ZERO hardcoded colors/px/ms.
 *
 * Skills applied:
 *   - make-interfaces-feel-better: concentric radius, scale on press, hit areas, antialiased
 *   - baseline-ui: structural skeleton loading, error inline, a11y primitives, no `h-screen`
 *
 * Task: image-upload-component (golden-path-video-generation)
 */

import { useCallback, useState } from 'react';
import Image from 'next/image';
import {
  ImagePlus,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  CloudOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProductImageUpload } from '../hooks/use-product-image-upload';
import { videoGenerationTextMaps as t } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductImageUploadProps {
  /** Controlled value: the current image URL (from React Hook Form field.value). */
  value?: string;
  /** Called when the image URL changes — connect to RHF field.onChange. */
  onChange: (url: string | undefined) => void;
  /** Set true when the form has validated and submitted a productImage error. */
  hasError?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductImageUpload({
  value,
  onChange,
  hasError = false
}: ProductImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const {
    previewUrl,
    fileName,
    isUploading,
    isPendingUpload,
    validationError,
    fileInputRef,
    handlePickerClick,
    handleFileChange,
    handleFileDrop,
    handleRemove
  } = useProductImageUpload({
    initialUrl: value,
    onChange
  });

  // ── Drag and drop ──────────────────────────────────────────────────────────

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
      if (file) handleFileDrop(file);
    },
    [handleFileDrop]
  );

  // ── Keyboard: Enter / Space on the drop zone opens picker ─────────────────
  const handleDropZoneKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePickerClick();
      }
    },
    [handlePickerClick]
  );

  return (
    <div className="w-full space-y-2">
      {/* Hidden file input — accessible by label + keyboard trigger */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={t.productImageLabel}
        className="sr-only"
        ref={fileInputRef}
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* ── Drop zone (empty state) ──────────────────────────────────────────── */}
      {!previewUrl ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`${t.productImageLabel} — click or drag to upload`}
          onClick={handlePickerClick}
          onKeyDown={handleDropZoneKeyDown}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            // Layout
            'flex h-52 w-full cursor-pointer flex-col items-center justify-center gap-3',
            // Border
            'rounded-[var(--radius-12)] border-2 border-dashed',
            // Colors — idle
            'border-muted-foreground/25 bg-muted/20',
            // Hover
            'hover:border-primary/40 hover:bg-muted/40',
            // Focus ring (keyboard nav)
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            // Drag active
            isDragging && 'border-primary/60 bg-primary/8 scale-[1.01]',
            // Uploading: non-interactive
            isUploading && 'pointer-events-none opacity-60',
            // Error state
            hasError && !validationError && 'border-destructive/50',
            // Transition — specific properties only (no `transition-all`)
            'transition-[border-color,background-color,transform] duration-[var(--duration-standard)] ease-[var(--easing-ui)]'
          )}
        >
          {isUploading ? (
            /* Loading state: spinner with aria-label */
            <Loader2
              className="text-muted-foreground size-8 animate-spin"
              aria-label="Uploading image…"
            />
          ) : (
            <>
              {/*
               * Icon container: concentric radius applied.
               * Outer button zone: rounded-[12px]. Padding = 12px.
               * Inner icon container: rounded-[6px] (12 - 6 = 6, matches --radius-6).
               */}
              <div
                className="bg-background rounded-[var(--radius-8)] p-3 shadow-sm"
                aria-hidden="true"
              >
                <ImagePlus className="text-muted-foreground size-5" />
              </div>
              <div className="text-center">
                <p className="text-foreground text-sm font-medium [text-wrap:balance]">
                  Click to select{' '}
                  <span className="text-muted-foreground font-normal">
                    or drag and drop
                  </span>
                </p>
                <p className="text-muted-foreground/70 mt-0.5 text-xs">
                  {t.productImageHint}
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ── Preview state ──────────────────────────────────────────────────── */
        <div className="space-y-2">
          {/*
           * Preview container.
           * Outer radius: --radius-12. Inner action buttons: --radius-8.
           * Concentric: outer(12) - padding(8) ≈ inner(8). ✅
           */}
          <div
            className={cn(
              'group border-border relative h-52 w-full overflow-hidden rounded-[var(--radius-12)] border',
              isUploading && 'opacity-80'
            )}
          >
            <Image
              src={previewUrl}
              alt="Product image preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              style={{
                // Subtle outline for depth — pure black, low opacity (make-interfaces-feel-better §11)
                outline: '1px solid rgba(0, 0, 0, 0.10)',
                outlineOffset: '-1px'
              }}
              unoptimized={previewUrl.startsWith('blob:')}
            />

            {/* Hover overlay — opacity transition only (compositor prop) */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-[var(--duration-standard)] ease-[var(--easing-ui)] group-hover:opacity-100"
              aria-hidden="true"
            />

            {/* Action buttons — appear on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity duration-[var(--duration-standard)] ease-[var(--easing-ui)] group-hover:opacity-100"
              role="group"
              aria-label="Image actions"
            >
              {/* Change button — min 40×40 hit area via size-10 */}
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handlePickerClick}
                className="size-10 rounded-[var(--radius-8)] p-0 transition-transform active:scale-[0.96]"
                disabled={isUploading}
                aria-label="Change image"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" aria-hidden />
                )}
              </Button>

              {/* Remove button — min 40×40 hit area */}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                className="size-10 rounded-[var(--radius-8)] p-0 transition-transform active:scale-[0.96]"
                disabled={isUploading}
                aria-label="Remove image"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Filename / pending notice row */}
          {(fileName || isPendingUpload) && (
            <div className="flex items-center gap-2 text-xs">
              {isPendingUpload && (
                <div
                  className="flex items-center gap-1.5 rounded-[var(--radius-6)] px-2 py-1"
                  style={{
                    backgroundColor: 'var(--status-pending-bg)',
                    color: 'var(--status-pending-text)'
                  }}
                  role="status"
                  aria-label={t.productImageUploadPending}
                >
                  <CloudOff className="size-3 shrink-0" aria-hidden />
                  <span className="truncate">
                    {t.productImageUploadPending}
                  </span>
                </div>
              )}
              {fileName && !isPendingUpload && (
                <span
                  className="text-muted-foreground/70 truncate"
                  aria-label={`Selected file: ${fileName}`}
                >
                  {fileName}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Validation error — inline, next to where the action happened */}
      {(validationError ?? (hasError ? null : null)) && (
        <p
          className="text-destructive flex items-center gap-1.5 text-xs"
          role="alert"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {validationError}
        </p>
      )}
    </div>
  );
}
