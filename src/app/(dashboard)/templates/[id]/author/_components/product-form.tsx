'use client';

/**
 * ProductForm — React Hook Form + Zod form for single-product authoring.
 *
 * 400ms debounce is handled by the parent (AuthoringSection) via form.watch().
 * This component is PURELY presentational — renders fields, shows errors.
 * No CSV, no variation-grid (spec: "No batch surface present").
 *
 * productImage field: uses ProductImageUpload (drag & drop + objectURL preview)
 * instead of a plain URL input. The RHF field value is a string (blob: or https: URL).
 *
 * Spec: video-generation/spec.md — "Single-product authoring with live preview"
 * Task: 4.4 + image-upload-component (golden-path-video-generation)
 */

import type { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import type { ProductFormValues } from '@/domains/video-generation/schema';
import { ProductImageUpload } from '@/domains/video-generation/components/product-image-upload';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductFormProps {
  form: UseFormReturn<ProductFormValues>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductForm({ form }: ProductFormProps) {
  return (
    <Form {...form}>
      {/* Not a <form> submission — parent triggers render via button */}
      <div
        className="flex flex-col gap-4"
        role="group"
        aria-label={t.formSectionLabel}
      >
        {/* ─── Required fields ──────────────────────────────────────────────── */}

        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.productNameLabel} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.productNamePlaceholder}
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productImage"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel aria-required="true">
                {t.productImageLabel} *
              </FormLabel>
              <FormControl>
                {/*
                 * ProductImageUpload manages its own preview state.
                 * field.value flows in as initialUrl; onChange updates RHF.
                 * hasError drives the error border state on the drop zone.
                 */}
                <ProductImageUpload
                  value={field.value}
                  onChange={url => field.onChange(url ?? '')}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="priceCurrent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.priceCurrentLabel} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.priceCurrentPlaceholder}
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceOriginal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.priceOriginalLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={t.priceOriginalPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ctaText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.ctaTextLabel} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.ctaTextPlaceholder}
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-1" />

        {/* ─── Optional fields ──────────────────────────────────────────────── */}

        <FormField
          control={form.control}
          name="promoTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.promoTagLabel}</FormLabel>
              <FormControl>
                <Input placeholder={t.promoTagPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="legalText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.legalTextLabel}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.legalTextPlaceholder}
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
