'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/services/api/auth.api';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';
import type { Role } from '@/lib/constants';

/**
 * Hook that exposes auth state and actions.
 * Wraps the Zustand auth store with API-bound methods.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading, hasRole } =
    useAuthStore();

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      try {
        setLoading(true);
        const me = await authApi.getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearUser();
      }
    }

    void fetchSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      setUser(response.user);
      return response;
    },
    [setUser],
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const response = await authApi.register(credentials);
      setUser(response.user);
      return response;
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    clearUser();
  }, [clearUser]);

  const checkRole = useCallback(
    (roles: Role | Role[]) => hasRole(roles),
    [hasRole],
  );

  return { user, isAuthenticated, isLoading, login, register, logout, hasRole: checkRole };
}
