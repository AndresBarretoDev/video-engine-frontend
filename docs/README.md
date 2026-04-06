# OP Video Engine — Documentacion del Producto

## Indice

### 1. [Project Brief](./PROJECT-BRIEF.md)
Vision general del producto, problema que resuelve, usuarios objetivo, y propuesta de valor.

### 2. [PRD por Fases](./PRD-PHASES.md)
**Roadmap completo del producto** — 8 fases desde fundamentos hasta IA.
- Phase 0: Fundamentos (design system, estructura, entorno)
- Phase 1: Motor de Video (atomos, moleculas, organismos en Remotion)
- Phase 2: Application Shell (dashboard, navegacion, CRUD de marcas, catalogo, assets)
- Phase 3: Data Engine (conexion de datos, mapeo, logica condicional, variaciones)
- Phase 4: Rendering Pipeline (Remotion Lambda, colas, progreso, descarga)
- Phase 5: Workflow & QC (revision interna, portal cliente, aprobaciones, entrega)
- Phase 6: Puente AE (importar assets After Effects, rendering hibrido)
- Phase 7: IA & Adaptacion (resizing, subtitulos, anti-fatigue, prediccion creativa)

### 3. [Architecture](./ARCHITECTURE.md)
Arquitectura tecnica: frontend (Next.js 15 + React 19), backend (NestJS 10+), video engine (Remotion 4+), infraestructura (AWS).

### 4. [Component System](./COMPONENT-SYSTEM.md)
Sistema de componentes de video: taxonomia atomos/moleculas/organismos, BrandConfig, formatos (16:9, 9:16, 1:1).

### 5. [User Stories](./USER-STORIES.md)
Historias de usuario organizadas por fase y rol (Admin, Designer, Producer, QC, Client).

### 6. [Competitive Analysis](./COMPETITIVE-ANALYSIS.md)
Analisis competitivo: AtomX, Plainly, Creatomate, Shotstack, y diferenciadores de OP Video Engine.

### 7. [Claude Project Instructions](./CLAUDE-PROJECT-INSTRUCTIONS.md)
Instrucciones originales del proyecto para agentes Claude (referencia historica).

---

## Para Agentes Claude

**OBLIGATORIO leer antes de implementar cualquier fase:**
- `PRD-PHASES.md` — Define QUE se construye en cada fase y sus criterios de aceptacion
- `COMPONENT-SYSTEM.md` — Define la taxonomia de componentes de video (Phase 1+)
- `ARCHITECTURE.md` — Define COMO se construye tecnicamente

**Las fases del producto son el roadmap oficial.** No inventar fases propias.
