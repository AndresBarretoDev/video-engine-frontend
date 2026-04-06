'use client';

/**
 * OP Video Engine — Brand Edit View
 *
 * Client Component that fetches a brand by ID and renders BrandForm in edit mode.
 * Handles loading and error states before passing data to the form.
 *
 * Spec: SPEC-BRAND-009
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';
import { useBrand } from '../hooks/use-brands';
import { brandsTextMaps } from '../text-maps';
import { BrandForm } from './brand-form';

interface BrandEditViewProps {
  id: string;
}

export function BrandEditView({ id }: BrandEditViewProps) {
  const { data: brand, isLoading, error, refetch } = useBrand(id);

  if (isLoading) {
    return <PageSkeleton variant="detail" />;
  }

  if (error || !brand) {
    return (
      <ErrorAlert
        message={error?.message || brandsTextMaps.errorLoad}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {brandsTextMaps.editBrandTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {brandsTextMaps.editBrandDescription}
        </p>
      </div>
      <BrandForm key={brand.id} brand={brand} />
    </div>
  );
}
