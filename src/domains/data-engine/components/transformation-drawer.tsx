'use client';

/**
 * OP Video Engine — Transformation Drawer
 *
 * Slide-in drawer for configuring value transformations on a mapping entry.
 * Shows live preview using first sample value from the column.
 * Spec: SPEC-DE-006
 */

import { useState, useEffect } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { applyTransformation } from '../utils/transformations';
import { dataEngineTextMaps } from '../text-maps';
import type {
  MappingDraftEntry,
  ParsedColumn,
  Transform,
  TransformType
} from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TransformationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: MappingDraftEntry | null;
  column: ParsedColumn | undefined;
  onSave: (entry: MappingDraftEntry) => void;
}

// ─── Transform type options ───────────────────────────────────────────────────

const TRANSFORM_OPTIONS: { value: TransformType | 'none'; label: string }[] = [
  { value: 'none', label: dataEngineTextMaps.transformationNone },
  { value: 'currency', label: dataEngineTextMaps.typeCurrency },
  { value: 'truncate', label: dataEngineTextMaps.typeTruncate },
  { value: 'uppercase', label: dataEngineTextMaps.typeUppercase },
  { value: 'lowercase', label: dataEngineTextMaps.typeLowercase },
  { value: 'title_case', label: dataEngineTextMaps.typeTitleCase },
  { value: 'prepend', label: dataEngineTextMaps.typePrepend },
  { value: 'append', label: dataEngineTextMaps.typeAppend },
  { value: 'round', label: dataEngineTextMaps.typeRound },
  { value: 'expression', label: dataEngineTextMaps.typeExpression }
];

// ─── Default configs ──────────────────────────────────────────────────────────

function getDefaultTransform(
  type: TransformType | 'none'
): Transform | undefined {
  switch (type) {
    case 'currency':
      return {
        type: 'currency',
        config: { currency: 'USD', symbol: '$', decimals: 0, thousands: ',' }
      };
    case 'format_currency':
      return {
        type: 'format_currency',
        config: { currency: 'USD', symbol: '$', decimals: 0, thousands: ',' }
      };
    case 'truncate':
      return { type: 'truncate', config: { maxChars: 30, suffix: '...' } };
    case 'uppercase':
      return { type: 'uppercase', config: {} };
    case 'lowercase':
      return { type: 'lowercase', config: {} };
    case 'title_case':
      return { type: 'title_case', config: {} };
    case 'prepend':
      return { type: 'prepend', config: { text: '' } };
    case 'append':
      return { type: 'append', config: { text: '' } };
    case 'round':
      return { type: 'round', config: { decimals: 2 } };
    case 'expression':
      return { type: 'expression', config: { template: '{value}' } };
    default:
      return undefined;
  }
}

// ─── Transform config forms ───────────────────────────────────────────────────

interface ConfigFormProps {
  transform: Transform;
  onChange: (t: Transform) => void;
}

function TransformConfigForm({ transform, onChange }: ConfigFormProps) {
  switch (transform.type) {
    case 'currency':
    case 'format_currency': {
      const cfg = transform.config;
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.currency}
            </Label>
            <Input
              value={cfg.currency}
              onChange={e =>
                onChange({
                  ...transform,
                  config: { ...cfg, currency: e.target.value }
                })
              }
              placeholder="USD"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.symbol}
            </Label>
            <Input
              value={cfg.symbol}
              onChange={e =>
                onChange({
                  ...transform,
                  config: { ...cfg, symbol: e.target.value }
                })
              }
              placeholder="$"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.decimals}
            </Label>
            <Input
              type="number"
              min={0}
              max={4}
              value={cfg.decimals}
              onChange={e =>
                onChange({
                  ...transform,
                  config: {
                    ...cfg,
                    decimals: parseInt(e.target.value, 10) || 0
                  }
                })
              }
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.thousands}
            </Label>
            <Input
              value={cfg.thousands ?? ''}
              onChange={e =>
                onChange({
                  ...transform,
                  config: { ...cfg, thousands: e.target.value }
                })
              }
              placeholder=","
              className="h-8 text-xs"
            />
          </div>
        </div>
      );
    }
    case 'truncate': {
      const cfg = transform.config;
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.maxChars}
            </Label>
            <Input
              type="number"
              min={1}
              value={cfg.maxChars}
              onChange={e =>
                onChange({
                  ...transform,
                  config: {
                    ...cfg,
                    maxChars: parseInt(e.target.value, 10) || 30
                  }
                })
              }
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">
              {dataEngineTextMaps.transformConfig.suffix}
            </Label>
            <Input
              value={cfg.suffix}
              onChange={e =>
                onChange({
                  ...transform,
                  config: { ...cfg, suffix: e.target.value }
                })
              }
              placeholder="..."
              className="h-8 text-xs"
            />
          </div>
        </div>
      );
    }
    case 'prepend':
    case 'append': {
      const cfg = transform.config;
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">
            {dataEngineTextMaps.transformConfig.text}
          </Label>
          <Input
            value={cfg.text}
            onChange={e =>
              onChange({
                ...transform,
                config: { ...cfg, text: e.target.value }
              })
            }
            placeholder={
              transform.type === 'prepend'
                ? dataEngineTextMaps.transformPlaceholderPrepend
                : dataEngineTextMaps.transformPlaceholderAppend
            }
            className="h-8 text-xs"
          />
        </div>
      );
    }
    case 'round': {
      const cfg = transform.config;
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">
            {dataEngineTextMaps.transformConfig.roundDecimals}
          </Label>
          <Input
            type="number"
            min={0}
            max={10}
            value={cfg.decimals}
            onChange={e =>
              onChange({
                ...transform,
                config: { ...cfg, decimals: parseInt(e.target.value, 10) || 0 }
              })
            }
            className="h-8 text-xs"
          />
        </div>
      );
    }
    case 'expression': {
      const cfg = transform.config;
      return (
        <div className="space-y-1.5">
          <Label className="text-xs">
            {dataEngineTextMaps.transformConfig.template}
          </Label>
          <Input
            value={cfg.template}
            onChange={e =>
              onChange({
                ...transform,
                config: { ...cfg, template: e.target.value }
              })
            }
            placeholder="{value} kg"
            className="h-8 font-mono text-xs"
          />
        </div>
      );
    }
    case 'uppercase':
    case 'lowercase':
    case 'title_case':
      return (
        <p className="text-muted-foreground text-xs">
          {dataEngineTextMaps.transformationNoPreview}
        </p>
      );
    default:
      return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransformationDrawer({
  open,
  onOpenChange,
  entry,
  column,
  onSave
}: TransformationDrawerProps) {
  const [selectedType, setSelectedType] = useState<TransformType | 'none'>(
    'none'
  );
  const [currentTransform, setCurrentTransform] = useState<
    Transform | undefined
  >(undefined);

  // Sync state when entry changes
  useEffect(() => {
    if (entry?.transform) {
      setSelectedType(entry.transform.type);
      setCurrentTransform(entry.transform);
    } else {
      setSelectedType('none');
      setCurrentTransform(undefined);
    }
  }, [entry]);

  function handleTypeChange(type: TransformType | 'none') {
    setSelectedType(type);
    if (type === 'none') {
      setCurrentTransform(undefined);
    } else {
      setCurrentTransform(getDefaultTransform(type));
    }
  }

  function handleSave() {
    if (!entry) return;
    onSave({ ...entry, transform: currentTransform });
    onOpenChange(false);
  }

  // Preview
  const sampleValue = column?.sampleValues[0] ?? '';
  const previewValue =
    currentTransform && sampleValue
      ? (() => {
          try {
            return applyTransformation(sampleValue, currentTransform);
          } catch {
            return dataEngineTextMaps.transformationNoPreview;
          }
        })()
      : null;

  if (!entry) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-base">
            {dataEngineTextMaps.transformation}: {entry.columnName}
          </DrawerTitle>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 pb-4">
          {/* Transform type selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              {dataEngineTextMaps.transformationType}
            </Label>
            <Select
              value={selectedType}
              onValueChange={v => handleTypeChange(v as TransformType | 'none')}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSFORM_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Config fields */}
          {currentTransform && (
            <>
              <Separator />
              <TransformConfigForm
                transform={currentTransform}
                onChange={setCurrentTransform}
              />
            </>
          )}

          {/* Preview */}
          {(sampleValue || previewValue) && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {dataEngineTextMaps.transformationPreview}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[var(--radius-8)] bg-[var(--color-surface-1)] px-3 py-2">
                    <p className="text-muted-foreground mb-1 text-[10px]">
                      {dataEngineTextMaps.transformPreviewInput}
                    </p>
                    <p className="text-foreground font-mono text-xs break-all">
                      {sampleValue || '—'}
                    </p>
                  </div>
                  <div className="rounded-[var(--radius-8)] bg-[var(--color-surface-2)] px-3 py-2">
                    <p className="text-muted-foreground mb-1 text-[10px]">
                      {dataEngineTextMaps.transformPreviewOutput}
                    </p>
                    <p className="text-foreground font-mono text-xs break-all">
                      {previewValue ??
                        (currentTransform ? '—' : sampleValue || '—')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DrawerFooter className="flex-row gap-2">
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">
              {dataEngineTextMaps.discardChanges}
            </Button>
          </DrawerClose>
          <Button className="flex-1" onClick={handleSave}>
            {dataEngineTextMaps.saveMapping}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
