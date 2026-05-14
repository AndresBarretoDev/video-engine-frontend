# OP Video Engine — Master Roadmap

**Version:** 1.0
**Fecha:** 2026-05-13
**Estado:** Documento vivo — actualizar al cierre de cada fase
**Estrategia adoptada:** Híbrida (Camino A + Camino B en paralelo)

---

## 🎯 Visión 30,000 ft

OP Video Engine es la plataforma que **unifica el flujo creativo de Omnicom Production** — pasamos de un pipeline manual (After Effects + AtomX + Excel + WeTransfer) a uno **web-based + data-driven + escalable**.

La estrategia híbrida nos permite:
- **HOY**: liberar a Lizeth del trabajo manual de preparar JSONs (Camino A)
- **MAÑANA**: render en nube ilimitado vía Remotion (Camino B)
- **AMBOS**: convivir mientras maduramos la transición componente por componente

---

## 📊 Estado real por fase (2026-05-13)

| Fase | Nombre | Frontend | Backend | Plan SDD | Status |
|------|--------|----------|---------|----------|--------|
| 0 | Fundamentos | ✅ 90% | ✅ 90% | ✅ docs/PRD-PHASES.md | 🟢 Casi completo |
| 1 | Motor de Video | 🟡 Scaffolded | N/A | ✅ phase-1-video-engine.md | 🔴 Por implementar |
| 2 | Application Shell | ✅ 95% | ✅ 90% | N/A (implementado) | 🟢 Funcional |
| 3 | Data Engine | ✅ 90% | ❓ Verificar | ✅ phase-3-data-engine.md | 🟡 Falta exportador AE |
| 4 | Rendering Pipeline | ✅ 95% | 🟡 BullMQ OK, **render placeholder** | ✅ phase-4-rendering-pipeline.md | 🟡 Falta Remotion CLI |
| 5 | Workflow & QC | ❌ 0% | ❌ 0% | ❌ No existe | 🔴 No iniciado |
| 6 | Puente AE | ❌ 0% | ❌ 0% | ❌ Bloqueado (D1-D5) | 🚫 Bloqueado |
| 7 | IA & Adaptación | ❌ 0% | ❌ 0% | ❌ No existe | 🔴 Sin definir |

---

## 🔄 Dependencias entre fases

```
Fase 0 (Fundamentos)
   ↓
Fase 2 (App Shell) ─────────────────┐
   ↓                                 │
Fase 1 (Motor) ──────► Fase 3 (Data Engine)
   ↓                       ↓
   │                       ├─► Camino A: exportador JSON AE (quick win)
   │                       └─► Camino B: variations Remotion (con Phase 1)
   ↓                       ↓
Fase 4 (Rendering Pipeline)
   ├─► Frontend: dashboard ✅ done
   └─► Backend: Remotion CLI integration → necesita Phase 1
   ↓
Fase 5 (Workflow & QC)
   ↓
Fase 6 (Puente AE) ◄─── BLOQUEADA por D1-D5
   ↓
Fase 7 (IA & Adaptación)
```

---

## 🚀 Próximos pasos críticos (por orden estratégico)

### 🥇 Prioridad 1 — Quick Win Camino A (1-2 semanas)

**Objetivo**: Lizeth deja de preparar JSONs manualmente.

1. **Implementar Group 1-5 de phase-3-data-engine.md**:
   - Audit Data Engine actual
   - Tipos AE (text/visibility/color/image)
   - UI Column Mapping con tipo AE
   - JSON generator
   - Botón "Exportar para AE" con preview

2. **Validación con Lizeth** (1 sesión):
   - Subir CSV → exportar JSON → cargar en AE → render
   - Documentar gotchas
   - Ajustar generator

**Bloqueador**: ninguno. Se puede arrancar YA.

---

### 🥈 Prioridad 2 — Cerrar Phase 4 backend (1 semana)

**Objetivo**: Pipeline de renders funciona end-to-end (incluso si los outputs siguen siendo placeholder).

1. **Verificar backend de Data Engine** — ¿existe módulo NestJS o falta?
2. **Documentar `SETUP.md`** del workspace (Redis + Postgres + comandos)

**Bloqueador**: ninguno crítico.

---

### 🥉 Prioridad 3 — Iniciar Phase 1 (Camino B) (3-4 semanas)

**Objetivo**: Componentes Remotion atómicos funcionales → habilita render real.

1. **Group 1 de phase-1-video-engine.md**: Remotion Setup + TextBlock
2. **Group 2**: ImageFrame + PricePatch + LogoReveal + ShapeElement
3. **Group 3**: Brand Config system
4. **Group 4**: Molecules (ProductOverlay + EndCard)
5. **Group 5**: PromoVideoTemplate (organism completo)
6. **Group 6**: Conectar a Render Farm (real rendering)
7. **Group 7**: Player preview en browser

**Cada atom debe soportar las 4 capacidades AE como props** (ver `.claude/references/ae-to-remotion-mapping.md`).

**Bloqueador**: ninguno técnico. Requiere foco completo.

---

### 🏅 Prioridad 4 — Sesión Omnicom para D1-D5 (cuando esté listo)

**Objetivo**: Desbloquear Phase 6.

Preguntas a resolver:
- D1: ¿AE en pipeline de render o solo creación?
- D2: ¿Solo A, solo B, o ambos en fases distintas a largo plazo?
- D3: Templates AE existentes — ¿migrar o documentar convención?
- D4: ¿Automatizar trigger AE vía `aerender` CLI?
- D5: Mapeo de efectos AE exportables vs no-exportables

**Bloqueador**: agenda con Omnicom + sesión con Lizeth.

---

### 🏅 Prioridad 5 — Phase 5 (Workflow & QC)

**Objetivo**: Permitir revisiones internas y portal cliente.

Pendiente de definir plan SDD (no existe todavía).

---

## 🚧 Riesgos del roadmap

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Camino A no produce JSON que AE entienda | Alto — bloquea quick win | Group 6 phase-3: validación temprana con Lizeth |
| Phase 1 (Remotion) tarda más de lo esperado | Alto — bloquea Camino B | Vertical slice: priorizar PromoVideoTemplate solo |
| D1-D5 nunca se resuelven | Medio — Phase 6 perpetuamente bloqueada | Plataforma puede operar 100% con A+B sin Phase 6 |
| /assets y /components rutas rotas (404) | Bajo — solo UX | Ocultar del menú o estado "Coming Soon" hasta backend ready |
| Render Lambda mensual costoso al escalar | Medio — costo cloud | ADR-006: migrar a Docker self-hosted cuando justifique |

---

## 📋 Decisiones críticas tomadas (ADR resumido)

Referencia completa: `docs/ARCHITECTURE.md` → ADR Log

| ADR | Decisión | Justificación |
|-----|----------|---------------|
| ADR-001 | Backend NestJS separado de Next.js | Escalabilidad horizontal, separación clara FE/BE |
| ADR-002 | JWT httpOnly cookies | Seguridad XSS, no localStorage |
| ADR-003 | Prisma vs Drizzle | Madurez + ecosystem + ORM completo |
| ADR-004 | React Query (server) + Zustand (UI) | Separación clara concerns |
| ADR-005 | Tailwind v4 | @theme inline + design tokens integration |
| ADR-006 | Remotion Lambda al inicio, migrar a Docker | Setup más simple → optimizar después |
| **ADR-007 (nuevo)** | **Estrategia Híbrida AE** | **Quick win Camino A + escalable Camino B en paralelo** |

---

## 📚 Documentos vivos del roadmap

Mantener actualizados a medida que el proyecto avanza:

- `docs/PRD-PHASES.md` — PRD oficial (actualizar al cerrar cada fase)
- `docs/ARCHITECTURE.md` — Stack + ADR Log
- `docs/PROJECT-BRIEF.md` — Vision + propuesta de valor
- `docs/AE-INTEGRATION.md` — Análisis del script + caminos A/B
- `docs/COMPONENT-SYSTEM.md` — Taxonomía de componentes
- `docs/DESIGN-SYSTEM.md` — Vibe Coding tokens
- `docs/USER-STORIES.md` — User stories por rol
- `.claude/plans/phase-1-video-engine.md` — Plan Remotion components
- `.claude/plans/phase-3-data-engine.md` — Plan Data Engine + Camino A
- `.claude/plans/phase-4-rendering-pipeline.md` — Plan rendering frontend
- `.claude/references/ae-to-remotion-mapping.md` — Mapping AE → Remotion props
- `.claude/references/component-token-mapping.md` — Mapping tokens UI

---

## ✅ Checklist de salud del roadmap

Indicadores de que el roadmap se mantiene saludable:

- [ ] Cada fase tiene su plan SDD en `.claude/plans/`
- [ ] El estado actual por fase coincide con la realidad del código
- [ ] Las dependencias entre fases están claras (este diagrama)
- [ ] Las decisiones críticas están documentadas como ADR
- [ ] El equipo sabe qué fase está en curso
- [ ] Hay un "próximo paso crítico" identificado en todo momento

---

## 🎬 Cierre

Este Master Roadmap es la **brújula técnica** del proyecto. Cualquier persona que llegue al proyecto debería poder leerlo y entender:
1. **Dónde estamos** (estado real por fase)
2. **Hacia dónde vamos** (dependencias y próximos pasos)
3. **Por qué** (decisiones tomadas y estrategia híbrida)

Cuando una decisión cambia el rumbo, **actualizar este documento primero**, antes de tocar planes individuales.
