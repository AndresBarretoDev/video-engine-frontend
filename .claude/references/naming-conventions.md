# Naming Conventions

**Full details**: `.claude/knowledge/file-structure.md`

---

## Archivos

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Componentes | `kebab-case.tsx` | `user-card.tsx` |
| Hooks | `use-kebab-case.ts` | `use-user.ts` |
| Utils | `kebab-case.ts` | `format-date.ts` |
| Constants | `kebab-case.ts` | `api-config.ts` |
| Text Maps | `text-maps.ts` (en dominio) | `domains/users/text-maps.ts` |
| Types | `types.ts` (en dominio) o `/types/` | `domains/users/types.ts` |
| Server Actions | `actions.ts` (en dominio) | `domains/users/actions.ts` |
| Schemas | `schema.ts` (en dominio) | `domains/users/schema.ts` |
| Stores | `{feature}-store.ts` | `ui-store.ts` |
| Pages | `page.tsx` | `app/posts/page.tsx` |

## Variables y Funciones

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Funciones | camelCase | `formatDate()`, `fetchUser()` |
| Componentes React | PascalCase | `UserCard`, `FormField` |
| Constants | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| Boolean vars | is/has/should prefix | `isLoading`, `hasError`, `shouldRedirect` |
| Event handlers | handle prefix | `handleSubmit`, `handleClick` |
| Types/Interfaces | PascalCase | `UserProps`, `ApiResponse` |

## Directorios

- Todo en **kebab-case**: `user-settings/`, `post-comments/`

## Imports (Siempre `@/`)

```typescript
// ✅
import { Button } from '@/components/ui/button';
import { useAuth } from '@/domains/auth/hooks/use-auth';
import type { User } from '@/domains/users/types';

// ❌
import { Button } from '../../../components/ui/button';
```

## Exports

- **Named exports** siempre: `export function UserCard() {}`
- **Excepción**: `page.tsx` y `layout.tsx` (Next.js requiere default)
