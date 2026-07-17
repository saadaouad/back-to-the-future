# Back to the Future — DVD Cart Pricing

Production-minded monorepo for the Ekinox technical exercise: parse a multiline cart of film titles and compute the order total with Back to the Future promo rules.

## Stack

- **Monorepo**: Turborepo + npm workspaces
- **Web**: Vite, React, TypeScript, Tailwind CSS, TanStack Query
- **API**: NestJS, Drizzle ORM, PostgreSQL (Neon), TypeScript
- **Shared**: Zod schemas, Biome, Vitest

## Promo rules

| Rule | Detail |
|------|--------|
| Back to the Future DVD | 15 € each |
| 2 distinct saga titles | 10% off all BTTF DVDs in the cart |
| 3 distinct saga titles | 20% off all BTTF DVDs in the cart |
| Other films | 20 € each (no saga discount) |

Duplicates count toward quantity, not toward distinct titles.

## Setup

```bash
# Node.js 24+
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Set DATABASE_URL (Neon) and optional PORT / CORS_ORIGIN / VITE_API_URL

npm i
npm run db:push
npm run db:seed
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:3001  

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API + web |
| `npm run build` | Build all packages/apps |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run lint` | Biome check |
| `npm run format` | Biome format |
| `npm run db:push` | Push Drizzle schema to Postgres |
| `npm run db:seed` | Seed film catalog |

## Example

**Input**

```
Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre
```

**Output:** `56` — `((15 * 3) * 0.8) + 20`

## Workspace layout

```
apps/api                   NestJS + Drizzle (pricing in src/utils)
apps/web                   Vite + React
packages/schema-validation Shared Zod schemas / types
packages/biome-config      Shared Biome rules
packages/typescript-config Shared TS base config
```
