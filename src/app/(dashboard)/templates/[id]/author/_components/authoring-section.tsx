'use client';

/**
 * AuthoringSection — entry point for the authoring view.
 *
 * Resolves the template (GET /templates/:id via useTemplate) and its authoring
 * config (organism + form + assembler + brand) from the template authoring
 * registry, keyed by componentId. Then renders the generic <AuthoringEditor>.
 *
 * Multi-template by design: NO hardcoded organism/form/composition-id anywhere.
 * Adding a template = one entry in template-authoring-registry.tsx.
 *
 * Layout (inside AuthoringEditor):
 * - Mobile (<768px): preview sheet triggered by a button + form below
 * - Desktop (lg+): form-left / preview-right split
 *
 * Design ref: design.md §D7 (form-left / preview-right) + spec "Mobile-first authoring"
 * Task: 4.3 + 4.4 (golden-path-video-generation) + multi-template authoring
 */

import { useCallback, useEffect, useRef } from 'react';
import { useForm, type FieldValues, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTemplate } from '@/domains/templates/hooks/use-templates';
import type { TemplateDescriptor } from '@/domains/templates/types';
import { videoGenerationTextMaps } from '@/domains/video-generation/text-maps';
import { useVideoGenerationStore } from '@/domains/video-generation/stores/video-generation-store';
import type { RenderJobEntry } from '@/domains/video-generation/stores/video-generation-store';
import { resolveRemotionBrand } from '@/domains/video-generation/utils/brand-config-mapper';
import type { AuthoringState } from '@/domains/video-generation/types';
import { useBrand } from '@/domains/brands/hooks/use-brands';
import { BrandSelector } from '@/domains/brands/components/brand-selector';
import type { VideoFormat } from '@/remotion/types/video-format.types';

import { RemotionPlayerWrapper } from './remotion-player-wrapper';
import { FormatTabs } from './format-tabs';
import { FormatSelector } from './format-selector';
import { SendToRenderButton } from './send-to-render-button';
import { RenderCountIndicator } from './render-count-indicator';
import { RenderResultsSheet } from './render-results-sheet';
import { AuthoringSkeleton } from './authoring-skeleton';
import {
  getTemplateAuthoringConfig,
  type TemplateAuthoringConfig
} from './template-authoring-registry';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Eye } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AuthoringSectionProps {
  templateId: string;
  /** The project this video is authored under. Optional: the global showroom route
   *  (/templates/[id]/author) renders a preview without a project; the project-scoped
   *  route (/projects/[projectId]/templates/[id]/author) passes the real project. */
  projectId?: string;
}

// ─── Resolver (data + config) ───────────────────────────────────────────────

export function AuthoringSection({ templateId, projectId }: AuthoringSectionProps) {
  const { data: template, isLoading } = useTemplate(templateId);

  if (isLoading) {
    return <AuthoringSkeleton />;
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">
          {videoGenerationTextMaps.templateNotFound}
        </p>
      </div>
    );
  }

  const config = getTemplateAuthoringConfig(template.componentId);

  if (!config) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">
          {videoGenerationTextMaps.templateUnsupported(template.componentId)}
        </p>
      </div>
    );
  }

  // key remounts the editor (and resets RHF) when switching templates.
  return (
    <AuthoringEditor
      key={template.id}
      template={template}
      config={config}
      projectId={projectId}
    />
  );
}

// ─── Editor (hooks + render) ──────────────────────────────────────────────────

interface AuthoringEditorProps {
  template: TemplateDescriptor;
  projectId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: TemplateAuthoringConfig<any>;
}

function AuthoringEditor({ template, config, projectId }: AuthoringEditorProps) {
  const {
    activeFormat,
    setActiveFormat,
    isMobilePreviewOpen,
    toggleMobilePreview,
    setFormSnapshot,
    formSnapshot,
    selectedBrandId,
    setSelectedBrandId,
    selectedFormats,
    addRenderJobEntries,
    setResultsSheetOpen,
    resetEditor,
  } = useVideoGenerationStore();

  // Selected brand → Remotion brand config. Falls back to the template's preset
  // when no brand is selected or the brand has no usable design tokens.
  const { data: selectedBrand } = useBrand(selectedBrandId ?? '');
  const brand =
    (selectedBrandId ? resolveRemotionBrand(selectedBrand) : null) ??
    config.fallbackBrandPreset;

  function handleJobsCreated(entries: RenderJobEntry[]) {
    addRenderJobEntries(entries);
    setResultsSheetOpen(true);
    form.reset(config.defaultFormValues);
  }

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<FieldValues>({
    resolver: zodResolver(config.formSchema),
    defaultValues: config.defaultFormValues,
    mode: 'onChange'
  });

  // Reset UI state (format + snapshot) when entering a template, so a stale
  // snapshot from another template never bleeds into this preview.
  useEffect(() => {
    resetEditor();
  }, [resetEditor]);

  // Debounced update — fires 400ms after last change.
  const handleFormChange = useCallback(
    (values: FieldValues) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setFormSnapshot(values);
      }, 400);
    },
    [setFormSnapshot]
  );

  useEffect(() => {
    const subscription = form.watch(values => {
      handleFormChange(values as FieldValues);
    });
    return () => subscription.unsubscribe();
  }, [form, handleFormChange]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Preview: user input once they start typing, representative defaults before that.
  const previewForm = formSnapshot ?? config.previewFormValues;
  const authoringState: AuthoringState<FieldValues> = {
    form: previewForm,
    brand,
    activeFormat
  };
  const compositionProps = config.assembleProps(authoringState);

  const activeFormatRef =
    template.formats.find(f => f.format === activeFormat) ?? template.formats[0];

  // RENDER needs a PUBLIC image url (not a blob: that lives only in this browser).
  // config.isRenderReady encapsulates each template's image-field gate.
  const isFormValid = form.formState.isValid && config.isRenderReady(form.getValues());

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* ─── LEFT: Form panel ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:w-[420px] lg:shrink-0">
        {/* Active renders notification — only visible when jobs exist */}
        <RenderCountIndicator />

        {/* Mobile: preview toggle button */}
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-foreground text-base font-semibold">
            {config.formSectionLabel}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobilePreview}
            aria-expanded={isMobilePreviewOpen}
            aria-controls="mobile-preview-sheet"
            aria-label={isMobilePreviewOpen
              ? videoGenerationTextMaps.previewMobileHide
              : videoGenerationTextMaps.previewMobileToggle}
            className="gap-2 transition-transform active:scale-[0.96]"
          >
            <Eye className="size-4" aria-hidden />
            {isMobilePreviewOpen
              ? videoGenerationTextMaps.previewMobileHide
              : videoGenerationTextMaps.previewMobileToggle}
          </Button>
        </div>

        {/* Desktop heading */}
        <h2 className="text-foreground hidden text-base font-semibold lg:block">
          {config.formSectionLabel}
        </h2>

        {/* Brand selector — overrides the template's fallback preset in the preview */}
        <BrandSelector value={selectedBrandId} onChange={setSelectedBrandId} />

        <config.FormComponent form={form as UseFormReturn<FieldValues>} />

        <div className="flex flex-col gap-3">
          <FormatSelector availableFormats={template.formats.map(f => f.format)} />
          <SendToRenderButton
            templateId={template.id}
            projectId={projectId}
            compositionIdPrefix={config.compositionIdPrefix}
            compositionProps={compositionProps}
            selectedFormats={selectedFormats}
            isFormValid={isFormValid}
            onJobsCreated={handleJobsCreated}
          />
        </div>

        <RenderResultsSheet />
      </div>

      {/* ─── RIGHT: Preview panel (desktop) ────────────────────────────────── */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex">
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-muted-foreground text-sm font-medium">
            {videoGenerationTextMaps.previewPanelLabel}
          </span>
          <FormatTabs
            activeFormat={activeFormat}
            formats={template.formats.map(f => f.format)}
            onFormatChange={setActiveFormat}
          />
        </div>

        {activeFormatRef && (
          <RemotionPlayerWrapper
            component={config.organism}
            compositionRef={activeFormatRef}
            compositionProps={compositionProps}
          />
        )}
      </div>

      {/* ─── Mobile: preview sheet ──────────────────────────────────────────── */}
      <Sheet open={isMobilePreviewOpen} onOpenChange={toggleMobilePreview}>
        <SheetContent
          id="mobile-preview-sheet"
          side="bottom"
          className="h-[90dvh] overflow-y-auto"
          aria-label={videoGenerationTextMaps.previewPanelLabel}
        >
          <SheetHeader>
            <SheetTitle>{videoGenerationTextMaps.previewPanelLabel}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 pt-3">
            <FormatTabs
              activeFormat={activeFormat}
              formats={template.formats.map(f => f.format)}
              onFormatChange={(fmt: VideoFormat) => {
                setActiveFormat(fmt);
              }}
            />
            {activeFormatRef && (
              <RemotionPlayerWrapper
                component={config.organism}
                compositionRef={activeFormatRef}
                compositionProps={compositionProps}
                maxHeightClass="max-h-[60dvh]"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
