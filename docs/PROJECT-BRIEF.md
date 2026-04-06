# OP Video Engine — Project Brief

**Organizacion:** Omnicom Production (Colombia)
**Fecha de inicio:** Febrero 2026
**Estado:** Fase de definicion y documentacion

---

## Vision del Producto

OP Video Engine es una plataforma interna de Omnicom Production para la generacion automatizada de videos personalizados a escala. El objetivo es unificar dos flujos de trabajo que hoy operan de forma desconectada — produccion audiovisual y automatizacion/adaptacion de marca — en un solo pipeline digital, basado en codigo, renderizado en la nube, e impulsado por datos.

La referencia aspiracional es el modelo Spotify Wrapped: personalizacion masiva generada automaticamente a partir de datos, deployable globalmente.

A mediano plazo, el producto busca posicionarse como servicio vendible a clientes de Omnicom y eventualmente al mercado externo.

---

## Problema que Resuelve

### Flujo actual (manual y desconectado)

1. **Equipo Audiovisual** genera contenido base (clips, videos). Actualmente usa herramientas como Runway para generar/transformar video con IA (cambiar escenarios, clima, vestuario, voiceovers).
2. Los archivos se transfieren via **SharePoint o WeTransfer** al equipo de Automation.
3. **Equipo Automation (Smart Studio)** adapta los videos a la marca del cliente usando:
   - **Adobe After Effects** como herramienta principal
   - **AtomX** (extension de AE) como libreria de componentes modulares (atomos visuales)
   - Un **script custom de AE** que conecta un Excel con el proyecto
   - **Excel/Google Sheets** como fuente de datos para generar multiples versiones
4. El equipo renderiza en las maquinas locales (AE render queue).
5. Los videos finalizados se envian al cliente via **correo/WeTransfer** para aprobacion.
6. El cliente responde con feedback via correo. Se itera manualmente.

### Dolores principales

- **Dependencia de After Effects:** Software de escritorio, costoso por licencia, no escala en la nube, cada render ocupa la maquina del disenador.
- **Pipeline desconectado:** Dos equipos trabajando en silos con transferencia manual de archivos.
- **Proceso de QC fragil:** Aprobaciones via correo, sin tracking centralizado, sin comentarios sobre el video.
- **Escala limitada:** Generar 500 variaciones bloquea maquinas por horas.
- **Herramientas externas costosas:** Templater (~$1.5M COP/mes por usuario), Plainly, CreateTotally — todas evaluadas, ninguna cubre el caso completo.

---

## Solucion Propuesta

Construir una plataforma web propia que:

1. **Reemplace AtomX** con una libreria de componentes animados en codigo (React + Remotion), reutilizables por marca.
2. **Reemplace el Excel → AE script** con una interfaz web data-driven: subir CSV/Sheets, mapear columnas a parametros del video, previsualizar variaciones.
3. **Renderice en la nube** en paralelo, sin bloquear maquinas locales.
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

Existe un prototipo MVP desarrollado para Lidl Belgium que sirve como punto de partida:

- **Stack:** React 18 + TypeScript + Vite + Remotion 4 + Tailwind + shadcn/ui + Zustand
- **Capacidades actuales:** Formulario de producto, 7 templates Remotion (3 categorias), preview en tiempo real, sistema de jobs, soporte multi-formato (1:1, 9:16, 16:9)
- **Madurez:** ~40-50%. Frontend solido, pero rendering simulado, sin backend, sin base de datos, sin almacenamiento en la nube, sin persistencia.
- **Valor:** Valida el concepto y la viabilidad tecnica con Remotion.

---

## Equipo Disponible

- Equipo digital de Omnicom Production — un grupo reducido trabajara directamente en este proyecto
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
| **Templater** | Conexion datos→AE, Google Sheets, bots IA | ~$4.3M COP/mes/usuario. Sigue atado a AE |
| **Plainly** | Cloud rendering, bindings dinamicos, multi-formato | Sin gestion de assets, inestable, errores de texto |
| **AIVE** | Analisis de video con IA, subtitulos, multi-formato | Sin integraciones, sin bulk, sin canal alfa |
| **CreateTotally** | Multi-archivo (PSD, AE, Figma, GWD), QC con comparacion | Bulk no funciona (beta), 10min/render, sin edicion en plataforma |
| **Celtra** | Cloud nativo, multi-usuario, presets | Solo animaciones basicas (escala, opacidad), sin expresiones, sin VFX |

**Conclusion:** Ninguna herramienta cubre el caso de uso completo. Todas tienen al menos una limitacion critica (costo, dependencia de AE, falta de bulk, o animaciones limitadas). Construir algo propio con Remotion nos da control total y elimina costos de licencia.

---

## Pilares Funcionales (Vision Completa — 7 Pilares)

### 1. Agnostico (Data Input)
Integracion nativa con Google Sheets, CSV, feeds JSON y APIs. Mapeo automatico de columnas ("auto-match"). No depender de una sola fuente de datos.

### 2. Cambios Dinamicos (Logic & Variabilization)
Personalizacion total de capas (texto, video, audio, color). Logica condicional (If/Then) para prender o apagar elementos segun la audiencia. Pasar de "rellenar plantillas" a "crear estructuras inteligentes."

### 3. Adaptabilidad Inteligente (AI & Resizing)
IA para analisis de escenas, generacion de subtitulos, y resizing automatico (un master → multiples formatos). Reducir el tiempo manual en versiones mecanicas (9x16, 1x1, etc.).

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

| Fase | Nombre | Descripcion | Pilares que cubre |
|---|---|---|---|
| 0 | Fundamentos | Documentacion, design system en codigo, anatomia del video | Base |
| 1 | Motor de Video | Libreria de atomos/moleculas/organismos en Remotion | 2 |
| 2 | Application Shell | Plataforma web: dashboard, navegacion, CRUD marcas, catalogo, assets | Base web |
| 3 | Data Engine | Conexion de datos (CSV/Sheets/API) → props de componentes | 1 |
| 4 | Rendering Pipeline | Rendering real en la nube, batch processing | 5 |
| 5 | Workflow & QC | Portal de preview, aprobacion, comentarios, entrega | 4 |
| 6 | Puente AE | Importar assets de AE como componentes, rendering hibrido | 5 |
| 7 | IA & Adaptacion | Resizing automatico, subtitulos, anti-fatigue, data-based | 3, 6, 7 |

---

*Documento generado a partir de sesion de brainstorming — Marzo 2026*
