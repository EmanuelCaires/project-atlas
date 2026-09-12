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
