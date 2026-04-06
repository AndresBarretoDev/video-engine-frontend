# Component Architecture & shadcn/ui

**Full details**: `.claude/knowledge/architecture-patterns.md`

---

## Estructura de Componentes

```
components/
├── ui/           # shadcn (auto-instalados, NO modificar)
├── shared/       # Reutilizables cross-domain (2+ usos)
└── [en domains/] # Específicos del dominio
```

## shadcn/ui

- **Instalación**: Usar MCP shadcn automáticamente, sin preguntar
- **No modificar** archivos en `components/ui/` — componer encima
- **Componentes comunes**: button, input, form, card, dialog, dropdown-menu, select, toast, skeleton

## Pattern: Componente Reutilizable

```tsx
import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Card({ title, description, isLoading = false, children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {isLoading ? <Skeleton className="h-8 w-full" /> : children}
    </div>
  );
}
```

## Text-Maps (Obligatorio)

```typescript
// domains/{domain}/text-maps.ts
export const featureText = {
  labels: { title: 'Mi Feature', save: 'Guardar' },
  errors: { notFound: 'No encontrado', required: 'Campo requerido' },
  empty: { title: 'Sin datos', cta: 'Crear primero' },
} as const;

// En componente:
import { featureText } from '@/domains/feature/text-maps';
<h1>{featureText.labels.title}</h1>
```

## Mobile-First Responsive

```tsx
<div className="
  grid grid-cols-1 gap-4 p-4
  md:grid-cols-2 md:gap-6 md:p-6
  lg:grid-cols-3 lg:gap-8 lg:p-8
">
```

## States (Obligatorios para toda data)

| State | Componente | Pattern |
|-------|-----------|---------|
| Loading | `<Skeleton />` | Siempre con Suspense boundary |
| Error | `<Alert variant="destructive">` | Mensaje + retry |
| Empty | Icon + mensaje + CTA | Encouraging, no vacío |
| Success | `toast()` | Non-blocking notification |

## Accessibility (WCAG 2.1 AA)

- Semantic HTML (`<button>`, `<form>`, `<nav>`)
- ARIA labels en iconos: `<Button aria-label="Eliminar"><TrashIcon /></Button>`
- Keyboard nav: Tab order lógico, Escape cierra modals
- Color contrast: 4.5:1 texto normal, 3:1 texto grande
- Touch targets: min 44x44px en mobile
