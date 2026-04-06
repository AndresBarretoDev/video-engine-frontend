# {Feature} - UX/UI Design Plan

**Created**: {date}
**Session**: {session_id}
**Complexity**: Low | Medium | High

---

## 1. User Context

**Goal**: {What user wants to achieve}
**Persona**: {Who is the main user}
**Journey**: [Entry] → [Action 1] → [Feedback] → [Success]

## 2. shadcn/ui Components

### To Install
```bash
npx shadcn@latest add {component1} {component2} {component3}
```

### Component Usage

| Component | Purpose | Variant |
|-----------|---------|---------|
| button | Primary actions | default, destructive |
| card | Content containers | default |
| dialog | Modals | - |
| form | Form structure | React Hook Form |

### Existing to Reuse
- `@/components/ui/{component}` — {usage}

## 3. Layout

### Mobile (default, < 640px)
- Single column, stacked
- Full-width buttons
- Priority: critical info only

### Tablet (md: 640px+)
- 2-column grid where appropriate
- Auto-width buttons

### Desktop (lg: 1024px+)
- Multi-column, sidebars
- Inline actions, hover states

### Grid Pattern
```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
```

## 4. Component Composition

### `{ComponentName}`
**Base**: {shadcn component}
**Props**: {key props}
**Location**: `components/shared/` or `domains/{d}/components/`

## 5. Text-Maps

```typescript
export const {feature}Text = {
  labels: { title: '', save: '', cancel: '' },
  errors: { generic: '', notFound: '' },
  empty: { title: '', description: '', cta: '' },
  success: { created: '', updated: '' },
};
```

## 6. States

| State | Component | Pattern |
|-------|-----------|---------|
| Loading | Skeleton | Suspense boundary |
| Error | Alert destructive | Retry button |
| Empty | Icon + message + CTA | Encouraging |
| Success | Toast | Non-blocking |

## 7. Accessibility

- [ ] Semantic HTML (button, form, nav)
- [ ] ARIA labels on icon-only buttons
- [ ] Keyboard: Tab order, Escape to close
- [ ] Color contrast: 4.5:1
- [ ] Touch targets: 44x44px min

## 8. Files to Create

- `components/shared/{component}.tsx` — {purpose}
- `domains/{domain}/components/{component}.tsx` — {purpose}
- `domains/{domain}/text-maps.ts` — UI strings
