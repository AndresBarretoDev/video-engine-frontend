# Backend Handoff — Golden Path: Video Generation (Capa 2)

**Para**: agente/equipo del repo `op-video-engine-backend` (NestJS)
**Desde**: repo `op-video-engine-frontend` (Next.js)
**Fecha**: 2026-06-09
**Estado frontend**: COMPLETO (Phases 0–4 de tasks.md implementadas). Falta backend (Phase 2 + task 3.1) para cerrar el render real.
**Coordinación**: este documento ES el contrato. Cambios al contrato se documentan acá primero — nunca en código de forma silenciosa.

---

## 1. Resumen: qué hay que entregar

El golden path es un flujo de producción de video de **un solo producto** (single-product authoring):

```
Galería de templates → Elegir template → Formulario + preview viva → "Enviar a render" → Polling progreso → Descargar MP4
```

El frontend está funcional en modo mock. Para cerrarlo con render real, el backend necesita implementar:

| # | Qué | Prioridad |
|---|-----|-----------|
| A | `GET /templates` — catálogo estático de templates | Alta |
| B | `POST /projects/:id/render-single` — 1 producto → N jobs (uno por formato) | Alta |
| C | `GET /render-jobs/:id/progress` — ya existe; no recrear | Verificar que existe |
| D | `POST /uploads` — sube imagen, devuelve URL pública usable por CLI | Alta |
| E | Módulo `render/` con ports + `LocalCliRenderProvider` + gate `RENDER_PROVIDER` | Alta |
| F | Script `bundle:remotion` (frontend) + var `REMOTION_BUNDLE_PATH` (backend) | Habilitador |

Render v1 es **local** (Remotion CLI en el servidor NestJS). La abstracción por ports permite migrar a Lambda sin reescribir. Cero AWS en esta fase.

---

## 2. Endpoints a implementar

### 2.1 `GET /templates`

**Módulo**: `templates/` (nuevo, task 3.1)
**Auth**: JWT requerido (rol Producer o superior)
**Response**: `TemplateDescriptor[]`

```typescript
// Contratos exactos de src/domains/templates/types.ts (frontend)
// El backend DEBE devolver exactamente esta shape. No agregar ni quitar campos.

interface TemplateCompositionRef {
  format: VideoFormat;        // '16:9' | '9:16' | '1:1'
  compositionId: string;      // DEBE coincidir con id registrado en index.tsx (ver abajo)
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
}

interface TemplateDescriptor {
  id: string;
  name: string;
  description: string;
  componentId: string;        // e.g. "LoopingProductPromo"
  formats: TemplateCompositionRef[];
  thumbnailUrl?: string;      // URL de preview estático (fallback antes del player)
  tags: string[];
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}
```

**v1: respuesta estática hardcodeada** — 1 template × 3 formatos. Los `compositionId` son exactamente los registrados en `src/remotion/index.tsx`:

```typescript
// Payload hardcodeado que el backend DEBE devolver en v1
const TEMPLATES_V1: TemplateDescriptor[] = [
  {
    id: 'looping-product-promo',
    name: 'Looping Product Promo',
    description: 'Promo de producto en loop con precio, CTA y branding',
    componentId: 'LoopingProductPromo',
    formats: [
      {
        format: '16:9',
        compositionId: 'looping-product-promo-16-9',   // id exacto de index.tsx
        width: 1920,
        height: 1080,
        durationInFrames: 300,
        fps: 30
      },
      {
        format: '9:16',
        compositionId: 'looping-product-promo-9-16',   // id exacto de index.tsx
        width: 1080,
        height: 1920,
        durationInFrames: 300,
        fps: 30
      },
      {
        format: '1:1',
        compositionId: 'looping-product-promo-1-1',    // id exacto de index.tsx
        width: 1080,
        height: 1080,
        durationInFrames: 300,
        fps: 30
      }
    ],
    thumbnailUrl: undefined,   // null en v1; agregar cuando haya asset
    tags: ['product', 'promo', 'loop'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
```

**Comportamiento**:
- En v1 no hay tabla `templates` en Prisma — devolver el array hardcodeado desde el servicio.
- Cuando se agregue persistencia, crear migración aditiva.

---

### 2.2 `POST /projects/:projectId/render-single`

**Módulo**: `render-jobs/` (endpoint nuevo en el módulo existente, task 2.6)
**Auth**: JWT requerido (rol Producer o superior)
**Decisión D9**: NO reusar `createRenderBatch`. Endpoint dedicado single-product.

**Request DTO** (exacto, de `src/domains/video-generation/types.ts`):

```typescript
// Body del POST
interface CreateSingleProductRenderDto {
  templateId: string;           // e.g. 'looping-product-promo'
  compositionId: string;        // e.g. 'looping-product-promo-16-9'
  compositionProps: AssembledCompositionProps;
  format: VideoFormat;          // '16:9' | '9:16' | '1:1'
  projectId: string;            // también viene en :projectId del path
  outputNamePrefix?: string;    // prefijo opcional para el nombre del archivo
}

// Tipos anidados:

type VideoFormat = '16:9' | '9:16' | '1:1';

interface AssembledCompositionProps {
  brandConfig?: BrandConfig;    // opcional; render sin marca si ausente
  format: VideoFormat;
  slots: ProductFormData;
  timing: {
    totalDurationInFrames: number;     // 300
    introDurationInFrames: number;     // 60
    outroDurationInFrames: number;     // 60
  };
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface ProductFormData {
  productName: string;          // requerido
  productImage: string;         // requerido — URL pública (viene del endpoint de upload)
  priceCurrent: string;         // requerido
  priceOriginal?: string;
  promoTag?: string;
  ctaText: string;              // requerido
  legalText?: string;
}

interface BrandConfig {
  id: string;
  name: string;
  tokens: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textInverse: string;
    };
    fonts: {
      heading: { family: string; weights: number[] };
      body: { family: string; weights: number[] };
    };
    animation: {
      defaultEasing: 'spring' | 'ease-out' | 'ease-in-out';
      defaultDuration: number;
      springConfig: { damping: number; stiffness: number; mass: number };
    };
    spacing: { padding: number; gap: number };
  };
  assets: {
    logo: { url: string; width: number; height: number };
    logoWhite?: { url: string; width: number; height: number };
    jingle?: string;
    sfxTransition?: string;
    fonts: string[];
  };
  defaults: {
    cortinillaEntrada: string;
    cortinillaCierre: string;
    promoBarStyle: 'top' | 'bottom';
    productOverlayPosition: 'bottom-right' | 'bottom-left' | 'center';
  };
}
```

**Response** (exacto):

```typescript
interface SingleProductRenderResponse {
  jobIds: string[];    // IDs de los jobs creados (uno por llamada, 1 formato por job)
  totalJobs: number;   // siempre 1 en single-product (1 formato por request)
}
```

**Comportamiento**:
- Recibe 1 producto + 1 formato → crea **1 job** de render.
- El frontend llama este endpoint **una vez por formato seleccionado** (el loop lo maneja el frontend).
- El job se encola en BullMQ con status `queued`.
- `compositionProps` se serializa como JSON en la columna `inputProps` (o campo `Json` en Prisma) del `RenderJob`.
- `compositionId` y `format` se guardan en el `RenderJob` (ver tarea 2.4 — campos nullable/aditivos en la migración).

**Validación mínima**:
- `templateId`, `compositionId`, `format`, `projectId`: requeridos.
- `compositionProps.slots.productName`, `productImage`, `priceCurrent`, `ctaText`: requeridos.
- El `projectId` del path debe coincidir con el del body — si difieren, `400 Bad Request`.

**HTTP status**:
- `201 Created` + body `SingleProductRenderResponse` en éxito.
- `400 Bad Request` si validación falla (class-validator).
- `404 Not Found` si el `projectId` no existe o no pertenece al usuario autenticado.
- `403 Forbidden` si el rol no es Producer/Admin.

---

### 2.3 `GET /render-jobs/:id/progress` (NO recrear — verificar que existe)

**Módulo**: `render-jobs/` (existente)
**Cómo lo consume el frontend**:

```typescript
// src/domains/video-generation/hooks/use-render-progress-polling.ts
// Re-exporta useRenderProgress de render-jobs domain sin modificar.
// Polling activo mientras status !== 'completed' | 'failed' | 'cancelled'.
// Intervalo sugerido: 2000ms (configurable en el hook).

// Shape esperada por el frontend (src/domains/render-jobs/types.ts):
interface RenderProgress {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'paused';
  progress: number;               // 0-100
  framesCurrent?: number;
  framesTotal?: number;
  estimatedTimeRemaining?: number; // segundos
  speed?: number;                  // frames por segundo
  currentFrame?: number;
  logs?: string[];
}
```

**Requisito de durabilidad (task 2.5, Phase 5.5)**: el `progress` DEBE ser leído de la DB (no de memoria BullMQ). Si el usuario cierra la tab y la vuelve a abrir, el frontend hace polling y el backend devuelve el progreso real del job desde Prisma — no un 0 reseteado.

El `onProgress` del `LocalCliRenderProvider` debe escribir a DB en cada callback (ver sección 3).

---

### 2.4 `POST /uploads` — Upload de imagen de producto

**Módulo**: `uploads/` (existente o nuevo según el repo backend)
**Endpoint**: `POST /uploads` (ya declarado en `API_ENDPOINTS.uploads.upload`)
**Auth**: JWT requerido

**Request**: `multipart/form-data`

```
Content-Type: multipart/form-data
field: file  (binary — imagen del producto: jpg/png/webp)
```

**Response**:

```typescript
interface UploadResponse {
  url: string;      // URL pública absoluta, accesible por el CLI de Remotion al renderizar
  fileId?: string;  // opcional — ID interno si el backend mantiene registro
}
```

**Comportamiento v1**:
- Guardar en sistema de archivos local (`uploads/` dentro del servidor NestJS) y servir con `ServeStatic`.
- La URL devuelta debe ser accesible desde el mismo proceso Node que ejecuta el CLI de Remotion (i.e., `http://localhost:PORT/uploads/filename.jpg` es válida).
- Validar MIME: solo `image/jpeg`, `image/png`, `image/webp`. Rechazar otros con `415 Unsupported Media Type`.
- Tamaño máximo sugerido: 10 MB.

**Por qué es necesario**: el campo `productImage` en `ProductFormData` es una URL pública. El CLI de Remotion la descarga durante el render. Si la imagen es local (sube el usuario desde su máquina), necesita pasar por este endpoint primero. Sin este endpoint, la UX de upload está bloqueada en el frontend.

---

## 3. Motor de render (Phase 2 completa)

### 3.1 Ports (interfaces abstractas)

```typescript
// Archivo: src/render/ports/render.provider.ts
abstract class RenderProvider {
  abstract render(input: RenderInput): Promise<RenderResult>;
}

interface RenderInput {
  compositionId: string;
  compositionProps: object;       // AssembledCompositionProps serializado
  outputPath: string;             // path absoluto destino del MP4
  format: '16:9' | '9:16' | '1:1';
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  onProgress: (framesRendered: number) => void;  // DEBE persistirse en DB
}

interface RenderResult {
  outputPath: string;
  durationMs: number;
  framesRendered: number;
}

// Archivo: src/render/ports/storage.provider.ts
abstract class StorageProvider {
  abstract resolveOutputPath(jobId: string, filename: string): string;
  abstract upload(localPath: string, jobId: string): Promise<string>;  // returns public URL
  abstract getDownloadUrl(jobId: string): string;
  abstract deleteFile(jobId: string): Promise<void>;
}
```

### 3.2 `LocalCliRenderProvider`

```typescript
// Archivo: src/render/providers/local-cli-render.provider.ts
// Implementa RenderProvider usando Remotion CLI via child_process.spawn.

// Comando que ejecuta:
// npx remotion render <REMOTION_BUNDLE_PATH> <compositionId> <outputPath>
//   --props='<JSON serializado de compositionProps>'
//   --width=<width> --height=<height> --fps=<fps> --frames=0-<durationInFrames-1>

// Parseo de progreso: Remotion CLI emite líneas "Rendered X/Y frames" al stdout.
// Extraer X, llamar onProgress(X).

// onProgress callback DEBE escribir a DB:
async function onProgress(framesRendered: number): Promise<void> {
  const progress = Math.floor((framesRendered / durationInFrames) * 100);
  await prisma.renderJob.update({
    where: { id: jobId },
    data: { progress, framesCurrent: framesRendered }
  });
}
```

### 3.3 `LocalFsStorageProvider`

```typescript
// Archivo: src/render/providers/local-fs-storage.provider.ts
// resolveOutputPath: path.join(RENDER_OUTPUT_DIR, jobId, filename)
// upload: mueve el archivo al directorio de outputs públicos; devuelve URL ServeStatic
// getDownloadUrl: construye URL absoluta accesible externamente
// deleteFile: fs.rm
```

### 3.4 Gate `RENDER_PROVIDER`

```typescript
// Variable de entorno: RENDER_PROVIDER = 'mock' | 'local'
// Default: 'mock' (el comportamiento previo se preserva sin tocar código)

// En render.module.ts:
const renderProvider =
  process.env.RENDER_PROVIDER === 'local'
    ? new LocalCliRenderProvider(...)
    : new MockRenderProvider(...);
```

**Regla**: con `RENDER_PROVIDER=mock`, el sistema debe comportarse exactamente igual que antes. El mock puede simular progreso (avanzar de 0 a 100 en N segundos) para que el polling funcione. Revertir a mock = borrar la env var (o setearla a `mock`), sin tocar código.

### 3.5 Migración Prisma (task 2.4)

Aditiva y reversible. Agrega campos nullable al modelo `RenderJob` existente:

```prisma
model RenderJob {
  // ... campos existentes ...

  // Nuevos campos para golden path (nullable = no rompe jobs anteriores)
  format          String?   // '16:9' | '9:16' | '1:1'
  compositionId   String?   // e.g. 'looping-product-promo-16-9'
  inputProps      Json?     // AssembledCompositionProps serializado
  framesCurrent   Int?      // para progreso
  framesTotal     Int?      // para progreso
}
```

Migración: `npx prisma migrate dev --name add_render_job_composition_fields`

**Para revertir**: `npx prisma migrate down 1` (o eliminar la migración en dev).

### 3.6 Naming de archivos de output (task 5.2)

```
{brand}_{product-slug}_{format}_{date}.mp4
```

Ejemplos:
- `omnicom_coca-cola-zero_16-9_2026-06-09.mp4`
- `omnicom_coca-cola-zero_9-16_2026-06-09.mp4`

Reglas:
- `{brand}`: `brand.name` en kebab-case (lowercase, espacios → guiones).
- `{product-slug}`: `productName` en kebab-case, truncado a 40 chars.
- `{format}`: `'16-9'` | `'9-16'` | `'1-1'` (dos puntos reemplazados por guiones).
- `{date}`: `YYYY-MM-DD` (fecha de inicio del render).
- Si no hay brand: `'no-brand'` como prefijo.

---

## 4. Integración Remotion — Bundle

El CLI de Remotion necesita un bundle precompilado del frontend para renderizar. El flujo de acople es:

**Paso 1 — Frontend genera el bundle** (script a agregar en `package.json` del frontend):

```json
// package.json (frontend)
{
  "scripts": {
    "bundle:remotion": "npx remotion bundle src/remotion/index.tsx --output dist/remotion-bundle"
  }
}
```

**Paso 2 — Backend lee la ruta del bundle** via variable de entorno:

```bash
# .env del backend
REMOTION_BUNDLE_PATH=/absolute/path/to/op-video-engine-frontend/dist/remotion-bundle
```

**Paso 3 — `LocalCliRenderProvider` usa la var**:

```typescript
const bundlePath = process.env.REMOTION_BUNDLE_PATH;
if (!bundlePath) throw new Error('REMOTION_BUNDLE_PATH no configurado');

// Comando completo:
// npx remotion render <bundlePath> <compositionId> <outputPath> --props=<json>
```

**Documentar en `SETUP.md` (o `README.md`) del repo backend**:

```markdown
## Setup: Remotion Bundle

1. En el repo frontend, ejecutar: `pnpm bundle:remotion`
2. El bundle se genera en `dist/remotion-bundle/`
3. En el repo backend, configurar en `.env`:
   REMOTION_BUNDLE_PATH=/ruta/absoluta/al/frontend/dist/remotion-bundle
4. Iniciar el backend con `RENDER_PROVIDER=local`
```

**Nota**: en desarrollo, el bundle debe regenerarse cada vez que se modifiquen compositions. El backend no observa el filesystem — la tarea es manual en v1.

---

## 5. Checklist de aceptación (Phase 2 cerrada)

Para considerar el render real del golden path como completo, deben pasar todos estos criterios:

### Endpoints
- [ ] `GET /templates` responde `TemplateDescriptor[]` con exactamente 1 template × 3 formatos; los `compositionId` coinciden al carácter con los registrados en `index.tsx`.
- [ ] `POST /projects/:id/render-single` crea 1 `RenderJob` (status `queued`) y devuelve `{ jobIds: string[], totalJobs: 1 }`.
- [ ] `GET /render-jobs/:id/progress` devuelve `RenderProgress` con `progress` leído de DB (no de memoria).
- [ ] `POST /uploads` sube imagen y devuelve URL pública resoluble por el CLI de Remotion.

### Render real
- [ ] Con `RENDER_PROVIDER=local`, el job produce un MP4 H.264 reproducible.
- [ ] El polling de progreso refleja frames reales (no 0 estático).
- [ ] **Durabilidad tab-close**: cerrar el browser a mitad del render y volver → el polling retoma el progreso real desde DB (no resetea a 0).
- [ ] Naming del output sigue la convención `{brand}_{slug}_{format}_{date}.mp4`.

### Gate mock
- [ ] Con `RENDER_PROVIDER=mock` (o sin la var), el pipeline se comporta exactamente igual que antes. Cero regresiones.

### E2E golden path
- [ ] 1 producto + 1 formato → 1 job → render real → MP4 descargable.
- [ ] El mismo flujo con las 3 formatos (3 calls al endpoint) produce 3 MP4 independientes.

### Build y tests
- [ ] `pnpm build` (backend) limpio — cero errores TypeScript.
- [ ] Tests de integración del processor con `RenderProvider` mock pasan.
- [ ] `RENDER_PROVIDER=mock pnpm test` verde.

---

## 6. Nota de coordinación

**Este documento es el contrato vivo entre los dos repos.**

Reglas:
1. Si el backend necesita cambiar la shape de un endpoint, actualizar este archivo **primero** — antes de tocar código.
2. Si el frontend detecta que un contrato es incorrecto o incompleto, actualizar este archivo y notificar al agente del backend.
3. Los tipos TypeScript en las secciones 2.x son la fuente de verdad. El backend los implementa como `class-validator` DTOs; el frontend los usa directamente. No deben divergir.
4. La migración Prisma (sección 3.5) es aditiva. No borrar campos existentes sin coordinación.
5. El `compositionId` en `TemplateCompositionRef.compositionId` **NUNCA** puede diferir del `id` registrado en `src/remotion/index.tsx` del frontend. Ese acople es el punto más frágil del sistema.

---

## 7. Estado del backend Capa 2 + qué falta para el render real (2026-06-10)

**Reportado por**: agente del repo `op-video-engine-backend`.
**Estado actual del flujo**: corriendo en **modo mock** (`RENDER_PROVIDER=mock`) — se simula el render. El backend de Capa 2 está implementado, testeado (124 tests verdes, `tsc --noEmit` limpio) y archivado en `op-video-engine-backend/openspec/changes/archive/golden-path-render/`.

### ✅ Acople de `compositionId` VERIFICADO — coincide al carácter

Verificado contra `src/remotion/index.tsx` (líneas 277-305): las 3 compositions del golden path están registradas con los IDs **e idénticas dims** que pide §2.1, y el backend (`TEMPLATES_V1`) las replica exactas. No hay divergencia:

| compositionId | dims | duration | fps | index.tsx | backend TEMPLATES_V1 |
|---|---|---|---|---|---|
| `looping-product-promo-16-9` | 1920×1080 | 300 | 30 | ✅ L278 | ✅ |
| `looping-product-promo-9-16` | 1080×1920 | 300 | 30 | ✅ L288 | ✅ |
| `looping-product-promo-1-1`  | 1080×1080 | 300 | 30 | ✅ L298 | ✅ |

El "punto más frágil del sistema" (§6 regla 5) está cubierto y consistente entre repos.

### Pendiente real para activar `RENDER_PROVIDER=local`

1. **FRONTEND — bundle**: falta el script `bundle:remotion` en `package.json` (hoy solo hay `remotion:studio` / `remotion:preview`) y generar el bundle en `dist/remotion-bundle/`. Es la **tarea 2.7** de este change, aún sin marcar. Sin el bundle, el CLI no tiene qué renderizar.
2. **BACKEND — CLI (menor)**: instalar `@remotion/cli` como dependencia del backend; hoy `LocalCliRenderProvider` resuelve `npx remotion` on-the-fly (frágil). No bloquea el modo mock.

### Mientras tanto

El flujo end-to-end se valida en **mock**: endpoints (`GET /templates`, `POST /projects/:id/render-single`, `GET /render-jobs/:id/progress`, `POST /uploads`), encolado BullMQ, polling de progreso desde DB, naming de output y durabilidad — todo funciona y simula el render. El MP4 real queda detrás del punto 1 (bundle del frontend).

> **Corrección (2026-06-10)**: una versión previa de esta §7 afirmó que las compositions NO estaban registradas en `index.tsx`. Era un error de verificación (un grep truncado). Re-verificado: SÍ están registradas y correctas. El único bloqueante real es el bundle (punto 1).

---

## 8. Desconexión de diseño: el render single-product exige `projectId` pero el flujo de templates no tiene proyecto (2026-06-10)

**Detectado**: durante prueba E2E del backend en modo mock + intento de render real desde el frontend (error `projectId must be a UUID`).
**Estado**: DECISIÓN DE PRODUCTO PENDIENTE — documentada, sin resolver. No tocar código hasta decidir A vs B (abajo).

### El síntoma

Al elegir un template y darle "Enviar a render", el backend responde `400 projectId must be a UUID`.

### La causa raíz (no es validación — es diseño)

El flujo del golden path en el frontend es `/templates/[id]/author` → "Enviar a render". En esa ruta **`[id]` es el TEMPLATE, no un proyecto** — el flujo nunca elige ni crea un proyecto. Pero el endpoint del contrato es `POST /projects/:projectId/render-single` y exige `projectId`.

El frontend tapa ese hueco con un placeholder hardcodeado:

```
// src/app/(dashboard)/templates/[id]/author/_components/send-to-render-button.tsx:28-30
// TODO(task 5.x): integrate project selector / active project from context
const DEMO_PROJECT_ID = 'demo-project-001';
```

`'demo-project-001'` no es UUID → el DTO lo rechaza. **Y aunque se relaje la validación, igual fallaría con `404 project not found`** porque ese proyecto no existe en la DB. El problema de fondo: **este flujo no tiene un proyecto real**.

> Nota backend: el DTO `CreateSingleProductRenderDto.projectId` hoy usa `@IsUUID()`, más estricto que el contrato §2.2 (que dice `projectId: string`). Relajar a `@IsString()` solo cambia el 400 por un 404 — NO resuelve la desconexión. Se ajustará cuando se decida A/B.

### Decisión requerida (cuál es la verdad del producto)

- **Opción A — el render vive dentro de un proyecto**: el FRONTEND resuelve el `TODO(task 5.x)` (selector de proyecto o proyecto activo del contexto) y manda un `projectId` real. El backend queda como está (`/projects/:id/render-single`).
- **Opción B — el render es suelto (quick-render desde template)**: el CONTRATO §2.2 está mal y el endpoint NO debe colgar de `/projects/:id`. Re-diseñar (endpoint sin proyecto, o proyecto "scratch"/personal implícito). Implica re-trabajo de contrato + backend.

Hasta resolver esto, el render desde el frontend **no funciona end-to-end**, aunque el backend en sí esté operativo (validado por curl con un `projectId` real del seed).

### Hallazgos menores de la prueba E2E (modo mock) — follow-up backend (no bloquean el contrato)

Validado con curl (login producer → templates → render-single → polling progress → output). El flujo core anda. Detalles a pulir en el backend:

1. **Dims del output incorrectas**: `RenderOutput.width/height` quedan fijos en `1920x1080` aunque el formato sea `9:16` (debería `1080x1920`) o `1:1` (`1080x1080`). Afecta también al render real. Origen: `src/render-jobs/render-jobs.processor.ts` (creación del `RenderOutput`).
2. **Logs vacíos**: el `MockRenderProvider` no pushea los logs `"Rendering frames X-Y..."` que el mock inline viejo sí escribía (leve cambio de comportamiento).
3. **Placeholder vacío**: `fileSize: 0` (el archivo simulado se escribe sin contenido).

> Estos 3 son del backend y están en su backlog; el bloqueante real para el frontend es la decisión A/B de §8.

---

*Generado: 2026-06-09 | Actualizado: 2026-06-10 (§7 acople verificado + §8 desconexión projectId/proyecto, por agente backend) | Change: golden-path-video-generation | Repo: op-video-engine-frontend*
