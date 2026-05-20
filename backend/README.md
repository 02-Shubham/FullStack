# Internship Task API

Backend REST API built with Node.js, Express, PostgreSQL, Prisma, JWT, bcrypt, and Zod.

## Current Scope

Commit 1 includes:

- Express server setup
- PostgreSQL connection through Prisma
- User model with role support
- Register and login APIs
- Password hashing with bcrypt
- JWT generation and authentication middleware
- Zod request validation
- Centralized error handling
- Environment configuration

Commit 2 adds:

- Versioned API routes under `/api/v1`
- Task CRUD APIs
- Ownership checks for user tasks
- Admin-only route to view all tasks
- Pagination, completion filtering, and search
- Swagger API documentation
- Cleaner Prisma-aware error responses

## Requirements

- Node.js 18+
- PostgreSQL 14+
- npm

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `DATABASE_URL` and `JWT_SECRET` in `.env`.

For Supabase, keep `DATABASE_URL` for normal app queries and set `DIRECT_URL` for Prisma migrations. If your network cannot reach Supabase's direct database host, use Supabase's session pooler URL for `DIRECT_URL`.

Generate Prisma client and run the first migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init_auth
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000/api/v1
```

Swagger docs are available at:

```text
http://localhost:5000/api-docs
```

## Auth Endpoints

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me
```

Use the JWT returned by register/login as:

```http
Authorization: Bearer <token>
```

## Task Endpoints

All task endpoints require a bearer token.

```http
GET /api/v1/tasks?page=1&limit=10&completed=false&search=assignment
POST /api/v1/tasks
GET /api/v1/tasks/:id
PATCH /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
GET /api/v1/tasks/admin/all
```

Rules:

- Users can create, read, update, and delete only their own tasks.
- Admins can view all tasks through `/tasks/admin/all`.
- Admins can also read a specific task by id.
- Pagination defaults to `page=1` and `limit=10`.

## Response Format

Success:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```
