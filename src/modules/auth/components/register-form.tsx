'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormValues } from '@/modules/auth/schemas/auth.schema';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants';
import type { ApiErrorResponse } from '@/types/api';
import { sanitize } from '@/utils/format';

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

/**
 * Registration form with Zod validation, loading/error states, and mobile-first layout.
 * On success the user is automatically logged in via httpOnly cookie.
 */
export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const result = registerSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: typeof errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof RegisterFormValues;
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
      await register(values);
      toast.success('Account created successfully!');
      router.push(ROUTES.HOME);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      const message = sanitize(apiError?.message || 'Registration failed. Please try again.');
      setServerError(message);

      // Map field-level errors from backend (e.g. duplicate email)
      if (apiError?.errors) {
        const fieldErrors: typeof errors = {};
        for (const [key, messages] of Object.entries(apiError.errors)) {
          if (key in initialValues && messages.length > 0) {
            fieldErrors[key as keyof RegisterFormValues] = sanitize(messages[0] ?? '');
          }
        }
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: keyof RegisterFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
    };
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Join Dzeecommerce and start shopping
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
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          disabled={isSubmitting}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          hint="At least 8 characters with uppercase, lowercase, and a number"
          disabled={isSubmitting}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.passwordConfirmation}
          onChange={handleChange('passwordConfirmation')}
          error={errors.passwordConfirmation}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          Create Account
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
