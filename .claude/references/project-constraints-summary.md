# Project Constraints - Quick Lookup

**Full details**: `.claude/knowledge/critical-constraints.md`

---

## 10 Reglas No-Negociables

| # | Regla | Correcto | Incorrecto |
|---|-------|----------|------------|
| 1 | Componentes reutilizables | 2+ usos → extraer a `/components/shared/` | Duplicar patrones UI |
| 2 | Separación de concerns | Logic→`/utils/`, data→`/constants/`, types→`/types/` | Mezclar en un archivo |
| 3 | Types externos | En `/types/` o `domains/{d}/types.ts` | Interfaces dentro de componentes |
| 4 | Pages ultra-limpias | Solo composición + Suspense | Business logic en pages |
| 5 | MCPs automáticos | Usar shadcn MCP sin preguntar | Preguntar al usuario |
| 6 | Mobile-first | `w-full md:w-1/2 lg:w-1/3` | `lg:w-1/3 md:w-1/2 w-full` |
| 7 | Server Components default | Client solo con useState/useEffect/onClick | `"use client"` por defecto |
| 8 | Naming conventions | kebab-case archivos, PascalCase componentes | Inconsistencia |
| 9 | Imports absolutos | `@/components/ui/button` | `../../components/ui/button` |
| 10 | Auth + Guards | JWT middleware + role checks + permissions | No token validation, UI-only auth |

## Tech Stack (No-Negociable)

- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix)
- **Backend**: NestJS (separate repo) + PostgreSQL + Prisma
- **API Client**: Centralized HTTP client (axios) in `/src/lib/api/`
- **Data Fetching**: React Query (`@tanstack/react-query`) with custom hooks
- **Authentication**: JWT in httpOnly cookies (Passport.js)
- **Server State**: React Query (`@tanstack/react-query`)
- **UI State**: Zustand (solo UI, nunca datos del servidor)
- **Forms**: React Hook Form + Zod (complejos), basic inputs (simples)
- **Validation**: Zod para todo
- **Video**: Remotion (render templates), Remotion Player (preview)
- **Design Tokens**: Vibe Coding tokens (colors, spacing, typography)
- **Package Manager**: npm

## State Management Decision Matrix

| Tipo | Herramienta | Ejemplo |
|------|-------------|---------|
| Server state | React Query | Projects, render jobs, assets |
| UI state | Zustand | Sidebar abierto, theme, filters |
| Local state | useState | Input de búsqueda, modal abierto |
| Forms complejos | React Hook Form + Zod | Project creation, settings |

## Security Layers (Obligatorio)

1. **Middleware** → Intercepta rutas protegidas, valida JWT
2. **API Client** → JWT en httpOnly cookie, request/response handling
3. **Auth Context** → Role-based UI rendering, permission checks
4. **Backend Validation** → JWT verification, RLS, authorization guards
