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

## Better Passport v1 — 2026-09-13

Agent: Codex (implementation), read-only reviewer agent.

Current task: Sprint 2.0 Better Passport on `/developer`.

Completed:
- Made name and professional headline the page introduction, with graceful
  missing-detail fallbacks and explicitly self-reported bio and skills.
- Reused SkillBadge and ProjectCard; added a read-only project presentation
  with existing scores, score breakdowns, linked skills and repository state.
- Kept featured-first project ordering and moved work ahead of the timeline.
- Replaced duplicate hire-ready statistics with explained profile completion
  and one project-focused next action.
- Removed blanket verification/pending claims and the premature share control.
- Added scoped wrapping and small-screen spacing using existing Atlas styles.
- No scoring, query, schema, routing or dependency changes.

Files changed:
- `src/app/developer/page.tsx`
- `src/features/projects/components/ProjectCard.tsx`
- `src/app/globals.css`
- `AI_WORKLOG.md`

Validation:
- `npm run lint` passed.
- `npm run build` passed, including TypeScript and static page generation.
  Initial sandboxed attempt failed because Turbopack could not bind a local
  port; the approved rerun passed.
- Existing evidence timeline suite: all 3 tests passed (compiled with local
  TypeScript into `/tmp/atlas-passport-timeline-tests` and run with Node).
- Reviewed application diff and `git diff --check` passed.
- No new pure business logic was introduced, so no new tests were added.

Known limitations:
- Authenticated browser/visual and mobile testing was not performed.
- Skills retain the existing self-reported experience order; project cards
  expose their supporting skill links without inferring verified proficiency.
- Repository confirmation is stored state, not a fresh check or proof of authorship.
- Public sharing remains future work.

Recommended next improvement: a skill-to-project evidence summary with direct
links to supporting work, using stable skill IDs and transparent ordering.

Next step: User review. No commit or push performed.

Review: Read-only reviewer found no blocking issues; confirmed editable project
cards retain their actions, confirmation wording matches the repository check,
and completion explanation matches existing scoring. The referenced
`docs/CODEX-NAVIGATION-GUIDE.md` is absent from this checkout.

## Shared Components v1 — 2026-09-13

Agent: Codex (implementation), read-only reviewer agent.

Current task: Extract the repeated Developer Passport section shell on
`feature/shared-components` as a behavior-preserving refactor.

Completed:
- Added shared `PassportSection` with `kicker: string`, `heading: ReactNode`,
  optional `action: ReactNode`, and required `children: ReactNode`.
- Exported it through the existing UI barrel and migrated About, Profile links,
  Skills & experience, Project evidence, and Passport completion.
- Preserved section/header elements, h2 headings, CSS classes, copy, actions,
  content order, repository confirmation semantics and accessibility attributes.
- Scoring, completion logic, ProjectCard, timeline, data requests, routes and
  database schema remain unchanged.
- Read project guidance and the installed Next.js 16.2.10 Server and Client
  Components guide before implementation; no new client boundary is needed.

Files changed:
- `src/components/ui/PassportSection.tsx`
- `src/components/ui/index.ts`
- `src/app/developer/page.tsx`
- `AI_WORKLOG.md`

Validation:
- `npm run lint` passed.
- Existing evidence timeline suite: all 3 tests passed, compiled with local
  TypeScript into `/tmp/atlas-shared-timeline-tests` and executed with Node.
- Initial build was blocked by sandbox restrictions on Turbopack's local port
  binding; approved `npm run build` rerun passed, including TypeScript and
  static page generation.
- Application diff reviewed for accidental product/copy changes; none found.
- `git diff --check` passed.

Known limitation: Authenticated browser/visual testing was not performed.
No new tests were added for this presentation-only extraction.

Review: Read-only reviewer found no issues; confirmed equivalent DOM, copy,
actions, section order, evidence semantics and completion behavior.

Next step: User review. No commit or push performed.
