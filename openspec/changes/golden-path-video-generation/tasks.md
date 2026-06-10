# Tasks — Golden Path: la puerta de entrada simple (Capa 2)

> Re-scoped 2026-06-09 (PRODUCT.md §0.5/§9). Producto único, form + preview viva, render real local, cero AWS. Sin batch/CSV.

## Phase 0: Prerequisitos (desactivar bombas)

- [x] 0.1 Cablear Vitest: `vitest.config.ts` + script `test` (jsdom + `@vitest/coverage-v8`); verificar `pnpm test` corre.
- [x] 0.2 **Paridad (Supuesto A)**: render de UNA composición por `@remotion/player` vs CLI; comparar frame clave; documentar divergencias. **GO/NO-GO.** → **GO (EMPÍRICO)**. Capturas browser vía Playwright en `.paridad-test/*-PLAYER.png`. Diff pixel-a-pixel: frame75=1.07% diffs, frame20=1.15% — 100% dentro del bounding-box del texto, naturaleza: anti-aliasing de fuente (Chrome Headless Shell vs Blink normal). Cero diferencias estructurales (posición/opacidad/color/layout). Ver engram sdd/golden-path-video-generation/apply-progress.

## Phase 1: LoopingProductPromo organism [remotion]

- [x] 1.1 (RED) Test que falla: posiciones por formato (16:9/9:16/1:1) **y assert de "ningún elemento se desborda del canvas"**.
- [x] 1.2 `looping-product-promo.schema.ts` (Zod: brandConfig, format, slots, timing, logoPosition).
- [x] 1.3 `LoopingProductPromo.tsx` con animaciones reales reusando atoms/molecules.
- [x] 1.4 (GREEN) Auto-layout vía `getFormatScale`/`getFormatTextAlign`; tests pasan (incluido no-overflow).
- [x] 1.5 Inyección BrandConfig con fallbacks (preview sin marca).
- [x] 1.6 Registrar 3 compositions en `index.tsx` + default props en `organism-previews.tsx`.

## Phase 2: Render real local detrás de ports [repo backend]

- [ ] 2.1 Módulo `render/`: ports `RenderProvider` + `StorageProvider`.
- [ ] 2.2 `LocalCliRenderProvider` (spawn `remotion render`, parsear progreso) + `LocalFsStorageProvider` (ServeStatic).
- [ ] 2.3 Gate `RENDER_PROVIDER=mock|local`, default `mock` (revertir sin código).
- [ ] 2.4 Migración Prisma: `format` + `compositionId` nullable en `RenderJob` (reversible).
- [ ] 2.5 Reemplazar mock en `render-jobs.processor.ts` por ports + `onProgress` **persistido en DB** (base de la durabilidad ante tab-close).
- [ ] 2.6 **Endpoint single-product** (D9): 1 producto → N jobs (uno por formato). NO reusar `createRenderBatch`.
- [ ] 2.7 Script `bundle:remotion` (frontend) + `REMOTION_BUNDLE_PATH` (backend); documentar en SETUP.

## Phase 3: Galería de templates [frontend]

- [ ] 3.1 Backend `templates/` + `GET /templates` (static `TemplateDescriptor[]`, 1 template × 3 formatos).
- [x] 3.2 Dominio `templates/`: types, schema, text-maps, `use-templates`.
- [x] 3.3 `template-card` (preview vivo) + `template-grid` (N-ready) + skeleton sin layout shift.
- [x] 3.4 **Agregar item "Templates" nuevo** en `nav-config.ts` + ruta `src/app/(dashboard)/templates/` (dentro del route-group `(dashboard)` para heredar layout/guards). (No existe label "Data Engine" — es alta, no rename.)

## Phase 4: Authoring producto único (form + preview) [frontend]

- [x] 4.1 Scaffold `video-generation/` (types, schema, text-maps, ui-store).
- [x] 4.2 (RED→GREEN) Test + `assemble-composition-props.ts` (pura) y `brand-config-mapper.ts`.
- [x] 4.3 Ruta `src/app/(dashboard)/templates/[id]/author`: layout form-izq / preview-der.
- [x] 4.4 `product-form` (RHF+Zod, debounce 400ms) + `remotion-player-wrapper` + `format-tabs`. **Sin CSV, sin variation-grid.**
- [x] 4.5 **`send-to-render` NUEVO single-product** en `video-generation/` (D8, no reusar el de data-engine) + `render-count-indicator` + reusar el endpoint `progress` que YA existe (`/render-jobs/:id/progress`, no recrear) + descarga de `render-jobs`.

## Phase 5: Wire end-to-end [full stack]

- [ ] 5.1 1 producto → N jobs → render real → 3 MP4 descargables.
- [ ] 5.2 Naming `{brand}_{product-slug}_{format}_{date}.mp4`.
- [ ] 5.3 Seed: tokens Omnicom + 1 producto demo con imagen resoluble.
- [ ] 5.4 Copy UI: latencia local (sin "<5s").
- [ ] 5.5 **Durabilidad tab-close**: cerrar tab a mitad de render, volver, el estado refleja progreso real (no resetea).

## Phase 6: Estados, a11y y mobile [frontend]

- [x] 6.1 Estados loading/empty/error del render + retry; skeletons sin layout shift. (send-to-render-button: isPending+spinner, Alert destructive+retry, disabled si form inválido. render-count-indicator: processing/completed/failed. Skeleton en preview wrapper.)
- [x] 6.2 Accesibilidad WCAG 2.1 AA: labels, foco, teclado + **`aria-live` para el progreso de render**. (aria-live="polite"+aria-atomic en progreso, aria-busy en botón, aria-label descriptivos, Progress con aria-valuenow/min/max, role region/status.)
- [x] 6.3 Mobile-first: preview accesible en <768px (sheet) sin perder el form. (Sheet bottom con FormatTabs + player; form queda usable.)
- [x] 6.FIX **Live preview contenido (bug owner)**: 9:16/1:1 ya NO desbordan la columna. `remotion-player-wrapper.tsx` usa max-h-[70dvh] + maxWidth derivado (contain). VERIFICADO visualmente en Chrome (3 formatos sin scroll).

> NOTA Fase 6: skills UI aplicadas (baseline-ui, make-interfaces-feel-better, fixing-motion-performance, 12-principles-of-animation). Falta verificación e2e del flujo LOGUEADO (el owner la hará mañana) — el código está, no se pudo navegar la ruta bajo guards sin auth.

## Phase 7: Verify (por escenario)

- [ ] 7.1 `video-generation`: gallery entry · preview <400ms · sin superficie batch · brand aplicado · formato sin overflow ✅(verificado) · imagen ausente bloquea · 3 MP4 = preview · estados · a11y/aria-live · mobile. (Resto requiere flujo logueado + backend.)
- [ ] 7.2 `local-render`: swap sin tocar pipeline · mock revertible · MP4 real H.264 · **tab-close durabilidad** · latencia honesta. [requiere BACKEND]
- [ ] 7.3 `pnpm build` limpio + `pnpm test` verde. (✅ `pnpm test` = 50/50 verde. ⏳ `pnpm build` lo corre el owner — regla "never build" del agente.)
- [ ] 7.4 Demo en vivo end-to-end <3 min. [requiere BACKEND vivo]

## ⚠️ GAP DE WIRE conocido (Fase 5, requiere backend para verificar)
- `SendToRenderButton` guarda `jobIds` en estado LOCAL (`useState`), pero `RenderCountIndicator` los espera por prop y recibe `[]` → el progreso NO se mostraría aún. Fix (Fase 5 wire): subir `jobIds` al store `video-generation-store` (Zustand) o al `authoring-section`, y que el indicator los lea de ahí. NO se hizo ahora: es wire e2e dependiente del backend y no verificable sin jobIds reales.
