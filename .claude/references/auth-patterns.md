# Authentication & Authorization Patterns

**Full details**: Backend auth specifications (NestJS Passport.js + JWT)

---

## Overview

Authentication is handled by **NestJS backend** using **Passport.js + JWT**. The frontend:

1. Reads JWT from **httpOnly cookie** (secure, auto-sent by browser)
2. Uses **Next.js Middleware** to protect routes
3. Renders UI conditionally based on **roles** (Admin, Designer, Producer, QC, Client)
4. Never manually manages tokens (no localStorage)

---

## JWT Flow

### Step 1: Login → Get httpOnly Cookie

```
Frontend:  POST /auth/login { email, password }
                    ↓
Backend:   Validate credentials → Generate JWT → Set httpOnly cookie
                    ↓
Browser:   Stores cookie securely (not accessible to JavaScript)
```

### Step 2: Every Request → Cookie Auto-Included

```
Frontend:  GET /render-jobs
           (axios with withCredentials: true)
                    ↓
Browser:   Automatically includes httpOnly cookie
                    ↓
Backend:   Reads cookie → Validates JWT signature → Processes request
```

### Step 3: Logout → Clear Cookie

```
Frontend:  POST /auth/logout
                    ↓
Backend:   Remove JWT from httpOnly cookie
                    ↓
Browser:   Cookie deleted
```

---

## Next.js Middleware (Route Protection)

### Middleware Setup: `/src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret');

const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/render-jobs',
  '/settings',
  '/admin',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for token in cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT signature (lightweight validation on frontend)
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // Invalid token → redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon).*)'],
};
```

---

## Auth Context Hook

### Setup: `/src/lib/auth/auth-context.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export type UserRole = 'admin' | 'designer' | 'producer' | 'qc' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions: string[]; // Custom permissions based on role
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await apiClient<User>('/auth/me');
        setUser(currentUser);
      } catch {
        // Not authenticated or session expired
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Root Layout: `/src/app/layout.tsx`

```typescript
import { AuthProvider } from '@/lib/auth/auth-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

## Role-Based UI Rendering

### Component: Show/Hide by Role

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function AdminPanel() {
  const { user, hasRole } = useAuth();

  // Only render for admins
  if (!hasRole('admin')) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Access denied. Admin role required.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1>Admin Dashboard</h1>
      {/* Admin-only content */}
    </div>
  );
}
```

### Conditional Navigation

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { user, hasRole } = useAuth();

  return (
    <nav className="flex gap-4">
      <Button variant="ghost" asChild>
        <a href="/dashboard">Dashboard</a>
      </Button>

      {/* Only show for designers */}
      {hasRole('designer') && (
        <Button variant="ghost" asChild>
          <a href="/editor">Editor</a>
        </Button>
      )}

      {/* Only show for admins */}
      {hasRole('admin') && (
        <Button variant="ghost" asChild>
          <a href="/admin/users">Users</a>
        </Button>
      )}

      {/* Show for producers and above */}
      {(hasRole('producer') || hasRole('admin')) && (
        <Button variant="ghost" asChild>
          <a href="/render-jobs">Render Jobs</a>
        </Button>
      )}
    </nav>
  );
}
```

---

## Role Definitions

### Roles & Permissions Matrix

| Role | Description | Permissions |
|------|-------------|-------------|
| **admin** | System administrator | All permissions, user management, system config |
| **designer** | Video template designer | Create/edit templates, preview, export |
| **producer** | Content producer | Create projects, queue renders, manage assets |
| **qc** | Quality control | Review renders, approve/reject, feedback |
| **client** | External client/viewer | View own projects, download deliverables only |

### Permission Examples

```typescript
// Backend defines permissions per role
// Frontend uses these to show/hide UI

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users', // admin only
  CREATE_TEMPLATE: 'create_template', // designer, admin
  CREATE_PROJECT: 'create_project', // producer, designer, admin
  QUEUE_RENDER: 'queue_render', // producer, designer, admin
  REVIEW_RENDER: 'review_render', // qc, admin
  MANAGE_ASSETS: 'manage_assets', // designer, producer, admin
  VIEW_ANALYTICS: 'view_analytics', // admin
};

// Usage:
const { hasPermission } = useAuth();

if (hasPermission(PERMISSIONS.QUEUE_RENDER)) {
  // Show "Queue Render" button
}
```

---

## Protected Components

### Admin-Only Component

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Redirect } from '@/components/shared/redirect';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!hasRole('admin')) {
    return fallback || <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

// Usage
<AdminOnly fallback={<Alert>Admin access required</Alert>}>
  <AdminPanel />
</AdminOnly>
```

### Permission-Based Component

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';

export function RenderQueueButton() {
  const { hasPermission } = useAuth();
  const { mutate: queueRender } = useQueueRender();

  if (!hasPermission('queue_render')) {
    return null; // Don't render if no permission
  }

  return (
    <Button onClick={() => queueRender()}>
      Queue Render
    </Button>
  );
}
```

---

## Login & Logout Flow

### Login Form

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login endpoint sets httpOnly cookie automatically
      await apiClient('/auth/login', {
        method: 'POST',
        data: { email, password },
      });

      toast.success('Logged in successfully');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Logout

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <Button
      variant="outline"
      onClick={logout}
      disabled={isLoading}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
```

---

## Session Validation

### Check Auth Status

```typescript
'use client';

import { useAuth } from '@/lib/auth/auth-context';

export function SessionStatus() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      Logged in as {user?.email}
      <span className="ml-2 text-sm">({user?.role})</span>
    </div>
  );
}
```

---

## Security Checklist

- [ ] httpOnly cookie set by backend (not accessible via JavaScript)
- [ ] JWT verified in middleware on protected routes
- [ ] Roles checked before rendering sensitive UI
- [ ] Logout clears cookie and redirects
- [ ] No tokens stored in localStorage/sessionStorage
- [ ] API calls use `withCredentials: true` to send cookie
- [ ] Frontend validates JWT signature (lightweight check)
- [ ] Backend always re-validates JWT on API calls
- [ ] Sensitive operations check permissions (backend enforces)
- [ ] HTTPS only in production (secure cookie transmission)

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
JWT_SECRET=your-jwt-secret-key-for-verification

# Production
NEXT_PUBLIC_API_URL=https://api.opvideoengine.com/api
JWT_SECRET=<secure-random-key>
```
