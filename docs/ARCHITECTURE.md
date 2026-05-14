# OP Video Engine — Arquitectura Tecnica

**Version:** 1.2
**Fecha:** Abril 2026
**Cambio v1.1:** Backend definido como NestJS (servicio separado de Next.js)
**Cambio v1.2:** Actualizado para reflejar stack implementado y schema real de base de datos

---

## Vision General

```
+-----------------------------------------------------------------+
|                        OP VIDEO ENGINE                           |
|                                                                  |
|  +----------+  +----------+  +----------+  +----------+         |
|  |  Asset   |  |  Data    |  |Component |  |  Render  |         |
|  |  Manager |  |  Engine  |  |  Studio  |  |  Farm    |         |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+         |
|       |              |              |              |              |
|       +--------------+--------------+--------------+             |
|                           |                                      |
|                    +------+------+                               |
|                    |  Workflow   |                               |
|                    |  & QC Hub  |                               |
|                    +------+------+                               |
|                           |                                      |
|              +------------+------------+                         |
|              |    Client Portal        |                         |
|              |  (Preview & Approval)   |                         |
|              +-------------------------+                         |
+-----------------------------------------------------------------+
```

---

## Stack Tecnologico

### Frontend (implementado)
- **Framework:** Next.js 15 (App Router, Turbopack)
- **UI:** React 19 con shadcn/ui + Tailwind CSS v4
- **Design System:** Vibe Coding — tokens en 7 JSON source files -> CSS variables -> Tailwind v4
- **Estado:** Zustand v5 (client/UI state) + React Query v5 / TanStack Query (server state)
- **Video Preview:** @remotion/player 4+
- **Forms:** React Hook Form v7 + Zod v3
- **Animaciones UI:** Framer Motion 11
- **HTTP Client:** Axios 1.14 con interceptors
- **Notificaciones:** Sonner 1.7
- **Iconos:** Lucide React
- **Package Manager:** pnpm 10.15.1 (Node 20.11.0+)

### Motor de Video (en desarrollo)
- **Framework:** Remotion 4+
- **Componentes:** React + TypeScript (schemas Zod)
- **Preview desarrollo:** Remotion Studio
- **Preview produccion:** @remotion/player
- **Rendering:** @remotion/lambda (AWS) o @remotion/renderer (self-hosted Docker) — aun no implementado

### Backend (implementado)
- **Framework:** NestJS 11 (sobre Express)
- **Lenguaje:** TypeScript 5 (strict mode)
- **Base de datos:** PostgreSQL (via Prisma 7 con PostgreSQL adapter)
- **ORM:** Prisma 7 (inyectado como provider global via PrismaModule)
- **Autenticacion:** Passport.js (@nestjs/passport) con estrategias JWT + Local
- **Validacion:** class-validator + class-transformer en DTOs
- **Uploads:** Multer (imagenes, 5MB max)
- **Package Manager:** pnpm

### Pendiente de implementar (fases futuras)
- **Cola de trabajos:** @nestjs/bullmq + Redis (rendering, procesamiento de assets) — Fase 4
- **WebSockets:** @nestjs/websockets (Gateway) para progreso de rendering en tiempo real — Fase 4
- **Documentacion API:** @nestjs/swagger (OpenAPI auto-generado) — pendiente
- **Email:** SendGrid o Resend (notificaciones) — Fase 5

> **Nota:** El backend es un servicio separado de Next.js, con CORS configurado, deployment independiente, y auth compartida via JWT en httpOnly cookies. El frontend consume la API REST del backend.

### Infraestructura (planeada, no implementada)
- **Cloud:** AWS (Lambda para rendering, S3 para storage, CloudFront para CDN)
- **Alternativa:** GCP o Azure (segun infraestructura existente de Omnicom)
- **Contenedores:** Docker para workers de rendering self-hosted
- **CI/CD:** GitHub Actions

### Integraciones externas (planeadas)
- **Google Sheets API:** Lectura de datos en tiempo real — Fase 3
- **Figma API:** Exportacion de tokens del design system — futuro
- **Storage:** AWS S3 (videos, assets, exports) — Fase 4
- **After Effects (AE):** Integracion via dos caminos posibles — Fase 5 (ver AE-INTEGRATION.md)

---

## Estado de Implementacion por Modulo

### Implementados (Fase 0 Backend)

| Modulo | Backend | Frontend | Notas |
|--------|---------|----------|-------|
| Auth | Completo (login, logout, refresh, me) | Completo (context, middleware, guards) | JWT + httpOnly cookies, token rotation |
| Users | Completo (CRUD, invite, roles, deactivate) | Completo (tabla, invite dialog, role change) | 5 roles, safeguards de admin |
| Brands | Completo (CRUD, tokens, archive, slug) | Completo (list, form, token editor, preview) | Slug auto-generado, brand tokens JSON |
| Projects | Completo (CRUD, status machine, visibility) | Completo (list, form, status stepper, actions) | Draft->InProgress->Review->Approved |
| Dashboard | Completo (metricas por rol) | Completo (summary cards, recent projects) | Metricas adaptadas a cada rol |
| Uploads | Completo (imagenes via Multer) | Completo (image upload hook + UI) | JPEG/PNG/WebP/SVG/GIF, 5MB max |

### Scaffolded en Frontend (sin backend todavia)

| Modulo | Estado Frontend | Backend Requerido |
|--------|-----------------|-------------------|
| Data Engine | Componentes y tipos completos | Fase 3 |
| Assets | CRUD UI completa | Necesita S3 integration |
| Components Registry | Catalogo UI completa | Necesita registro en DB |
| Render Jobs | Tipos y hooks definidos | Fase 4 (BullMQ + Lambda) |
| Reviews | Tipos y hooks definidos | Fase 5 |

---

## Schema de Base de Datos (Prisma — estado actual)

### Modelos Implementados

```
User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  firstName     String
  lastName      String
  role          UserRole  @default(DESIGNER)
  avatarUrl     String?
  bio           String?
  phone         String?
  department    String?
  teamId        String?
  organizationId String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  refreshTokens RefreshToken[]
  projects      Project[]
}

RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(...)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

Brand {
  id             String    @id @default(uuid())
  name           String
  slug           String    @unique
  description    String?
  organizationId String?
  clientId       String?
  tokens         Json?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  projects       Project[]
}

Project {
  id             String            @id @default(uuid())
  name           String
  description    String?
  status         ProjectStatus     @default(DRAFT)
  visibility     ProjectVisibility @default(PRIVATE)
  organizationId String?
  ownerId        String
  owner          User              @relation(...)
  teamId         String?
  brandId        String?
  brand          Brand?            @relation(...)
  campaignId     String?
  thumbnailUrl   String?
  duration       Int?
  frameRate      Int?
  resolution     String?
  settings       Json?
  isActive       Boolean           @default(true)
  publishedAt    DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}

enum UserRole {
  ADMIN
  DESIGNER
  PRODUCER
  QC
  CLIENT
}

enum ProjectStatus {
  DRAFT
  IN_PROGRESS
  REVIEW
  APPROVED
}

enum ProjectVisibility {
  PRIVATE
  TEAM
  PUBLIC
}
```

### Modelos Pendientes (fases futuras)

Los siguientes modelos estan definidos en la arquitectura pero no implementados en Prisma aun:

- **Asset** — Fase 2/3: repositorio de multimedia con metadata, tags, versionamiento
- **Component** — Fase 1/2: registro de componentes Remotion con schema Zod serializado
- **DataSource, ColumnMapping, ConditionalRule** — Fase 3: Data Engine
- **RenderJob, RenderBatch** — Fase 4: cola de rendering y monitoreo
- **Review, Comment, Delivery** — Fase 5: workflow de QC y entrega

Los modelos de datos planeados estan documentados en las secciones siguientes como referencia.

---

## Modelos de Datos Planeados (referencia para fases futuras)

### Asset Manager (Fase 2-3)

```
Asset {
  id: UUID
  brandId: UUID
  name: string
  type: "image" | "video" | "audio" | "font" | "logo"
  url: string (S3)
  thumbnailUrl: string
  metadata: {
    width: number
    height: number
    duration?: number (video/audio)
    hasAlpha?: boolean (video)
    fileSize: number
    mimeType: string
  }
  tags: string[]
  category: string
  version: number
  createdBy: UUID
  createdAt: DateTime
}
```

### Component Registry (Fase 1-2)

```
Component {
  id: UUID
  name: string
  slug: string
  type: "atom" | "molecule" | "organism"
  description: string
  propsSchema: JSON (Zod schema serializado)
  defaultProps: JSON
  remotionId: string (composition ID en Remotion)
  previewUrl: string
  brands: UUID[] (marcas que pueden usarlo)
  tags: string[]
  version: string (semver)
  createdBy: UUID
  createdAt: DateTime
}
```

### Data Engine (Fase 3)

```
DataSource {
  id: UUID
  projectId: UUID
  type: "csv" | "google_sheets" | "json_api"
  config: {
    url?: string
    refreshInterval?: number
    apiEndpoint?: string
  }
  columns: Column[]
  rowCount: number
  lastSyncAt: DateTime
}

ColumnMapping {
  id: UUID
  dataSourceId: UUID
  columnName: string
  componentId: UUID
  propPath: string
  transform?: string
}

ConditionalRule {
  id: UUID
  projectId: UUID
  condition: { column, operator, value }
  action: { type, target, value }
}
```

### Render Farm (Fase 4)

```
RenderJob {
  id: UUID
  projectId: UUID
  variationIndex: number
  format: "16:9" | "9:16" | "1:1"
  status: "queued" | "rendering" | "completed" | "failed"
  progress: number (0-100)
  inputProps: JSON
  outputUrl?: string (S3)
  outputMetadata?: { duration, fileSize, codec, resolution }
  attempts: number
  error?: string
  startedAt?: DateTime
  completedAt?: DateTime
  createdAt: DateTime
}

RenderBatch {
  id: UUID
  projectId: UUID
  totalJobs: number
  completedJobs: number
  failedJobs: number
  status: "processing" | "completed" | "partial_failure"
  createdAt: DateTime
  completedAt?: DateTime
}
```

### Workflow & QC (Fase 5)

```
Review {
  id: UUID
  batchId: UUID
  type: "internal" | "client"
  status: "pending" | "in_review" | "approved" | "changes_requested"
  reviewerEmail?: string
  accessToken: string
  expiresAt: DateTime
  createdAt: DateTime
}

Comment {
  id: UUID
  reviewId: UUID
  renderJobId: UUID
  authorName: string
  authorEmail: string
  content: string
  timestamp?: number (segundo del video)
  status: "open" | "resolved"
  createdAt: DateTime
}

Delivery {
  id: UUID
  batchId: UUID
  type: "link" | "zip"
  url: string
  expiresAt: DateTime
  downloadCount: number
  manifest: JSON
  createdAt: DateTime
}
```

---

## API del Backend (endpoints implementados)

### Auth (`/api/auth`)
- `POST /login` — Login con email+password, sets httpOnly cookies
- `POST /logout` — Revoca refresh token, limpia cookies
- `POST /refresh` — Rota tokens (single-use refresh)
- `GET /me` — Perfil del usuario autenticado

### Users (`/api/users`)
- `GET /` — Lista usuarios (Admin only, con filtros)
- `GET /profile` — Perfil propio
- `GET /:id` — Usuario por ID
- `POST /invite` — Invitar usuario (Admin only)
- `PATCH /:id/role` — Cambiar rol (Admin only)
- `PATCH /:id/deactivate` — Desactivar usuario (Admin only)
- `PATCH /:id/reactivate` — Reactivar usuario (Admin only)

### Brands (`/api/brands`)
- `GET /` — Lista marcas (con filtros search, status)
- `GET /:id` — Detalle de marca
- `GET /:id/config` — Configuracion completa
- `GET /:id/tokens` — Tokens de diseno de la marca
- `POST /` — Crear marca (Admin/Designer)
- `PATCH /:id` — Actualizar marca (Admin/Designer)
- `PATCH /:id/archive` — Archivar marca (Admin)
- `PATCH /:id/reactivate` — Reactivar marca

### Projects (`/api/projects`)
- `GET /` — Lista proyectos (con filtros, paginacion, visibilidad por rol)
- `GET /:id` — Detalle de proyecto (con check de visibilidad)
- `GET /:id/settings` — Settings JSON del proyecto
- `POST /` — Crear proyecto (Admin/Designer/Producer)
- `PATCH /:id` — Actualizar proyecto (con maquina de estados de status)
- `PATCH /:id/archive` — Archivar (Admin)
- `PATCH /:id/reactivate` — Reactivar (Admin)

### Dashboard (`/api/dashboard`)
- `GET /summary` — Metricas + proyectos recientes (adaptado por rol)

### Uploads (`/api/uploads`)
- `POST /` — Subir imagen (Admin/Designer/Producer, max 5MB)

---

## Autenticacion y Autorizacion

### Flujo de Auth
1. Frontend envia email+password a `POST /api/auth/login`
2. Backend valida con Passport LocalStrategy, genera JWT (15min) + Refresh Token (7d)
3. Tokens se setean como httpOnly cookies (access_token, refresh_token)
4. Frontend envia cookies automaticamente (withCredentials: true)
5. JwtAuthGuard (global) extrae y valida JWT de la cookie en cada request
6. RolesGuard (global) verifica el rol del usuario contra @Roles() del endpoint
7. Access token vencido: frontend interceptor llama a /refresh, rota tokens, reintenta

### Guards y Decorators
- `@Public()` — Salta JwtAuthGuard (para login, refresh, health)
- `@Roles(UserRole.ADMIN, ...)` — Requiere rol especifico
- `@CurrentUser()` — Extrae usuario del JWT payload
- TransformInterceptor — Stripea password de todas las respuestas

### Maquina de Estados de Proyecto
```
DRAFT -> IN_PROGRESS -> REVIEW -> APPROVED
                        REVIEW -> DRAFT (rechazo)
```
- APPROVED es estado terminal
- Solo Admin puede archivar (cualquier estado -> isActive: false)

---

## Arquitectura del Frontend

### Estructura de Directorios
```
src/
  app/                    — Next.js App Router (pages, layouts)
    (auth)/               — Rutas publicas (login)
    (dashboard)/          — Rutas protegidas (dashboard, projects, brands, etc.)
  components/
    ui/                   — shadcn/ui primitives
    shared/               — Cross-domain (ImageUpload, PageSkeleton, EmptyState)
    layout/               — Sidebar, Header, Breadcrumbs, ThemeToggle
  domains/                — Logica de negocio por dominio
    auth/                 — Login, context, guards
    brands/               — CRUD marcas, editor de tokens
    projects/             — CRUD proyectos, maquina de estados
    data-engine/          — Import CSV/Sheets, mapping, reglas, variaciones
    assets/               — Galeria, upload, metadata
    components-registry/  — Catalogo de componentes Remotion
    dashboard/            — Metricas y resumen
    users/                — Gestion de usuarios
    render-jobs/          — (tipos definidos, UI pendiente)
    reviews/              — (tipos definidos, UI pendiente)
  remotion/               — Componentes de video
    components/atoms/     — TextBlock, LogoReveal, ShapeElement, etc.
    components/molecules/ — CortinillaEntrada, ProductOverlay, etc.
    compositions/         — Templates completos
    schemas/              — Zod schemas para props
    utils/                — Timing, animation, format helpers
  lib/
    api/                  — API client (Axios), endpoints, error handler
    auth/                 — Auth context, role guard
    config/               — Environment config
  styles/
    tokens/source/        — 7 JSON files (design system source of truth)
    tokens/               — CSS variables generadas
  middleware.ts           — Proteccion de rutas JWT
  providers.tsx           — React Query + Auth + Toaster
```

### Patrones Clave
- **Server Components by default** — Client Components solo cuando necesario
- **Clean pages** — Solo composicion, zero business logic, Suspense boundaries
- **Domain isolation** — Cada dominio tiene: types, schema, hooks, stores, components, text-maps
- **Text maps** — Strings externalizados por dominio (preparado para i18n)
- **Mock mode** — `NEXT_PUBLIC_USE_MOCKS=true` retorna datos de prueba sin backend

---

## Seed Data

Base de datos incluye datos iniciales para desarrollo:

**Usuarios** (password: `password123`):
- admin@opengine.com (ADMIN)
- designer@opengine.com (DESIGNER)
- producer@opengine.com (PRODUCER)
- qc@opengine.com (QC)
- client@opengine.com (CLIENT)

**Marcas:** Nike, Coca-Cola, Samsung (con tokens de diseno)

**Proyectos:** 5 proyectos en estados variados (DRAFT, IN_PROGRESS, REVIEW, APPROVED)

---

## Flujo de Datos Completo (vision)

```
1. SETUP
   Brand Config -> Design Tokens -> Component Registry
   Assets (img, video, audio) -> Asset Manager -> S3

2. CREACION
   Usuario selecciona marca -> elige template o ensambla componentes
   Configura timeline -> ajusta props -> preview en Remotion Player

3. DATA
   Sube CSV / conecta Google Sheets -> mapea columnas a props
   Define reglas condicionales -> sistema genera N variaciones
   Preview de grilla con todas las variaciones

4. RENDERING
   Usuario aprueba variaciones -> "Render Batch"
   Jobs entran a cola (BullMQ) -> distribuidos a workers (Lambda/Docker)
   Workers renderizan con Remotion -> MP4 a S3
   Dashboard muestra progreso en tiempo real

5. QC & ENTREGA
   Equipo interno revisa en portal de QC -> marca como listo
   Se genera link para cliente -> cliente revisa y comenta
   Cliente aprueba -> se genera link de entrega final
   Naming convention automatico + manifiesto
```

---

## Integracion con After Effects — Contexto Arquitectonico

> La integracion completa con AE esta documentada en **AE-INTEGRATION.md**. Esta seccion resume las implicaciones arquitectonicas para cada modulo de la plataforma.

### Estado actual del flujo AE en produccion

El equipo de Automation opera hoy con un script JSX personalizado que conecta un JSON de datos con las composiciones de AE. El script aplica expresiones dinamicas para texto, opacidad, color e imagenes, y agrega las composiciones al render queue de AE en una sola operacion. Este flujo produce variaciones de video reales y funciona en produccion.

La plataforma no reemplaza este flujo en el corto plazo — lo integra y lo democratiza.

### Dos caminos de integracion (decision pendiente)

**Camino A — Plataforma genera el JSON para AE:**
El Data Engine (Fase 3) exporta los datos mapeados en el formato JSON que el script de AE ya entiende. AE sigue renderizando localmente, pero cualquier persona puede hacer la configuracion de datos desde la plataforma sin tocar AE. Adopcion inmediata, sin cambios en el workflow de AE.

**Camino B — AE como fabrica de componentes:**
Lizeth exporta sus animaciones de AE con canal alfa (ProRes 4444 / WebM). Esos assets se registran como componentes en la plataforma. Remotion los compone con los datos y renderiza en la nube. AE queda exclusivamente en el flujo de creacion, no en el de produccion masiva.

> Ambas opciones son tecnicamene viables. La decision debe tomarse antes de disenar la Fase 5. Ver AE-INTEGRATION.md para el detalle completo, ventajas, limitaciones y decisiones pendientes.

### Implicaciones por modulo

| Modulo | Impacto Camino A | Impacto Camino B |
|--------|-----------------|-----------------|
| Data Engine (F3) | Agregar exportacion de JSON en formato AE script | Sin cambios adicionales |
| Asset Manager (F2-3) | Assets deben tener nombres consistentes con footage items de AE | Soporte para assets con canal alfa como tipo de componente |
| Component Registry (F1-2) | Sin cambios | Componentes de tipo "AE asset" ademas de componentes Remotion nativos |
| Render Farm (F4) | AE renderiza localmente, no en la nube | Remotion renderiza en la nube incluyendo assets AE |
| Puente AE (F5) | Automatizacion del trigger del script / aerender | Pipeline de importacion de exports AE al Component Registry |

---

## Consideraciones de Escalabilidad

### Rendering
- Remotion Lambda: escala a cientos de renders simultaneos, pago por uso
- Self-hosted Docker: predecible en costo, requiere gestion de infraestructura
- Recomendacion: empezar con Lambda, migrar a self-hosted cuando el volumen justifique

### Storage
- S3 con lifecycle policies: mover videos viejos a S3 Glacier despues de 90 dias
- CDN (CloudFront) para previews y entrega rapida

### Base de datos
- PostgreSQL con connection pooling (PgBouncer)
- Indice en projectId, brandId, status para queries frecuentes
- Particion de tabla RenderJob por fecha si crece mucho

### Seguridad
- Autenticacion por roles: Admin, QC, Designer, Producer, Client
- Guards globales JWT + Roles en NestJS
- Assets y videos en S3 con presigned URLs (no publicos)
- Links de cliente con token y expiracion
- TransformInterceptor stripea datos sensibles de todas las respuestas

---

*Documento vivo — la arquitectura evoluciona con cada fase*
