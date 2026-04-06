# OP Video Engine — User Stories

**Version:** 2.0
**Fecha:** Abril 2026

---

## Roles del Sistema

| Rol | Descripcion | Acceso |
|---|---|---|
| **Admin** | Gestiona marcas, usuarios, configuracion global | Todo |
| **Designer** | Crea y gestiona componentes visuales (atomos, moleculas) | Componentes, assets, preview |
| **Producer** | Ensambla videos, conecta datos, lanza renders | Proyectos, data, rendering, QC |
| **QC Reviewer** | Revisa videos antes de enviar al cliente | Portal QC, comentarios |
| **Client** | Revisa, comenta y aprueba videos finales | Portal cliente (solo lectura + comentarios) |

---

## Fase 0: Fundamentos

### US-001: Configurar entorno de desarrollo
**Como** Developer
**Quiero** clonar el repo, instalar dependencias, y ver la aplicacion corriendo
**Para que** pueda empezar a contribuir al proyecto

**Criterios de aceptacion:**
- `pnpm install` + `pnpm dev` levanta la aplicacion sin errores
- Puedo ver la pagina de login en el browser
- Remotion Studio se puede abrir y muestra los templates existentes
- Storybook muestra los tokens del design system

### US-002: Autenticarse en la plataforma
**Como** Usuario (cualquier rol)
**Quiero** hacer login con mi email y contrasena
**Para que** pueda acceder a las funciones de la plataforma segun mi rol

**Criterios de aceptacion:**
- Puedo ingresar email y contrasena en la pagina de login
- Si las credenciales son correctas, se me redirige al dashboard
- Si son incorrectas, veo un mensaje de error claro
- Mi sesion persiste al refrescar la pagina (JWT en httpOnly cookie)
- Puedo hacer logout

---

## Fase 1: Motor de Video

### US-101: Crear un atomo Remotion
**Como** Designer/Developer
**Quiero** crear un nuevo componente atomico (ej: TextBlock, PricePatch) en Remotion
**Para que** pueda ser reutilizado en multiples moleculas y templates

**Criterios de aceptacion:**
- Puedo crear un componente React que sigue la estructura estandar del proyecto
- El componente acepta props tipados con schema Zod
- Puedo previsualizarlo en Remotion Studio con datos de prueba
- El componente se adapta a los 3 formatos (16:9, 9:16, 1:1)

### US-102: Ensamblar una molecula
**Como** Designer/Developer
**Quiero** combinar atomos existentes en una molecula (ej: CortinillaEntrada)
**Para que** se pueda usar como bloque funcional en templates completos

**Criterios de aceptacion:**
- La molecula combina 2+ atomos con timing coordinado
- Acepta props de alto nivel que se distribuyen a sus atomos internos
- La animacion de entrada/salida funciona como unidad
- Funciona en los 3 formatos

### US-103: Crear un template (organismo)
**Como** Designer/Developer
**Quiero** ensamblar moleculas y atomos en un template de video completo
**Para que** los Producers puedan usarlo como base para campanas

**Criterios de aceptacion:**
- El template define la estructura temporal: intro → contenido → overlays → cierre
- Cada slot del template acepta moleculas intercambiables
- Puedo definir que props son editables por el Producer y cuales son fijos
- El preview muestra el video completo con datos de ejemplo

### US-104: Aplicar Brand Config a componentes
**Como** Designer/Developer
**Quiero** cambiar la marca (BrandConfig) y que todos los componentes se adapten visualmente
**Para que** los mismos componentes sirvan para multiples marcas

**Criterios de aceptacion:**
- Cambio el BrandConfig y los colores, fuentes, logos se actualizan en todos los componentes
- El preview en Remotion Studio refleja los cambios inmediatamente
- Los componentes usan los tokens de la marca, no valores hardcodeados

---

## Fase 2: Application Shell

### US-201: Navegar la plataforma con layout autenticado
**Como** Usuario autenticado (cualquier rol)
**Quiero** ver una sidebar con las secciones disponibles para mi rol y navegar entre ellas
**Para que** pueda acceder a todas las funcionalidades de la plataforma de forma organizada

**Criterios de aceptacion:**
- Despues del login veo un layout con sidebar, header, y area de contenido
- La sidebar muestra solo las secciones permitidas para mi rol
- Puedo navegar entre secciones sin recargar la pagina
- En mobile, la sidebar se colapsa y se abre con un boton
- El header muestra mi nombre, rol, y opcion de logout

### US-202: Ver dashboard de resumen
**Como** Usuario autenticado
**Quiero** ver un dashboard con un resumen del estado actual (proyectos, renders, pendientes)
**Para que** tenga una vision rapida de lo que necesita mi atencion

**Criterios de aceptacion:**
- Veo cards con metricas relevantes a mi rol
- Admin: metricas globales (total proyectos, renders hoy, usuarios activos)
- Producer: mis proyectos recientes, renders en progreso, pendientes de revision
- Designer: componentes recientes, assets subidos
- Puedo hacer clic en una card para ir a la seccion correspondiente

### US-203: Gestionar marcas
**Como** Admin
**Quiero** crear, editar, y listar las marcas registradas en la plataforma
**Para que** cada marca tenga su identidad visual configurada para los componentes de video

**Criterios de aceptacion:**
- Puedo crear una marca con: nombre, colores (primary/secondary/accent), fuentes, logo
- Puedo subir assets de marca (logo SVG, fuentes TTF/WOFF, jingle MP3)
- Veo una lista de marcas con preview visual de sus tokens
- Puedo editar los tokens y los cambios se reflejan en previews existentes
- Puedo archivar una marca que ya no se usa

### US-204: Navegar catalogo de componentes
**Como** Producer
**Quiero** ver todos los componentes disponibles (atomos, moleculas, organismos) con previews
**Para que** pueda elegir cuales usar al ensamblar un video

**Criterios de aceptacion:**
- Veo una grilla de todos los componentes registrados
- Puedo filtrar por tipo (atomo/molecula/organismo), por marca, por tags
- Cada componente muestra un preview animado (via Remotion Player)
- Puedo ver los props configurables de cada componente

### US-205: Probar componente con datos custom
**Como** Producer
**Quiero** ver un preview de cualquier componente con datos que yo ingrese
**Para que** pueda validar que se ve bien antes de usarlo en un proyecto

**Criterios de aceptacion:**
- Puedo seleccionar un componente del catalogo
- Puedo editar sus props en un formulario generado desde el Zod schema
- El preview se actualiza en tiempo real
- Puedo cambiar el formato (16:9, 9:16, 1:1) y ver como se adapta

### US-206: Gestionar proyectos
**Como** Producer
**Quiero** crear y gestionar proyectos de video asociados a una marca
**Para que** pueda organizar mis campanas de produccion de video

**Criterios de aceptacion:**
- Puedo crear un proyecto con: nombre, descripcion, marca asociada, template base
- Veo una lista de mis proyectos con estado y fecha
- Puedo filtrar y buscar proyectos
- Puedo editar los datos del proyecto
- Puedo archivar un proyecto terminado

### US-207: Gestionar assets
**Como** Producer / Designer
**Quiero** subir, organizar, y buscar archivos multimedia (imagenes, videos, audio)
**Para que** tenga todos los recursos disponibles para usar en componentes y templates

**Criterios de aceptacion:**
- Puedo subir archivos via drag & drop
- Los archivos se organizan por marca y tipo automaticamente
- Veo thumbnails de cada asset con metadata (dimensiones, duracion, peso)
- Puedo buscar por nombre, filtrar por tipo y marca
- Puedo eliminar assets que ya no necesito

### US-208: Gestionar usuarios
**Como** Admin
**Quiero** ver, invitar, y gestionar los usuarios de la plataforma
**Para que** cada persona tenga el acceso correcto segun su rol

**Criterios de aceptacion:**
- Veo una lista de usuarios con nombre, email, rol, y estado
- Puedo invitar un nuevo usuario con un rol asignado
- Puedo cambiar el rol de un usuario existente
- Puedo desactivar un usuario
- No puedo desactivar mi propia cuenta

---

## Fase 3: Data Engine

### US-301: Importar datos desde CSV
**Como** Producer
**Quiero** subir un archivo CSV con datos de campana (productos, precios, mensajes)
**Para que** el sistema genere automaticamente una variacion de video por cada fila

**Criterios de aceptacion:**
- Puedo arrastrar/soltar un archivo CSV
- El sistema detecta las columnas y muestra una vista previa de los datos
- Veo cuantas filas (variaciones) se generaran
- Los errores de formato se senalan claramente

### US-302: Conectar Google Sheets
**Como** Producer
**Quiero** conectar una hoja de Google Sheets como fuente de datos
**Para que** los datos se actualicen automaticamente sin re-subir archivos

**Criterios de aceptacion:**
- Puedo pegar la URL de un Google Sheet
- El sistema lee las columnas y filas
- Si cambio un dato en el Sheet, el sistema lo detecta al refrescar
- Puedo configurar refresco automatico (cada X minutos)

### US-303: Mapear columnas a props
**Como** Producer
**Quiero** conectar visualmente cada columna de mi spreadsheet con un prop del template
**Para que** los datos llenen automaticamente los componentes del video

**Criterios de aceptacion:**
- Veo las columnas del spreadsheet a la izquierda y los props del template a la derecha
- Puedo conectar arrastrando o seleccionando
- El sistema sugiere mapeos automaticos (auto-match) basado en nombres
- Puedo aplicar transformaciones (formato moneda, truncar, mayusculas)
- Al mapear, el preview se actualiza con datos de la primera fila

### US-304: Definir reglas condicionales
**Como** Producer
**Quiero** crear reglas if/then para mostrar/ocultar componentes segun los datos
**Para que** las variaciones se adapten inteligentemente al contenido

**Criterios de aceptacion:**
- Puedo crear una regla: "Si columna X = valor Y, entonces mostrar/ocultar componente Z"
- Puedo crear reglas para cambiar el template segun una columna
- Las reglas se aplican en el preview de cada variacion
- Puedo combinar condiciones (AND/OR)

### US-305: Previsualizar grilla de variaciones
**Como** Producer
**Quiero** ver una grilla con thumbnails de todas las variaciones generadas
**Para que** pueda revisar rapidamente que todas se ven correctas

**Criterios de aceptacion:**
- Veo un thumbnail por cada fila del spreadsheet
- Puedo hacer clic en cualquiera para ver el preview en tamano completo
- Puedo filtrar por columna o buscar por texto
- Las variaciones con errores (datos faltantes, imagenes rotas) se marcan en rojo
- Puedo seleccionar/deseleccionar variaciones para el render batch

---

## Fase 4: Rendering Pipeline

### US-401: Lanzar render batch
**Como** Producer
**Quiero** enviar las variaciones seleccionadas a renderizar en la nube
**Para que** se generen los MP4 finales sin bloquear mi computador

**Criterios de aceptacion:**
- Puedo seleccionar variaciones y formatos a renderizar
- Al hacer clic en "Render Batch", los jobs entran a la cola
- Veo un dashboard con el progreso de cada job
- No necesito mantener la pagina abierta para que continue

### US-402: Monitorear estado de rendering
**Como** Producer
**Quiero** ver en tiempo real el estado de mis renders (pendiente, procesando, listo, fallido)
**Para que** sepa cuando estan disponibles para revision

**Criterios de aceptacion:**
- Dashboard con barra de progreso global del batch
- Estado individual por variacion (icono de estado + porcentaje)
- Los jobs fallidos muestran el error
- Puedo reintentar un job fallido con un clic
- Recibo notificacion cuando el batch se completa

### US-403: Descargar videos renderizados
**Como** Producer
**Quiero** descargar los videos finales individualmente o en batch
**Para que** pueda entregarlos al cliente o subirlos a plataformas

**Criterios de aceptacion:**
- Puedo descargar un video individual haciendo clic
- Puedo descargar todo el batch como ZIP
- Los archivos siguen la naming convention: `{marca}_{campana}_{producto}_{formato}.mp4`
- La descarga es rapida (CDN)

---

## Fase 5: Workflow & QC

### US-501: Revision interna de videos
**Como** QC Reviewer
**Quiero** revisar todos los videos de un batch antes de enviarselos al cliente
**Para que** pueda detectar errores y asegurar calidad

**Criterios de aceptacion:**
- Veo la grilla de videos renderizados con opcion de play inline
- Puedo marcar un video como "aprobado" o "requiere cambios"
- Puedo dejar comentarios con timestamp en videos especificos
- Puedo filtrar: solo pendientes, solo con errores, por formato
- Puedo marcar el batch como "listo para cliente"

### US-502: Portal de revision para el cliente
**Como** Client
**Quiero** revisar los videos de mi campana en una interfaz limpia y facil de usar
**Para que** pueda aprobar o pedir cambios sin necesidad de descargar archivos

**Criterios de aceptacion:**
- Recibo un link por email que me lleva al portal (sin crear cuenta)
- Veo todos los videos de mi campana organizados
- Puedo reproducir cada video inline
- Puedo dejar comentarios en un video (con timestamp opcional)
- Puedo aprobar o rechazar cada video
- Puedo aprobar en bulk ("aprobar todos")
- Veo el historial de versiones si hay re-renders

### US-503: Generar link de entrega
**Como** Producer
**Quiero** generar un link de entrega con todos los videos aprobados
**Para que** el cliente pueda descargar las piezas finales

**Criterios de aceptacion:**
- Solo se incluyen videos con estado "aprobado"
- El link tiene fecha de expiracion configurable
- El cliente puede descargar individual o todo en ZIP
- Se genera un manifiesto (lista de piezas con metadata)
- El link es compartible (no requiere login)

---

## Fase 6: Puente After Effects

### US-601: Importar asset de After Effects
**Como** Designer
**Quiero** subir un video con canal alfa exportado de After Effects
**Para que** se registre como componente reutilizable en la plataforma

**Criterios de aceptacion:**
- Puedo subir .mov (ProRes 4444) o .webm con canal alfa
- El sistema detecta automaticamente si tiene transparencia
- Puedo asignar metadata: nombre, tipo (intro, transicion, overlay), tags, marca
- Se genera un thumbnail automatico
- El asset queda disponible en el catalogo de componentes

### US-602: Usar asset AE en un template
**Como** Producer
**Quiero** usar un asset importado de AE como componente dentro de un template Remotion
**Para que** pueda combinar elementos complejos de AE con el sistema automatizado

**Criterios de aceptacion:**
- El asset AE aparece en el catalogo como un componente mas
- Puedo configurar posicion, timing, y escala
- El preview muestra correctamente la transparencia sobre otros elementos
- El render final integra el asset sin artefactos

---

## Fase 7: IA & Adaptacion

### US-701: Resizing automatico de video
**Como** Producer
**Quiero** generar versiones en otros formatos a partir de un video master
**Para que** no tenga que crear manualmente cada adaptacion

**Criterios de aceptacion:**
- Selecciono un video master (ej: 16:9) y elijo formatos destino (9:16, 1:1)
- La IA genera propuestas de recorte/reposicion
- Puedo previsualizar y ajustar manualmente si necesario
- Los overlays y textos se reposicionan inteligentemente

### US-702: Subtitulos automaticos
**Como** Producer
**Quiero** generar subtitulos a partir del audio del video
**Para que** no tenga que transcribir y sincronizar manualmente

**Criterios de aceptacion:**
- El sistema transcribe el audio automaticamente
- Los subtitulos se sincronizan con el timeline
- Puedo editar texto y ajustar timing
- Se aplica el estilo de subtitulos de la marca
- Soporta espanol e ingles

---

*Documento vivo — se agregan user stories conforme se definen nuevas funcionalidades*
