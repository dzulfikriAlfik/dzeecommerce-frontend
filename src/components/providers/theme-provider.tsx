'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui.store';

/**
 * Theme provider that initializes dark mode from localStorage / system preference.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { setDarkMode } = useUIStore();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
    } else if (stored === 'light') {
      setDarkMode(false);
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, [setDarkMode]);

  return <>{children}</>;
}
