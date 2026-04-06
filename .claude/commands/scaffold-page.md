# Scaffold Page

Crea una page ultra-limpia de Next.js con Suspense, loading states y Server Component por defecto.

**Input**: `$ARGUMENTS` es la ruta de la page (ej: `posts`, `dashboard/settings`).

## Instrucciones

1. **Parsea la ruta**: Convierte `$ARGUMENTS` a la estructura de App Router.

2. **Crea los archivos**:

### `src/app/{route}/page.tsx` (Server Component)
```tsx
import { Suspense } from 'react';
import { {PageName}Content } from './_components/{page-name}-content';
import { {PageName}Loading } from './_components/{page-name}-loading';

export default async function {PageName}Page() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          {/* TODO: Usar text-map */}
          Page Title
        </h1>

        <Suspense fallback={<{PageName}Loading />}>
          <{PageName}Content />
        </Suspense>
      </div>
    </div>
  );
}
```

### `src/app/{route}/_components/{page-name}-content.tsx`
```tsx
'use client';

import { useList{Entities} } from '@/domains/{domain}/hooks/use-list-{entities}';
import { Skeleton } from '@/components/ui/skeleton';

export function {PageName}Content() {
  const { data: items, isLoading, error } = useList{Entities}();

  if (error) {
    return <p className="text-destructive">Error loading {entities}</p>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No {entities} found</p>
      </div>
    );
  }

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        // TODO: Render {entity} item
        <div key={item.id} className="rounded-lg border p-4">
          {item.name}
        </div>
      ))}
    </section>
  );
}
```

### `src/app/{route}/_components/{page-name}-loading.tsx`
```tsx
import { Skeleton } from '@/components/ui/skeleton';

export function {PageName}Loading() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}
```

3. **Reglas**:
   - Page es Server Component (no `"use client"`)
   - Content component es Client Component (usa React Query hooks)
   - Suspense wrapping obligatorio para async operations
   - Mobile-first responsive (grid-cols-1 → md:2 → lg:3)
   - Loading usa Skeleton de shadcn

4. **Output**: Confirma archivos creados y sugiere:
   - Conectar con hooks de React Query del dominio
   - Actualizar text-maps
   - Agregar error boundary si necesario
