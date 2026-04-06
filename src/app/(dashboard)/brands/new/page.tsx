/**
 * OP Video Engine — Create Brand Page
 *
 * Server Component. Renders BrandForm in create mode.
 * Spec: SPEC-BRAND-005 through SPEC-BRAND-008
 */

import { BrandForm } from '@/domains/brands/components/brand-form';
import { brandsTextMaps } from '@/domains/brands/text-maps';

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {brandsTextMaps.newBrandTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {brandsTextMaps.newBrandDescription}
        </p>
      </div>
      <BrandForm />
    </div>
  );
}
