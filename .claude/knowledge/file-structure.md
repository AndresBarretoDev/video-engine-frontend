# File Structure Conventions - OP Video Engine Frontend

**Strict rules for file names, directory organization, and import patterns for the OP Video Engine Next.js 15 frontend.**

---

## 1. File Naming Conventions

### Components

**Rule**: `kebab-case.tsx` for all components

```
✅ CORRECT:
components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── atoms/
│   ├── icon-button.tsx
│   └── text-field.tsx
├── molecules/
│   ├── search-bar.tsx
│   └── user-avatar.tsx
└── organisms/
    ├── navigation-menu.tsx
    └── data-table.tsx

❌ INCORRECT:
- Button.tsx          # PascalCase not allowed
- iconButton.tsx      # camelCase not allowed
- icon_button.tsx     # snake_case not allowed
```

**Domain components**:

```
domains/
├── auth/
│   └── components/
│       ├── atoms/
│       │   └── auth-button.tsx       # Optional domain prefix
│       └── molecules/
│           └── login-form.tsx        # Descriptive purpose name
└── users/
    └── components/
        └── organisms/
            └── user-profile-card.tsx
```

---

### Pages (Next.js App Router)

**Rule**: Follow Next.js conventions - always `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

```
✅ CORRECT:
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout
├── loading.tsx                 # Root loading
├── error.tsx                   # Root error
├── dashboard/
│   ├── page.tsx               # /dashboard
│   ├── layout.tsx             # Dashboard layout
│   ├── loading.tsx            # Dashboard loading
│   └── settings/
│       └── page.tsx           # /dashboard/settings
└── api/
    └── users/
        └── route.ts           # API route handler

❌ INCORRECT:
- Dashboard.tsx        # Don't use custom names for pages
- dashboard-page.tsx   # Next.js requires page.tsx
- index.tsx           # Next.js 13+ uses page.tsx
```

---

### Hooks

**Rule**: `use-{name}.ts` in kebab-case, always prefix with `use`

```
✅ CORRECT:
domains/auth/hooks/
├── use-auth.ts                 # Authentication hook
├── use-login.ts                # Specific login hook
└── use-session-check.ts        # Session verification hook

domains/users/hooks/
├── use-user-profile.ts
├── use-user-permissions.ts
└── use-debounced-search.ts

❌ INCORRECT:
- auth.ts                # Missing "use" prefix
- useAuth.ts             # camelCase not allowed
- use_auth.ts            # snake_case not allowed
- authHook.ts            # "Hook" suffix redundant
```

---

### React Query Hooks (Mutations & Queries)

**Rule**: `use-{name}.ts` for query hooks, `use-create-{name}.ts` or `use-update-{name}.ts` for mutations

```
✅ CORRECT:
domains/projects/hooks/
├── use-projects.ts             # useQuery hook for fetching projects
├── use-project-by-id.ts        # useQuery for single project
├── use-create-project.ts       # useMutation for creating
└── use-update-project.ts       # useMutation for updating

domains/render-jobs/hooks/
├── use-render-jobs.ts          # Query hook
├── use-submit-render-job.ts    # Mutation hook
└── use-render-job-status.ts    # Query with polling

❌ INCORRECT:
- projectsQuery.ts       # camelCase not allowed
- projects.ts            # Missing descriptive prefix
- getProjects.ts         # Use "use" prefix always
- createProjectAction.ts # Not a Server Action - no actions.ts in this project
```

**Note**: NO `actions.ts` files - all mutations go through React Query hooks that call the API client

---

### Stores (Zustand)

**Rule**: `{name}-store.ts` in kebab-case, always suffix with `-store`

```
✅ CORRECT:
domains/auth/stores/
└── auth-store.ts               # export const useAuthStore

domains/users/stores/
├── user-store.ts               # User state
└── user-filters-store.ts       # Filters state

❌ INCORRECT:
- authStore.ts           # camelCase not allowed
- auth.ts                # Missing "-store" suffix
- useAuthStore.ts        # Don't use "use" in file name
- store.ts               # Too generic
```

---

### Schemas and Validations (Zod/Yup)

**Rule**: `schema.ts` or `{name}-schema.ts` in kebab-case

```
✅ CORRECT:
domains/auth/
├── schema.ts                   # All auth schemas
└── validation.ts               # Custom validations

# If many schemas:
domains/users/
├── user-schema.ts
├── user-profile-schema.ts
└── user-settings-schema.ts

❌ INCORRECT:
- authSchema.ts          # camelCase not allowed
- schemas.ts             # Plural confusing
- validations.ts         # Plural confusing
```

---

### Utilities

**Rule**: `{name}.ts` in kebab-case, descriptive names of main function

```
✅ CORRECT:
utils/
├── format-date.ts              # export function formatDate()
├── validate-email.ts           # export function validateEmail()
├── debounce.ts                 # export function debounce()
└── class-names.ts              # export function cn()

❌ INCORRECT:
- formatDate.ts          # camelCase not allowed
- dateUtils.ts           # "Utils" suffix redundant
- helpers.ts             # Too generic
- utils.ts               # Too generic
```

---

### Types

**Rule**: `types.ts` or `{name}.types.ts` in kebab-case

```
✅ CORRECT:
domains/auth/
└── types.ts                    # All auth types

# If many types:
domains/users/
├── user.types.ts
├── user-profile.types.ts
└── user-permissions.types.ts

# Global types:
lib/
└── types.ts                    # Shared types

❌ INCORRECT:
- authTypes.ts           # camelCase not allowed
- auth.d.ts              # Use .types.ts instead of .d.ts for local types
- interfaces.ts          # Use "types" instead
```

---

### Styles (CSS)

**Rule**: Same name as component or category, with `.css` extension

```
✅ CORRECT:
styles/
├── main.css                    # Global styles
├── components/
│   ├── atoms/
│   │   ├── button.css         # Matches button.tsx
│   │   └── input.css          # Matches input.tsx
│   └── molecules/
│       └── search-bar.css
└── domains/
    └── auth/
        └── login-form.css

❌ INCORRECT:
- Button.css             # PascalCase not allowed
- buttonStyles.css       # Redundant suffix
- button-component.css   # Redundant suffix
```

---

### Tests

**Rule**: `{name}.test.ts` or `{name}.spec.ts` in kebab-case, same name as tested file

```
✅ CORRECT:
components/ui/
├── button.tsx
└── button.test.tsx             # Test next to component

# Or in __tests__ folder:
domains/auth/
├── actions.ts
└── __tests__/
    └── actions.test.ts

utils/
├── format-date.ts
└── format-date.test.ts

❌ INCORRECT:
- buttonTest.tsx         # camelCase not allowed
- button.spec.js         # Use .ts or .tsx
- test-button.tsx        # Prefix not recommended
- Button.test.tsx        # PascalCase not allowed
```

---

### Configuration

**Rule**: `kebab-case.config.ts` or tool-specific names

```
✅ CORRECT:
/
├── next.config.js              # Required by Next.js
├── tailwind.config.ts          # Required by Tailwind
├── tsconfig.json               # Required by TypeScript
└── .storybook/
    ├── main.ts                 # Required by Storybook
    └── preview.ts

❌ INCORRECT:
- nextConfig.js          # camelCase not allowed (unless tool requires it)
- config.ts              # Too generic
```

---

## 2. Directory Structure

### Strategy: Screaming Architecture + Atomic Design + Domain-Driven (Video Engine)

**Principle**: Structure should scream the project's purpose (video generation platform), not the tools it uses.

```
src/
├── app/                        # [Next.js App Router] Routes and pages
│   ├── (auth)/                # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── logout/
│   │       └── page.tsx
│   ├── dashboard/             # Main dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── projects/              # Video projects
│   │   ├── page.tsx           # /projects (list)
│   │   ├── [id]/
│   │   │   ├── page.tsx       # /projects/[id] (detail)
│   │   │   ├── edit/
│   │   │   │   └── page.tsx   # /projects/[id]/edit
│   │   │   └── render/
│   │   │       └── page.tsx   # /projects/[id]/render
│   │   └── new/
│   │       └── page.tsx       # /projects/new
│   ├── templates/             # Template browser
│   │   └── page.tsx
│   ├── render-jobs/           # Render queue & history
│   │   ├── page.tsx
│   │   └── [jobId]/
│   │       └── page.tsx
│   ├── api/                   # API routes (if any)
│   │   └── health/
│   │       └── route.ts       # Health check endpoint
│   ├── error.tsx              # Global error page
│   ├── loading.tsx            # Global loading
│   └── layout.tsx             # Root layout
│
├── remotion/                   # [REMOTION] Video composition registry
│   ├── index.tsx              # Composition registry (exports all templates)
│   │
│   ├── templates/             # Video templates (organisms/full compositions)
│   │   ├── fruit-veg-template.tsx        # Fruit & Vegetable video template
│   │   ├── prepared-food-template.tsx    # Prepared food video template
│   │   ├── garden-template.tsx           # Garden/Outdoor product template
│   │   ├── promo-video-template.tsx      # Generic promo video template
│   │   └── template.types.ts             # Shared template prop types
│   │
│   ├── components/            # Reusable video atoms & molecules
│   │   ├── atoms/
│   │   │   ├── text-block.tsx            # Text element with formatting
│   │   │   ├── price-patch.tsx           # Price display component
│   │   │   ├── logo-reveal.tsx           # Logo animation
│   │   │   ├── image-frame.tsx           # Product image frame
│   │   │   ├── countdown-timer.tsx       # Timer animation
│   │   │   └── gradient-background.tsx   # Animated gradient
│   │   │
│   │   └── molecules/
│   │       ├── cortinilla-entrada.tsx    # Opening curtain/intro animation
│   │       ├── cortinilla-cierre.tsx     # Closing curtain/outro animation
│   │       ├── product-overlay.tsx       # Product + price overlay
│   │       ├── brand-header.tsx          # Brand logo + intro section
│   │       └── product-slideshow.tsx     # Multi-product carousel
│   │
│   └── schemas/               # Zod schemas for template props
│       └── template-schemas.ts # Validation for all template inputs
│
├── domains/                    # [BUSINESS LOGIC] By video engine domain
│   │
│   ├── auth/                  # JWT Authentication
│   │   ├── components/
│   │   │   └── molecules/
│   │   │       └── login-form.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts         # Auth context hook
│   │   │   └── use-auth-check.ts   # Protected route hook
│   │   ├── stores/
│   │   │   └── auth-store.ts       # Auth state (UI state only)
│   │   ├── schema.ts               # Login/registration schemas
│   │   ├── types.ts                # User, JWT, AuthContext types
│   │   └── text-maps.ts            # Auth-related strings
│   │
│   ├── users/                 # User management
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   └── user-avatar.tsx
│   │   │   └── molecules/
│   │   │       └── user-profile-card.tsx
│   │   ├── hooks/
│   │   │   ├── use-user-profile.ts      # useQuery
│   │   │   └── use-update-profile.ts    # useMutation
│   │   ├── stores/
│   │   │   └── user-store.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   ├── projects/              # Video project management
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   └── project-card.tsx
│   │   │   ├── molecules/
│   │   │   │   ├── project-form.tsx
│   │   │   │   └── project-filters.tsx
│   │   │   └── organisms/
│   │   │       ├── projects-list.tsx
│   │   │       └── project-editor.tsx
│   │   ├── hooks/
│   │   │   ├── use-projects.ts          # Fetch all projects
│   │   │   ├── use-project-by-id.ts     # Fetch single project
│   │   │   ├── use-create-project.ts    # Create project
│   │   │   ├── use-update-project.ts    # Update project
│   │   │   └── use-delete-project.ts    # Delete project
│   │   ├── stores/
│   │   │   ├── projects-store.ts        # List UI state
│   │   │   └── project-editor-store.ts  # Editor UI state
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   ├── assets/                # Asset management (images, videos, fonts, audio)
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   └── asset-thumbnail.tsx
│   │   │   └── molecules/
│   │   │       └── asset-uploader.tsx
│   │   ├── hooks/
│   │   │   ├── use-assets.ts           # Fetch assets
│   │   │   ├── use-upload-asset.ts     # Upload asset mutation
│   │   │   └── use-delete-asset.ts     # Delete asset
│   │   ├── stores/
│   │   │   └── assets-store.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   ├── brands/                # Brand configuration & tokens
│   │   ├── components/
│   │   │   └── molecules/
│   │   │       └── brand-editor.tsx
│   │   ├── hooks/
│   │   │   ├── use-brands.ts
│   │   │   ├── use-brand-by-id.ts
│   │   │   └── use-update-brand.ts
│   │   ├── stores/
│   │   │   └── brands-store.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   ├── templates/             # Remotion template registry & management
│   │   ├── components/
│   │   │   ├── molecules/
│   │   │   │   └── template-card.tsx
│   │   │   └── organisms/
│   │   │       └── template-browser.tsx
│   │   ├── hooks/
│   │   │   └── use-available-templates.ts # List available Remotion templates
│   │   ├── stores/
│   │   │   └── templates-store.ts
│   │   ├── types.ts
│   │   └── text-maps.ts
│   │
│   ├── render-jobs/           # Rendering queue and status tracking
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   └── job-status-badge.tsx
│   │   │   ├── molecules/
│   │   │   │   └── job-progress-bar.tsx
│   │   │   └── organisms/
│   │   │       ├── render-queue.tsx
│   │   │       └── job-detail.tsx
│   │   ├── hooks/
│   │   │   ├── use-render-jobs.ts       # Fetch jobs
│   │   │   ├── use-submit-render.ts     # Submit render job
│   │   │   ├── use-render-job-status.ts # Poll job status
│   │   │   └── use-cancel-job.ts        # Cancel render job
│   │   ├── stores/
│   │   │   └── render-jobs-store.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   ├── reviews/               # QC workflow & approvals
│   │   ├── components/
│   │   │   ├── molecules/
│   │   │   │   └── review-form.tsx
│   │   │   └── organisms/
│   │   │       └── review-queue.tsx
│   │   ├── hooks/
│   │   │   ├── use-reviews.ts
│   │   │   ├── use-submit-review.ts
│   │   │   └── use-approve-video.ts
│   │   ├── stores/
│   │   │   └── reviews-store.ts
│   │   ├── types.ts
│   │   ├── schema.ts
│   │   └── text-maps.ts
│   │
│   └── data-engine/           # CSV/Sheets data mapping and import
│       ├── components/
│       │   ├── molecules/
│       │   │   └── data-mapper.tsx
│       │   └── organisms/
│       │       └── csv-importer.tsx
│       ├── hooks/
│       │   ├── use-import-csv.ts
│       │   └── use-map-data.ts
│       ├── stores/
│       │   └── data-mapping-store.ts
│       ├── types.ts
│       ├── schema.ts
│       └── text-maps.ts
│
├── components/                 # [UI] Global reusable components (cross-domain)
│   ├── ui/                    # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── tabs.tsx
│   │   └── ...other shadcn components
│   │
│   ├── shared/                # Cross-domain reusable components
│   │   ├── atoms/
│   │   │   ├── icon-button.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   └── empty-state.tsx
│   │   │
│   │   ├── molecules/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   └── search-bar.tsx
│   │   │
│   │   └── organisms/
│   │       ├── main-layout.tsx
│   │       ├── sidebar.tsx
│   │       ├── top-nav.tsx
│   │       └── footer.tsx
│
├── lib/                        # [INFRA] Infrastructure & configuration
│   ├── api/                   # NestJS API client layer
│   │   ├── client.ts          # Centralized fetch wrapper with interceptors
│   │   ├── interceptors.ts    # JWT token injection, error handling
│   │   └── endpoints.ts       # API endpoint constants
│   │
│   ├── auth/                  # JWT authentication helpers
│   │   ├── auth-context.tsx   # AuthProvider + useAuth hook
│   │   ├── auth-guard.tsx     # Route protection component
│   │   ├── token-utils.ts     # JWT decode, role check, expiry
│   │   └── protected-route.tsx # Wrapper for protected pages
│   │
│   ├── config/                # Environment & configuration
│   │   └── env.ts             # Validated environment variables
│   │
│   ├── utils.ts               # Shared utilities (cn, formatters, etc.)
│   └── types.ts               # Global shared types
│
├── config/                     # [CONFIG] Global configuration
│   ├── site-config.ts         # Site metadata, navigation, constants
│   └── text-maps.ts           # Global UI strings (if any)
│
├── styles/                     # [STYLES] CSS styles
│   ├── globals.css            # Global reset, base styles, Tailwind directives
│   ├── components/            # Component-specific CSS
│   │   ├── atoms/
│   │   │   ├── button.css
│   │   │   └── input.css
│   │   ├── molecules/
│   │   └── organisms/
│   ├── domains/               # Domain-specific styles (if needed)
│   │   ├── projects/
│   │   └── render-jobs/
│   └── utils/                 # CSS utilities, mixins, animations
│       ├── media.css
│       └── animations.css
│
├── utils/                      # [UTILS] Pure shared functions
│   ├── format-date.ts
│   ├── format-duration.ts
│   ├── format-file-size.ts
│   ├── validate-email.ts
│   ├── debounce.ts
│   ├── class-names.ts         # cn() utility
│   └── video-helpers.ts       # Video-specific utilities
│
└── stories/                    # [STORYBOOK] Component documentation (optional)
    ├── components/
    │   ├── button.stories.tsx
    │   └── input.stories.tsx
    └── domains/
        └── projects/
            └── project-card.stories.tsx
```

---

### Location Rules

#### Where does each file type go?

| File type                              | Location                                | Example                                                    |
| -------------------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| **Reusable UI component**              | `/components/shared/{atomic-level}/`    | `/components/shared/atoms/icon-button.tsx`                 |
| **shadcn/ui component**                | `/components/ui/`                       | `/components/ui/button.tsx`                                |
| **Domain-specific component**          | `/domains/{domain}/components/`         | `/domains/projects/components/molecules/project-form.tsx`  |
| **Global reusable hook**               | `/domains/{domain}/hooks/`              | `/domains/auth/hooks/use-auth.ts`                          |
| **Domain React Query hook (useQuery)** | `/domains/{domain}/hooks/`              | `/domains/projects/hooks/use-projects.ts`                  |
| **Domain mutation hook (useMutation)** | `/domains/{domain}/hooks/`              | `/domains/projects/hooks/use-create-project.ts`            |
| **Store (Zustand - UI state only)**    | `/domains/{domain}/stores/`             | `/domains/projects/stores/projects-store.ts`               |
| **Validation schema (Zod)**            | `/domains/{domain}/schema.ts`           | `/domains/projects/schema.ts`                              |
| **Domain types**                       | `/domains/{domain}/types.ts`            | `/domains/projects/types.ts`                               |
| **Domain strings/text-maps**           | `/domains/{domain}/text-maps.ts`        | `/domains/projects/text-maps.ts`                           |
| **Global types**                       | `/lib/types.ts`                         | `/lib/types.ts`                                            |
| **API client code**                    | `/lib/api/`                             | `/lib/api/client.ts`, `/lib/api/endpoints.ts`              |
| **Auth helpers**                       | `/lib/auth/`                            | `/lib/auth/token-utils.ts`, `/lib/auth/auth-context.tsx`   |
| **Environment config**                 | `/lib/config/env.ts`                    | `/lib/config/env.ts`                                       |
| **Pure utility function**              | `/utils/`                               | `/utils/format-date.ts`, `/utils/video-helpers.ts`         |
| **Global configuration**               | `/config/`                              | `/config/site-config.ts`                                   |
| **Global styles**                      | `/styles/`                              | `/styles/globals.css`, `/styles/components/atoms/...`      |
| **Domain-specific styles**             | `/styles/domains/{domain}/`             | `/styles/domains/projects/project-editor.css`              |
| **Remotion template**                  | `/remotion/templates/`                  | `/remotion/templates/fruit-veg-template.tsx`               |
| **Remotion component (atom/molecule)** | `/remotion/components/`                 | `/remotion/components/atoms/text-block.tsx`                |
| **Remotion schema**                    | `/remotion/schemas/`                    | `/remotion/schemas/template-schemas.ts`                    |
| **Tests**                              | Next to file or `__tests__/`            | `/components/ui/button.test.tsx`                           |
| **Stories**                            | `/stories/` mirroring structure         | `/stories/components/button.stories.tsx`                   |

---

### Grouping Strategy: By Feature (Domain) first, then by type

✅ **CORRECT - Group by domain**:

```
domains/projects/
├── components/
│   ├── atoms/
│   │   └── project-card.tsx
│   ├── molecules/
│   │   ├── project-form.tsx
│   │   └── project-filters.tsx
│   └── organisms/
│       └── projects-list.tsx
├── hooks/
│   ├── use-projects.ts
│   ├── use-project-by-id.ts
│   ├── use-create-project.ts
│   └── use-update-project.ts
├── stores/
│   └── projects-store.ts
├── schema.ts                   # Zod schemas
├── types.ts                    # TypeScript types
└── text-maps.ts                # UI strings
```

❌ **INCORRECT - Group by type (scattered)**:

```
components/
├── ProjectCard.tsx
├── ProjectForm.tsx
└── ProjectsList.tsx
hooks/
├── useProjects.ts
└── useUpdateProject.ts
stores/
└── projectsStore.ts
types/
├── projects.types.ts
# Hard to find everything related to "projects"
```

---

### Remotion Video Template Structure

Remotion templates are organized as **organisms** (complete compositions) containing **video atoms** and **molecules**.

✅ **CORRECT - Remotion organization**:

```
remotion/
├── index.tsx                         # Composition registry
├── templates/
│   ├── fruit-veg-template.tsx       # Complete template composition
│   ├── prepared-food-template.tsx
│   ├── garden-template.tsx
│   └── promo-video-template.tsx
├── components/
│   ├── atoms/
│   │   ├── text-block.tsx           # <TextBlock duration={3} text="..." />
│   │   ├── price-patch.tsx          # <PricePatch price={9.99} />
│   │   ├── image-frame.tsx          # <ImageFrame src={...} />
│   │   └── countdown-timer.tsx
│   └── molecules/
│       ├── cortinilla-entrada.tsx   # Opening sequence
│       ├── cortinilla-cierre.tsx    # Closing sequence
│       ├── product-overlay.tsx      # Product + price composite
│       └── brand-header.tsx
└── schemas/
    └── template-schemas.ts          # Zod schemas for all template props
```

**Usage in templates**:

```tsx
// remotion/templates/fruit-veg-template.tsx
import { useVideoConfig } from 'remotion';
import { TextBlock } from '../components/atoms/text-block';
import { PricePatch } from '../components/atoms/price-patch';
import { CortinillaEntrada } from '../components/molecules/cortinilla-entrada';

export const FruitVegTemplate: React.FC<FruitVegTemplateProps> = ({ productName, price, image }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CortinillaEntrada />
      <TextBlock from={30} duration={120} text={productName} />
      <PricePatch price={price} />
      {/* ... */}
    </div>
  );
};
```

---

## 3. Import Patterns

### Absolute vs Relative Imports

**Rule**: ALWAYS use absolute imports with `@/` alias

```tsx
// tsconfig.json configuration:
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

✅ **CORRECT - Absolute imports**:

```tsx
// domains/projects/components/organisms/projects-list.tsx
import { Button } from '@/components/ui/button';
import { useProjects } from '@/domains/projects/hooks/use-projects';
import { projectsStore } from '@/domains/projects/stores/projects-store';
import { formatDate } from '@/utils/format-date';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/domains/projects/types';
```

❌ **INCORRECT - Relative imports**:

```tsx
import { Button } from '../../../../components/ui/button';
import { useProjects } from '../../../hooks/use-projects';
import { apiClient } from '../../../lib/api/client';
// Hard to maintain and refactor
```

**Relative imports allowed**: Within same domain, for same-level files

```tsx
// domains/projects/components/molecules/project-form.tsx
import { ProjectCard } from '../atoms/project-card'; // ✅ Same domain/level
import { useUpdateProject } from '../../hooks/use-update-project'; // ✅ Parent domain
```

---

### API Client Usage (NestJS Backend)

**Rule**: All data fetching goes through `/lib/api/client`, mutations through React Query hooks

✅ **CORRECT - Using API client**:

```tsx
// domains/projects/hooks/use-projects.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Project } from '@/domains/projects/types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      return apiClient.get<Project[]>('/projects');
    },
  });
}
```

```tsx
// domains/projects/hooks/use-create-project.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { createProjectSchema } from '@/domains/projects/schema';
import type { Project } from '@/domains/projects/types';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const validated = createProjectSchema.parse(data);
      return apiClient.post<Project>('/projects', validated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

❌ **INCORRECT - Direct fetch in components**:

```tsx
// ❌ Don't do this
const [projects, setProjects] = useState([]);

useEffect(() => {
  fetch('/api/projects') // ❌ Wrong - should be HTTP call via apiClient
    .then(r => r.json())
    .then(setProjects);
}, []);
```

❌ **INCORRECT - No Server Actions (this is not a Supabase project)**:

```tsx
// ❌ No actions.ts in domains
// This is a separate NestJS backend - communicate via API client
export async function updateProject(data) {
  // ❌ Server Actions not used in this project
}
```

---

### Import Ordering

**Rule**: Order imports in the following order with blank line between groups

```tsx
// 1. React and framework imports
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External library imports
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { create } from 'zustand';

// 3. Global UI component imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/shared/atoms/skeleton';

// 4. Auth imports (if not in current domain)
import { useAuth } from '@/domains/auth/hooks/use-auth';

// 5. Other domain imports
import { useTemplates } from '@/domains/templates/hooks/use-templates';

// 6. Current domain imports (if applicable)
import { useProjects } from '@/domains/projects/hooks/use-projects';
import { projectsStore } from '@/domains/projects/stores/projects-store';
import { ProjectCard } from '@/domains/projects/components/atoms/project-card';

// 7. API and lib imports
import { apiClient } from '@/lib/api/client';
import { formatDate } from '@/utils/format-date';
import { cn } from '@/lib/utils';

// 8. Type imports
import type { Project } from '@/domains/projects/types';

// 9. Style imports
import '@/styles/domains/projects/projects-list.css';
```

**Within each group**: Sort alphabetically

**For Remotion components**:

```tsx
// Remotion compositions have same ordering
// remotion/templates/fruit-veg-template.tsx

import { useVideoConfig } from 'remotion';
import type { FC } from 'react';

import { CortinillaEntrada } from '../components/molecules/cortinilla-entrada';
import { TextBlock } from '../components/atoms/text-block';
import { PricePatch } from '../components/atoms/price-patch';
import { fruitVegSchema } from '../schemas/template-schemas';

import type { FruitVegTemplateProps } from '../templates/template.types';
```

---

### Barrel Files (index.ts)

❌ **NEVER use barrel files for re-exports in component/hook/store directories**:

```tsx
// ❌ components/ui/index.ts - DON'T DO THIS
export { Button } from './button';
export { Input } from './input';
export { Dialog } from './dialog';
// Problems: tree-shaking, circular dependencies, complexity
```

✅ **ALWAYS import directly**:

```tsx
// ✅ Direct import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
```

**Allowed exceptions**:
- `page.tsx`, `layout.tsx`, `route.ts` in Next.js (required by framework)
- `remotion/index.tsx` for Remotion composition registry (required by Remotion)

**Remotion composition registry** (REQUIRED):

```tsx
// remotion/index.tsx - MUST export all templates
export { FruitVegTemplate } from './templates/fruit-veg-template';
export { PreparedFoodTemplate } from './templates/prepared-food-template';
export { GardenTemplate } from './templates/garden-template';
export { PromoVideoTemplate } from './templates/promo-video-template';

export const COMPOSITIONS = [
  {
    id: 'fruit-veg-template',
    component: FruitVegTemplate,
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  // ... more templates
];
```

---

### Type Imports

**Rule**: Use `type` keyword for type imports (TypeScript 3.8+)

```tsx
✅ CORRECT:
import type { Project } from '@/domains/projects/types';
import type { ReactNode } from 'react';

// For mixed imports:
import { useProjects } from '@/domains/projects/hooks/use-projects';
import type { Project } from '@/domains/projects/types';

✅ ALSO CORRECT - Multiple types:
import type { Project, ProjectStatus, ProjectTag } from '@/domains/projects/types';

❌ INCORRECT:
import { Project } from '@/domains/projects/types';  // Without "type"
import { type Project, type ProjectStatus } from '@/domains/projects/types';  // Don't use inline
```

---

### Remotion Component Imports

**Rule**: Import Remotion atoms/molecules specifically, never use barrel files

```tsx
✅ CORRECT:
import { TextBlock } from '../components/atoms/text-block';
import { PricePatch } from '../components/atoms/price-patch';
import { CortinillaEntrada } from '../components/molecules/cortinilla-entrada';

❌ INCORRECT:
import { TextBlock, PricePatch } from '../components/atoms'; // No barrel file
```

---

### Dynamic Imports

**Rule**: Use for code-splitting of heavy components only

```tsx
✅ CORRECT - For heavy video editor or complex components:
import dynamic from 'next/dynamic';

const ProjectEditor = dynamic(
  () => import('@/domains/projects/components/organisms/project-editor'),
  {
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false  // Heavy editor shouldn't be SSR'd
  }
);

// Usage in page:
<Suspense fallback={<Skeleton />}>
  <ProjectEditor projectId={id} />
</Suspense>

❌ INCORRECT - For lightweight components:
const Button = dynamic(() => import('@/components/ui/button'));
// Makes no sense for small components - use direct import
```

---

## 4. API Client Integration (NestJS Backend)

### API Client Structure

All communication with the NestJS backend goes through `/lib/api/client.ts`:

```tsx
// lib/api/client.ts
import { getAuthToken } from './auth/token-utils';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

export const apiClient = {
  async get<T>(endpoint: string) {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  async post<T>(endpoint: string, data: unknown) {
    const token = getAuthToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  },

  // ... patch, put, delete methods
};
```

### API Endpoints Organization

```tsx
// lib/api/endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  PROJECTS: {
    LIST: '/projects',
    GET: (id: string) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  RENDER_JOBS: {
    LIST: '/render-jobs',
    GET: (id: string) => `/render-jobs/${id}`,
    SUBMIT: '/render-jobs/submit',
    CANCEL: (id: string) => `/render-jobs/${id}/cancel`,
  },
  ASSETS: {
    LIST: '/assets',
    UPLOAD: '/assets/upload',
    DELETE: (id: string) => `/assets/${id}`,
  },
};
```

### JWT Authentication

```tsx
// lib/auth/token-utils.ts
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function saveAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
```

### React Query Integration

All data fetching uses React Query (TanStack Query):

```tsx
// domains/projects/hooks/use-projects.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Project } from '../types';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

```tsx
// domains/projects/hooks/use-create-project.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { createProjectSchema } from '../schema';
import type { Project } from '../types';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: unknown) => {
      const validated = createProjectSchema.parse(input);
      return apiClient.post<Project>(
        API_ENDPOINTS.PROJECTS.CREATE,
        validated
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
```

---

## 5. Key Architecture Principles for OP Video Engine

### No Server Actions (NestJS Backend)

This is NOT a Supabase + Server Actions project. All backend communication goes through:

1. **React Query hooks** (useQuery, useMutation)
2. **API client** in `/lib/api/client.ts`
3. **NestJS backend** (separate repository)

There is NO `actions.ts` in domains.

### Remotion Video Templates

Remotion compositions (videos) are organized as:

- **Templates**: Full video compositions in `/remotion/templates/`
- **Components**: Reusable video atoms/molecules in `/remotion/components/`
- **Schemas**: Zod validation for template props in `/remotion/schemas/`
- **Registry**: All templates exported from `/remotion/index.tsx`

### Domain-Driven Structure

Each business domain has:

```
domains/{domain}/
├── components/     # UI components (atoms, molecules, organisms)
├── hooks/          # React Query hooks (useQuery, useMutation)
├── stores/         # Zustand stores (UI state ONLY, never server state)
├── types.ts        # TypeScript types (mirror backend DTOs)
├── schema.ts       # Zod validation schemas
└── text-maps.ts    # Externalized UI strings
```

### Video Engine Domains

The OP Video Engine frontend has these specific domains:

- **auth**: JWT authentication, login/logout
- **users**: User profiles and permissions
- **projects**: Video project management (CRUD)
- **templates**: Available Remotion templates
- **assets**: Images, videos, audio, fonts library
- **brands**: Brand configuration and design tokens
- **render-jobs**: Render queue, job status, history
- **reviews**: QC workflow and video approvals
- **data-engine**: CSV/Sheets data mapping

### Naming Summary

| Item | Format | Example |
|------|--------|---------|
| Components | `kebab-case.tsx` | `project-card.tsx` |
| Hooks | `use-{name}.ts` | `use-projects.ts` |
| Mutations | `use-{verb}-{noun}.ts` | `use-create-project.ts` |
| Stores | `{name}-store.ts` | `projects-store.ts` |
| Schemas | `schema.ts` or `{name}-schema.ts` | `schema.ts` |
| Types | `types.ts` | `types.ts` |
| Text maps | `text-maps.ts` | `text-maps.ts` |
| Utils | `{name}.ts` | `format-date.ts` |
| API endpoints | `endpoints.ts` | (global `/lib/api/`) |
| API client | `client.ts` | (global `/lib/api/`) |

### Import Aliases

Always use absolute imports with `@/`:

```tsx
import { Button } from '@/components/ui/button';
import { useProjects } from '@/domains/projects/hooks/use-projects';
import { apiClient } from '@/lib/api/client';
```

No relative imports except within same domain for same-level files.
```
