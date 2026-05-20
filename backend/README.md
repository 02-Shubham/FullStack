# Backend API

Express + Prisma REST API for authentication and task management.

## Run Locally

```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init_auth_and_tasks
npm run dev
```

API base URL:

```text
http://localhost:5000/api/v1
```

Swagger:

```text
http://localhost:5000/api-docs
```

## Notes

- `DATABASE_URL` is used by the app at runtime.
- `DIRECT_URL` is used by Prisma migrations.
- Supabase users can use the session pooler URL if direct database access is blocked.
- Request logging, rate limiting, CORS, compression, and security headers are enabled in `src/app.js`.
