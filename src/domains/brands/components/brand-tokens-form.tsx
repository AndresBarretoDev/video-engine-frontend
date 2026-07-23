'use client';

/**
 * OP Video Engine — Brand Tokens Form
 *
 * Visual editor for brand design tokens.
 * Sections: Colors | Surfaces & Text | Custom Colors | Shape | Structure | Typography | Font URLs
 * Two-column layout: form fields left, live preview right.
 * Saves merged tokens via PATCH /brands/:id.
 *
 * Design ref: design.md D8 — "Brand form authors the full token set (round-trip)"
 */

import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { brandTokensEditSchema } from '../schema';
import type { BrandTokensEditInput } from '../schema';
import type { BrandConfig } from '../types';
import { brandsTextMaps } from '../text-maps';
import { useUpdateBrandTokens } from '../hooks/use-brands';
import { ColorPickerField } from './color-picker-field';
import { BrandTokenPreview } from './brand-token-preview';
import { FONT_OPTIONS, getGoogleFontsUrl } from '../constants/font-options';
import { buildBrandTokensPayload } from '../utils/brand-tokens-payload';

interface BrandTokensFormProps {
  brand: BrandConfig;
}

export function BrandTokensForm({ brand }: BrandTokensFormProps) {
  const { mutate: updateTokens, isPending } = useUpdateBrandTokens(brand.id);

  const existingTokens = brand.tokens as Record<string, unknown> | undefined;
  const existingColors =
    (existingTokens?.colors as Record<string, string>) ?? {};
  const existingFonts = (existingTokens?.fonts as Record<string, string>) ?? {};
  const existingCustomColors =
    (existingTokens?.customColors as { name: string; hex: string }[]) ?? [];
  const existingRadius =
    (existingTokens?.radius as Record<string, number>) ?? {};
  const existingStroke =
    (existingTokens?.stroke as Record<string, number>) ?? {};
  const existingStructure =
    (existingTokens?.structure as Record<string, string>) ?? {};
  const existingFontUrls =
    (existingTokens?.assets as { fonts?: string[] } | undefined)?.fonts?.join(
      '\n'
    ) ?? '';

  const defaultValues = useMemo<BrandTokensEditInput>(
    () => ({
      // Core colors
      colorPrimary: existingColors.primary ?? '',
      colorSecondary: existingColors.secondary ?? '',
      colorAccent: existingColors.accent ?? '',
      customColors: existingCustomColors.length > 0 ? existingCustomColors : [],

      // Surfaces & semantic inks
      colorSurface: existingColors.surface ?? '#F2F2F2',
      colorBorder: existingColors.border ?? '#CCCCCC',
      colorTextOnBackground: existingColors.textOnBackground ?? '#111111',
      colorTextOnSurface: existingColors.textOnSurface ?? '#111111',
      colorTextOnPrimary: existingColors.textOnPrimary ?? '#FFFFFF',

      // Shape
      radiusButton: existingRadius.button ?? 8,
      radiusBadge: existingRadius.badge ?? 8,
      radiusImage: existingRadius.image ?? 12,
      strokeButton: existingStroke.button ?? 1,
      strokeCard: existingStroke.card ?? 1,
      strokeBadge: existingStroke.badge ?? 1,

      // Structure
      cortinillaEntrada:
        (existingStructure.cortinillaEntrada as 'fade' | 'none' | 'slide') ??
        'fade',
      cortinillaCierre:
        (existingStructure.cortinillaCierre as 'fade' | 'none' | 'slide') ??
        'fade',
      promoBarStyle:
        (existingStructure.promoBarStyle as 'top' | 'bottom') ?? 'bottom',
      productOverlayPosition:
        (existingStructure.productOverlayPosition as
          | 'bottom-right'
          | 'bottom-left'
          | 'center') ?? 'bottom-right',

      // Typography
      fontHeading: existingFonts.heading ?? '',
      fontBody: existingFonts.body ?? '',

      // Font URLs
      fontUrls: existingFontUrls
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brand.id]
  );

  const form = useForm<BrandTokensEditInput>({
    resolver: zodResolver(brandTokensEditSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customColors'
  });

  const watchedValues = form.watch();

  // Load Google Fonts when component mounts
  useEffect(() => {
    const id = 'brand-tokens-google-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = getGoogleFontsUrl();
    document.head.appendChild(link);
  }, []);

  function onSubmit(data: BrandTokensEditInput) {
    const mergedTokens = buildBrandTokensPayload(data, existingTokens ?? {});
    updateTokens(mergedTokens as Record<string, unknown>);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            {brandsTextMaps.tokensEditorTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {brandsTextMaps.tokensEditorDescription}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* ── Left column — form fields ─────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-3">
            {/* ── Section: Core colors ──────────────────────────────────────── */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium">
                {brandsTextMaps.sectionColors}
              </h3>

              <FormField
                control={form.control}
                name="colorPrimary"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorPrimary}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorSecondary"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorSecondary}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorAccent"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorAccent}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ── Section: Surfaces & Text ──────────────────────────────────── */}
            <div className="space-y-4">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  {brandsTextMaps.sectionSurfacesAndText}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {brandsTextMaps.sectionSurfacesDescription}
                </p>
              </div>

              <FormField
                control={form.control}
                name="colorSurface"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorSurface}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelColorSurfaceHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorBorder"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorBorder}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelColorBorderHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorTextOnBackground"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorTextOnBackground}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelColorTextOnBackgroundHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorTextOnSurface"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorTextOnSurface}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelColorTextOnSurfaceHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorTextOnPrimary"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ColorPickerField
                        label={brandsTextMaps.labelColorTextOnPrimary}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelColorTextOnPrimaryHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ── Section: Custom Colors ────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-medium">
                  {brandsTextMaps.sectionCustomColors}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: '', hex: '#000000' })}
                  className="gap-1.5"
                >
                  <Plus className="size-3.5" />
                  {brandsTextMaps.addCustomColor}
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-foreground text-sm font-medium">
                      {brandsTextMaps.customColorName}
                    </label>
                    <Input
                      {...form.register(`customColors.${index}.name`)}
                      placeholder={brandsTextMaps.customColorNamePlaceholder}
                      className="text-sm"
                    />
                    {form.formState.errors.customColors?.[index]?.name && (
                      <p className="text-destructive text-xs">
                        {
                          form.formState.errors.customColors[index]?.name
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <ColorPickerField
                      label=""
                      value={
                        form.watch(`customColors.${index}.hex`) ?? '#000000'
                      }
                      onChange={val =>
                        form.setValue(`customColors.${index}.hex`, val)
                      }
                      error={
                        form.formState.errors.customColors?.[index]?.hex
                          ?.message
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive size-9 shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              {fields.length === 0 && (
                <p className="text-muted-foreground py-2 text-xs">
                  {brandsTextMaps.addCustomColor}
                </p>
              )}
            </div>

            <Separator />

            {/* ── Section: Shape ────────────────────────────────────────────── */}
            <div className="space-y-4">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  {brandsTextMaps.sectionShape}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {brandsTextMaps.sectionShapeDescription}
                </p>
              </div>

              {/* Radius row */}
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="radiusButton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelRadiusButton}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="radiusBadge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelRadiusBadge}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="radiusImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelRadiusImage}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stroke row */}
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="strokeButton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelStrokeButton}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strokeCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelStrokeCard}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strokeBadge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        {brandsTextMaps.labelStrokeBadge}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          value={field.value ?? ''}
                          onChange={e =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : Number(e.target.value)
                            )
                          }
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ── Section: Structure ────────────────────────────────────────── */}
            <div className="space-y-4">
              <div>
                <h3 className="text-muted-foreground text-sm font-medium">
                  {brandsTextMaps.sectionStructure}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {brandsTextMaps.sectionStructureDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cortinillaEntrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {brandsTextMaps.labelCortinillaEntrada}
                      </FormLabel>
                      <Select
                        value={field.value ?? 'fade'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fade">
                            {brandsTextMaps.optionFade}
                          </SelectItem>
                          <SelectItem value="none">
                            {brandsTextMaps.optionNone}
                          </SelectItem>
                          <SelectItem value="slide">
                            {brandsTextMaps.optionSlide}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cortinillaCierre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {brandsTextMaps.labelCortinillaCierre}
                      </FormLabel>
                      <Select
                        value={field.value ?? 'fade'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fade">
                            {brandsTextMaps.optionFade}
                          </SelectItem>
                          <SelectItem value="none">
                            {brandsTextMaps.optionNone}
                          </SelectItem>
                          <SelectItem value="slide">
                            {brandsTextMaps.optionSlide}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="promoBarStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{brandsTextMaps.labelPromoBarStyle}</FormLabel>
                      <Select
                        value={field.value ?? 'bottom'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="top">
                            {brandsTextMaps.optionTop}
                          </SelectItem>
                          <SelectItem value="bottom">
                            {brandsTextMaps.optionBottom}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productOverlayPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {brandsTextMaps.labelProductOverlayPosition}
                      </FormLabel>
                      <Select
                        value={field.value ?? 'bottom-right'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bottom-right">
                            {brandsTextMaps.optionBottomRight}
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            {brandsTextMaps.optionBottomLeft}
                          </SelectItem>
                          <SelectItem value="center">
                            {brandsTextMaps.optionCenter}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ── Section: Typography ───────────────────────────────────────── */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium">
                {brandsTextMaps.sectionTypography}
              </h3>

              <FormField
                control={form.control}
                name="fontHeading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{brandsTextMaps.labelFontHeading}</FormLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={brandsTextMaps.placeholderFontHeading}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FONT_OPTIONS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>
                              {font.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fontBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{brandsTextMaps.labelFontBody}</FormLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={brandsTextMaps.placeholderFontBody}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FONT_OPTIONS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>
                              {font.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ── Section: Font URLs ────────────────────────────────────────── */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fontUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{brandsTextMaps.labelFontUrls}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        placeholder={brandsTextMaps.placeholderFontUrls}
                        rows={3}
                        className="resize-none font-mono text-sm"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {brandsTextMaps.labelFontUrlsHint}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <Button type="submit" disabled={isPending}>
              {isPending
                ? brandsTextMaps.saveTokens + '…'
                : brandsTextMaps.saveTokens}
            </Button>
          </div>

          {/* ── Right column — live preview ───────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:col-span-2 lg:self-start">
            <BrandTokenPreview
              brandName={brand.name}
              colors={{
                primary: watchedValues.colorPrimary ?? '',
                secondary: watchedValues.colorSecondary ?? '',
                accent: watchedValues.colorAccent ?? ''
              }}
              customColors={watchedValues.customColors?.filter(
                (c): c is { name: string; hex: string } => !!c?.name && !!c?.hex
              )}
              fonts={{
                heading: watchedValues.fontHeading ?? '',
                body: watchedValues.fontBody ?? ''
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
