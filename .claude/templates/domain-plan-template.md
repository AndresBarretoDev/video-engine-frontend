# {Feature} - Domain Business Logic Plan

**Created**: {date}
**Session**: {session_id}
**Domain**: {domain-name}
**Complexity**: Low | Medium | High

---

## 1. Business Context

**Problem**: {What business problem are we solving?}
**Goal**: {Primary objective}
**Success Metric**: {How to measure success}

### User Stories
- As a {user}, I want to {action} so that {benefit}

## 2. Domain Model

### Core Entity: `{EntityName}`

```typescript
// src/domains/{domain}/types.ts
export interface {EntityName} {
  id: string;
  {attribute}: {type};
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

### Related Entities
- **{Entity}**: {relationship} (one-to-many, many-to-many)

## 3. Validation Schema

```typescript
// src/domains/{domain}/schema.ts
export const create{Entity}Schema = z.object({
  {field}: z.string().min(1, "{error}"),
});
```

## 4. Business Rules

1. **{Rule}**: {description} → Error: "{message}"
2. **{Rule}**: {description} → Error: "{message}"

### Invariants (siempre true)
- {invariant}

## 5. API Operations

| Hook | Method | Endpoint | Auth |
|------|--------|----------|------|
| useCreate{Entity} | POST | /{domain} | JWT required |
| useUpdate{Entity} | PUT | /{domain}/{id} | JWT + owner or admin |
| useDelete{Entity} | DELETE | /{domain}/{id} | JWT + owner or admin |
| useGet{Entity} | GET | /{domain}/{id} | JWT optional |
| useList{Entities} | GET | /{domain} | JWT optional |

## 6. React Query Hooks

### Query Hooks
- **`useGet{Entity}(id)`** — Fetch single entity, cache with queryKey: ['{domain}', '{entity}', id]
- **`useList{Entities}(filters?)`** — Fetch list with filters, cache with queryKey: ['{domain}', '{entities}', filters]

### Mutation Hooks
- **`useCreate{Entity}()`** — POST to /{domain}, invalidate list queries on success
- **`useUpdate{Entity}()`** — PUT to /{domain}/{id}, invalidate related queries on success
- **`useDelete{Entity}()`** — DELETE /{domain}/{id}, invalidate list queries on success

## 7. State Management

| State | Tool | Location |
|-------|------|----------|
| {Entity} data | React Query | hooks/use-{entity}.ts |
| UI filters/selection | Zustand | stores/{domain}-ui-store.ts |

## 8. Files to Create

- `src/domains/{domain}/types.ts`
- `src/domains/{domain}/schema.ts`
- `src/domains/{domain}/text-maps.ts`
- `src/domains/{domain}/hooks/use-get-{entity}.ts`
- `src/domains/{domain}/hooks/use-list-{entities}.ts`
- `src/domains/{domain}/hooks/use-create-{entity}.ts`
- `src/domains/{domain}/hooks/use-update-{entity}.ts`
- `src/domains/{domain}/hooks/use-delete-{entity}.ts`

## 9. Implementation Steps

1. Create types and interfaces
2. Define Zod schemas (for validation)
3. Create API hooks using apiClient
4. Create Zustand store (if UI state needed)
5. Create domain-specific components
