import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const isTest = process.env.NODE_ENV === 'test' || process.env.APP_STAGE === 'test';

const envDirs = [
  process.cwd(),
  resolve(process.cwd(), 'apps/api'),
  __dirname,
  resolve(__dirname, '..')
];

function loadEnv(filePath: string) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (key in process.env) continue;

    process.env[key] = trimmed.slice(eq + 1).trim();
  }
}

for (const file of isTest ? ['.env.test', '.env'] : ['.env']) {
  for (const dir of envDirs) {
    loadEnv(resolve(dir, file));
  }
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
