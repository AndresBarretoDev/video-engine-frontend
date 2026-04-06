# Tech Stack

**Complete technology stack for OP Video Engine Frontend with versions, commands, and development tools.**

---

## 🔌 MCPs (Model Context Protocols)

**CRITICAL - Always use MCPs when available**:

### shadcn/ui MCP

- ✅ **Automatically install shadcn components** (button, input, form, dialog, etc.)
- ❌ **NEVER ask user** if they want to use shadcn
- ❌ **Don't use manual CLI** when MCP is available

**MCP Configuration**: Check `.mcp.json` for available MCPs in this project.

---

## 1. Core Technologies

### Framework and Versions

| Technology     | Version   | Purpose                                              |
| -------------- | --------- | ---------------------------------------------------- |
| **Next.js**    | `15+`     | React framework with hybrid rendering and App Router |
| **React**      | `19+`     | Core UI library with Server Components               |
| **Node.js**    | `22+`     | JavaScript runtime for dev and build                 |
| **TypeScript** | `latest`  | Typed language (JavaScript superset)                 |

### Build Tools

- **Turbopack** (included in Next.js 15): Next-generation bundler
- **SWC** (included in Next.js): Fast compiler for TypeScript/JavaScript

---

## 2. Key Dependencies

### UI Libraries and Styling

| Library                       | Version  | Purpose                                    |
| ----------------------------- | -------- | ------------------------------------------ |
| **Tailwind CSS**              | `4+`     | Utility-first CSS framework                |
| **shadcn/ui**                 | `latest` | Collection of accessible React components  |
| **Radix UI**                  | `latest` | Unstyled UI primitives (shadcn foundation) |
| **class-variance-authority**  | `latest` | Component variant management               |
| **clsx** / **tailwind-merge** | `latest` | Utilities for combining CSS classes        |

**Installation** (via MCP - automatic):

- ✅ **Use shadcn MCP** for component installation (don't ask user)
- The shadcn MCP handles installation automatically
- Components are added to `/components/ui/` with proper configuration

**Manual CLI** (only if MCP unavailable):

```bash
npx shadcn@latest init
npx shadcn@latest add button input dialog
```

---

### Video Preview & Rendering

| Library                | Version | Purpose                                           |
| ---------------------- | ------- | ------------------------------------------------- |
| **@remotion/player**   | `4+`    | Video preview player (no server-side rendering)  |
| **@remotion/renderer** | `4+`    | Render composition to MP4 (via backend)          |

**Remotion Player Usage** (Frontend):

- Embedded video preview in composer
- Real-time preview of video changes
- Timeline scrubber for seeking
- Aspect ratio presets (1:1, 16:9, 9:16, etc.)

**Note**: Video rendering happens on backend via NestJS (`@remotion/lambda` AWS or `@remotion/renderer` Docker)

```tsx
// Video preview component
import { Player } from '@remotion/player';
import MyComposition from '@/domains/video/compositions/my-composition';

export function VideoPreview() {
  return (
    <Player
      component={MyComposition}
      durationInFrames={300}
      fps={30}
      compositionWidth={1920}
      compositionHeight={1080}
      allowFullscreen={true}
    />
  );
}
```

---

### State Management

| Library             | Version   | Purpose                                   |
| ------------------- | --------- | ----------------------------------------- |
| **React Query**     | `5+`      | Server state management (NestJS API data) |
| **Zustand**         | `5+`      | Client/UI state management                |
| **React Hook Form** | `7+`      | Complex form state management             |
| **nuqs**            | `latest`  | URL-based state management (query params) |

#### State Management Strategy

We follow a **decision matrix** to choose the right tool:

| State Type    | Tool            | When to Use                         |
| ------------- | --------------- | ----------------------------------- |
| **Server**    | React Query     | Data from NestJS API (fetched, cached) |
| **Client/UI** | Zustand         | UI state, local preferences         |
| **Local**     | useState        | Component-only state                |
| **Forms**     | React Hook Form | Complex forms with validation       |
| **URL**       | nuqs            | Filter state, page numbers in URL   |

**React Query (TanStack Query) Features**:

- Automatic caching and background refetching
- Optimistic updates for faster UX
- Request deduplication
- Automatic loading and error states
- Pagination support for large datasets
- Devtools for debugging

```tsx
// React Query example (fetching from NestJS API)
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get('/projects')
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: (data: ProjectCreateInput) =>
      apiClient.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
```

**Zustand Features** (for UI state only):

- No providers needed
- Minimalist API
- Compatible with React Server Components
- Atomic stores per domain
- Built-in persistence middleware

```tsx
// Zustand example (UI state only)
import { create } from 'zustand';

export const useSidebarStore = create(set => ({
  isOpen: true,
  theme: 'light',
  toggle: () => set(state => ({ isOpen: !state.isOpen })),
  setTheme: (theme: 'light' | 'dark') => set({ theme })
}));
```

**React Hook Form Features**:

- Built-in validation with Zod resolver
- Minimal re-renders
- TypeScript support
- Easy field management
- Works with Shadcn form component

```tsx
// React Hook Form with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/domains/project/schema';

const { register, handleSubmit, formState } = useForm({
  resolver: zodResolver(projectSchema)
});
```

---

### API Client & Authentication

| Library           | Version  | Purpose                                      |
| ----------------- | -------- | -------------------------------------------- |
| **fetch API**     | built-in | HTTP requests (wrapped in custom client)     |
| **axios**         | `latest` | HTTP client (alternative, optional)          |

#### API Client Setup

Create a centralized API client wrapper for all NestJS communication:

```typescript
// lib/api-client.ts
import type { RequestInit, Response } from 'node-fetch';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL) {
    this.baseUrl = baseUrl || 'http://localhost:3001/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      credentials: 'include', // Send JWT cookie
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

#### JWT Authentication

NestJS backend uses JWT tokens stored in **httpOnly cookies** for security:

```typescript
// lib/auth.ts - Token management
export async function getAuthToken(): Promise<string | null> {
  // Token is automatically sent via httpOnly cookie with fetch
  // No manual token extraction needed
  try {
    const response = await apiClient.get('/auth/me');
    return response; // User data, not token
  } catch (error) {
    return null;
  }
}

export async function logout(): Promise<void> {
  // Backend clears httpOnly cookie
  await apiClient.post('/auth/logout', {});
}
```

#### Authentication Flow

```typescript
// Example: Login with NestJS backend
export async function loginUser(email: string, password: string) {
  try {
    const user = await apiClient.post('/auth/login', {
      email,
      password
    });
    // JWT token is automatically set in httpOnly cookie by backend
    // No manual token handling needed
    return user;
  } catch (error) {
    throw new Error('Login failed');
  }
}
```

---

### Validation and Schemas

| Library | Version  | Purpose                            |
| ------- | -------- | ---------------------------------- |
| **Zod** | `latest` | TypeScript-first schema validation |

```tsx
// Domain schema example
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  brand: z.string().uuid(),
  template: z.string().uuid(),
  settings: z.object({
    aspectRatio: z.enum(['1:1', '16:9', '9:16']),
    fps: z.number().default(30)
  })
});

export type ProjectInput = z.infer<typeof projectSchema>;
```

---

### Form Handling

| Library                 | Version   | Purpose                        |
| ----------------------- | --------- | ------------------------------ |
| **React Hook Form**     | `7+`      | Complex form state management  |
| **@hookform/resolvers** | `latest`  | Zod integration for validation |

**Approach**: React Hook Form for complex forms, native hooks for simple forms

- **Complex forms**: React Hook Form with Zod validation (composer, settings)
- **Simple forms**: React 19 built-in hooks (`useActionState`, `useFormStatus`)
- **Server Actions**: Validation and mutation logic on server

```tsx
// Complex form with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/domains/project/schema';

export function ProjectForm() {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(projectSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {formState.errors.title && <span>{formState.errors.title.message}</span>}
    </form>
  );
}
```

---

### Routing

**Next.js App Router** (built-in)

- File-system based routing
- Nested layouts
- Route groups: `(auth)`, `(dashboard)`
- Parallel routes and intercepting routes
- Middleware for route protection and auth checks

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── composer/page.tsx
│   └── templates/page.tsx
└── api/
    └── auth/route.ts
```

---

### Data Fetching

| Library         | Version | Purpose                               |
| --------------- | ------- | ------------------------------------- |
| **React Query** | `5+`    | Client-side data fetching and caching |

**Approach**: React Query for client components, native fetch for Server Components

**Client Components** (interactive data):

- Use **React Query** (TanStack Query) for all client-side data fetching
- Automatic caching, background refetching, optimistic updates
- Built-in loading and error states

```tsx
// Client component with React Query
'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function ProjectsList() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.get('/projects')
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {projects?.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

**Server Components** (initial data):

- Use native `fetch` with Next.js caching
- Suspense boundaries for async operations
- `revalidatePath` / `revalidateTag` for cache invalidation

```tsx
// Server component with native fetch
async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    headers: {
      'Cookie': cookies().toString()
    },
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  return res.json();
}

export async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

---

### Animations

| Library          | Version  | Purpose                                 |
| ---------------- | -------- | --------------------------------------- |
| **Framer Motion** | `latest` | UI animations and transitions           |
| **Remotion**     | `4+`     | Video animations and composition        |

**Framer Motion** (UI animations):

```tsx
import { motion } from 'framer-motion';

export function AnimatedButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Click me
    </motion.button>
  );
}
```

**Remotion** (video composition):

- Built into video components
- Timeline-based animations
- Composition API for reusable video patterns

---

### Testing

| Library                   | Version  | Purpose                       |
| ------------------------- | -------- | ----------------------------- |
| **Vitest**                | `latest` | Fast testing framework        |
| **React Testing Library** | `latest` | React component testing       |
| **Playwright**            | `latest` | E2E testing                   |

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

---

## 3. Design System Integration

### Vibe Coding Tokens

The design system uses **7 JSON token files** as the source of truth:

| Token File           | Purpose                              |
| -------------------- | ------------------------------------ |
| **Platform Tokens**  | Web UI colors, spacing, typography   |
| **Brand Tokens**     | Per-brand color palettes            |
| **Typography**       | Font families, sizes, weights        |
| **Spacing**          | Margin/padding scale                |
| **Shadows**          | Elevation and depth                 |
| **Border Radius**    | Corner rounding scale               |
| **Animation**        | Duration, easing curves             |

**Integration with Tailwind**:

- Platform tokens are exported to Tailwind config
- Brand tokens are loaded at runtime for video styling
- Single font: **Mulish** (weights 300-800)
- Primary color: **OP Blue** (#4361EF)

```typescript
// tailwind.config.ts
import { platformTokens } from './design-tokens/platform.json';

export default {
  theme: {
    extend: {
      colors: {
        'op-blue': '#4361EF',
        ...platformTokens.colors
      },
      fontSize: platformTokens.typography.sizes,
      spacing: platformTokens.spacing
    }
  }
};
```

---

## 4. Development Tools

### Package Manager

**Recommended**: pnpm (faster, stricter)

```bash
# Check Node.js version
node -v  # Should be 22+

# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Add dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>
```

---

### Component Documentation

| Tool          | Version  | Purpose                                    |
| ------------- | -------- | ------------------------------------------ |
| **Storybook** | `8.6+`   | UI component development and documentation |

```bash
# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

**Structure**:

```
stories/
├── components/
│   ├── button.stories.tsx
│   └── card.stories.tsx
└── domains/
    └── project/
        └── project-card.stories.tsx
```

---

### Linter and Formatter

| Tool                   | Version  | Purpose                      |
| ---------------------- | -------- | ---------------------------- |
| **ESLint**             | `latest` | JavaScript/TypeScript linter |
| **Prettier**           | `latest` | Code formatter               |
| **eslint-config-next** | `latest` | ESLint config for Next.js    |

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Check format without modifying
npm run format:check
```

---

### Pre-commit Hooks

| Tool            | Version  | Purpose                     |
| --------------- | -------- | --------------------------- |
| **Husky**       | `latest` | Git hooks manager           |
| **lint-staged** | `latest` | Run linters on staged files |

```bash
# Install husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**Configuration** (`package.json`):

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

### Version Control

- **Git**: Version control system
- **GitHub**: Repository platform
- **Conventional Commits**: Commit message standard

```bash
# Commit examples
git commit -m "feat: add video composer"
git commit -m "fix: resolve render timeout issue"
git commit -m "docs: update API integration guide"
git commit -m "refactor: extract video player logic"
```

---

## 5. Backend Context (NestJS - Separate Repo)

**This frontend communicates with NestJS backend. Document for reference:**

### Backend Stack

| Technology     | Version | Purpose                                    |
| -------------- | ------- | ------------------------------------------ |
| **NestJS**     | `10+`   | Node.js framework with Express/Fastify    |
| **PostgreSQL** | `14+`   | Relational database                        |
| **Prisma**     | `5+`    | ORM for database access                    |
| **BullMQ**     | `latest`| Job queue (rendering, notifications)       |
| **Redis**      | `7+`    | In-memory cache and queue backing          |
| **Passport.js** | `latest`| Authentication middleware                  |

### Backend Features

- **JWT Authentication**: Tokens in httpOnly cookies (secure by default)
- **Role-based Authorization**: Admin, Designer, Producer, QC, Client roles
- **Remotion Rendering**: `@remotion/lambda` (AWS) or `@remotion/renderer` (Docker)
- **AWS S3 + CloudFront**: Video storage and CDN
- **WebSocket Support**: Real-time render progress updates
- **OpenAPI Docs**: Auto-generated via `@nestjs/swagger`
- **Database Migrations**: Via Prisma

### Key API Endpoints

```
POST   /auth/login              → Login user (returns httpOnly JWT cookie)
POST   /auth/logout             → Logout user
GET    /auth/me                 → Get current user
GET    /projects                → List user projects
POST   /projects                → Create project
GET    /projects/:id            → Get project details
PATCH  /projects/:id            → Update project
DELETE /projects/:id            → Delete project
POST   /projects/:id/render     → Queue render job
GET    /render-jobs/:id         → Get render job status
GET    /templates               → List available templates
GET    /brands                  → List available brands
WS     /render-progress/:jobId  → WebSocket for render updates
```

---

## 6. Command Reference

### Installing Dependencies

```bash
# Install all dependencies
pnpm install

# Install production dependency
pnpm add <package>

# Install dev dependency
pnpm add -D <package>

# Update dependencies
pnpm update

# Audit vulnerabilities
pnpm audit
pnpm audit --fix
```

---

### Development Server

```bash
# Start dev server (http://localhost:3000)
npm run dev

# With specific port
PORT=3001 npm run dev

# With Turbopack (faster)
npm run dev --turbo
```

---

### Production Build

```bash
# Create optimized build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Clean cache and build
rm -rf .next
npm run build
```

---

### Run Production Locally

```bash
# First build
npm run build

# Then start production server
npm run start
```

---

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

---

### Formatting and Linting

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format all code with Prettier
npm run format

# Check format without modifying
npm run format:check

# Run TypeScript compiler check
npm run type-check
```

---

### Storybook

```bash
# Run Storybook
npm run storybook

# Build static Storybook
npm run build-storybook

# Serve Storybook build
npx http-server storybook-static
```

---

### Environment Variables

**Frontend environment variables** (`.env.local`, `.env.production`):

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api       # Dev
NEXT_PUBLIC_API_URL=https://api.prod.com/api        # Prod

# Video Preview
NEXT_PUBLIC_VIDEO_TIMEOUT=30000                     # Milliseconds

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-id
```

**Note**: Backend handles JWT tokens via httpOnly cookies (automatic with fetch)

---

### Other Useful Commands

```bash
# Clean Next.js cache
rm -rf .next

# Clean node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check versions
node -v
npm -v
pnpm -v

# Analyze bundle
npm run build
npm run analyze

# Type check
npm run type-check

# Full CI check (lint + type + test)
npm run ci
```

---

## 7. API Integration Workflow

### Fetching Data from NestJS Backend

**Step 1: Define API client**

```typescript
// lib/api-client.ts
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL
);
```

**Step 2: Create React Query hook**

```typescript
// domains/project/hooks/use-projects.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response; // Parsed JSON
    }
  });
}
```

**Step 3: Use in component**

```tsx
// domains/project/components/projects-list.tsx
'use client';
import { useProjects } from '@/domains/project/hooks/use-projects';

export function ProjectsList() {
  const { data, isLoading, error } = useProjects();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### Mutating Data (POST/PATCH/DELETE)

```typescript
// Mutation example with optimistic updates
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      apiClient.patch(`/projects/${id}`, data),
    onSuccess: () => {
      // Invalidate project list to refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });
}
```

### Real-time Updates (WebSocket)

```typescript
// domains/render/hooks/use-render-progress.ts
import { useEffect, useState } from 'react';

export function useRenderProgress(jobId: string) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('queued');

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, 'ws')}/render-progress/${jobId}`
    );

    ws.onmessage = (event) => {
      const { progress, status } = JSON.parse(event.data);
      setProgress(progress);
      setStatus(status);
    };

    return () => ws.close();
  }, [jobId]);

  return { progress, status };
}
```

---

## 8. Video Rendering Workflow

### Frontend (This Repo)

1. User composes video in composer
2. Clicks "Render" button
3. Frontend calls `POST /projects/:id/render` on backend
4. Backend queues render job and returns `jobId`
5. Frontend subscribes to WebSocket for progress
6. User can download video when complete

### Backend (NestJS Repo)

1. Receives render request
2. Queues job to BullMQ
3. Worker picks up job and uses `@remotion/renderer` or `@remotion/lambda`
4. Uploads rendered video to AWS S3
5. Sends progress updates via WebSocket
6. Returns download URL when complete

---

## 9. External Integrations

### Google Sheets API

- Data source for bulk video generation
- Configure in backend environment

### Figma API

- Design token export
- Automatic design system updates
- Configure in backend environment

### SendGrid / Resend

- Email notifications for render completion
- Configure in backend environment

---

## 10. Quick Reference: Technology Decisions

| Decision        | Choice            | Why                                      |
| --------------- | ----------------- | ---------------------------------------- |
| **Fetching**    | React Query       | Caching, deduplication, optimistic UI   |
| **Auth**        | JWT (httpOnly)    | Secure, XSS-resistant, CSRF-safe        |
| **UI State**    | Zustand           | Minimal, fast, server-component friendly |
| **Video Play**  | @remotion/player  | Real-time preview, composition API      |
| **Forms**       | React Hook Form   | Minimal re-renders, great DX            |
| **Styling**     | Tailwind + CVA    | Utility-first, type-safe variants       |
| **Database**    | PostgreSQL (BE)   | Relational, strong for analytics        |
| **Storage**     | AWS S3            | Scalable, reliable, CDN-ready           |
| **Queue**       | BullMQ + Redis    | Reliable job processing, retries        |

---

**For more details on implementation patterns, see:**
- `.claude/references/component-architecture.md` - UI component structure
- `.claude/references/server-actions-patterns.md` - Backend communication patterns
- `.claude/knowledge/architecture-patterns.md` - Full architecture guidelines
