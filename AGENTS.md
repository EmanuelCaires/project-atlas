<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Atlas Agent Rules

## Project purpose

Atlas is an evidence-based professional identity platform for technology professionals.

Core principle:

Evidence over claims.

Every feature should strengthen trust by helping users demonstrate capability through verifiable evidence such as projects, GitHub activity, deployments, certifications, education, employment, achievements, and professional contributions.

Before implementing a feature, ask:

"Does this increase trust through evidence?"

If the answer is no, reconsider the change.

## Current product priority

The current roadmap priority is Sprint 2.0: Evidence Engine.

Primary goals:

- Evidence Score
- Evidence Timeline
- Better Developer Passport
- Shared Components

Do not divert into unrelated future roadmap work unless explicitly requested.

## Technology stack

Primary stack:

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS
- npm

Use npm for dependency management because this repository uses package-lock.json.

Do not introduce pnpm, yarn, or bun unless explicitly requested.

## Next.js rule

The Next.js rule at the top of this file is authoritative.

Before changing Next.js APIs, routing, server/client behaviour, caching, forms, metadata, server actions, or framework conventions, read the relevant documentation in:

node_modules/next/dist/docs/

Do not rely only on model training knowledge.

## Supabase and security

Never expose:

- service-role keys
- database secrets
- private tokens
- private user data

Treat .env.local as sensitive.

Do not print secrets in logs, prompts, documentation, commits, or screenshots.

## Product principles

Follow the repository product principles:

- Evidence over claims
- Trust is earned
- Quality over quantity
- Explain every score
- One clear next step
- Encourage, never discourage
- Progress should be visible
- Simplicity wins
- Help people grow
- Create fair opportunities

Scores must be explainable.

Avoid opaque scoring logic that users cannot understand.

## Engineering workflow

Before modifying code:

1. Read AGENTS.md.
2. Read AI_WORKLOG.md.
3. Read ARCHITECTURE.md.
4. Read ROADMAP.md.
5. Inspect the relevant code and documentation.
6. Check git status.
7. Identify the smallest safe change.

For larger work:

Inspect → Plan → Implement → Validate → Review diff → Summarize

## Scope control

Prefer small, focused changes.

Do not:

- perform unrelated refactors
- redesign architecture without justification
- upgrade major dependencies unless explicitly asked
- change scoring semantics without documentation
- bypass verification rules
- weaken evidence quality checks for convenience

## Validation

Before declaring work complete, run the relevant checks:

```bash
npm run lint
npm run build

If a focused test suite exists for the area changed, run it as well.

If validation cannot be completed, state exactly why.

## Git safety

Do not:
- force-push
- reset --hard
- delete branches
- rewrite history
- commit unrelated changes
- commit secrets

Do not commit or push unless explicitly asked.

## Multi-agent workflow

Primary engineering: Codex + ECC
Fallback coding: OpenCode
Automation: Goose
Local lightweight work: Ollama

Only one agent should actively modify the repository at a time.

Before switching agents, update AI_WORKLOG.md with:
- current task
- completed work
- files changed
- validation run
- known issues
- next step
- agent used

Incoming agents must read AGENTS.md, AI_WORKLOG.md, ARCHITECTURE.md, and ROADMAP.md before modifying application code.

## Evidence scoring

Evidence scoring must be transparent.

Score-related implementations must explain:
- what contributed
- why it contributed
- how much it contributed
- how the user can improve

Avoid undocumented magic numbers.

## Code quality

Prefer readable, explicit, testable and maintainable code.

Avoid unnecessary abstraction and cleverness.
