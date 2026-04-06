# Specification-Driven Development (SDD)

**Metodología obligatoria del proyecto OP Video Engine.**
**Aplica a Cowork Y Claude Code por igual.**

---

## Principio Fundamental

> **Nada se implementa sin especificación aprobada.**
> El código es la consecuencia de una especificación, no al revés.

SDD significa que cada feature, componente, página o integración pasa por un proceso de especificación formal ANTES de escribir una sola línea de código de implementación. Los agentes de planificación (business-analyst, arquitecto, domain-architect, ui-designer) producen especificaciones. Los agentes de ejecución (frontend-nextjs, backend) consumen esas especificaciones.

---

## Flujo SDD Obligatorio

### Fase 1: Especificación (ANTES de codear)

```
1. business-analyst    → PRD (qué se construye, para quién, por qué)
2. arquitecto          → Estructura técnica (carpetas, decisiones de stack)
3. domain-architect    → Contratos de datos (types, schemas, API contracts, hooks)
4. ui-designer         → Diseño de pantallas (layout, componentes, text-maps, estados)
```

**Output de esta fase**: Planes en `.claude/plans/` con especificaciones concretas.

### Fase 2: Implementación (DESPUÉS de especificar)

```
5. backend             → Implementa contratos de API (NestJS modules, controllers, DTOs)
6. frontend-nextjs     → Implementa UI según specs (páginas, componentes, hooks)
```

### Fase 3: Validación (DESPUÉS de implementar)

```
7. code-reviewer       → Verifica que el código cumple las especificaciones
```

---

## Reglas SDD

### 1. No hay código sin spec

Antes de crear cualquier archivo `.tsx`, `.ts` (que no sea scaffolding), debe existir:
- Un plan en `.claude/plans/` que lo defina, O
- Una entrada en el session context que documente la decisión

**Excepción**: Scaffolding de estructura (carpetas vacías, archivos skeleton con tipos placeholder) es infraestructura, no implementación. No requiere spec formal.

### 2. La spec es el contrato

Una vez aprobada la especificación:
- Los tipos en `types.ts` deben coincidir con lo que definió el domain-architect
- Los componentes deben seguir el layout que definió el ui-designer
- Los endpoints deben respetar los contratos del domain-architect
- Las validaciones deben usar los schemas Zod especificados

### 3. Cambios a la spec se documentan

Si durante la implementación se descubre que la spec necesita cambios:
- NO se cambia el código silenciosamente
- Se documenta el cambio en el session context
- Se actualiza el plan correspondiente
- Se explica el porqué del cambio

### 4. Granularidad de specs

No todo necesita un documento de 500 líneas. La profundidad depende del scope:

| Scope | Spec necesaria |
|-------|---------------|
| Feature nueva completa | PRD + domain plan + UI plan + backend plan |
| Página nueva | UI plan (layout, componentes, estados) |
| Componente nuevo | Props interface + variantes + estados en el plan |
| Hook nuevo | Tipo de retorno + query key + parámetros |
| Fix o ajuste menor | Entrada en session context explicando qué y por qué |
| Refactor | Plan con antes/después y justificación |

### 5. El session context es el log de verdad

`.claude/tasks/context_session_{id}.md` es el registro histórico de todo lo que se decide y se implementa. Tanto Cowork como Claude Code deben:
- Leerlo al iniciar trabajo
- Append al terminar trabajo
- Nunca sobrescribir entradas anteriores

---

## Cómo Aplica a Cada Herramienta

### Cowork (Planificación + Implementación)
- Puede ejecutar el flujo completo (spec → implementación)
- Tiene acceso al project knowledge externo para contexto de negocio
- Debe asegurar que todo dato técnico necesario para Claude Code esté EN EL REPO

### Claude Code (Implementación + Validación)
- Lee las specs de `.claude/plans/` y el session context
- Implementa siguiendo las especificaciones
- Si encuentra ambigüedad, documenta la decisión en el session context
- Corre builds, tests, linting — validación técnica real

### Regla de Colaboración
- **Cowork no debe generar código que Claude Code no pueda entender** (sin fuentes externas)
- **Claude Code no debe inventar specs** — si no hay spec, pregunta o documenta el gap
- **Todo vive en el repo**: specs, decisions, tokens, contratos. Nada queda solo en memoria de sesión

---

## Artefactos SDD por Tipo de Feature

### Feature Completa (ej: "Módulo de Assets")

```
.claude/plans/
├── product-assets.md          ← business-analyst: PRD
├── domain-assets-plan.md      ← domain-architect: entities, schemas, API contracts
├── ui-assets-plan.md          ← ui-designer: pantallas, componentes, text-maps
└── backend-assets-plan.md     ← backend: NestJS modules, controllers, Prisma schema
```

### Página Individual (ej: "Login Page")

```
.claude/plans/
└── ui-login-plan.md           ← ui-designer: layout, estados, componentes, validación
```

### Componente Reutilizable (ej: "StatusBadge")

```
.claude/plans/
└── ui-status-badge-plan.md    ← Props, variantes, tokens, estados, accesibilidad
```

---

## Checklist SDD (Para Cualquier Agente)

Antes de implementar, verificar:

- [ ] ¿Existe una spec/plan para lo que voy a construir?
- [ ] ¿Los types están definidos en la spec?
- [ ] ¿Los endpoints/contratos están documentados?
- [ ] ¿El layout/componentes están diseñados?
- [ ] ¿Leí el session context para entender decisiones previas?
- [ ] ¿Voy a append al session context cuando termine?

Si alguno es ❌ y no es scaffolding → STOP. Crear la spec primero.

---

## Anti-Patrones SDD

❌ **"Ya sé lo que necesita, lo codifico directo"** → Siempre spec primero
❌ **"La spec está en mi cabeza"** → Si no está en un archivo, no existe
❌ **"Lo hago rápido y después documento"** → La deuda de documentación nunca se paga
❌ **"Cowork ya lo sabe, Claude Code también"** → No comparten memoria. El repo es el puente
❌ **"Es solo un componente pequeño"** → Igual necesita props definidos y variantes claras
