/**
 * OP Video Engine — Image URL validation utilities
 *
 * Pure functions — no side effects, no imports.
 * Used by:
 *   - ProductImageUpload component (pre-upload file validation)
 *   - productFormSchema refinement (accepts both https:// and blob: values)
 *
 * Accepted MIME types for product images: JPEG, PNG, WebP only.
 * Blob: URLs are accepted as valid productImage values (local objectURL before backend upload).
 */

/** Accepted MIME types — matches POST /uploads backend contract */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;

/** 10 MB — matches POST /uploads backend contract */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Returns true if the MIME type is accepted for product image upload.
 */
export function isAcceptedImageType(mimeType: string): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Returns true if the file size is within the 10 MB limit.
 */
export function isWithinSizeLimit(sizeInBytes: number): boolean {
  return sizeInBytes <= MAX_IMAGE_SIZE_BYTES;
}

/**
 * Returns true if the string is a valid productImage value for the form.
 *
 * Accepts:
 *   - https:// URLs (server-side image, e.g. result from POST /uploads)
 *   - http:// URLs (dev: localhost backend serving static files)
 *   - blob: URLs (local objectURL before backend upload completes)
 *
 * Rejects: empty, whitespace-only, relative paths, data: URIs, other schemes.
 */
export function isProductImageValue(value: string): boolean {
  if (!value || !value.trim()) return false;
  const trimmed = value.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('blob:')
  );
}
