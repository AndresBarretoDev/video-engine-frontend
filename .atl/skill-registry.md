# Skill Registry — op-video-engine-frontend

**Generated**: 2026-04-01
**Project**: op-video-engine-frontend

## User Skills

| Skill | Source | Trigger |
|-------|--------|---------|
| `nextjs-domain-scaffold` | `.agent/skills/` | Create domain, scaffold, new feature, CRUD for entity |
| `nextjs-code-review` | `.agent/skills/` | Review, audit, check, validate code |
| `sdd-init` | `~/.claude/skills/` | SDD initialization |
| `sdd-explore` | `~/.claude/skills/` | SDD exploration phase |
| `sdd-propose` | `~/.claude/skills/` | SDD proposal phase |
| `sdd-spec` | `~/.claude/skills/` | SDD specification phase |
| `sdd-design` | `~/.claude/skills/` | SDD design phase |
| `sdd-tasks` | `~/.claude/skills/` | SDD task breakdown phase |
| `sdd-apply` | `~/.claude/skills/` | SDD implementation phase |
| `sdd-verify` | `~/.claude/skills/` | SDD verification phase |
| `sdd-archive` | `~/.claude/skills/` | SDD archive phase |
| `judgment-day` | `~/.claude/skills/` | Parallel adversarial review |
| `skill-creator` | `~/.claude/skills/` | Create new AI skills |
| `branch-pr` | `~/.claude/skills/` | PR creation workflow |
| `issue-creation` | `~/.claude/skills/` | Issue creation workflow |
| `go-testing` | `~/.claude/skills/` | Go test patterns (not applicable to this project) |

## Project Conventions

| File | Path | Purpose |
|------|------|---------|
| `CLAUDE.md` | `/CLAUDE.md` | Project entry point, agent instructions, constraints |
| `critical-constraints.md` | `.claude/knowledge/critical-constraints.md` | 10 non-negotiable architectural rules |
| `sdd-methodology.md` | `.claude/knowledge/sdd-methodology.md` | SDD workflow definition |
| `component-token-mapping.md` | `.claude/references/component-token-mapping.md` | Component → CSS variable mapping (MUST READ before CSS) |
| `naming-conventions.md` | `.claude/references/naming-conventions.md` | File/variable naming rules |
| `api-patterns.md` | `.claude/references/api-patterns.md` | API client, React Query hooks |
| `auth-patterns.md` | `.claude/references/auth-patterns.md` | JWT auth, role guards |
| `component-architecture.md` | `.claude/references/component-architecture.md` | Component structure, shadcn, text-maps |

## Compact Rules

### nextjs-domain-scaffold
- Domain at `src/domains/{domain}/` with: types.ts, schema.ts, text-maps.ts, hooks/, stores/, components/
- Types external to components, Zod schemas with inferred types
- React Query hooks for server state, Zustand for UI state only
- Named exports only (no default exports)
- NOTE: This skill references Server Actions and Supabase — override with API client + NestJS patterns per CLAUDE.md

### nextjs-code-review
- Check: reusable components, separation of concerns, external types, clean pages, mobile-first, Server Components by default, naming conventions, absolute imports, auth guards
- NOTE: This skill references Supabase RLS — override with JWT + NestJS role guards per CLAUDE.md
