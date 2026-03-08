import { create } from 'zustand';
import type { User } from '@/types/auth';
import type { Role } from '@/lib/constants';

/**
 * Auth store — lightweight client state for the current session.
 * Source of truth for auth is the httpOnly cookie managed by the backend.
 * This store mirrors user data from /auth/me for UI display only.
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (roles: Role | Role[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),

  hasRole: (roles) => {
    const { user } = get();
    if (!user) return false;
    const arr = Array.isArray(roles) ? roles : [roles];
    return arr.includes(user.role);
  },
}));
