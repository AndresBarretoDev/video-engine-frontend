# CLAUDE.md: OP Video Engine — Frontend

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**OP Video Engine** is a platform for automated personalized video generation at scale, built for Omnicom Production. This repository is the **frontend** (Next.js). The **backend** is a separate NestJS service (see `op-video-engine-backend` repo).

**What it does**: Replaces the After Effects + AtomX + Excel pipeline with a web-based, data-driven video generation platform using Remotion.

**Tech Stack**:
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Video**: Remotion 4+ (@remotion/player for preview)
- **State**: React Query (server state from NestJS API) + Zustand (UI state only)
- **Forms**: React Hook Form + Zod
- **Backend** (separate repo): NestJS 10+ + PostgreSQL + Prisma + BullMQ + Redis
- **Auth**: JWT tokens from NestJS (Passport.js), consumed via httpOnly cookies
- **Rendering**: Remotion CLI **local** orchestrated by backend via a `RenderProvider` port (`mock | local`). Lambda (AWS) is a FUTURE evolution of the port, NOT the starting point — see PRODUCT.md §4 Fase A
- **Storage**: local filesystem served at `/uploads` (backend ServeStatic) via a `StorageProvider` port. S3 + CloudFront are the future cloud implementation

**Philosophy**: UI/UX-first, reusable components, ultra-clean pages, strict separation of concerns, mobile-first responsive design.

---

## 🔴 CRITICAL - READ FIRST

**BEFORE doing anything else**, you MUST read these documents:

1. [`../op-video-engine-docs/PRODUCT.md`](../op-video-engine-docs/PRODUCT.md) — **🟢 SSOT del producto**: what the product is, the 4-layer experience model (§0.5), Módulos 1–7 (§3), the ACTIVE roadmap Fases A–F (§4), use cases CU-1..5 (§5), acceptance criteria (§6). **On any contradiction between docs, PRODUCT.md wins. Do NOT invent your own phases or modules.** The old "8 phases (0–7)" model is superseded and lives in `../op-video-engine-docs/archive/`.
2. [`.claude/knowledge/sdd-methodology.md`](.claude/knowledge/sdd-methodology.md) — **Specification-Driven Development**: Nothing gets implemented without a spec. This is the development methodology for the entire project.
3. [`.claude/knowledge/critical-constraints.md`](.claude/knowledge/critical-constraints.md) — **10 Non-negotiable rules**: Architectural constraints that all code must follow.

## 📄 Product Documentation (SHARED — workspace level)

**🔴 Product docs are SHARED between frontend and backend.** They live OUTSIDE this repo, at the workspace level in [`../op-video-engine-docs/`](../op-video-engine-docs/) — the single source of truth for WHAT the product is. Both repos read from here. Do NOT duplicate these into the repo.

| Document | Content |
|----------|---------|
| [`../op-video-engine-docs/PRODUCT.md`](../op-video-engine-docs/PRODUCT.md) | **🟢 SSOT** — product definition, layers, modules, ACTIVE roadmap (Fases A–F), acceptance criteria |
| [`../op-video-engine-docs/README.md`](../op-video-engine-docs/README.md) | Document hierarchy index — which doc to trust for what |
| [`../op-video-engine-docs/PROJECT-BRIEF.md`](../op-video-engine-docs/PROJECT-BRIEF.md) | Vision, problem statement, target users (monetization section outdated — trust PRODUCT.md §2) |
| [`../op-video-engine-docs/ARCHITECTURE.md`](../op-video-engine-docs/ARCHITECTURE.md) | Technical architecture (frontend + backend + video engine) |
| [`../op-video-engine-docs/COMPONENT-SYSTEM.md`](../op-video-engine-docs/COMPONENT-SYSTEM.md) | Video component taxonomy (atoms/molecules/organisms) |
| [`../op-video-engine-docs/USER-STORIES.md`](../op-video-engine-docs/USER-STORIES.md) | User stories by role |
| [`../op-video-engine-docs/COMPETITIVE-ANALYSIS.md`](../op-video-engine-docs/COMPETITIVE-ANALYSIS.md) | Competitive landscape |
| [`../op-video-engine-docs/PROYECTO-EXPLICADO.md`](../op-video-engine-docs/PROYECTO-EXPLICADO.md) | Inspiration project (Lidl / Belgium) explained |

**SDD in short**: Spec first → implement second → validate third. **Implementation specs live in `openspec/` — that is the canonical location.** The old plans in `.claude/plans/` (phase-1/3/4, written for the superseded 8-phase model) are HISTORICAL — do not implement from them; see `.claude/plans/README.md`. Don't write implementation code without a spec.

---

## 🧭 Workspace & Cross-Repo Conventions

This repo lives in the `OP_VIDEO_CTV/` workspace alongside two siblings:

```
OP_VIDEO_CTV/
├── op-video-engine-docs/      ← SHARED product source of truth (roadmap, briefs, user-stories)
├── op-video-engine-frontend/  ← this repo (Next.js)
└── op-video-engine-backend/   ← NestJS API (separate git repo)
```

**Rules for working across repos:**

1. **One brain per repo.** Each repo has its OWN `.claude/` + `CLAUDE.md`. When working on the backend, open a Claude session IN the backend repo so its NestJS rules load — do NOT drive the backend from this frontend session.
2. **Repos coordinate through SHARED ARTIFACTS, not direct calls.** The frontend writes the API contract it needs (as an OpenSpec change); the backend implements against it. This is Spec-Driven Development.
3. **Engram memory uses ONE unified project key: `op-video-engine`** (NOT `op-video-engine-frontend`). This way frontend and backend share a single living memory of decisions and progress. Always pass `project: "op-video-engine"` to `mem_save` / `mem_search`.
4. **Product docs are never duplicated into the repo** — they live in `../op-video-engine-docs/`.

---

## 🎯 Architecture: Frontend ↔ Backend Separation

```
┌─────────────────────────────────┐     ┌──────────────────────────────────┐
│   FRONTEND (this repo)          │     │   BACKEND (separate NestJS repo) │
│                                 │     │                                  │
│  Next.js 15 + React 19         │────▶│  NestJS 10+ (Express/Fastify)    │
│  @remotion/player (preview)    │ API │  PostgreSQL + Prisma             │
│  React Query (data fetching)   │◀────│  BullMQ + Redis (render queue)   │
│  Zustand (UI state only)       │     │  Remotion CLI local (render port)│
│  Tailwind v4 + shadcn/ui      │     │  Local FS /uploads (storage port)│
│  Zod (frontend validation)     │     │  Passport.js + JWT (auth)        │
└─────────────────────────────────┘     └──────────────────────────────────┘
```

**Key implications**:
- **NO Server Actions for mutations** — all mutations go to NestJS REST API via React Query `useMutation`
- **NO Supabase** — backend is NestJS with PostgreSQL + Prisma
- **Auth via JWT** — tokens stored in httpOnly cookies, validated by NestJS Passport Guards
- **API client layer** — centralized in `/src/lib/api/` for all NestJS communication
- **Roles**: Admin, Designer, Producer, QC, Client — managed by backend, consumed by frontend

---

## 🤖 Available Specialized Agents

### Core Agents

1. **business-analyst** → [`.claude/agents/business-analyst.md`](.claude/agents/business-analyst.md)
   - Transforms ideas into detailed requirements
   - When: User presents new idea or needs requirements clarity

2. **arquitecto** → [`.claude/agents/arquitecto.md`](.claude/agents/arquitecto.md)
   - Defines technical project structure
   - When: Starting new module or major feature

3. **domain-architect** → [`.claude/agents/domain-architect.md`](.claude/agents/domain-architect.md)
   - Designs business logic, entities, domain model
   - Plans API consumption hooks, validation schemas
   - When: Need to design business rules and data operations

4. **ui-designer** → [`.claude/agents/ui-designer.md`](.claude/agents/ui-designer.md)
   - Designs UX/UI using Vibe Coding design system tokens
   - Plans accessibility, responsive design, text-maps
   - When: Need UX/UI design for features

5. **frontend-nextjs** → [`.claude/agents/frontend-nextjs.md`](.claude/agents/frontend-nextjs.md)
   - Implements Next.js 15 + React 19 features
   - Builds pages, layouts, components, API integration
   - When: Ready to implement frontend code

6. **backend** → [`.claude/agents/backend.md`](.claude/agents/backend.md)
   - Plans NestJS API contracts, DTOs, endpoints
   - Designs database schemas, auth guards, queue jobs
   - When: Need backend architecture planning (implementation in backend repo)

7. **code-reviewer** → [`.claude/agents/code-reviewer.md`](.claude/agents/code-reviewer.md)
   - Validates code against critical constraints
   - When: After implementing significant features

---

## ⚡ Slash Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/scaffold-domain {name}` | Creates full domain structure (types, schema, api-hooks, stores, components, text-maps) | Starting a new business domain |
| `/scaffold-page {name}` | Creates ultra-clean page with Suspense + loading + Server Component | Adding a new route/page |
| `/scaffold-api-hook {domain/name}` | Creates React Query hook for NestJS API endpoint | Adding a new API integration |
| `/scaffold-component {name}` | Creates component with TypeScript props + text-map + responsive | Adding a new UI component |
| `/review-code {path}` | Quick validation against critical rules | Quick check on a single file |

---

## 📖 Reference Library

| Reference | Content | Used by |
|-----------|---------|---------|
| [`.claude/references/project-constraints-summary.md`](.claude/references/project-constraints-summary.md) | 10 rules summary, tech stack, state matrix | All agents |
| [`.claude/references/api-patterns.md`](.claude/references/api-patterns.md) | API client, React Query hooks, mutation patterns | domain-architect, frontend |
| [`.claude/references/auth-patterns.md`](.claude/references/auth-patterns.md) | JWT auth, role guards, middleware, protected routes | backend, frontend |
| [`.claude/references/component-architecture.md`](.claude/references/component-architecture.md) | Component structure, shadcn, text-maps, states | ui-designer, frontend |
| [`.claude/references/naming-conventions.md`](.claude/references/naming-conventions.md) | File/variable/directory naming rules | All agents |
| [`.claude/references/common-workflows.md`](.claude/references/common-workflows.md) | Standard agent workflow, session format | All agents |
| [`.claude/references/component-token-mapping.md`](.claude/references/component-token-mapping.md) | **🔴 MUST READ before writing ANY component CSS**. Maps every component to its exact CSS variable from Vibe Coding tokens. Zero hardcoded values allowed. | ui-designer, frontend |

---

## 📋 Plan Templates

| Template | Agent | Purpose |
|----------|-------|---------|
| [`.claude/templates/plan-template.md`](.claude/templates/plan-template.md) | Any | Generic plan structure |
| [`.claude/templates/domain-plan-template.md`](.claude/templates/domain-plan-template.md) | domain-architect | Entity model, schemas, hooks, state |
| [`.claude/templates/ui-plan-template.md`](.claude/templates/ui-plan-template.md) | ui-designer | Components, layout, text-maps, accessibility |
| [`.claude/templates/backend-plan-template.md`](.claude/templates/backend-plan-template.md) | backend | NestJS modules, DTOs, endpoints, queue jobs |

---

## 🔄 Workflow Protocol (SDD)

**Methodology**: Specification-Driven Development — see [`.claude/knowledge/sdd-methodology.md`](.claude/knowledge/sdd-methodology.md)

### For New Features (Spec → Implement → Validate)

```
PHASE 1: SPECIFICATION (no code yet)
  business-analyst     → PRD: qué, para quién, por qué
      ↓
  arquitecto           → Estructura técnica, carpetas, decisiones
      ↓
  domain-architect     → Contratos: types, schemas, API endpoints, hooks
  ui-designer          → Diseño: layout, componentes, text-maps, estados
      ↓
  Output: OpenSpec change in openspec/changes/{name}/ ← ESTE ES EL CONTRATO
          (proposal.md + specs/ + design.md + tasks.md)

PHASE 2: IMPLEMENTATION (following the specs)
  backend              → NestJS modules, controllers, DTOs (per domain plan)
  frontend-nextjs      → Pages, components, hooks (per UI + domain plans)

PHASE 3: VALIDATION
  code-reviewer        → Verifica código vs especificaciones
      ↓
  ✅ Feature complete
```

**Rule**: Phase 2 CANNOT start without Phase 1 outputs in `openspec/changes/`.

### For Trivial Changes

Implement directly — but document the decision in session context.

---

## 📋 Session Context Protocol

**When session_id is provided:**

1. Read `.claude/tasks/context_session_{id}.md` **FIRST**
2. Understand previous decisions and progress
3. Continue from where previous work left off
4. **Append** your entry at the end (**NEVER** overwrite)

---

## 📚 Documentation Map

### Always Read First
- [`../op-video-engine-docs/PRODUCT.md`](../op-video-engine-docs/PRODUCT.md) — 🟢 SSOT: product, layers, modules, ACTIVE roadmap (Fases A–F)
- [`.claude/knowledge/critical-constraints.md`](.claude/knowledge/critical-constraints.md) — Non-negotiable rules

### Read When Starting a New Phase
- [`../op-video-engine-docs/COMPONENT-SYSTEM.md`](../op-video-engine-docs/COMPONENT-SYSTEM.md) — Video component taxonomy
- [`../op-video-engine-docs/ARCHITECTURE.md`](../op-video-engine-docs/ARCHITECTURE.md) — Technical architecture (render section outdated: trust PRODUCT.md §4 — local CLI first, not Lambda)
- In-repo working docs: [`docs/architecture/`](docs/architecture/) (estado actual, theming levels) + [`docs/contracts/`](docs/contracts/) (API contracts written by this repo)

### Load As Needed
- [`.claude/knowledge/tech-stack.md`](.claude/knowledge/tech-stack.md) — Technologies, versions, commands
- [`.claude/knowledge/architecture-patterns.md`](.claude/knowledge/architecture-patterns.md) — Architecture patterns
- [`.claude/knowledge/file-structure.md`](.claude/knowledge/file-structure.md) — Folder structure, naming
- [`.claude/knowledge/context-strategy.md`](.claude/knowledge/context-strategy.md) — How to load context efficiently

**Strategy**: Use Grep to search specific sections instead of reading full files.

---

## ⚡ Key Constraints (Summary)

### 10 Reglas No-Negociables:

1. **Componentes reutilizables**: Si hay 2+ usos similares → crear componente
2. **Separación de concerns**: Lógica en `/utils` o `/helpers`, datos en `/constants`, types en `/types`
3. **Types externos**: NUNCA interfaces dentro de componentes
4. **Pages limpias**: Solo composición, cero lógica de negocio
5. **MCPs automáticos**: Usar Shadcn MCP sin pedirlo
6. **Mobile-first**: Diseñar para móvil primero
7. **Server Components por defecto**: Client components solo cuando necesario
8. **Naming conventions**: kebab-case para archivos, PascalCase para componentes
9. **Imports absolutos**: Usar `@/` siempre
10. **Auth + Guards**: Todas las rutas protegidas con JWT middleware + role checks

### Otras reglas críticas:
- API client centralizado para toda comunicación con NestJS backend
- React Query para TODA data del servidor — nunca Zustand para server state
- Zustand SOLO para UI state (sidebar, theme, filters)
- Suspense obligatorio para operaciones async
- Named exports (no default exports, excepto pages de Next.js)
- Text-maps para externalizar strings
- Design system Vibe Coding: nunca hardcodear colores, fonts, spacing

---

## 🏗️ Folder Structure

```
/src
  /app                → Pages (App Router) - SOLO composición
  /components         → UI reutilizable
    /ui/              → shadcn components
    /shared/          → Componentes cross-domain
  /domains            → Lógica de negocio por dominio
    /{domain}/
      /components/    → Componentes específicos del dominio
      /hooks/         → React Query hooks + business logic
      /stores/        → Zustand (UI state only)
      /types.ts       → Types del dominio
      /schema.ts      → Zod schemas
      /text-maps.ts   → Strings del dominio
  /remotion           → Remotion compositions y templates
    /templates/       → Video templates (organisms)
    /components/      → Atoms y molecules de video
    /schemas/         → Zod schemas para props de templates
  /lib                → Infrastructure
    /api/             → API client + interceptors para NestJS
    /auth/            → JWT helpers, auth context
    /config/          → Environment config
  /utils              → Funciones puras (formatters, parsers)
  /helpers            → Funciones de negocio compartidas
  /constants          → Datos estáticos, config, text-maps globales
  /types              → Interfaces/Types GLOBALES
  /styles             → CSS files con @apply patterns
```

---

## 🎨 Design System: Vibe Coding

El design system usa **7 archivos JSON** como fuente de verdad.

**Source of Truth (JSONs originales):** [`src/styles/tokens/source/`](src/styles/tokens/source/)
- `colors_system.json` — Paleta OP Blue (50-950) + superficies (level 0-6) + componentes + transparencias
- `typography_system.json` — Mulish, escalas display/headings/body/caption/CTA
- `spacing_system.json` — Padding/gap semántico por contexto (button, card, field, container)
- `grid_system.json` — Grid 12 columnas, containers (main 1376px, altern 1135px), sidebar 141px
- `motion_system.json` — Duraciones (fast/standard/slow/story), easings (ui/premium/editorial), reglas por componente
- `strokes_and_radius_system.json` — Bordes (none/thin/medium/thick) y border-radius (2px → infinite)
- `status_colors.json` — Colores de estado (approved, rejected, warning, pending, in_review, delivered)

**CSS Variables generadas:** [`src/styles/tokens/`](src/styles/tokens/) — 7 archivos CSS, uno por cada JSON
**Siempre consultar los JSONs en `source/` antes de crear o modificar tokens.**

**Regla**: Platform Tokens para la UI web. Brand Tokens para componentes de video Remotion.

---

## 🔌 MCP Configuration

### shadcn/ui MCP (MANDATORY)
- ✅ Automatically install shadcn components
- ❌ NEVER ask user "¿Quieres que use shadcn?"

### Playwright MCP (TESTING)
- ✅ Use for E2E testing when available

---

## ✅ For Agents: Pre-Work Checklist

- [ ] Read `.claude/knowledge/critical-constraints.md`?
- [ ] Read session context if `session_id` provided?
- [ ] Understand that backend is NestJS (separate repo)?
- [ ] All API calls go through `/src/lib/api/` client?
- [ ] No Server Actions for mutations (use React Query + NestJS API)?
- [ ] Will append to session context (not overwrite)?
