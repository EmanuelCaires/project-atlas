# Project Atlas Architecture

## Product Purpose

Project Atlas is an evidence-based professional identity platform for technology professionals.

The platform helps users prove capabilities through verifiable evidence rather than relying only on self-declared claims.

Core principle:

Evidence over claims.

## Primary Users

Atlas is designed primarily for technology professionals, including:

- Software developers
- Frontend developers
- Backend developers
- Full-stack developers
- Mobile developers
- DevOps engineers
- Cloud engineers
- Data professionals
- AI engineers
- Cybersecurity professionals

Secondary users include:

- Employers
- Recruiters
- Hiring managers
- Technical leads
- Startups
- Agencies

## Current Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS 4
- npm

The repository uses package-lock.json, so npm is the default package manager.

## Current Implemented Areas

According to the current project roadmap:

### Foundation

- Authentication
- Registration
- Profiles
- Developer Passport
- Developer Dashboard
- Employer Dashboard

### Projects

- Project CRUD
- Featured projects
- Screenshots
- Project status
- Project skills
- Project-to-skill relationships

### Skills

- Skill CRUD
- Shared SkillBadge component

### Design System

- Button
- Card
- Badge
- SkillBadge
- StatCard

## Current Engineering Priority

Sprint 2.0 — Evidence Engine

Primary goals:

- Evidence Score
- Evidence Timeline
- Better Developer Passport
- Shared Components

## Evidence Model

Atlas evidence can eventually include:

- Projects
- Skills
- GitHub activity
- Deployments
- Portfolio work
- Certifications
- Employment
- Education
- Recommendations
- Achievements
- Open-source contributions
- Technical articles
- Conference talks
- Community contributions

Evidence should be:

- attributable
- explainable
- verifiable where possible
- relevant
- resistant to manipulation
- connected to demonstrated capability

## Evidence Scoring Principles

Atlas Score must not become a popularity score.

Potential scoring dimensions include:

- evidence quality
- evidence diversity
- recency
- verified sources
- consistency

Any scoring implementation must remain explainable to the user.

Users should be able to understand:

- what contributed to their score
- why it contributed
- how much it contributed
- how they can improve it

## Verification Model

Evidence strength should increase when it can be verified from trusted sources.

Possible verification sources include:

- GitHub
- live deployments
- certifications
- employer verification
- education verification
- open-source activity
- technical assessments

Verification status should be explicit rather than implied.

## Next.js Architecture Rule

This repository uses Next.js 16.

Before changing framework-specific behavior, agents must read the relevant documentation from:

node_modules/next/dist/docs/

This applies especially to:

- routing
- layouts
- server components
- client components
- caching
- server actions
- metadata
- forms
- middleware/proxy behavior
- data fetching

The rule in AGENTS.md is authoritative.

## Supabase Architecture

Supabase is used for application data and authentication.

Security rules:

- Never expose service-role keys to the browser.
- Keep privileged operations server-side.
- Treat .env.local as sensitive.
- Do not log credentials.
- Do not commit secrets.
- Enforce authorization server-side where applicable.
- Do not rely only on hidden UI controls for access control.

## Engineering Principles

Prefer:

- small changes
- explicit code
- reusable components
- clear boundaries
- explainable business logic
- focused validation
- documented scoring behavior

Avoid:

- unnecessary abstraction
- speculative architecture
- unrelated refactors
- hidden scoring rules
- premature optimization

## Multi-Agent Architecture

Atlas development uses multiple AI agents with shared repository state.

### Primary Engineering

Codex + ECC

### Fallback Engineering

OpenCode

### Automation

Goose

### Local Lightweight Work

Ollama

Shared state is maintained through:

- AGENTS.md
- AI_WORKLOG.md
- ARCHITECTURE.md
- ROADMAP.md
- Git

Only one agent should actively modify the repository at a time.
