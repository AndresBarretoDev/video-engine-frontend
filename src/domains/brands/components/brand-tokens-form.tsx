'use client';

/**
 * OP Video Engine — Brand Tokens Form
 *
 * Visual editor for brand design tokens (colors + fonts).
 * Two-column layout: form fields left, live preview right.
 * Saves merged tokens via PATCH /brands/:id.
 */

import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

interface BrandTokensFormProps {
  brand: BrandConfig;
}

export function BrandTokensForm({ brand }: BrandTokensFormProps) {
  const { mutate: updateTokens, isPending } = useUpdateBrandTokens(brand.id);

  const existingTokens = brand.tokens as Record<string, unknown> | undefined;
  const existingColors = (existingTokens?.colors as Record<string, string>) ?? {};
  const existingFonts = (existingTokens?.fonts as Record<string, string>) ?? {};
  const existingCustomColors = (existingTokens?.customColors as { name: string; hex: string }[]) ?? [];

  const defaultValues = useMemo<BrandTokensEditInput>(
    () => ({
      colorPrimary: existingColors.primary ?? '',
      colorSecondary: existingColors.secondary ?? '',
      colorAccent: existingColors.accent ?? '',
      customColors: existingCustomColors.length > 0 ? existingCustomColors : [],
      fontHeading: existingFonts.heading ?? '',
      fontBody: existingFonts.body ?? '',
    }),
    [existingColors, existingFonts, existingCustomColors],
  );

  const form = useForm<BrandTokensEditInput>({
    resolver: zodResolver(brandTokensEditSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customColors',
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
    const mergedTokens = {
      ...existingTokens,
      colors: {
        ...(data.colorPrimary && { primary: data.colorPrimary }),
        ...(data.colorSecondary && { secondary: data.colorSecondary }),
        ...(data.colorAccent && { accent: data.colorAccent }),
      },
      customColors: data.customColors?.filter((c) => c.name && c.hex) ?? [],
      fonts: {
        ...(data.fontHeading && { heading: data.fontHeading }),
        ...(data.fontBody && { body: data.fontBody }),
      },
    };

    updateTokens(mergedTokens);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {brandsTextMaps.tokensEditorTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {brandsTextMaps.tokensEditorDescription}
          </p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column — form fields */}
          <div className="space-y-6 lg:col-span-3">
            {/* Colors section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
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

            {/* Custom colors section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
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
                  {/* Color name */}
                  <div className="flex-1 space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      {brandsTextMaps.customColorName}
                    </label>
                    <Input
                      {...form.register(`customColors.${index}.name`)}
                      placeholder={brandsTextMaps.customColorNamePlaceholder}
                      className="text-sm"
                    />
                    {form.formState.errors.customColors?.[index]?.name && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.customColors[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Color picker */}
                  <div className="space-y-1.5">
                    <ColorPickerField
                      label=""
                      value={form.watch(`customColors.${index}.hex`) ?? '#000000'}
                      onChange={(val) => form.setValue(`customColors.${index}.hex`, val)}
                      error={form.formState.errors.customColors?.[index]?.hex?.message}
                    />
                  </div>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">
                  {brandsTextMaps.addCustomColor}
                </p>
              )}
            </div>

            <Separator />

            {/* Typography section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
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
                        {FONT_OPTIONS.map((font) => (
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
                        {FONT_OPTIONS.map((font) => (
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

            <Button type="submit" disabled={isPending}>
              {isPending
                ? brandsTextMaps.saveTokens + '…'
                : brandsTextMaps.saveTokens}
            </Button>
          </div>

          {/* Right column — live preview */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <BrandTokenPreview
              brandName={brand.name}
              colors={{
                primary: watchedValues.colorPrimary ?? '',
                secondary: watchedValues.colorSecondary ?? '',
                accent: watchedValues.colorAccent ?? '',
              }}
              customColors={watchedValues.customColors?.filter(
                (c): c is { name: string; hex: string } => !!c?.name && !!c?.hex,
              )}
              fonts={{
                heading: watchedValues.fontHeading ?? '',
                body: watchedValues.fontBody ?? '',
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
