# Proposal — Golden Path: la puerta de entrada simple (Capa 2)

**Created**: 2026-06-02 · **Re-scoped**: 2026-06-09 (alineado a PRODUCT.md §0.5) · **Owner**: Andrés Barreto

## Intent

Entregar UN flujo completo, demostrable y vendible que sea **la magia simple del producto**: un producto → formulario mínimo → **preview viva** → 3 formatos auto-adaptados → render **real** local (MP4). Es la **Capa 2** (puerta de entrada) de §0.5: lo que se entiende en 30 segundos. Hoy el repo se fue a la complejidad (batch/CSV) y se salteó esta puerta — no existe como flujo.

## Scope

### In Scope
- `LoopingProductPromo` (1 organism real) + auto-layout 3 formatos (16:9 / 9:16 / 1:1)
- BrandConfig auto-aplicado (marca Omnicom)
- **Solo producto único**: formulario manual (RHF+Zod) → preview `@remotion/player` (<400ms)
- Selección de formato con auto-layout instantáneo
- Render **real** local (Remotion CLI) → MP4 H.264, detrás de ports (mock↔local, testeable) — **cero AWS**
- Descarga de los 3 MP4

### Out of Scope (diferido — explícito, no por olvido)
- **Batch / CSV / data-engine → Capa 3 (cambio aparte, upsell).** El código NO se toca ni se borra; solo no entra acá.
- **Edición inline/Canva (acotada o plena) → Capa 4 (Creative Studio).** Capa 2 usa formulario + preview viva (PRODUCT.md §9 reconciliada).
- **CU-3 (imagen de producto mala: vertical/baja-res/fondo): diferido a Capa 3.** Acá solo se valida imagen *ausente*. El auto-encuadre/limpieza de fondo (el 80% que viene mal) es trabajo posterior.
- **CU-1 (re-render selectivo de 1 dato), CU-4 (aprobación/portal), CU-5 (duplicar campaña): diferidos** (Capa 3 / Módulo 6). Se nombran para no fingir que están cubiertos.
- Galería multi-template, AE JSON exporter, Google Sheets, reglas condicionales, Lambda + S3 (cloud).

## Capabilities

### New Capabilities
- `local-render`: abstracción `RenderProvider` + `StorageProvider` (ports) con adapters locales (Remotion CLI + filesystem); reemplaza el mock; gated por `RENDER_PROVIDER=mock|local`.

### Modified Capabilities
- `video-generation`: re-enfocada de "data-first/batch" a **authoring-first producto único** — pick template → form → preview viva → formatos → render. (El batch sale de esta spec.)

## Approach

**Re-frame quirúrgico, no rebuild.** Se conserva el cimiento ya construido (Remotion atoms/molecules, brands, render-jobs, projects/encargo). Se agrega la capa de authoring simple adelante y el render real atrás. Se preserva lo valioso del plan previo: ports local→cloud y el organism de 3 formatos.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/remotion/` | New | `LoopingProductPromo` + 3 compositions |
| `src/domains/video-generation/` | New | authoring producto único (form + preview) |
| `src/domains/templates/` | New | registry + card preview |
| backend `render/` (repo aparte) | New | ports + adapters locales |
| `src/domains/data-engine/` | Untouched | queda intacto, fuera de scope |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Paridad preview↔render (Supuesto A) falla | Med | Test de paridad ANTES de seguir |
| **Strict TDD marcado enabled pero Vitest NO cableado** (sin `test` ni vitest.config) | High | **Tarea 0**: cablear Vitest antes de codear |
| Latencia render local 30–90s | Med | UI comunica expectativa, sin "<5s" |

## Rollback Plan

Cambio **aditivo**: nuevos dominios/módulos, cero borrado de `data-engine`/`render-jobs`. Ruta vieja `/projects/[id]/data` intacta. Render port gated por `RENDER_PROVIDER=mock|local` → revertir = volver a `mock`. Migración Prisma (`format` nullable) reversible.

## Dependencies

- Backend NestJS implementa `render/` contra este contrato (coordinación cross-repo vía OpenSpec).
- Bundle Remotion accesible al backend (`REMOTION_BUNDLE_PATH`).

## Success Criteria

- [ ] 1 producto manual → render real → 3 MP4 descargables, idénticos a la preview.
- [ ] Sin tocar el data-engine ni romper rutas existentes.
- [ ] Vitest cableado y `pnpm test` corre verde.
- [ ] Demo en vivo end-to-end local en <3 min.
