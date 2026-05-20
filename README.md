# Internship Task Manager

A full-stack internship assignment project with JWT authentication, role-based access control, task CRUD, Swagger documentation, and a simple React dashboard.

## Tech Stack

- Backend: Node.js, Express.js, Prisma ORM
- Database: PostgreSQL
- Auth: JWT, bcryptjs
- Validation: Zod
- API Docs: Swagger
- Frontend: React, Vite, Axios
- UI Feedback: react-hot-toast
- Ops: Docker-ready structure, request logging, rate limiting, security headers

## Features

- User registration and login
- Password hashing
- JWT-protected API routes
- Roles: `USER` and `ADMIN`
- Users manage only their own tasks
- Admins can view all tasks
- Task create, read, update, delete
- Pagination, search, and completed-status filtering
- Protected frontend dashboard
- Swagger API documentation
- Postman collection
- Docker-ready local development setup

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   ├── swagger/
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── styles/
│   ├── nginx/
│   ├── Dockerfile
│   └── .env.example
├── docs/
├── postman/
└── docker-compose.yml
```

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/internship_tasks?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/internship_tasks?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Run migrations and start the API:

```bash
npm run prisma:migrate -- --name init_auth_and_tasks
npm run dev
```

Backend URLs:

```text
API: http://localhost:5000/api/v1
Swagger: http://localhost:5000/api-docs
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Docker Setup

Create `backend/.env` first, then run:

```bash
docker compose up --build
```

After containers start, apply migrations:

```bash
docker compose exec backend npm run prisma:migrate -- --name init_auth_and_tasks
```

Docker URLs:

```text
Frontend: http://localhost:5173
Backend: http://localhost:5000/api/v1
Swagger: http://localhost:5000/api-docs
```

## API Overview

### Auth

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me
```

### Tasks

```http
GET /api/v1/tasks?page=1&limit=10&completed=false&search=assignment
POST /api/v1/tasks
GET /api/v1/tasks/:id
PATCH /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
GET /api/v1/tasks/admin/all
```

Use JWT auth:

```http
Authorization: Bearer <token>
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Task created successfully",
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

## Postman

Import this collection:

```text
postman/internship-task-api.postman_collection.json
```

Run `Register` or `Login` first. The collection stores the JWT token automatically for protected task requests.

## Architecture

The backend uses a modular layered structure:

- Routes compose middleware and map endpoints.
- Controllers handle request/response flow.
- Services contain business logic and Prisma access.
- Middleware handles auth, RBAC, validation, logging, rate limiting, and errors.

The frontend uses a small SPA structure:

- Axios API helpers isolate backend calls.
- Auth context manages JWT state.
- Protected routes guard dashboard access.
- Reusable components keep forms and task rows clean.

More detail is in:

```text
docs/ARCHITECTURE.md
```

## Scalability Notes

- Microservices: split auth, task management, and reporting when teams or deployment cadence grow.
- Redis caching: cache frequent task queries and store distributed rate-limit counters.
- Load balancing: run multiple stateless backend containers behind Nginx, ALB, or another load balancer.
- Horizontal scaling: keep JWT auth stateless and share only database/cache infrastructure.
- Database scaling: add indexes, read replicas, and query monitoring for admin reporting.
- Observability: centralize logs and metrics for API latency, error rate, and database performance.

## Commit Plan

```text
Initial backend setup with authentication system
Add role-based access and task CRUD APIs
Build React frontend with authentication and dashboard
Finalize project documentation and scalability improvements
```
