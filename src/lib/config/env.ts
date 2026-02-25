// Small helper to centralize environment-variable access for the frontend.
// These helpers are safe to import in browser code as they only reference
// NEXT_PUBLIC_* variables, which are inlined at build time by Next.js.

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getPublicApiBaseUrl(): string {
  // Example: http://localhost:8000/api
  return getEnv("NEXT_PUBLIC_API_BASE_URL");
}

