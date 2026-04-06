---
name: nextjs-domain-scaffold
description: Scaffolds a complete Next.js domain following Screaming Architecture and domain-driven design. Use this skill whenever the user wants to create a new domain, feature, or module in a Next.js project — including when they say "create a domain for X", "add a new feature", "scaffold auth", "set up a users module", "I need CRUD for X", or any similar request that involves creating business logic for a new entity or domain. Also trigger when the user mentions needing types, schemas, Server Actions, hooks, or stores for a new domain together.
license: MIT
metadata:
  author: andres
  version: "1.0.0"
---

# Next.js Domain Scaffold

Creates a complete, production-ready domain structure following Screaming Architecture, domain-driven design, Next.js 15 Server Actions, and React Query patterns.

## What This Skill Produces

A full domain at `src/domains/{domain}/` with these files in the correct locations:

```
src/domains/{domain}/
├── types.ts              ← Entity types, DTOs, enums
├── schema.ts             ← Zod validation schemas
├── actions.ts            ← Server Actions (CRUD) with session validation
├── text-maps.ts          ← All UI strings externalized
├── hooks/
│   └── use-{domain}.ts   ← React Query hooks   (MUST be inside hooks/)
└── stores/
    └── {domain}-ui-store.ts  ← Zustand UI state  (MUST be inside stores/)
```

## Step 1 — Gather Context

Before generating any file, identify:

1. **Domain name** — from user input (e.g. "tasks", "products", "invoices")
2. **Entity attributes** — ask if not clear; for vague requests infer sensible defaults and state what you assumed
3. **Project path** — default `src/domains/{domain}/`
4. **Supabase table name** — usually the domain name (plural)

## Step 2 — Generate types.ts

```typescript
// src/domains/{domain}/types.ts

export type {Domain}Status = 'active' | 'archived' | 'deleted';

export interface {Entity} {
  id: string;
  userId: string;
  // domain-specific fields here
  name: string;
  status: {Domain}Status;
  createdAt: string;
  updatedAt: string;
}

export type Create{Entity}Input = Pick<{Entity}, 'name' | 'status'>;
export type Update{Entity}Input = Partial<Create{Entity}Input>;
```

Always include `id`, `userId`, `createdAt`, `updatedAt`. Adapt all other fields to the actual domain.

## Step 3 — Generate schema.ts

```typescript
// src/domains/{domain}/schema.ts
import { z } from 'zod';

export const create{Entity}Schema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(255),
  status: z.enum(['active', 'archived', 'deleted']).default('active'),
});

export const update{Entity}Schema = create{Entity}Schema.partial();

export type Create{Entity}Input = z.infer<typeof create{Entity}Schema>;
export type Update{Entity}Input = z.infer<typeof update{Entity}Schema>;
```

Mirror every field from `types.ts` with appropriate Zod validators.

## Step 4 — Generate actions.ts

```typescript
// src/domains/{domain}/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { create{Entity}Schema, update{Entity}Schema } from '@/domains/{domain}/schema';
import type { {Entity} } from '@/domains/{domain}/types';

async function requireAuth() {
  const supabase = createServerClient(cookies());
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return { supabase, user };
}

export async function get{Entities}(): Promise<{Entity}[]> {
  const { supabase, user } = await requireAuth();
  const { data, error } = await supabase
    .from('{table}')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function get{Entity}ById(id: string): Promise<{Entity} | null> {
  const { supabase } = await requireAuth();
  const { data, error } = await supabase
    .from('{table}').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function create{Entity}(input: unknown) {
  const { supabase, user } = await requireAuth();
  const parsed = create{Entity}Schema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  try {
    const { data, error } = await supabase
      .from('{table}')
      .insert({ ...parsed.data, user_id: user.id })
      .select().single();
    if (error) throw error;
    revalidatePath('/{domain}');
    return { success: true, data };
  } catch (err) {
    console.error('[create{Entity}]', err);
    return { success: false, error: 'No se pudo crear el registro' };
  }
}

export async function update{Entity}(id: string, input: unknown) {
  const { supabase, user } = await requireAuth();
  const parsed = update{Entity}Schema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.message);
  try {
    const { data, error } = await supabase
      .from('{table}')
      .update(parsed.data)
      .eq('id', id).eq('user_id', user.id)
      .select().single();
    if (error) throw error;
    revalidatePath('/{domain}');
    return { success: true, data };
  } catch (err) {
    console.error('[update{Entity}]', err);
    return { success: false, error: 'No se pudo actualizar el registro' };
  }
}

export async function delete{Entity}(id: string) {
  const { supabase, user } = await requireAuth();
  try {
    const { error } = await supabase
      .from('{table}').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;
    revalidatePath('/{domain}');
    return { success: true };
  } catch (err) {
    console.error('[delete{Entity}]', err);
    return { success: false, error: 'No se pudo eliminar el registro' };
  }
}
```

## Step 5 — Generate text-maps.ts

```typescript
// src/domains/{domain}/text-maps.ts
export const {domain}Text = {
  labels: {
    title: '{Domain}',
    create: 'Crear {entity}',
    edit: 'Editar {entity}',
    delete: 'Eliminar {entity}',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  errors: {
    notFound: '{Entity} no encontrado',
    required: 'Campo requerido',
    createFailed: 'No se pudo crear el registro',
    updateFailed: 'No se pudo actualizar',
    deleteFailed: 'No se pudo eliminar',
  },
  empty: {
    title: 'Sin {domain}',
    description: 'Crea tu primer {entity} para comenzar',
    cta: 'Crear {entity}',
  },
  success: {
    created: '{Entity} creado exitosamente',
    updated: '{Entity} actualizado',
    deleted: '{Entity} eliminado',
  },
} as const;
```

## Step 6 — Generate hooks/use-{domain}.ts

**File path**: `src/domains/{domain}/hooks/use-{domain}.ts` — must be inside the `hooks/` subdirectory.

```typescript
// src/domains/{domain}/hooks/use-{domain}.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  get{Entities},
  get{Entity}ById,
  create{Entity},
  update{Entity},
  delete{Entity},
} from '@/domains/{domain}/actions';

const QUERY_KEY = ['{domain}'] as const;

export function use{Entities}() {
  return useQuery({
    queryKey: [...QUERY_KEY, 'list'],
    queryFn: get{Entities},
  });
}

export function use{Entity}(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => get{Entity}ById(id),
    enabled: !!id,
  });
}

export function useCreate{Entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create{Entity},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdate{Entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      update{Entity}(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDelete{Entity}() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete{Entity},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
```

## Step 7 — Generate stores/{domain}-ui-store.ts

**File path**: `src/domains/{domain}/stores/{domain}-ui-store.ts` — must be inside the `stores/` subdirectory.

```typescript
// src/domains/{domain}/stores/{domain}-ui-store.ts
import { create } from 'zustand';

interface {Domain}UIState {
  selectedId: string | null;
  isFormOpen: boolean;
  filterStatus: string;
  setSelectedId: (id: string | null) => void;
  openForm: () => void;
  closeForm: () => void;
  setFilterStatus: (status: string) => void;
  reset: () => void;
}

const initialState = {
  selectedId: null,
  isFormOpen: false,
  filterStatus: 'all',
};

export const use{Domain}UIStore = create<{Domain}UIState>((set) => ({
  ...initialState,
  setSelectedId: (id) => set({ selectedId: id }),
  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false, selectedId: null }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  reset: () => set(initialState),
}));
```

**Zustand stores are for UI state only**: selected items, open/close dialogs, active filters. Never store server data here — that belongs in React Query.

## Step 8 — SQL Migration Hint

Output this as a reference block (do not create the file automatically):

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_{table}.sql
CREATE TABLE {table} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own {table}"
  ON {table} FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_{table}_user ON {table}(user_id);
CREATE INDEX idx_{table}_status ON {table}(status);
```

## Invariants (Never Violate)

- Named exports only — never `export default`
- Absolute imports with `@/` — never relative `../../`
- Supabase auth: always `createServerClient(cookies())` + `supabase.auth.getUser()`
- Every Server Action validates session before any DB operation
- React Query for server data, Zustand for UI state only
- `hooks/` and `stores/` are subdirectories — files never go at the domain root
