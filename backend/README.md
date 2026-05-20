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
http://localhost:5000/api
```

## Auth Endpoints

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Use the JWT returned by register/login as:

```http
Authorization: Bearer <token>
```

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
