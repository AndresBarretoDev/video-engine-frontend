'use client';

/**
 * OP Video Engine — Register Component Form
 *
 * Create / Edit component form using React Hook Form + Zod.
 * Fields: name, slug, type, description, category, tags, sourceUrl, documentation.
 *
 * Spec: SPEC-COMP-002
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { registerComponentSchema } from '../schema';
import type { RegisterComponentInput } from '../schema';
import type { RegisteredComponent } from '../types';
import { componentsRegistryTextMaps } from '../text-maps';
import {
  useCreateComponent,
  useUpdateComponent
} from '../hooks/use-components';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ComponentFormProps {
  component?: RegisteredComponent;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ComponentForm({ component }: ComponentFormProps) {
  const router = useRouter();
  const isEditMode = !!component;

  const { mutate: createComponent, isPending: isCreating } =
    useCreateComponent();
  const { mutate: updateComponent, isPending: isUpdating } = useUpdateComponent(
    component?.id ?? ''
  );

  const isPending = isCreating || isUpdating;

  const form = useForm<RegisterComponentInput>({
    resolver: zodResolver(registerComponentSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      type: 'atom',
      category: '',
      tags: [],
      sourceUrl: '',
      documentation: ''
    }
  });

  // Populate form in edit mode
  useEffect(() => {
    if (component) {
      form.reset({
        name: component.name,
        slug: component.slug,
        description: component.description ?? '',
        type: component.type,
        category: component.category ?? '',
        tags: component.tags,
        sourceUrl: component.sourceUrl ?? '',
        documentation: component.documentation ?? ''
      });
    }
  }, [component, form]);

  // Auto-generate slug from name
  const watchedName = form.watch('name');
  useEffect(() => {
    if (!isEditMode && watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [watchedName, isEditMode, form]);

  function onSubmit(data: RegisterComponentInput) {
    if (isEditMode) {
      updateComponent(data, {
        onSuccess: () => router.push(`/components/${component!.id}`)
      });
    } else {
      createComponent(data, {
        onSuccess: () => router.push('/components')
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/components">
            <ArrowLeft className="mr-2 size-4" />
            {componentsRegistryTextMaps.backToList}
          </Link>
        </Button>

        {/* ─── Basic info ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {componentsRegistryTextMaps.componentName}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {componentsRegistryTextMaps.componentSlug}
                </FormLabel>
                <FormControl>
                  <Input {...field} className="font-mono text-sm" />
                </FormControl>
                <FormDescription>
                  {componentsRegistryTextMaps.slugDescription}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{componentsRegistryTextMaps.type}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="atom">
                      {componentsRegistryTextMaps.typeAtom}
                    </SelectItem>
                    <SelectItem value="molecule">
                      {componentsRegistryTextMaps.typeMolecule}
                    </SelectItem>
                    <SelectItem value="organism">
                      {componentsRegistryTextMaps.typeOrganism}
                    </SelectItem>
                    <SelectItem value="template">
                      {componentsRegistryTextMaps.typeTemplate}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{componentsRegistryTextMaps.category}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{componentsRegistryTextMaps.description}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} className="resize-y" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* ─── Tags ────────────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{componentsRegistryTextMaps.tags}</FormLabel>
              <FormControl>
                <Input
                  value={field.value?.join(', ') ?? ''}
                  onChange={e => {
                    const tags = e.target.value
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean);
                    field.onChange(tags);
                  }}
                />
              </FormControl>
              <FormDescription>
                {componentsRegistryTextMaps.tagsDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ─── Source & docs ────────────────────────────────────────────── */}
        <FormField
          control={form.control}
          name="sourceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{componentsRegistryTextMaps.sourceUrlLabel}</FormLabel>
              <FormControl>
                <Input {...field} type="url" className="font-mono text-sm" />
              </FormControl>
              <FormDescription>
                {componentsRegistryTextMaps.sourceUrlDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {componentsRegistryTextMaps.documentationLabel}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  className="resize-y font-mono text-sm"
                />
              </FormControl>
              <FormDescription>
                {componentsRegistryTextMaps.documentationDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* ─── Actions ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {componentsRegistryTextMaps.cancel}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {isEditMode
                  ? componentsRegistryTextMaps.saving
                  : componentsRegistryTextMaps.creating}
              </>
            ) : isEditMode ? (
              componentsRegistryTextMaps.save
            ) : (
              componentsRegistryTextMaps.create
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
