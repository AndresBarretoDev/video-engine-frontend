# Template Starter — Next.js + Supabase + Claude Agents

Template base para proyectos frontend con sistema de agentes IA integrado. Incluye arquitectura de dominios, scaffolding automatizado, skills reutilizables y reglas de código no-negociables.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · React Query · Zustand · React Hook Form + Zod

---

## Inicio rápido

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Configura las variables de entorno de Supabase antes de correr el proyecto:

```bash
cp .env.example .env.local
# Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Sistema de Agentes IA (Claude Code)

Este template está optimizado para trabajar con **Claude Code CLI**. Incluye un sistema completo de agentes especializados, skills, comandos y documentación de arquitectura.

### Cómo funciona

Cuando abres este proyecto en Claude Code, el agente orquestador lee `CLAUDE.md` automáticamente y tiene acceso a todo el sistema. Para features nuevas, el flujo típico es:

```
business-analyst → arquitecto → domain-architect + ui-designer → backend + frontend-nextjs → code-reviewer
```

No necesitas invocarlos manualmente — el agente principal los delega según la tarea.

---

## Skills

Los skills extienden las capacidades del agente con conocimiento especializado. Están en `.agent/skills/` siguiendo el estándar de [skills.sh](https://skills.sh).

### Skills instalados

| Skill | Fuente | Propósito |
|-------|--------|-----------|
| `vercel-react-best-practices` | Vercel Labs | Performance: bundle, re-renders, waterfalls (57 reglas) |
| `web-design-guidelines` | Vercel Labs | UI/UX compliance |
| `frontend-design` | Anthropic | Interfaces production-grade con alto nivel de diseño |
| `skill-creator` | Anthropic | Crear y mejorar skills con evals |
| `nextjs-domain-scaffold` | Local | Scaffolding completo de dominios (Screaming Architecture) |
| `nextjs-code-review` | Local | Revisión de arquitectura y seguridad |

### Instalar todos los skills

```bash
npx skills install
```

Esto descarga los skills de GitHub registrados en `skills-lock.json` y los coloca en `.agent/skills/`.

### Agregar un skill de la comunidad

```bash
npx skills add vercel-labs/agent-skills
npx skills add tu-usuario/tu-repo-de-skills
```

### Crear un skill nuevo

Usa el skill-creator en Claude Code:

```
Quiero crear un skill para [descripción]
```

El skill resultante debe ir en `.agent/skills/{nombre}/SKILL.md` y registrarse en `skills-lock.json` con `sourceType: "local"`.

---

## Slash Commands

Comandos de scaffolding instantáneo disponibles en Claude Code. Generan boilerplate siguiendo las reglas del proyecto.

| Comando | Qué genera |
|---------|-----------|
| `/scaffold-domain {nombre}` | Estructura completa de dominio (types, schema, actions, hooks, stores, text-maps) |
| `/scaffold-page {nombre}` | Page con Suspense + loading skeleton + Server Component |
| `/scaffold-server-action {dominio/nombre}` | Server Action con validación de sesión + Zod + try-catch |
| `/scaffold-component {nombre}` | Componente con TypeScript props + text-map + responsive |
| `/review-code {path}` | Revisión rápida de un archivo contra las 10 reglas críticas |

**Commands vs Skills**: Los commands generan boilerplate al instante. Los skills aportan conocimiento profundo para diseñar y revisar. Se usan juntos, no en lugar del otro.

---

## Arquitectura

El proyecto sigue **Screaming Architecture** — la estructura de carpetas refleja los dominios de negocio, no el framework.

```
src/
├── app/                  # Rutas (App Router) — solo composición, cero lógica
├── components/
│   ├── ui/               # shadcn/ui (no modificar)
│   └── shared/           # Componentes cross-domain (2+ usos)
├── domains/              # Lógica de negocio por dominio
│   └── {dominio}/
│       ├── types.ts      # Entidades e interfaces
│       ├── schema.ts     # Validación Zod
│       ├── actions.ts    # Server Actions
│       ├── text-maps.ts  # Strings de UI
│       ├── hooks/        # React Query hooks
│       ├── stores/       # Zustand (solo UI state)
│       └── components/   # Componentes del dominio
├── lib/                  # Supabase client, infraestructura
├── utils/                # Funciones generales (formatters, parsers)
├── helpers/              # Funciones de negocio compartidas
├── constants/            # Datos estáticos, config
└── types/                # Interfaces globales
```

### 10 Reglas No-Negociables

1. Si hay 2+ usos similares → crear componente reutilizable
2. Lógica en `/utils` o `/helpers`, nunca en componentes
3. Types/interfaces siempre en archivos externos, nunca dentro de componentes
4. `page.tsx` solo tiene composición — cero lógica de negocio
5. Usar shadcn/ui automáticamente (no preguntar, no crear manualmente)
6. Mobile-first — diseñar para móvil primero, escalar con `md:` y `lg:`
7. Server Components por defecto — `'use client'` solo cuando hay interactividad
8. Nombrado: `kebab-case` para archivos, `PascalCase` para componentes
9. Imports absolutos con `@/` — nunca rutas relativas `../../`
10. RLS habilitado en todas las tablas de Supabase

### Estado

| Tipo de dato | Herramienta |
|-------------|------------|
| Datos del servidor | React Query |
| Estado de UI (modals, filtros) | Zustand |
| Formularios | React Hook Form + Zod |
| Estado local de componente | useState |

---

## Agentes especializados

Cada agente tiene un rol específico y no se pisa con los demás. Están en `.claude/agents/`.

| Agente | Rol |
|--------|-----|
| `business-analyst` | Transforma ideas en PRDs con requisitos detallados |
| `arquitecto` | Define estructura técnica del proyecto |
| `domain-architect` | Diseña entidades, Server Actions, hooks, estado |
| `ui-designer` | Diseña UX/UI, selecciona shadcn components, text-maps |
| `frontend-nextjs` | **Implementa** — escribe código frontend |
| `backend` | Diseña schema, RLS, migraciones, Server Actions |
| `code-reviewer` | Valida código contra las 10 reglas críticas |

---

## Documentación interna

Toda la documentación para agentes está en `.claude/`. Cargala con Grep, no leyendo archivos completos.

| Directorio | Contenido |
|-----------|-----------|
| `.claude/knowledge/` | Fuente de verdad: reglas, arquitectura, tech stack |
| `.claude/references/` | Resúmenes rápidos para agentes (~40-80 líneas c/u) |
| `.claude/agents/` | System prompts de agentes especializados |
| `.claude/commands/` | Slash commands de scaffolding |
| `.claude/templates/` | Templates de planes (domain, UI, backend, genérico) |
| `.claude/plans/` | Planes generados por agentes (append-only) |
| `.claude/tasks/` | Contexto de sesiones de trabajo |

---

## Replicar este template

Al clonar el repo en un proyecto nuevo:

1. `pnpm install` — dependencias
2. `npx skills install` — descarga skills de GitHub
3. Los skills locales ya están en el repo (`.agent/skills/`)
4. Configura `.env.local` con las variables de Supabase
5. Abre con Claude Code — el sistema de agentes está listo

Si tienes un repo personal de skills, actualiza `skills-lock.json` cambiando los locales a `sourceType: "github"` apuntando a tu repo. A partir de ahí, `npx skills install` lo resuelve todo.
