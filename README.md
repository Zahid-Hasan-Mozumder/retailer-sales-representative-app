<h1 align="center">Retailer Sales Representative APP</h1>

An end-to-end NestJS API for managing retailers, sales representatives, regions, areas, territories, and distributors. It includes JWT authentication (access and refresh tokens), role-based authorization, Redis-backed caching, Prisma ORM with PostgreSQL, and a CSV generator/importer for bulk operations.

## Tech Stack

- NestJS 11 (REST API, Swagger docs)
- PostgreSQL + Prisma 7 (SQL adapter with `pg`)
- Redis (cache-manager with `cache-manager-redis-store`)
- TypeScript 5, ESLint, Jest

## Features

- Role-based auth for `admin` and `sales_representative`
- Access/Refresh token strategies with cache-backed session lookup
- CRUD endpoints for geography and distributor entities (admin-only)
- Retailer listing, detail, and updates with role-aware visibility
- CSV generator for synthetic retailer data and CSV import for bulk upserts
- Swagger UI at `/swagger` with bearer auth

## Architecture Overview

- Entry point: `src/main.ts` configures Swagger and global validation pipe with transform and whitelisting.
- Modular design under `src/api/*` for `auth`, `admin`, `retailer`, `region`, `area`, `territory`, `distributor`.
- Prisma client generated to `generated/prisma` and used via `src/prisma/prisma.service.ts`.
- Redis cache exposed via `src/cache/cache.service.ts` and configured in `src/cache/cache.module.ts`.

## Environment Variables

The app requires the following variables (validated on boot):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/retailer_db
JWT_ACCESS_TOKEN_SECRET=replace-with-strong-secret
JWT_REFRESH_TOKEN_SECRET=replace-with-strong-secret
REDIS_URL=redis://localhost:6379
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL (local or remote)
- Redis (local or remote)

## Local Setup

1. Install dependencies:
   
   ```bash
   npm install
   ```

2. Configure `.env` at the repo root using the variables above.

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Apply database migrations (development):

   ```bash
   npx prisma migrate dev --name init
   ```

   For production-like environments, use:

   ```bash
   npx prisma migrate deploy
   ```

5. Seed initial data (regions/areas/territories and sample accounts):

   ```bash
   npx prisma db seed
   ```

## Running the Server

- Development (watch):

  ```bash
  npm run start:dev
  ```

- Debug:

  ```bash
  npm run start:debug
  ```

- Production build and run:

  ```bash
  npm run build
  npm run start:prod
  ```

The API listens on `http://localhost:${PORT}` (defaults to `3000`).

## API Documentation

- Swagger UI: `http://localhost:3000/swagger`
- Bearer auth required for protected routes (use `Authorization: Bearer <accessToken>`).

## Authentication Flow

- Admin:
  - `POST /auth/admin/signup` → create first admin
  - `POST /auth/admin/signin` → returns `{ tokens: { accessToken, refreshToken } }`
  - `POST /auth/admin/refresh` → refreshes tokens using refresh JWT
  - `POST /auth/admin/logout` → invalidates session (cache)

- Sales Representative:
  - `POST /auth/sales-rep/signup`
  - `POST /auth/sales-rep/signin`
  - `POST /auth/sales-rep/refresh`
  - `POST /auth/sales-rep/logout`

## Core Entities (Admin-only CRUD)

- `region`, `area`, `territory`, `distributor`
- Each endpoint supports create/list/get/update/delete as documented in Swagger.

## Retailer Endpoints

- `GET /retailer` → paginated list, search and filters; role-aware visibility.
- `GET /retailer/:uid` → detail; sales reps see only assigned retailers.
- `PATCH /retailer/:uid` → update allowed fields; role-aware constraint.

## Bulk Operations

- CSV Generator (Admin):
  - `GET /csv/generate/retailers?count=1000000` → writes a CSV under `storage/csv/` and returns the path.

- CSV Import (Admin):
  - `POST /admin/import/retailers` (multipart/form-data; field `file`) → upsert retailers.

- Bulk Assign/Unassign (Admin):
  - `POST /admin/assign/retailers/bulk` → assign a list of retailer `uid`s to a sales rep.
  - `POST /admin/unassign/retailers/bulk` → remove assignments for a list of `uid`s.

## Caching

- Redis-backed cache with default TTL of 1 hour.
- Used by JWT strategies to resolve user data quickly.

## Development Tooling

- Lint:

  ```bash
  npm run lint
  ```

- Tests:

  ```bash
  npm run test
  npm run test:watch
  npm run test:cov
  ```

## Project Structure

```
src/
  api/
    auth/ admin/ retailer/ region/ area/ territory/ distributor/
  cache/ config/ csv/ password/ prisma/
  app.module.ts
  main.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
generated/prisma/
```

## Notes

- Ensure PostgreSQL and Redis are reachable from your machine using the values in `.env`.
- The Prisma client is generated to `generated/prisma` as configured in `prisma/schema.prisma`.
- Search is accelerated using GIN/trgm indexes on several text columns.

## Docker

- Requirements:
  - Docker Engine and Docker Compose plugin installed

- Build and start the stack:

  ```bash
  docker compose up -d --build
  ```

- Apply migrations automatically (handled by `api` service command).

- Seed the database:

  ```bash
  docker compose exec api npx prisma db seed
  ```

- View logs:

  ```bash
  docker compose logs -f api
  ```

- Stop and remove containers:

  ```bash
  docker compose down
  # also remove the Postgres volume
  docker compose down -v
  ```

- Override secrets and env:
  - Edit `docker-compose.yml` `environment` section for `api`
  - Or use a `.env` file (Compose automatically loads it)

- Database and cache access:
  - `psql`: `docker compose exec postgres psql -U postgres -d retailer_db`
  - Redis CLI: `docker compose exec redis redis-cli`