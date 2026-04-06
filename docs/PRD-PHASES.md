# OP Video Engine — PRD por Fases

**Version:** 2.0
**Fecha:** Abril 2026
**Estado:** Planificacion confirmada

---

## Resumen de Fases

| Fase | Nombre | Enfoque | Pilares |
|---|---|---|---|
| 0 | Fundamentos | Documentacion, design system, estructura base | Base |
| 1 | Motor de Video | Componentes Remotion (atomos, moleculas, organismos) | 2 |
| 2 | Application Shell | Plataforma web: dashboard, navegacion, CRUD de marcas, catalogo | Base web |
| 3 | Data Engine | Conexion de datos, mapeo, logica condicional, variaciones | 1 |
| 4 | Rendering Pipeline | Rendering en la nube, colas, storage, monitoreo | 5 |
| 5 | Workflow & QC | Revision interna, portal cliente, aprobaciones, entrega | 4 |
| 6 | Puente After Effects | Importar assets AE, rendering hibrido | 5 |
| 7 | IA & Adaptacion | Resizing, subtitulos, anti-fatigue, prediccion creativa | 3, 6, 7 |

---

## Fase 0: Fundamentos

**Objetivo:** Establecer la base documental y tecnica sobre la que se construye todo lo demas. Sin esta fase, las siguientes fases no tienen direccion.

**Estado:** En progreso (mayormente completada)

### Entregables

1. **Anatomia del Video**
   - Documentar la estructura modular de un video tipo: intro (cortinilla de entrada) → contenido principal → overlays (durante el video) → outro (cortinilla de cierre)
   - Identificar que partes son parametrizables por formato (TikTok, Instagram, YouTube, CTV)
   - Mapear que partes son reutilizables entre marcas y cuales son brand-specific
   - Definir la taxonomia: que es un atomo, que es una molecula, que es un organismo

2. **Design System en Codigo (Vibe Coding)**
   - Tokens de diseno: paletas de color, tipografias, espaciados, radios de borde, motion
   - Platform Tokens (UI web) vs Brand Tokens (componentes Remotion)
   - Fuente de verdad: JSONs en `src/styles/tokens/source/` → CSS variables → Tailwind v4 theme

3. **Estructura del Proyecto**
   - Arquitectura de carpetas (domains, components, lib, remotion)
   - Convenciones de codigo (naming, types, testing)
   - API client centralizado para comunicacion con NestJS
   - Auth layer (JWT context, middleware, role guards)
   - Providers (React Query + Auth + Toaster)

### Criterios de aceptacion
- Un disenador puede entender la taxonomia de componentes leyendo la documentacion
- Un developer puede configurar el entorno y ver un preview en menos de 15 minutos
- Los tokens del design system estan definidos y funcionando en Tailwind v4
- El proyecto compila sin errores (`pnpm build` + `tsc --noEmit`)
- El login page funciona contra el backend NestJS
- Storybook muestra los tokens del design system

### Progreso actual
- [x] Documentacion completa (.claude/, docs/)
- [x] Design System Vibe Coding (7 token files → CSS → Tailwind v4)
- [x] 9 dominios scaffoldeados (types, schemas, text-maps)
- [x] API client layer (Axios + interceptors + endpoints)
- [x] Auth layer (context, middleware, role guards)
- [x] Providers (React Query + Auth + Toaster)
- [x] Login page basica
- [x] Storybook con stories de tokens
- [ ] Verificar build limpio
- [ ] Verificar type-check

---

## Fase 1: Motor de Video

**Objetivo:** Construir la libreria de componentes animados en Remotion — el equivalente en codigo de lo que AtomX provee en After Effects. Esta fase es SOLO sobre componentes de video, NO sobre la plataforma web.

**Prerequisitos:** Fase 0 completada (build limpio, tokens funcionando)

**Scope:** Exclusivamente componentes Remotion + Remotion Studio. No incluye UI web, no incluye backend, no incluye CRUD.

### Concepto: Atomos → Moleculas → Organismos

#### Atomos (piezas minimas)
Componentes individuales, reutilizables, que no dependen de otros componentes:
- **TextBlock:** Texto animado con fade-in/slide. Props: contenido, fuente, color, animacion, delay
- **PricePatch:** Badge de precio con fondo. Props: precio, precio original (tachado), moneda, color de fondo
- **LogoReveal:** Logo de marca con animacion de entrada. Props: logo URL, tamano, animacion
- **ImageFrame:** Imagen/packshot con efecto 2.5D. Props: imagen URL, zoom, rotacion, parallax
- **ShapeElement:** Formas decorativas (circulos, estrellas, lineas). Props: tipo, color, tamano, animacion
- **VideoClip:** Clip de video como capa. Props: src, volume, playback rate, canal alfa
- **AudioTrack:** Capa de audio (musica, SFX). Props: audio URL, volumen, fade in/out
- **SubtitleTrack:** Subtitulos sincronizados. Props: texto, timestamps, estilo

#### Moleculas (combinaciones funcionales)
Componentes que ensamblan atomos para una funcion especifica:
- **CortinillaEntrada:** LogoReveal + ShapeElements + TextBlock (claim/tagline) + AudioTrack (jingle)
- **CortinillaCierre (EndCard):** LogoReveal + TextBlock (CTA) + ShapeElements (decorativos)
- **ProductOverlay:** ImageFrame (packshot) + PricePatch + TextBlock (nombre producto)
- **PromoBar:** TextBlock (mensaje promo) + ShapeElement (fondo animado)
- **LowerThird:** TextBlock (titulo) + TextBlock (subtitulo) + ShapeElement (barra)

#### Organismos (templates completos)
Composiciones Remotion que ensamblan moleculas en un video completo:
- **PromoVideoTemplate:** Cortinilla Entrada → Contenido (video/imagen) → ProductOverlay → PromoBar → EndCard
- **StoryTemplate:** Hook visual → Contenido rapido → ProductOverlay → CTA (formato 9:16)
- **CTVTemplate:** Cortinilla Entrada → Contenido largo → Overlays periodicos → EndCard (formato 16:9)
- **BannerVideoTemplate:** Fondo → Mensaje → Precio → Logo + CTA (formatos display)

### Sistema de Brand Config para Video

Cada marca tiene una configuracion que define como se renderizan sus componentes:

```typescript
interface BrandConfig {
  name: string
  tokens: {
    colors: { primary: string, secondary: string, accent: string }
    fonts: { heading: string, body: string }
    logo: { url: string, animation: string }
  }
  cortinillas: {
    intro: string   // referencia a molecula registrada
    outro: string
  }
  audioDefaults: {
    jingle: string
    sfx: string
  }
}
```

### Entregables
- Al menos 8 atomos funcionales con props tipados (Zod schemas)
- Al menos 5 moleculas ensambladas
- Al menos 2 organismos (templates) completos y funcionales
- Remotion Studio configurado para previsualizar cualquier componente
- Sistema de Brand Config que permite cambiar marca y ver los cambios en todos los componentes
- Componentes responsivos (se adaptan a 1:1, 9:16, 16:9)
- Documentacion de como crear un nuevo atomo/molecula

### Criterios de aceptacion
- Un developer puede crear un nuevo atomo siguiendo la documentacion en menos de 1 hora
- Los componentes se adaptan a los 3 formatos automaticamente
- Cambiar la marca (BrandConfig) cambia la apariencia visual de todos los componentes
- Los previews en Remotion Studio son fieles al resultado renderizado
- Todos los componentes tienen Zod schemas para sus props

### Lo que NO incluye esta fase
- UI web para navegar componentes (eso es Fase 2)
- CRUD de marcas en la plataforma (eso es Fase 2)
- Backend endpoints (eso es Fase 2+)
- Base de datos (eso es Fase 2+)

---

## Fase 2: Application Shell

**Objetivo:** Construir la plataforma web funcional — el "esqueleto" de la aplicacion sobre el cual todas las fases siguientes construyen sus features. Sin esta fase, no hay donde poner el Data Engine, el Rendering Dashboard, ni el portal de QC.

**Prerequisitos:** Fase 0 completada. Fase 1 en progreso o completada (el shell puede avanzar en paralelo con los componentes Remotion).

**Scope:** UI web, navegacion, layouts autenticados, CRUD basico de entidades core, integracion con backend NestJS.

### Funcionalidades

#### 1. Layout Autenticado
- Sidebar de navegacion con items segun rol del usuario
- Header con info del usuario, notificaciones, logout
- Area de contenido principal con breadcrumbs
- Responsive: sidebar colapsable en mobile
- Dark mode por defecto (Vibe Coding tokens)

#### 2. Dashboard Home
- Vista resumen post-login con metricas clave
- Cards de acceso rapido: proyectos recientes, renders en progreso, pendientes de revision
- Contenido adaptado al rol (Admin ve metricas globales, Producer ve sus proyectos, etc.)

#### 3. Gestion de Marcas (Brand Management)
- CRUD completo de marcas: crear, editar, listar, archivar
- Formulario de marca: nombre, colores (primary/secondary/accent), fuentes, logo
- Subida de assets de marca (logo SVG, fuentes, jingle)
- Preview visual de los tokens configurados
- Asociar marcas a usuarios/equipos

#### 4. Catalogo de Componentes
- Grilla navegable de todos los componentes registrados (atomos, moleculas, organismos)
- Filtros: por tipo, por marca, por tags
- Preview animado de cada componente (via @remotion/player)
- Detalle de componente: props disponibles, schema, formatos soportados
- Formulario para probar un componente con datos custom (playground)

#### 5. Gestion de Proyectos (base)
- CRUD de proyectos: crear, editar, listar, archivar
- Asociar proyecto a marca
- Seleccionar template (organismo) base
- Estado del proyecto: draft → previewing → rendering → delivered
- Lista de proyectos con filtros y busqueda

#### 6. Asset Manager (base)
- Subida de archivos (imagenes, videos, audio) a S3 via backend
- Organizacion por marca y tipo
- Grilla con thumbnails y metadata basica
- Busqueda y filtrado
- Deteccion de formato y dimensiones

#### 7. Gestion de Usuarios (Admin)
- Lista de usuarios con roles
- Invitar nuevos usuarios
- Asignar/cambiar roles (Admin, Designer, Producer, QC, Client)
- Desactivar usuarios

### Entregables
- Layout autenticado completo con sidebar, header, routing protegido
- Dashboard home con cards de resumen
- CRUD de marcas con upload de assets
- Catalogo de componentes con preview via Remotion Player
- CRUD basico de proyectos
- Asset manager con upload y organizacion
- Gestion de usuarios (admin)
- Todas las paginas con Suspense + loading states
- Mobile-first responsive en todas las vistas

### Criterios de aceptacion
- Un usuario puede hacer login, ver el dashboard, y navegar toda la plataforma
- Un Admin puede crear una marca completa con tokens y assets
- Un Producer puede ver el catalogo de componentes y probar uno con datos custom
- Un Producer puede crear un proyecto asociado a una marca
- La navegacion respeta roles: cada usuario ve solo lo que le corresponde
- Todas las paginas cargan con skeleton/loading states apropiados
- La plataforma funciona en mobile (sidebar colapsada, layouts responsivos)

### Dependencia con Backend
Esta fase requiere que los siguientes endpoints del backend NestJS esten disponibles:
- `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- CRUD `/brands` (create, list, get, update, archive)
- CRUD `/projects` (create, list, get, update, archive)
- CRUD `/assets` (upload, list, get, delete) + presigned URLs
- CRUD `/users` (list, invite, update role, deactivate)
- `GET /components` (list, get) — registro de componentes Remotion
- `GET /dashboard/summary` — metricas para el home

---

## Fase 3: Data Engine

**Objetivo:** Conectar fuentes de datos externas a los componentes para generar multiples variaciones automaticamente. Reemplazar el flujo Excel → Script → After Effects.

**Prerequisitos:** Fase 1 (componentes Remotion existen) + Fase 2 (plataforma web existe con proyectos y catalogo)

### Flujo de datos

```
Fuente de datos (CSV / Google Sheets / JSON API)
    ↓
Interfaz de mapeo (columna → prop de componente)
    ↓
Motor de variaciones (1 fila = 1 version del video)
    ↓
Preview en tiempo real de todas las variaciones
```

### Funcionalidades

1. **Importacion de datos**
   - Subir archivo CSV directamente (drag & drop)
   - Conectar Google Sheets via URL (lectura en tiempo real)
   - Endpoint API para recibir JSON
   - Deteccion automatica de columnas y tipos de datos

2. **Mapeo de columnas (Auto-match)**
   - Interfaz visual para conectar columnas del spreadsheet con props de componentes
   - Sugerencia inteligente: si la columna se llama "price", sugerir mapeo a PricePatch.precio
   - Mapeo manual para casos no obvios
   - Transformaciones basicas: formato de moneda, truncar texto, condicionales simples

3. **Logica condicional**
   - Reglas If/Then para mostrar/ocultar componentes
   - Ejemplo: si columna "tiene_descuento" = true → mostrar PricePatch con precio tachado
   - Ejemplo: si columna "formato" = "tiktok" → usar StoryTemplate en vez de PromoVideoTemplate
   - Condicionales por audiencia, region, idioma

4. **Preview de variaciones**
   - Grilla con thumbnail de cada variacion generada
   - Click para ver preview en tamano completo (via Remotion Player)
   - Filtrar por columna, formato, estado
   - Indicador de errores: datos faltantes, imagenes rotas, texto desbordado
   - Seleccion de variaciones para render batch

### Entregables
- Modulo de importacion CSV + Google Sheets
- Interfaz de mapeo visual columna → prop
- Motor de logica condicional (reglas basicas)
- Vista de grilla con previews de variaciones
- Validacion de datos con reporte de errores

### Criterios de aceptacion
- Un usuario puede subir un CSV de 100 filas y ver 100 previews en menos de 2 minutos
- El mapeo automatico acierta en al menos el 70% de las columnas
- Las reglas condicionales permiten mostrar/ocultar componentes
- Los errores de datos (campos vacios, formatos incorrectos) se muestran claramente

---

## Fase 4: Rendering Pipeline

**Objetivo:** Implementar rendering real de video en la nube. Pasar de previews a archivos MP4 descargables, procesados en paralelo sin bloquear maquinas locales.

**Prerequisitos:** Fase 3 (variaciones generadas y seleccionadas para render)

### Arquitectura de rendering

```
Cola de trabajos (BullMQ + Redis)
    ↓
Orquestador NestJS (distribuye a workers)
    ↓
Workers de rendering (Remotion Lambda / Docker containers)
    ↓
Storage (S3 + CloudFront)
    ↓
Notificacion + URLs de descarga
```

### Funcionalidades

1. **Job Queue**
   - Crear batch de rendering: seleccionar variaciones → enviar a cola
   - Prioridades: urgente, normal, baja
   - Estado en tiempo real: pending → rendering → ready → delivered
   - Reintentar jobs fallidos automaticamente (max 3 intentos)

2. **Workers de rendering**
   - Remotion Lambda (AWS) — escalado automatico, pago por uso (fase inicial)
   - Docker containers auto-escalables — mas control, costo predecible (futuro)
   - Rendering paralelo: 100 variaciones se procesan simultaneamente
   - Soporte de formatos: MP4 (H.264), MOV, WebM

3. **Storage y entrega**
   - Videos renderizados en S3 con CloudFront CDN
   - URLs de descarga con expiracion configurable
   - Descarga individual o batch (ZIP)
   - Naming convention automatico: `{marca}_{campana}_{producto}_{formato}_{version}.mp4`

4. **Dashboard de rendering**
   - Barra de progreso global del batch
   - Estado individual por variacion (icono + porcentaje)
   - Jobs fallidos con detalle del error
   - Reintentar job individual con un clic
   - Notificacion cuando el batch se completa

### Entregables
- Sistema de cola de trabajos (BullMQ + Redis en backend)
- Rendering con Remotion Lambda funcionando
- Storage en S3 con URLs de descarga via CloudFront
- Dashboard de estado de jobs con progreso en tiempo real
- Sistema de naming convention automatico
- Descarga individual y batch (ZIP)

### Criterios de aceptacion
- Un batch de 50 videos se renderiza en menos de 15 minutos
- Los videos renderizados tienen calidad identica a los previews
- Un job fallido se reintenta automaticamente hasta 3 veces
- Los videos se pueden descargar individualmente o en batch
- El dashboard muestra progreso en tiempo real (WebSocket o polling)

---

## Fase 5: Workflow & QC

**Objetivo:** Construir el flujo de revision, aprobacion y entrega de videos al cliente. Eliminar correos, WeTransfer y Excel de tracking.

**Prerequisitos:** Fase 4 (videos renderizados disponibles en S3)

### Flujo de QC

```
Videos renderizados
    ↓
Revision interna (equipo Automation/QC)
    ↓
Publicacion al portal del cliente
    ↓
Cliente revisa, comenta, aprueba/rechaza
    ↓
Ajustes (si necesario) → Re-render → Re-review
    ↓
Entrega final (links de descarga)
```

### Funcionalidades

1. **Portal de revision interna**
   - Vista de grilla con todos los videos de una campana
   - Filtros: por formato, por marca, por estado (pendiente/aprobado/rechazado)
   - Reproduccion de video inline
   - Comparacion lado a lado de versiones
   - Marcar como "listo para cliente"

2. **Portal del cliente**
   - Vista limpia y brand-safe (sin interfaz tecnica)
   - Acceso via link con token (sin crear cuenta)
   - Reproduccion de video inline
   - Comentarios con timestamp: "En el segundo 3, el logo esta cortado"
   - Aprobacion/Rechazo por pieza individual
   - Aprobacion en bulk: "Aprobar todos los de formato 16:9"
   - Historial de versiones por pieza

3. **Entrega**
   - Link de entrega compartible (con expiracion)
   - Descarga selectiva o completa (ZIP)
   - Manifiesto de entrega: lista de todas las piezas con metadata
   - Integracion opcional con plataformas de ad serving (futuro)

4. **Notificaciones**
   - Email cuando el batch esta listo para revision
   - Email al equipo cuando el cliente deja comentarios
   - Resumen diario de estado de campanas activas (futuro)

### Entregables
- Portal de revision interna con filtros, estados, y video inline
- Portal de cliente con comentarios timestamped y aprobaciones
- Sistema de entrega con links compartibles y ZIP
- Notificaciones por email (batch listo, cliente comento)

### Criterios de aceptacion
- Un cliente puede revisar y aprobar 50 videos sin salir de la plataforma
- Los comentarios con timestamp son precisos (+-1 segundo)
- El equipo interno ve en tiempo real cuando un cliente aprueba/rechaza
- La entrega final se genera con un clic (link o ZIP)
- El portal del cliente funciona sin crear cuenta (token-based access)

---

## Fase 6: Puente After Effects (Integracion Hibrida)

**Objetivo:** Permitir que composiciones creadas en After Effects se integren al pipeline de OP Video Engine como componentes reutilizables. No eliminar AE — hacerlo complementario.

**Prerequisitos:** Fase 2 (Asset Manager y Component Registry funcionando)

### Casos de uso

1. **Importar cortinillas existentes de AE**
   - El equipo ya tiene cortinillas elaboradas en After Effects que tomaron semanas de perfeccionar
   - En vez de rehacerlas en Remotion, exportarlas como video con canal alfa (transparencia)
   - Registrarlas como moleculas en el sistema de componentes

2. **Assets de AE como atomos**
   - Exportar transiciones, efectos, o animaciones complejas de AE como clips reutilizables
   - Catalogarlos en la libreria de componentes con metadata (duracion, formato, tags)

3. **Rendering hibrido (avanzado, futuro)**
   - Para proyectos que requieran VFX complejos: usar Nexrender o similar para renderizar composiciones AE en la nube
   - El resultado se integra como input al pipeline de Remotion
   - El usuario no necesita tener AE instalado localmente

### Funcionalidades

1. **Importador de assets AE**
   - Subir archivos de video con canal alfa (.mov ProRes 4444, .webm con alpha)
   - Subir secuencias de frames (PNG con transparencia)
   - Metadata automatica: duracion, resolucion, canal alfa detectado
   - Catalogacion con tags y categorias

2. **Registro como componente**
   - Un asset AE importado se registra como atomo o molecula en el Component Registry
   - Se le asignan props configurables: posicion, escala, timing de entrada/salida
   - Se puede usar en cualquier organismo (template) como un componente mas

3. **Pipeline Nexrender (futuro)**
   - Enviar proyecto .aep + datos → renderizar en la nube sin AE local
   - Resultado alimenta al pipeline principal
   - Solo para proyectos que lo justifiquen por complejidad

### Entregables
- Importador de assets con canal alfa (upload + deteccion)
- Sistema de catalogacion y registro como componentes Remotion
- Integracion en el compositor de templates (se pueden mezclar con componentes nativos)
- Documentacion de formatos soportados y flujo de exportacion desde AE

### Criterios de aceptacion
- Una cortinilla exportada de AE con canal alfa se integra como componente funcional
- El componente importado se puede combinar con atomos nativos de Remotion
- El preview muestra correctamente la composicion hibrida (Remotion + AE asset)
- Los formatos soportados estan documentados con guia paso a paso

---

## Fase 7: IA & Adaptacion Inteligente

**Objetivo:** Integrar capacidades de inteligencia artificial para automatizar tareas mecanicas, optimizar la produccion, y habilitar los pilares avanzados de la vision (Data-Based, Anti-Fatigue).

**Prerequisitos:** Fases 1-5 completadas (pipeline completo funcionando)

### Funcionalidades por sub-fase

#### 7.1 — Resizing Automatico
- A partir de un video master (ej: 16:9), generar automaticamente versiones en otros formatos (9:16, 1:1, 4:5)
- IA analiza la composicion y decide como recortar/reposicionar elementos
- El usuario revisa y ajusta si necesario
- Reduce el 80% del trabajo manual de adaptacion de formatos

#### 7.2 — Subtitulos Automaticos
- Transcripcion automatica de audio a texto (Whisper o similar)
- Sincronizacion con timeline del video
- Estilos de subtitulos configurables por marca
- Soporte multi-idioma

#### 7.3 — Analisis de Escenas
- IA analiza el contenido del video (objetos, colores, movimiento)
- Sugiere puntos optimos para overlays
- Detecta escenas y permite segmentacion automatica

#### 7.4 — Anti-Fatigue (Dynamic Video Refresh)
- Generar micro-variaciones automaticas (timing, encuadre, composicion)
- Evitar que plataformas como Meta/TikTok marquen el contenido como repetitivo
- Escalar pauta sin saturar frecuencia

#### 7.5 — Video Data-Based (Prediccion Creativa)
- Integrar datos de performance (CTR, VTR, Attention Maps)
- Agentes de IA que analizan que estimulos funcionan mejor
- Sugerencias automaticas de jerarquia visual basadas en datos historicos

### Entregables (por sub-fase)
- 7.1: Motor de resizing con preview y ajuste manual
- 7.2: Pipeline de subtitulos con Whisper + editor de sincronizacion
- 7.3: API de analisis de escenas integrada al compositor
- 7.4: Generador de variaciones con reglas anti-repeticion
- 7.5: Dashboard de insights + motor de sugerencias

### Criterios de aceptacion
- El resizing automatico produce resultados aceptables (sin revision) en el 70%+ de los casos
- Los subtitulos tienen precision >95% en espanol e ingles
- Las micro-variaciones anti-fatigue pasan la validacion de plataformas sin ser marcadas

---

## Dependencias entre Fases

```
Fase 0 (Fundamentos)
  ├── Fase 1 (Motor de Video) ─────────┐
  │                                     ├── Fase 3 (Data Engine) → Fase 4 (Rendering) → Fase 5 (QC)
  └── Fase 2 (Application Shell) ──────┘
                │
                └── Fase 6 (Puente AE) — puede iniciar despues de Fase 2

Fase 7 (IA) — requiere pipeline completo (Fases 1-5)
```

**Nota:** Fase 1 y Fase 2 pueden avanzar EN PARALELO despues de Fase 0. Fase 1 se enfoca en Remotion (componentes de video), Fase 2 en Next.js (plataforma web). Los dos tracks convergen en Fase 3 cuando el Data Engine necesita tanto componentes como plataforma.

---

*Documento vivo — se actualiza conforme avancen las fases*
