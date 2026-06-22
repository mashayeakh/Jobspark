# Jobspark — Project-specific Interview Questions

Generated: 2026-06-22

This document contains interview questions tailored to the Jobspark repository (frontend + backend). Each question includes expected answer points that reference the project's implementation and design choices.

---

## Architecture & System Design

1. Describe the high-level architecture of this project (jobspark-frontend + jobspark-server). What are the main components and how do they interact?

- Expected points: Next.js frontend, Express backend with modular `app/module/*` routers mounted at `/api/v2`, PostgreSQL via Prisma, Socket.IO for realtime, Better‑Auth for authentication, Stripe for payments, Cloudinary for media, cron jobs and seed scripts, CI/CD deployment targets (Vercel for frontend), separation of controllers/services/routes.

2. Why might the team choose Prisma + PostgreSQL here instead of an ORM like TypeORM or raw SQL? What trade-offs does Prisma bring?

- Expected points: Strong type-safety and generated client, easy migrations, modular schema files (project uses multiple prisma schema files), developer ergonomics, query safety; tradeoffs: learning curve, slightly larger generated client, limited raw SQL optimizations (but supports raw queries), migration complexity with large schemas.

3. The backend uses `app/module/*` with controllers/services/routes. Explain benefits of this modular routing approach and possible improvements.

- Expected points: Encapsulation per domain (auth, jobs, company) improves maintainability and testing, clear route mounting in `module/index.ts`. Improvements: central dependency injection, explicit interfaces for services, rate limiting per route, versioning of API endpoints, grouping admin vs public routes more strictly.

## Database Structure & Prisma Models

4. From the Prisma schemas (e.g., `User`, `Job`, `Company`), how is relationship modeling implemented and where are likely performance hotspots?

- Expected points: FK fields and explicit relations (companyId, recruiterId, categoryId), many-to-many via join models (JobSkill, CandidateSkill), indices declared (e.g., `@@index([status, type, locationType])` on Job). Hotspots: queries joining Job + Company + Skills, large text fields (description, responsibilities) affecting indexing, applicationCount/viewCount hot update counters leading to write contention.

5. The repo contains multiple segmented Prisma schema files (auth.prisma, jobs.prisma, etc.) plus `schema.prisma`. What are pros/cons of splitting schema vs single file?

- Expected points: Pros: modularity, easier ownership, incremental edits; Cons: potential ordering/merge issues, migration coordination complexity, risk of cross-file constraints causing confusion. Prisma supports prismaSchemaFolder preview used here.

6. How are user sessions modeled? Describe the `Session` model and implications for token refresh flows and session revocation.

- Expected points: `Session` has `token` (unique), `expiresAt`, `ipAddress`, `userAgent`, `userId` relation. Backend validates session existence when refreshing, updates `expiresAt` on renewal. Implications: easy server-side revocation by deleting session, requires DB read on refresh (consistent), storage grows so need cleanup cron job, session token uniqueness prevents reuse, careful to secure token storage.

7. Identify potential schema-level improvements to support scaling (indices, partial indexes, partitioning).

- Expected points: Add compound indices for common query patterns (companyId + status), use partial/partialIndexes (Prisma preview enabled) for frequently filtered values (e.g., OPEN jobs), consider partitioning large tables (applications, logs) by date, add materialized views for analytics, optimize JSON fields (socialLinks, fraudIssues) access patterns.

## API Design & Implementation

8. Describe the API routing pattern and how versioning and CORS are handled in `app.ts`.

- Expected points: Router mounted at `/api/v2` and modular routes under `/api/v2/companies`, `/jobs`, `/auth`, etc. CORS uses `allowedOrigins` set from env vars and trusts proxy; JSON middleware is applied after webhook raw route to support Stripe. Rate limiting applied via `generalApiLimiter` on `/api/v2`. Versioning currently via path prefix.

9. How does the project handle payment webhooks, and why is the raw body middleware used before JSON middleware?

- Expected points: Stripe webhooks require raw body to verify signature; `express.raw({type:"application/json"})` is used for `/webhook` before express.json(); ensures signature verification works. Also a `/payment/webhook` route exists. Comments mention raw middleware ordering.

10. The router mounts a lot of AI and admin routes under `/admin`. What security design considerations would you expect and test for these endpoints?

- Expected points: Role-based access control (only admins), rate limiting, input validation (Zod used in deps), strict auth checks, audit logging, throttling for expensive AI endpoints, quotas on model calls, sanitization to avoid prompt injection, secrets management for AI keys.

11. How are controllers, DTOs, and services structured? How does this affect testing and error handling?

- Expected points: Controllers map to routes and call service layer; DTOs validate input (zod or manual?), services contain business logic and access Prisma. This layering supports unit tests for services and integration tests for controllers. Error handling using `AppError` and central `errorHandler`.

## Authentication & Authorization

12. Explain the auth flow implemented in `auth.service.ts` including third-party `better-auth` usage, JWTs, and sessions. What are trade-offs of this hybrid approach?

- Expected points: Registration and login delegated to `better-auth` (`auth.api.signUpEmail`/`signInEmail`), backend creates short-lived access JWT and long-lived refresh JWT locally, sessions table stores a session token used to validate refresh requests; pros: offloads secure credential storage to provider, server can still manage sessions and revocation; cons: reliance on external provider availability, complexity of synchronizing status, potential duplication of tokens, extra latency and integration surface.

13. The service uses both JWTs and a `Session` DB table. Why might that be used, and how does it affect statelessness?

- Expected points: JWTs enable stateless access token validation; sessions provide server-controlled long-lived refresh and revocation; this makes refresh stateful. Benefits: ability to revoke sessions/track devices; drawback: refresh requires DB lookup and cleanup, not fully stateless.

14. Identify potential vulnerabilities in the token refresh flow shown (e.g., `getNewToken`). What mitigations would you propose?

- Expected points: Risks: missing replay protection for refresh tokens, long refresh lifetime, exposing sessionToken in insecure storage, insufficient rotation; mitigations: rotate refresh tokens on use, bind refresh token to session id, use httpOnly secure cookies for refresh/session, limit refresh scope, rate-limit refresh endpoint, log anomalies, enforce client fingerprinting.

15. Where and how would you implement role-based authorization checks for recruiter/admin-only endpoints (e.g., creating jobs, fraud-shield APIs)?

- Expected points: Middleware verifying `accessToken` JWT and checking `role` claim; central RBAC middleware with route-level decorators or route metadata; use service-level checks for critical operations; tests for privilege escalation; differentiate admin vs recruiter vs jobseeker.

## Key Features & Domain Logic

16. The `AuthService.registerUser` creates a `Company` and pipeline stages for recruiters. What real-world scenarios and edge cases should the team handle here?

- Expected points: Duplicate company names, company ownership verification, transaction management (create company + recruiter profile should be atomic), race conditions creating the same company, validation of company fields, email verification and company verification flows, notifying other systems non-blocking.

17. Jobs have fraud fields (fraudScore, fraudIssues). How would you design a fraud detection pipeline integrated with the existing models?

- Expected points: Asynchronous job for fraud scoring (cron or background queue), store results in `fraudScore`, store details in JSON `fraudIssues`, a review workflow (fraudFlaggedAt, fraudReviewedAt/by/reason), admin endpoints to re-evaluate, thresholds triggering auto-block, rate-limit submissions to avoid abuse.

18. How are saved jobs and applications modeled? What consistency problems can occur when counts (`applicationCount`, `viewCount`) are updated?

- Expected points: SavedJob join table with unique constraint; applicationCount/viewCount are denormalized counters — risk of race conditions on concurrent increments, eventual consistency vs strict counts, use DB transactions, optimistic locking, Redis counters with periodic sync, or Postgres `UPDATE ... SET count = count + 1` to avoid read-modify-write issues.

19. The project supports AI recommendation, resume analysis, and job description generation. What privacy and cost controls are important for these features?

- Expected points: PII minimization/sanitization, opt-in consent for send-to-AI, rate/quota to control costs, caching results, batching requests, robust error handling, audit logs of AI calls, redaction and model selection policies, retention policies for AI outputs.

## Scalability & Performance

20. If `/jobs` traffic grows 10x, which components would you scale first and why?

- Expected points: Database (read replicas for read-heavy queries), caching layer (Redis for hot job listings, view counts), stateless API horizontal scaling behind load balancer, implement pagination and index optimization, offload heavy AI tasks to async workers, use CDN for static assets, optimize queries to avoid N+1, add query-level caching for recommended jobs.

21. How would you handle realtime notifications (Socket.IO) when scaling across multiple server instances?

- Expected points: Use Socket.IO adapter with Redis (pub/sub) to share events, sticky sessions or token-based reconnection, broadcast via message broker, ensure idempotency and at-least-once vs exactly-once semantics understanding, monitor socket memory.

22. The codebase includes `express-rate-limit` and `rate-limit-redis`. Propose rate-limiting strategies for public vs authenticated endpoints.

- Expected points: Tight limits for unauthenticated endpoints (IP-based), higher limits per authenticated user (userId-based key), special higher thresholds for admin/paid accounts, burst token bucket patterns, separate limits for write vs read, per-route limits for expensive AI endpoints, use Redis cluster for global limits.

23. Suggest a plan to migrate the database to support very large tables (applications, logs), including minimal downtime.

- Expected points: Use logical partitioning (range by date), create new partitions and migrate in batches, use `pg_repack` or `pg_dump/restore` for large moves, shadow tables + dual-write pattern, apply feature flag and backfill, maintenance window for final cutover, use replicas for warm-up.

## API Security, Observability & Reliability

24. What observability (logging, metrics, tracing) would you add to diagnose production problems in this stack?

- Expected points: Structured logging (request id, user id), request/response tracing (OpenTelemetry), metrics (Prometheus/Grafana) for latency/error rates, alerting on 5xx/queue backlog, Sentry or error tracker for exceptions, DB slow query logging, socket connection metrics.

25. How should webhook endpoints be protected (e.g., `/webhook` for Stripe)? Include replay and signature checks.

- Expected points: Use raw body to verify signature using Stripe secret, check timestamp and tolerate small drift, enforce idempotency keys on processing to prevent duplicate events, store processed event ids, use TLS and IP allowlist if available, validate payload schema.

26. The repo contains many AI endpoints. How would you secure and monitor cost for these?

- Expected points: API keys per tenant with quotas, per-user rate limits, cost tracking, throttling, circuit breaker patterns, caching frequent prompts, expose usage dashboard, restrict model selection.

## Advanced / Design Trade-offs

27. The project uses third‑party Better‑Auth but creates local JWTs and sessions. Compare implementing full custom auth vs this hybrid approach, including operational and security trade-offs.

- Expected points: Custom auth gives full control but requires secure credential storage, password resets, 2FA, compliance; third‑party reduces maintenance/attack surface and accelerates development but increases dependency and cost. Hybrid allows fast onboarding + server-side session control, but adds integration complexity and possible sync issues.

28. Describe how you'd design a migration for splitting `Job.description` into a searchable `ts_vector` for full-text search while keeping Prisma compatibility.

- Expected points: Add new tsvector column via SQL migration, populate it (UPDATE), create GIN index, use Prisma’s `queryRaw` for search or a dedicated search microservice (Elasticsearch/Meili) for advanced ranking, keep fallback to text field, keep migration idempotent, ensure reindex job for backfill.

29. How would you build a robust resume parsing pipeline (resume analyzer) integrated with current architecture?

- Expected points: Upload resume to storage, queue job (Bull/Redis) to process with worker, parse using NLP library or external API, store parsed structured data in `JobSeekerProfile` and `CandidateSkill` models, validate and sanitize PII, provide retry/backoff, store raw output for debugging, rate-limit.

30. For the `fraudDetection` module, propose an architecture for continuous learning and model updates without disrupting production.

- Expected points: Online/periodic batch scoring with feature store, separate inference service, A/B test new models on a sample, shadow mode for new model, retrain offline with labeled reviews, CI for model deployment, rollback plan.

## Frontend & Integration

31. `CompanyDetailsClient.tsx` lives under Next.js app directory. How does the Next.js app and API interact? When to use server vs client components?

- Expected points: Next app uses server components for SSR/fetch on server, client components for interactivity (hooks, sockets). Use server components for data that can be fetched securely (server env), client for user interactions like saving jobs. Consider caching and incremental static regeneration if needed.

32. How would you secure API calls from the frontend to the backend (token storage, XSS/CSRF)?

- Expected points: Use `accessToken` in Authorization header for API, store refresh token/session token in `httpOnly`, `secure` cookie, avoid storing tokens in localStorage, use CSRF tokens where needed (stateful endpoints), CORS config as in `app.ts`.

33. The frontend uses `socket.io-client`. How would you implement reconnection and authentication flow for sockets?

- Expected points: Authenticate socket with JWT on connection handshake or use session token via cookie, implement auto-reconnect with exponential backoff, validate token on server, rejoin rooms on reconnect, handle stale tokens by requesting new access token or force logout.

## Edge Cases & Reliability

34. What happens if `better-auth` becomes unavailable? How should the system behave and what mitigations should be in place?

- Expected points: Graceful degradation: block new registrations but allow local session refresh if tokens still valid; queue critical ops, fallback sign-in via social providers if available, circuit breaker, retry with backoff, alerts, replicate critical data locally (e.g., user mapping) if permitted.

35. Describe strategies to safely run destructive Prisma migrations in production with minimal downtime.

- Expected points: Non-blocking migrations: create new columns first, backfill, switch reads/writes in code, remove old columns in later migration; use `pg` features for online schema changes, run migrations on replicas and promote, have migration rollback/backout plan, feature flags to toggle behavior.

36. The system sets `app.set("trust proxy", true)`. Explain implications for security and rate-limiting in cloud deployments.

- Expected points: `trust proxy` allows reading `X-Forwarded-For`; necessary behind proxies/load balancers. If misconfigured, client IP can be spoofed; ensure correct proxy chain length, set `trust proxy` to specific IPs or number of hops in production.

## Testing & Observability

37. How would you design an integration test for job creation which asserts DB state, email/notifications, and searchability?

- Expected points: Use test DB (Prisma test client), run API route with authenticated recruiter credentials (mock Better‑Auth or use test account), assert Job record exists, applicationCount default values, mock/stub email/notification service (or capture via test mailbox), index into search or assert search query returns job, cleanup data.

38. The repo has seed scripts. What are best practices for seeding and environment-specific data management?

- Expected points: Keep deterministic seeds for development, idempotent seeds (findOrCreate), avoid seeding sensitive/production data, separate test seeds vs dev seeds, use env flag to prevent accidental production runs, version seed scripts alongside migrations.

## Operations & Deployment

39. Propose a deployment strategy (CI/CD) for both frontend (Next) and backend (Express + Prisma) considering migrations and zero-downtime deploys.

- Expected points: CI runs tests and build, deploy backend to container/VM with rolling updates, run Prisma migrations in a controlled pipeline step with pre-migration checks and backups, run healthchecks before switching traffic, frontend deploy to Vercel/CDN, coordinate schema changes with feature flags, use blue/green or canary for major changes.

40. How would you back up and restore the database for this system? What retention and RTO/RPO targets would you recommend?

- Expected points: Regular pg backups (daily full + hourly WAL), test restores periodically, store backups in immutable storage (S3/Azure Blob), encryption at rest, retention based on compliance (e.g., 30/90 days), RTO/RPO depends on SLA (e.g., RTO < 1 hour, RPO < 15 minutes) — use replicas and PITR for low RPO.

---

If you want, I can:

- Export these questions to a single markdown file per role (frontend/backend/data/SRE).
- Generate interview rubrics / scoring guidance per seniority level.

_Generated from repository inspection on 2026-06-22._
