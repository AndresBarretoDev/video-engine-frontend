# OP Video Engine — Project Brief

**Organizacion:** Omnicom Production (Colombia)
**Fecha de inicio:** Febrero 2026
**Estado:** Fase 0 completada (~90%), Fase 1 iniciada (scaffolding de componentes Remotion)

---

## Vision del Producto

OP Video Engine es una plataforma interna de Omnicom Production orientada a convertir la produccion de video en una capacidad estrategica, escalable y con forma de producto tecnologico. El territorio del video dinamico, automatizado y personalizado representa una oportunidad de liderazgo real: mientras que banners y piezas graficas son facilmente replicables por multiples competidores, el video a escala todavia tiene espacio para ser liderado de forma contundente.

La referencia aspiracional es el modelo Spotify Wrapped: personalizacion masiva generada automaticamente a partir de datos, deployable globalmente. El punto de partida son las cortinillas y la automatizacion existente, pero la vision es mas amplia: cualquier formato, cualquier plataforma (YouTube, Instagram, TikTok, CTV), cualquier escala.

A mediano plazo, el producto busca posicionarse como servicio vendible a clientes de Omnicom y eventualmente al mercado externo.

---

## Oportunidad Estrategica y Estado Actual

### La capacidad que ya existe

El equipo de Automation (Smart Studio) ya tiene una capacidad real de generacion de video a escala. El flujo actual combina:

- **Adobe After Effects** como herramienta de creacion y composicion
- **AtomX** (extension de AE) como libreria de componentes visuales modulares (atomos: cortinillas, overlays, cierres, lower thirds)
- **Un script custom de AE** (`Automation Script`) que conecta un archivo JSON con las capas del proyecto — ver seccion "Flujo tecnico actual del script AE"
- **Datos del cliente** (Excel o Google Sheets convertido a JSON) como fuente de variaciones

Este flujo ya permite generar decenas de variaciones de video a partir de un mismo proyecto AE, simplemente cambiando los datos. El equipo de produccion genera el video base; Automation agrega intros, mensajes, cierres y cortinillas para construir las salidas finales.

### La persona central de esta capacidad

Hoy, **una sola persona** concentra el conocimiento y la ejecucion de este proceso: configura el JSON con los datos del cliente (copies, precios, imagenes, colores), nombra las composiciones y capas segun la convencion del script, ejecuta la automatizacion y lanza el render. Esto funciona bien, pero crea una dependencia operativa sobre un unico perfil.

### La oportunidad que impulsa la plataforma

El proyecto no nace de un proceso roto, sino de una pregunta estrategica: ¿como convertimos esta capacidad artesanal en un producto escalable?

La plataforma busca tres cosas concretas:

1. **Democratizar la ejecucion**: que el proceso que hoy solo puede hacer una persona lo pueda ejecutar cualquier miembro del equipo desde una interfaz web amigable, sin depender de conocer AE ni el script.
2. **Liberar capacidad creativa**: que la persona que hoy dedica tiempo a configurar datos y lanzar renders pueda enfocarse en crear mejores animaciones y componentes en AE.
3. **Escalar sin limite de maquinas**: pasar de renderizar en local (bloqueando equipos) a renderizar en la nube en paralelo, habilitando cientos de variaciones simultaneas para multiples plataformas.

### Por que no es reemplazar After Effects

AE no es el problema — es una herramienta de creacion profesional que el equipo domina. La plataforma no busca eliminarlo sino integrarlo: las animaciones que se crean en AE se convierten en componentes reutilizables dentro del motor. AE sigue siendo la herramienta de creacion; la plataforma es la capa de orquestacion, datos y escala.

---

## Flujo Tecnico Actual del Script AE

> Esta seccion documenta el comportamiento real del script `Automation Script` (JSX) que opera actualmente en el equipo. Es la referencia tecnica de lo que la plataforma debe replicar, superar e integrar.

### Que hace el script

El script es un panel flotante dentro de After Effects que actua como puente entre un archivo JSON (los datos del cliente) y las capas de las composiciones AE (los templates visuales). Fue desarrollado por Lizeth Gomez con asistencia de IA.

Permite cuatro tipos de vinculacion de datos:

**1. Texto dinamico**
Aplica una expresion AE a capas de texto para que su contenido se jale automaticamente del JSON segun el nombre de la composicion y el nombre de la capa.

**2. Opacidad condicional**
Controla que elementos se muestran u ocultan en cada variacion. Si el valor de un campo del JSON coincide con el nombre de una capa, esa capa aparece (opacidad 100); si no, se oculta (opacidad 0). Util para mostrar distintos badges, iconos o elementos segun el tipo de producto o campana.

**3. Color dinamico**
Lee un valor de color desde el JSON (en formato hexadecimal `#RRGGBB` o array RGB `[R, G, B]`) y lo aplica como expresion de color a capas seleccionadas via efecto Fill. Permite variaciones de color de marca o temporada sin editar las composiciones manualmente.

**4. Imagen dinamica**
Las capas de imagen se "marcan" con un comentario especial en AE (`AE_JSON_IMG_KEY:nombre_campo`). El script escanea todas las capas de la composicion buscando esa etiqueta y reemplaza la fuente de footage con el archivo de imagen que indique el JSON para ese campo. Esto permite que cada variacion tenga un packshot o imagen diferente automaticamente.

Adicionalmente, el script puede agregar todas las composiciones al render queue de AE de una vez, nombrando los archivos de salida segun un campo del JSON.

### Convencion de datos que usa el script

**Estructura del JSON:**
```
{
  "0": { "nombre_producto": "Leche Alpina 1L", "precio": "$3.500", "imagen": "leche_alpina.png", "color": "#E30613" },
  "1": { "nombre_producto": "Yogurt Alpina", "precio": "$2.800", "imagen": "yogurt_alpina.png", "color": "#0057A8" }
}
```
O en formato array:
```
[
  { "Comp": 0, "nombre_producto": "Leche Alpina 1L", "precio": "$3.500", "imagen": "leche_alpina.png" },
  { "Comp": 1, "nombre_producto": "Yogurt Alpina", "precio": "$2.800", "imagen": "yogurt_alpina.png" }
]
```

**Convencion de nombres:**
- Cada composicion de AE se nombra con el indice correspondiente a su fila de datos ("0", "1", "2"...)
- Cada capa de texto se nombra exactamente igual a la clave JSON que le corresponde (ej: la capa que muestra el precio se llama `precio`)
- Las capas de imagen se marcan con el comentario `AE_JSON_IMG_KEY:nombre_campo` para vincularlas dinamicamente

**Imagenes de assets:**
Los archivos de imagen referenciados en el JSON deben estar importados previamente en el proyecto AE (panel Project). El script busca el footage item por nombre exacto y reemplaza la fuente de la capa marcada.

### Segundo modulo: importador de Illustrator

El script incluye una segunda seccion que, via BridgeTalk (comunicacion inter-app de Adobe), permite importar formas y textos seleccionados en Illustrator directamente a AE como capas nativas (shape layers y text layers), preservando colores, gradientes y trazos. Esta capacidad no hace parte del flujo de automatizacion de datos, sino del flujo de creacion de componentes visuales.

---

## Solucion Propuesta

Construir una plataforma web propia que:

1. **Democratice la configuracion de datos**: cualquier persona del equipo puede subir el CSV/Sheets del cliente, mapear columnas a parametros del video, y generar el JSON que el flujo necesita — sin tocar AE ni el script.
2. **Integre AE como herramienta de creacion, no de produccion masiva**: las animaciones que Lizeth crea en AE se convierten en componentes reutilizables en la plataforma. (Ver seccion "Caminos de integracion AE".)
3. **Renderice en la nube** en paralelo, sin bloquear maquinas locales, para multiples plataformas y formatos simultaneamente.
4. **Unifique el pipeline de entrega y QC**: desde la generacion de variaciones hasta la aprobacion del cliente, en un solo sistema.

> **Nota sobre Remotion:** Remotion es el framework seleccionado como motor de composicion y renderizado de la plataforma. No es el producto en si mismo — es el runtime que permite componer videos a partir de componentes React de forma programatica y renderizarlos en la nube. El valor real esta en la capa de orquestacion: componentes, datos, logica, preview y variaciones.

---

## Caminos de Integracion con After Effects

> **Estado:** Decision pendiente. Ambos caminos son tecnicamente viables. El equipo debe definir cual adoptar antes de implementar la Fase 5 (Puente AE).

### Camino A — La plataforma alimenta a AE (integracion de datos)

La plataforma genera automaticamente el JSON en el mismo formato que el script de AE ya espera. Lizeth configura las composiciones en AE una sola vez con la convencion de nombres correcta. Cuando cualquier persona del equipo sube el CSV del cliente a la plataforma, el sistema genera el JSON, lo entrega listo, y el script lo consume sin cambios.

**Lo que cambia:** la preparacion manual del JSON desaparece. El proceso de configurar el Excel/JSON y ejecutar el script puede hacerlo cualquier persona desde la interfaz web.

**Lo que no cambia:** AE sigue renderizando localmente. Los renders siguen ocupando la maquina mientras corren.

**Cuando tiene sentido:** etapa temprana, para validar la plataforma con flujos reales sin redisenar la arquitectura de AE. Menor friccion de adopcion para el equipo.

**Limitacion principal:** no escala a cientos de variaciones simultaneas. El render sigue siendo el cuello de botella.

### Camino B — AE como fabrica de componentes, Remotion como motor de escala

Lizeth crea las animaciones en AE (cortinillas, transiciones, motion graphics con toda su calidad y efectos). Las exporta como video con canal alfa (ProRes 4444 o WebM con transparencia). Esos outputs se registran como componentes en la plataforma. Remotion los compone con los datos del cliente y genera todas las variaciones en la nube.

**Lo que cambia:** AE ya no esta en el pipeline de produccion masiva. Solo participa en la creacion de los componentes base. El render de todas las variaciones ocurre en la nube.

**Lo que no cambia:** Lizeth sigue trabajando en AE para crear animaciones. Su rol creativo se mantiene intacto; desaparece la carga operativa de configurar datos y lanzar renders.

**Cuando tiene sentido:** cuando el volumen de produccion justifica la escala en la nube y cuando los componentes base ya estan maduros y estables.

**Limitacion principal:** requiere que los efectos de AE sean "exportables" con transparencia. Efectos muy complejos de compositing o expresiones dinamicas de AE no se pueden replicar directamente.

### Decisiones pendientes

Los siguientes puntos deben resolverse antes de disenar la Fase 5:

- **¿AE se queda en el pipeline de render o solo en el de creacion?** Si se queda en render, se necesita un servidor con AE instalado o que el render sea siempre local. Si solo crea assets, el pipeline de render lo maneja Remotion en la nube.
- **¿Como se manejan los templates de AE existentes?** ¿Se migran a la convencion del script? ¿O se documentan las convenciones para que los nuevos templates las sigan?
- **¿Que tan automatizado puede ser el trigger de AE?** AE tiene modo de render por linea de comandos (`aerender`). Tecnicamente se puede llamar desde un servidor, pero requiere licencia de AE instalada en ese servidor.
- **¿Ambos caminos pueden coexistir?** Es posible arrancar con el Camino A para flujos urgentes mientras el Camino B madura. Esta estrategia hibrida debe validarse con el equipo.
4. **Unifique el pipeline** desde la subida de assets hasta la entrega al cliente.
5. **Integre QC y aprobacion** directamente en la plataforma.
6. **Mantenga AE como herramienta complementaria** para efectos VFX complejos, no como dependencia central.

---

## Herramienta Central: Remotion

**Remotion** es un framework que permite crear videos programaticamente usando React. Fue seleccionado porque:

- Los componentes React son el equivalente directo de los "atomos" de AtomX, pero en codigo.
- Es data-driven por naturaleza: cada prop de React puede venir de un spreadsheet o API.
- Soporta rendering en la nube (Lambda, Docker, custom workers).
- Es open source — sin costos de licencia por usuario.
- Permite previews en tiempo real en el navegador.
- El equipo ya tiene un prototipo funcional (Lidl Belgium / lidl-video-forge).

### Limitaciones conocidas de Remotion

- No reemplaza AE para compositing cinematografico o VFX avanzado.
- Las animaciones se programan en codigo (requiere developers, no solo disenadores).
- El ecosistema de efectos es mas limitado que AE.

**Estrategia:** Remotion para el 80-90% del trabajo (cortinillas, motion graphics parametrizables, videos data-driven). AE para el 10-20% que requiera efectos especializados.

---

## Prototipo Existente: Lidl Video Forge (Belgica)

Existe un prototipo MVP desarrollado para Lidl Belgium que sirvio como punto de partida y referencia:

- **Stack:** React 18 + TypeScript + Vite + Remotion 4 + Tailwind + shadcn/ui + Zustand
- **Capacidades:** Formulario de producto, 7 templates Remotion (3 categorias), preview en tiempo real, sistema de jobs, soporte multi-formato (1:1, 9:16, 16:9)
- **Madurez:** ~40-50%. Frontend solido, pero rendering simulado, sin backend, sin base de datos, sin almacenamiento en la nube, sin persistencia.
- **Valor:** Valido el concepto y la viabilidad tecnica con Remotion.
- **Estado actual:** Archivado como referencia historica. OP Video Engine se construye desde cero, no es un fork.

---

## Estado Actual del Proyecto (Abril 2026)

### Repositorios
- **op-video-engine-frontend** — Next.js 15 + React 19 + Remotion 4 + Tailwind v4
- **op-video-engine-backend** — NestJS 11 + Prisma 7 + PostgreSQL

### Lo que esta construido

**Backend (6 modulos funcionales):**
- Auth con JWT + refresh token rotation + httpOnly cookies
- Users con CRUD, invitaciones, gestion de roles, safeguards de admin
- Brands con CRUD, slugs auto-generados, archivado, tokens JSON por marca
- Projects con CRUD, maquina de estados (DRAFT->IN_PROGRESS->REVIEW->APPROVED), visibilidad por rol
- Dashboard con metricas agregadas adaptadas por rol
- Uploads para imagenes (JPEG/PNG/WebP/SVG/GIF, 5MB max)
- Seed data: 5 usuarios (uno por rol), 3 marcas con tokens, 5 proyectos
- OpenSpec con behavioral specs en formato Given/When/Then para todos los modulos

**Frontend (9 dominios scaffoldeados):**
- Auth, Brands, Projects, Data Engine, Assets, Components Registry, Dashboard, Users, Render Jobs/Reviews
- Cada dominio con: types, schemas Zod, hooks React Query, stores Zustand, components, text-maps
- Design system Vibe Coding: 7 JSONs -> CSS variables -> Tailwind v4
- API client con interceptors, mock mode, error handling
- Middleware de rutas, role guards, providers (QueryClient + Auth + Toaster)

**Componentes Remotion (scaffolded):**
- 7 atomos: TextBlock, LogoReveal, ShapeElement, PricePatch, VideoClip, AudioTrack, SubtitleTrack
- 5 moleculas: CortinillaEntrada, CortinillaCierre, ProductOverlay, PromoBar, LowerThird
- 4 organismos/templates: PromoVideo, Story, CTV, BannerVideo (composiciones existentes)

### Metodologia
- **SDD (Specification-Driven Development)** — spec antes de codigo
- **7 agentes Claude Code** definidos (business-analyst, arquitecto, domain-architect, ui-designer, frontend-nextjs, backend, code-reviewer)
- **Remotion best practices** documentadas como skills

---

## Equipo Disponible

- 20 personas en el equipo digital
- Enfoque en desarrollo asistido por IA (vibe coding)
- Perfiles mixtos: disenadores, developers, project managers

---

## Metricas de Exito

- Reduccion del tiempo de produccion de variaciones de video en >70%
- Eliminacion de transferencias manuales de archivos (WeTransfer/SharePoint) entre equipos
- Capacidad de renderizar 100+ variaciones en paralelo sin bloquear maquinas locales
- Ciclo de aprobacion del cliente reducido de dias a horas
- Al menos 3 clientes internos usando la plataforma en los primeros 6 meses

---

## Analisis Competitivo (Resumen)

| Herramienta | Lo que hace bien | Por que no nos sirve |
|---|---|---|
| **Templater** | Conexion datos->AE, Google Sheets, bots IA | ~$4.3M COP/mes/usuario. Sigue atado a AE |
| **Plainly** | Cloud rendering, bindings dinamicos, multi-formato | Sin gestion de assets, inestable, errores de texto |
| **AIVE** | Analisis de video con IA, subtitulos, multi-formato | Sin integraciones, sin bulk, sin canal alfa |
| **CreateTotally** | Multi-archivo (PSD, AE, Figma, GWD), QC con comparacion | Bulk no funciona (beta), 10min/render, sin edicion en plataforma |
| **Celtra** | Cloud nativo, multi-usuario, presets | Solo animaciones basicas (escala, opacidad), sin expresiones, sin VFX |

**Conclusion:** Ninguna herramienta cubre el caso de uso completo. Construir algo propio con Remotion da control total y elimina costos de licencia.

---

## Pilares Funcionales (Vision Completa — 7 Pilares)

### 1. Agnostico (Data Input)
Integracion nativa con Google Sheets, CSV, feeds JSON y APIs. Mapeo automatico de columnas ("auto-match"). No depender de una sola fuente de datos.

### 2. Cambios Dinamicos (Logic & Variabilization)
Personalizacion total de capas (texto, video, audio, color). Logica condicional (If/Then) para prender o apagar elementos segun la audiencia. Pasar de "rellenar plantillas" a "crear estructuras inteligentes."

### 3. Adaptabilidad Inteligente (AI & Resizing)
IA para analisis de escenas, generacion de subtitulos, y resizing automatico (un master -> multiples formatos). Reducir el tiempo manual en versiones mecanicas (9x16, 1x1, etc.).

### 4. Ecosistema de Workflow & QC
Interfaz centralizada para previsualizacion, filtrado de variantes, y gestion de aprobaciones del cliente sobre el video. Soporte multi-formato (AE, Figma, GWD). Eliminar la friccion de correos y WeTransfer.

### 5. Renderizado Hibrido (Rendering Power)
Procesamiento masivo en la nube (Cloud Rendering) y bots via API para generar videos on-demand. Escalar de 10 a 10,000 videos sin bloquear las maquinas de los disenadores.

### 6. Video Data Based
Integracion automatizada de reportes de performance (CTR, VTR, Attention Maps) procesada por agentes de IA para dictar la jerarquia visual del video. Pasar de la "personalizacion" a la "prediccion creativa."

### 7. Anti-Fatigue (Dynamic Video Refresh)
Generacion de variaciones estructurales "invisibles" (micro-cambios en timing, encuadre o composicion) disenadas para burlar los filtros de repeticion de plataformas como Meta y TikTok. Escalar la pauta sin saturar la frecuencia.

---

## Roadmap de Fases

| Fase | Nombre | Descripcion | Pilares | Estado |
|---|---|---|---|---|
| 0 | Fundamentos | Documentacion, design system en codigo, anatomia del video | Base | ~90% completada |
| 1 | Motor de Componentes | Libreria de atomos/moleculas/organismos en Remotion | 2 | Scaffolding hecho, implementacion pendiente |
| 2 | Application Shell + Data Engine | UI funcional + conexion datos (CSV/Sheets/API) -> props | 1 | Scaffolded en frontend, sin backend |
| 3 | Rendering Pipeline | Rendering real en la nube, batch processing | 5 | No iniciada |
| 4 | Workflow & QC | Portal de preview, aprobacion, comentarios, entrega | 4 | No iniciada |
| 5 | Puente AE | Importar assets de AE como componentes, rendering hibrido | 5 | No iniciada |
| 6 | IA & Adaptacion | Resizing automatico, subtitulos, anti-fatigue, data-based | 3, 6, 7 | No iniciada |

---

*Documento actualizado — Abril 2026*
