'use client';

/**
 * OP Video Engine — Brand Edit View
 *
 * Tabbed brand edit page: Overview (name, description, logo) | Design Tokens (colors, fonts).
 * Fetches brand by ID. Handles loading and error states.
 */

import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorAlert } from '@/components/shared/error-alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBrand } from '../hooks/use-brands';
import { brandsTextMaps } from '../text-maps';
import { BrandForm } from './brand-form';
import { BrandTokensForm } from './brand-tokens-form';

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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            {brandsTextMaps.tabOverview}
          </TabsTrigger>
          <TabsTrigger value="tokens">{brandsTextMaps.tabTokens}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <BrandForm key={brand.id} brand={brand} />
        </TabsContent>

        <TabsContent value="tokens" className="mt-6">
          <BrandTokensForm brand={brand} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
