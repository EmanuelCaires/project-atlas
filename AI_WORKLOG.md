# Atlas AI Worklog

Shared handoff state for Codex, OpenCode, Goose, Ollama, and other approved agents.

## Current Task

Set up the Project Atlas multi-agent development workflow.

## Completed

- Primary Atlas repository identified.
- Dedicated branch created: chore/multi-agent-workflow.
- Product vision and principles reviewed.
- Current roadmap reviewed.
- Existing Next.js agent rule preserved.
- Atlas-specific agent rules added.

## Current Product Priority

Sprint 2.0 — Evidence Engine

Focus:
- Evidence Score
- Evidence Timeline
- Better Developer Passport
- Shared Components

## Agent Roles

### Codex + ECC
Primary engineering agent.

Use for architecture, complex implementation, Evidence Engine work, debugging, security-sensitive changes and final review.

### OpenCode
Fallback cloud coding agent.

Use for scoped implementation, UI work, tests, controlled refactoring and secondary review.

### Goose
Reusable workflow and automation layer.

Use for audits, bug investigations, pre-commit reviews and handoffs.

### Ollama
Free local lightweight assistant.

Use for documentation, explanations, summaries and small code tasks.

Do not use the local 3B model for autonomous repository-wide engineering.

## Validation

Standard validation:
- npm run lint
- npm run build

Run focused tests when they exist.

## Handoff

Before switching agents record:

Agent:
Current task:
Completed:
Files changed:
Validation:
Known issues:
Next step:

## Known Issues

- DeepSeek fallback is configured but currently requires API balance.
- Local Ollama is intended for lightweight tasks only.

## Next Step

Create ARCHITECTURE.md and ROADMAP.md, then add Atlas-specific Goose recipes.

## Validation Update

Completed successfully:

- Goose recipes validated
- npm run lint
- npm run build

Build completed successfully with Next.js 16.2.10 and TypeScript checks passing.

## Current Status

Multi-agent workflow setup is ready for final review and commit.

## Next Step

Review the full diff, then commit the coordination layer on chore/multi-agent-workflow.

## Evidence Timeline v1 — 2026-09-13

Agent: Codex (implementation), read-only reviewer agent.

Current task: Sprint 2.0 Evidence Timeline on `/developer`.

Completed:
- Added `created_at` to project types, selection and mapping.
- Added a pure timeline service and evidence event types for project added,
  started, completed and GitHub repository confirmed events.
- Integrated a styled timeline and empty state using already-loaded projects.
- Changed the breakdown label to “Confirmed GitHub repository”; scoring unchanged.

Files changed:
- `src/features/projects/types.ts`
- `src/features/projects/services/projects.service.ts`
- `src/features/evidence/types.ts`
- `src/features/evidence/services/evidence-timeline.service.ts`
- `src/features/evidence/services/evidence-timeline.service.test.ts`
- `src/features/evidence/components/EvidenceTimeline.tsx`
- `src/features/evidence/components/EvidenceBreakdown.tsx`
- `src/app/developer/page.tsx`
- `src/app/globals.css`
- `AI_WORKLOG.md`

Validation:
- Three focused transformation tests passed (all event types, missing/invalid
  dates, cross-project ordering, unique IDs and input immutability).
- Test command: `./node_modules/.bin/tsc src/features/evidence/services/evidence-timeline.service.test.ts --outDir /tmp/atlas-timeline-tests --module commonjs --target es2019 --esModuleInterop --skipLibCheck && node /tmp/atlas-timeline-tests/evidence/services/evidence-timeline.service.test.js`
- `npm run lint` passed.
- `npm run build` passed, including TypeScript and static page generation.
  Initial sandboxed build was blocked by Turbopack's local port binding;
  the permitted rerun succeeded.
- `git diff --check` passed.

Known limitations: Browser visual/authenticated dashboard testing was not run.
The timeline derives current stored dates, so edits or deleted projects change
its contents; it is not a permanent audit history. Dates display in UTC.

Next step: User review. No commit or push performed.
