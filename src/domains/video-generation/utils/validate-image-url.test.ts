/**
 * TDD RED → GREEN
 * validate-image-url.ts — pure file validation helpers
 *
 * Tests cover:
 * 1. isAcceptedImageType: only image/jpeg, image/png, image/webp pass
 * 2. isWithinSizeLimit: 10MB limit
 * 3. isProductImageValue: accepts https URLs and blob: objectURLs, rejects empty/other
 */

import { describe, it, expect } from 'vitest';
import {
  isAcceptedImageType,
  isWithinSizeLimit,
  isProductImageValue,
  MAX_IMAGE_SIZE_BYTES
} from './validate-image-url';

// ─── isAcceptedImageType ──────────────────────────────────────────────────────

describe('isAcceptedImageType', () => {
  it('accepts image/jpeg', () => {
    expect(isAcceptedImageType('image/jpeg')).toBe(true);
  });

  it('accepts image/png', () => {
    expect(isAcceptedImageType('image/png')).toBe(true);
  });

  it('accepts image/webp', () => {
    expect(isAcceptedImageType('image/webp')).toBe(true);
  });

  it('rejects image/gif', () => {
    expect(isAcceptedImageType('image/gif')).toBe(false);
  });

  it('rejects image/svg+xml', () => {
    expect(isAcceptedImageType('image/svg+xml')).toBe(false);
  });

  it('rejects application/pdf', () => {
    expect(isAcceptedImageType('application/pdf')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isAcceptedImageType('')).toBe(false);
  });
});

// ─── isWithinSizeLimit ────────────────────────────────────────────────────────

describe('isWithinSizeLimit', () => {
  it('accepts file exactly at limit', () => {
    expect(isWithinSizeLimit(MAX_IMAGE_SIZE_BYTES)).toBe(true);
  });

  it('accepts file below limit', () => {
    expect(isWithinSizeLimit(1024 * 1024)).toBe(true); // 1MB
  });

  it('rejects file above limit', () => {
    expect(isWithinSizeLimit(MAX_IMAGE_SIZE_BYTES + 1)).toBe(false);
  });

  it('accepts 0 bytes (empty file edge case)', () => {
    expect(isWithinSizeLimit(0)).toBe(true);
  });
});

// ─── isProductImageValue ──────────────────────────────────────────────────────

describe('isProductImageValue', () => {
  it('accepts https URL', () => {
    expect(isProductImageValue('https://example.com/image.jpg')).toBe(true);
  });

  it('accepts http URL (dev scenarios)', () => {
    expect(isProductImageValue('http://localhost:3001/uploads/image.png')).toBe(
      true
    );
  });

  it('accepts blob: objectURL', () => {
    expect(isProductImageValue('blob:http://localhost:3000/abc-123')).toBe(
      true
    );
  });

  it('rejects empty string', () => {
    expect(isProductImageValue('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(isProductImageValue('   ')).toBe(false);
  });

  it('rejects relative path', () => {
    expect(isProductImageValue('/images/photo.jpg')).toBe(false);
  });

  it('rejects data URI', () => {
    expect(isProductImageValue('data:image/png;base64,abc')).toBe(false);
  });
});
