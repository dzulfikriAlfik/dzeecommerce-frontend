'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/lib/constants';
import type { Role } from '@/lib/constants';
import { PageSpinner } from '@/components/ui/spinner';

interface ProtectedLayoutProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

/**
 * Wraps content that requires authentication.
 * Redirects to login if unauthenticated.
 * Optionally restricts by role (UX only — backend enforces real auth).
 */
export function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Access Denied
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
