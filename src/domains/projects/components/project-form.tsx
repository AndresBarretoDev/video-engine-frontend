'use client';

/**
 * OP Video Engine — Project Form
 *
 * Create / Edit project form. Responsive layout:
 * - Top section: Name (full width) + Description (full width)
 * - Middle: Brand + Visibility side by side
 * - Right/bottom: Thumbnail upload (edit mode only)
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/shared/image-upload';

import { createProjectSchema, updateProjectSchema } from '../schema';
import type { CreateProjectInput, UpdateProjectInput } from '../schema';
import type { Project } from '../types';
import { projectsTextMaps } from '../text-maps';
import { useCreateProject, useUpdateProject } from '../hooks/use-projects';
import { useBrands } from '@/domains/brands/hooks/use-brands';

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditMode = !!project;

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(
    project?.id ?? ''
  );
  const { data: brands, isLoading: brandsLoading } = useBrands();

  const isPending = isCreating || isUpdating;

  const schema = isEditMode ? updateProjectSchema : createProjectSchema;

  const defaultValues = useMemo<CreateProjectInput | UpdateProjectInput>(() => {
    if (project) {
      return {
        name: project.name,
        description: project.description ?? '',
        visibility: project.visibility,
        brandId: project.brandId ?? undefined,
        campaignId: project.campaignId ?? undefined,
        ...(isEditMode && { thumbnailUrl: project.thumbnailUrl ?? undefined })
      };
    }
    return {
      name: '',
      description: '',
      visibility: 'private',
      brandId: undefined,
      campaignId: undefined
    };
  }, [project, isEditMode]);

  const form = useForm<CreateProjectInput | UpdateProjectInput>({
    resolver: zodResolver(schema),
    defaultValues
  });

  function onSubmit(data: CreateProjectInput | UpdateProjectInput) {
    if (isEditMode) {
      // Explicitly send thumbnailUrl: null when removed (undefined won't clear it)
      const payload = {
        ...data,
        thumbnailUrl: (data as UpdateProjectInput).thumbnailUrl ?? null
      };
      updateProject(payload as UpdateProjectInput, {
        onSuccess: () => router.push('/projects')
      });
    } else {
      createProject(data as CreateProjectInput, {
        onSuccess: () => router.push('/projects')
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-foreground text-lg font-semibold">
            {projectsTextMaps.pageTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isEditMode
              ? projectsTextMaps.editProjectDescription
              : projectsTextMaps.newProjectDescription}
          </p>
        </div>

        <Separator />

        {/* Main layout: fields left, thumbnail right (edit mode) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left column — form fields */}
          <div className="space-y-5 lg:col-span-3">
            {/* Name — full width */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{projectsTextMaps.labelName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={projectsTextMaps.placeholderName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description — full width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{projectsTextMaps.labelDescription}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={projectsTextMaps.placeholderDescription}
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand + Visibility — side by side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{projectsTextMaps.labelBrand}</FormLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={val => field.onChange(val || undefined)}
                      disabled={brandsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={projectsTextMaps.placeholderBrand}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
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
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{projectsTextMaps.labelVisibility}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={projectsTextMaps.placeholderVisibility}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">
                          {projectsTextMaps.visibilityPrivate}
                        </SelectItem>
                        <SelectItem value="team">
                          {projectsTextMaps.visibilityTeam}
                        </SelectItem>
                        <SelectItem value="public">
                          {projectsTextMaps.visibilityPublic}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right column — thumbnail (edit mode only) */}
          {isEditMode && (
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value as string | undefined}
                        onChange={field.onChange}
                        aspectRatio="landscape"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <Separator />
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditMode
                ? `${projectsTextMaps.saveChanges}…`
                : `${projectsTextMaps.createProject}…`
              : isEditMode
                ? projectsTextMaps.saveChanges
                : projectsTextMaps.createProject}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {projectsTextMaps.cancelEdit}
          </Button>
        </div>
      </form>
    </Form>
  );
}
