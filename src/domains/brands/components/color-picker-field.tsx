'use client';

/**
 * OP Video Engine — Color Picker Field
 *
 * Reusable color input: native picker + hex text input side by side.
 * Shows swatch preview. Validates hex on blur.
 */

import { Input } from '@/components/ui/input';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ColorPickerField({
  label,
  value,
  onChange,
  error,
}: ColorPickerFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-3">
        {/* Native color picker */}
        <div className="relative">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="size-10 cursor-pointer rounded-[var(--radius-8)] border border-border bg-transparent p-0.5"
          />
        </div>

        {/* Hex text input */}
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="max-w-32 font-mono text-sm"
        />

        {/* Swatch preview */}
        {value && (
          <div
            className="size-6 shrink-0 rounded-full border border-border shadow-sm"
            style={{ backgroundColor: value }}
          />
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
