# Jobspark — Project-Specific Interview Questions

This file contains a structured set of interview questions (beginner → advanced) tailored to the Jobspark codebase, with expected answer points for each question. Use these to evaluate candidates' understanding of the architecture, database design, API design, authentication, scalability, security, and real-world trade-offs in this repository.

---

## Architecture & System Design

1. **Question:** Describe the high-level architecture of this project (jobspark-frontend + jobspark-server). What are the main components and how do they interact?

- **Expected answer points:** Next.js frontend (app dir, server/client components) talks to Express API under `/api/v2`; backend uses Prisma + PostgreSQL; Socket.IO for realtime; third-party services (Better-Auth, Stripe, Cloudinary, AI/ML); cron jobs, seed scripts; separation into `app/module/*` controllers/services/routes; typical deployment to Vercel (frontend) and Node host (backend).

2. **Question:** Why choose Prisma + PostgreSQL instead of TypeORM or raw SQL? Trade-offs?

- **Expected answer points:** Type-safety, generated client, developer ergonomics, migrations, modular schema files; trade-offs include learning curve, larger generated client, sometimes needing `queryRaw` for specialized SQL, and coupling to Prisma migration workflows.

3. **Question:** Explain benefits of the `app/module/*` modular routing approach and possible improvements.

- **Expected answer points:** Domain encapsulation, easier testing/ownership, clear route mounting; improvements: dependency injection, standardized service interfaces, per-route rate limits, API versioning and stricter admin/public separation.

---

## Database Structure & Prisma Models

4. **Question:** How are relationships modeled in Prisma (e.g., `User`, `Job`, `Company`)? Where are performance hotspots?

- **Expected answer points:** FK fields and explicit relations (companyId, recruiterId), many-to-many via join models (JobSkill, CandidateSkill), indices declared on common filters. Hotspots: joins between Job + Company + Skills, denormalized counters (viewCount/applicationCount) causing write contention, large text columns affecting indexes.

5. **Question:** Pros/cons of splitting Prisma schema across files (auth.prisma, jobs.prisma, etc.)?

- **Expected answer points:** Pros — modularity, ownership, easier diffs; Cons — ordering/migration coordination complexity, potential merge conflicts across multiple schema files.

6. **Question:** Describe the `Session` model and implications for token refresh and revocation.

- **Expected answer points:** `Session` stores `token`, `expiresAt`, `ipAddress`, `userAgent`, `userId`. Refresh flow checks DB session and updates expiry. Advantages: server-side revocation and device tracking; disadvantages: DB lookup on refresh, need for cleanup and session TTL management.

7. **Question:** Schema-level improvements to support scaling (indices, partial indexes, partitioning).

- **Expected answer points:** Add compound indices for frequent query patterns, use Prisma preview `partialIndexes` for filtered values (e.g., OPEN jobs), partition large tables (applications/logs) by date, materialized views for analytics, avoid indexing large `text` fields.

---

## API Design & Implementation

8. **Question:** Describe API routing and how versioning / CORS are handled in `app.ts`.

- **Expected answer points:** Router mounted under `/api/v2`; modular routes under that prefix; CORS uses `allowedOrigins` from env and development fallback; JSON middleware applied after webhook raw route; `generalApiLimiter` applied to `/api/v2`.

9. **Question:** How are payment webhooks handled and why use raw body middleware before JSON?

- **Expected answer points:** Stripe requires the raw request body to verify signatures. `express.raw({ type: 'application/json' })` is used for `/webhook` and `/payment/webhook` before `express.json()` to preserve raw payload for verification.

10. **Question:** Admin & AI routes are mounted under `/admin`. What security controls should protect them?

- **Expected answer points:** Role-based access control, strict authentication and authorization middleware, rate limits, input validation, audit logging, throttling of expensive AI endpoints, model key management, and sanitization.

11. **Question:** Controllers/DTOs/services structure — how does it affect testing and errors?

- **Expected answer points:** Controllers handle HTTP layer and call service functions; DTOs (Zod/types) restrict payloads; service layer holds business logic. This enables unit testing services and integration testing controllers; global `errorHandler` centralizes AppError handling.

---

## Authentication & Authorization

12. **Question:** Explain the auth flow in `auth.service.ts` using `better-auth`, JWTs, and sessions. Trade-offs of hybrid approach?

- **Expected answer points:** Sign-up/login delegated to `better-auth`; backend issues short-lived access JWT and long-lived refresh JWT; sessions stored in DB for refresh/revocation. Pros: offloads credential storage to provider + server-side control for sessions; cons: external dependency, complexity, potential sync issues.

13. **Question:** Why use both JWTs and `Session` DB table? Effect on statelessness?

- **Expected answer points:** JWTs enable stateless access validation; sessions enable server-controlled refresh and revocation — resulting in stateful refresh and the ability to revoke tokens but losing fully stateless semantics for refresh.

14. **Question:** Identify vulnerabilities in `getNewToken` refresh flow and mitigations.

- **Expected answer points:** Risks: refresh token replay, long-lived refreshs, insecure storage of sessionToken, insufficient rotation. Mitigations: rotate refresh tokens, bind refresh to session id, use httpOnly secure cookies for refresh/session, rate-limit refresh endpoint, log and detect anomalies.

15. **Question:** Where to implement RBAC for recruiter/admin-only endpoints?

- **Expected answer points:** Central middleware to validate accessToken and `role` claim; route-level metadata/guards; additional service-layer checks for critical operations; tests for privilege escalation.

---

## Key Features & Domain Logic

16. **Question:** In `registerUser`, recruiters trigger company + default pipeline creation. What edge cases to handle?

- **Expected answer points:** Duplicate companies, atomicity (create company + profile in a transaction), race conditions, validation of company fields, email verification, non-blocking notification failure handling.

17. **Question:** How would you design the fraud detection pipeline using the existing models?

- **Expected answer points:** Asynchronous scoring (cron or queue), store `fraudScore` and `fraudIssues` JSON, review workflow (fraudFlaggedAt/review fields), thresholds for auto-block, admin re-evaluation endpoints, idempotent scoring.

18. **Question:** Describe saved jobs and application counters. Consistency issues and fixes?

- **Expected answer points:** `SavedJob` join table has unique constraint. Counters (applicationCount/viewCount) are denormalized and prone to race conditions; solutions include DB `UPDATE ... SET c = c + 1`, transactions, Redis counters with periodic sync, or optimistic locking.

19. **Question:** AI features (recommendations/resume analysis) — privacy and cost controls?

- **Expected answer points:** PII minimization, opt-in consent, rate/quota limits, caching, batching, error handling, audit logs for AI calls, retention policy for AI outputs, and tenant-key management.

---

## Scalability & Performance

20. **Question:** If `/jobs` traffic increases 10x, which components to scale first and why?

- **Expected answer points:** Scale DB (read replicas) and caching (Redis) for hot listings; horizontally scale stateless API servers; offload AI tasks to async workers; optimize queries and add pagination and indexes.

21. **Question:** Realtime via Socket.IO — scaling across instances?

- **Expected answer points:** Use Socket.IO Redis adapter for pub/sub, ensure sticky session or token-based rejoin, handle event ordering/idempotency, use message broker for large fan‑out.

22. **Question:** Rate-limiting strategy for public vs authenticated endpoints?

- **Expected answer points:** Tighter IP-based limits for unauthenticated; userId-based higher limits for auth; special higher thresholds for paid accounts; separate limits for expensive AI endpoints; use Redis for a global enforcement store.

23. **Question:** Plan to migrate DB for very large tables with minimal downtime.

- **Expected answer points:** Partition by date, perform backfills incrementally, dual-write/shadow tables, use replicas and `pg_repack` for maintenance, feature-flag changes, schedule maintenance window for final cutover.

---

## Security, Observability & Reliability

24. **Question:** What observability would you add to debug production issues?

- **Expected answer points:** Structured logs (request id, user id), tracing (OpenTelemetry), metrics (Prometheus/Grafana), alerting on 5xx and queue backlog, Sentry for exceptions, DB slow query logs.

25. **Question:** How to protect webhook endpoints (Stripe) from replay and forgery?

- **Expected answer points:** Verify signature using raw body, check timestamp tolerance, store processed event IDs for idempotency, use TLS, optionally IP allowlist, and monitor webhook failures.

26. **Question:** AI endpoints cost control and security?

- **Expected answer points:** API keys with quotas, per-user rate limits, throttling/circuit breakers, request caching, usage dashboard, restrict model selection and tenant limits.

---

## Advanced / Design Trade-offs

27. **Question:** Compare full custom auth vs hybrid (Better‑Auth + local JWTs/sessions).

- **Expected answer points:** Custom auth gives control but needs secure storage, resets, 2FA; third-party reduces maintenance and security burden but introduces dependency; hybrid balances rapid iteration and server-side control but increases complexity.

28. **Question:** Design migration to support full-text search for `Job.description` (tsvector) while keeping Prisma compatibility.

- **Expected answer points:** Add tsvector column with SQL migration, populate and create GIN index, use `queryRaw` for search or external search service, keep fallback to text field and ensure idempotent migration.

29. **Question:** Build a robust resume parsing pipeline integrated with current architecture.

- **Expected answer points:** Upload/store resume, enqueue job (Redis/Bull), worker processes parse via NLP or external API, write structured data to `JobSeekerProfile`/`CandidateSkill`, sanitize PII, retries/backoff, store raw output for debugging.

30. **Question:** For `fraudDetection`, propose continuous learning with zero disruption.

- **Expected answer points:** Separate inference service, shadow testing for new models, A/B experiments, feature store, retrain offline with labeled reviews, drift detection, blue/green model deploys and rollback.

---

## Frontend & Integration

31. **Question:** `CompanyDetailsClient.tsx` is a Next.js client file. When to use server vs client components here?

- **Expected answer points:** Use server components for secure/fetchable data on server-side (SEO, initial render), client components for interactivity and sockets; minimize client bundle size and prefer server fetching for stable data.

32. **Question:** How to secure API calls from frontend (token storage, XSS/CSRF)?

- **Expected answer points:** Use `accessToken` in `Authorization` header, store `refresh`/session tokens in `httpOnly`, `secure` cookies, avoid localStorage for refresh tokens, enforce CORS, and use CSRF protection for stateful endpoints.

33. **Question:** Socket.IO reconnection & auth strategy for frontend?

- **Expected answer points:** Authenticate in handshake (JWT or session cookie), implement exponential backoff reconnection, rejoin rooms on reconnect, refresh tokens when needed, and force logout on invalid token.

---

## Edge Cases & Reliability

34. **Question:** If `better-auth` is unavailable, how should the system behave and mitigate?

- **Expected answer points:** Graceful degradation: prevent new signups while allowing existing valid sessions, circuit breaker with alerts, queue non-essential ops, fallback sign-in methods, clearly surface errors to users.

35. **Question:** Strategies to run destructive Prisma migrations in production with minimal downtime?

- **Expected answer points:** Non-blocking migrations: add columns first, backfill, switch code to use new columns, remove old columns later; use replicas, perform migration in small steps, have rollback/backout plan, feature flags.

36. **Question:** Explain `app.set('trust proxy', true)` implications for security and rate-limiting.

- **Expected answer points:** Enables reading `X-Forwarded-For` when behind a proxy; must ensure proxy chain/trusted proxies configured or risk spoofed client IPs; affects rate limiting and audit logs.

---

## Testing & Observability

37. **Question:** Design an integration test for job creation that asserts DB state, email/notifications, and searchability.

- **Expected answer points:** Use test DB (Prisma test client), mock or use test `better-auth` account, call controller endpoint with recruiter auth, assert `Job` exists with correct fields, assert notification/email via stubbed service, and check search/index if applicable.

38. **Question:** Best practices for seeding and environment-specific data management?

- **Expected answer points:** Idempotent seeds, separate dev/test seeds, prevent accidental production seeds (guard by env var), deterministic records for tests, keep sensitive data out of repo.

---

## Operations & Deployment

39. **Question:** Propose a CI/CD strategy for frontend (Next) and backend (Express + Prisma) with migrations and near-zero downtime.

- **Expected answer points:** CI builds and tests, controlled migration step with backups and prechecks, rolling/blue-green deployment for backend, Vercel/CDN for frontend, health checks, and feature flags for schema changes.

40. **Question:** Backup and restore strategy for the database. Suggested RTO/RPO?

- **Expected answer points:** Regular `pg` backups and WAL archiving for PITR, encrypted storage, periodic restore tests, retention per compliance (e.g., 30/90 days), RTO/RPO defined by SLA (example: RTO < 1 hour, RPO < 15 minutes using WAL shipping/replication).

---

### Usage

- These files can be used as interview guides, included in README for hiring, or split into role-specific rubrics on request.

_Generated from repository inspection on 2026-06-22._
