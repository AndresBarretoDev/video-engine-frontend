# Review Code

Valida un archivo o directorio contra las 10 reglas críticas del proyecto.

**Input**: `$ARGUMENTS` es la ruta del archivo o directorio a revisar.

## Instrucciones

1. **Lee el archivo** (o archivos del directorio) especificado en `$ARGUMENTS`.

2. **Ejecuta cada check** de la siguiente lista. Para cada uno, reporta ✅ PASS, ⚠️ WARNING, o ❌ FAIL con línea específica.

### Checks

**1. Componentes Reutilizables**
- Busca patrones UI duplicados en el archivo y archivos cercanos
- Si hay 2+ patrones similares → ⚠️ Considerar extraer a shared/

**2. Separación de Concerns**
- ❌ Lógica de negocio en componentes (cálculos, transformaciones complejas)
- ❌ Constantes hardcodeadas inline
- ❌ Types/interfaces definidos dentro del componente

**3. Types Externos**
- ❌ `interface` o `type` definido dentro de archivos .tsx de componentes
- ✅ Props types importados desde `/types/` o `domains/{d}/types.ts`

**4. Pages Limpias**
- Solo aplica a `page.tsx`: ❌ useState, useEffect, fetch directo, lógica compleja
- ✅ Solo composición de componentes + Suspense

**5. Server Components Default**
- ❌ `"use client"` sin justificación (no usa useState/useEffect/onClick/browser APIs)
- ✅ Sin directive = Server Component

**6. Mobile-First**
- ❌ Breakpoints desktop-first (`lg:w-1/3 md:w-1/2 w-full`)
- ✅ Mobile base con progressive enhancement (`w-full md:w-1/2 lg:w-1/3`)

**7. Naming Conventions**
- ❌ Archivos no en kebab-case
- ❌ Boolean sin is/has/should prefix
- ❌ Handlers sin handle prefix
- ❌ Directorios no en kebab-case

**8. Imports Absolutos**
- ❌ Imports relativos (`../`, `./` excepto en mismo directorio)
- ✅ `@/` prefix

**9. Named Exports**
- ❌ `export default` (excepto page.tsx, layout.tsx)
- ✅ `export function`, `export const`

**10. API & State Management**
- ❌ Zustand con datos del servidor (fetched data)
- ❌ useState para forms complejos (debe ser React Hook Form)
- ❌ Llamadas fetch directo o axios (debe usar apiClient)
- ✅ React Query para server state
- ✅ Zustand solo para UI state
- ✅ apiClient centralizado para todas las llamadas API

### Checks adicionales para API Hooks
- ❌ Sin validación de respuesta (Zod)
- ❌ Sin manejo de errores
- ❌ apiClient no utilizado

### Checks adicionales para Auth
- ❌ Sin validación de JWT en apiClient
- ❌ Sin role-based access control
- ❌ Sin guards en componentes protegidos

3. **Output**:

```
📋 Code Review: {file-path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ✅ PASS | ⚠️ WARNINGS | ❌ ISSUES FOUND

Checks:
  ✅ Types externos
  ✅ Named exports
  ⚠️ Posible componente reutilizable (línea 42-58)
  ❌ Import relativo en línea 3: `import { x } from '../utils'`
  ❌ Boolean sin prefix en línea 15: `const loading = true`

Fixes Required:
  1. Línea 3: Cambiar a `import { x } from '@/utils'`
  2. Línea 15: Renombrar a `isLoading`

Recommendations:
  - Considerar extraer el card pattern a components/shared/
  - Agregar loading state (Skeleton)
```

4. **Regla**: Ser específico con líneas. No reportar false positives. Ser constructivo.
