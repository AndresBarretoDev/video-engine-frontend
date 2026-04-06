# Common Agent Workflows

**Methodology**: SDD (Specification-Driven Development) — full details in `.claude/knowledge/sdd-methodology.md`

---

## Workflow Estándar de Agente

1. **Read context**: `.claude/tasks/context_session_{id}.md`
2. **SDD CHECK**: ¿Estoy en fase de spec o de implementación? ¿Existen las specs necesarias?
3. **Research codebase**: Grep/Glob para entender patrones existentes
4. **Design/Implement**: Crear spec (si es agente de planificación) o implementar siguiendo spec (si es agente de ejecución)
5. **Create plan**: `.claude/plans/{type}-{feature}-plan.md`
6. **Append to session**: Agregar entrada al context (nunca sobrescribir)

## Session Append Format

```markdown
---
## [YYYY-MM-DD HH:MM] {agent-name}: {Action Title}

**Task**: {One-liner}
**Status**: ✅ Completed | 🟡 Paused | ⚠️ Blocked
**Plan**: `.claude/plans/{plan-file}.md`

**Key Decisions**:
- {Decision 1}
- {Decision 2}

**Next Steps**:
- {Step 1}
---
```

**Budget**: 300-500 tokens por entrada. Link a planes, no duplicar.

## Grep Patterns Comunes

```bash
# Server Actions existentes
pattern: "'use server'"  path: "src/domains/"

# Text-maps
pattern: "text-maps"  path: "src/"

# Componentes por nombre
pattern: "export function"  path: "src/components/"

# Hooks existentes
pattern: "export function use"  path: "src/domains/"

# Zustand stores
pattern: "create("  path: "src/domains/**/stores/"
```

## Cuándo Referenciar Shared Docs

| Necesito... | Referenciar |
|-------------|-------------|
| Las 10 reglas | `references/project-constraints-summary.md` |
| Patrón de Server Action | `references/server-actions-patterns.md` |
| Políticas RLS | `references/rls-and-auth-rules.md` |
| Componentes shadcn/ui | `references/component-architecture.md` |
| Naming de archivos | `references/naming-conventions.md` |
| Deep dive en arquitectura | `knowledge/architecture-patterns.md` (usar Grep) |
