---
name: nextjs-domain-scaffold
description: >
  Scaffolds a complete Next.js domain following Screaming Architecture and domain-driven design.
  Use this skill whenever the user wants to create a new domain, feature, or module in a Next.js
  project — including when they say "create a domain for X", "add a new feature", "scaffold auth",
  "set up a users module", "I need CRUD for X", or any similar request that involves creating
  business logic for a new entity or domain. Also trigger when the user mentions needing types,
  schemas, Server Actions, hooks, or stores for a new domain together.
---

# Next.js Domain Scaffold Skill

Creates a complete, production-ready domain structure following Screaming Architecture, domain-driven design, Next.js 15 Server Actions, and React Query patterns.

## What this skill produces

A full domain at `src/domains/{domain}/` with:
- `types.ts` — TypeScript entities, DTOs, enums
- `schema.ts` — Zod validation schemas
- `actions.ts` — Server Actions (CRUD) with session validation
- `text-maps.ts` — All UI strings externalized
- `hooks/use-{domain}.ts` — React Query hooks
- `stores/{domain}-ui-store.ts` — Zustand UI state store

## Execution Steps

### Step 1 — Gather Context

Before generating any file, identify:

1. **Domain name** — from user input (e.g. "tasks", "products", "invoices")
2. **Entity attributes** — what fields does the entity have? Ask if not clear.
3. **Project path** — default `src/domains/{domain}/`. Confirm if different.
4. **Supabase table name** — usually same as domain (plural). Note it for SQL hint.

If the user's request is vague (e.g. "create a tasks domain"), infer reasonable defaults for a task entity (id, title, status, userId, timestamps) and tell the user what you assumed.

### Step 2 — Generate types.ts

```typescript
// src/domains/{domain}/types.ts

export type {DomainStatus} = 'active' | 'archived' | 'deleted';

export interface {Entity} {
  id: string;
  userId: string;
  // --- domain-specific fields ---
  name: string;
  status: {DomainStatus};
  // --- timestamps ---
  createdAt: string;
  updatedAt: string;
}

export type Create{Entity}Input = Pick<{Entity}, 'name' | 'status'>;
export type Update{Entity}Input = Partial<Create{Entity}Input>;
```

Adapt fields to the actual domain. Always include `id`, `userId`, `createdAt`, `updatedAt`.

### Step 3 — Generate schema.ts

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

Mirror every field from types.ts with appropriate Zod validators.

### Step 4 — Generate actions.ts

```typescript
// src/domains/{domain}/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { create{Entity}Schema, update{Entity}Schema } from './{domain}/schema';
import type { {Entity} } from './{domain}/types';

// Helper — validates session, throws if unauthenticated
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

### Step 5 — Generate text-maps.ts

```typescript
// src/domains/{domain}/text-maps.ts
export const {domain}Text = {
  labels: {
    title: '{Domain} title',
    create: 'Crear {entity}',
    edit: 'Editar {entity}',
    delete: 'Eliminar {entity}',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
  status: {
    active: 'Activo',
    archived: 'Archivado',
    deleted: 'Eliminado',
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

### Step 6 — Generate hooks/use-{domain}.ts

Create this file at: `src/domains/{domain}/hooks/use-{domain}.ts` (inside the `hooks/` subdirectory)

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

### Step 7 — Generate stores/{domain}-ui-store.ts

Create this file at: `src/domains/{domain}/stores/{domain}-ui-store.ts` (inside the `stores/` subdirectory)

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

### Step 8 — Supabase SQL hint

After creating all files, output a SQL migration hint (don't create the file — just show it as reference):

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

## Output Summary

After generating all files, show:

> ⚠️ File placement is critical: `use-{domain}.ts` MUST be inside `hooks/` subdirectory, and `{domain}-ui-store.ts` MUST be inside `stores/` subdirectory. Never place them at the domain root.

```
✅ Domain "{domain}" created
─────────────────────────────────
src/domains/{domain}/
├── types.ts              (Entity types and DTOs)
├── schema.ts             (Zod validation schemas)
├── actions.ts            (Server Actions: get/create/update/delete)
├── text-maps.ts          (UI strings)
├── hooks/
│   └── use-{domain}.ts   (React Query hooks)         ← MUST be inside hooks/
└── stores/
    └── {domain}-ui-store.ts  (Zustand UI state)      ← MUST be inside stores/

📌 Next steps:
  1. Run Supabase migration (SQL shown above)
  2. Add RLS policies if not using the suggested ones
  3. Create page: src/app/{domain}/page.tsx
  4. Install shadcn components as needed
```

## Rules

- Always use named exports (never `export default`)
- Always use absolute imports with `@/`
- Supabase client: `createServerClient(cookies())` from `@/lib/supabase/server`
- Every Server Action MUST validate session before any DB operation
- Zustand store ONLY for UI state (selected, open/close, filters) — never server data
- React Query for all server data fetching and mutations
- Types from `types.ts` are the source of truth — schema mirrors them with Zod validators
