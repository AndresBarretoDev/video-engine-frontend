# Architecture Patterns

**Complete definition of architecture, layers, dependencies, and project patterns for OP Video Engine Frontend.**

---

## 1. Architecture Choice

### Architectural Pattern: Screaming Architecture + Atomic Design

**Screaming Architecture** (proposed by Robert C. Martin) is an approach where the project structure "screams" its business purpose, not the tools or frameworks it uses.

**Atomic Design** (proposed by Brad Frost) is a design system that organizes UI components in hierarchical levels of complexity.

### Why was it chosen?

1. **Domain clarity**: When opening the project, you immediately see what the business is about (auth, projects, video composition), not the technologies
2. **Feature scalability**: Each domain is independent and can grow without affecting others
3. **Clear separation**: Business logic (domains) vs reusable UI (components) vs infrastructure (lib)
4. **Maintainability**: Everything related to a feature is in one place
5. **Frontend-API decoupling**: Architecture cleanly separates from NestJS backend via API client layer
6. **Video composition isolation**: Remotion layer is completely isolated from business logic

---

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP                            │
│                  (Routing & Pages, SSR)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│  DOMAINS (Business Logic) │   │  COMPONENTS (UI System)   │
│                           │   │                           │
│  ┌─────────────────────┐ │   │  ┌─────────────────────┐ │
│  │ auth/               │ │   │  │ ui/ (shadcn/ui)     │ │
│  │ ├── components/     │ │   │  │ atoms/              │ │
│  │ ├── hooks/          │ │   │  │ molecules/          │ │
│  │ ├── stores/         │ │   │  │ organisms/          │ │
│  │ ├── schema.ts       │ │   │  │ shared/             │ │
│  │ └── types.ts        │ │   │  └─────────────────────┘ │
│  └─────────────────────┘ │                               │
│                           │                               │
│  ┌─────────────────────┐ │                               │
│  │ projects/           │ │                               │
│  │ ├── hooks/          │ │                               │
│  │ ├── stores/         │ │                               │
│  │ └── ...             │ │                               │
│  └─────────────────────┘ │                               │
│                           │                               │
│  ┌─────────────────────┐ │                               │
│  │ composition/        │ │                               │
│  │ └── ...             │ │                               │
│  └─────────────────────┘ │                               │
└───────────────────────────┘                               │
                │                                           │
                └──────────────┬────────────────────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │   REMOTION LAYER (NEW)       │
                │   ├── compositions/          │
                │   ├── templates/             │
                │   ├── components/            │
                │   └── schema.ts              │
                └──────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────┐
            │   LIB (Infrastructure)           │
            │   ├── api/                       │
            │   │   ├── client.ts              │
            │   │   └── endpoints/             │
            │   ├── auth.ts (JWT helpers)      │
            │   ├── middleware.ts              │
            │   └── hooks.ts                   │
            └──────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────┐
            │   UTILS (Pure Functions)         │
            │   ├── format-date.ts             │
            │   ├── validate-email.ts          │
            │   ├── class-names.ts             │
            │   └── brand-tokens.ts            │
            └──────────────────────────────────┘
                               │
                               ▼
            ┌──────────────────────────────────┐
            │   NestJS API (Separate Repo)     │
            │   ├── /auth                      │
            │   ├── /projects                  │
            │   ├── /compositions              │
            │   └── /render                    │
            └──────────────────────────────────┘
```

---

## 2. Layer Definitions

### Layer 1: App (Next.js 15 Routing & Pages)

**Responsibility**:

- Define application routes
- Server-side rendering (SSR) initial data fetching from NestJS API
- Layouts and page templates
- Routing middleware for authentication
- Loading states and error handling

**Contains**:

- `page.tsx`: Route pages (mostly composition, can fetch from API server-side)
- `layout.tsx`: Shared layouts with providers
- `loading.tsx`: Loading states
- `error.tsx`: Error handling
- Route groups: `(auth)`, `(dashboard)`, `(editor)`

**Guidelines**:

- Pages ONLY compose components and domain hooks
- Server Components should fetch initial data from NestJS API for SSR when needed
- Client Components use React Query hooks for interactive data
- NO business logic in pages; delegate to domain hooks
- Use `Suspense` for async data fetching

**Example structure**:

```
/src/app
  /(auth)/
    login/
      page.tsx          → Server Component, render LoginForm
    signup/
      page.tsx
  /(dashboard)/
    layout.tsx          → Authentication wrapper
    page.tsx            → Dashboard page
    projects/
      [id]/
        page.tsx        → Project detail (may fetch from API server-side)
        editor/
          page.tsx      → Video editor
  /api/
    auth/
      callback/
        route.ts        → OAuth callback (if using OAuth)
```

---

### Layer 2: Domains (Business Logic)

**Responsibility**:

- Encapsulate business logic for each domain (auth, projects, compositions, etc.)
- Define types and validation schemas
- React Query hooks for data fetching/mutations (call NestJS API)
- Zustand stores for UI-only state
- Domain-specific components (if reused within domain)

**Contains per domain**:

```
/src/domains/{domain}/
  /components/           → Components specific to this domain
    CustomVideoPlayer.tsx
    CompositionSelector.tsx
  /hooks/                → React Query hooks calling API + custom logic hooks
    useGetProjects.ts    → React Query: GET /api/projects
    useCreateProject.ts  → React Query: POST /api/projects
    useCompositionData.ts → Custom hook processing API data
  /stores/               → Zustand store for UI state (NOT server state)
    useEditorUIStore.ts  → Timeline visibility, panel open/closed, etc.
  /schema.ts             → Zod schemas for validation
  /types.ts              → TypeScript interfaces for domain
  /text-maps.ts          → Domain-specific text/strings
```

**Key rules**:

- Hooks MUST use React Query for API calls (not Server Actions)
- Mutations use `useMutation` with error handling
- Zustand stores ONLY for UI state (not data from API)
- Schema validates form inputs and API response typing
- Each domain is independent; use shared components from `/components`

**Data Flow Example**:

```
Component → useGetProjects() hook (React Query)
          → queryFn: apiClient.getProjects()
          → NestJS API: GET /api/projects
          → Response + error handling
          → Component re-renders with data
```

---

### Layer 3: Components (UI System - Atomic Design)

**Responsibility**:

- Reusable UI components following Atomic Design
- shadcn/ui integration
- Accessibility and responsive design
- No business logic; receive data via props

**Structure**:

```
/src/components/
  /ui/                  → shadcn/ui components (auto-installed)
    button.tsx
    input.tsx
    dialog.tsx
    etc.
  /atoms/               → Smallest, reusable units
    Badge.tsx
    Label.tsx
    Icon.tsx
  /molecules/           → Combinations of atoms
    FormInput.tsx       → Label + Input + Error message
    SearchBar.tsx       → Input + Icon + Button
    VideoPreview.tsx    → Thumbnail + Duration badge
  /organisms/           → Complex, feature-rich components
    ProjectCard.tsx
    TemplateSelector.tsx
    VideoCompositionPanel.tsx
  /shared/              → Cross-domain components
    Navbar.tsx
    Sidebar.tsx
    EmptyState.tsx
    ErrorBoundary.tsx
```

**Guidelines**:

- Components receive all data via props (no internal fetching)
- Use Text-Maps for strings
- Export named exports (not default)
- Each component has TypeScript props interface
- Mobile-first responsive design (use Tailwind CSS v4)
- Accessibility (ARIA attributes, semantic HTML)

---

### Layer 4: Remotion Layer (NEW - Video Composition)

**Responsibility**:

- Video compositions and templates
- Remotion components for rendering video
- Template props schema (what data templates expect)
- Brand tokens for video styling (NOT web Platform Tokens)

**Structure**:

```
/src/remotion/
  /compositions/        → Main compositions (exported)
    IntroTemplate.tsx
    OutroTemplate.tsx
    SocialTemplate.tsx
  /templates/           → Reusable template components
    HeaderTemplate.tsx
    AnimatedText.tsx
    BrandedFooter.tsx
  /components/          → Remotion-specific components (video elements)
    VideoText.tsx       → Remotion <AbsoluteFill>, <Sequence>, etc.
    VideoImage.tsx
    VideoShape.tsx
  /schema.ts            → Zod schemas for template props
  /types.ts             → TypeScript types for Remotion data
  /brand-tokens.ts      → Color schemes, fonts, animation timings (video-specific)
  /index.ts             → Export all compositions for Remotion Player
```

**Data Flow**:

```
Editor Component → Project + Template data from React Query
                → Pass to Remotion composition props
                → Remotion composition renders video template
                → Preview in @remotion/player (browser)
                → Can export to MP4 via NestJS /render endpoint
```

**Key rules**:

- Remotion compositions are pure React components
- All styling via Brand Tokens (not web Platform Tokens)
- Props are fully typed and validated with Zod
- Compositions receive data from React Query hooks
- Player preview is in-browser via @remotion/player

---

### Layer 5: Lib (Infrastructure & API Client)

**Responsibility**:

- NestJS API client (HTTP requests with axios or fetch)
- JWT authentication helpers
- Next.js middleware
- Global HTTP interceptors

**Structure**:

```
/src/lib/
  /api/
    client.ts           → Axios/Fetch client with JWT interceptor
    endpoints.ts        → Centralized API endpoint definitions
    /services/
      auth.ts           → Auth API calls
      projects.ts       → Projects API calls
      compositions.ts   → Compositions API calls
  auth.ts               → JWT extraction, validation, role checking
  middleware.ts         → Next.js middleware for auth protection
  hooks.ts              → Low-level hooks (e.g., useAuthToken)
```

**API Client Pattern**:

```typescript
// /src/lib/api/client.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // httpOnly cookies
})

// JWT interceptor for Bearer token (if needed)
apiClient.interceptors.request.use((config) => {
  // JWT token handling if stored differently
  return config
})

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Redirect to login
    }
    throw error
  }
)

export default apiClient
```

**React Query Hook Pattern**:

```typescript
// /src/domains/projects/hooks/useGetProjects.ts
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { Project } from '../types'

export function useGetProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get<Project[]>('/projects')
      return response
    },
  })
}
```

---

### Layer 6: Utils (Pure Functions)

**Responsibility**:

- Pure utility functions (no dependencies, no side effects)
- Formatters, validators, transformers
- Helper functions used across domains

**Examples**:

- `format-date.ts`: Date formatting utilities
- `validate-email.ts`: Email validation
- `class-names.ts`: Tailwind class merging
- `brand-tokens.ts`: Color/typography constants for video (Brand Tokens)

**Key rule**: No domain knowledge; pure functions only

---

### External: NestJS API (Separate Repository)

**Responsibility**:

- REST API endpoints
- Authentication (JWT in httpOnly cookies)
- Data persistence
- Video rendering service

**Key endpoints**:

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/compositions
POST   /api/compositions
GET    /api/compositions/:id

POST   /api/render           → Trigger video render job
GET    /api/render/:jobId    → Check render status
```

---

## 3. Data Flow Patterns

### Pattern 1: Fetching Data (Interactive)

**Flow**:

```
Page Component (Server or Client)
  ↓
Domain Hook: useGetProjects() (React Query)
  ↓
API Client: apiClient.get('/projects')
  ↓
NestJS API: GET /projects
  ↓
Response with Project[] data
  ↓
Component receives data via hook, re-renders
```

**Example component**:

```typescript
'use client'

import { useGetProjects } from '@/domains/projects/hooks'
import { ProjectCard } from '@/components/organisms/ProjectCard'

export function ProjectsList() {
  const { data: projects, isLoading, error } = useGetProjects()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="grid">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

---

### Pattern 2: Mutations (Creating/Updating Data)

**Flow**:

```
Form Component (Client)
  ↓
React Hook Form (form state)
  ↓
useCreateProject() mutation hook (React Query useMutation)
  ↓
API Client: apiClient.post('/projects', data)
  ↓
NestJS API: POST /projects
  ↓
Response with new Project
  ↓
React Query invalidates cache
  ↓
Component re-fetches projects, UI updates
```

**Example hook**:

```typescript
// /src/domains/projects/hooks/useCreateProject.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { CreateProjectInput, Project } from '../types'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const response = await apiClient.post<Project>('/projects', input)
      return response
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      // Error handling
      console.error('Create project failed:', error)
    },
  })
}
```

**Example component**:

```typescript
'use client'

import { useCreateProject } from '@/domains/projects/hooks'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateProjectSchema } from '@/domains/projects/schema'

export function CreateProjectForm() {
  const { mutate, isPending } = useCreateProject()
  const form = useForm({
    resolver: zodResolver(CreateProjectSchema),
  })

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        Create Project
      </button>
    </form>
  )
}
```

---

### Pattern 3: Video Composition Rendering

**Flow**:

```
Editor Component
  ↓
useGetComposition() hook (fetch composition data + template)
  ↓
Pass props to Remotion composition component
  ↓
@remotion/player renders preview in browser
  ↓
User exports → useRenderVideo() mutation
  ↓
apiClient.post('/render', { compositionId, ... })
  ↓
NestJS queues FFmpeg render job
  ↓
Response with jobId
  ↓
Component polls /render/:jobId for status
  ↓
Once complete, download MP4
```

**Example Remotion composition**:

```typescript
// /src/remotion/compositions/IntroTemplate.tsx
import { Composition } from 'remotion'
import { IntroTemplateComponent } from '../templates/IntroTemplate'

export const IntroComposition = () => {
  return (
    <Composition
      id="intro"
      component={IntroTemplateComponent}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: 'Welcome',
        bgColor: '#000',
      }}
    />
  )
}
```

**Example template component**:

```typescript
// /src/remotion/templates/IntroTemplate.tsx
import { AbsoluteFill, Sequence } from 'remotion'
import { BRAND_TOKENS } from '../brand-tokens'

interface IntroTemplateProps {
  title: string
  bgColor: string
}

export function IntroTemplateComponent({ title, bgColor }: IntroTemplateProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <Sequence from={0} durationInFrames={300}>
        <h1 style={{ color: BRAND_TOKENS.colors.primary }}>{title}</h1>
      </Sequence>
    </AbsoluteFill>
  )
}
```

---

## 4. State Management Matrix

| State Type | Tool | Location | Example |
|---|---|---|---|
| **Server Data** (API responses) | React Query | Domain hooks | Projects list from API |
| **UI State** (local, interactive) | Zustand | Domain stores | Sidebar open/closed, panel visibility |
| **Form State** | React Hook Form | Component | Form field values, validation |
| **Local Component State** | useState | Component | Hover state, local toggles |

**Key principle**: React Query owns all API data. Zustand owns only UI presentation state. Never duplicate server state in Zustand.

---

## 5. Authentication & Authorization

### JWT Tokens in httpOnly Cookies

**Flow**:

1. User logs in via `/login` endpoint on NestJS
2. NestJS returns JWT in httpOnly cookie (secure, not accessible from JS)
3. Browser automatically sends cookie on every API request
4. Next.js middleware validates token, protects routes

**Middleware protection**:

```typescript
// /src/lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    jwtDecode(token)
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*'],
}
```

### Role-Based UI Rendering

**Example**:

```typescript
// Domain hook to fetch current user + roles
export function useAuthUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get('/auth/me'),
  })
}

// Component using role
'use client'

export function AdminPanel() {
  const { data: user } = useAuthUser()

  if (user?.role !== 'admin') {
    return <div>Not authorized</div>
  }

  return <AdminControls />
}
```

---

## 6. Key Rules & Patterns

### Component Organization Rules

1. **Reusable components** (used 2+ times) → `/components` (Atomic Design)
2. **Domain-specific components** (used only in one domain) → `/domains/{domain}/components`
3. **No business logic in components** → Receive all data via props
4. **No default exports** → Only named exports

### Domain Hook Rules

1. **All API calls go through React Query hooks** (in domain hooks)
2. **Mutations use useMutation with error handling**
3. **Hooks are pure** (no side effects except API calls)
4. **Invalidate cache after mutations** to keep data in sync

### Remotion Rules

1. **Compositions are pure functions** (receive props, return JSX)
2. **Brand Tokens for video styling** (colors, fonts, animations)
3. **Zod schemas validate template props**
4. **Remotion components only in `/remotion/` folder**

### API Client Rules

1. **Centralized HTTP client** (`/lib/api/client.ts`)
2. **JWT interceptor for Bearer tokens** (if needed beyond httpOnly cookie)
3. **Global error handling** (401 → redirect to login)
4. **Endpoint definitions** in `/lib/api/endpoints.ts`

### File Naming Rules

- **Components**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Utilities/Hooks**: camelCase (`useGetProjects.ts`, `format-date.ts`)
- **Folders**: kebab-case (`/src/domains/user-profile/`, `/src/components/shared/`)
- **Types/Schemas**: Match feature name (`projects/types.ts`, `projects/schema.ts`)

### Import Rules

- **Always use absolute imports** with `@/` alias
- **Never relative imports** (`../../../`)
- **Example**: `import { useGetProjects } from '@/domains/projects/hooks'`

---

## 7. Common Workflows

### Adding a New Feature

1. **Create domain folder**: `/src/domains/{feature}/`
2. **Define types & schema**: `types.ts`, `schema.ts`
3. **Create React Query hooks**: `hooks/useGet*.ts`, `hooks/useCreate*.ts` → call NestJS API
4. **Create Zustand store** (if UI state needed): `stores/*.ts`
5. **Create components**: `/components/` (Atomic) or `domains/{feature}/components/`
6. **Create page**: `/src/app/{feature}/page.tsx` → compose domain hooks + components
7. **Test**: Verify API calls to NestJS backend work correctly

### Modifying a Page

1. Update page composition (which components to render)
2. Modify hooks to change API calls (if needed)
3. Update components for new props
4. Test in browser

### Adding a New Remotion Composition

1. Create composition in `/src/remotion/compositions/{name}.tsx`
2. Create template in `/src/remotion/templates/{name}.tsx`
3. Define props schema in `schema.ts`
4. Register in `/src/remotion/index.ts`
5. In editor, fetch composition data from React Query
6. Pass props to composition component via Remotion Player

---

## 8. Key Files to Read

- **Project constraint rules**: [`.claude/knowledge/critical-constraints.md`](.claude/knowledge/critical-constraints.md)
- **Tech stack & setup**: [`.claude/knowledge/tech-stack.md`](.claude/knowledge/tech-stack.md)
- **File structure detail**: [`.claude/knowledge/file-structure.md`](.claude/knowledge/file-structure.md)
- **Naming conventions**: [`.claude/references/naming-conventions.md`](.claude/references/naming-conventions.md)
- **Component architecture**: [`.claude/references/component-architecture.md`](.claude/references/component-architecture.md)

