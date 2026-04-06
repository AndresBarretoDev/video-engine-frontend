import { Suspense } from 'react';
import { LoginForm } from '@/domains/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
