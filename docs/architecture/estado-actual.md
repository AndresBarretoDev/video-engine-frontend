# Estado actual — ¿dónde estamos parados? (verificado por código)

> **Qué es esto:** la fotografía del estado REAL del producto, verificada contra el
> **código** (no contra los docs de roadmap, que están desactualizados). Responde la
> pregunta "¿en qué fase estamos?" sin adivinar.
>
> **Cómo se hizo:** auditoría con 2 agentes de exploración leyendo los dominios y el
> flujo authoring→render directamente. **Fecha:** 2026-06-11.
>
> **Relación con la SSOT:** `PRODUCT.md` manda en el QUÉ/CUÁNDO. Este doc reporta el
> CUÁNTO-está-hecho y corrige donde el doc quedó viejo. Catálogo de lo que falta:
> [`roadmap-catalog-fases-b-f.md`](./roadmap-catalog-fases-b-f.md).

---

## En una frase

Estamos en la **Capa 2 — la Puerta de entrada (Golden Path / Fase A)**, **~80% cerrada**.
Es la PRIMERA fase, casi terminada. A un par de tareas de lo vendible.

```
CAPA 4 · DESTINO    Creative Studio 0% · Workflow/QC 5% · AE Bridge bloqueado
CAPA 3 · ESCALA     Data Engine 60% (UI completa, backend mock)
CAPA 2 · PUERTA  →  Golden Path ~80%  ← ACÁ ESTAMOS, cerrando
CAPA 1 · CIMIENTO   Motor 85% · Brands 80% · Render 75% — sólido
```

---

## Estado real por módulo (verificado en código)

| Módulo | Real | Evidencia | Doc dice |
| --- | --- | --- | --- |
| 1 · Brands / Design System | **80%** ✅ | tokens editor + `brand-selector` + 7 hooks API reales, sin mocks | ~90% (ok) |
| 2 · Component Library (Remotion) | **85%** ✅ | 8 atoms, 5 molecules, **6 organisms reales** (LoopingProductPromo 445L, StayPromo 802L, CTVTemplate, Banner/Promo/Story), format-aware 1:1/9:16/16:9 | 🔴 "scaffold ~70%" → **desactualizado, está mejor** |
| 3 · Data Engine | **60%** | 22 componentes UI, rules-engine client-side (11 operators), backend MOCK | 🟡 ~90% UI |
| 4 · Render Farm | **75%** ✅ | dashboard + polling 3s + hooks reales, backend integrado | 🟡 "backend MOCK" → **ya integrado** |
| 5 · Creative Studio | **0%** | no empezado | ❌ ok |
| 6 · Workflow/QC (`reviews`) | **5%** | solo `types.ts` (136L), 0 componentes, 0 hooks | 🔴 0% (ok) |
| 7 · AE Bridge | bloqueado | D1–D5 con Omnicom sin resolver | 🚫 ok |

> ⚠️ **Hallazgo:** PRODUCT.md §3 subestima el Cimiento (M2 y M4). El motor Remotion
> NO es scaffold — tiene 6 organisms productivos. Tenemos más base de la que el doc dice.

---

## Golden Path — qué falta para CERRAR la fase actual

### 🎨 FRONT puro — se ataca YA (no depende de backend)

| # | Tarea | Estado hoy | Dónde |
| --- | --- | --- | --- |
| 1 | **Vista de resultados** (ver los N videos generados) | ~50% (solo polling) | `render-count-indicator` |
| 2 | **Descarga real** (cablear al `outputUrl`) | ❌ mock `href="#download-${jobId}"` | `render-count-indicator.tsx:64` (TODO task 5.x) |
| 3 | **Selección de N formatos → N jobs** | parcial | FormatTabs existe; falta mandar batch |
| 4 | **Limpiar formulario** tras render | falta | RHF reset post-submit |
| 5 | **Contraste de colores** en templates | falta | token, no hardcode |
| 6 | **Fix polling / label** (bugs actuales) | falta | estado del job |

### 🔌 FRONT + contrato — front listo, espera backend (otro repo)

| Tarea | Estado contrato |
| --- | --- |
| `POST /render-single` template-agnostic `compositionProps` | 🔴 [P1](../contracts/POST-render-single.contract.md) |
| `GET /brands` devuelve `tokens` | 🟡 [P2](../contracts/GET-brand-tokens.contract.md) |
| Servir segundo template **StayPromo** | 🟡 front listo (registry), back debe servirlo |
| `DEMO_PROJECT_ID` hardcoded en showroom (`send-to-render-button.tsx:31`) | ya resuelto en ruta project-first |

---

## Recomendación

Atacar la **cola front-pura (1–6)** — cierra la experiencia de la Puerta sin esperar al
backend. Máximo impacto: **vista de resultados + descarga real** (#1 y #2), porque es el
momento mágico *"bajás el video"* que hoy está cortado.

**Próximo paso:** elegir entre arrancar la implementación (front-puro #1+#2) o bajar la
cola a spec SDD primero.
