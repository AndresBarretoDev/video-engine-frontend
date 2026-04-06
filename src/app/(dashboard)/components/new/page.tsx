/**
 * OP Video Engine — Register Component Page
 *
 * Server Component. Renders ComponentForm in create mode.
 * Spec: SPEC-COMP-002
 */

import { ComponentForm } from '@/domains/components-registry/components/component-form';
import { componentsRegistryTextMaps } from '@/domains/components-registry/text-maps';

export default function NewComponentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {componentsRegistryTextMaps.newComponentTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {componentsRegistryTextMaps.newComponentDescription}
        </p>
      </div>
      <ComponentForm />
    </div>
  );
}
