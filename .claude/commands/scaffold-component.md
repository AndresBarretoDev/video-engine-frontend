# Scaffold Component

Crea un componente reutilizable con TypeScript props, text-map integration y responsive design.

**Input**: `$ARGUMENTS` tiene formato `{name}` o `{domain}/{name}` (ej: `user-card`, `posts/post-list`).

## Instrucciones

1. **Parsea el input**:
   - Sin `/`: Componente shared → `src/components/shared/{name}.tsx`
   - Con `/`: Componente de dominio → `src/domains/{domain}/components/{name}.tsx`

2. **Determina si es Server o Client Component**:
   - ¿Necesita useState, useEffect, onClick? → `"use client"`
   - ¿Solo renderiza data? → Server Component (default)

3. **Genera el componente**:

### Server Component (default)
```tsx
import type { {Entity} } from '@/domains/{domain}/types';

interface {ComponentName}Props {
  {entity}: {Entity};
  className?: string;
}

export function {ComponentName}({ {entity}, className }: {ComponentName}Props) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      {/* TODO: Implementar UI */}
      <h3 className="text-lg font-semibold">{/* text-map */}</h3>
    </div>
  );
}
```

### Client Component (si interactivo)
```tsx
'use client';

import { useState } from 'react';
import type { {Entity} } from '@/domains/{domain}/types';

interface {ComponentName}Props {
  {entity}: {Entity};
  onAction?: (id: string) => void;
  className?: string;
}

export function {ComponentName}({ {entity}, onAction, className }: {ComponentName}Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className={cn('rounded-lg border p-4', className)}>
      {/* TODO: Implementar UI */}
      <button onClick={handleToggle}>
        {/* text-map */}
      </button>
    </div>
  );
}
```

4. **Reglas aplicadas automáticamente**:
   - Named export (nunca default)
   - Props interface con `className?` opcional
   - Mobile-first responsive
   - Boolean props con prefix `is/has/should`
   - Event handlers con prefix `handle`
   - Types importados desde dominio o `/types/`

5. **Output**: Confirma archivo creado y recuerda:
   - Agregar al text-map del dominio
   - Verificar si necesita loading state
   - Considerar si es reutilizable (2+ usos → shared/)
