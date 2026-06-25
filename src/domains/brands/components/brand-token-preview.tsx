'use client';

/**
 * OP Video Engine — Brand Token Preview
 *
 * Live preview card showing how brand tokens look applied.
 * Uses inline styles for dynamic user-provided values.
 */

import { brandsTextMaps } from '../text-maps';

interface BrandTokenPreviewProps {
  brandName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customColors?: { name: string; hex: string }[];
  fonts: {
    heading: string;
    body: string;
  };
}

export function BrandTokenPreview({
  brandName,
  colors,
  customColors,
  fonts,
}: BrandTokenPreviewProps) {
  const headingFont = fonts.heading || 'inherit';
  const bodyFont = fonts.body || 'inherit';

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        {brandsTextMaps.previewTitle}
      </p>

      <div className="overflow-hidden rounded-[var(--radius-12)] border border-border">
        {/* Header bar with primary color */}
        <div
          className="px-4 py-3"
          style={{ backgroundColor: colors.primary || '#1a1a1a' }}
        >
          <h3
            className="text-lg font-bold text-white truncate"
            style={{ fontFamily: headingFont }}
          >
            {brandName || 'Brand Name'}
          </h3>
        </div>

        {/* Content area */}
        <div className="space-y-4 p-4">
          {/* Sample text */}
          <p
            className="text-sm text-foreground leading-relaxed"
            style={{ fontFamily: bodyFont }}
          >
            {brandsTextMaps.previewSampleText}
          </p>

          {/* Color swatches */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {colors.primary && (
              <div className="flex items-center gap-2">
                <div
                  className="size-6 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: colors.primary }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {colors.primary}
                </span>
              </div>
            )}
            {colors.secondary && (
              <div className="flex items-center gap-2">
                <div
                  className="size-6 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: colors.secondary }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {colors.secondary}
                </span>
              </div>
            )}
            {colors.accent && (
              <div className="flex items-center gap-2">
                <div
                  className="size-6 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: colors.accent }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {colors.accent}
                </span>
              </div>
            )}
            {customColors?.filter((c) => c.name && c.hex).map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div
                  className="size-6 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs font-mono text-muted-foreground">
                  {c.name}
                </span>
              </div>
            ))}
          </div>

          {/* Mock CTA button */}
          <button
            className="rounded-[var(--radius-8)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: colors.accent || colors.primary || '#1a1a1a',
              fontFamily: headingFont,
            }}
            type="button"
          >
            {brandsTextMaps.previewButton}
          </button>
        </div>
      </div>
    </div>
  );
}
