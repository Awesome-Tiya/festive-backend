# Festive — Backend

A RESTful backend for Festive, a cultural discovery platform where users can explore daily festivals, leave comments, upvote discussions, react with stickers in real time, and submit suggestions.

Built with NestJS, Prisma, PostgreSQL, and WebSockets.

Lightweight NestJS backend for the Festive app (Prisma + PostgreSQL).

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- WebSockets
- JWT Authentication
- Jest

## Features

- Daily festival articles
- Community comments
- Featured comment based on likes
- Comment upvotes
- Like system
- Real-time sticker reactions using WebSockets
- Anonymous JWT authentication
- Festival suggestions
- REST API built with NestJS


## Prerequisites

- Node.js 18+ (or the project's supported Node version)
- npm or pnpm
- PostgreSQL (or another datasource supported by Prisma)

## Quick start

1. Install dependencies

```
npm install
```

2. Create a `.env` file with at least these values:

- `DATABASE_URL` (your Postgres connection)
- `JWT_SECRET` (for auth tokens)

3. Generate Prisma client and apply migrations (dev)

```
npx prisma generate
npx prisma migrate dev
```

4. Run the app in development

```
npm run start:dev
```

The server defaults to Nest's usual port (3000) unless overridden by configuration.

## Testing

The backend includes automated unit tests using Jest.

Current results:

- 16 test suites
- 51 tests
- 82% statement coverage
- 81% line coverage

Commands:

npm run test
npm run test:cov

## Useful scripts

- `npm run start` — start production server (built code)
- `npm run start:dev` — start in watch/dev mode
- `npm run build` — build TypeScript output to `dist`
- `npm run test` — run unit tests
- `npm run test:e2e` — run e2e tests
- `npm run test:cov` — run tests with coverage
- `npm run lint` — run ESLint and auto-fix
- `npm run format` — format code with Prettier

## Database schema

Prisma schema is in `prisma/schema.prisma`. Use Prisma CLI for introspection, migrations, and client generation.


## Notes

- This project uses NestJS and Prisma. Adjust environment variables and database connection as needed for your environment.
- If you prefer `pnpm` or `yarn`, substitute the package manager for `npm` in the commands above.

## Project structure

Top-level layout (excluding some files and folders so that it's concise) for the backend:

```
festive-backend/
├─ package.json
├─ README.md
├─ tsconfig.json
├─ tsconfig.build.json
├─ nest-cli.json
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ app.controller.ts
│  ├─ app.service.ts
│  ├─ festivalsandcultures.json
│  ├─ models.ts
│  ├─ article/
│  │  ├─ article.controller.ts
│  │  ├─ article.module.ts
│  │  └─ article.service.ts
│  ├─ auth/
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  └─ auth.service.ts
│  ├─ comment/
│  ├─ like/
│  ├─ prisma/
│  ├─ sticker/
│  ├─ suggestion/
│  └─ upvote/
├─ test/
│  ├─ file/
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
```

This is a condensed view — expand sections under `src/` for full subfolders and DTOs.

