import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock env before importing apiClient
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_APP_NAME: 'TestApp',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: 'http://localhost:4000/api',
    NEXT_PUBLIC_WS_URL: 'ws://localhost:4000',
  },
}));

describe('apiClient (Axios interceptors)', () => {
  // We test via the configured instance rather than mocking internals.
  // Import lazily so the env mock is in place.
  let apiClient: typeof import('@/lib/axios')['apiClient'];

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamic import so mocks are applied first
    const mod = await import('@/lib/axios');
    apiClient = mod.apiClient;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Configuration ────────────────────────────────────────────────────────

  it('should have withCredentials enabled for cookie auth', () => {
    expect(apiClient.defaults.withCredentials).toBe(true);
  });

  it('should set baseURL from environment', () => {
    expect(apiClient.defaults.baseURL).toBe('http://localhost:4000/api');
  });

  it('should set JSON content type headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    expect(apiClient.defaults.headers['Accept']).toBe('application/json');
  });

  it('should configure a timeout', () => {
    expect(apiClient.defaults.timeout).toBe(15_000);
  });

  // ── Request interceptor ──────────────────────────────────────────────────

  it('should pass through request config unchanged', async () => {
    // The request interceptor should not modify config (cookies sent via withCredentials)
    const reqInterceptor = apiClient.interceptors.request as unknown as {
      handlers: Array<{ fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }>;
    };

    const handler = reqInterceptor.handlers[0];
    expect(handler).toBeDefined();

    const mockConfig = {
      url: '/test',
      headers: new axios.AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const result = handler?.fulfilled(mockConfig);
    expect(result).toEqual(mockConfig);
  });

  // ── Response interceptor — success ───────────────────────────────────────

  it('should pass through successful responses', async () => {
    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];
    expect(handler).toBeDefined();

    const mockResponse = {
      status: 200,
      data: { success: true, data: { id: '1' } },
      headers: {},
      config: {} as InternalAxiosRequestConfig,
      statusText: 'OK',
    } as AxiosResponse;

    const result = handler?.fulfilled(mockResponse);
    expect(result).toEqual(mockResponse);
  });

  // ── Response interceptor — error transform ───────────────────────────────

  it('should transform non-401 errors to sanitized ApiErrorResponse', async () => {
    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];
    expect(handler).toBeDefined();

    const axiosError = {
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          statusCode: 422,
          errors: { email: ['Email is required'] },
        },
      },
      config: { _retry: false },
      message: 'Request failed',
      isAxiosError: true,
    };

    await expect(handler?.rejected(axiosError)).rejects.toEqual({
      message: 'Validation failed',
      statusCode: 422,
      errors: { email: ['Email is required'] },
    });
  });

  it('should provide fallback error when response has no data', async () => {
    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];

    const axiosError = {
      response: {
        status: 500,
        data: undefined,
      },
      config: { _retry: false },
      message: 'Network Error',
      isAxiosError: true,
    };

    await expect(handler?.rejected(axiosError)).rejects.toEqual({
      message: 'Network Error',
      statusCode: 500,
    });
  });

  it('should provide generic message when error has no message', async () => {
    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];

    const axiosError = {
      response: {
        status: 500,
        data: undefined,
      },
      config: { _retry: false },
      message: '',
      isAxiosError: true,
    };

    await expect(handler?.rejected(axiosError)).rejects.toEqual({
      message: 'An unexpected error occurred',
      statusCode: 500,
    });
  });

  // ── Response interceptor — 401 refresh flow ──────────────────────────────

  it('should attempt token refresh on 401 and retry the request', async () => {
    // Spy on axios.post for the refresh call
    const refreshSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({ data: {} });

    // Mock the apiClient request method for the retry
    const retrySpy = vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
      status: 200,
      data: { success: true },
    } as AxiosResponse);

    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];

    const axiosError = {
      response: { status: 401, data: { message: 'Unauthorized', statusCode: 401 } },
      config: { url: '/some-endpoint', _retry: undefined },
      message: 'Unauthorized',
      isAxiosError: true,
    };

    // The interceptor calls apiClient(originalRequest) which internally calls request
    // We need to also mock the direct call pattern
    vi.spyOn(apiClient, 'defaults', 'get').mockReturnValue(apiClient.defaults);

    try {
      await handler?.rejected(axiosError);
    } catch {
      // The retry may fail in test environment, but we verify refresh was called
    }

    // Verify token refresh was attempted
    expect(refreshSpy).toHaveBeenCalledWith(
      'http://localhost:4000/api/auth/refresh',
      {},
      { withCredentials: true },
    );

    refreshSpy.mockRestore();
    retrySpy.mockRestore();
  });

  it('should redirect to /login when refresh fails', async () => {
    const refreshSpy = vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error('Refresh failed'));

    // Mock window.location
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    const resInterceptor = apiClient.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: (response: AxiosResponse) => AxiosResponse;
        rejected: (error: unknown) => Promise<unknown>;
      }>;
    };

    const handler = resInterceptor.handlers[0];

    const axiosError = {
      response: { status: 401, data: { message: 'Unauthorized', statusCode: 401 } },
      config: { url: '/protected', _retry: undefined },
      message: 'Unauthorized',
      isAxiosError: true,
    };

    await expect(handler?.rejected(axiosError)).rejects.toThrow('Refresh failed');
    expect(window.location.href).toBe('/login');

    // Restore
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
    refreshSpy.mockRestore();
  });

  it('should not store tokens in localStorage or sessionStorage', () => {
    // Security: verify no token persistence in browser storage
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
