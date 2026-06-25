# Design — Golden Path: la puerta de entrada simple (Capa 2)

> Re-scoped 2026-06-09 a Capa 2 (PRODUCT.md §0.5): producto único. Batch/CSV diferido a Capa 3 — no se diseña acá.

## Technical Approach

Re-frame quirúrgico sobre el cimiento ya construido. Se agrega adelante una capa de authoring **de producto único** (form → preview viva) y atrás un render **real** detrás de ports. Se reutiliza el motor Remotion, `brands`, `render-jobs` y `projects` sin modificarlos. El `data-engine` queda intacto y fuera del flujo.

## Architecture Decisions

| # | Decisión | Alternativa rechazada | Razón |
|---|----------|----------------------|-------|
| D1 | Render detrás de `RenderProvider`/`StorageProvider` ports; gate `RENDER_PROVIDER=mock\|local` | Llamar Remotion CLI directo en el processor | Aísla el render para tests (mock) y mantiene limpio el cambio mock↔local. **Todo local, cero AWS.** Cloud fuera de scope |
| D2 | 1 producto → **N render jobs** (uno por formato seleccionado) | Un job multi-formato | Reusa `render-jobs` tal cual; formato per-job |
| D3 | `format` + `compositionId` nullable en `RenderJob` (migración reversible) | Tabla nueva | Aditivo, no destructivo |
| D4 | `brand-config-mapper.ts`: BrandConfig (dominio) → BrandConfigSchema (Remotion) | Usar el tipo de dominio directo en Remotion | Dos tipos para un concepto deben reconciliarse antes de armar props |
| D5 | Progreso por polling `GET /render-jobs/:id/progress` | SSE/WebSocket | v1 simple; SSE es aditivo después |
| D6 | **Batch fuera de scope**: cero `mode-tabs`, cero `variation-grid`, cero CSV en esta vista | Reusar el wizard single/batch | Mantener la Capa 2 PURA (spec lo exige) |
| D7 | **UX = formulario + preview viva** (form-izq / preview-der) | Edición inline acotada | El inline comparte maquinaria con el Creative Studio (Capa 4); adelantarlo rompe "simple primero". PRODUCT.md §9 reconciliada — form+preview NO está rechazado para Capa 2 |
| D8 | `send-to-render` **nuevo, single-product**, en `video-generation/` | Reusar el de `data-engine/` (batch, `useCreateRenderBatch`) | Ese vive en el dominio "untouched" y es batch; importarlo rompe el invariante |
| D9 | Backend: endpoint de entrada **single-product** (1 producto → N jobs por formato) | Reusar `createRenderBatch` | El existente es batch; se necesita el camino single |

## Data Flow

```
product-form (RHF+Zod) ──400ms debounce──→ ui-store ──→ assembleCompositionProps(pure)
        │                                                        │
        │                                                        ▼
        │                                          @remotion/player (preview viva)
        ▼ submit (1 job × formato)
POST /projects/:id/render-jobs  ──→ processor ──→ RenderProvider.render() [local CLI]
                                                        │
                                                        ▼ StorageProvider.upload()
                                              MP4 H.264 ──→ descarga (polling progreso)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/remotion/components/organisms/looping-product-promo/` | Create | Organism real + schema Zod, 3 formatos |
| `src/remotion/index.tsx` | Modify | Registrar 3 compositions `looping-product-promo-{16-9\|9-16\|1-1}` |
| `src/domains/templates/` | Create | `use-templates`, `template-card` (preview vivo), `template-grid` |
| `src/domains/video-generation/` | Create | ui-store, `product-form`, `remotion-player-wrapper`, `format-tabs`, `assemble-composition-props.ts`, `brand-config-mapper.ts` |
| `src/app/(dashboard)/templates/` | Create | ruta galería + `/[id]/author` (form-left / preview-right) |
| `src/domains/data-engine/` | Untouched | fuera de scope — no se importa |
| backend `render/` module | Create | ports + `LocalCliRenderProvider` + `LocalFsStorageProvider` |
| backend `render-jobs.processor.ts` | Modify | reemplazar mock por llamadas a los ports |
| `vitest.config.ts` + `package.json` script `test` | Create | **tarea 0** — cablear Vitest |

## Interfaces / Contracts

```ts
abstract class RenderProvider {
  render(input: { compositionId: string; compositionProps: object; outputPath: string;
    format: VideoFormat; width: number; height: number; fps: number;
    durationInFrames: number; onProgress: (f: number) => void }):
    Promise<{ outputPath: string; durationMs: number; framesRendered: number }>;
}
abstract class StorageProvider {
  resolveOutputPath(...): string; upload(...): Promise<string>;
  getDownloadUrl(...): string; deleteFile(...): Promise<void>;
}
// Cliente: 1 ProductSpec → assembleCompositionProps → 1 payload por formato seleccionado
```

`LoopingProductPromo` schema: `brandConfig?`, `format` (default 16:9), slots de contenido (`productName`, `productImage`, `priceCurrent`, `priceOriginal?`, `promoTag?`, `ctaText`, `legalText?`), timing (`totalDurationInFrames` 300, intro/outro 60), `logoPosition`. Cada campo con fallback → previsualiza sin marca.

## Testing Strategy

> Bloqueante: Vitest NO está cableado (sin `test` ni `vitest.config`). **Tarea 0** antes de cualquier test.

| Layer | Qué | Cómo |
|-------|-----|------|
| Unit | `assembleCompositionProps`, `brand-config-mapper`, auto-layout per formato | Vitest (funciones puras) |
| Integration | processor con `RenderProvider` mock; gate `RENDER_PROVIDER` | Vitest + Nest testing (repo backend) |
| E2E | form → preview → render → descarga; **paridad preview↔render** | Playwright MCP (manual v1) |

## Migration / Rollout

Aditivo. `RENDER_PROVIDER=mock` revierte al comportamiento previo sin tocar código. Migración Prisma (`format` nullable) reversible. Ruta vieja `/projects/[id]/data` intacta.

## Open Questions

- [ ] **Supuesto A**: probar paridad preview (browser) ↔ render (CLI) ANTES de construir encima — fuentes/timing/resolución. → **gate task 0.2 (GO/NO-GO)**.
- [x] Bundle Remotion en dev: **frontend bundlea (`bundle:remotion`) → backend lee `REMOTION_BUNDLE_PATH`** (mantiene el backend liviano). → task 2.6.
- [x] Galería: **grilla N-ready, 1 template real (LoopingProductPromo) en v1.** → task 3.3.
- [x] UX edición: **formulario + preview viva** (D7), reconciliado con PRODUCT.md §9.
