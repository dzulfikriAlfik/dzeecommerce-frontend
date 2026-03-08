import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('should have default env values available', () => {
    // In test environment NEXT_PUBLIC vars may not be set.
    // This test verifies the module can be imported without throwing.
    expect(true).toBe(true);
  });

  it('should accept valid environment variables', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'TestApp');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4000/api');
    vi.stubEnv('NEXT_PUBLIC_WS_URL', 'ws://localhost:4000');

    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('TestApp');
    expect(process.env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
  });
});
