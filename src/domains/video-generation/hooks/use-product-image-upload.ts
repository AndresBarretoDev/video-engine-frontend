'use client';

/**
 * OP Video Engine — useProductImageUpload
 *
 * Wraps image selection + upload for the authoring product form.
 * Graceful-degradation strategy:
 *   1. On file select → show local objectURL IMMEDIATELY (no waiting).
 *   2. Attempt backend upload in background (POST /uploads via useUploadFile).
 *   3. If backend succeeds → replace objectURL with public URL.
 *   4. If backend fails → KEEP the objectURL for live preview; set pendingUpload=true
 *      so the caller can show a subtle notice ("will upload when server is available").
 *   5. On unmount or file replace → revoke any pending objectURL (no memory leak).
 *
 * This is different from the generic useImageUpload which reverts on failure.
 * The authoring preview must remain functional even when the backend is offline.
 *
 * Spec: HANDOFF-BACKEND.md §2.4 — POST /uploads contract.
 * Task: image-upload-component (golden-path-video-generation).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUploadFile } from '@/lib/api/use-upload';
import { isAcceptedImageType, isWithinSizeLimit } from '../utils/validate-image-url';
import { videoGenerationTextMaps as t } from '../text-maps';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseProductImageUploadOptions {
  /** Initial URL (from form reset or existing value). */
  initialUrl?: string;
  /** Called whenever the effective URL changes (objectURL or server URL). */
  onChange: (url: string | undefined) => void;
}

export interface UseProductImageUploadReturn {
  /** Current preview URL — objectURL (local) or server URL. */
  previewUrl: string | null;
  /** File name for display in the UI. */
  fileName: string | null;
  /** True while backend upload is in flight. */
  isUploading: boolean;
  /**
   * True when backend upload failed and the current previewUrl is an objectURL.
   * The caller should show a subtle "pending upload" notice.
   */
  isPendingUpload: boolean;
  /** Validation error from file type/size check. Null if no error. */
  validationError: string | null;
  /** Ref for the hidden <input type="file"> — attach to the input element. */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /** Call to open the file picker programmatically. */
  handlePickerClick: () => void;
  /** Attach to <input type="file"> onChange. */
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Attach to drag-and-drop handlers as the drop handler. */
  handleFileDrop: (file: File) => void;
  /** Remove the current image (clears preview + notifies form). */
  handleRemove: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductImageUpload({
  initialUrl,
  onChange,
}: UseProductImageUploadOptions): UseProductImageUploadReturn {
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPendingUpload, setIsPendingUpload] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { mutateAsync: uploadFile } = useUploadFile();

  // Sync external initialUrl changes (e.g. form reset)
  useEffect(() => {
    if (initialUrl !== undefined) {
      setPreviewUrl(initialUrl || null);
      setIsPendingUpload(false);
    }
  }, [initialUrl]);

  // Revoke objectURL on unmount — no memory leaks
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      setValidationError(null);

      // ── Validate type and size BEFORE creating objectURL ─────────────────────
      if (!isAcceptedImageType(file.type)) {
        setValidationError(t.productImageTypeError);
        return;
      }
      if (!isWithinSizeLimit(file.size)) {
        setValidationError(t.productImageSizeError);
        return;
      }

      // ── Revoke previous objectURL if one exists ───────────────────────────────
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      // ── Step 1: Show local preview IMMEDIATELY ────────────────────────────────
      const localUrl = URL.createObjectURL(file);
      objectUrlRef.current = localUrl;
      setPreviewUrl(localUrl);
      setFileName(file.name);
      setIsPendingUpload(false);
      onChange(localUrl);

      // ── Step 2: Attempt backend upload in background ──────────────────────────
      setIsUploading(true);
      try {
        const result = await uploadFile(file);

        // Backend succeeded → replace objectURL with public URL, revoke blob
        URL.revokeObjectURL(localUrl);
        objectUrlRef.current = null;
        setPreviewUrl(result.url);
        setIsPendingUpload(false);
        onChange(result.url);
      } catch {
        // Backend failed → KEEP the objectURL for live preview
        // Do NOT revert. Just flag pendingUpload so the UI can show a subtle notice.
        setIsPendingUpload(true);
        // Note: onChange already called with localUrl above — form keeps the blob: value.
        // The render validation will still block until a real URL is present at render time.
        // (The user can re-save after the backend is available.)
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile, onChange]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
      // Reset input value so the same file can be re-selected if needed
      if (event.target) event.target.value = '';
    },
    [processFile]
  );

  const handleFileDrop = useCallback(
    (file: File) => {
      processFile(file);
    },
    [processFile]
  );

  const handlePickerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
    setFileName(null);
    setIsUploading(false);
    setIsPendingUpload(false);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(undefined);
  }, [onChange]);

  return {
    previewUrl,
    fileName,
    isUploading,
    isPendingUpload,
    validationError,
    fileInputRef,
    handlePickerClick,
    handleFileChange,
    handleFileDrop,
    handleRemove,
  };
}
