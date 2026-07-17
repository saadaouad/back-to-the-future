import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // optional local env file
  }
}

// Nest webpack bundles into dist/, so __dirname alone is unreliable — try common locations.
const envFiles = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'apps/api/.env'),
  resolve(__dirname, '.env'),
  resolve(__dirname, '../.env')
];

if (process.env.NODE_ENV === 'test' || process.env.APP_STAGE === 'test') {
  envFiles.unshift(
    resolve(process.cwd(), '.env.test'),
    resolve(process.cwd(), 'apps/api/.env.test'),
    resolve(__dirname, '.env.test'),
    resolve(__dirname, '../.env.test')
  );
}

for (const envPath of envFiles) {
  loadEnvFile(envPath);
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  PORT: Number(process.env.PORT ?? 3001),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173'
};

export function assertEnv() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Copy .env.example to .env and set your Neon URL.');
  }
}

export default env;
