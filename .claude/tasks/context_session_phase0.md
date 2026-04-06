# Session Context — Phase 0: Fundamentals

**Session ID:** phase0
**Project:** OP Video Engine — Frontend
**Phase:** 0 — Fundamentos (docs, design system, estructura)
**Started:** 2026-04-01
**Status:** In Progress

---

## Entry 1 — 2026-04-01 | Initial Setup & CLAUDE.md Adaptation

**Agent:** Parent (orchestrator)
**Action:** Created new project `op-video-engine-frontend` from `template-starter-nextjs`

### What was done:
1. Created project at `/Users/omarbarreto/Documents/PROJECTS/op-video-engine-frontend`
2. Adapted all 30+ `.claude/` configuration files from Supabase to NestJS architecture
3. Updated CLAUDE.md as project entry point
4. Updated all agents, commands, references, templates, and knowledge docs
5. Removed Server Actions patterns, replaced with React Query + API client patterns
6. Removed Supabase references, replaced with NestJS + Prisma + BullMQ
7. Added Remotion templates from lidl-video-forge (reference only, not to be refactored)
8. Updated package.json with all required dependencies

### Key decisions:
- Backend is NestJS (separate repo), not Supabase
- Auth via JWT in httpOnly cookies
- React Query for server state, Zustand for UI state only
- No Server Actions for mutations — all via API client → NestJS REST
- Remotion templates from Lidl are reference only, new components from scratch

---

## Entry 2 — 2026-04-01 | Vibe Coding Design System Tokens

**Agent:** Parent (orchestrator)
**Action:** Implemented all 7 design system JSON files as CSS variables + Tailwind v4 theme

### Files created:
- `src/styles/tokens/colors.css` — OP Blue scale (50-950), surfaces (level 0-6), button/card component colors, 5 transparency scales (white, black, neutral-300, neutral-700, op-blue-600)
- `src/styles/tokens/typography.css` — Mulish font family, display/headings/body/caption/CTA scales with sizes, line-heights, weights
- `src/styles/tokens/spacing.css` — Semantic padding/gap for button, card, field, container, navigation + utility gaps
- `src/styles/tokens/grid.css` — 12-column grid, containers (main 1376px, altern 1135px), sidebar (141px), gutters, margins
- `src/styles/tokens/motion.css` — Durations (fast 120ms → story 600ms), easings (ui, premium, editorial), semantic transitions per component, prefers-reduced-motion override
- `src/styles/tokens/borders.css` — Stroke widths (none/thin/medium/thick), border-radius scale (2px → infinite)
- `src/styles/tokens/status.css` — Status colors (approved, rejected, warning, pending, in_review, delivered, client_approved) + validation check colors

### Files modified:
- `src/styles/main.css` — Imports all 7 token files + component styles
- `src/app/globals.css` — Complete rewrite: Tailwind v4 @theme with Vibe Coding tokens, dark mode mapping to surfaces, shadcn/ui semantic variables mapped to Vibe Coding tokens, light mode alternative
- `src/app/layout.tsx` — Changed font from Geist to Mulish, dark class by default, updated metadata

### Design decisions:
- Dark mode is default (per DESIGN-SYSTEM.md: "Dark Mode First")
- `:root` = light mode (for shadcn/ui compatibility), `.dark` = Vibe Coding surfaces
- `<html className="dark">` applied in layout.tsx
- Tailwind v4 `@theme inline` maps CSS variables to utility classes (e.g., `bg-op-blue-600`)
- Platform Tokens for web UI, Brand Tokens for Remotion components (separate concern)
- All values from JSONs, nothing hardcoded

---

## Entry 3 — 2026-04-01 | Domain Folder Structure

**Agent:** Parent (orchestrator)
**Action:** Scaffolded all 9 domain directories with types, schemas, and text-maps

### Domains created (per ARCHITECTURE.md):
1. `auth/` — JWT auth, login, session. Types: AuthSession, LoginCredentials, UserRole
2. `users/` — User profiles, teams, roles. Types: UserProfile, Team, TeamMember
3. `projects/` — Video projects/campaigns. Types: Project, ProjectSettings, ProjectCollaborator
4. `assets/` — Media files management. Types: Asset, AssetFolder, UploadProgress
5. `brands/` — Brand configuration. Types: BrandConfig, BrandTokens, BrandAssets
6. `components-registry/` — Remotion component registry. Types: RegisteredComponent, ComponentPreset
7. `data-engine/` — Data import & mapping. Types: DataSource, ColumnMapping, ConditionalRule
8. `render-jobs/` — Render queue & progress. Types: RenderJob, RenderBatch, RenderProgress
9. `reviews/` — QC & client approval. Types: Review, ReviewComment, ChangeRequest

### Per domain structure:
```
domains/{domain}/
  types.ts         — Entity interfaces & type definitions
  schema.ts        — Zod validation schemas with inferred types
  text-maps.ts     — Externalized UI strings
  hooks/           — (empty, populated per feature)
  stores/          — (empty, populated per feature)
  components/      — (empty, populated per feature)
```

---

## Entry 4 — 2026-04-01 | API Client Layer

**Agent:** Parent (orchestrator)
**Action:** Created centralized API client for NestJS communication

### Files created:
- `src/lib/api/client.ts` — Axios-based API client with httpOnly cookie auth, ApiError class, request/response interceptors, 401 redirect
- `src/lib/api/error-handler.ts` — HTTP status → user-friendly message mapping (Spanish)
- `src/lib/api/endpoints.ts` — All API endpoint constants matching NestJS module structure (auth, users, projects, assets, brands, components-registry, data-engine, render-jobs, reviews)

### Dependencies added:
- `axios: ^1.7.0` — HTTP client

---

## Entry 5 — 2026-04-01 | Auth Layer

**Agent:** Parent (orchestrator)
**Action:** Created authentication infrastructure

### Files created:
- `src/lib/auth/types.ts` — UserRole (admin|designer|producer|qc|client), AuthUser, AuthState, LoginCredentials
- `src/lib/auth/auth-context.tsx` — React context for auth state, login/logout functions, auto-check on mount via /auth/me
- `src/lib/auth/role-guard.ts` — Client-side role helpers: hasRole, hasAnyRole, hasMinimumRole with role hierarchy
- `src/lib/providers.tsx` — Combined providers: QueryClientProvider + AuthProvider + Toaster
- `src/middleware.ts` — Next.js middleware for route protection (checks JWT cookie, redirects to /login)
- `.env.example` — Environment variable template

### Files modified:
- `src/app/layout.tsx` — Wrapped children with `<Providers>` component

---

## Phase 0 Progress Summary

| Deliverable | Status | Notes |
|---|---|---|
| Project documentation (.claude/) | ✅ Complete | All agents, commands, references adapted for NestJS |
| Design System in code (Vibe Coding) | ✅ Complete | 7 token files → CSS variables → Tailwind v4 theme |
| Domain structure scaffolding | ✅ Complete | 9 domains with types, schemas, text-maps |
| API client layer | ✅ Complete | Axios + interceptors + endpoints + error handler |
| Auth layer | ✅ Complete | Context, middleware, role guards |
| Providers setup | ✅ Complete | React Query + Auth + Toaster |

### What's still needed for Phase 0 completion:
- [ ] Verify project builds (`pnpm build` / `npm run build`)
- [ ] Run type-check (`tsc --noEmit`)
- [ ] Mulish font loaded correctly in browser
- [ ] Login page (basic, for auth flow testing)
- [ ] Storybook stories for design tokens (visual reference)

### Ready to start Phase 1:
Phase 1 (Motor de Componentes) can begin once build is verified. It involves creating Remotion atoms, molecules, and organisms from scratch per COMPONENT-SYSTEM.md — NOT refactoring the Lidl templates.

---

## Entry 6 — 2026-04-01 | Fix: Design Token Source of Truth in Repo

**Agent:** Parent (orchestrator)
**Action:** Fixed collaboration gap between Cowork and Claude Code

### Problem:
The 7 Vibe Coding design system JSONs were only in the external project knowledge base (accessible to Cowork), but NOT in the repository. Claude Code couldn't see them and was improvising values instead of using the real token definitions.

### Solution:
1. Copied all 7 JSONs to `src/styles/tokens/source/` — this is now the single source of truth
2. Updated CLAUDE.md to point to the exact path
3. Rewrote Rule 10 in `critical-constraints.md` to reflect the real project structure:
   - `src/styles/tokens/source/*.json` → Source of Truth (JSONs from Vibe Coding)
   - `src/styles/tokens/*.css` → Generated CSS variables from those JSONs
   - Old generic `/src/tokens/` path removed
4. Established convention: **When modifying tokens, ALWAYS read the JSON first, then update the CSS**

### Key Decision:
**Everything that is source of truth for code must live inside the repository**, not in external knowledge bases. External docs (Cowork project knowledge) are for high-level planning and context. Implementation details belong in the repo so both Cowork and Claude Code share the same reality.

---

## Entry 7 — 2026-04-01 | SDD Methodology Adopted

**Agent:** Parent (orchestrator)
**Action:** Established Specification-Driven Development as the project methodology

### Problem:
We were scaffolding infrastructure (tokens, domains, API client, auth) without formal specifications. The workflow protocol in CLAUDE.md had the right agent sequence (business-analyst → arquitecto → domain-architect → ui-designer → frontend → backend → code-reviewer) but nothing enforced that specs must exist BEFORE implementation starts.

### Solution:
Created `.claude/knowledge/sdd-methodology.md` as the formal SDD document.

### What SDD means for this project:
1. **Spec first, code second**: Every feature needs specs in `.claude/plans/` before implementation
2. **Three phases**: Specification → Implementation → Validation
3. **Agents have roles**: business-analyst, arquitecto, domain-architect, ui-designer = SPEC agents. frontend-nextjs, backend = IMPLEMENTATION agents. code-reviewer = VALIDATION agent
4. **Implementation agents must check for specs**: frontend-nextjs and backend now have "SDD CHECK" step — if no spec exists in plans, they STOP
5. **Code reviewer validates against specs**: Not just against constraints, but against the original plans

### Files modified:
- Created: `.claude/knowledge/sdd-methodology.md` — Full SDD methodology document
- Updated: `CLAUDE.md` — SDD is now listed as first critical read, workflow section shows 3 phases
- Updated: `.claude/agents/frontend-nextjs.md` — Added SDD CHECK step
- Updated: `.claude/agents/backend.md` — Added SDD CHECK step
- Updated: `.claude/agents/code-reviewer.md` — Added spec validation step
- Updated: `.claude/references/common-workflows.md` — Added SDD CHECK to standard workflow

### Impact on current work:
- What we already built (tokens, scaffolding, API client, auth) is **infrastructure/scaffolding** — this is allowed without full specs per SDD rules
- For the remaining Phase 0 items (login page, storybook stories) we should create a UI plan first
- Phase 1 onwards MUST follow SDD strictly: spec every feature before coding it

### Applies to both Cowork AND Claude Code equally.

---

## Entry 8: Component-Token Mapping Fix (Cowork)
**Date**: 2026-04-01
**Agent**: Parent (Cowork)

### Problem:
Claude Code created `src/styles/components/atoms/button.css` with hardcoded `#ff3333` (red) for `.primary-button` instead of using the Vibe Coding design tokens. The login page "Sign In" button rendered as bright red instead of OP Blue (#4361EF).

**Root cause**: No explicit documentation mapping component CSS classes → design token CSS variables. The tokens existed in `src/styles/tokens/colors.css` but Claude Code didn't know which variables to use for buttons.

### Solution:

**1. Fixed `button.css`** — Replaced all hardcoded values with token variables:
- `background: #ff3333` → `background: linear-gradient(135deg, var(--btn-principal-light), var(--btn-principal-light-medium), var(--btn-principal-medium))`
- `border-radius: 50px` → `var(--radius-infinite)`
- `transition: all 0.3s ease` → `var(--transition-btn-press)`
- Added hover, active, and disabled states using token variables
- Fixed secondary button to use `--secondary-fill-*` and `--secondary-stroke-*` variables

**2. Created reference**: `.claude/references/component-token-mapping.md`
- Complete table mapping every component property → exact CSS variable → JSON source
- Process checklist for creating component styles
- Marked as 🔴 MUST READ in CLAUDE.md Reference Library

**3. Updated Regla 10** in `critical-constraints.md`:
- Added CSS ❌ example showing prohibited hardcoded hex in component files
- Added full Component-to-Token Mapping table (button, secondary, card, surface, radius, motion)
- Added 4-step process: read JSON → check CSS vars → use var() → add if missing

**4. Updated agents**:
- `frontend-nextjs.md` — Added mandatory reference read before writing component CSS
- `ui-designer.md` — Must specify exact CSS variable names in UI plans, not hex values

### Files modified:
- `src/styles/components/atoms/button.css` — Rewritten with token variables
- `.claude/knowledge/critical-constraints.md` — Regla 10 expanded with component mapping
- `.claude/references/component-token-mapping.md` — NEW reference file
- `CLAUDE.md` — Added reference to Reference Library table
- `.claude/agents/frontend-nextjs.md` — Added token mapping rule
- `.claude/agents/ui-designer.md` — Added token mapping rule

### Lesson learned:
Design tokens in CSS files are necessary but NOT sufficient. You also need **explicit documentation mapping components → tokens** so that implementation agents know which variables to use for each component. Without this mapping, agents will invent their own values.

---

## Entry 9: Product Documentation Added to Repo (Cowork)
**Date**: 2026-04-01
**Agent**: Parent (Cowork)

### Problem:
Claude Code couldn't find the product roadmap (7 phases) because it only existed in Cowork conversations and in a subfolder of the Lidl project (`lidl-video-forge/docs/op-video-engine/`). Claude Code was inventing its own phase structure that didn't match the real roadmap.

### Solution:
Copied `docs/op-video-engine/` from Lidl project → `op-video-engine-frontend/docs/`:

**Files now in `docs/`:**
- `README.md` — Index with overview of all docs (NEW)
- `PRD-PHASES.md` — **The 7 product phases** (Phase 0–6) with deliverables and acceptance criteria
- `PROJECT-BRIEF.md` — Vision, problem, target users
- `ARCHITECTURE.md` — Technical architecture (frontend + backend + video engine)
- `COMPONENT-SYSTEM.md` — Video component taxonomy (atoms/molecules/organisms)
- `USER-STORIES.md` — User stories by role
- `COMPETITIVE-ANALYSIS.md` — Competitive landscape
- `CLAUDE-PROJECT-INSTRUCTIONS.md` — Historical reference

**Updated CLAUDE.md:**
- Added `docs/PRD-PHASES.md` as #1 in "CRITICAL - READ FIRST" section (before SDD and constraints)
- Added full Product Documentation table with all docs
- Added docs to Documentation Map ("Always Read First" + "Read When Starting a New Phase")

### Lesson learned:
**Everything that defines WHAT gets built must live in the repo.** Cowork conversations are ephemeral — if a product decision isn't in the repo, Claude Code doesn't know about it and will invent its own version. The `docs/` folder is the product source of truth, just as `src/styles/tokens/source/` is the design system source of truth.
