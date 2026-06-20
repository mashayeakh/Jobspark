# ⚡ JobSpark — Premium AI-Integrated Job & Talent Intelligence Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-blue?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-20.19-green?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-lightgrey?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-7.8-blueviolet?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Groq%20SDK-Llama--3.3-orange?style=for-the-badge&logo=openai&logoColor=white" alt="Groq SDK" />
</div>

---

**JobSpark** is a state-of-the-art, hyper-modern, AI-integrated talent acquisition and job matchmaking ecosystem. Engineered for high performance, it bridges the gap between ambitious job seekers and forward-thinking recruiters by embedding an extensive **15-Module AI Intelligence Suite** directly into a beautiful, high-fidelity responsive workspace.

🔗 **Production Live Site:** [jobspark-frontend.vercel.app](https://jobspark-frontend.vercel.app)
🚀 **Production API Host:** [jobspark-server.onrender.com](https://jobspark-server.onrender.com)

---

## 🔑 Recruiter & Admin Demo Credentials

To make evaluating the platform effortless, use the built-in credentials modal on the live login page or copy these credentials:

| Role                  | Email Address                   | Password      | Key Access                                                                                                           |
| :-------------------- | :------------------------------ | :------------ | :------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**       | `admin@jobspark.com`            | `admin123`    | Total platform health reports, user moderation, content sanity hub, fraud shield, active support session escalation. |
| **Premium Recruiter** | `imran.hossain@medicareplus.bd` | `Recruit@123` | Job post wizard, candidate tracking pipeline, smart interview scheduler, and applicant analysis panel.               |

---

## 🌐 Complete System Architecture

JobSpark is structured as a decoupled full-stack application leveraging serverless frontend edge-routing, a robust Node.js controller backend, and standard relational database mapping.

```mermaid
graph TD
    A[Vercel Serverless Frontend] -->|HTTPS Requests| B[Render Web Service Backend]
    B -->|Prisma Client| C[Supabase PostgreSQL Database]
    B -->|API Requests| D[Groq SDK - LLM Engine]
    B -->|Asset Storage| E[Cloudinary CDN]
    B -->|Transaction Emails| F[Brevo SMTP Service]
    A -->|Static Assets| G[Vercel CDN]
```

---

## 🎭 Role-Based Portals & Workflows

JobSpark delivers custom-tailored user workspaces styled with sleek, interactive glassmorphic dashboards:

### 1. 📊 Super Admin Dashboard

A robust operational command center giving platform operators a bird's-eye view of everything:

- **AI Platform Health Analyzer:** Dynamic scanning of server uptime, security, and rate-limits, falling back gracefully to static analytics if API ceilings are hit.
- **Content Sanity Hub:** Reviewing automated flagging of offensive or inappropriate job listings.
- **Fraud & Anomaly Shield:** Interactive panels monitoring transaction leaks and irregular user actions.
- **Active Support Agent Escalations:** Live chat and tickets escalated from AI support layers directly to humans.

### 2. 💼 Premium Recruiter Portal

A visual applicant tracking system designed to streamline recruitment:

- **Smart Job Creator:** Form wizard to post jobs with auto-suggested requirements and skill tags.
- **Hiring Pipeline:** Structured columns tracking applicants from "Shortlisted" to "Hired" with beautiful visual states.
- **Interview Scheduler:** Inline workflow management to set times, dates, and automatically notify candidates via Brevo SMTP.

### 3. 🎯 Advanced Job Seeker Interface

A personalized center helping job seekers find and win their dream jobs:

- **Smart Resume Analyzer:** Instant PDF parsing and matching analysis indicating how well their resume aligns with target job descriptions.
- **Smart Saved Jobs:** Interactive list featuring saved posts with automatic application progress trackers.
- **Dynamic Bio Generator:** Generates hyper-targeted professional summaries on demand.

---

## 🧠 The 15-Module AI Intelligence Suite (Deep Dive)

JobSpark embeds a massive AI and Natural Language Processing suite powered by the ultra-fast **Groq Llama-3.3 LLM Engine** and specialized NLP libraries (`Natural`, `Compromise`):

1. **`anomaly_detection`** — Monitores backend activities, flagging irregular request volumes or sudden activity spikes.
2. **`bio_generator`** — Craft target-ready professional summaries for job seekers based on their profile skillsets.
3. **`blog_generator`** — Automated blog creation system allowing platform administrators to generate relevant SEO-optimized industry news in one click.
4. **`churn_prediction`** — Machine-learning heuristics predicting which premium recruiters or job seekers might become inactive, suggesting proactive engagement pathways.
5. **`content_sanity`** — Automatically scans new job postings for offensive content, profanity, or discriminatory wording prior to publication.
6. **`fraud_detection`** — Advanced transaction checks preventing bot registrations and identifying suspicious posting patterns.
7. **`job_description`** — Rich-text generator that turns crude recruiter bullet points into compelling, SEO-friendly job listings.
8. **`market_intelligence`** — Real-time industry salary insights, high-demand skill lists, and hiring trend reports.
9. **`platform_settings`** — Self-optimizing settings recommending adjustments to caching, API limits, and background cron schedules.
10. **`potential_analysis`** — Evaluates a candidate's latent potential by scanning their progressive career history and extracurriculars rather than pure keywords.
11. **`profile_analytics`** — Gives job seekers a graphical view of their search performance, including profile views and application success scores.
12. **`recommendation`** — Contextual semantic search algorithm suggesting matching jobs to candidates and ideal candidates to recruiters.
13. **`resume_analysis`** — Cross-matches PDF content with a targeted job listing, providing a comprehensive matching score and list of missing keywords.
14. **`resume_analyzer`** — Broad structural review of resume quality (spelling, styling, and bullet-point impact metrics).
15. **`support_agent`** — An automated AI chatbot answering support queries, resolving system FAQs, and escalating high-priority tickets to active admins.

---

## 🛠 Premium Tech Stack

### Frontend Architecture

- **Framework:** Next.js 16.2 (utilizing Next.js App Router for dynamic rendering & edge-level optimizations).
- **Styling:** Vanilla CSS & PostCSS + TailwindCSS v4 utility layers for vibrant gradients and glassmorphism.
- **Interactions:** GreenSock (GSAP) & Lenis smooth scroll for rich micro-interactions and stunning visual flows.
- **Visuals:** Radix UI primitives, Recharts for responsive SVG metrics, and Sonner for interactive toast messaging.

### Backend Infrastructure

- **Engine:** Node.js (TypeScript compiled using high-performance `tsup` bundler).
- **Server:** Express.js 5.2 (utilizing custom middleware stacks, cookie parsers, and a unified `globalErrorHandler`).
- **Database & ORM:** PostgreSQL queried via Prisma ORM v7.8.
- **Authentication:** JWT sessions paired with Better Auth integrations for absolute token security.
- **Background Tasks:** `node-cron` orchestrators managing hourly automatic expiration checks for active jobs.

---

## ⚙️ Local Development Setup

To run the full stack locally:

### 1. Prerequisite Installations

Make sure you have Node.js (v20+ recommended) and Git installed on your system.

### 2. Clone the Repository

```bash
git clone https://github.com/mashayeakh/Jobspark.git
cd Jobspark
```

### 3. Setup and Run the Server (Backend)

```bash
cd jobspark-server
npm install
npm run dev
```

_The server will boot up locally at:_ `http://localhost:5000`

### 4. Setup and Run the Client (Frontend)

Open a new terminal window:

```bash
cd jobspark-frontend
npm install
npm run dev
```

_The web interface will boot up locally at:_ `http://localhost:3000`

---

## 📄 Environment Configuration Blueprint

Create a `.env` file in the root of each project using this structure:

### Backend Configuration (`jobspark-server/.env`)

```ini
PORT=5000
NODE_ENV=development

# Database Configuration (PostgreSQL/Supabase)
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Authentication Secrets
JWT_SECRET_KEY="your-jwt-secret-key-goes-here"
SESSION_SECRET_KEY="your-session-secret-key-goes-here"

# Frontend Integration
FRONTEND_URL="http://localhost:3000"
BETTER_AUTH_URL="http://localhost:3000"

# AI Groq SDK Key
GROQ_API_KEY="gsk_your_groq_api_key_goes_here"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Brevo SMTP Configuration
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT=587
SMTP_USER="your-brevo-registered-email"
SMTP_PASS="your-brevo-smtp-key"
```

### Frontend Configuration (`jobspark-frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v2"
```

---

## ⚡ Deployment & Build Commands

- **Production Builds:** Both projects are fully optimized for automatic deployments:
  - Backend: `npm run build` generates optimized, tree-shaken ESM builds in the `dist/` directory via `tsup`.
  - Frontend: `npm run build` outputs statically pre-rendered routes and dynamic serverless chunks via `next build`.
  - CI/CD Triggers: Merges or pushes directly to the `main` branch trigger Vercel (frontend) and Render (backend) pipelines immediately.

---

### 👨‍💻 Author & Maintainer

- **Developer:** Md Masayeakh Islam
- **GitHub Profile:** [@masayeakh](https://github.com/masayeakh)

---

_JobSpark is licensed under the MIT License. Built with ❤️ for premium talent matching._
