# Catálogo de construcción — Fases B–F (lo que falta detallar)

> **Qué es esto:** el índice maestro de TODO lo que el producto todavía NO tiene
> convertido en plan detallado. Hoy existe **un solo plan al detalle: la Fase A
> (Golden Path)**. El resto (B–F) es visión documentada en `PRODUCT.md §4` pero sin
> spec. Este catálogo toma cada fase pendiente y la baja a **"qué entrega · qué módulos
> toca · qué es front puro · qué depende de backend · qué la bloquea"**, para que cada
> una pueda entrar a SDD cuando le toque.
>
> **Qué NO es:** no es roadmap nuevo ni SSOT. **`PRODUCT.md` MANDA.** Si algo acá
> contradice a PRODUCT.md, gana PRODUCT.md. Esto es la capa "cómo construimos",
> derivada del "qué/cuándo" de §4.
>
> **Fuentes:** [`PRODUCT.md`](../../../op-video-engine-docs/PRODUCT.md) §0.5 (4 capas),
> §3 (7 módulos), §4 (Fases A–F), §5 (los 5 CU de retención), §7 (supuestos), §8
> (decisiones). Coordinación cross-repo: [`../contracts/README.md`](../contracts/README.md).
> Visión SKIN/SKELETON: [`brand-theming-levels.md`](./brand-theming-levels.md).
>
> **Compartido con backend.** Una fase entra a SDD solo cuando le toca en el orden.
> **Fecha:** 2026-06-11.

---

## Cómo leer este catálogo

**Estado de detalle** (¿está listo para construir?):

| Marca | Significado |
| --- | --- |
| 📐 **Spec lista** | Tiene plan detallado SDD → se puede construir |
| 📋 **Sin spec** | Documentado en PRODUCT.md, falta bajarlo a plan detallado |
| 🚫 **Bloqueado** | No se detalla hasta resolver una decisión previa |

**Etiqueta de responsabilidad** (en cada tarea):

- 🎨 **FRONT puro** — se hace ya, consume backend que YA existe. Cero espera.
- 🔌 **FRONT + contrato** — el front lo construye, pero necesita que el backend sirva algo (va por `docs/contracts/`).
- 🗄️ **BACK** — lo construye el repo backend (otro brain). El front solo consume.

> **Regla de oro (PRODUCT.md §3.1):** ninguna fase puede romper el *seam* Template
> Studio ↔ Data Binding. Carolina nunca ve un lienzo libre; Mateo nunca ve un CSV.
> Si una tarea cruza eso, empezó el bolonqui.

---

## Dónde estamos parados (las 4 capas — §0.5)

```
CAPA 4 · DESTINO   ⏳ Creative Studio · Design System gen · Portal cliente · AE Bridge   → Fases C, D, E, F
CAPA 3 · ESCALA    ✅ Data Engine (batch) — construido, se reposiciona como upsell
CAPA 2 · PUERTA    🟡 Golden Path — ACÁ ESTAMOS (Fase A, casi)
CAPA 1 · CIMIENTO  ✅ Motor Remotion · Brands/tokens · Render-jobs · Projects
```

**Traducción:** la columna vertebral está construida de adentro (Cimiento) hacia el
borde de la Puerta. Las Fases B–F son cómo seguimos creciendo hacia afuera (el norte =
Capa 4), sin tirar nada de lo construido.

---

## Fase A — Golden Path ⭐ (el ancla — NO es parte de este catálogo, pero define el borde)

**Estado:** 📐 spec lista + ~95% construido. Es el ÚNICO plan al detalle hoy.
**Módulos:** 2, 3, 4. **Satisface:** CU-2 (paridad preview↔render).

Lo incluyo solo para marcar el límite: **todo lo de abajo arranca cuando la cola de la
Fase A esté cerrada.** Esa cola tiene dos baldes:

### A.1 — Cola FRONT puro (consume backend existente, se hace YA)

| Tarea | Etiqueta | Notas |
| --- | --- | --- |
| Selección de formatos (checkboxes 1:1 / 9:16 / 16:9) → mandar N jobs | 🎨 FRONT | Loop sobre `render-single` por formato |
| Vista de resultados (ver los N videos generados) | 🎨 FRONT | Galería de outputs por job |
| Descarga real (cablear al URL del output) | 🎨 FRONT | Conectar al `outputUrl` del job |
| Limpiar formulario tras render | 🎨 FRONT | Reset de RHF post-submit |
| Contraste de colores en templates | 🎨 FRONT | Token de contraste, no hardcode |
| Fix polling / label (bugs actuales) | 🎨 FRONT | Estado del job + etiqueta correcta |

### A.2 — Cola que necesita backend (ya está en contratos)

| Tarea | Etiqueta | Estado contrato |
| --- | --- | --- |
| `POST /render-single` con `compositionProps` template-agnostic | 🔌 FRONT + contrato | 🔴 [TODO P1](../contracts/POST-render-single.contract.md) |
| `GET /brands` devuelve `tokens` (colors/fonts/logo/radius) | 🔌 FRONT + contrato | 🟡 [TODO P2](../contracts/GET-brand-tokens.contract.md) |
| Segundo template **StayPromo** end-to-end | 🔌 FRONT + contrato | 🟡 front listo (registry), back debe servirlo |

> Cerrar A.1 + A.2 = Golden Path completo y vendible. **Recién ahí** se abre la Fase B.

---

## Fase B — Camino A: Exportador AE JSON (quick-win, sin bloqueos)

**Entrega (§4):** el Data Engine exporta el JSON en el formato que el script JSX de
After Effects de Lizeth ya consume → la libera del JSON manual.
**Módulos:** 3 (Data Engine) + 7 (AE Bridge, Camino A).
**Estado de detalle:** 📋 **sin spec.**
**Satisface:** quick-win de adopción interna; no toca el seam.

| Tarea | Etiqueta | Notas |
| --- | --- | --- |
| Serializar las variaciones (ya client-side) → JSON formato AE | 🎨 FRONT | El rules-engine ya corre en cliente (`generate-variations-client.ts`); el export puede ser front puro |
| Botón "Exportar AE JSON" + descarga del archivo | 🎨 FRONT | Acción en la UI del Data Engine |
| Mapear el **schema exacto** del JSX de Lizeth | 🎨 FRONT | Fuente: `op-video-engine-docs/Final_Scripts_Automation_4_DynamicImage 4.jsx` (1068 líneas, ya analizado) |
| (Opcional) persistir/servir el export desde backend | 🗄️ BACK | Solo si se quiere historial; no bloquea el quick-win |

> **Por qué es la primera fase pendiente:** sin bloqueos, casi todo front, y entrega
> valor real al equipo HOY. Es el "fruto bajo" del roadmap.

---

## Fase C — Creative Studio v1 ⭐ (el norte real, Capa 4)

**Entrega (§4):** editor DOM/React (Opción A) — registrar componentes → ensamblar en
superficie pan/zoom → edición inline determinista + AI opcional. Output estático
(`renderStill`) + video (`renderMedia`) desde los MISMOS componentes.
**Módulos:** 2 (Component Library) + 5 (Creative Studio, nuevo).
**Estado de detalle:** 📋 **sin spec** (es el de mayor riesgo de bolonqui — §3.1).
**Stack decidido (§8):** `craft.js` + `react-moveable` + Remotion dual-output.
**Satisface:** Supuesto C (template parametrizable sin "rebuild Canva"); persona Mateo.

| Tarea | Etiqueta | Notas |
| --- | --- | --- |
| Superficie pan/zoom + paleta de componentes desde el registry | 🎨 FRONT | Núcleo del editor, consume `components-registry` |
| Edición **inline estilo Canva** (click → `contentEditable` + handles) | 🎨 FRONT | Capa 4 SOLO; nunca se adelanta a la Puerta (§9) |
| Dual-output: el mismo componente en DOM y en Remotion idéntico | 🎨 FRONT | UNA librería compartida — la disciplina que evita drift |
| **Template Studio** (Mateo diseña + define slots editables) | 🎨 FRONT | El lado "diseñar" del seam |
| **Data Binding** acotado (Carolina llena solo los slots) | 🎨 FRONT | El lado "llenar" — comparte maquinaria del editor |
| Persistir composiciones / template-drafts (entidad nueva) | 🗄️ BACK | Modelo de composición + slots como contrato |
| Render de composiciones arbitrarias (no templates fijos) | 🔌 FRONT + contrato | Generaliza el render farm más allá de organisms hardcoded |
| Solidificar Component Library (Módulo 2 está ~70% scaffold) | 🎨 FRONT | **Pre-requisito**: sin atoms/molecules sólidos no hay qué ensamblar |

> **Riesgo #1:** este módulo mezcla 4 jobs de 4 usuarios en una pantalla. La disciplina
> que lo salva es **el schema del template como contrato** (§3.1). No empezar sin spec.

---

## Fase D — Design System generator (Capa 4)

**Entrega (§4):** evolucionar `brands` de editor de tokens a **generador**: selección UI
+ prompt auto-construido + chat + upload de un design system → contexto de marca
(tokens + comportamiento/personalidad que alimenta humanos Y AI).
**Módulos:** 1 (Design System).
**Estado de detalle:** 📋 **sin spec.**
**Base ya construida:** brand tokens editor + brand selector (✅ Cimiento).

| Tarea | Etiqueta | Notas |
| --- | --- | --- |
| Wizard de creación de marca (selección UI + builder de prompt) | 🎨 FRONT | Sobre el editor de tokens que ya existe |
| Upload de design system (archivo/figma/imágenes) | 🔌 FRONT + contrato | Front sube; back parsea |
| Chat para refinar la personalidad de marca | 🔌 FRONT + contrato | Integración LLM (decidir front-calls vs back-service) |
| Extraer tokens + comportamiento del upload | 🗄️ BACK | Servicio AI de extracción → `BrandConfig` enriquecido |
| Persistir "comportamiento/personalidad" de marca | 🗄️ BACK | Campos nuevos en la entidad brand |

> **Nota SKIN/SKELETON ([`brand-theming-levels.md`](./brand-theming-levels.md)):** esto
> es Nivel 1–2 (tokens + defaults estructurales por marca). NO es Nivel 3 (composición
> libre) — eso vive en Fase C. No mezclar.

---

## Fase E — Workflow & QC (Capa 4)

**Entrega (§4):** revisión interna + **portal cliente (token, sin cuenta)** + comentarios
timestamped + entrega + ZIP.
**Módulos:** 6 (Workflow & QC — hoy 0%).
**Estado de detalle:** 📋 **sin spec.**
**Satisface:** CU-4 (aprobación antes de publicar — *"para un SaaS de agencia, la
aprobación ES producto"*); personas QC Reviewer + Client.

| Tarea | Etiqueta | Notas |
| --- | --- | --- |
| UI de revisión + comentarios timestamped sobre el player (±1s) | 🎨 FRONT | Overlay sobre `@remotion/player` |
| Estados de revisión (draft → review → approved/rejected) | 🔌 FRONT + contrato | Front pinta; back es dueño de las transiciones |
| Portal cliente sin cuenta (acceso por token público) | 🔌 FRONT + contrato | Front: vista pública; back: auth-less token |
| Persistencia de comentarios + registro (timestamped) | 🗄️ BACK | Entidad `reviews` + comments |
| Sync en tiempo real (equipo ve cuando cliente aprueba) | 🗄️ BACK | Polling v1 → SSE/WebSocket después |
| Entrega final (link con expiración o ZIP) | 🗄️ BACK | Generación de ZIP + naming `{marca}_{producto}_{formato}_{fecha}` |

> **Es la fase con más backend del catálogo.** El front es delgado (UI de revisión);
> casi todo es estado server-side (comentarios, token auth, entrega).

---

## Fase F — AE Bridge: Camino B (🚫 BLOQUEADA)

**Entrega (§4):** tras resolver D1–D5 con Omnicom. Camino B = Remotion suple AE para
piezas de template/datos; AE queda para VFX high-end.
**Módulos:** 7 (AE Bridge).
**Estado de detalle:** 🚫 **bloqueado por D1–D5 (§8).** No se detalla todavía.

**Las 5 decisiones que la desbloquean (§8.6):**
- **D1** — ¿AE en el pipeline de render o solo en creación?
- **D2** — ¿Camino A, B, o ambos?
- **D3** — ¿hay templates AE existentes que reusar?
- **D4** — ¿trigger `aerender` desde la plataforma?
- **D5** — ¿qué efectos AE son exportables con transparencia?

| Tarea (preliminar, NO construir) | Etiqueta | Notas |
| --- | --- | --- |
| Integrar asset AE con alfa (.mov ProRes 4444 / .webm) como componente | 🗄️ BACK | Render pipeline lo combina con atoms Remotion |
| Preview de composición híbrida (AE + Remotion) | 🎨 FRONT | Solo después de D1–D5 |

> **No tocar hasta que D1–D5 estén resueltas con Omnicom.** Detallar esto antes sería
> planificar sobre arena.

---

## Track separado (cuarentenado — NO construir)

**AI Editing Assistant** — asistente de edición con IA sobre footage crudo.
Documentado en [`VISION-EDITING-ASSISTANT.md`](../../../op-video-engine-docs/VISION-EDITING-ASSISTANT.md).
Está **fuera del scope actual** a propósito (§3, §10). Existe en la visión, track propio
si/cuando se persiga. **No entra a este catálogo.**

---

## Resumen ejecutivo — el orden y por qué

| Fase | Capa | Detalle | Carga | Bloqueo | Por qué este orden |
| --- | --- | --- | --- | --- | --- |
| **A** (cola) | 2 · Puerta | 📐 lista | 🎨 mayormente front | — | Cerrar lo vendible primero |
| **B** AE JSON | 3 · Escala | 📋 sin spec | 🎨 casi todo front | ninguno | Quick-win sin bloqueos, valor HOY |
| **C** Creative Studio | 4 · Destino | 📋 sin spec | mixto, front-pesado | Módulo 2 sólido | El norte real, mayor riesgo de bolonqui |
| **D** DS generator | 4 · Destino | 📋 sin spec | mixto | — | Escala la creación de marcas |
| **E** Workflow & QC | 4 · Destino | 📋 sin spec | 🗄️ back-pesado | — | La aprobación ES producto (lock-in) |
| **F** AE Bridge | 4 · Destino | 🚫 bloqueado | 🗄️ back-pesado | **D1–D5** | No detallar hasta resolver con Omnicom |

**Recomendación de secuencia:** `A (cerrar cola) → B (quick-win) → C (el norte)`.
D y E son Capa 4 paralelizables según necesidad de negocio; F espera a Omnicom.

**Próximo paso natural:** elegir UNA fase y bajarla a spec con SDD
(`/sdd-new <fase>`). La candidata obvia post-Golden-Path es **Fase B** (sin bloqueos,
front puro, valor inmediato).
