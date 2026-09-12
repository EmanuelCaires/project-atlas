# Project Atlas Engineering Roadmap

This file is the agent-facing engineering roadmap.

The authoritative product roadmap remains:

docs/ROADMAP.md

Agents must use this file for implementation focus and docs/ROADMAP.md for product direction.

## Current Focus

Sprint 2.0 — Evidence Engine

Primary priorities:

1. Evidence Score
2. Evidence Timeline
3. Better Developer Passport
4. Shared Components

Do not pull unrelated future roadmap work into the current sprint unless explicitly requested.

## Priority 1 — Evidence Score

Goals:

- define transparent scoring dimensions
- explain every score contribution
- avoid popularity-based scoring
- prevent duplicate evidence inflation
- support verified and unverified evidence
- document weights and assumptions
- keep scoring understandable to users

Any scoring implementation should make it possible to answer:

- what contributed
- why it contributed
- how much it contributed
- how the user can improve

## Priority 2 — Evidence Timeline

Goals:

- represent evidence chronologically
- make recent professional activity visible
- preserve historical growth
- support multiple evidence types
- support verification metadata
- keep evidence presentation consistent

## Priority 3 — Developer Passport

Goals:

- surface strongest evidence clearly
- connect skills to supporting evidence
- display verification state
- make professional progress visible
- provide a clear next recommended action
- improve recruiter readability

## Priority 4 — Shared Components

Goals:

- reduce duplicated UI
- preserve design consistency
- improve maintainability
- keep components accessible
- standardize evidence presentation

## Near-Term Roadmap

### GitHub Integration

Planned capabilities:

- repository import
- language detection
- README analysis
- deployment links
- repository statistics
- verified repository evidence

### Public Passport

Planned capabilities:

- public profile URL
- SEO
- social sharing
- custom slug
- evidence-focused public presentation

### Recruiter Search

Planned capabilities:

- developer search
- skill search
- project search
- evidence search
- evidence-based filtering

### Evidence Score Maturity

Planned dimensions include:

- project quality
- skill strength
- recency
- diversity
- verification
- consistency

## AI Features

Future AI capabilities may include:

- career suggestions
- skill recommendations
- project improvement suggestions
- interview preparation
- CV support

AI must support evidence-based professional growth rather than replace human judgment.

## Future Platform Work

Long-term possibilities include:

- company verification
- certification verification
- public API
- browser extension
- mobile application
- desktop application
- Atlas AI Assistant
- internationalisation
- enterprise capabilities

## Engineering Constraints

Prefer:

- small focused changes
- explainable logic
- secure server-side verification
- reusable components
- explicit data flows
- documented scoring rules

Avoid:

- speculative features
- unrelated refactors
- hidden score logic
- unnecessary dependencies
- major framework upgrades without approval

## Standard Workflow

For significant work:

Inspect → Plan → Implement → Validate → Review diff → Summarize

Standard validation:

- npm run lint
- npm run build

Run focused tests when available.

## Multi-Agent Rule

Only one agent should actively modify the repository at a time.

Before switching agents, update AI_WORKLOG.md.

Incoming agents must read:

- AGENTS.md
- AI_WORKLOG.md
- ARCHITECTURE.md
- ROADMAP.md
