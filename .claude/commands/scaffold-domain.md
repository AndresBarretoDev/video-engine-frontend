# Scaffold Domain

Crea la estructura completa de un dominio de negocio siguiendo Screaming Architecture con integración API.

**Input**: El argumento `$ARGUMENTS` es el nombre del dominio (ej: `posts`, `videos`, `projects`).

## Instrucciones

1. **Parsea el nombre**: Convierte `$ARGUMENTS` a kebab-case para directorios y PascalCase para types/funciones.

2. **Crea la estructura** en `src/domains/{domain}/`:

```
src/domains/{domain}/
├── types.ts
├── schema.ts
├── text-maps.ts
├── hooks/
├── stores/
└── components/
```

3. **Genera cada archivo** con el boilerplate correcto:

### `types.ts`
```typescript
export interface {Entity} {
  id: string;
  // TODO: Agregar campos del dominio
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface {Entity}Props {
  {entity}: {Entity};
}

export type Create{Entity}Input = Omit<{Entity}, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
export type Update{Entity}Input = Partial<Create{Entity}Input>;

export interface {Entity}Filters {
  // TODO: Agregar filtros opcionales
  skip?: number;
  take?: number;
}
```

### `schema.ts`
```typescript
import { z } from 'zod';

export const {entity}Schema = z.object({
  id: z.string().uuid(),
  // TODO: Definir campos con validación
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(),
});

export const create{Entity}Schema = {entity}Schema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const update{Entity}Schema = create{Entity}Schema.partial();

export type {Entity}FormValues = z.infer<typeof create{Entity}Schema>;
```

### `text-maps.ts`
```typescript
export const {domain}Text = {
  labels: {
    title: '{Entity}s',
    create: 'Create {Entity}',
    edit: 'Edit {Entity}',
    delete: 'Delete {Entity}',
  },
  placeholders: {
    // TODO: Agregar placeholders
  },
  errors: {
    notFound: '{Entity} not found',
    createFailed: 'Failed to create {entity}',
    updateFailed: 'Failed to update {entity}',
    deleteFailed: 'Failed to delete {entity}',
  },
  empty: {
    title: 'No {entity}s yet',
    description: 'Get started by creating your first {entity}',
    cta: 'Create {Entity}',
  },
} as const;
```

4. **Crea directorios vacíos**: `hooks/`, `stores/`, `components/`

5. **Output**: Confirma archivos creados y sugiere próximos pasos:
   - Definir campos en `types.ts`
   - Agregar validaciones en `schema.ts`
   - Crear API hooks en `hooks/` (use scaffold-api-hook command)
   - Crear componentes específicos del dominio en `components/`
