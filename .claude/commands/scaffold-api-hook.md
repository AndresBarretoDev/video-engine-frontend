# Scaffold API Hook

Crea un React Query hook para consumir API del backend NestJS con validación de respuesta y manejo de errores.

**Input**: `$ARGUMENTS` tiene formato `{domain}/{hook-name}` (ej: `posts/use-get-posts`, `videos/use-create-video`).

## Instrucciones

1. **Parsea el input**: Extrae dominio y nombre del hook de `$ARGUMENTS`.

2. **Verifica si existe** `src/domains/{domain}/hooks/`:
   - Si no existe: **crea** el directorio
   - Si existe: agrega el nuevo hook al directorio

3. **Determina el tipo de hook** basado en el nombre:
   - `use-get-*` → useQuery (GET)
   - `use-list-*` → useQuery (GET con paginación)
   - `use-create-*` → useMutation (POST)
   - `use-update-*` → useMutation (PUT/PATCH)
   - `use-delete-*` → useMutation (DELETE)

4. **Genera el hook correcto**:

### Para Query (GET) - `use-get-{entity}.ts`
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { {Entity}Schema } from '../schema';
import type { {Entity} } from '../types';

const QUERY_KEY = ['{domain}', '{entity}'] as const;

export function useGet{Entity}(id: string, enabled = true) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const response = await apiClient.get(`/{domain}/${id}`);
      return {Entity}Schema.parse(response);
    },
    enabled,
  });
}
```

### Para Query con lista (GET) - `use-list-{entities}.ts`
```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { {Entity}Schema } from '../schema';
import type { {Entity}, {Entity}Filters } from '../types';

const QUERY_KEY = ['{domain}', '{entities}'] as const;

export function useList{Entities}(filters?: {Entity}Filters) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get('/{domain}', { params: filters });
      return response.map((item: unknown) => {Entity}Schema.parse(item));
    },
  });
}
```

### Para Mutation (POST) - `use-create-{entity}.ts`
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { create{Entity}Schema } from '../schema';
import type { {Entity} } from '../types';

const QUERY_KEY = ['{domain}'] as const;

export function useCreate{Entity}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = create{Entity}Schema.parse(data);
      const response = await apiClient.post('/{domain}', validated);
      return response as {Entity};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

### Para Mutation (PUT/PATCH) - `use-update-{entity}.ts`
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { update{Entity}Schema } from '../schema';
import type { {Entity} } from '../types';

const QUERY_KEY = ['{domain}'] as const;

export function useUpdate{Entity}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const validated = update{Entity}Schema.parse(data);
      const response = await apiClient.put(`/{domain}/${id}`, validated);
      return response as {Entity};
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

### Para Mutation (DELETE) - `use-delete-{entity}.ts`
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

const QUERY_KEY = ['{domain}'] as const;

export function useDelete{Entity}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/{domain}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

5. **Output**: Confirma el hook creado y recuerda:
   - Hook es `'use client'` (usa hooks de React)
   - Validar respuesta con Zod schema
   - Usar apiClient centralizado (no fetch directo)
   - Invalidar queries relacionadas en onSuccess
   - Manejar errores con try-catch en mutationFn
