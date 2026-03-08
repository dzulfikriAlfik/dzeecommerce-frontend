'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true once mounted on the client.
 * Prevents hydration mismatches with browser-only APIs.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
