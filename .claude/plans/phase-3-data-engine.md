# Phase 3: Data Engine — Camino A Plan (Quick Win Híbrido)

**Phase:** 3 — Data Engine + Exportador JSON AE
**Date:** 2026-05-13
**Status:** Planning
**Branch:** feat/phase-4 (continues from current work)
**Strategy:** Camino A de Estrategia Híbrida — plataforma genera JSON que el script JSX de Lizeth consume directamente en After Effects.

---

## Contexto

### Por qué este plan ahora
La Estrategia Híbrida adoptada tras analizar `docs/AE-INTEGRATION.md` define que **el Data Engine debe poder exportar el JSON en el formato exacto que el script JSX de Lizeth ya entiende**. Esto desbloquea inmediato:

- Lizeth deja de preparar JSONs manualmente (su tarea más repetitiva)
- Cualquier persona del equipo puede preparar datos en la plataforma
- AE sigue siendo el motor de render local (sin tocar nada de su workflow)
- Quick win demostrable en 1 semana

### Sin esto, ¿qué falla?
La plataforma no puede ofrecerle valor a Lizeth hasta que Phase 1 (Remotion components) esté completa — meses. Camino A es el puente que entrega valor YA.

---

## Estado Actual del Data Engine (Audit)

| Artifact | Estado | Ubicación |
|----------|--------|-----------|
| Types completos | ✅ Done | `src/domains/data-engine/types.ts` (8.9k) |
| Zod schemas | ✅ Done | `src/domains/data-engine/schema.ts` (5.5k) |
| Text-maps | ✅ Done | `src/domains/data-engine/text-maps.ts` (15k) |
| Hooks React Query | ✅ Done | `src/domains/data-engine/hooks/` |
| Componentes UI (tabs, mapping, preview, selection) | ✅ Done | `src/domains/data-engine/components/` |
| Ruta `/projects/[id]/data` | ✅ Done | `src/app/(dashboard)/projects/[id]/data/page.tsx` |
| Send to Render integration | ✅ Done | `selection-bar.tsx` + `send-to-render-dialog.tsx` |
| **Exportador JSON formato AE** | ❌ MISSING | A construir |
| Backend endpoint Data Engine | ❓ TBD | Verificar qué hay en backend |

**Conclusión**: Data Engine UI está casi completo. Solo falta el **exportador JSON formato AE**.

---

## El Formato JSON que tenemos que generar

Tomado de `docs/AE-INTEGRATION.md`:

### Formato 1: Objeto indexado por composición
```json
{
  "0": {
    "nombre_producto": "Leche Alpina 1L",
    "precio": "$3.500",
    "imagen_producto": "leche_alpina.png",
    "color_marca": "#E30613",
    "tipo_oferta": "precio_especial"
  },
  "1": {
    "nombre_producto": "Yogurt Alpina Fresa",
    "precio": "$2.800",
    "imagen_producto": "yogurt_alpina.png",
    "color_marca": "#0057A8",
    "tipo_oferta": "2x1"
  }
}
```

### Formato 2: Array con campo "Comp"
```json
[
  { "Comp": 0, "nombre_producto": "Leche Alpina 1L", "precio": "$3.500" },
  { "Comp": 1, "nombre_producto": "Yogurt Alpina Fresa", "precio": "$2.800" }
]
```

**Decisión recomendada**: ofrecer ambos formatos como toggle en la UI. Default a Formato 1 (objeto indexado) porque es más legible.

---

## Implementation Groups

### Group 1: Audit del Data Engine + Backend Coordination

**Objetivo**: Entender exactamente qué tiene el frontend, qué hay en backend, y qué falta para conectar.

**Acciones**:
1. Audit completo de `src/domains/data-engine/` — confirmar que cobertura de hooks/componentes
2. Verificar si existe backend `data-engine` module en NestJS
3. Si no existe: decidir si la generación del JSON se hace 100% frontend (más simple) o frontend → backend → archivo (más seguro)
4. Documentar el contrato esperado: input (Column Mapping) → output (JSON formato AE)

**Acceptance**: Documento claro de "qué hay y qué falta" antes de tocar código.

---

### Group 2: Mapping Type Definitions

**Objetivo**: Cada columna del CSV/Sheets debe tener un "tipo AE" asociado para generar correctamente el JSON.

**Files to create**:

1. **`src/domains/data-engine/types/ae-mapping.ts`**:
```typescript
export type AELayerType =
  | 'text'       // Texto dinámico
  | 'visibility' // Opacidad condicional (toggle)
  | 'color'      // Color dinámico (hex/RGB)
  | 'image';     // Imagen dinámica (footage swap)

export interface AEColumnMapping {
  csvColumn: string;          // ej: "product_name"
  aeKey: string;              // ej: "nombre_producto" (lo que va al JSON)
  aeLayerType: AELayerType;
  required: boolean;
  // Solo para type='visibility': mapeo de valores → nombres de capa AE
  visibilityMap?: Record<string, string>;
}
```

2. **`src/domains/data-engine/schemas/ae-mapping.schema.ts`**:
```typescript
export const aeColumnMappingSchema = z.object({
  csvColumn: z.string().min(1),
  aeKey: z.string().min(1).regex(/^[a-z_][a-z0-9_]*$/, 'snake_case sin espacios'),
  aeLayerType: z.enum(['text', 'visibility', 'color', 'image']),
  required: z.boolean().default(false),
  visibilityMap: z.record(z.string(), z.string()).optional(),
});
```

3. **Update `src/domains/data-engine/types.ts`**: extender `ColumnMapping` actual con campos AE.

**Depends on**: Group 1
**Acceptance**: Tipos compilando, schemas validando.

---

### Group 3: UI Adaptation — Column Mapping con AE Layer Type

**Objetivo**: La UI de Column Mapping debe permitir al usuario asignar el "tipo AE" a cada columna.

**Files to modify**:

1. **`src/domains/data-engine/components/column-mapping-tab.tsx`** (o equivalente):
   - Agregar columna en el grid de mapping: "Tipo AE" con select (Text / Visibility / Color / Image)
   - Si tipo = Image: validar que las URLs sean assets registrados en Asset Manager
   - Si tipo = Visibility: mostrar mini-form para definir el `visibilityMap`
   - Si tipo = Color: validar formato hex en preview

2. **`src/domains/data-engine/utils/ae-key-normalizer.ts`** (NEW):
   - Función `normalizeToAEKey(csvColumn: string): string` — convierte "Product Name" → "product_name", remueve espacios, lowercase, snake_case
   - Validación: ningún espacio, ningún carácter especial

**Depends on**: Group 2
**Acceptance**: Usuario puede mapear cada columna con su tipo AE. Validación visual de claves AE.

---

### Group 4: Variation Generation con AE Format

**Objetivo**: Generar el objeto/array JSON en el formato exacto que el script JSX entiende.

**Files to create**:

1. **`src/domains/data-engine/utils/ae-json-generator.ts`** (NEW):
```typescript
export function generateAEJSON(
  rows: CSVRow[],
  mapping: AEColumnMapping[],
  format: 'object-indexed' | 'array-with-comp' = 'object-indexed'
): Record<string, any> | any[] {
  // Implementa la generación según el formato
  // Para cada row:
  //   - Crear objeto con aeKey como clave (no csvColumn)
  //   - Si tipo=color y formato RGB: normalizar a hex
  //   - Si tipo=image: verificar que asset existe en Asset Manager
  //   - Si tipo=visibility: aplicar visibilityMap
}
```

2. **`src/domains/data-engine/utils/__tests__/ae-json-generator.test.ts`** (TDD):
   - Test con 5 filas + 4 tipos de columnas
   - Test de validación de hex
   - Test de visibilityMap

**Depends on**: Group 3
**Acceptance**: Función pura testeada que genera JSON válido según `docs/AE-INTEGRATION.md`.

---

### Group 5: UI — Export Button + Preview

**Objetivo**: Permitir al usuario exportar el JSON desde la plataforma.

**Files to create**:

1. **`src/domains/data-engine/components/export-ae-json-dialog.tsx`** (NEW):
   - Dialog con:
     - Preview del JSON generado (collapsible, primeras 3 filas)
     - Selector de formato: Objeto indexado / Array con Comp
     - Botón "Descargar JSON" → genera archivo `[project-name]-ae-data.json`
     - Botón "Copiar al portapapeles"
   - Validación pre-export: warnings si hay columnas sin tipo AE asignado

2. **`src/domains/data-engine/components/variation-preview-tab.tsx`**:
   - Agregar botón "Exportar para AE" en la barra de acciones del tab
   - Abre el dialog del paso anterior

3. **Update text-maps** con strings del exportador (`exportForAE`, `selectFormat`, `downloadJSON`, etc.)

**Depends on**: Group 4
**Acceptance**: Usuario puede generar y descargar el JSON. Validación visual antes de exportar.

---

### Group 6: Validation contra Script JSX

**Objetivo**: Validar que el JSON generado funciona en AE con el script de Lizeth.

**Acciones**:
1. **Test manual con Lizeth**: 1 sesión donde subimos CSV → exportamos JSON → ella lo carga en AE → vemos si el script vincula correctamente
2. **Documentar gotchas encontrados**: si hay casos donde el formato no coincide, ajustar el generator
3. **Crear `docs/samples/sample-ae-export.json`**: ejemplo concreto del output esperado

**Depends on**: Group 5
**Acceptance**: Lizeth confirma que el JSON funciona en AE. Documentado el flujo end-to-end.

---

## Lo que NO incluye este plan (out of scope)

- ❌ Backend module para Data Engine (si se decide hacer)
- ❌ Real-time collaboration en mapping (Phase 3.5)
- ❌ Plantillas pre-armadas de mapping por industria (Phase 3.5)
- ❌ Trigger de AE desde la plataforma vía `aerender` (D4 pendiente)
- ❌ Importación inversa: AE → plataforma (decisión D3)

---

## Order of Execution

```
Group 1 (Audit) → Group 2 (Types) → Group 3 (UI Mapping) → Group 4 (Generator) → Group 5 (Export UI) → Group 6 (Validation)
```

**Estimación**: 5-7 días de desarrollo + 1 día de validación con Lizeth.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Formato JSON no coincide exactamente con lo que espera el script | Group 6: validación temprana con Lizeth |
| Usuario olvida mapear tipo AE → JSON inválido | UI con warnings + validation pre-export |
| Hex de colores en formatos inconsistentes | Normalización en `ae-json-generator.ts` |
| Imágenes referenciadas en JSON no existen en proyecto AE | Asset Manager debe trackear nombres exactos (out of scope, doc) |

---

## Dependencies para activar Camino B (Future)

Una vez completado Phase 1, este Data Engine también puede exportar en **formato Remotion** (props array para `<Composition>`). Eso se agrega como Group 7 en una iteración futura:

- Mismo Column Mapping, diferente generator
- Output: `RemotionVariation[]` con props mapeadas a atoms

Sin tocar el código del Camino A.

---

## Acceptance Final

- [x] Decisión Híbrida documentada (`docs/AE-INTEGRATION.md`)
- [ ] Usuario sube CSV en la plataforma
- [ ] Usuario mapea columnas + asigna tipo AE
- [ ] Usuario exporta JSON formato objeto indexado
- [ ] Lizeth carga JSON en su script JSX → vincula correctamente
- [ ] Render local en AE produce videos esperados
- [ ] Lizeth deja de hacer JSONs manualmente
