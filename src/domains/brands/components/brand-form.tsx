'use client';

/**
 * OP Video Engine — Brand Form
 *
 * Create / Edit brand form. Two-column layout:
 * Left: Name, Description. Right: Logo upload.
 * Logo stored in tokens.logo.url via backend JSON field.
 */

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/shared/image-upload';

import { createBrandSchema } from '../schema';
import type { CreateBrandInput } from '../schema';
import type { BrandConfig } from '../types';
import { brandsTextMaps } from '../text-maps';
import { useCreateBrand, useUpdateBrand } from '../hooks/use-brands';

interface BrandFormProps {
  brand?: BrandConfig;
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const isEditMode = !!brand;

  const { mutate: createBrand, isPending: isCreating } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand(
    brand?.id ?? ''
  );

  const isPending = isCreating || isUpdating;

  const existingLogoUrl = useMemo(() => {
    const tokens = brand?.tokens as Record<string, unknown> | undefined;
    return (tokens?.logo as Record<string, unknown> | undefined)?.url as
      | string
      | undefined;
  }, [brand]);

  const defaultValues = useMemo<CreateBrandInput>(() => {
    if (brand) {
      return {
        name: brand.name,
        description: brand.description ?? '',
        logoUrl: existingLogoUrl
      };
    }
    return { name: '', description: '', logoUrl: undefined };
  }, [brand, existingLogoUrl]);

  const form = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    defaultValues
  });

  function onSubmit(data: CreateBrandInput) {
    const { logoUrl, ...rest } = data;
    const existingTokens = (brand?.tokens as Record<string, unknown>) ?? {};
    const payload = {
      ...rest,
      tokens: {
        ...existingTokens,
        logo: logoUrl
          ? {
              ...((existingTokens.logo as Record<string, unknown>) ?? {}),
              url: logoUrl
            }
          : null
      }
    };

    if (isEditMode) {
      updateBrand(payload as Partial<CreateBrandInput>, {
        onSuccess: () => router.push('/brands')
      });
    } else {
      createBrand(payload as CreateBrandInput, {
        onSuccess: () => router.push('/brands')
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            {brandsTextMaps.tabOverview}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isEditMode
              ? brandsTextMaps.editBrandDescription
              : brandsTextMaps.newBrandDescription}
          </p>
        </div>

        <Separator />

        {/* Two-column layout: fields left, image right */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column — form fields */}
          <div className="space-y-5 lg:col-span-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{brandsTextMaps.labelName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={brandsTextMaps.placeholderName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{brandsTextMaps.labelDescription}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={brandsTextMaps.placeholderDescription}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right column — logo upload */}
          <div className="lg:col-span-2">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{brandsTextMaps.logo}</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      aspectRatio="square"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <Separator />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditMode
                ? brandsTextMaps.saveChanges + '…'
                : brandsTextMaps.createBrand + '…'
              : isEditMode
                ? brandsTextMaps.saveChanges
                : brandsTextMaps.createBrand}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {brandsTextMaps.cancelEdit}
          </Button>
        </div>
      </form>
    </Form>
  );
}
