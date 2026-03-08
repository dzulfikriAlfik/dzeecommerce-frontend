'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormValues } from '@/modules/auth/schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants';
import type { ApiErrorResponse } from '@/types/api';
import { sanitize } from '@/utils/format';

/**
 * Login form with Zod validation, loading/error states, and mobile-first layout.
 * Relies on httpOnly cookie auth — no tokens stored client-side.
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const result = loginSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: typeof errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof LoginFormValues;
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back!');
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      const message = sanitize(apiError?.message || 'Login failed. Please try again.');
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to your account to continue
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          error={errors.password}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
