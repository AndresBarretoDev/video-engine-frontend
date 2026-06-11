'use client';

/**
 * Template Authoring Registry
 *
 * The single place that wires each video template to everything the authoring
 * view needs to render it: organism, form schema, form component, default form
 * values, prop assembler, brand preset, and composition-id prefix.
 *
 * Keyed by `componentId` (the field on TemplateDescriptor served by GET /templates).
 *
 * ➕ Adding a new template = ONE entry here. No hardcoded organism/form/prefix
 * anywhere else. This mirrors the gallery's ORGANISM_REGISTRY (template-card.tsx)
 * but covers the full authoring surface, not just the preview.
 */

import type { FieldValues, UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

import { LoopingProductPromo } from '@/remotion/components/organisms/looping-product-promo/LoopingProductPromo';
import { StayPromo } from '@/remotion/components/organisms/stay-promo/StayPromo';
import { OP_BRAND_PRESET } from '@/remotion/brand-presets/op.preset';
import { AIRBNB_BRAND_PRESET } from '@/remotion/brand-presets/airbnb.preset';
import type { BrandConfig } from '@/remotion/types/brand-config.types';

import {
  productFormSchema,
  stayFormSchema,
  type ProductFormValues,
  type StayFormValues
} from '@/domains/video-generation/schema';
import {
  assembleCompositionProps,
  assembleStayCompositionProps
} from '@/domains/video-generation/utils/assemble-composition-props';
import type {
  AuthoringState,
  AssembledTemplateProps
} from '@/domains/video-generation/types';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';

import { ProductForm } from './product-form';
import { StayForm } from './stay-form';

// ─── Config shape ───────────────────────────────────────────────────────────

/**
 * A render-ready image URL must be public (server-reachable), never a local
 * blob: objectURL — the backend cannot fetch a blob: that lives in this browser.
 */
function isPublicImageUrl(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0 && !value.startsWith('blob:');
}

export interface TemplateAuthoringConfig<
  TFormValues extends FieldValues = FieldValues
> {
  /** Matches TemplateDescriptor.componentId (e.g. "LoopingProductPromo"). */
  componentId: string;
  /** Remotion organism rendered by @remotion/player. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  organism: React.ComponentType<any>;
  /** Zod schema validating this template's form. */
  formSchema: ZodType<TFormValues>;
  /** Initial RHF values (empty form — placeholders guide the user). */
  defaultFormValues: TFormValues;
  /** Representative values shown in the live preview BEFORE the user types anything. */
  previewFormValues: TFormValues;
  /** Presentational form component for this template. */
  FormComponent: React.ComponentType<{ form: UseFormReturn<TFormValues> }>;
  /** Pure mapper: authoring state → organism props. */
  assembleProps: (state: AuthoringState<TFormValues>) => AssembledTemplateProps;
  /** Fallback brand identity for the preview when no brand is selected (or the
   *  selected brand has no usable design tokens). The brand selector overrides this. */
  fallbackBrandPreset: BrandConfig;
  /** compositionId prefix — final id is `${prefix}-${format}` (e.g. stay-promo-16-9). */
  compositionIdPrefix: string;
  /** Form section heading. */
  formSectionLabel: string;
  /** Render gate: true when values are complete enough AND image is a public URL. */
  isRenderReady: (values: TFormValues) => boolean;
}

// ─── Entries ──────────────────────────────────────────────────────────────────

const loopingProductPromoConfig: TemplateAuthoringConfig<ProductFormValues> = {
  componentId: 'LoopingProductPromo',
  organism: LoopingProductPromo,
  formSchema: productFormSchema,
  defaultFormValues: {
    productName: '',
    productImage: '',
    priceCurrent: '',
    priceOriginal: '',
    promoTag: '',
    ctaText: 'Shop Now',
    legalText: ''
  },
  previewFormValues: {
    productName: 'Product Name',
    productImage: 'https://placehold.co/600x600/4361EF/FFFFFF?text=Product',
    priceCurrent: '49.99',
    priceOriginal: '79.99',
    promoTag: '30% OFF',
    ctaText: 'Shop Now',
    legalText: ''
  },
  FormComponent: ProductForm,
  assembleProps: assembleCompositionProps,
  fallbackBrandPreset: OP_BRAND_PRESET,
  compositionIdPrefix: 'looping-product-promo',
  formSectionLabel: t.formSectionLabel,
  isRenderReady: values => isPublicImageUrl(values.productImage)
};

const stayPromoConfig: TemplateAuthoringConfig<StayFormValues> = {
  componentId: 'StayPromo',
  organism: StayPromo,
  formSchema: stayFormSchema,
  defaultFormValues: {
    listingName: '',
    location: '',
    heroImage: '',
    rating: '',
    reviewCount: '',
    pricePerNight: '',
    currency: '$',
    ctaText: 'Book now',
    legalText: ''
  },
  previewFormValues: {
    listingName: 'Beautiful Beach House',
    location: 'Malibu, California',
    heroImage: 'https://placehold.co/1080x920/FF5A5F/FFFFFF?text=Stay',
    rating: '4.92',
    reviewCount: '128 reviews',
    pricePerNight: '250',
    currency: '$',
    ctaText: 'Book now',
    legalText: ''
  },
  FormComponent: StayForm,
  assembleProps: assembleStayCompositionProps,
  fallbackBrandPreset: AIRBNB_BRAND_PRESET,
  compositionIdPrefix: 'stay-promo',
  formSectionLabel: t.stayFormSectionLabel,
  isRenderReady: values => isPublicImageUrl(values.heroImage)
};

// ─── Registry ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATE_AUTHORING_REGISTRY: Record<string, TemplateAuthoringConfig<any>> = {
  [loopingProductPromoConfig.componentId]: loopingProductPromoConfig,
  [stayPromoConfig.componentId]: stayPromoConfig
};

/**
 * Resolve the authoring config for a template's componentId.
 * Returns undefined when no organism/form is registered for it yet.
 */
export function getTemplateAuthoringConfig(
  componentId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TemplateAuthoringConfig<any> | undefined {
  return TEMPLATE_AUTHORING_REGISTRY[componentId];
}
