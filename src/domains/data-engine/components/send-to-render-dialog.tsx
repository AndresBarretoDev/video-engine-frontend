'use client';

/**
 * OP Video Engine — Send to Render Dialog
 *
 * Confirmation dialog before creating a render batch.
 * User sets batch name and priority, then submits.
 *
 * Plan: phase-4-rendering-pipeline.md — Group 2
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

import {
  createRenderBatchFromVariationsSchema,
  type CreateRenderBatchFromVariationsInput,
} from '@/domains/render-jobs/schema';
import { useCreateRenderBatch } from '@/domains/render-jobs/hooks/use-render-batches';
import { renderJobsTextMaps } from '@/domains/render-jobs/text-maps';
import { dataEngineTextMaps } from '../text-maps';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SendToRenderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  selectedIndices: number[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SendToRenderDialog({
  open,
  onOpenChange,
  projectId,
  selectedIndices,
}: SendToRenderDialogProps) {
  const { mutate: createBatch, isPending } = useCreateRenderBatch(projectId);

  const form = useForm<CreateRenderBatchFromVariationsInput>({
    resolver: zodResolver(createRenderBatchFromVariationsSchema),
    defaultValues: {
      name: '',
      projectId,
      variationIndices: selectedIndices,
      priority: 'normal',
      outputFormat: 'mp4',
    },
  });

  // Sync projectId and indices when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: `Batch — ${selectedIndices.length} variations`,
        projectId,
        variationIndices: selectedIndices,
        priority: 'normal',
        outputFormat: 'mp4',
      });
    }
  }, [open, projectId, selectedIndices, form]);

  function onSubmit(data: CreateRenderBatchFromVariationsInput) {
    const payload = {
      ...data,
      priority: data.priority.toUpperCase() as typeof data.priority,
      outputFormat: data.outputFormat.toUpperCase() as typeof data.outputFormat,
    };
    createBatch(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{renderJobsTextMaps.createBatch}</DialogTitle>
          <DialogDescription>
            {dataEngineTextMaps.nVariationsSelected(selectedIndices.length)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Batch Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{renderJobsTextMaps.batchName}</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{renderJobsTextMaps.priority}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        {renderJobsTextMaps.priorityLow}
                      </SelectItem>
                      <SelectItem value="normal">
                        {renderJobsTextMaps.priorityNormal}
                      </SelectItem>
                      <SelectItem value="high">
                        {renderJobsTextMaps.priorityHigh}
                      </SelectItem>
                      <SelectItem value="urgent">
                        {renderJobsTextMaps.priorityUrgent}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Output Format */}
            <FormField
              control={form.control}
              name="outputFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{renderJobsTextMaps.outputFormat}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mp4">
                        {renderJobsTextMaps.formatMP4}
                      </SelectItem>
                      <SelectItem value="webm">
                        {renderJobsTextMaps.formatWebM}
                      </SelectItem>
                      <SelectItem value="mov">
                        {renderJobsTextMaps.formatMOV}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {dataEngineTextMaps.cancel}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? renderJobsTextMaps.creatingBatch
                  : renderJobsTextMaps.sendToRenderConfirm}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
