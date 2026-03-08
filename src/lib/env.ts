import { z } from 'zod';

/**
 * Public environment variables schema.
 * Only NEXT_PUBLIC_ prefixed variables are available in the browser.
 * Server-only secrets must NEVER use the NEXT_PUBLIC_ prefix.
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1, 'App name is required'),
  NEXT_PUBLIC_APP_URL: z.string().url('App URL must be a valid URL'),
  NEXT_PUBLIC_API_URL: z.string().url('API URL must be a valid URL'),
  NEXT_PUBLIC_WS_URL: z.string().min(1, 'WebSocket URL is required'),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const raw = {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  };

  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables. Check .env files.');
  }

  return parsed.data;
}

export const env = parseEnv();
