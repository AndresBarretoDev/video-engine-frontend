# Critical Constraints

**Non-negotiable rules that MUST be followed in all code.**

**Project Philosophy**: UI/UX-first, reusable components, ultra-clean pages, strict separation of concerns, mobile-first responsive design, NestJS backend-powered with JWT authentication, API-first integration with React Query, and Vibe Coding design tokens system.

---

## 🔴 10 Reglas No-Negociables del Proyecto

### 1. Componentes Reutilizables (DRY Principle)

❌ **NEVER**: Duplicate similar UI patterns across multiple files
✅ **ALWAYS**: If a pattern is used 2+ times, create a reusable component

**Correct example**:

```tsx
// ❌ INCORRECT - Duplicating button pattern
// pages/login.tsx
<button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Login
</button>

// pages/register.tsx
<button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Register
</button>

// ✅ CORRECT - Reusable component
// components/shared/primary-button.tsx
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      {...props}
    >
      {children}
    </button>
  );
}

// pages/login.tsx & pages/register.tsx
<PrimaryButton>Login</PrimaryButton>
```

---

### 2. Separación Estricta de Concerns

❌ **NEVER**: Mix logic, data, and types in the same file or wrong location
✅ **ALWAYS**: Logic in `/utils` or `/helpers`, data in `/constants`, types in `/types` or domain `types.ts`

**Correct structure**:

```
src/
├── utils/              # ✅ Pure functions (formatters, validators)
│   ├── format-date.ts
│   └── validate-email.ts
├── helpers/            # ✅ Business-specific reusable functions
│   ├── calculate-discount.ts
│   └── parse-user-permissions.ts
├── constants/          # ✅ Static data, config
│   ├── config.ts
│   ├── static-data.ts
│   └── text-maps.ts
├── types/              # ✅ Global TypeScript types
│   └── index.ts
└── domains/{domain}/
    ├── types.ts        # ✅ Domain-specific types
    └── ...
```

**❌ INCORRECT**:

```tsx
// components/user-card.tsx
// ❌ Logic, data, and types mixed in component
interface User {
  name: string;
}

const ROLE_LABELS = { admin: 'Administrator', user: 'User' };

function formatUserName(name: string) {
  return name.toUpperCase();
}

export function UserCard({ user }) {
  return <div>{formatUserName(user.name)}</div>;
}
```

**✅ CORRECT**:

```tsx
// types/user.ts
export interface User {
  name: string;
  role: string;
}

// constants/roles.ts
export const ROLE_LABELS = { admin: 'Administrator', user: 'User' };

// utils/format-user.ts
export function formatUserName(name: string) {
  return name.toUpperCase();
}

// components/shared/user-card.tsx
import type { User } from '@/types/user';
import { ROLE_LABELS } from '@/constants/roles';
import { formatUserName } from '@/utils/format-user';

export function UserCard({ user }: { user: User }) {
  return <div>{formatUserName(user.name)}</div>;
}
```

---

### 3. Types Externos (NO Types en Componentes)

❌ **NEVER**: Define interfaces or types inside component files
✅ **ALWAYS**: Define types in `/types/` (global) or `domains/{domain}/types.ts` (domain-specific)

**❌ INCORRECT**:

```tsx
// components/user-profile.tsx
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  return <div>{user.name}</div>;
}
```

**✅ CORRECT**:

```tsx
// types/user.ts (or domains/users/types.ts)
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfileProps {
  user: User;
}

// components/shared/user-profile.tsx
import type { UserProfileProps } from '@/types/user';

export function UserProfile({ user }: UserProfileProps) {
  return <div>{user.name}</div>;
}
```

---

### 4. Pages Ultra-Limpias (Solo Composición)

❌ **NEVER**: Put business logic, data fetching with manual state, or complex calculations in page files
✅ **ALWAYS**: Pages should ONLY compose components and pass props (data fetching in Server Components is OK)

**❌ INCORRECT**:

```tsx
// app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ❌ Business logic in page
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(u => u.active);
        setUsers(filtered);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

**✅ CORRECT**:

```tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react';
import { getActiveUsers } from '@/domains/users/hooks/use-users';
import { UserList } from '@/domains/users/components/user-list';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';

export default function DashboardPage() {
  // ✅ Only composition with client components that fetch data
  return (
    <div>
      <Suspense fallback={<LoadingSkeleton />}>
        <UserListContainer />
      </Suspense>
    </div>
  );
}

// domains/users/components/user-list-container.tsx
'use client';
import { useActiveUsers } from '@/domains/users/hooks/use-users';
import { UserList } from './user-list';

export function UserListContainer() {
  const { data: users, isLoading } = useActiveUsers();

  if (isLoading) return <div>Loading...</div>;

  return <UserList users={users} />;
}

// domains/users/components/user-list.tsx
export function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

### 5. MCPs Automáticos (Shadcn sin pedir)

❌ **NEVER**: Ask user if they want to use shadcn/ui components
✅ **ALWAYS**: Automatically use shadcn/ui MCP when UI components are needed

**Correct behavior**:

When implementing a form:
- ✅ Automatically install shadcn components: `npx shadcn@latest add button input form`
- ✅ Use shadcn components without asking
- ❌ Don't ask: "Do you want me to use shadcn for the button?"

---

### 6. Mobile-First Responsive Design

❌ **NEVER**: Design for desktop first, then adapt to mobile
✅ **ALWAYS**: Start with mobile design, then scale up for tablet and desktop

**Correct example**:

```tsx
// ✅ CORRECT - Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
  <button className="w-full md:w-auto">Click me</button>
</div>

// ❌ INCORRECT - Desktop first
<div className="lg:w-1/3 md:w-1/2 w-full">
  <h1 className="lg:text-4xl md:text-3xl text-2xl">Title</h1>
</div>
```

**Breakpoints**:

- Mobile: Default (< 640px)
- Tablet: `md:` (640px - 1024px)
- Desktop: `lg:` (> 1024px)

---

### 7. Server Components por Defecto

❌ **NEVER**: Use `"use client"` by default
✅ **ALWAYS**: Components are Server Components unless they need interactivity, browser APIs, or local state

**Decision tree**:

- Need `useState`, `useEffect`, `onClick`? → `"use client"`
- Need browser APIs (localStorage, window)? → `"use client"`
- Just rendering data? → Server Component (no directive)

**Correct example**:

```tsx
// ✅ Server Component (default) - no directive needed
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

// ✅ Client Component - only when needed
'use client';
import { useState } from 'react';

export function InteractiveCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### 8. Naming Conventions

❌ **NEVER**: Use inconsistent naming (PascalCase for files, camelCase for directories, etc.)
✅ **ALWAYS**: Follow strict conventions

**Rules**:

- **Files**: `kebab-case.tsx` (user-profile.tsx, login-form.tsx)
- **Components**: `PascalCase` (UserProfile, LoginForm)
- **Functions**: `camelCase` (formatDate, validateEmail)
- **Directories**: `kebab-case` (user-profile/, login-form/)
- **Constants**: `UPPER_SNAKE_CASE` (API_URL, MAX_RETRIES)
- **Boolean vars**: `is/has/should` prefix (isLoading, hasError, shouldRedirect)
- **Event handlers**: `handle` prefix (handleClick, handleSubmit)

**Correct example**:

```
src/
├── components/
│   └── shared/
│       └── user-profile.tsx         # ✅ kebab-case file
│           export function UserProfile()  # ✅ PascalCase component
├── utils/
│   └── format-date.ts               # ✅ kebab-case file
│       export function formatDate()  # ✅ camelCase function
└── constants/
    └── config.ts
        export const API_URL = '...'  # ✅ UPPER_SNAKE_CASE
```

---

### 9. Imports Absolutos

❌ **NEVER**: Use relative imports (`../../components/Button`)
✅ **ALWAYS**: Use absolute imports with `@/` alias

**Correct example**:

```tsx
// ❌ INCORRECT - Relative imports
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../domains/auth/hooks/use-auth';

// ✅ CORRECT - Absolute imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/domains/auth/hooks/use-auth';
```

**tsconfig.json** must have:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 10. Auth + Guards: JWT Middleware + Role-Based Protection

❌ **NEVER**: Create unprotected endpoints or skip JWT validation
✅ **ALWAYS**: Every API call includes JWT token validation, middleware guards, and role-based checks

**JWT Auth Pattern**:

```tsx
// lib/api/api-client.ts
// ✅ Centralized API client with JWT interceptor
import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ httpOnly cookies
});

// ✅ JWT interceptor for all requests
apiClient.interceptors.request.use(config => {
  // JWT is read from httpOnly cookie automatically
  return config;
});

// ✅ Handle 401 Unauthorized
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Server-Side Validation**:

```tsx
// middleware.ts
// ✅ Layer 1: Route protection with JWT
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Validate token from httpOnly cookie
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Role-based route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const userRole = request.headers.get('x-user-role'); // From NestJS
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}
```

**React Query + API Client**:

```tsx
// domains/users/hooks/use-users.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/api-client';

// ✅ All API calls go through centralized client with JWT
export function useActiveUsers() {
  return useQuery({
    queryKey: ['users', 'active'],
    queryFn: async () => {
      const response = await apiClient.get('/users/active');
      return response.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      const response = await apiClient.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

**Role-Based Component Display**:

```tsx
// domains/admin/components/admin-panel.tsx
'use client';
import { useAuth } from '@/domains/auth/hooks/use-auth';

export function AdminPanel() {
  const { user } = useAuth();

  // ✅ Check role and show/hide components
  if (!user?.roles.includes('admin')) {
    return null;
  }

  return <div>Admin Controls</div>;
}
```

---

## 📋 Additional Critical Constraints (Framework-Specific)

### 1. React Server Components (RSC) as architectural foundation

❌ **NEVER**: Use `"use client"` by default or without clear justification
✅ **ALWAYS**: Start components as Server Components. Only add `"use client"` when browser interactivity, browser APIs, or local state is required

**Correct example**:

```tsx
// app/dashboard/stats.tsx
// ✅ Server Component by default - no "use client"
async function Stats() {
  const data = await fetchStats();
  return <div>{data.total}</div>;
}

// app/dashboard/interactive-chart.tsx
// ✅ Client Component only when necessary
'use client';
import { useState } from 'react';

export function InteractiveChart({ initialData }) {
  const [filter, setFilter] = useState('all');
  // Interactivity logic...
}
```

---

### 2. API Client + React Query for all mutations

❌ **NEVER**: Make data mutations from client components using direct fetch/axios without centralized API client
✅ **ALWAYS**: Use React Query mutations with centralized API client (`/lib/api/api-client.ts`) for all mutations

**Correct example**:

```tsx
// lib/api/api-client.ts
// ✅ Centralized API client
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// domains/users/hooks/use-update-user.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import type { UpdateUserDTO } from '../types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserDTO) => {
      // ✅ All mutations go through centralized client
      const response = await apiClient.patch(`/users/${data.id}`, data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      // ✅ Optimistic update or cache invalidation
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      // ✅ Error handling with proper messages
      console.error('Update failed:', error);
    },
  });
}

// domains/users/components/update-user-form.tsx
'use client';
import { useUpdateUser } from '../hooks/use-update-user';

export function UpdateUserForm({ userId }: { userId: string }) {
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (formData: FormData) => {
    await updateUserMutation.mutateAsync({
      id: userId,
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <input name="email" />
      <button disabled={updateUserMutation.isPending}>
        {updateUserMutation.isPending ? 'Saving...' : 'Save'}
      </button>
      {updateUserMutation.error && (
        <p className="error">{updateUserMutation.error.message}</p>
      )}
    </form>
  );
}
```

---

### 3. Mandatory Suspense for async operations

❌ **NEVER**: Async components without Suspense boundary
✅ **ALWAYS**: Wrap components that fetch data with Suspense and appropriate fallback

**Correct example**:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { Stats } from './stats';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div>
      {/* ✅ Mandatory Suspense for async components */}
      <Suspense fallback={<Skeleton />}>
        <Stats />
      </Suspense>
    </div>
  );
}
```

---

### 4. Named exports only (NO default exports)

❌ **NEVER**: Use `export default`
✅ **ALWAYS**: Use named exports for better autocompletion and refactoring

**Correct example**:

```tsx
// ❌ INCORRECT
export default function Button() {}

// ✅ CORRECT
export function Button() {}

// ✅ CORRECT for pages (Next.js allows it)
// app/dashboard/page.tsx
export default function DashboardPage() {} // Exception: Next.js pages
```

---

### 5. Screaming Architecture: Domain-based organization

❌ **NEVER**: Mix business logic in /components or /lib
✅ **ALWAYS**: Organize business logic in /domains with complete structure per feature

**Correct example**:

```
src/
├── domains/           # ✅ Business logic by domain
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── users/
│   │   └── ...
│
├── components/        # ✅ Only reusable UI components
│   ├── ui/           # shadcn components
│   ├── shared/       # Domain-agnostic components
│
├── lib/
│   └── api/
│       └── api-client.ts  # ✅ Centralized API client
```

---

### 6. Strict naming conventions

❌ **NEVER**: Generic names or without semantic prefixes
✅ **ALWAYS**: Follow specific conventions

**Mandatory rules**:

```tsx
// ✅ Boolean states: is/has/should
const isLoading = true;
const hasError = false;
const shouldRedirect = true;

// ✅ Event handlers: handle
const handleSubmit = () => {};
const handleClick = () => {};

// ✅ Query hooks: use{Entity}{Action}
const useActiveUsers = () => {};
const useCreateProject = () => {};

// ✅ Directories: kebab-case
// auth-wizard/, user-profile/, data-fetching/

// ❌ NEVER
const loading = true; // Missing "is" prefix
const submit = () => {}; // Missing "handle" prefix
const AuthWizard = '/'; // Directory must be kebab-case
```

---

### 7. State Management Strategy: Right tool for the right job

❌ **NEVER**: Use Zustand for server state (backend data) or useState for complex forms
✅ **ALWAYS**: Follow the state management decision matrix based on data type

### Decision Matrix

| State Type    | Tool            | When to Use                         | Example                        |
| ------------- | --------------- | ----------------------------------- | ------------------------------ |
| **Server**    | React Query     | Data from NestJS backend (fetched, cached) | Projects, videos, users |
| **Client/UI** | Zustand         | UI state, local preferences         | Sidebar open, theme, filters   |
| **Local**     | useState        | Component-only state                | Form input, modal open         |
| **Forms**     | React Hook Form | Complex forms with validation       | Multi-step forms, registration |

### ❌ WRONG: Zustand for Server State

```tsx
// DON'T DO THIS
import { create } from 'zustand';

const useProjectStore = create(set => ({
  projects: [],
  loading: false,
  fetchProjects: async () => {
    set({ loading: true });
    const data = await apiClient.get('/projects');
    set({ projects: data, loading: false });
  }
}));
```

**Why it's wrong**:

- Manual loading state management
- No automatic cache invalidation
- No optimistic updates
- Hard to handle error states
- Duplicates data across components

### ✅ CORRECT: React Query for Server State

```tsx
// DO THIS
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response.data;
    }
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectDTO) => {
      const response = await apiClient.post('/projects', data);
      return response.data;
    },
    onSuccess: () => {
      // ✅ Automatic cache invalidation
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// In component
function ProjectList() {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();

  // ✅ React Query handles loading, error, cache automatically
}
```

### ✅ CORRECT: Zustand for Client/UI State

```tsx
// DO THIS
import { create } from 'zustand';

// ✅ Only UI/client state
export const useUIStore = create(set => ({
  sidebarOpen: true,
  theme: 'light',
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: theme => set({ theme })
}));

// In component
function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  // ✅ Perfect for UI state
}
```

### ✅ CORRECT: useState for Local State

```tsx
// DO THIS
function SearchBar() {
  const [query, setQuery] = useState(''); // ✅ Local to this component

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

### ✅ CORRECT: React Hook Form for Complex Forms

```tsx
// DO THIS
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schema';
import { useCreateUser } from '../hooks/use-create-user';

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const createUserMutation = useCreateUser();

  const onSubmit = async (data: RegisterDTO) => {
    await createUserMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      <button disabled={isSubmitting || createUserMutation.isPending}>
        {isSubmitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}
```

---

### 8. Middleware + API Interceptors for route protection

❌ **NEVER**: Validate authentication only on client-side
✅ **ALWAYS**: 3-layer validation: Middleware → API Interceptor → Client UI

**Correct example**:

```tsx
// middleware.ts
// ✅ Layer 1: Middleware intercepts route
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  // Protect dashboard routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect admin routes by role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/projects/:path*']
};

// lib/api/api-client.ts
// ✅ Layer 2: API Interceptor validates JWT
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send httpOnly cookies
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // ✅ Handle 401 - redirect to login
    if (error.response?.status === 401) {
      // Clear auth context
      localStorage.removeItem('auth_state');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Layer 3: Conditional Client UI
// domains/admin/components/admin-panel.tsx
'use client';
import { useAuth } from '@/domains/auth/hooks/use-auth';

export function AdminPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user?.roles.includes('admin')) {
    return null; // Hide sensitive UI
  }

  return <button onClick={() => deleteUser(id)}>Delete User</button>;
}
```

---

### 9. Forms: React Hook Form for complex, native fetch for simple

❌ **NEVER**: Handle complex form state manually with useState
✅ **ALWAYS**: Use React Hook Form for complex forms, direct API calls via mutations for simple forms

### Complex Forms (with validation)

Use **React Hook Form** with Zod validation for complex forms with multiple fields, validation rules, or multi-step flows.

```tsx
// domains/auth/components/register-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schema';
import { useCreateUser } from '../hooks/use-create-user';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const createUserMutation = useCreateUser();

  const onSubmit = async (data: RegisterDTO) => {
    // ✅ Mutation calls NestJS API via centralized client
    await createUserMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button disabled={isSubmitting || createUserMutation.isPending}>
        {isSubmitting ? 'Submitting...' : 'Register'}
      </button>
      {createUserMutation.error && (
        <p className="error">{createUserMutation.error.message}</p>
      )}
    </form>
  );
}
```

### Simple Forms (Direct API mutations)

Use **React Query mutation** with simple React Hook Form for straightforward forms.

```tsx
// domains/auth/components/login-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schema';
import { useLogin } from '../hooks/use-login';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useLogin();

  const onSubmit = async (data: LoginDTO) => {
    // ✅ Mutation calls NestJS API
    await loginMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### 10. Design System: Vibe Coding Tokens (Never Hardcode Colors/Fonts)

❌ **NEVER**: Hardcode colors, fonts, spacing, or visual values directly in components
✅ **ALWAYS**: Use CSS variables from the Vibe Coding design tokens

**IMPORTANT — Source of Truth Architecture**:

```
src/styles/tokens/
├── source/                            # 🔴 SOURCE OF TRUTH — 7 JSON files from Vibe Coding
│   ├── colors_system.json             # OP Blue scale (50-950), surfaces, component colors, transparencies
│   ├── typography_system.json         # Mulish font, display/headings/body/caption/CTA scales
│   ├── spacing_system.json            # Semantic padding/gap (button, card, field, container)
│   ├── grid_system.json               # 12 columns, containers (1376px/1135px), sidebar (141px)
│   ├── motion_system.json             # Durations, easings, semantic transitions per component
│   ├── strokes_and_radius_system.json # Stroke widths, border-radius scale (2px → infinite)
│   └── status_colors.json             # Status colors (approved, rejected, warning, etc.)
│
├── colors.css       # CSS variables generated from colors_system.json
├── typography.css   # CSS variables generated from typography_system.json
├── spacing.css      # CSS variables generated from spacing_system.json
├── grid.css         # CSS variables generated from grid_system.json
├── motion.css       # CSS variables generated from motion_system.json
├── borders.css      # CSS variables generated from strokes_and_radius_system.json
└── status.css       # CSS variables generated from status_colors.json
```

**Rule**: When adding or modifying any visual token, FIRST read the corresponding JSON in `source/`,
then update the CSS file to match. Never invent values — always derive from the JSON source.

**❌ INCORRECT - Hardcoded values**:

```tsx
// ❌ NEVER - Hardcoded colors or arbitrary values
<div className="bg-blue-500 text-white p-4 rounded-lg">
<div style={{ backgroundColor: '#4361EF' }}>
<div className="bg-[#0D0D0D]">
```

```css
/* ❌ NEVER - Hardcoded hex in component CSS files */
.primary-button {
  background: #ff3333;    /* ← PROHIBITED: invented color */
  border-radius: 50px;    /* ← PROHIBITED: magic number */
}
```

**✅ CORRECT - Using Vibe Coding CSS variables via Tailwind**:

```tsx
// ✅ Use semantic classes mapped from tokens
<div className="bg-primary text-primary-foreground rounded-md">

// ✅ Or use token CSS variables directly when needed
<div className="bg-[var(--surface-level-2-bg)] text-[var(--surface-level-2-contrast)]">

// ✅ Use the op-blue scale (registered in Tailwind @theme)
<div className="bg-op-blue-600 text-white">

// ✅ Status colors from tokens
<div className="text-[var(--status-approved-text)] bg-[var(--status-approved-bg)]">
```

**🗂️ Component-to-Token Mapping (MANDATORY)**:

When creating **any** component CSS (`src/styles/components/`), you MUST use the token variables
from `src/styles/tokens/*.css`. Here is the complete mapping for existing component tokens:

| Component | Token Variable | Source JSON Key |
|-----------|---------------|-----------------|
| **Primary Button bg** | `var(--btn-principal-light-medium)` | `components.button.principal.light_medium` (#4361EF) |
| **Primary Button gradient** | `var(--btn-principal-light)` → `var(--btn-principal-medium)` | light → medium |
| **Primary Button hover** | `var(--btn-principal-medium)` → `var(--btn-principal-dark)` | medium → dark |
| **Primary Button text** | `var(--btn-principal-text)` | `components.button.principal.text` (#FFFFFF) |
| **Disabled Button bg** | `var(--btn-disable-light)` → `var(--btn-disable-dark)` | `components.button.disable.*` |
| **Disabled Button text** | `var(--btn-disable-text)` | `components.button.disable.text` |
| **Secondary Action fill** | `var(--secondary-fill-default)` | `components.secondary_actions.fill.center_default` |
| **Secondary Action stroke** | `var(--secondary-stroke-default-light)` | `components.secondary_actions.stroke.default_light` |
| **Card bg** | `var(--card-bg)` | `components.card.background` (#0D0D0D) |
| **Card fg** | `var(--card-fg)` | `components.card.foreground` (#FFFFFF) |
| **Surface levels** | `var(--surface-level-{0-6}-bg)` | `semantic_colors.general_surfaces.level_*` |
| **Border radius** | `var(--radius-{2-32})`, `var(--radius-infinite)` | `borders.css` |
| **Motion/transitions** | `var(--transition-btn-press)`, `var(--transition-btn-hover-content)` | `motion.css` |

**Process when creating component styles**:
1. Read the JSON in `src/styles/tokens/source/` to find the correct tokens
2. Check `src/styles/tokens/*.css` for the exact CSS variable names
3. Use ONLY those variables — never invent hex values
4. If a needed token doesn't exist, ADD it to the CSS file (derived from JSON), don't hardcode

---

### 11. Remotion Components: Brand Tokens + Responsive Formats

❌ **NEVER**: Hardcode colors/fonts in Remotion components, ignore format responsiveness
✅ **ALWAYS**: Use Brand Tokens, support 3 video formats (16:9, 9:16, 1:1), type with Zod

**Remotion Component Pattern**:

```tsx
// domains/video/types.ts
import { z } from 'zod';

export const VideoFormatSchema = z.enum(['16:9', '9:16', '1:1']);
export type VideoFormat = z.infer<typeof VideoFormatSchema>;

export const RemotionComponentPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  format: VideoFormatSchema,
  theme: z.enum(['light', 'dark']),
});
export type RemotionComponentProps = z.infer<typeof RemotionComponentPropsSchema>;

// ✅ Remotion components use Brand Tokens (per-brand config), NOT Platform Tokens
// Brand Tokens override the design system defaults for each brand (Lidl, Coca-Cola, etc.)
// See COMPONENT-SYSTEM.md for BrandConfig interface
```

---

### 12. Business logic in custom hooks

❌ **NEVER**: Place business logic directly in components or duplicate logic across components
✅ **ALWAYS**: Extract business logic to custom hooks within the corresponding domain

**Correct example**:

```tsx
// domains/projects/hooks/use-project-stats.ts
// ✅ Business logic encapsulated in custom hook
'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';

export function useProjectStats(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'stats'],
    queryFn: async () => {
      // ✅ API call through centralized client
      const response = await apiClient.get(`/projects/${projectId}/stats`);
      return response.data;
    },
  });
}

// domains/projects/components/project-dashboard.tsx
'use client';
import { useProjectStats } from '../hooks/use-project-stats';

export function ProjectDashboard({ projectId }: { projectId: string }) {
  // ✅ Clean component: delegates logic to custom hook
  const { data: stats, isLoading, error } = useProjectStats(projectId);

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <StatsDisplay data={stats} />;
}
```

**Incorrect example**:

```tsx
// ❌ INCORRECT: Business logic mixed in component
'use client';
import { useEffect, useState } from 'react';

export function ProjectDashboard({ projectId }: { projectId: string }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ❌ Business logic directly in component
  useEffect(() => {
    fetch(`/api/projects/${projectId}/stats`)
      .then(res => res.json())
      .then(data => {
        // ❌ Complex calculations in component
        const processed = {
          total: data.videos.length,
          avgDuration:
            data.videos.reduce((acc, v) => acc + v.duration, 0) /
            data.videos.length
        };
        setStats(processed);
        setIsLoading(false);
      });
  }, [projectId]);

  return <div>{stats?.total}</div>;
}
```

---

## Verification Checklist for Agents

Before proceeding with any task, verify:

- [ ] I have read this entire document
- [ ] I understand all critical rules
- [ ] I will follow these rules in all code I plan or review
- [ ] I will flag violations of these rules if I find them
- [ ] If any rule is unclear, I will ask for clarification before proceeding

- [ ] New component? → Check if it should be RSC (default) or needs `"use client"`
- [ ] Data mutation? → Must use React Query mutation with centralized API client
- [ ] Async fetch? → Must be wrapped in `<Suspense>` or use React Query
- [ ] Exports? → Must be named exports (no default)
- [ ] Business logic? → Must be in `/domains/{domain}/` and extracted to custom hooks
- [ ] Names? → Verify conventions: `is/has/should`, `handle`, `kebab-case`
- [ ] State management? → Use correct tool: React Query (server), Zustand (UI), useState (local), React Hook Form (forms)
- [ ] Backend data? → Must use React Query for fetching/caching through centralized API client
- [ ] UI/Client state? → Atomic Zustand store in `/domains/{domain}/stores/`
- [ ] Complex form? → React Hook Form with zodResolver for validation
- [ ] Protected route? → Middleware + API interceptor + Client UI validation
- [ ] API calls? → Must go through `/lib/api/api-client.ts` with JWT
- [ ] Design tokens? → No hardcoded colors/fonts, use Vibe Coding tokens
- [ ] Remotion components? → Use Brand Tokens, support 3 formats, Zod validation
- [ ] Complex logic in component? → Extract to custom hook in `/domains/{domain}/hooks/`
