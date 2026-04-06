# OP Video Engine — Arquitectura Tecnica

**Version:** 2.0
**Fecha:** Abril 2026
**Estado:** Decisiones confirmadas

---

## Vision General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OP VIDEO ENGINE                              │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Asset    │  │  Data    │  │Component │  │  Render  │           │
│  │  Manager  │  │  Engine  │  │  Studio  │  │  Farm    │           │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘           │
│       │              │              │              │                 │
│       └──────────────┴──────────────┴──────────────┘                │
│                           │                                         │
│                    ┌──────┴──────┐                                  │
│                    │  Workflow   │                                  │
│                    │  & QC Hub   │                                  │
│                    └──────┬──────┘                                  │
│                           │                                         │
│              ┌────────────┴────────────┐                           │
│              │    Client Portal        │                           │
│              │  (Preview & Approval)   │                           │
│              └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnologico (Confirmado)

### Frontend (este repositorio)

| Tecnologia | Version | Proposito |
|---|---|---|
| **Next.js** | 15+ (App Router) | Framework web, SSR, routing |
| **React** | 19+ | UI library |
| **TypeScript** | 5+ | Tipado estatico |
| **Tailwind CSS** | v4 | Utility-first styling |
| **shadcn/ui** | latest | Component library (via MCP) |
| **React Query (TanStack)** | v5 | Server state (data fetching desde NestJS API) |
| **Zustand** | v4+ | Client/UI state SOLAMENTE (sidebar, theme, filters) |
| **React Hook Form** | v7+ | Formularios |
| **Zod** | v3+ | Validacion de schemas |
| **@remotion/player** | 4+ | Preview de video en browser |
| **Framer Motion** | latest | Animaciones UI (no video) |

### Motor de Video

| Tecnologia | Version | Proposito |
|---|---|---|
| **Remotion** | 4+ | Framework de video programatico |
| **@remotion/player** | 4+ | Preview en browser (produccion) |
| **Remotion Studio** | 4+ | Preview en desarrollo |
| **@remotion/lambda** | 4+ | Rendering en AWS Lambda |
| **@remotion/renderer** | 4+ | Rendering self-hosted (Docker) |

### Backend (repositorio separado: `op-video-engine-backend`)

| Tecnologia | Version | Proposito |
|---|---|---|
| **NestJS** | 10+ | Framework backend (REST API) |
| **PostgreSQL** | 15+ | Base de datos relacional |
| **Prisma** | 5+ | ORM |
| **BullMQ** | v4+ | Cola de trabajos (render jobs) |
| **Redis** | 7+ | Cache + broker para BullMQ |
| **Passport.js** | latest | Autenticacion |
| **JWT** | — | Tokens en httpOnly cookies |

### Infraestructura

| Tecnologia | Proposito |
|---|---|
| **AWS Lambda** | Workers de rendering (Remotion Lambda) |
| **AWS S3** | Storage de videos, assets, exports |
| **AWS CloudFront** | CDN para previews y entrega |
| **Docker** | Workers self-hosted (alternativa a Lambda) |
| **GitHub Actions** | CI/CD |

### Integraciones Externas

| Servicio | Proposito |
|---|---|
| **Google Sheets API** | Lectura de datos en tiempo real |
| **SendGrid / Resend** | Notificaciones por email |
| **AWS S3** | Storage de videos y assets |

---

## Separacion Frontend ↔ Backend

```
┌─────────────────────────────────┐     ┌──────────────────────────────────┐
│   FRONTEND (este repo)          │     │   BACKEND (repo separado)        │
│                                 │     │                                  │
│  Next.js 15 + React 19         │────▶│  NestJS 10+ (REST API)           │
│  @remotion/player (preview)    │ API │  PostgreSQL + Prisma             │
│  React Query (data fetching)   │◀────│  BullMQ + Redis (render queue)   │
│  Zustand (UI state only)       │     │  Remotion Lambda (cloud render)  │
│  Tailwind v4 + shadcn/ui      │     │  S3 + CloudFront (storage)       │
│  Zod (frontend validation)     │     │  Passport.js + JWT (auth)        │
└─────────────────────────────────┘     └──────────────────────────────────┘
```

**Reglas de comunicacion:**
- Frontend NUNCA accede directamente a la base de datos
- Toda mutacion va via REST API (React Query `useMutation` → NestJS endpoint)
- NO Server Actions para mutaciones — solo para server-side rendering cuando aplique
- Auth via JWT en httpOnly cookies — frontend envia cookie automaticamente, backend valida con Passport Guard
- API client centralizado en `src/lib/api/` — NINGUN componente hace fetch directo

---

## Modulos del Sistema

### 1. Asset Manager

Repositorio centralizado de todos los recursos multimedia.

**Responsabilidades:**
- Subida y catalogacion de assets (imagenes, videos, audio, logos, fuentes)
- Organizacion por marca, campana, tipo
- Metadata automatica (dimensiones, duracion, formato, peso)
- Deteccion de canal alfa en videos
- Versionamiento de assets
- Busqueda y filtrado

**Modelo de datos:**
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

### 2. Component Registry

Sistema de registro y gestion de componentes Remotion.

**Responsabilidades:**
- Registro de atomos, moleculas y organismos
- Definicion de props (schema Zod) por componente
- Preview individual de cada componente
- Gestion de versiones de componentes
- Asociacion componente ↔ marca

**Modelo de datos:**
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

### 3. Data Engine

Motor de conexion entre fuentes de datos y props de componentes.

**Responsabilidades:**
- Importacion de CSV, Google Sheets, JSON
- Mapeo visual columna → prop
- Auto-match inteligente (nombre de columna → prop sugerido)
- Logica condicional (reglas if/then)
- Validacion de datos contra schema del componente
- Generacion de variaciones (1 fila = 1 version)

**Modelo de datos:**
```
DataSource {
  id: UUID
  projectId: UUID
  type: "csv" | "google_sheets" | "json_api"
  config: {
    url?: string (Google Sheets URL)
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
  propPath: string (ej: "pricePatch.price")
  transform?: string (ej: "currency_COP", "truncate_30")
}

ConditionalRule {
  id: UUID
  projectId: UUID
  condition: {
    column: string
    operator: "equals" | "contains" | "gt" | "lt" | "is_true" | "is_false"
    value: any
  }
  action: {
    type: "show" | "hide" | "swap_template" | "change_prop"
    target: string (componentId o propPath)
    value?: any
  }
}
```

### 4. Compositor

Interfaz para ensamblar componentes en un video completo.

**Responsabilidades:**
- Timeline visual simplificado
- Drag & drop de componentes
- Configuracion de timing (cuando aparece/desaparece cada componente)
- Seleccion de template base (organismo) o ensamblaje libre
- Preview en tiempo real con Remotion Player
- Guardar como template reutilizable

**Modelo de datos:**
```
Project {
  id: UUID
  brandId: UUID
  name: string
  description: string
  templateId?: UUID (organismo base, opcional)
  composition: {
    duration: number (frames)
    fps: number
    formats: Format[] (["16:9", "9:16", "1:1"])
    layers: Layer[]
  }
  dataSourceId?: UUID
  status: "draft" | "previewing" | "rendering" | "delivered"
  createdBy: UUID
  createdAt: DateTime
}

Layer {
  id: UUID
  componentId: UUID
  props: JSON (valores o referencias a columnas del DataSource)
  timing: {
    startFrame: number
    endFrame: number
    transition: "cut" | "fade" | "slide"
  }
  position: { x: number, y: number }
  zIndex: number
}
```

### 5. Render Farm

Sistema de rendering distribuido en la nube.

**Responsabilidades:**
- Recibir jobs de rendering desde la cola (BullMQ)
- Distribuir a workers (Remotion Lambda o Docker)
- Monitorear progreso
- Reintentar fallos
- Almacenar resultados en S3
- Notificar completacion

**Modelo de datos:**
```
RenderJob {
  id: UUID
  projectId: UUID
  variationIndex: number
  format: "16:9" | "9:16" | "1:1"
  status: "queued" | "rendering" | "completed" | "failed"
  progress: number (0-100)
  inputProps: JSON
  outputUrl?: string (S3 URL)
  outputMetadata?: {
    duration: number
    fileSize: number
    codec: string
    resolution: string
  }
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

### 6. Workflow & QC Hub

Gestion de revision, aprobacion y entrega.

**Modelo de datos:**
```
Review {
  id: UUID
  batchId: UUID
  type: "internal" | "client"
  status: "pending" | "in_review" | "approved" | "changes_requested"
  reviewerEmail?: string
  accessToken: string (link compartible)
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
  manifest: JSON (lista de piezas con metadata)
  createdAt: DateTime
}
```

---

## Flujo de Datos Completo

```
1. SETUP
   Brand Config → Design Tokens → Component Registry
   Assets (img, video, audio) → Asset Manager → S3

2. CREACION
   Usuario selecciona marca → elige template (organismo) o ensambla componentes
   Configura timeline → ajusta props → preview en Remotion Player

3. DATA
   Sube CSV / conecta Google Sheets → mapea columnas a props
   Define reglas condicionales → sistema genera N variaciones
   Preview de grilla con todas las variaciones

4. RENDERING
   Usuario aprueba variaciones → "Render Batch"
   Jobs entran a cola (BullMQ) → distribuidos a workers (Lambda/Docker)
   Workers renderizan con Remotion → MP4 a S3
   Dashboard muestra progreso en tiempo real

5. QC & ENTREGA
   Equipo interno revisa en portal de QC → marca como listo
   Se genera link para cliente → cliente revisa y comenta
   Cliente aprueba → se genera link de entrega final
   Naming convention automatico + manifiesto
```

---

## Consideraciones de Escalabilidad

### Rendering
- **Remotion Lambda**: escala a cientos de renders simultaneos, pago por uso
- **Self-hosted Docker**: predecible en costo, requiere gestion de infraestructura
- **Recomendacion**: empezar con Lambda, migrar a self-hosted cuando el volumen justifique

### Storage
- S3 con lifecycle policies: mover videos viejos a S3 Glacier despues de 90 dias
- CDN (CloudFront) para previews y entrega rapida

### Base de datos
- PostgreSQL con connection pooling (PgBouncer)
- Indices en projectId, brandId, status para queries frecuentes
- Particion de tabla RenderJob por fecha si crece mucho

### Seguridad
- **Autenticacion**: JWT en httpOnly cookies, validados por NestJS Passport Guards
- **Roles**: Admin, Designer, Producer, QC, Client — definidos en backend, consumidos por frontend
- **Assets**: S3 con presigned URLs (no publicos)
- **Client Portal**: Links con token de acceso y expiracion
- **Audit log**: Todas las acciones relevantes logueadas por backend

---

## Decisiones Arquitectonicas (ADR Log)

| # | Decision | Alternativa descartada | Razon |
|---|---|---|---|
| ADR-001 | NestJS como backend separado | Next.js API Routes | Separacion clara de concerns, BullMQ nativo, Passport.js, escalabilidad independiente |
| ADR-002 | JWT en httpOnly cookies | NextAuth.js / Clerk | Control total sobre auth, sin dependencia de terceros, compatible con NestJS Passport |
| ADR-003 | Prisma como ORM | Drizzle | Ecosistema maduro, migraciones robustas, type safety excelente |
| ADR-004 | React Query para server state | Zustand para todo | Separacion server state vs UI state, cache automatico, revalidacion, mutations |
| ADR-005 | Tailwind CSS v4 | CSS Modules / Styled Components | Design tokens como CSS variables, utility-first, performance, DX |
| ADR-006 | Remotion Lambda (inicio) | Self-hosted Docker | Rapido de implementar, escala automatica, migrar a Docker cuando justifique |

---

*Documento vivo — se actualiza cuando se toman decisiones arquitectonicas*
