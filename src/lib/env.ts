/**
 * Environment variable validation - runs at import time.
 * Import this in layout.tsx or middleware.ts to fail fast.
 */

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const recommendedServer = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_APP_URL',
] as const;

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\nSee .env.example for details.`
    );
  }

  // Only warn on server side
  if (typeof window === 'undefined') {
    for (const key of recommendedServer) {
      if (!process.env[key]) {
        warnings.push(key);
      }
    }

    if (warnings.length > 0) {
      console.warn(
        `[env] Missing recommended environment variables:\n${warnings.map((k) => `  - ${k}`).join('\n')}`
      );
    }
  }
}

/** Whether demo mode is explicitly enabled */
export function isDemoMode(): boolean {
  if (typeof window !== 'undefined') {
    // Client: check query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') return true;
  }
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
