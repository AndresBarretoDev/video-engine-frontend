/**
 * OP Video Engine — Brand Detail / Edit Page
 *
 * Server Component. Renders BrandForm in edit mode.
 * The form fetches brand data via useBrand(id) client-side.
 * Spec: SPEC-BRAND-009, SPEC-BRAND-010
 */

import { BrandEditView } from '@/domains/brands/components/brand-edit-view';

interface BrandDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BrandDetailPage({
  params
}: BrandDetailPageProps) {
  const { id } = await params;
  return <BrandEditView id={id} />;
}
