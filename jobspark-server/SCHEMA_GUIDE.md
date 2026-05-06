# JobsPark Database Schema & Architecture Guide

## Overview
This guide outlines the production-ready database architecture for JobsPark, featuring 20 models across 8 modules. The design prioritizes type safety, performance, and scalability, with built-in support for AI-driven matching and analytics.

---

## Relationship Map

| Relationship Type | Tables Involved | Description |
| :--- | :--- | :--- |
| **User → JobSeekerProfile** | 1-to-1 (Optional) | Role-based extension via separate tables. |
| **User → RecruiterProfile** | 1-to-1 (Optional) | Same pattern for recruiter-specific data. |
| **RecruiterProfile → Company** | Many-to-1 | Multiple recruiters can belong to a single company. |
| **Job → Skills** | Many-to-many | Managed via `JobSkill` (includes a `required` flag). |
| **Candidate → Skills** | Many-to-many | Managed via `CandidateSkill` (includes `level` and `yearsExp`). |
| **JobSeeker → Job** | Many-to-many | Via `Application` (a rich join table tracking status). |
| **Job → MatchScore** | Many-to-many | Via `MatchScore` (AI-computed rankings). |
| **User → User** | Self-referential | Via `Connection` (tracking sender/receiver networking). |

---

## AI Integration Design

The schema is architected to support a **two-worker AI system**:

1.  **Match Worker**: Triggered on profile updates or new job postings. It upserts data into the `MatchScore` table, featuring a breakdown JSON column that stores per-dimension scores (skillMatch, expMatch, locationMatch, salaryMatch). The `modelVersion` field allows for A/B testing between different scoring algorithms.
2.  **Recommendation Worker**: Processes `MatchScore` rankings to populate the `RecommendationLog` for each user. It tracks `clicked` and `applied` booleans as a feedback loop for model retraining. Joining `recommendation_logs` with `applications` provides a direct metric for recommendation-to-hire conversion.

---

## Indexing Strategy

To ensure high performance under load, the following critical compound indexes are implemented:

*   **`MatchScore`**: `(profileId, score DESC)` — Optimized for fetching top jobs for a candidate.
*   **`MatchScore`**: `(jobId, score DESC)` — Optimized for fetching top candidates for a recruiter.
*   **`Notification`**: `(userId, isRead)` — Instant unread badge counts.
*   **`Job`**: `(status, jobType, locationType)` — High-speed filtered job searches.
*   **`Application`**: `(jobId, seekerId)` Unique — Strictly prevents duplicate applications for the same role.

---

## Production Improvements

Compared to standard MVP designs, this schema includes several enterprise-grade features:

*   **Soft Deletes**: Uses `deletedAt` on `User` and `Job` tables to preserve historical data and application records.
*   **ApplicationStatusLog**: An immutable audit trail documenting every status change for compliance and analytics.
*   **UserSession Table**: Fully compatible with **Better Auth** and standard JWT flows, supporting multi-device logout and session management.
*   **PlatformSnapshot**: A dedicated analytics table populated via daily cron jobs, ensuring dashboard queries never hit live transactional tables.
*   **Normalized Profiles**: `WorkExperience` and `Education` are moved to their own tables rather than being stored as JSON blobs.
*   **Denormalized Counters**: `applicationCount` and `viewCount` on the `Job` table are updated via background jobs to avoid expensive `COUNT` queries during job listing.
