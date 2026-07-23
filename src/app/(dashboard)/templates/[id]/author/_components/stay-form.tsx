'use client';

/**
 * StayForm — React Hook Form + Zod form for StayPromo (property/listing) authoring.
 *
 * Mirrors ProductForm's structure and behaviour (400ms debounce handled by the
 * parent AuthoringSection via form.watch). Purely presentational.
 *
 * heroImage uses ProductImageUpload (drag & drop + objectURL preview) — the same
 * reusable uploader as the product form; the RHF field value is a string URL.
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
import type { StayFormValues } from '@/domains/video-generation/schema';
import { ProductImageUpload } from '@/domains/video-generation/components/product-image-upload';

// ─── Props ────────────────────────────────────────────────────────────────────

interface StayFormProps {
  form: UseFormReturn<StayFormValues>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StayForm({ form }: StayFormProps) {
  return (
    <Form {...form}>
      {/* Not a <form> submission — parent triggers render via button */}
      <div
        className="flex flex-col gap-4"
        role="group"
        aria-label={t.stayFormSectionLabel}
      >
        {/* ─── Required fields ──────────────────────────────────────────────── */}

        <FormField
          control={form.control}
          name="listingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.listingNameLabel} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.listingNamePlaceholder}
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.locationLabel} *</FormLabel>
              <FormControl>
                <Input
                  placeholder={t.locationPlaceholder}
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
          name="heroImage"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel aria-required="true">{t.heroImageLabel} *</FormLabel>
              <FormControl>
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
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.ratingLabel} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.ratingPlaceholder}
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
            name="reviewCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.reviewCountLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={t.reviewCountPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="pricePerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.pricePerNightLabel} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.pricePerNightPlaceholder}
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
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.currencyLabel} *</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.currencyPlaceholder}
                    aria-required="true"
                    {...field}
                  />
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
                  placeholder={t.stayCtaPlaceholder}
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
