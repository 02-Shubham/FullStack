# Architecture Notes

## Backend

The backend follows a layered Express architecture:

- `routes`: HTTP route definitions and middleware composition
- `controllers`: request/response orchestration
- `services`: business logic and Prisma calls
- `validations`: Zod request schemas
- `middleware`: authentication, RBAC, validation, rate limiting, and errors
- `config`: environment, Prisma, and CORS configuration

Controllers stay thin. Services own the rules for task ownership, admin reads, pagination, and filtering.

## Frontend

The frontend is a Vite React single-page app:

- `api`: Axios client, request helpers, storage, and error parsing
- `context`: auth state and actions
- `routes`: protected route wrapper
- `pages`: login, register, and dashboard screens
- `components`: reusable UI blocks

JWT auth is stored in `sessionStorage` to avoid long-lived browser persistence for this assignment scope.

## Scalability

Practical next steps for a larger production system:

- Split authentication and task management into separate services when ownership or deployment cadence diverges.
- Add Redis for hot task lists, session revocation, and rate-limit storage across multiple backend instances.
- Put the API behind a load balancer and run multiple stateless Node.js containers horizontally.
- Move file logs to centralized observability such as Loki, Datadog, or CloudWatch.
- Use read replicas for high-volume admin reporting queries.
- Add background workers for emails, reminders, imports, and other slow jobs.
- Use CI checks for linting, tests, Prisma migrations, and Docker builds before merge.
