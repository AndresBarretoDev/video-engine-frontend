'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/lib/auth/auth-context';
import { loginSchema, type LoginInput } from '@/domains/auth/schema';
import { authTextMaps } from '@/domains/auth/text-maps';
import { EyePassword } from '@/components/atoms/eye-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') ?? '/';

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      await login(data);
      router.push(redirect);
    } catch {
      setServerError(authTextMaps.invalidCredentials);
    }
  }

  return (
    <Card className="border-border bg-card w-full max-w-[400px]">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-card-foreground text-2xl font-bold">
          {authTextMaps.loginTitle}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {authTextMaps.loginSubtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {authTextMaps.emailLabel}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={authTextMaps.emailPlaceholder}
                      autoComplete="email"
                      className="input-text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {authTextMaps.passwordLabel}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authTextMaps.passwordPlaceholder}
                        autoComplete="current-password"
                        className="input-text pr-10"
                        {...field}
                      />
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <EyePassword
                          isVisible={showPassword}
                          onToggle={() => setShowPassword(prev => !prev)}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-destructive text-sm" role="alert">
                {serverError}
              </p>
            )}

            <Button
              type="submit"
              variant="default"
              size="default"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  {authTextMaps.loggingIn}
                </>
              ) : (
                authTextMaps.loginButton
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
